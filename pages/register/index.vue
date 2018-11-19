<template>
    <div class="wrap">
        <div class="main">
            <div class="left"><img src="~/static/images/img_registered.png"></div>
            <div class="right">
                <div class="form">
                    <p class="tit">注册{{platform_name}}</p>
                    <el-form :model="ruleForm"  ref="ruleForm" :rules="rules" class="demo-ruleForm">
                        <el-form-item prop="cellphone">
                            <el-input type="text" v-model="ruleForm.cellphone" auto-complete="off" placeholder="请输入手机号" clearable></el-input>
                        </el-form-item>
                        <el-form-item prop="captchaCode">
                            <v-picvercode ref="childPicCode" @getcaptcode="getcaptCode" @getcaptdata="getcaptData" @getcaptchaid="getcaptId"></v-picvercode>
                        </el-form-item>
                        <el-form-item  prop="phoneCode">
                            <el-col :span="12">
                                <el-input v-model="ruleForm.phoneCode" placeholder="请输入验证码" clearable></el-input>
                            </el-col>
                            <el-col :span="1">&nbsp;</el-col>
                            <el-col :span="11">
                                <VerCode :formData="ruleForm" :requestCallback="smsCallback"></VerCode>
                            </el-col>
                        </el-form-item>
                        <el-form-item v-if="!isShowRecCode">
                            <el-input type="text" v-model="ruleForm.recCode" auto-complete="off" placeholder="请输入推荐码（非必填）" clearable></el-input>
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input type="password" v-model="ruleForm.password" auto-complete="off" placeholder="请输入登录密码" clearable @keyup.enter.native="submitForm('ruleForm')"></el-input>
                        </el-form-item>
                    </el-form>
                    <div class="protocol">
                        <input type="checkbox" class="protocol-check" v-model="item.state" @click="alocked(item)">
                        <span class="tips">我已阅读并同意</span>
                        <a href="javascript:;" @click="routerTo('/protocolInfo/3')">《平台注册协议》</a>
                        <p>
                            <a href="javascript:;"  @click="routerTo('/protocolInfo/2')">《合格投资人声明》</a>
                            <a href="javascript:;"  @click="routerTo('/protocolInfo/1')">《风险揭示书》</a>
                        </p>
                    </div>
                    <div align="center" class="login">
                        <button @click="submitForm('ruleForm')" :disabled="isSubmit">立即注册</button>
                    </div>
                    <nuxt-link :to="{name: 'login'}" class="signup">已有账号？立即登录</nuxt-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {getItem, setItem, successMsg, errorMsg, validLogin, formatTime} from "~/plugins/methods";
