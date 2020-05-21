<template>
  <div class="ipt_wrap">
    <input v-model="hz" :placeholder="placeholder||''" type="text">
  </div>
</template>

<script>
/**
 * 内部接收数据
 * @param {sting} placeholder  input的placeholder提示
 * @param {Function} getpdata 需要在该组件上绑定一个getpdata事件获取输入汉字的拼音
 */
import convertToPinyin from "./piny"
export default {
  props:{
    placeholder:String
  },
  data(){
    return {
      py:"",
      hz:""
    }
  },
  watch:{
    "hz"(){
      this.convertUS()
    }
  },
  methods:{
    convertUS(){
      this.py=convertToPinyin(this.hz)
      this.$emit("getpdata",{"Pinyin":this.py,value:this.hz})
    }
  }
}
</script>

<style lang="scss" scoped>
  input{
    border:none;
    outline: none;
    background-color: rgba(0, 0, 0, 0)
  }
  .ipt_wrap{
    border: 1px solid #cecece;
    padding:0 10px;
    -webkit-appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 40px;
    line-height: 40px;
    input{
      width: 100%;
      height: 100%;
    }
  }
</style>