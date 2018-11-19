<template>
    <div class="contractContent_page">
        <ul class="contractContent_page-header">
            <li :class="{selectButton: tab == 1}" @click="changeTab(1)" v-if="settled != 4">持仓</li>
            <li :class="{selectButton: tab == 2}" @click="changeTab(2)">资金流水</li>
            <li :class="{selectButton: tab == 3}" @click="changeTab(3)" v-if="settled != 4 && stockData.product_type != 6">提取利润</li>
            <li :class="{selectButton: tab == 4}" @click="changeTab(4)" v-if="settled != 4 && stockData.product_type != 6">追保</li>
            <li :class="{selectButton: tab == 5}" @click="changeTab(5)" v-if="settled != 4 && stockData.product_type != 6">追配</li>
        </ul>

        <!--holdings-->
        <div class="contractContent_page-content-holdings" v-if="tab == 1">
            <ul class="holding_header">
                <li>股票/代码</li>
                <li>持仓</li>
                <li>可卖</li>
                <li>成本</li>
                <li>现价</li>
                <li>市值</li>
                <li>盈亏</li>
                <li>操作</li>
            </ul>
            <ul class="holding_content" v-for="(value, key) in holdingData" :key="key">
                <li>
                    <span>{{value.stock_name}}</span>
                    <span>{{value.stock_code}}</span>
                </li>
                <li>
                    <span>{{value.holdings_quantity}}</span>
                </li>
                <li>
                    <span>{{value.available_sell_quantity}}</span>
                </li>
                <li>
                    <span>{{value.averagePrice}}</span>
                </li>
                <li>
                    <span :class="{fontRed: value.profitAndLoss >= 0, fontGreen: value.profitAndLoss < 0}">{{value.value}}</span>
                </li>
                <li>
                    <span>{{value.positionValue}}</span>
                </li>
                <li>
                    <span :class="{fontRed: value.profitAndLoss >= 0, fontGreen: value.profitAndLoss < 0}">{{value.profitAndLoss}}</span>
                </li>
                <li>
                    <button @click="goBuy(value)">买</button>
                    <button @click="goSell(value)">卖</button>
                </li>
            </ul>
        </div>
        <!--flow-->
        <div class="contractContent_page-content-flow" v-if="tab == 2">
            <ul class="flow_header">
                <li>ID</li>
                <li>交易时间</li>
                <li>交易类型</li>
                <li>交易金额</li>
                <li>余额</li>
                <li>股票/代码</li>
                <li>备注</li>
            </ul>
            <ul class="flow_content" v-for="(value, key) in flowData" :key="key">
                <li>
                    <span>{{value.id}}</span>
                </li>
                <li>
                    <span>{{value.updated_time}}</span>
                </li>
                <li>
                    <span>{{value.account_type_text}}</span>
                </li>
                <li>
                    <span :class="{fontRed: value.account_money >= 0, fontGreen: value.account_money < 0}">{{value.account_money}}</span>
                </li>
                <li>
                    <span>{{value.available_amount}}</span>
                </li>
                <li>
                    <span>{{value.stock_name}}</span> &nbsp;
                    <span>{{value.stock_code}}</span>
                </li>
                <li>
                    <span>{{value.account_remark}}</span>
                </li>
            </ul>

            <div class="flow_page">
                <el-pagination
                    small
                    layout="prev, pager, next"
                    :page-size="20"
                    @current-change="changePage"
                    :current-page.sync="page"
                    :total="total">
                </el-pagination>
            </div>

        </div>
        <!--profit-->
        <div class="contractContent_page-content-profit" v-if="tab == 3">
            <div class="profit_content">
                <label for="amount">提取金额</label>
                <input type="text" id="amount" v-model="profitAmount" placeholder="请输入提取金额">
                <span>最多可提取{{most}}元</span>
            </div>

            <div class="profit_button">
                <button @click="submitProfit">确认</button>
            </div>

            <p>交易时间9:15-11:15 12:45-15:15不可提取</p>
        </div>
        <!--deposit-->
        <div class="contractContent_page-content-deposit" v-if="tab == 4">
            <p>当合约接近预警线或平仓线，请及时追保或追配，以免系统平仓，追保管理费不变</p>

            <p>
                <span>您当前的账户余额</span>
                <span>{{balance}}</span>
            </p>

            <div class="profit_content">
                <label for="profitAmount">追加保证金</label>
                <input type="text" id="profitAmount" v-model="depositAmount" placeholder="请输入追加金额">
                <span>不低于10.00元</span>
            </div>

            <div class="profit_button">
                <button :disabled="isSubmitDeposit" @click="submitDeposit">确认</button>
            </div>
        </div>
        <!--financing-->
        <div class="contractContent_page-content-financing" v-if="tab == 5">
            <p>当合约可用余额不足，可以选择追配，追配倍数不变，补缴相应管理费即可</p>
            <p>
                <span>您当前的账户余额</span>
                <span>{{balance}}</span>
            </p>

            <div class="profit_content">
                <label for="financingAmount">追配保证金</label>
                <input type="text" id="financingAmount" v-model="financingAmount" placeholder="请输入追加金额" @keyup="calculateInterest">
                <span>不低于100.00元</span>
            </div>

            <ul class="financing_content">
                <li>
                    <span>追配操盘额</span>
                    <span>{{addFinaningMount}}</span>
                </li>
                <li>
                    <span>补缴管理费</span>
                    <span>{{payInterest}}</span>
                </li>
                <li>
                    <span>共计应支付</span>
                    <span class="fontRed">{{addFinancingTotal}}</span>
                    <span>(保证金+补缴管理费)</span>
                </li>
            </ul>

            <div class="profit_button">
                <button :disabled="isSubmitFinancing" @click="submitFinancing">确认</button>
            </div>
        </div>



