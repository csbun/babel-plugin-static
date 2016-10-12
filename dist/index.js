'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var t = _ref.types;


  return {
    visitor: {
      CallExpression: function CallExpression(path, state) {
        var callee = path.node.callee;

        if (t.isIdentifier(callee, { name: 'require' })) {
          var arg = path.node.arguments[0];
          if (!arg || !arg.value) {
            return;
          }
          var base = state.opts.base || BASE;
          var dirname = nodePath.dirname(state.file.opts.filename);
          var staticFileDirName = nodePath.join(dirname, arg.value);
          var staticFileRelativePath = nodePath.relative(base, staticFileDirName);
          if (staticFileRelativePath.indexOf('.') !== 0) {
            staticFileRelativePath = '.' + nodePath.sep + staticFileRelativePath;
          }

          var staticFileMap = (state.opts.maps || '')[staticFileRelativePath];
          if (staticFileMap) {
            var staticFileURL = url.resolve(staticFileMap.domian, staticFileMap.url);
            path.replaceWithSourceString('\'' + staticFileURL + '\'');
          }
        }
      }
    }
  };
};

var nodePath = require('path');
var url = require('url');
var BASE = process.cwd();