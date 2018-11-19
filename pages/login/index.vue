<template>
    <div class="wrap">
        <div class="main">
            <div class="left"><img src="~/static/images/img_login.png"></div>
            <div class="right">
                <div class="form">
                    <p class="tit">登录{{platform_name}}</p>
                    <el-form :model="ruleForm" ref="ruleForm" :rules="rules" class="demo-ruleForm">
                        <el-form-item prop="cellphone">
                            <el-input type="text" v-model="ruleForm.cellphone" auto-complete="off" placeholder="请输入手机号" clearable></el-input>
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input type="password" v-model="ruleForm.password" auto-complete="off" placeholder="请输入密码" clearable @keyup.enter.native="submitForm('ruleForm')"></el-input>
                        </el-form-item>
                    </el-form>
                    <nuxt-link :to="{name: 'forgot'}" class="forgot">忘记密码</nuxt-link>
                    <div align="center">
                        <button class="submit" :disabled="isSubmit" @click="submitForm('ruleForm')">立即登录</button>
                    </div>
                    <nuxt-link :to="{name: 'register'}" class="signup">没有账号？立即注册</nuxt-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {getItem, setItem, successMsg, errorMsg, validLogin} from "~/plugins/methods";
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
    scrollToTop: true,
    data() {
        return {
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
        }
    },
    computed: {
        ...mapState(['isSubmit'])
    },
    methods: {
        ...mapMutations(['initSubmit']),
        updateIndexData() {
            let indexData = getItem('indexData')
            if (indexData) {
                this.platform_name = indexData.platform_name
            }
        },
        cancel() {
            this.$refs["ruleForm"].resetFields()
        },
        submitForm(formName) {
            let _this = this
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    _this.initSubmit()
                    _this.password = crypt.encrypt(this.ruleForm.password)
                    requestLogin({
                        username: this.ruleForm.cellphone,
                        password: this.password
                    }).then((res) => {
                        if (res.status == 1) {
                            setLoginInfo(res.data)
                            _this.cancel()
                            bus.$emit('updateUserInfo')
                            getUserInfo().then((res) => {
                                _this.$router.push('/personalCenter/account')
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
        this.updateIndexData()
        let access_token = this.$route.query.access_token
        if (access_token) {
            setLoginInfo({'access_token': access_token})
            getUserInfo().then(res => {
                if (validLogin()) {
                    this.$router.push({path: "/"})
                }
            }).catch((error) => {
                console.log(error)
            })
        }
        bus.$on('updateIndexData', () => {
            this.updateIndexData()
        })
    }
}
</script>

<style lang="less" scoped>
@import url(~assets/less/reset.less);
.main {
    height: 400px;
    width: 100%;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    margin-top: 170px;
    margin-bottom: 161px;
    .left {
        width: 750px;
        height: 100%;
        img {
            width: 100%;
            height: 100%;
            vertical-align: middle;
        }
    }
    .right {
        width: 450px;
        padding: 40px 100px 60px 80px;
        .form {
            width: 100%;
            height: 100%;
            .tit {
                padding: 8px 0 30px 0;
            }
            .forgot {
                text-decoration: none;
                display: flex;
                justify-content: flex-end;
                color: @blue;
                font-size: @font_size_14;
            }
            .submit {
                width: 270px;
                height: 46px;
                line-height: 46px;
                color: @fff;
                background-color: @red;
                border: none;
                outline: none;
                margin-top: 40px;
                cursor: pointer;
                border-radius:5px;
            }
            .signup {
                text-decoration: none;
                color: @blue;
                font-size: @font_size_14;
                display: inline-block;
                margin-top: 20px;
                display: flex;
                justify-content: center;
            }
        }
    }
}
</style>
