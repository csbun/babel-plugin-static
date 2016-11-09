const nodePath = require('path');
const { template, generator } = require('babel-core');
const REQUIRE = 'require';
const BASE = process.cwd();
const EXTS = [
  'png', 'jpeg', 'jpg', 'gif', 'ico', 'svg',
  'css', 'less', 'scss', 'sass', 'styl',
];

function getRelativePath(fromDir, toDir) {
  let relativeDir = nodePath.relative(fromDir, toDir);
  if (relativeDir.indexOf('.') !== 0) {
    relativeDir = '.' + nodePath.sep + relativeDir;
  }
  return relativeDir;
}

export default function({ types: t }) {

  return {
    visitor: {
      CallExpression(path, state) {
        const callee = path.node.callee;

        if (t.isIdentifier(callee, { name: REQUIRE })) {
          const originRequirePath = (path.node.arguments[0] || '').value;
          if (!originRequirePath || originRequirePath.indexOf('.') !== 0) {
            return;
          }
          if (EXTS.indexOf(originRequirePath.split('.').pop()) === -1) {
            return;
          }
          // 项目根目录
          const base = state.opts.base || BASE;
          // 当前处理的文件所在的目录
          const dirname = nodePath.dirname(state.file.opts.filename);
          // 被 require 的文件全路径
          const staticFileDirName = nodePath.join(dirname, originRequirePath);

          // 静态资源 Map 相对当前处理文件的全路径
          const assetsMapFileDirName = nodePath.join(base, state.opts.assetsMapFile);
          if (staticFileDirName === assetsMapFileDirName) {
            // 如果已经被修改成静态资源 Map 文件，则不处理了
            return;
          }

          // 被 require 的文件全相对项目根目录的路径 - 在静态资源表中的 key 值
          const staticFileRelativePath = getRelativePath(base, staticFileDirName);
          // 静态资源 Map 文件相对于当前文件的路径
          const assetsMapFileRelativePath = getRelativePath(dirname, assetsMapFileDirName);
          // require 使用 unix 的 `/` 而不是 windows 的 `\`
          const assetsMapFileUnixRelativePath = assetsMapFileRelativePath.replace(/\\/g, '/');

          /*
           * 用最简单的 replaceWithSourceString 替换这个 require
           * 但是官方文档说性能不好，不要用
           * https://github.com/thejameskyle/babel-handbook/blob/master/translations/en/plugin-handbook.md#replacing-a-node-with-a-source-string
           */
          const assetsKey = state.opts.assetsKey ? `.${state.opts.assetsKey}` : '';
          const source = `require('${assetsMapFileUnixRelativePath}')${assetsKey}['${staticFileRelativePath}']`;
          path.replaceWithSourceString(source);
          // console.log(source);


          /*
           * 尝试直接替换并加上 property，但是没搞定，文档太不全了
           * https://github.com/babel/babel/tree/master/packages/babel-types
           * 用 template 也需要找到到底 `.key` 的 babel-type 是什么
           * https://github.com/thejameskyle/babel-handbook/blob/master/translations/en/plugin-handbook.md#babel-template
           */
          // // 替换被 require 的文件为固定的 静态资源 Map 文件
          // path.node.arguments[0] = t.stringLiteral(assetsMapFileDirName);
          // // 在右侧添加对应的 key
          // (state.opts.assetsKey || '').split('.')
          //   .concat([staticFileRelativePath])
          //   .forEach(key => {
          //     path.insertAfter()
          //     // path.insertAfter(t.objectProperty(t.stringLiteral(key)));
          //   });
        }
      }
    }
  };
}
