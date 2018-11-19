<template>
    <no-ssr>
    <div class="contractDetails_page">

        <div class="contractDetails_page-header">
            <div class="contractDetails_page-header-left">
                <p>
                    <span>合约ID</span>&nbsp;&nbsp;
                    <span>{{stockData.product_name}}—{{stockData.id}}</span>
                </p>
                <p>
                    <span>申请日期</span>
                    <span>{{stockData.created_time}}</span>
                    <span>到期日期</span>
                    <span>{{nextInterest}}</span>
                    <span v-if="stockData.status == 4">结算日期</span>
                    <span v-if="stockData.status == 4">{{stockData.stock_finance_settleup}}</span>
                </p>
            </div>
            <div class="contractDetails_page-header-right" v-if="stockData.status != 4">
                <button @click="validSettled">结算</button>
                <nuxt-link :to="{name: 'trade-buy', query: {id: id}}"><button @click="goTrade">去交易</button></nuxt-link>
            </div>
        </div>


        <ul class="contractDetails_page-number" v-if="stockData.status != 4">
            <li>
                <div>
                    <span>当前资产</span>
                    <span>{{stockData.totalAssets}}</span>
                    <div >
                        <div :class="{
                bgRed: Number(stockData.totalAssets) > Number(stockData.precautious_line_amount),
                bgGreen: Number(stockData.totalAssets) <= Number(stockData.liiquidation_line_amount),
                bgOrange: Number(stockData.totalAssets) < Number(stockData.precautious_line_amount) && Number(stockData.totalAssets) > Number(stockData.liiquidation_line_amount),
                moreWarning: Number(stockData.totalAssets) > Number(stockData.precautious_line_amount),
                equalWarning: Number(stockData.totalAssets) == Number(stockData.precautious_line_amount),
                lessWarning: Number(stockData.totalAssets) < Number(stockData.precautious_line_amount) && Number(stockData.totalAssets) >Number(stockData.liiquidation_line_amount),
                equalLoss: Number(stockData.totalAssets) == Number(stockData.liiquidation_line_amount),
                lessLoss: Number(stockData.totalAssets) < Number(stockData.liiquidation_line_amount),
                                }"></div>
                    </div>
                </div>
                <div>
                    <span>预警线</span>
                    <span>{{stockData.precautious_line_amount}}</span>
                    <div >
                        <div :class="{
                                     bgRed: Number(stockData.totalAssets) > Number(stockData.precautious_line_amount),
                bgGreen: Number(stockData.totalAssets) <= Number(stockData.liiquidation_line_amount),
                bgOrange: Number(stockData.totalAssets) < Number(stockData.precautious_line_amount) && Number(stockData.totalAssets) > Number(stockData.liiquidation_line_amount),
                                }" class="equalWarning"></div>
                    </div>
                </div>
                <div>
                    <span>平仓线</span>
                    <span>{{stockData.liiquidation_line_amount}}</span>
                    <div>
                        <div :class="{
                                     bgRed: Number(stockData.totalAssets) > Number(stockData.precautious_line_amount),
                bgGreen: Number(stockData.totalAssets) <= Number(stockData.liiquidation_line_amount),
                bgOrange: Number(stockData.totalAssets) < Number(stockData.precautious_line_amount) && Number(stockData.totalAssets) > Number(stockData.liiquidation_line_amount),
                                }" class="equalLoss"></div>
                    </div>
                </div>
            </li>


            <li>
                <div>
                    <span>可用余额</span>
                    <span>{{stockData.available_amount}}</span>
                </div>
                <div>
                    <span>持仓市值</span>
                    <span>{{stockData.positionValue}}</span>
                </div>
                <div>
                    <span>持仓比例</span>
                    <span>{{stockData.positionRate}}%</span>
                </div>
            </li>

            <li>
                <div>
                    <span>保证金</span>
                    <span>{{stockData.freeze_money}}</span>
                </div>
                <div>
                    <span>操盘额</span>
                    <span>{{stockData.current_finance_amount}}</span>
                </div>
                <div>
                    <span>总操盘资金</span>
                    <span>{{stockData.totalFinanceAmount}}</span>
                </div>
            </li>

            <li>
                <div>
                    <span>盈亏</span>
                    <span :class="{fontRed: stockData.profitAndLoss >= 0, fontGreen: stockData.profitAndLoss < 0}">{{stockData.profitAndLoss}}</span>
                </div>
                <div>
                    <span>盈亏比例</span>
                    <span :class="{fontRed: stockData.profitAndLoss >= 0, fontGreen: stockData.profitAndLoss < 0}">{{stockData.profitAndLossRate}}%</span>
                </div>
                <div>
                    <span>冻结资金</span>
                    <span>{{Number(stockData.freeze_charge_money) + Number(stockData.freeze_buying_money)}}</span>
                </div>
            </li>

        </ul>


        <ul class="contractDetails_page-number_settled" v-if="stockData.status == 4">
            <li>
                <div>
                    <span>当前资产</span>
                    <span>0.00</span>
                </div>
                <div>
                    <span>预警线</span>
                    <span>{{stockData.precautious_line_amount}}</span>
                </div>
                <div>
                    <span>平仓线</span>
                    <span>{{stockData.liiquidation_line_amount}}</span>
                </div>
            </li>

            <li>
                <div>
                    <span>可用余额</span>
                    <span>{{stockData.available_amount}}</span>
                </div>
                <div>
                    <span>持仓市值</span>
                    <span>{{stockData.positionValue}}</span>
                </div>
                <div>
                    <span>持仓比例</span>
                    <span>{{stockData.positionRate}}%</span>
                </div>
            </li>

            <li>
                <div>
                    <span>保证金</span>
                    <span>{{stockData.freeze_money}}</span>
                </div>
                <div>
                    <span>操盘额</span>
                    <span>{{stockData.current_finance_amount}}</span>
                </div>
                <div>
                    <span>总操盘资金</span>
                    <span>{{stockData.totalFinanceAmount}}</span>
                </div>
            </li>

            <li>
                <div>
                    <span>盈亏</span>
                    <span :class="{fontRed: stockData.profitAndLoss >= 0, fontGreen: stockData.profitAndLoss < 0}">{{stockData.profitAndLoss}}</span>
                </div>
                <div>
                    <span>盈亏比例</span>
                    <span :class="{fontRed: stockData.profitAndLoss >= 0, fontGreen: stockData.profitAndLoss < 0}">{{stockData.profitAndLossRate}}%</span>
                </div>
                <div>
                    <span>冻结资金</span>
                    <span>{{Number(stockData.freeze_charge_money) + Number(stockData.freeze_buying_money)}}</span>
                </div>
            </li>

        </ul>

        <ul class="contractDetails_page-info">
            <li>
                <div>
                    <span>合约状态</span>
                    <span class="fontRed" v-if="Number(stockData.totalAssets) >= Number(stockData.precautious_line_amount) && stockData.status != 4">操盘中</span>
                    <span class="fontOrange" v-if="Number(stockData.totalAssets) < Number(stockData.precautious_line_amount) && Number(stockData.totalAssets) > Number(stockData.liiquidation_line_amount) && stockData.status != 4">触预警线（单向冻结）</span>
                    <span class="fontGreen" v-if="Number(stockData.totalAssets) <= Number(stockData.liiquidation_line_amount) && stockData.status != 4">触平仓线（双向冻结）</span>
                    <span class="fontBlue" v-if="stockData.status == 4">已结算</span>
                </div>
                <div>
                    <span>预警线差额</span>
                    <span :class="{
                    fontRed: Number(stockData.totalAssets) >= Number(stockData.precautious_line_amount) && stockData.status != 4,
                    fontOrange: Number(stockData.totalAssets) < Number(stockData.precautious_line_amount) && Number(stockData.totalAssets) > Number(stockData.liiquidation_line_amount) && stockData.status != 4,
                    fontGreen: Number(stockData.totalAssets) <= Number(stockData.liiquidation_line_amount) && stockData.status != 4
                    }" v-if="stockData.status != 4">{{precautiousLess}}</span>
                    <span v-if="stockData.status == 4">--</span>
                </div>
                <div>
                    <span>平仓线差额</span>
                    <span :class="{
                    fontRed: Number(stockData.totalAssets) >= Number(stockData.precautious_line_amount) && stockData.status != 4,
                    fontOrange: Number(stockData.totalAssets) < Number(stockData.precautious_line_amount) && Number(stockData.totalAssets) > Number(stockData.liiquidation_line_amount) && stockData.status != 4,
                    fontGreen: Number(stockData.totalAssets) <= Number(stockData.liiquidation_line_amount) && stockData.status != 4
                    }" v-if="stockData.status != 4">{{liiquidationLess}}</span>
                    <span v-if="stockData.status == 4">--</span>
                </div>
            </li>

            <li>
                <div>
                    <span>管理费</span>
                    <span v-if="stockData.product_type == 2">{{stockData.interest_per_day}}/月</span>
                    <span v-if="stockData.product_type == 4">{{stockData.interest_per_day}}/周</span>
                    <span v-if="stockData.product_type == 1 || stockData.product_type == 5">{{stockData.interest_per_day}}/天</span>
                    <span v-if="stockData.product_type == 6">0 元/月</span>
                </div>

                <div v-if="rate">
                    <span>盈利分成</span>
                    <span>{{showRate}}%</span>
                </div>

                <div>
                    <span>已提利润</span>
                    <span>{{stockData.withdraw_total_profit}}</span>
                </div>
            </li>

            <li v-if="stockData.coupon_stock_finance">
                <div>
                    <p>已使用优惠券{{stockData.coupon_stock_finance.coupon.max_discount | formatMoney}}单次{{rule}}%抵扣</p>
                </div>
                <div v-if="level.length">
                    <span>单票持仓</span>
                    <span v-for="(value, key) in level" :key="key">
                        <span class="content">{{value.broad}}</span>
                        <span class="content">{{value.rate}}</span>
                   </span>
                </div>
            </li>
        </ul>


        <ul class="contractDetails_page-change" v-if="stockData.status != 4">
            <li>
                <span>自动补保</span>
                <div v-if="stockData.product_type != 6">
                    <el-radio-group v-model="autoCautionMoney" fill="#DC2D39" @change="changeAuto">
                        <el-radio :label="1" >是</el-radio>
                        <el-radio :label="0" fill="#DC2D39">否</el-radio>
                    </el-radio-group>
                </div>
                <span @click="showAutoPay" v-if="stockData.product_type != 6">查看自动补保说明</span>
                <span style="font-size: 14px" v-if="stockData.product_type == 6">否</span>
            </li>

            <li>
                <span>自动延期</span>
                <div class="entrust" v-if="stockData.product_type == 2 || stockData.product_type == 4">
                    <el-radio-group v-model="isAutoExceed" @change="changeDelay">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </div>
                <span  @click="showDelayMention" v-if="stockData.product_type == 2 || stockData.product_type == 4">查看自动延期说明</span>
                <span style="font-size: 14px" v-if="stockData.product_type != 2 && stockData.product_type != 4 && stockData.product_type != 6">是</span>
                <span style="font-size: 14px" v-if="stockData.product_type == 6">否</span>
            </li>
        </ul>


        <div class="contractDetails_page-details">
            <v-content :settled="settled" :holdingData="holdingData" />
        </div>

