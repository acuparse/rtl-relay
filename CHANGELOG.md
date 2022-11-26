# Acuparse RTL Relay Server Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## Unreleased

## 1.1.0 - 2022-11-26

### Changed

- Syslog port changed to `10514` to avoid conflicts.
  - Update your rtl_433 config/compose files `command: -F syslog:relay:514` to `command: -F syslog:relay:10514`
- Filter readings based on `model`.

## 1.0.0 - 2022-09-11

### Added

- Initial release.
