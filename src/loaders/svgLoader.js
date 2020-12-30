//  减少svg图片中的无效字段loader
module.exports = function (module) {
  // console.log(module);
  return module
    .replace(/data-name\=\"路径 [0-9]{0,}\"/ig, '')
    .replace(/data-name\=\"矩形 [0-9]{0,}\"/ig, '')
    .replace(/data-name\=\"组 [0-9]{0,}\"/ig, '')
    .replace(/data-name\=\"直线 [0-9]{0,}\"/ig, '')
    .replace(/data-name\=\"椭圆 [0-9]{0,}\"/ig, '');
}