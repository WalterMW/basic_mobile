"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loader;
exports.raw = void 0;

var _path = _interopRequireDefault(require("path"));

var _svg2png = _interopRequireDefault(require("svg2png"));

var _loaderUtils = require("loader-utils");

var _schemaUtils = require("schema-utils");

var _mimeTypes = _interopRequireDefault(require("mime-types"));

var _normalizeFallback = _interopRequireDefault(require("./utils/normalizeFallback"));

var _options = _interopRequireDefault(require("./options.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function shouldTransform(limit, size) {
  if (typeof limit === 'boolean') {
    return limit;
  }

  if (typeof limit === 'string') {
    return size <= parseInt(limit, 10);
  }

  if (typeof limit === 'number') {
    return size <= limit;
  }

  return true;
}

function getMimetype(mimetype, resourcePath) {
  if (typeof mimetype === 'boolean') {
    if (mimetype) {
      const resolvedMimeType = _mimeTypes.default.contentType(_path.default.extname(resourcePath));

      if (!resolvedMimeType) {
        return '';
      }

      return resolvedMimeType.replace(/;\s+charset/i, ';charset');
    }

    return '';
  }

  if (typeof mimetype === 'string') {
    return mimetype;
  }

  const resolvedMimeType = _mimeTypes.default.contentType(_path.default.extname(resourcePath));

  if (!resolvedMimeType) {
    return '';
  }

  return resolvedMimeType.replace(/;\s+charset/i, ';charset');
}

function getEncoding(encoding) {
  if (typeof encoding === 'boolean') {
    return encoding ? 'base64' : '';
  }

  if (typeof encoding === 'string') {
    return encoding;
  }

  return 'base64';
}

function getEncodedData(generator, mimetype, encoding, content, resourcePath) {
  if (generator) {
    return generator(content, mimetype, encoding, resourcePath);
  }

  return `data:${mimetype}${encoding ? `;${encoding}` : ''},${content.toString( // eslint-disable-next-line no-undefined
  encoding || undefined)}`;
}

function loader(content) {
  // Loader Options
  const options = (0, _loaderUtils.getOptions)(this) || {};
  (0, _schemaUtils.validate)(_options.default, options, {
    name: 'URL Loader',
    baseDataPath: 'options'
  }); // 无限制或在规定限度内

  if (shouldTransform(options.limit, content.length)) {
    const {
      resourcePath
    } = this;
    const mimetype = getMimetype(options.mimetype, resourcePath);
    const encoding = getEncoding(options.encoding);

    if (typeof content === 'string') {
      // eslint-disable-next-line no-param-reassign
      content = Buffer.from(content);
    } // if(svgToPngLimit){
    //   content = svg2png.sync(content);
    // }
    // console.log(
    //   options.generator,
    //   mimetype, '================================'
    // );


    const encodedData = getEncodedData(options.generator, mimetype, encoding, content, resourcePath);
    const esModule = typeof options.esModule !== 'undefined' ? options.esModule : true;
    return `${esModule ? 'export default' : 'module.exports ='} ${JSON.stringify(encodedData)}`;
  }

  let newoptions = null;

  if (options.limit < content.length && options.svgToPngLimit < content.length) {
    content = _svg2png.default.sync(content);
    newoptions = Object.assign({}, options, {
      mimetype: 'image/png',
      content,
      name: options.name && options.name.replace('[ext]', 'png') || '[contenthash].png'
    });
  } // Normalize the fallback.


  const {
    loader: fallbackLoader,
    options: fallbackOptions
  } = (0, _normalizeFallback.default)(options.fallback, newoptions || options); // Require the fallback.
  // eslint-disable-next-line global-require, import/no-dynamic-require

  const fallback = require(fallbackLoader); // Call the fallback, passing a copy of the loader context. The copy has the query replaced. This way, the fallback
  // loader receives the query which was intended for it instead of the query which was intended for url-loader.


  const fallbackLoaderContext = Object.assign({}, this, {
    query: fallbackOptions
  });
  return fallback.call(fallbackLoaderContext, content);
} // Loader Mode


const raw = true;
exports.raw = raw;