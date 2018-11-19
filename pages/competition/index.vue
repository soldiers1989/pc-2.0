<template>
    <div class="page">
        <div class="main">
            <div class="row1 count_activited"></div>
            <div class="row2" align="center" v-if="!isCompetition"><div @click="join"></div></div>
            <div class="row2 row-btn" align="center" v-if="isCompetition"><div @click="join"></div></div>
            <div v-if="!isCompetition">
                <div class="row3">
                    <div class="select">
                        <span v-for="(tab, index) in tabs" :class="{cur: iscur==index}" :key=index @click="iscur=index, tabChange('select' + (index + 1))">{{tab.name}}</span>
                    </div>
                </div>
                <div class="row4">
                    <component :is="tabView"></component>
                </div>
            </div>
            <div v-else align="center">
                <div class="competition-main">
                    <ul class="row4 row5">
                        <li>
                            <span>保证金</span>
                            <span>{{products.min_stock_finance | formatMoney}}元</span>
                        </li>
                        <li>
                            <span>操盘额</span>
                            <span>{{products.max_stock_finance | formatMoney}}元</span>
                            <span class="warning">预警线</span>
                            <span class="txt1">{{warningLine | formatMoney}}元</span>
                            <span class="txt2">禁止买入</span>
                        </li>
                        <li>
                            <span>总操盘资金</span>
                            <span>{{(products.min_stock_finance + products.max_stock_finance) | formatMoney}}元</span>
                            <span>保证金+操盘额</span>
                            <span class="txt3">平仓线</span>
                            <span class="txt4">{{lossLine | formatMoney}}元</span>
                        </li>
                    </ul>
                    <ul class="row4 row5">
                        <li>
                            <span v-if="boardRisk.length">单票持仓</span>
                            <span v-if="boardRisk.length">
                                <i v-for="(value, key) in boardRisk" :key="key">{{value.broad}}{{value.rate}}</i>
                            </span>
                            <span v-if="rate">
                                 <i>盈利分成</i>
                            </span>
                            <span v-if="rate">
                                <i>{{((1 - rate) * 100).toFixed(2)}}%</i>
                            </span>
                        </li>
                        <li>
                            <span>自动延期</span>
                            <span>否</span>
                            <span></span>
                        </li>
                        <li>
                            <span>自动补保</span>
                            <span>否</span>
                            <span></span>
                        </li>
                        <li>
                            <span>利率</span>
                            <span>免息</span>
                        </li>
                        <li>
                            <span>共计支付</span>
                            <span><i class="yellow">2000.00</i>元</span>
                        </li>
                    </ul>
                    <div class="row6">
                        <p>阅读并签署<span @click="toProtocol">《MOM投资顾问合作协议》</span></p>
                        <p class="red mt">温馨提示：申请操盘资金前请仔细阅读合作协议并签名</p>
                        <button class="submit" @click="submit">立即开通</button>
                    </div>
                </div>

            </div>
        </div>


        <!--确认申请-->
        <el-dialog
            title="确认申请"
            :visible.sync="confirmFinancing"
            width="350px"
            :close-on-click-modal="false">
            <div class="confirm_financing-content">
                <ul>
                    <li>
                        <span>合约类型：</span>
                        <span>炒股大赛</span>
                    </li>
                    <li>
                        <span>合约产品：</span>
                        <span>炒股大赛—Y10</span>
                    </li>
                    <li>
                        <span>保证金</span>
                        <span>{{products.min_stock_finance | formatMoney}}</span>
                    </li>
                    <li>
                        <span>操盘额</span>
                        <span>{{products.max_stock_finance | formatMoney}}</span>
                    </li>
                    <li>
                        <span>总操盘资金</span>
                        <span>{{(products.min_stock_finance + products.max_stock_finance) | formatMoney}}</span>
                    </li>
                    <li>
                        <span>管理费：</span>
                        <span>0.00</span>
                    </li>
                </ul>

                <div class="button_group">
                    <el-button  @click="confirmFinancing = false" size="small">取消</el-button>
                    <el-button type="danger" @click="stockFinance()" :disabled="isSubmitting" size="small">确 定</el-button>
                </div>
            </div>
        </el-dialog>

        <!--合约申请成功-->
        <el-dialog
            title="合约申请成功"
            :visible.sync="successFinancing"
            width="350px"
            :close-on-click-modal="false">
            <div class="confirm_financing">
                <div class="success_financing-content">
                    <ul>
                        <li>
                            <span>合约类型：</span>
                            <span>炒股大赛</span>
                        </li>
                        <li>
                            <span>合约产品：</span>
                            <span>炒股大赛Y10—{{id}}</span>
                        </li>
                    </ul>
                </div>
                <div class="button_group">
                    <el-button @click="showContract" size="small">查看合约</el-button>
                    <el-button type="danger" size="small" @click="goForTrade">去交易</el-button>
                </div>
            </div>
        </el-dialog>

        <!--余额不足的弹窗-->
        <el-dialog
            title="余额不足"
            :visible.sync="dialogBalanceVisible"
            width="400px"
            :close-on-click-modal="false">
            <div class="balance_pay_mention">
                <div class="charge_box ">
                    <span class="">当前余额：</span>
                    <span class="">{{balance}}元</span>
                </div>
                <div class="charge_box">
                    <span>保证金</span>
                    <span>{{products.min_stock_finance | formatMoney}}</span>
                </div>
                <div class="charge_box ">
                    <span class="">总费用：</span>
                    <span>{{products.min_stock_finance | formatMoney}}</span>
                </div>
                <div class="charge_box">
                    <span class="">本次支付还差：</span>
                    <span class=""> {{countDifference}} 元</span>
                </div>

                <div class="recharge_button">
                    <button class="goforrecharge" @click="$router.push({name: 'personalCenter-recharge'})">立即充值</button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import select1 from './ranking.vue';