<!--各种弹窗-->

<!--提盈确认弹窗-->
        <el-dialog
            title="提示"
            :visible.sync="confirmGetProfit"
            width="30%"
            :before-close="handleCloseProfit">
            <div class="confirm_getProfit-content">
                <ul>
                    <li>
                        <span>提取金额：</span>
                        <span>{{profitAmount}}</span>
                    </li>
                    <li v-if="rate">
                        <span>平台盈利分成：</span>
                        <span>{{(profitAmount * rate).toFixed(2)}}元</span>
                    </li>
                    <li>
                        <span>到账金额：</span>
                        <span>{{(profitAmount * (1 - rate)).toFixed(2)}}元</span>
                    </li>
                </ul>
            </div>
            <span slot="footer" class="dialog-footer">
    <el-button @click="confirmGetProfit = false">取 消</el-button>
    <el-button type="primary" @click="getProfit"  :disabled="isSubmitProfit">确 定</el-button>
  </span>
        </el-dialog>


    </div>
</template>

<script>
    import {getStockFinanceDetails, extractProfit, getAllowMaxExtractProfit, postFinanceCautionMoney,postAddCautionMoney, getStockFinance} from "../api/trade";
    import {errorMsg, successMsg} from "../plugins/methods";
    import {getUserInfo} from "../api/ajax";
    import {getAccountCount} from "../api/personal";
    import {bus} from "../plugins/bus";
    import {getItem} from "../plugins/methods";
    import {getInterest} from "../api/trade";

    export default {
        name: "contract",
        data() {
            return {
                tab: 2,
                id: "",
                isSubmitProfit: false,
                isSubmitDeposit: false,
                isSubmitFinancing: false,
                pageSize: 50,
                page: 1,
                flowData: [],
                total: 0,
                balance: "--",
                confirmGetProfit: false,
                profitAmount: "",
                depositAmount: "",
                financingAmount: "",
                rate: "",
                most: "",
                payInterest: "--",
                stockData: {}
        }
        },
        props: {
            settled: {
                type: String,
                default: "4"
            },
            holdingData: {
                type: Array,
                default: () => {
                    return []
                }
            }
        },
        methods: {
            changeTab(tab) {
                this.tab = tab
                switch (tab) {
                    case 2:
                        this.getFlow()
                        break;
                    case 3:
                        this.getMost()
                        break;
                }
            },
            getFlow() {
                getStockFinanceDetails({id: this.id}, this.page).then((res) => {
                    if (res.status == 1) {
                        this.total = res.data.total
                        this.pageSize = res.data.per_page
                        this.flowData = res.data.data
                    } else {
                        errorMsg(res.msg)
                    }
                })
            },
            changePage () {
                this.page++
                this.getFlow()
            },
            submitProfit() {
                if (Number(this.profitAmount) > Number(this.most)) {
                    errorMsg("提取金额不能大于最高可提利润")
                } else if (this.profitAmount <= 0) {
                    errorMsg("提取金额不能为0")
                } else {
                    this.confirmGetProfit = true
                }
            },
            getProfit () {
                let _this = this
                let mount = parseInt(_this.profitAmount)
                this.confirmGetProfit = false
                _this.isSubmitProfit = true
                extractProfit({id: _this.id, extractProfitVal: mount})
                    .then((res) => {
                        if (res.status === 1) {
                            successMsg("提取成功")
                            _this.getMost()
                            bus.$emit("refreshContract")
                            getUserInfo().then(function (res) {
                                _this.getMost()
                                _this.getData(_this.id)
                                _this.getBalance()
                            })
                        } else {
                            errorMsg(res.msg)
                        }
                    }).then((res) => {
                    _this.profitAmount = ""
                    _this.isSubmitProfit = false
                })
            },
            initFinancing () {
                this.financingAmount = ""
                this.payInterest = "--"
            },
            // 获取最大可提取金额
            getMost () {
                let _this = this
                getAllowMaxExtractProfit({id: this.id}).then((res) => {
                    if (res.status === 1) {
                        this.most = res.data.maxExtractProfit > 0 ? this.most = res.data.maxExtractProfit : this.most = "0.00"
                    } else {
                        _this.most = 0.00
                    }
                })
            },
            handleCloseProfit (done) {
                done()
            },
            getData () {
                let _this = this
                getStockFinance({id: this.id}).then(function (res) {
                    if (res.status === 1) {
                        _this.stockData = res.data
                    } else {
                        errorMsg('获取失败')
                    }
                })
                let indexData = getItem("indexData")
                this.rate = indexData.stock_finance_profit_extract_rate
            },
            getBalance () {
                getAccountCount().then((res) => {
                    if (res.status == 1) {
                        this.balance = res.data.cash
                    }
                })
            },
            calculateInterest () {
                if (this.financingAmount.length >= 3) {
                    let p = {}
                    p.stockFinanceId = Number(this.id)
                    p.financeAmount = Number(this.financingAmount) * this.stockData.product_times
                    getInterest(p).then((res) => {
                       if (res.code == 1) {
                            this.payInterest = res.data
                       }
                    })
                } else {
                    this.payInterest = "--"
                }
            },
            submitDeposit () {
                if (this.depositAmount < 10) {
                    errorMsg("最低追加10元")
                    return false
                }
                let _this = this
                _this.isSubmitDeposit = true
                let mount = Number(_this.depositAmount)
                postAddCautionMoney({
                    id: this.id,
                    postAddCautionMoney: mount})
                    .then(function (res) {
                        if (res.status === 1) {
                            getUserInfo().then((res) => {
                                _this.getData()
                                _this.getBalance()
                            })
                            bus.$emit("refreshContract")
                            successMsg("追加成功")
                        } else {
                            errorMsg(res.msg)
                        }
                    }).then((res) => {
                    _this.isSubmitDeposit = false
                    _this.depositAmount = ""
                })
            },
            submitFinancing () {
                if (this.financingAmount < 10) {
                    errorMsg("最低追加10元")
                    return false
                }
                let _this = this
                _this.isSubmitFinancing = true
                let mount = Number(_this.financingAmount)
                postFinanceCautionMoney({
                    id: this.id,
                    postFinanceCautionMoney: mount})
                    .then(function (res) {
                        if (res.status === 1) {
                            getUserInfo().then((res) => {
                                _this.getData()
                                _this.getBalance()
                                _this.initFinancing()
                            })
                            successMsg("追加成功")
                            bus.$emit("refreshContract")
                        } else {
                            errorMsg(res.msg)
                        }
                    }).then((res) => {
                    _this.financingAmount = ""
                    _this.isSubmitFinancing = false
                })
            },
            goSell(value) {
                this.$router.push({name: 'trade-sell', query: {id: value.stock_finance_id, entrustID: value.id}})
            },
            goBuy(value) {
                this.$router.push({name: 'trade-buy', query: {code: value.stock_code, id: value.stock_finance_id}})
            },
        },
        watch: {
            settled(newVal, oldVal) {
                if (newVal == 4) {
                    this.changeTab(2)
                } else {
                    this.changeTab(1)
                }
            }
        },
        computed: {
            // 追加操盘额
            addFinaningMount () {
                if (this.financingAmount >= 100) {
                    return this.financingAmount * this.stockData.product_times
                } else {
                    return 0
                }
            },
            // 追配共计
            addFinancingTotal () {
                if (this.payInterest != "--") {
                    return Number(this.financingAmount) + Number(this.payInterest)
                } else {
                    return "--"
                }
            }
        },
        mounted() {
            this.id = this.$route.query.id
            this.getData()
            this.getBalance()
            if (this.settled == 4) {
                this.changeTab(2)
            } else {
                this.changeTab(1)
            }
        }
    }
</script>

<style scoped lang="less">
    @import url(~assets/less/contract.less);
</style>
