<template>
    <div>
        <div class="main">
            <p class="tip">充值说明：23:55-00:05不可充值</p>

            <form :action="XPayUrl"  method="get" @submit.prevent="XPayBankCheck" ref="XPayForm"  target="_blank">
                <div class="main-body">
                    <p class="money">充值金额</p>
                    <div class="recharge-money">
                        <input type="text" name="amount_of_account" v-model="amount_of_account">&nbsp;元
                    </div>
                </div>
                <div class="submit">
                    <input type="hidden" name="uid" v-model="uid">
                    <button>立即充值</button>
                </div>
            </form>
        </div>
        <!-- 弹窗 -->
        <el-dialog
                title="支付结果"
                :visible.sync="show"
                width="30%"
        >
            <div class="payToast">
                <p>充值 {{ amount_of_account }}元</p>
                <p>如已支付成功，未到账，请联系客服</p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="chargeError()">支付失败</el-button>
                <el-button type="primary" @click="chargeSuccess">支付成功</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {host} from "../../../api/api";
    import {errorMsg} from "../../../plugins/methods";

    export default {
    props: ['uid'],
    data() {
        return {
            amount_of_account: '',
            bankCode: "",
            XPayUrl: host + "/XPay",
            show: false
        }
    },
    methods: {
        XPayBankCheck () {
            if (this.amount_of_account === 0 || this.amount_of_account < 100 || this.amount_of_account == "") {
                errorMsg("充值金额不能少于100元")
                return false
            }
            // 初始化数据
            this.$refs["XPayForm"].submit()
            this.show = true
            return true
        },
        chargeSuccess () {
            this.show = false
            let _this = this
            _this.$router.push('/personalCenter/account')
        },
        chargeError () {
            this.show = false
        }
    }
}
</script>

<style scoped lang="less">
.main {
    .tip {
        color: #449DE8;
        font-size: 14px;
        padding: 18px 0 42px 0;
    }
    .main-body {
        display: flex;
        justify-content: flex-start;
        .money {
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
}

</style>
