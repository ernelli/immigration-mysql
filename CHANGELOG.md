# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

# 1.0.2 (2019-02-27)

### Features

	* Replaced CREATE IF NOT EXISTS with a query to the migration table, if it fails, runt the conditional create statement.
	It prevents deadlocks when multiple instances of applications runs db-migrate simultaneously.

<a name="1.0.1"></a>
## [1.0.1](https://github.com/joakimbeng/immigration-mysql/compare/v1.0.0...v1.0.1) (2017-03-03)


### Bug Fixes

* make the primary key index smaller to avoid index too large errors ([220e6b6](https://github.com/joakimbeng/immigration-mysql/commit/220e6b6))



<a name="1.0.0"></a>
# 1.0.0 (2017-01-16)


### Features

* first commit ([84c5ccb](https://github.com/joakimbeng/immigration-mysql/commit/84c5ccb))