<!--申请结算的弹窗-->
        <el-dialog
            title="结算合约"
            :visible.sync="applySettle"
            width="350px"
            :before-close="handleClose">
            <div class="confirm_financing-content">
                <ul>
                    <li>
                        <span>合约：</span>
                        <span>{{stockData.product_name}}-{{stockData.id}}</span>
                    </li>
                    <li>
                        <span>合约当前资产：</span>
                        <span>{{stockData.totalAssets}}</span>
                    </li>
                    <li>
                        <span>可用余额：</span>
                        <span>{{stockData.available_amount}}</span>
                    </li>
                    <li>
                        <span>保证金：</span>
                        <span>{{stockData.freeze_money}}</span>
                    </li>
                    <li>
                        <span>累计盈亏：</span>
                        <span>{{stockData.profitAndLoss}}</span>
                    </li>
                    <li>
                        <span>已提盈利：</span>
                        <span v-if="stockData.withdraw_total_profit">{{stockData.withdraw_total_profit}}</span>
                        <span v-else>0</span>
                    </li>
                    <li>
                        <span>结算金额：</span>
                        <span>{{total}}</span>
                    </li>
                </ul>
            </div>
            <div class="button_group">
                <el-button @click="applySettle = false" size="small">取 消</el-button>
                <el-button type="danger" size="small" @click="confirmSettle" :disabled="isSubmitSettle">确 定</el-button>
            </div>
        </el-dialog>

    </div>
    </no-ssr>
