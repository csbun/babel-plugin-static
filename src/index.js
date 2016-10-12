const nodePath = require('path');
const url = require('url');
const BASE = process.cwd();

export default function({ types: t }) {

  return {
    visitor: {
      CallExpression(path, state) {
        const callee = path.node.callee;

        if (t.isIdentifier(callee, { name: 'require' })) {
          const arg = path.node.arguments[0];
          if (!arg|| !arg.value) {
            return
          }
          const base = state.opts.base || BASE;
          const dirname = nodePath.dirname(state.file.opts.filename);
          const staticFileDirName = nodePath.join(dirname, arg.value);
          let staticFileRelativePath = nodePath.relative(base, staticFileDirName);
          if (staticFileRelativePath.indexOf('.') !== 0) {
            staticFileRelativePath = '.' + nodePath.sep + staticFileRelativePath;
          }

          const staticFileMap = (state.opts.maps || '')[staticFileRelativePath];
          if (staticFileMap) {
            const staticFileURL = url.resolve(staticFileMap.domian, staticFileMap.url);
            path.replaceWithSourceString(`'${staticFileURL}'`);
          }
        }
      }
    }
  };
}
