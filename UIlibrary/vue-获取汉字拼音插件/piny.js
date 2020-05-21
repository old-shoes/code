import PinYin from "./pyunicode"
// 首字母大写
function firstCapital(str) {
  if (str.length > 0) {
    let first = str.substr(0, 1).toUpperCase();
    let spare = str.substr(1, str.length);
    return first + spare;
  }
  return str;
}
// 检索拼音
let pykey=Object.keys(PinYin)
function searchPinYin(str, obj) {
  for (let name in obj) {
    if (obj[name].indexOf(str) != -1) {
      return name;
    }
  }
  return false;
}
function convertToPinyin(sourceData) {
  // 源数据
  let sourceDataLen = sourceData.length;
  // 目标数据
  let targetData = '';
  // 匹配中文
  let chineseReg = new RegExp('[\u4e00-\u9fa5]');
  // 匹配数字和英文
  let enReg = new RegExp('[a-zA-Z0-9 ]');
  // 保留英文和数字，否则为false
  let keep = true;
  // 遍历源数据
  for (let i = 0; i < sourceDataLen; i++) {
    let str = sourceData.substr(i, 1);
    if (keep && enReg.test(str)) {
      targetData += str;
    } else if (chineseReg.test(str)) {
      let searchResult = searchPinYin(str, PinYin);
      searchResult !== false && (targetData += firstCapital(searchResult));
    }
  }
  // 空格 转 -
  targetData = targetData.replace(/ /g, '-')
  return targetData;
}
export default convertToPinyin