# yarn-merge [![npm version](https://badge.fury.io/js/yarn-merge.svg)](https://badge.fury.io/js/yarn-merge) [![Build Status](https://travis-ci.org/chinesedfan/yarn-merge.svg?branch=master)](https://travis-ci.org/chinesedfan/yarn-merge) [![Coverage Status](https://coveralls.io/repos/github/chinesedfan/yarn-merge/badge.svg?branch=master)](https://coveralls.io/github/chinesedfan/yarn-merge?branch=master) [![License](https://img.shields.io/github/license/chinesedfan/yarn-merge.svg)][license]

Suppose `pkg-a@1.0.0` was existed in `yarn.lock`, if you add another `pkg-b` which depends on `pkg-a@^1.0.0`, a new different version, `pkg-a@1.0.1`, may be introduced.

`yarn-merge` will help you list those packages and try to merge them into as less versions as possiable.

## License

[MIT][license]

[license]: https://github.com/chinesedfan/yarn-merge/blob/master/LICENSE
