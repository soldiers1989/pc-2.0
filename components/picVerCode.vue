<template>
  <div class="picCode_page">
      <div>
          <input type="text" v-model="captchaCode" placeholder="请输入验证码"/>
      </div>

      <div>
          <img :src="capData" alt="" @click="getCaptcha">
      </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {requestRegister, createCaptcha,  getRegisterSms} from "../api/personal";
    import {bus} from "../plugins/bus";

  export default {
    data () {
      return {
        captchaId: '',
        capData: '',
        captchaCode: ''
      }
    },
    methods: {
      getCaptcha () {
        let _this = this
        this.captchaId = new Date().getTime() + parseInt(Math.random() * 10000)
        createCaptcha({"captchaId": this.captchaId}).then((res) => {
          _this.capData = res.data
            bus.$emit('getcaptchaid', _this.captchaId)
        })
          bus.$emit('getcaptdata', _this.capData)
      },
      clearInput () {
        this.captchaCode = ""
        this.getCaptcha()
      }
    },
    mounted () {
      this.getCaptcha()
    },
    watch: {
      captchaCode (newVal, oldVal) {
        this.captchaCode = newVal
          bus.$emit('getcaptcode', this.captchaCode)
      }
    }
  }
</script>

<style lang="less">
    .picCode_page {
        width: 100%;
        input {
            height: 36px;
            border-radius: 5px;
            border: 1px solid #cccccc;
            text-indent: 18px;
            font-size: 14px;
        }
        div {
            display: flex;
            align-items: center;
            img {
                margin-left: 20px;
            }
        }
    }
</style>

