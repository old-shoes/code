<template>
  <div>
     <div class="show_wrap">
      <div class="btn_box btn_none" @click="closeFn">取消</div>
      <div class="showcheck">
        <p>当前选择:</p>
        <p>
          <span>
            <span v-if="checkitem['years']">{{checkitem["years"]}}</span>
            <span v-if="checkitem['years']&&checkitem['months']">/</span>
            <span v-if="checkitem['months']">{{checkitem["months"]}}</span>
            <span v-if="checkitem['days']&&checkitem['months']">/</span>
            <span v-if="checkitem['days']">{{checkitem["days"]}}</span>
          </span>
          <span class="lastspan"  v-if="checkitem['hours']||checkitem['minutes']">
            <span v-if="checkitem['hours']">{{checkitem["hours"]}}</span>
            <span v-if="checkitem['hours']&&checkitem['minutes']">:</span>
            <span v-if="checkitem['minutes']">{{checkitem["minutes"]}}</span>
          </span>
          <span class="lastspan"  v-if="checkitem['HalfDay']">
            <span>{{showlistname[checkitem["HalfDay"]]}}</span>
          </span>
        </p>
      </div>
      <div class="btn_box" @click="getdateFn">确定</div>
    </div>
    <div class="time_wrap">
      <div class="scroll_wrap" v-for="(date,index) in showlisttime" :key="index">
        <div class="shade_box pos_top"></div>
        <div class="shade_box pos_btm"></div>
        <div class="list_wrap" @scroll="scrollFn(date)" :ref="date">
          <p
            v-for="(item,inx) in timeinfo[date]"
            :class="checkitem[date]==item?'checkitemfn':''"
            :key="inx"
          >{{date!="HalfDay"?item:""}}{{!item?"":date!="HalfDay"?showlistname[date]:showlistname[item]}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //有效的value储存一下用以校验
      Effectivevalue:["years", "months", "days","hours", "minutes","HalfDay"],
      showdate:["years", "months", "days"],
      showtime:["hours", "minutes"],
      // change value
      /**
       * 时间信息展示
       * @param Object[Array]
       * years 默认从2000年开始到当前时间的后三十年展示
       * months 12个月份 days 天  当月的第几天
       * hours 24h    minutes 60分(可以设置0，30展示 或者 0，15，30，45)
       */
      timeinfo: {
        years: [],
        months: [],
        days: [],
        hours: [],
        minutes: []
      },
       /**
       * 要展示时间的选项
       * @param Array[String] 默认 年，月，日，时，分;
       * 主要，所有的数据根据这个来进行处理
       * showlisttime 获取于 timeinfo Object.keys()
       */
      showlisttime:["years", "months", "days","hours", "minutes"], 
      // 选中
      checkitem: {
        years: "",
        months: "",
        days: "",
        hours: "",
        minutes: "",
        HalfDay:""
      },

      checkiteminx: new Object(),
      // 判断  timeinfo 里边属性的值的数量不超过8个的放到这里
      shorttimekey: [],
      //滑动了就生成一个定时器
      timeoutlist: {
        years: null,
        months: null,
        days: null,
        hours: null,
        minutes: null,
        HalfDay:null
      },
       //展示 汉字。。
      showlistname: {
        years: "年",
        months: "月",
        days: "日",
        hours: "时",
        minutes: "分",
        am:"上午",
        pm:"下午"
      }
    };
  },
   props:[
    /**
     * 需要一个事件来进行获取数据
     * this.$emit("getdate")
     * 需要一个事件来进行隐藏
     * this.$emit("close")
     * 
     * @param String  type
     * 默认  all  在type为all的情况下 传递date给timeinfo 对应的 年，月，日，时，分 会回显
     * @param Array  type  
     * 数组情况下有五个有效值
     *  "years" 对应 "年",
     *  "months" 对应 "月",
     *  "days" 对应 "日",
     *  "hours" 对应 "时",
     *  "minutes" 对应 "分"
     * @param Object date
     * 有五个有效值
     *  "years" 对应 "年",
     *  "months" 对应 "月",
     *  "days" 对应 "日",
     *  "hours" 对应 "时",
     *  "minutes" 对应 "分"
     * @param Boolean HalfDay
     * true展示  半天隐藏 小时分钟
     * 默认 false
     */
    "type",
    "date",
    "HalfDay",
  ],
  created() {
    if(this.showflag!=null&&this.showflag!="undefined"&&this.showflag!=""){
      this.domflag=this.showflag
    }
    if(this.type){
      let handleObj={
        "[object String]":()=>{
        },
        "[object Array]":()=>{
          let nowtimeinfo= new Object()
          this.type.map(item=>{
            if(this.Effectivevalue.indexOf(item)==-1){
              throw "I don't know what"+" '"+ item + "' " + "is";
              return false;
            };
            nowtimeinfo[item]=this.timeinfo[item];
          });
          this.timeinfo = nowtimeinfo;
          
        },
      }
      let datatype = Object.prototype.toString.call(this.type);
      handleObj[datatype]();
    }
    if(this.HalfDay){
      this.initHalfDay()
      this.initdata()
    }else{
       //数据初始化
      this.initdata()
      this.inithours();
      this.initminutes();
    }
    this.initmonths();
    this.initchecktime();
    this.inityears(this.checkitem["years"]);
    this.initday(this.checkitem["years"], this.checkitem["months"]);
    this.inittimeinfo();
  },
  mounted() {
    this.inittimeDOM();
  },
  methods: {
    closeFn(){
      this.$emit("close");
    },
    getdateFn(){
      let aa ;
      let strdate ="",strtime="",datestring=""
      this.showlisttime.map(item=>{
        if(this.showdate.indexOf(item)!=-1){
          strdate=strdate+this.checkitem[item]+"/" 
        }
        if(this.showtime.indexOf(item)!=-1){
          strtime=strtime+this.checkitem[item]+":" 
        }
      })
      strdate=strdate.slice(0,strdate.length-1)
      strtime=strtime.slice(0,strtime.length-1)
      datestring=strdate+" "+strtime
      if (this.HalfDay) {
        let timeslot = {
          am: {
            end: "12:00",
            start: "09:30"
          },
          pm: {
            end: "18:00",
            start: "13:00"
          }
        };
        aa = new Object();
        aa["timeStr"] = datestring;
        aa["timeInterval"] = timeslot[this.checkitem["HalfDay"]];
      }else{
        aa=datestring
      }
      this.$emit("getdate",aa)
    },
    scrollFn(name, inx) {
      if (this.timeoutlist[name]) {
        clearTimeout(this.timeoutlist[name]);
      }
      let target = this.$refs[name][0],
        targetScrollTop = target.scrollTop,
        count = inx || parseInt(targetScrollTop / 40);
      // 吸顶效果
      let remainder = targetScrollTop % 40;
      if(this.checkitem[name] == this.timeinfo[name][count + 2]){
        this.timeoutlist[name] = setTimeout(() => {
          if (remainder > 20) {
            this.$refs[name][0].scrollTop = (count + 1) * 40;
          } else {
            this.$refs[name][0].scrollTop = count * 40;
          }
          this.checkitem[name] = this.timeinfo[name][count + 2];
          if (name == "months") {
            this.initday(this.checkitem["years"], this.checkitem["months"]);
            this.InitDOM("days");
          }
        }, 300);
        return false
      }
      if (this.shorttimekey.indexOf(name) == -1) {
        if (target.scrollHeight - target.clientHeight - target.scrollTop < 40) {
          this.timeinfo[name] = this.timeinfo[name].concat(
            this.timeinfo[name].splice(0, 5)
          );
          target.scrollTop = targetScrollTop - 5 * 40;
        }
        if (target.scrollTop < 40) {
          let TIK = this.timeinfo[name].length;
          let handleArr = this.timeinfo[name].splice(5, TIK);
          this.timeinfo[name] = handleArr.concat(this.timeinfo[name]);
          target.scrollTop = targetScrollTop + (TIK - 5) * 40;
        }
        targetScrollTop = target.scrollTop;
        count = parseInt(targetScrollTop / 40);
        remainder = targetScrollTop % 40;
        this.checkitem[name] = this.timeinfo[name][count + 2]; //此处+2是应为距离顶部的还差两格
      }
      this.timeoutlist[name] = setTimeout(() => {
        if (remainder > 20) {
          this.$refs[name][0].scrollTop = (count + 1) * 40;
        } else {
          this.$refs[name][0].scrollTop = count * 40;
        }
        this.checkitem[name] = this.timeinfo[name][count + 2];
        if (name == "months") {
          this.initday(this.checkitem["years"], this.checkitem["months"]);
          this.InitDOM("days");
        }
      }, 300);
    },
    // 数据展示处理
    initdata(){
      // 根据timeinfo  初始化其他的数据
      this.showlisttime=Object.keys(this.timeinfo);
    },
    //时间数据处理
    initchecktime() {
      // 时间显示初始化
      let date = new Date();
      let nowyear = date.getFullYear() + ""; // 年
      let nowmonth =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1 + ""; // 月
      let nowday =
        date.getDate() < 10 ? "0" + date.getDate() : date.getDate() + ""; // 日
      let nowhour =
        date.getHours() < 10 ? "0" + date.getHours() : date.getHours() + ""; //时
      let nowminute =
        date.getMinutes() < 10
          ? "0" + date.getMinutes()
          : date.getMinutes() + ""; //分
      let timeobj = {
        years: nowyear,
        months: nowmonth,
        days: nowday,
        hours: nowhour,
        minutes: nowminute
      };
      let aa = new Object()
      this.showlisttime.map(item=>{
        aa[item]=timeobj[item]
      })
      this.checkitem = this.HalfDay?aa:{...aa,...this.date};
    },
    //初始化DOM
    inittimeDOM() {
      this.showlisttime.map(item => {
        let len = this.timeinfo[item].length;
        if (len > 8) {
          this.InitDOM(item);
        }
      });
    },
    InitDOM(item) {
      let conlen = this.timeinfo[item].length;
      let targetinx = this.timeinfo[item].indexOf(this.checkitem[item]);
      if (targetinx == -1) {
        this.checkitem[item] = this.timeinfo[item][0];
        conlen = this.timeinfo[item].length;
        targetinx = this.timeinfo[item].indexOf(this.checkitem[item]);
      }
      // 8-5=3 3是边界
      if (conlen - targetinx < 3) {
        let handleArr = this.timeinfo[item].splice(0, 5);
        this.timeinfo[item] = this.timeinfo[item].concat(handleArr);
      } else if (targetinx < 3) {
        let handleArr = this.timeinfo[item].splice(targetinx + 5, conlen);
        this.timeinfo[item] = handleArr.concat(this.timeinfo[item]);
      }
      this.checkiteminx[item] = this.timeinfo[item].indexOf(
        this.checkitem[item]
      );
      this.$refs[item][0].scrollTop = (this.checkiteminx[item] - 2) * 40;
    },
    //初始化天数
    initday(nowyear, nowmonth) {
      this.timeinfo["days"] = [];
      let datecount = new Date(nowyear, nowmonth, 0).getDate();
      for (let i = 1; i < datecount + 1; i++) {
        let cc = i < 10 ? "0" + i : i;
        this.timeinfo["days"].push(cc + "");
      }
    },
    initHalfDay(){
      let aa=this.timeinfo
      aa["HalfDay"] = new Array();
      aa["HalfDay"].push( "am");
      aa["HalfDay"].push( "pm");
      delete aa["hours"]
      delete aa["minutes"]
      this.timeinfo=aa
    },
    inityears(nowyear) {
      // 年的数据初始化
      this.timeinfo["years"] = [];
      let yearscount = Number(nowyear) + 30 - 2000;
      for (let i = 1; i < yearscount; i++) {
        this.timeinfo["years"].push(2000 + i + "");
      }
    },
    inittimeinfo() {
      //判断  timeinfo 里边属性的值的数量不超过8个的进行处理  最少8个是应为展示5个 上1下1  7个的话无法滚动
      this.showlisttime.map(item => {
        let len = this.timeinfo[item].length;
        if (len < 8) {
          this.checkitem[item]=this.timeinfo[item][0]
          this.shorttimekey.push(item);
          this.timeinfo[item].unshift("");
          this.timeinfo[item].unshift("");
          this.timeinfo[item].push("");
          this.timeinfo[item].push("");
        }
      });
    },
    //inithours  initminutes  initmonths
    inithours() {
      this.timeinfo["hours"] = [];
      // timeinfo.hours
      for (let i = 0; i < 24; i++) {
        let cc = i < 10 ? "0" + i : i + "";
        this.timeinfo["hours"].push(cc);
      }
    },
    initminutes() {
      this.timeinfo["minutes"] = [];
      // timeinfo.minutes
      for (let i = 0; i < 60; i++) {
        let cc = i < 10 ? "0" + i : i + "";
        this.timeinfo["minutes"].push(cc);
      }
    },
    initmonths() {
      this.timeinfo["months"] = [];
      // timeinfo.months
      for (let i = 1; i < 13; i++) {
        let cc = i < 10 ? "0" + i : i + "";
        this.timeinfo["months"].push(cc);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.show_wrap{
  margin-bottom: 10px;
  display: flex;
  width: 100vw;
  justify-content: space-between;
  align-items: center;
  // padding-right:10%;
  padding:0 5%;
  .btn_box{
    text-align: center;
    padding: 7px 14px;
    width: 70px;
    background-color:#409EFF;
    color: white;
    font-size: 14px;
    border-radius: 5px;
  }
  .btn_none{
    background-color: #ECF5FF;
    color: #409EFF;
  }
}
.showcheck {
  display: flex;
  flex-wrap: wrap;
  color: #cdcdcd;
  text-align: center;
  p{
    width: 100%;
    text-align: center;
  }
  .lastspan{
    margin-left: 10px;
  }
}
.time_wrap {
  display: flex;
  width: 100vw;
  height: 200px;
  background-color: rgba(255, 255, 255, 1);
  .scroll_wrap {
    z-index: 2;
    flex: 1;
    height: 100%;
    position: relative;
    overflow-x: hidden; //隐藏滚动条
  }
  .list_wrap {
    background-color: rgba(255, 255, 255, 1);
    width: calc(100% + 25px);
    height: 100%;
    overflow-y: scroll;
    padding-right: 25px;
    box-sizing: content-box;
    -webkit-overflow-scrolling: touch;
    p {
      width:calc(100% - 25px);
      height: 40px;
      font-size: 14px;
      text-align: center;
      line-height: 40px;
    }
    .checkitemfn {
      color: green;
      font-size: 16px;
    }
  }
  .shade_box {
    overflow-y: scroll;
    width: 100%;
    height: calc(50% - 20px);
    position: absolute;
  }
  .pos_top {
    top: 0;
    left: 0;
    z-index: 1;
    text-align: center;
    border-bottom: 1px solid #cdcdcd;
    background-image: linear-gradient(
      rgba(255, 255, 255, 0.99),
      rgba(255, 255, 255, 0.4)
    );
  }
  .pos_btm {
    bottom: 0;
    left: 0;
    border-top: 1px solid #cdcdcd;
    background-image: linear-gradient(
      rgba(255, 255, 255, 0.4),
      rgba(255, 255, 255, 0.99)
    );
  }
}
</style>