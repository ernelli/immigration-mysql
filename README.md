# immigration-mysql

[![Build status][travis-image]][travis-url] [![NPM version][npm-image]][npm-url] [![XO code style][codestyle-image]][codestyle-url]

> MySQL adapter for [Immigration](https://github.com/blakeembrey/node-immigration)

## Installation

Install `immigration-mysql` and it's peers: `immigration` using [npm](https://www.npmjs.com/):

```bash
npm install --save immigration immigration-mysql
```

## Usage

The adapter will automatically create the given `table` on first run (if it doesn't exist already).

```bash
immigration --use [ immigration-mysql --table migrations --config ./src/a-mysql-config-file ] up --new
```

## Options

| Name | Type | Description | Required |
|------|------|-------------|----------|
| table | `String` | The table name for migrations to be persisted (created automatically) | yes |
| config | `String` | A path to a module or json exporting/containing options (I.e. `require(options.config)`) | no |
| ...any | `Mixed` | Any [connection option](https://github.com/mysqljs/mysql#connection-options) that [mysql2](https://github.com/sidorares/node-mysql2) accepts | no |

## License

MIT © [Joakim Carlstein](http://joakim.beng.se)

[npm-url]: https://npmjs.org/package/immigration-mysql
[npm-image]: https://badge.fury.io/js/immigration-mysql.svg
[travis-url]: https://travis-ci.org/joakimbeng/immigration-mysql
[travis-image]: https://travis-ci.org/joakimbeng/immigration-mysql.svg?branch=master
[codestyle-url]: https://github.com/sindresorhus/xo
[codestyle-image]: https://img.shields.io/badge/code%20style-XO-5ed9c7.svg?style=flat