import {bus} from "~/plugins/bus";
import {requestRegister, createCaptcha, getRegisterSms, getcaptdata} from '~/api/personal.js';
import {getUserInfo, setLoginInfo} from '~/api/ajax.js';
import {mapState, mapMutations} from 'vuex';
import VerCode from '~/components/VerCode.vue';
import vPicvercode from '~/components/getPicVerCode.vue';

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
            platform_name: '',
            ruleForm: {
                cellphone: '',
                captchaCode: '',
                captchaId: '',
                phoneCode: '',
                password: '',
                recCode: ''
            },
            password: '',
            recCodeType: "",
            isShowRecCode: false,
            item: {
                state: true
            },
            smsCallback: getRegisterSms,
            rules: {
                cellphone: [
                    {required: true, message: '请输入手机号', trigger: 'blur'},
                    {pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[35678]|18[0-9]|14[57])[0-9]{8}$/, message: '请输入正确的手机号', trigger: 'blur'}
                ],
                captchaCode: [
                    {required: true, message: '请输入验证码', trigger: 'blur'},
                    {pattern: /^\d+$/, message: '请输入正确的验证码', trigger: 'blur'}

                ],
                phoneCode: [
                    {required: true, message: '请输入短信验证码', trigger: 'blur'},
                    {pattern: /^\d+$/, message: '请输入正确的短信验证码', trigger: 'blur'}
                ],
                password: [
                    {required: true, message: '请输入密码', trigger: 'blur'},
                    {min: 6, max: 20, message: '不小于6个字母数字或符号', trigger: 'blur'},
                    {pattern: /^[0-9a-zA-Z_#]{6,20}$/, message: '密码由6-20位数字字母或符号组成', trigger: 'blur'}
                ]
            }
        }
    },
    components: {
        VerCode, vPicvercode
    },
    computed: {
        ...mapState(['isSubmit'])
    },
    methods: {
        ...mapMutations(['initSubmit', 'routerTo']),
        getcaptCode(obj) {
            this.ruleForm.captchaCode = obj
        },
        getcaptData(obj) {
            this.captchaData = obj
        },
        getcaptId(obj) {
            this.ruleForm.captchaId = obj
        },
        alocked(item) {
            item.state = !item.state
        },
        updateIndexData() {
            let indexData = getItem('indexData')
            if (indexData) {
                this.platform_name = indexData.platform_name
                this.recCodeType = indexData.recCodeType
            }
        },
        cancel() {
            this.$refs["ruleForm"].resetFields()
        },
        newUser(couponParams) {
            let _this = this
            if (couponParams) {
                this.$alert(`注册成功，已为您赠送${couponParams[0] && couponParams[0]['max_discount']}元优惠券`, '提示', {
                    confirmButtonText: '确定',
                    type: 'success',
                    callback: action => {
                        _this.$router.push({name: 'login'})
                    }
                })
            }
        },
        submitForm(formName) {
            let _this = this
            if (this.recCodeType == 1) {
                this.$refs[formName].validate((valid) => {
                    if (!this.item.state) {
                        errorMsg('请阅读并同意服务协议')
                        return false
                    }
                    if (valid) {
                        this.initSubmit()
                        this.password = crypt.encrypt(this.ruleForm.password)
                        requestRegister({
                            cellphone: this.ruleForm.cellphone,
                            captchaCode: this.ruleForm.captchaCode,
                            captchaId: this.ruleForm.captchaId,
                            phoneCode: this.ruleForm.phoneCode,
                            password: this.password
                        })
                        .then((res) => {
                            if (res.status == 1) {
                                _this.cancel()
                                if (res.data.coupon != 0) {
                                    _this.newUser(res.data.coupon)
                                }
                                else {
                                    _this.$alert('注册成功，请登录', '提示', {
                                        confirmButtonText: '确定',
                                        type: 'success',
                                        callback: action => {
                                            _this.$router.push({name: 'login'})
                                        }
                                    });
                                }
                            } else {
                                errorMsg(res.msg)
                            }
                        })
                        .then((res) => {
                            _this.initSubmit()
                        })
                    } else {
                        return false
                    }
                })
            } else {
                this.$refs[formName].validate((valid) => {
                    if (!this.item.state) {
                        errorMsg('请阅读并同意服务协议')
                        return false
                    }
                    if (valid) {
                        this.initSubmit()
                        this.password = crypt.encrypt(this.ruleForm.password)
                        requestRegister({
                            cellphone: this.ruleForm.cellphone,
                            captchaCode: this.ruleForm.captchaCode,
                            captchaId: this.ruleForm.captchaId,
                            phoneCode: this.ruleForm.phoneCode,
                            password: this.password,
                            recCode: this.ruleForm.recCode
                        })
                        .then((res) => {
                            if (res.status == 1) {
                                _this.cancel()
                                if (res.data.coupon != 0) {
                                    _this.newUser(res.data.coupon)
                                }
                                else {
                                    _this.$alert('注册成功，请登录', '提示', {
                                        confirmButtonText: '确定',
                                        type: 'success',
                                        callback: action => {
                                            _this.$router.push({name: 'login'})
                                        }
                                    });
                                }
                            } else {
                                errorMsg(res.msg)
                            }
                        })
                        .then((res) => {
                            _this.initSubmit()
                        })
                    } else {
                        return false
                    }
                })
            }
        }
    },
    mounted() {
        if (this.$route.query) {
            this.ruleForm.recCode = this.$route.query.code
            if (this.ruleForm.recCode) {
                this.isShowRecCode = true
            }
        }
        this.updateIndexData()
        bus.$on('updateIndexData', () => {
            this.updateIndexData()
        })
    }
}
</script>

<style lang="less" scoped>
@import url(~assets/less/reset.less);
.main {
    height: 520px;
    width: 100%;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    margin-top: 150px;
    margin-bottom: 61px;
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
        padding: 20px 100px 30px 80px;
        .form {
            width: 100%;
            height: 100%;
            .tit {
                padding: 8px 0 20px 0;
            }
            .protocol {
                font-size: 12px;
                padding-left: 6px;
                a {
                    color: #449DE8;
                    font-size: 12px;
                    text-decoration: none;
                }
                p {
                    margin-top: 8px;
                }
            }
            .login {
                margin-top: 15px;
                button {
                    width: 270px;
                    height: 46px;
                    line-height: 46px;
                    color: @fff;
                    background-color: @red;
                    border: none;
                    outline: none;
                    cursor: pointer;
                    border-radius:5px;
                }
            }
            .signup {
                text-decoration: none;
                color: @blue;
                font-size: @font_size_14;
                display: inline-block;
                margin-top: 10px;
                display: flex;
                justify-content: center;
            }
        }
    }
}
</style>