import select2 from './rule.vue';
import {getStockFinance, getStockFinances, stockFinance, competitionCount} from "~/api/trade";
import {errorMsg, successMsg, checkRealName, validLogin, getItem, toPercent, fixed, enlarge, formatMoney} from "~/plugins/methods";
import {getAccountCount} from "../../api/personal";
import {bus} from "~/plugins/bus";

export default {
    data() {
        return {
            tabView: 'select1',
            tabs: [{name: "排行榜"}, {name: "参赛规则"}],
            iscur: 0,
            totalPerson: '15362',
            arr: [],
            isCompetition: false,
            isEmpty: true, //true没有签名，false有签名
            sign: "",
            balance: '',
            confirmFinancing: false,
            successFinancing: false,
            dialogBalanceVisible: false,
            rate: "",
            products: {},
            boardRisk: [],
            isSubmitting: false,
            id: "",
            page: 1,
            pageSize: 100
        }
    },
    components: {
        select1,
        select2
    },
    filters: {
        formatMoney: formatMoney
    },
    methods: {
        tabChange(tab) {
            this.tabView = tab
        },
        join() {
            this.isCompetition = !this.isCompetition
        },
        getData() {
            let product = getItem("products")
            this.products = product[6][0]
            this.boardRisk = this.products.board_risk
        },
        getIndexData() {
            let indexData = getItem("indexData")
            this.rate = indexData.stock_finance_profit_extract_rate
        },
        submit() {
            let _this = this
            if (!validLogin()) {
                errorMsg("请先登录")
                bus.$emit('logout')
            } else if (this.balance < 2000) {
                this.dialogBalanceVisible = true
            } else if (this.isEmpty) {
                errorMsg("请阅读并签署《MOM投资顾问合作协议》")
            } else if (!checkRealName()) {
                this.$alert('请先实名认证再开通合约', '提示', {
                    confirmButtonText: '确定',
                    type: 'warning',
                    callback: action => {
                        _this.$router.push({name: 'personalCenter-authentication'})
                    }
                });
            } else if (Number(this.balance) < Number(this.total)) {
                this.dialogBalanceVisible = true
            } else {
                this.confirmFinancing = true
            }
        },
        findFirstFin() {
            getStockFinances(this.page, this.pageSize, {status: [1, 2, 3]}).then((res) => {
                let currentData = res.data.data
                let realData = []
                currentData.forEach(function (obj) {
                    if (obj.status !== 4) {
                        realData.push(obj)
                    }
                })
                this.id = realData[0].id
            })
        },
        stockFinance() {
            let _this = this
            this.isSubmitting = true
            let op = {
                productId: this.products.id,
                investMoney: 2000,
                autoCautionMoney: 0,
                sign: this.sign,
                isAutoExceed: 0,
                couponId: ""
            }
            stockFinance(op).then((res) => {
                if (res.status === 1) {
                    this.findFirstFin()
                    this.getCount()
                    this.confirmFinancing = false
                    this.successFinancing = true
                } else {
                    if (res.msg == '请先实名认证再开合约') {
                        _this.$dialog.toast({
                            mes: res.msg,
                            timeout: 1500,
                            callback: () => {
                                _this.$router.push({path: "/personalCenter/authentication"})
                            }
                        })
                    } else {
                        errorMsg(res.msg)
                    }
                }
            }).then((res) => {
                this.isSubmitting = false
                this.confirmFinancing = false
            })
        },
        toProtocol () {
            if (validLogin()) {
                let options = {}
                options.productId = this.products.id
                options.investMoney = 2000
                options.type = 'competition'
                this.$router.replace({name: "protocol", query: options})
            } else {
                errorMsg("请先登录")
                bus.$emit("logout")
            }
        },
        goForTrade() {
            this.successFinancing = false
            this.$router.replace({name: 'trade-buy', query: {id: this.id}})
        },
        showContract() {
            this.successFinancing = false
            this.$router.replace({name: 'trade-contractDetails', query: {id: this.id}})
        },
        // 获取账户可用余额
        getBalance() {
            getAccountCount().then((res) => {
                if (res.status == 1) {
                    this.balance = res.data.cash
                }
            })
        },
        getCount () {
            competitionCount().then((res) => {
                let totalPerson = res.data
                if (totalPerson) {
                    this.arr =  ("" + totalPerson).split("")
                }
                else {
                    this.arr = ["0"]
                }
            })
        }
    },
    computed: {
        countDifference() {
            return Number(2000 - this.balance).toFixed(2)
        },
        warningLine() {
            return this.products.min_stock_finance * this.products.product_times + this.products.min_stock_finance / 2
        },
        lossLine() {
            return this.products.min_stock_finance * this.products.product_times + this.products.min_stock_finance / 10 * 3
        },
    },
    mounted() {
        this.getData()
        this.getCount()
        this.getIndexData()
        if (validLogin()) {
            this.getBalance()
        }
        let query = this.$route.query
        if (JSON.stringify(query) != "{}") {
            query.sign == "" ? this.isEmpty = true : this.isEmpty = false
            this.sign = query.sign
            this.isCompetition = true
        }
    }
}
</script>

