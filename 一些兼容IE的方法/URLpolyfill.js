/**
 * 
 * @param {*} str 
 * 方法比较单一 主要是为了方便获取 URI中的值，跟非IE的浏览器提供的方法差得远
 */

var URLpolyfill = function(str) {
  if (new URL(str)) {
    return new URL(str);
  }
  const output = {};
  var RegExpObj = {
    hash: /.+?(#.+$)/,
    host: /\w+:\/\/(\S+?)\//,
    hostname: "/\w+:\/\/([^/:]+)/",
    href: "http://localhost:8084/tag/getTags?agentId=1107",
    origin: " /(\w+:\/\/\S+?)\//",
    password: "",
    pathname: "/\w+:\/\/\S+?\/(.*)[\?.*]/",
    port: /\w+:\/\/[^/:]+:?(\d*)?/,
    protocol: /(\w+:)\/\//,
    search: /.+?(\?.+$)/,
    username: ""
  }
  var URLList = ['hash', 'host', 'hostname', 'origin', 'pathname', 'port', 'protocol', 'search']
  var RexExpHandle = function(patternReg) {
    var pattern = patternReg
    var arr = str.match(pattern);
    var outputstr = arr && arr[1] ? arr[1] : "";
    return outputstr
  }
  for (let i = 0, len = URLList.length; i < len; i++) {
    output[URLList[i]] = RexExpHandle(RegExpObj[URLList[i]])
  }
  RegExpObj['href'] = str
  return output;
};
export default URLpolyfill
