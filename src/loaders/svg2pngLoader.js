
const path = require('path');
const svg2png = require('svg2png');
const { getOptions, interpolateName } = require('loader-utils');

module.exports = function (data) {
  const options = getOptions(this);
  // console.log(data, 'data================================');

  const context = options.context || this.rootContext;
  const name = options.name || '[contenthash].[ext]';
  // const buf = Buffer.from(data, 'utf8');
  const content = svg2png.sync(data);

  const url = interpolateName(this, name.replace('[ext]', 'png'), {
    context,
    content,
    regExp: options.regExp,
  });
  let outputPath = url;

  if (options.outputPath) {
    if (typeof options.outputPath === 'function') {
      outputPath = options.outputPath(url, this.resourcePath, context);
    } else {
      outputPath = path.posix.join(options.outputPath, url);
    }
  }

  let publicPath = `__webpack_public_path__ + ${JSON.stringify(outputPath)}`;

  if (options.publicPath) {
    if (typeof options.publicPath === 'function') {
      publicPath = options.publicPath(url, this.resourcePath, context);
    } else {
      publicPath = `${options.publicPath.endsWith('/')
        ? options.publicPath
        : `${options.publicPath}/`
        }${url}`;
    }

    publicPath = JSON.stringify(publicPath);
  }

  if (options.postTransformPublicPath) {
    publicPath = options.postTransformPublicPath(publicPath);
  }
  console.log(publicPath, '================================')
  options.esModule = false;
  // const buf = Buffer.from(content, 'utf8');
  // const outputBuffer = svg2png.sync(content);
  // console.log(options, context.length, publicPath);
  // return `__webpack_public_path__ + ${interpolateName(this, name.replace('[ext]', 'png'), { content: outputBuffer })}`;
  return publicPath;
};

// module.exports.raw = true;


// export default function loader(content) {
//   const options = getOptions(this);
//   console.log(data,'data================================');
//   

//   const context = options.context || this.rootContext;
//   const name = options.name || '[contenthash].[ext]';
//   // const buf = Buffer.from(data, 'utf8');
//   const content = svg2png.sync(data);

//   const url = interpolateName(this, name.replace('[ext]', 'png'), {
//     context,
//     content,
//     regExp: options.regExp,
//   });
//   let outputPath = url;

//   if (options.outputPath) {
//     if (typeof options.outputPath === 'function') {
//       outputPath = options.outputPath(url, this.resourcePath, context);
//     } else {
//       outputPath = path.posix.join(options.outputPath, url);
//     }
//   }

//   let publicPath = `__webpack_public_path__ + ${JSON.stringify(outputPath)}`;

//   if (options.publicPath) {
//     if (typeof options.publicPath === 'function') {
//       publicPath = options.publicPath(url, this.resourcePath, context);
//     } else {
//       publicPath = `${options.publicPath.endsWith('/')
//         ? options.publicPath
//         : `${options.publicPath}/`
//         }${url}`;
//     }

//     publicPath = JSON.stringify(publicPath);
//   }

//   if (options.postTransformPublicPath) {
//     publicPath = options.postTransformPublicPath(publicPath);
//   }

//   const esModule =
//     typeof options.esModule !== 'undefined' ? options.esModule : true;

//   return `${esModule ? 'export default' : 'module.exports ='} ${publicPath};`;
// }

// export const raw = true;