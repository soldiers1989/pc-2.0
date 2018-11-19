<template>
    <div>
        <div class="mian">
            <div class="main-body">
                <p>充值金额</p>
                <div class="select-btn">
                    <button :class="{selectButton: showMoney==v.value}" class="moneyList"
                                v-for='(v,k) in selectMoneyData' :key=k
                                @click="seleced(v.value, v.number, k)"
                        >{{v.value}}
                    </button>
                </div>
            </div>
            <div>
                    <div class="main-body body2" v-if="otherShow">
                        <p>其他金额</p>
                        <div class="recharge-money">
                            <input type="text" name="amount_of_account" v-model="choiceMoney">&nbsp;元
                        </div>
                    </div>
                <form v-bind:action="payUrl" method="POST" @submit.prevent="pay" ref="AlipayForm" target="_blank">
                    <div class="submit">
                        <input type="hidden" name="amount_of_account" v-model="choiceMoney">
                        <input type="hidden" name="uid"  v-model="uid">
                        <input type="hidden" name="payType" value="1">
                        <button>立即充值</button>
                    </div>
                </form>
            </div>
        </div>
        <!-- 弹窗 -->
        <el-dialog
                title="支付结果"
                :visible.sync="show"
                width="30%"
                :before-close="handleClose"
        >
            <div class="payToast">
                <p>支付宝扫码充值 {{ choiceMoney }}元</p>
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
    props: ["uid"],
    data() {
        return {
            showMoney: '100',
            choiceMoney: 100,
            show: false,
            otherShow: false,
            selectMoneyData: [
                {
                    id: 1,
                    value: '100',
                    number: 100
                },
                {
                    id: 2,
                    value: '300',
                    number: 300

                },
                {
                    id: 3,
                    value: '500',
                    number: 500
                },
                {
                    id: 4,
                    value: '1000',
                    number: 1000
                },
                {
                    id: 5,
                    value: '2000',
                    number: 2000
                },
                {
                    id: 6,
                    value: '3000',
                    number: 3000
                },
                {
                    id: 7,
                    value: '5000',
                    number: 5000
                },
                {
                    id: 8,
                    value: '10000',
                    number: 10000
                },
                {
                    id: 9,
                    value: '其他金额',
                    number: '其他金额'
                }
            ],
            payUrl: host + '/payMonitor'
        }
    },
    methods: {
        seleced(value, number, index) {
            if (value === '其他金额') {
                this.otherShow = true
                this.showMoney = '其他金额'
                this.choiceMoney = ""
            } else {
                this.otherShow = false
                this.showMoney = value
                this.choiceMoney = value
            }
        },
        handleClose(done) {
            this.choiceMoney = ""
            done()
        },
        pay() {
            if ((new Date()).getHours() < 9 || (new Date()).getHours() >= 17) {
                errorMsg("充值时间为09:00~17:00")
                return false
            }
            if (this.choiceMoney == "" || this.choiceMoney < 100) {
                errorMsg("金额不能为空且必须不低于100")
                return false
            }
            this.show = true
            this.$refs['AlipayForm'].submit()
        },
        chargeSuccess () {
            this.show = false
            let _this = this
            _this.$router.push('/personalCenter/account')
        },
        chargeError () {
            this.show = false
            this.choiceMoney = ""
        }
    }
}
</script>

<style scoped lang="less">
.main {
    .main-body {
        display: flex;
        justify-content: flex-start;
        margin-top: 50px;
        p {
            font-size: 14px;
            color: #333;
            height: auto;
            width: 92.88px;
        }
        .select-btn {
            width: 580px;
            button {
                width: 90px;
                height: 36px;
                line-height: 36px;
                outline: none;
                border: none;
                border: 1px solid rgba(204,204,204,1);
                background-color: #fff;
                font-size: 14px;

            }
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
    .body2 {
        margin-top: 20px;
        p {
            padding-top: 10px;
        }
    }
}


.moneyList {
    color: #333;
    margin: 0 40px 25px 0;
}
.selectButton {
    color: #fff;
    background:rgba(255,37,38,1) !important;
    border: 1px solid rgba(255,37,38,1) !important;
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
    .payToast p{
        width: 100% !important;
    }
</style>
