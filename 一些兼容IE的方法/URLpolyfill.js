  var URL=URL||function(str){
    let output={};
    var RegExpObj={
      hash: /.+?(#.+$)/,
      host: /\w+:\/\/(\S+?)\//,
      hostname: "/\w+:\/\/([^/:]+)/",
      href: "http://localhost:8084/tag/getTags?agentId=1107",
      origin: " /(\w+:\/\/\S+?)\//",
      password: "",
      pathname: "/\w+:\/\/\S+?\/(.*)[\?.*]/",
      port: /\w+:\/\/[^/:]+:?(\d*)?/,
      protocol: /(\w+:)\/\//,
      search:  /.+?(\?.+$)/,
      username: ""
    }
    var URLList=['hash','host','hostname','origin','pathname','port','protocol','search']
    var RexExpHandle=function(patternReg){
      var pattern=patternReg
      var arr = str.match(pattern);
      var outputstr=arr&&arr[1]?arr[1]:"";
      return outputstr
    }
    for(let i=0,len=URLList.length;i<len;i++){
      output[URLList[i]]=RexExpHandle(RegExpObj[URLList[i]])
    }
    RegExpObj['href']=str
    return output; 
  }
