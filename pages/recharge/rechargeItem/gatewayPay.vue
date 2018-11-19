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
            <div class="main-body body2">
                <p>充值金额</p>
                <div class="recharge-money">
                    <input type="text" name="amount_of_account" v-model="amount_of_account">&nbsp;元
                </div>
            </div>
            <div class="submit">
                <button @click="payCheck()">立即充值</button>
            </div>
        </div>
    </div>
</template>

<script>
    import {host} from "../../../api/api";
    import {loadingClose, loadingOpen, errorMsg} from "../../../plugins/methods";
    import {XNetPay} from "../../../api/personal";

    export default {
    props: ["uid"],
    head: {
        script: [
            { src: '../../../js/paymentjs.js'}
        ]
    },
    data() {
        return {
            bankCode: "",
            amount_of_account: "",
            selectBank: {},
            bankData: [
                {id: 1, src: '../../../images/psbc.jpg', alt: '邮储银行', status: false, code: "01000000"},
                {id: 2, src: '../../../images/icbc.jpg', alt: '工商银行', status: false, code: "01020000"},
                {id: 3, src: '../../../images/abc.jpg', alt: '农业银行', status: false, code: "01030000"},
                {id: 4, src: '../../../images/boc.jpg', alt: '中国银行', status: false, code: "01040000"},
                {id: 5, src: '../../../images/ccb.jpg', alt: '建设银行', status: false, code: "01050000"},
                {id: 6, src: '../../../images/bocom.jpg', alt: '交通银行', status: false, code: "03010000"},
                {id: 7, src: '../../../images/citic.jpg', alt: '中信银行', status: false, code: "03020000"},
                {id: 8, src: '../../../images/ceb.jpg', alt: '光大银行', status: false, code: "03030000"},
                {id: 9, src: '../../../images/cmbc.jpg', alt: '民生银行', status: false, code: "03050000"},
                {id: 10, src: '../../../images/gdb.jpg', alt: '广发银行', status: false, code: "03060000"},
                {id: 11, src: '../../../images/cmb.jpg', alt: '招商银行', status: false, code: "03080000"},
                {id: 12, src: '../../../images/spdb.jpg', alt: '浦发银行', status: false, code: "03100000"},
                {id: 13, src: '../../../images/bob.jpg', alt: '北京银行', status: false, code: "04031000"},
                {id: 14, src: '../../../images/pab.jpg', alt: '平安银行', status: false, code: "04105840"}
            ]
        }
    },
    methods: {
        changeBank(obj) {
            console.log(obj)
            this.selectBank = obj
            this.bankCode = obj.code
        },
        payNow() {
            loadingOpen('发起中！')
            let _this = this
            XNetPay({
                'uid': _this.uid,
                "amount_of_account": _this.amount_of_account,
                "bankCode": _this.bankCode
            }).then(function (data) {
                loadingClose()
                if (data.code == "0000") {
                    let credential = data.data.result.JWP_ATTR
                    paymentjs.createPayment(credential, function (result, err) {
                    })
                } else {
                    if (data.msg) {
                        errorMsg(data.msg)
                    }
                    errorMsg(data.message)
                }
            }).catch(function (err) {
                loadingClose()
                console.log(err)
            })
        },
        payCheck() {
            if (this.bankCode == "") {
                errorMsg("必须选择支付银行！")
                return false
            }
            if (this.amount_of_account == "" || this.amount_of_account < 100) {
                errorMsg("充值金额必须大于100")
                return false
            }
            this.payNow()
        }
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
            width: 109.88px;
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