</template>

<script>
    import {getStockFinance, settleup, modifyAutoExceed, modifyAutoSupplyCautionMoney} from "../../api/trade";
    import {errorMsg, successMsg} from "../../plugins/methods";
    import {getItem} from "../../plugins/methods";
    import vContent from '~/components/contract.vue'
    import {bus} from "../../plugins/bus";
    import {getUserInfo} from "../../api/ajax";
    import {enlarge} from "../../plugins/methods";
    import {formatMoney, formatDate} from "../../plugins/methods";


    export default {
        name: "contractDetails",
        data () {
            return {
                stockData: {
                    status: 4
                },
                id: '',
                level: [],
                rate: "",
                isAutoExceed: 2,
                autoCautionMoney: 2,
                settled: "4",
                holdingData: [],
                applySettle: false,
                isSubmitSettle: false,
                refreshData: null
            }
        },
        filters: {
            formatMoney: formatMoney
        },
        methods: {
            getData () {
                let _this = this
                getStockFinance({id: this.id}).then(function (res) {
                    if (res.status === 1) {
                        _this.stockData = res.data
                        _this.isAutoExceed = _this.stockData.is_auto_exceed
                        _this.autoCautionMoney = _this.stockData.is_auto_supply_caution_money
                        _this.settled = _this.stockData.status.toString()
                        _this.holdingData = _this.stockData.transactionList
                        _this.level = _this.stockData.board_risk
                    } else {
                        errorMsg('获取失败')
                    }
                })
            },
            getIndexData () {
                let indexData = getItem('indexData')
                this.rate = indexData.stock_finance_profit_extract_rate
            },
            showAutoPay () {
                bus.$emit("openPay")
            },
            showDelayMention () {
                bus.$emit("openDelay")
            },
            goTrade () {
                bus.$emit("currentPage")
            },
            validSettled () {
                let endTime, now, d
                now = new Date().getTime()
                d = new Date(this.stockData.next_interest_charge_time)
                endTime = new Date(d.setDate(d.getDate() + 1)).setHours(15, 0, 0)
                // endTime = d.setHours(15, 0, 0)
                if (now > endTime || this.stockData.product_type != 6) {
                    this.applySettle = true
                } else {
                    this.$confirm('现在结算合约视为放弃比赛，确定要这样做吗？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.applySettle = true
                    }).catch(() => {
                    })
                }
            },
            // 申请结算的方法
            confirmSettle () {
                this.applySettle = false
                let _this = this
                this.isSubmitSettle = true
                settleup({id: _this.stockData.id}).then(function (res) {
                    if (res.status === 1) {
                        getUserInfo()
                        successMsg('结算成功')
                    } else {
                        errorMsg(res.msg)
                    }
                    _this.$router.push({name: 'trade-financingDetails', query: {id: 1}})
                }).then(() => {
                    this.isSubmitSettle = false
                })
            },
            handleClose(done) {
                done()
            },
            changeAuto () {
                this.$confirm('确定要修改自动补保么？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    showClose: false
                }).then(() => {
                    let p = {}
                    p.id = this.stockData.id
                    p.isAutoSupplyCautionMoney = this.autoCautionMoney
                    modifyAutoSupplyCautionMoney(p).then((res) => {
                        if (res.status == 1) {
                            this.getData()
                            successMsg("修改成功")
                        } else {
                            errorMsg(res.msg)
                        }
                    })
                }).catch(() => {
                    if (this.autoCautionMoney == 1) {
                        this.autoCautionMoney = 0
                    } else {
                        this.autoCautionMoney = 1
                    }
                });
            },
            changeDelay () {
                this.$confirm('确定要修改自动延期么？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    showClose: false
                }).then(() => {
                    let p = {}
                    p.id = this.stockData.id
                    p.isAutoExceed = this.isAutoExceed
                    modifyAutoExceed(p).then((res) => {
                        if (res.status == 1) {
                            successMsg("修改成功")
                            this.getData()
                        } else {
                            errorMsg(res.msg)
                        }
                    })
                }).catch(() => {
                    if (this.isAutoExceed == 1) {
                        this.isAutoExceed = 0
                    } else {
                        this.isAutoExceed = 1
                    }
                });
            }
        },
        computed: {
            showRate () {
                if (this.rate) {
                    return ((1 - this.rate) * 100)
                } else {
                    return "--"
                }
            },
            nextInterest () {
                let time
                if (this.stockData.next_interest_charge_time) {
                    if (this.stockData.product_type != 6 && this.stockData.product_type != 3) {
                        time = this.stockData.next_interest_charge_time.split(' ')[0]
                    } else {
                        let d, endTime
                        d = new Date(this.stockData.next_interest_charge_time)
                        endTime = new Date(d.setDate(d.getDate() + 1))
                        time = formatDate(endTime, 'yyyy-MM-dd')
                    }
                    return time
                } else if (this.stockData.product_type == 3) {
                    time = this.stockData.end_time
                    return time
                } else {
                    return "--"
                }
            },
            precautiousLess () {
                return (this.stockData.totalAssets - this.stockData.precautious_line_amount).toFixed(3)
            },
            liiquidationLess () {
                return (this.stockData.totalAssets - this.stockData.liiquidation_line_amount).toFixed(3)
            },
            total () {
                return Number(this.stockData.freeze_money) + Number(this.stockData.profitAndLoss)
            },
            rule () {
                let num
                num = enlarge(this.stockData.coupon_stock_finance.coupon.rule, 2)
                return num
            }
        },
        components: {
            vContent
        },
        mounted () {
            let _this = this
            this.id = this.$route.query.id
            this.getIndexData()
            this.getData()
            this.refreshData = setInterval(this.getData, 8000)
            bus.$on("refreshContract", (obj) => {
                _this.getIndexData()
                _this.getData()
            })
        },
        beforeDestroy () {
            bus.$off("refreshContract")
            clearInterval(this.refreshData)
        }
    }
</script>

<style scoped lang="less">
    @import url(~assets/less/contract.less);
</style>
