# babel-plugin-static

babel plugin to replace static file path.

[![Build Status](https://travis-ci.org/csbun/babel-plugin-static.svg?branch=master)](https://travis-ci.org/csbun/babel-plugin-static)
[![Coverage Status](https://coveralls.io/repos/github/csbun/babel-plugin-static/badge.svg?branch=master)](https://coveralls.io/github/csbun/babel-plugin-static?branch=master)

## Example

```javascript
/* .babelrc */
{
  "plugins": [
    [ "static", {
      "assetsMapFile": "./config/webpack-assets.json",
      "assetsKey": "assets"
    }]
  ]
}

```

```javascript
/* config/webpack-assets.json */
{
  "assets": {
    "./images/img.png": "http://cdn.example.com/path/to/img"
  }
}
```

```javascript
// src/main.js
const img = require('../images/img.png');
```

will build to:

```javascript
// dist/main.js (builded)
const img = require('../config/webpack-assets.json').assert['./images/img.png'];
```

## Install

```sh
npm i babel-plugin-static -D
```

## Usage

You can dump by using [webpack-isomorphic-tools](https://github.com/halt-hammerzeit/webpack-isomorphic-tools).
