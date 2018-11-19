<template>
    <div>
         <div class="carousel">
            <div class="carousel-img">
                <el-carousel height="400px">
                    <el-carousel-item v-for="item in carouselData" :key="item.id">
                        <div>
                            <a :href="item.url" target="_blank"><img :src="item.picUrl"></a>
                        </div>
                    </el-carousel-item>
                </el-carousel>
            </div>

            <!-- 登录框 -->
            <div class="login" v-if="!loginFlag">
                <div class="form">
                    <p class="tit">登录{{platform_name}}</p>
                    <el-form :model="ruleForm" ref="ruleForm" :rules="rules" class="demo-ruleForm">
                        <el-form-item prop="cellphone">
                            <el-input type="text" v-model="ruleForm.cellphone" auto-complete="off" placeholder="请输入手机号" clearable></el-input>
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input type="password" v-model="ruleForm.password" auto-complete="off" placeholder="请输入密码" clearable  @keyup.enter.native="submitForm('ruleForm')"></el-input>
                        </el-form-item>
                    </el-form>
                    <nuxt-link :to="{name: 'forgot'}" class="forgot">忘记密码</nuxt-link>
                    <div align="center">
                        <button class="submit" :disabled="isSubmit" @click="submitForm('ruleForm')">登录</button>
                    </div>
                    <nuxt-link :to="{name: 'register'}" class="signup">没有账号？立即注册</nuxt-link>
                </div>
            </div>

            <div class="login" v-if="loginFlag">
                <div class="form form2">
                    <p class="tit2">欢迎您来到{{platform_name}}</p>
                    <p class="tit3">资金安全双重保障</p>
                    <p class="tit4">100%实盘交易</p>
                    <div align="center">
                        <button class="submit submit2" @click="routerTo('/personalCenter')">前往个人中心</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {getItem, setItem, successMsg, errorMsg, validLogin, loadingOpen, loadingClose} from "~/plugins/methods";
import {bus} from "~/plugins/bus";
import {requestLogin} from '~/api/personal.js';
import {getUserInfo, setLoginInfo} from '~/api/ajax.js';
import {mapState, mapMutations} from 'vuex';

const JSEncrypt = require('node-jsencrypt');
const crypt = new JSEncrypt();
let public_key = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC8yY4yneut770arIb+hhuwPbV4
qP75ZtfSZmEMK64pldpcGeCbp4uFaOqwXMy7cszsYnD9YnMJLN82zt2ttOU9APcC
HWS1Qi72AkxnyROTIICYU0oi+I+5elogPgkOxKyi2bWb6pR9IkDR3EYmYear0biw
D0DJ3ztdzWa+W1IbOQIDAQAB`;
crypt.setKey(public_key);

export default {
    data() {
        return {
            carouselData: [{urlPic: ''},{urlPic: ''},{ urlPic: ''}],
            platform_name: '',
            labelPosition: 'right',
            ruleForm: {
                cellphone: '',
                password: ''
            },
            password: '',
            rules: {
                cellphone: [
                    {required: true, message: '请输入手机号', trigger: 'blur'},
                    {pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[35678]|18[0-9]|14[57])[0-9]{8}$/, message: '请输入正确的手机号', trigger: 'blur'}
                ],
                password: [
                    {required: true, message: '密码不正确', trigger: 'change'}
                ]
            },
            loginFlag: false
        }
    },
    computed: {
        ...mapState(['isSubmit'])
    },
    watch: {
        loginFlag(newVal, oldVal) {}
    },
    methods: {
        ...mapMutations(['initSubmit', 'routerTo']),
        updateIndexData() {
            let indexData = getItem('indexData')
            if (indexData) {
                this.carouselData = indexData.others[7] || this.carouselData
                this.platform_name = indexData.platform_name
            }
        },
        updateUserInfo() {
            if (validLogin()) {
                this.userInfo = getItem("userInfo")
                this.loginFlag = true
            }
        },
        cancel() {
            this.$refs["ruleForm"].resetFields()
        },
        submitForm(formName) {
            let _this = this
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.initSubmit()
                    this.password = crypt.encrypt(this.ruleForm.password)
                    requestLogin({
                        username: this.ruleForm.cellphone,
                        password: this.password
                    }).then((res) => {
                        if (res.status == 1) {
                            setLoginInfo(res.data)
                            _this.cancel()
                            successMsg('登录成功')
                            bus.$emit('updateUserInfo')
                            getUserInfo().then((res) => {
                                _this.$router.push('/')
                            })
                        } else {
                            errorMsg(res.msg)
                        }
                    }).then((res) => {
                        _this.initSubmit()
                    })
                } else {
                    return false
                }
            })
        }
    },
    mounted() {
        if (validLogin()) {
            this.loginFlag = true
        }
        let _this = this
        this.updateIndexData()
        bus.$on('updateIndexData', () => {
            this.updateIndexData()
        })
        bus.$on('updateUserInfo', () => {
            _this.updateUserInfo()
        })
    },
}
</script>

<style lang="less" scoped>
@import url(~assets/less/reset.less);
.carousel {
    position: relative;
    text-align: center;
    margin-top: 130px;
    .carousel-img {
        a {
            display: block;
            margin: 0 auto;
        }
    }
    .login {
        position: absolute;
        width: 282px;
        height: 318px;
        background: hsla(0, 0, 100%, .5);
        right: 320px;
        top: 55px;
        z-index: 888;
        padding: 8px;
        .form {
            background-color: @fff;
            width: 100%;
            height: 100%;
            padding: 14px 20px;
            padding-bottom: 18px;
            .tit {
                padding: 8px 0 15px 0;
            }
            .forgot {
                text-decoration: none;
                display: flex;
                justify-content: flex-end;
                color: @blue;
                font-size: @font_size_14;
            }
            .submit {
                width: 226px;
                height: 36px;
                line-height: 36px;
                color: @fff;
                font-size: @font_size_14;
                background-color: @red;
                border: none;
                outline: none;
                margin-top: 20px;
                cursor: pointer;
            }
            .signup {
                text-decoration: none;
                color: @blue;
                font-size: @font_size_14;
                display: inline-block;
                margin-top: 14px;
                display: flex;
                justify-content: center;
            }
        }
        .form2 {
            padding: 0;
            text-align: center;
            .tit2 {
                padding: 70px 32px 0;
                font-size: 22px;
                color: #DC2D39;
            }
            .tit3, .tit4 {
                color: #333;
                line-height: 32px;
                margin-top: 16px;
                font-size: 20px;
            }
            .tit4 {
                margin-top: 0;
            }
            .submit2 {
                margin-top: 51px;
                border-radius: 5px;
            }
        }
    }
}

@media screen and (max-width: 1280px){
    .login {
        right: 100px !important;
    }
}

@media screen and (max-width: 1366px){
    .login {
        right: 100px !important;
    }
}
</style>