<style scoped lang="less">
    @import url(~assets/less/trade.less);
.page {
    height: 2350px;
    background-color: #01102C;
}
.main {
    background: url(~/images/img_bg.png) center center no-repeat;
    background-size: 100% 100%;
    height: 1100px;
    .row1 {
        font-size: 20px;
        color: #fff;
        padding-top: 770px;
        text-align: center;
        i {
            font-size: 32px;
            display: inline-block;
            width: 38px;
            height: 50px;
            line-height: 50px;
            background-color: #FE9403;
            border-radius: 5px;
            margin: 0 10px;
            text-align: center;
            vertical-align: middle;
        }
    }
    .row2 {
        padding-top: 56px;
        div {
            width: 360px;
            height: 80px;
            background: url(~/images/img_signup_normol.png) no-repeat;
            background-size: 100% 100%;
            cursor: pointer;
        }
        div:hover {
            background: url(~/images/img_signup_holder.png) no-repeat;
        }
    }
    .row-btn {
        div {
            background: url(~/images/img_rank_normal.png) no-repeat;
        }
        div:hover {
            background: url(~/images/img_rank_holding.png) no-repeat;
        }
    }
    .row3 {
        padding-top: 100px;
        display: flex;
        justify-content: center;
        .select {
            background: url(~/images/img_btn_normol.png) no-repeat;
            width: 600px;
            height: 90px;
            cursor: pointer;
            background-size: 100% 100%;
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding: 5px;
            span {
                font-size: 26px;
                color: #fff;
                flex: 1;
                line-height: 80px;
                text-align: center;
            }
        }
    }
    .competition-main {
        width: 1200px;
        height: 600px;
        background:#0F1943;
        border: 5px solid #2B386F;
        border-radius: 20px;
        margin-top: 100px;
        padding-top: 60px;
        text-align: left;
        .row4 {
            margin-bottom: 40px;
            padding-left: 232px;
            li {
                margin-bottom: 13px;
                span {
                    line-height: 22px;
                    i:nth-child(1) {
                        margin-right: 15px;
                    }
                    i:nth-child(2) {
                        margin-right: 90px;
                    }
                    i:nth-child(3) {
                        margin-right: 20px;
                        color: #999;
                    }
                }
                span:nth-child(1) {
                    width: 112px;
                    color: #999;
                    display: inline-block;
                }
                span:nth-child(2) {
                    color: #fff;
                }
                span:nth-child(3) {
                    color: #999;
                    margin-left: 15px;
                }
            }
        }
        .row5 {
            .warning {
                margin-left: 184px !important;
            }
            .txt1 {
                color: #fff;
                margin-left: 35px;
            }
            .txt2 {
                color: #999;
                margin-left: 20px;
            }
            .txt3 {
                margin-left: 61px !important;
                color: #999;
            }
            .txt4 {
                margin-left: 35px;
                color: #fff;
            }
        }
        .row6 {
            margin-top: 100px;
            text-align: center;
            p {
                font-size: 14px;
                color: #fff;
                span {
                    color: #449DE8;
                    padding-left: 4px;
                    cursor: pointer;
                }
            }
            .submit {
                width: 200px;
                height: 40px;
                line-height: 40px;
                background: #FE9403;
                border-radius: 5px;
                font-size: 14px;
                color: #fff;
                outline: none;
                border: none;
                margin-top: 20px;
                cursor: pointer;
            }
            .mt {
                margin-top: 10px;
            }
        }
    }
}

.cur {
    background-color: #1A2841;
}
.yellow {
    font-size: 20px;
    color: #FE9403;
    margin: 0 !important;
}
</style>
