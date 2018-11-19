<template>
    <div>
        <div class="main">
            <p class="tip">充值说明：23:55-00:05不可充值</p>
            <div class="main-body">
                <p>请选择银行</p>
                <ul class="bank-img cf">
                    <li v-for="(v, k) in bankData" @click="changeBank(v)" :key="k">
                        <img :src="v.src" height="49" width="154" :alt="v.alt" :class="{active : selectBank.code == v.code}"/>
                    </li>
                </ul>
            </div>
            <form :action="LikePayUrl" method="post" target="_blank" @submit.prevent="netPay_like" ref="netPayForm_like">
                <div class="main-body body2">
                    <p>充值金额</p>
                    <div class="recharge-money">
                        <input type="text" name="amount_of_account" v-model="amount_of_account">&nbsp;元
                        <input type="hidden" name="uid" v-model="uid">
                        <input type="hidden" name="bankCode" v-model="bankCode">
                    </div>
                </div>
                <div class="submit">
                    <button type="submit">立即充值</button>
                </div>
            </form>
        </div>
        <el-dialog
                title="提示"
                :visible.sync="dialogCharging"
                width="30%" :close-on-click-modal='false'>
            <span>尊敬的客户您好！请您在新打开的网页中进行充值，充值未完成之前请不要关闭该窗口</span>
            <span slot="footer" class="dialog-footer">
            <el-button @click="chargeSuccess">充值成功</el-button>
            <el-button type="primary" @click="chargeError()">充值失败</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
    import {host} from "../../../api/api";
    import {errorMsg} from "../../../plugins/methods";
    export default {
    props: ["uid"],
    data() {
        return {
            bankCode: "",
            amount_of_account: "",
            selectBank: {},
            bankData: [
                {id: 1, src: '../../../images/ccb.jpg', alt: '建设银行', status: false, code: "CCB"},
                {id: 2, src: '../../../images/cmb.jpg', alt: '招商银行', status: false, code: "CMB"},
                {id: 3, src: '../../../images/icbc.jpg', alt: '工商银行', status: false, code: "ICBC"},
                {id: 4, src: '../../../images/gdb.jpg', alt: '广发银行', status: false, code: "GDB"},
                {id: 5, src: '../../../images/bocom.jpg', alt: '交通银行', status: false, code: "BOCOM"},
                {id: 6, src: '../../../images/boc.jpg', alt: '中国银行', status: false, code: "BOC"},
                {id: 7, src: '../../../images/pab.jpg', alt: '平安银行', status: false, code: "PAB"},
                {id: 8, src: '../../../images/abc.jpg', alt: '农业银行', status: false, code: "ABC"},
                {id: 9, src: '../../../images/psbc.jpg', alt: '邮政储蓄银行', status: false, code: "PSBC"},
                {id: 10, src: '../../../images/hxb.jpg', alt: '华夏银行', status: false, code: "HXB"},
                {id: 11, src: '../../../images/spdb.jpg', alt: '浦发银行', status: false, code: "SPDB"},
                {id: 12, src: '../../../images/cib.jpg', alt: '兴业银行', status: false, code: "CIB"},
                {id: 13, src: '../../../images/bob.jpg', alt: '北京银行', status: false, code: "BCCB"},
                {id: 14, src: '../../../images/cmbc.jpg', alt: '民生银行', status: false, code: "CMBC"},
                {id: 16, src: '../../../images/ceb.jpg', alt: '光大银行', status: false, code: "CEB"},
                {id: 17, src: '../../../images/citic.jpg', alt: '中信银行', status: false, code: "CNCB"},
                {id: 18, src: '../../../images/shb.gif', alt: '上海银行', status: false, code: "BOS"}
            ],
            LikePayUrl: host + "/LikePay",
            dialogCharging: false,
        }
    },
    methods: {
        changeBank (obj) {
            console.log(obj)
            this.selectBank = obj
            this.bankCode = obj.code
        },
        netPay_like() {
            if(this.amount_of_account == "" || this.amount_of_account < 100) {
                errorMsg("金额不能为空且必须不低于100")
                return false
            }
            this.dialogCharging = true
            this.amount_of_account = ""
            this.$refs['netPayForm_like'].submit()
        },
        chargeSuccess () {
            this.dialogCharging = false
            let _this = this
            _this.$router.push('/personalCenter/account')
        },
        chargeError () {
            this.dialogCharging = false
        },
    }
}
</script>

<style scoped lang="less">
.main {
    .tip {
        color: #449DE8 !important;
        font-size: 14px;
        padding: 18px 0 42px 0;
    }
    .main-body {
        display: flex;
        justify-content: space-between;
        p {
            font-size: 14px;
            color: #333;
            height: auto;
            width: 380px;
        }
        .bank-img {
            li {
                float: left;
                margin-right: 20px;
                margin-bottom: 20px;
                border: 1px solid lightgray;
                width: 155px;
                height: 50px;
                overflow: hidden;
                &:hover {
                    border: 1px solid red;
                }
            }
        }
    }
    .body2 {
        justify-content: flex-start;
        p {
            width: 92.88px;
            padding-top: 10px;
        }
        .recharge-money {
            input {
                border: none;
                outline: none;
                border: 1px solid #ccc;
                width: 200px;
                height: 40px;
                line-height: 40px;
                text-indent: 8px;
            }
        }
    }
    .submit {
        margin-left: 93px;
        margin-top: 30px;
        margin-bottom: 30px;
        button {
            width: 200px;
            height: 40px;
            line-height: 40px;
            background-color: #DC2D39;
            color: #fff;
            font-size: 14px;
            border: none;
            outline: none;
            border-radius: 5px;
        }
    }
}

.active {
    border: 1px solid red;
}
</style>
