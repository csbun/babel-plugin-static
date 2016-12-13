const path = require('path');
const babel = require('babel-core');
const assert = require('assert');

const pluginPath = require.resolve('../');

// test data
const WEBPACK_ASSETS = 'webpack-assets.json';
const SOURCE_EXIST_FILE = 'files/exist.png';
const SOURCE_NOT_EXIST_FILE = 'files/not-exist.jpg';
const SOURCE_NOT_EXIST_EXT_FILE = 'files/not-exist-ext.unknow';
const SOURCE_NO_EXT_FILE = 'files/no-ext';

const SOURCE = `
const empty = require('');
const fileNoExt = require('./${SOURCE_NO_EXT_FILE}');
const fileNotExistExt = require('./${SOURCE_NOT_EXIST_EXT_FILE}');
const fileExist = require('./${SOURCE_EXIST_FILE}');
const fileNotExist = require('./${SOURCE_NOT_EXIST_FILE}');
`;

const ASSERT_DOMAIN = 'http://cdn.example.com';

// const ASSERT_URL = 'some/path/build.png';
const ASSERT_CODE = `
const empty = require('');
const fileNoExt = require('./${SOURCE_NO_EXT_FILE}');
const fileNotExistExt = require('./${SOURCE_NOT_EXIST_EXT_FILE}');
const fileExist = require('../../${WEBPACK_ASSETS}').assert['./test/fixtures/${SOURCE_EXIST_FILE}'];
const fileNotExist = require('../../${WEBPACK_ASSETS}').assert['./test/fixtures/${SOURCE_NOT_EXIST_FILE}'];
`;

const pluginOptions = {
  // base: __dirname,
  assetsMapFile: `./${WEBPACK_ASSETS}`,
  assetsKey: 'assert'
};

describe('babel-plugin-static', function() {

  it('should replace `require(file)` into url', function() {
    const res = babel.transform(SOURCE, {
      filename: path.join(__dirname, 'fixtures/simple.js'),
      babelrc: false,
      plugins: [
        [ pluginPath, pluginOptions ]
      ]
    });
    assert.equal(res.code.trim(), ASSERT_CODE.trim());
  });
});
