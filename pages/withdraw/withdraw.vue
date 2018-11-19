<template>
    <div>
        <div class="main">
            <div class="deal">
                <p>提现说明：</p>
                <p>1.实名认证、绑定银行卡、设置提现密码</p>
                <p>2.请在工作日9:00-16:00内申请，最迟T+2个工作日内到账</p>
                <p>3.手续费，单笔最少2元，2000以上每笔手续费率为0.1%</p>
                <p>4.工作日9:00-16:00提款，当日结算。16:00以后提款，下个工作日结算，具体到账时间以银行为准</p>
                <p>5.推荐使用工商银行、农业银行、建设银行、交通银行，提现到账最快</p>

            </div>
            <div class="form">
                <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
                     <el-form-item label="姓名">
                        <p class="balance">{{userInfo.real_name}}</p>
                    </el-form-item>
                    <el-form-item label="可用余额">
                        <p class="balance">{{userInfo.cust_capital_amount}}</p>
                    </el-form-item>
                    <el-form-item label="提现金额" prop="cash_amount">
                        <el-input type="text" v-model="ruleForm.cash_amount" auto-complete="off" placeholder="请输入提现金额"></el-input>
                    </el-form-item>
                     <el-form-item label="到账银行卡" prop="bank_name">
                        <el-select v-model="ruleForm.bank_name" placeholder="请选择银行">
                            <el-option
                                v-for="item in userInfo.bankCards"
                                :key="item.id"
                                :label="item.bank_name + item.bank_card"
                                :value="item.id"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                     <el-form-item label="提现密码 " prop="withdraw_pw">
                        <el-input type="password" v-model="ruleForm.withdraw_pw" auto-complete="off" placeholder="请输入提现密码"></el-input>
                    </el-form-item>
                </el-form>
                <div align="center" class="login">
                    <button @click="submitForm('ruleForm')" :disabled="isSubmit">提交</button>
                </div>
                <nuxt-link to="/personalCenter/safeCenter" class="forgot">忘记提现密码？</nuxt-link>
            </div>
        </div>
    </div>
</template>

<script>
    import {withdraw} from "../../api/personal";
    import {getUserInfo} from "../../api/ajax";
    import {successMsg, errorMsg, getItem} from "../../plugins/methods";
    import {bus} from "../../plugins/bus";
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
         var validate = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入提现金额'))
            } else if (Number(value) >= Number(this.account.canExtract)) {
                callback(new Error('账户余额不足，无法提现'))
            } else {
                callback()
            }
        }
        return {
            labelPosition: 'left',
            ruleForm: {
                bank_name: '',
                cash_amount: '',
                withdraw_pw: ''

            },
            bankList: [],
            userInfo:{},
            indexData: {},
            account: {
                canExtract: ''
            },
            password: '',
            rules: {
                bank_name: [
                    {required: true, message: '请选择银行', trigger: 'blur'}
                ],
                cash_amount: [
                    {required: true, validator: validate, trigger: 'blur' },
                    {pattern: /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/, message: '请输入正确的金额', trigger: 'blur'}
                ],
                withdraw_pw: [
                    {required: true, message: '请输入提现密码', trigger: 'blur'}
                ]
            },
            isSubmitting: false
        }
    },
    computed: {
        ...mapState(['isSubmit'])
    },
    methods: {
        ...mapMutations(['initSubmit']),
        getInfo() {
            let _this = this
            getUserInfo().then(function () {
                _this.userInfo = getItem("userInfo")
                _this.account.canExtract = _this.userInfo.cust_capital_amoun
            })
        },
        submitForm() {
            let _this = this
            let pwd = crypt.encrypt(_this.ruleForm.withdraw_pw)
            this.initSubmit()
            withdraw({'bankcard_id': _this.ruleForm.bank_name, "cash_amount": _this.ruleForm.cash_amount, "withdraw_pw": pwd}).then(function (data) {
                if(data.status){
                    successMsg(data.msg)
                    getUserInfo().then(function () {
                        _this.getInfo()
                    })
                    bus.$emit("updateData")
                    _this.initSubmit()
                    _this.initRuleForm()
                }else{
                    errorMsg(data.msg)
                    _this.initSubmit()
                }
            }).catch(function (err) {
                console.log(err)
            })
        },
        initRuleForm() {
            this.ruleForm = {
                bank_name: '',
                cash_amount: '',
                withdraw_pw: ''
            }
        }
    },
    mounted() {
        this.getInfo()
    }
}
</script>


<style lang="less" scoped>
.main {
    width: 100%;
    padding-left: 15px;
    margin-top: 20px;
    .deal {
        font-size: 14px;
        color: #449DE8;
        line-height: 26px;
    }
    .form {
        width: 400px;
        margin-top: 20px;
        position: relative;
        .login {
            padding-top: 31px;
            padding-bottom: 45px;
            button {
                width: 200px;
                height: 40px;
                line-height: 40px;
                background:rgba(235,47,48,1);
                border-radius: 5px;
                box-shadow: 5px 0px 8px rgba(235,47,48,0.3);
                border: none;
                color: #fff;
                font-size: 16px;
                outline: none;
                cursor: pointer;
            }
        }
        p {
            color: #333;
            font-size: 14px;
        }
        .forgot {
            position: absolute;
            right: -115px;
            bottom: 150px;
            font-size: 14px;
            color: #449DE8;
            text-decoration: none;
        }
    }
}

.el-select, .el-cascader {
    width: 100%;
}
</style>
