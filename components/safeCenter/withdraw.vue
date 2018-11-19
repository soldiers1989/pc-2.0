<template>
    <div class="modify_login">
        <div>
            <label for="cellphone">注册手机号</label>
            <span id="cellphone">{{userInfo.cellphone}}</span>
        </div>
        <div>
            <label>图像验证码</label>
            <div>
                <pic></pic>
            </div>
        </div>

        <div>
            <label for="phoneCode">短信验证码</label>
            <div>
                <input type="text" v-model="formData.phoneCode" id="phoneCode" placeholder="请输入验证码">
                <sms :formData="codeData" :requestCallback="getsms"></sms>
            </div>
        </div>

        <div>
            <label for="phoneCode">新密码</label>
            <div>
                <input type="password" v-model="formData.password" placeholder="请输入密码">
            </div>
        </div>

        <div>
            <label for="phoneCode">重复新密码</label>
            <div>
                <input type="password" v-model="password" placeholder="请再次输入密码">
            </div>
        </div>

        <div class="submit_button">
            <button @click="updatePwd">提交</button>
        </div>
    </div>
</template>

<script>
    import pic from '~/components/picVerCode.vue'
    import sms from '~/components/getVerCode.vue'
    import {successMsg, errorMsg} from "../../plugins/methods";
    import {getItem} from "../../plugins/methods";
    import {getSms, getBackWithdrawPassword} from "../../api/personal";
    import {bus} from "../../plugins/bus";
    const JSEncrypt = require('node-jsencrypt');
    const crypt = new JSEncrypt();
    let public_key = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC8yY4yneut770arIb+hhuwPbV4
qP75ZtfSZmEMK64pldpcGeCbp4uFaOqwXMy7cszsYnD9YnMJLN82zt2ttOU9APcC
HWS1Qi72AkxnyROTIICYU0oi+I+5elogPgkOxKyi2bWb6pR9IkDR3EYmYear0biw
D0DJ3ztdzWa+W1IbOQIDAQAB`;
    crypt.setKey(public_key);
    export default {
        name: "withdraw",
        components: {
            pic, sms
        },
        data () {
            return {
                formData: {
                    phoneCode: "",
                    password: ""
                },
                password: "",
                userInfo: {},
                codeData: {
                    captchaCode: "",
                    captchaId: ""
                },
                getsms: getSms
            }
        },
        methods: {
            getInfo(){
                this.userInfo = getItem("userInfo")
            },
            updatePwd(){
                let _this = this
                if(_this.formData.password != _this.password){
                    errorMsg("两次密码不一致")
                    return false
                }
                if(_this.formData.phoneCode == ""){
                    errorMsg("手机验证码不能为空")
                    return false
                }
                if(_this.formData.password == ""){
                    errorMsg("新密码不能为空！")
                    return false
                }
                getBackWithdrawPassword({phoneCode: _this.formData.phoneCode, withdraw_pw:crypt.encrypt(_this.formData.password)}).then(function (data) {
                    if(data.status){
                        successMsg("更新密码成功");
                        _this.$router.push("/personalCenter/account")
                    }else{

                    }
                })
            }
        },
        mounted() {
            this.getInfo()
            let _this = this
            bus.$on("getcaptchaid",(val) =>{
                console.log(val)
                _this.codeData.captchaId = val
            })
            bus.$on("getcaptcode",(val) => {
                _this.codeData.captchaCode = val
            })
        }
    }
</script>

<style scoped lang="less">
    @import url(~assets/less/mine.less);
    .b {
        border: 1px solid red;
    }
    .modify_login {
        div {
            height: 50px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            label {
                width: 130px;
                line-height: 50px;
            }
            span {
                line-height: 50px;
            }
            input {
                height: 36px;
                border-radius: 5px;
                border: 1px solid #cccccc;
                margin-right: 20px;
                text-indent: 18px;
                font-size: 14px;
            }
        }
        div:nth-child(2) {
            div {
                width: 400px;
            }
        }
        div:nth-child(3) {
            div {
                width: 400px;
                display: flex;
                align-items: center;
                input {
                    height: 36px;
                    border-radius: 5px;
                    border: 1px solid #cccccc;
                    margin-right: 20px;
                }
            }
        }
    }
</style>
