'use strict';
const {resolve} = require('path');
const mysql = require('mysql2/promise');

const LOCK_ID = '***LOCK***';

const CHECK_TABLE = `
  SELECT COUNT(1) FROM ??;
`;



const TABLE_DEFINITION = `
	CREATE TABLE IF NOT EXISTS ?? (
		name varchar(255) not null primary key,
		status varchar(32),
		date datetime not null
	) Engine=InnoDB;
`;

exports.init = function (initOptions, dir) {
	let options = Object.assign({}, initOptions);
	const {config} = options;
	delete options.config;

	if (config) {
		try {
			Object.assign(options, require(resolve(dir, config))); // eslint-disable-line import/no-dynamic-require
		} catch (err) {
			err.message = `Unable to load configuration file.\n${err.message}`;
			throw err;
		}
	}

	const {table} = options;
	delete options.table;
	if (typeof table !== 'string') {
		throw new TypeError(`Expected "table" to exist in configuration options`);
	}

	const connectionPromise = mysql.createConnection(options);

  let prepare = () => connectionPromise
      .then(connection => connection.query(CHECK_TABLE, [table])
	    .then( () => {
	      prepare = () => Promise.resolve();
	    })
	    .catch( (e) => {
	      connection.query(TABLE_DEFINITION, [table])
		.then( () => {
		  prepare = () => Promise.resolve();
		});
	    })
	   );

	const getConnection = () => prepare().then(() => connectionPromise);

	const log = (name, status, date) => {
		return getConnection()
			.then(connection => connection.query(`
				INSERT INTO ?? (name, status, date)
				VALUES (?, ?, ?)
				ON DUPLICATE KEY
				UPDATE
					status = VALUES(status),
					date = VALUES(date);
			`, [table, name, status, date]));
	};

	const unlog = name => {
		return getConnection()
			.then(connection => connection.query('DELETE FROM ?? WHERE name = ?;', [table, name]));
	};

	const lock = () => {
		return getConnection()
			.then(connection => connection.query(`
				INSERT INTO ?? (name, date)
				VALUES (?, ?)
			`, [table, LOCK_ID, new Date()]))
			.catch(err => {
				if (/^Duplicate entry /.test(err.message)) {
					err.message = `Failed to acquire migration lock\nCaused by: ${err.message}`;
				}
				throw err;
			});
	};

	const unlock = () => {
		return unlog(LOCK_ID);
	};

	const isLocked = () => {
		return getConnection()
			.then(connection => connection.query('SELECT 1 AS exist FROM ?? WHERE name = ?;', [table, LOCK_ID]))
			.then(([rows]) => Boolean(rows[0].exist));
	};

	const executed = () => {
		return getConnection()
			.then(connection => connection.query('SELECT * FROM ?? WHERE name <> ?;', [table, LOCK_ID]))
			.then(([rows]) => rows);
	};

	return {log, unlog, lock, unlock, isLocked, executed};
};
