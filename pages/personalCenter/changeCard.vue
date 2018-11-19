<template>
    <div>
        <div class="main">
            <p class="title">修改银行卡</p>
            <p class="tip">应第三方支付平台要求，请选择常用的与实名认证用户一致的银行卡，绑定成功后，充值提现只能在该银行卡上进行！</p>
            <div class="main-body">
                <div class="from">
                    <el-form :model="ruleForm" ref="ruleForm" label-width="106px" class="demo-ruleForm">
                        <el-form-item label="开户名" prop="cellphone">
                            <el-input type="text" v-model="userInfo.real_name" auto-complete="off" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="银行名称" prop="bankName">
                            <el-select v-model="bankName" placeholder="请选择银行">
                                <el-option
                                    v-for="item in bankList"
                                    :key="item.id"
                                    :label="item.alt"
                                    :value="item.alt"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="开户所在地区" prop="open_province">
                            <el-cascader
                                :options="options"
                                v-model="formData.area"
                                @change="handleChange"
                                :separator="' '"
                            >
                            </el-cascader>
                        </el-form-item>
                        <el-form-item label="开户行信息" prop="openBank">
                            <el-input type="text" v-model="formData.open_bank" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="银行卡号" prop="bankCard" @click="clearBandCard">
                            <el-input type="text" v-model="formData.bank_card" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="重复银行卡号" prop="repeatBankCard">
                            <el-input type="text" v-model="formData.repeatBankCard" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-form>
                    <div align="center" class="login">
                        <button @click="valid" :disabled="isSubmit">确定</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {createBankCard, updateBankCard} from '~/api/personal.js';
    import {getUserInfo} from '~/api/ajax.js';
    import {successMsg, errorMsg, getItem} from "~/plugins/methods.js";
    import {mapState, mapMutations} from 'vuex';
    import options from '~/plugins/country-data.js';

    export default {
        data() {
            var validateRepeatBankCard = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入银行卡号'));
                } else if (value !== this.ruleForm.bankCard) {
                    callback(new Error('两次输入卡号不一致!'));
                } else {
                    callback();
                }
            }
            return {
                labelPosition: 'right',
                ruleForm: {
                    bankName: '',
                    openBank: '',
                    bankCard: '',
                    repeatBankCard: '',
                    open_province: '',
                    open_district: ''
                },
                formData: {
                    area: [],
                    bank_name: '',
                    open_bank: '',
                    bank_card: '',
                    repeatBankCard: '',
                    open_province: '',
                    open_district: ''
                },
                bankName: '',
                bank_code: '',
                bankCard: '',
                userInfo: {},
                bankList: [
                    {id: 1, src: '../../../../static/images/ICBCB.png', alt: '工商银行', status: false, code: "ICBC"},
                    {id: 2, src: '../../../../static/images/ABCB.png', alt: '农业银行', status: false, code: "ABC"},
                    {id: 3, src: '../../../../static/images/CCBB.png', alt: '建设银行', status: false, code: "CCB"},
                    {id: 4, src: '../../../../static/images/BOCB.png', alt: '中国银行', status: false, code: "BOC"},
                    {id: 5, src: '../../../../static/images/BCMB.png', alt: '交通银行', status: false, code: "BCM"},
                    {id: 6, src: '../../../../static/images/CIBB.png', alt: '兴业银行', status: false, code: "CIB"},
                    {id: 7, src: '../../../../static/images/CITICB.png', alt: '中信银行', status: false, code: "CITIC"},
                    {id: 8, src: '../../../../static/images/CEBB.png', alt: '光大银行', status: false, code: "CEB"},
                    {id: 9, src: '../../../../static/images/PABCB.png', alt: '平安银行', status: false, code: "SPABANK"},
                    {id: 10, src: '../../../../static/images/PSBCB.png', alt: '邮政储蓄银行', status: false, code: "PSBC"},
                    {id: 11, src: '../../../../static/images/SHBANKB.png', alt: '上海银行', status: false, code: "SHBANK"},
                    // {id: 12, src: '../../../../static/images/SPDBB.png', alt: '浦发银行', status: false, code: "SPDB"},
                    {id: 13, src: '../../../../static/images/CMBB.png', alt: '招商银行', status: false, code: "CMB"}
                    // {id: 14, src: '~/static/images/cmbc.png', alt: '民生银行', status: false, code: "CMBC"},
                    // {id: 15, src: '~/static/images/hxb.png', alt: '华夏银行', status: false, code: "HXBANK"},
                    // {id: 16, src: '../../../../static/images/GDBB.png', alt: '广东发展银行', status: false, code: "gbd"}
                ],
                selectedOptions: [],        // 存放默认值
                options: options,           // 存放城市数据
                /*rules: {
                    bankName: [
                        {required: true, message: '请选择银行', trigger: 'blur'}
                    ],
                    open_province: [
                        {required: true, message: '请选择开户所在地区', trigger: 'blur'}
                    ],
                    openBank: [
                        {required: true, message: '请输入开户行信息', trigger: 'blur'}
                    ],
                    bankCard: [
                        {required: true, message: '请输入银行卡号', trigger: 'blur'},
                        {min: 16, message: '请正确输入银行卡号', trigger: 'blur'},
                    ],
                    repeatBankCard: [
                        {required: true, validator: validateRepeatBankCard, trigger: 'blur'}
                    ]
                },*/
            }
        },
        computed: {
            ...mapState(['isSubmit'])
        },
        methods: {
            ...mapMutations(['initSubmit']),
            handleChange(value) {
                this.formData.open_province = value[1]
                this.formData.open_district = value[2]
            },
            getUserData() {
                this.userInfo = getItem('userInfo')
                this.indexData = getItem('indexData')
                //this.bankList = JSON.parse(this.indexData.permissionBank)
            },
            getCardData() {
                let _this = this
                let id = this.$route.params.id
                this.userInfo.bankCards.forEach(function (obj) {
                    if (obj.id == id) {
                        _this.formData = obj
                        _this.bankCard = _this.formData.bank_card
                        _this.bankName = _this.formData.bank_name
                    }
                })
                this.bank_code = this.$route.params.code
                this.bankName = this.$route.params.name
                this.formData.area = ['中国', this.formData.open_province, this.formData.open_district]
            },
            clearBandCard() {
                if (this.formData.bank_card.indexOf('*') > -1) {
                    this.formData.bank_card = ""
                }
            },
            valid() {
                if (this.formData.bank_name == undefined) {
                    errorMsg('请选择银行')
                } else if (this.formData.area == "") {
                    errorMsg('请选择开户行所在地区')
                } else if (this.formData.open_bank == '') {
                    errorMsg('请填写支行名称')
                } else if (this.formData.bank_card == '') {
                    errorMsg('请填写银行卡号')
                } else if (this.formData.bank_card != this.formData.repeatBankCard) {
                    errorMsg('两次填写银行卡号不一致')
                } else {
                    this.submitBind()
                }
            },
            submitBind() {
                let _this = this
                this.initSubmit()
                updateBankCard({
                    id: this.$route.params.id,
                    bank_name: this.bankName,
                    open_province: this.formData.open_province,
                    open_district: this.formData.open_district,
                    open_bank: this.formData.open_bank,
                    bank_card: this.formData.bank_card,
                    repeatBankCard: this.formData.repeatBankCard
                }).then((res) => {
                    if (res.status == 1) {
                        successMsg('修改成功')
                        getUserInfo().then((res) => {
                            _this.$router.push('/personalCenter/cardCenter')
                        })
                    } else {
                        errorMsg(res.msg)
                    }
                }).then((res) => {
                    _this.initSubmit()
                })
            },
        },
        mounted() {
            this.getUserData()
            this.getCardData()
        },
    }
</script>

<style scoped lang="less">
    .main {
        padding: 0 35px;
        padding-bottom: 100px;
        .title {
            font-size: 18px;
            padding-top: 50px;
            padding-bottom: 10px;
            color: #333;
            border-bottom: 1px solid #eee;
            text-indent: 15px;
        }
        .tip {
            font-size: 14px;
            color: #449DE8;
            padding-left: 15px;
            padding-top: 30px;
        }
        .main-body {
            .from {
                width: 400px;
                margin-left: 15px;
                margin-top: 30px;
                .login {
                    padding-top: 28px;
                    margin-left: 88px;
                    button {
                        width: 280px;
                        height: 40px;
                        line-height: 40px;
                        background: rgba(235, 47, 48, 1);
                        border-radius: 5px;
                        box-shadow: 5px 0px 8px rgba(235, 47, 48, 0.3);
                        border: none;
                        color: #fff;
                        font-size: 16px;
                        outline: none;
                        cursor: pointer;
                    }
                }
            }
        }
    }

    .el-select, .el-cascader {
        width: 100%;
    }
</style>
