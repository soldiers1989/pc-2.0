<template>
    <div class="day_page">
        <div class="buy_amount">
            <p>保证金</p>
            <div>
                <ul class="amount_list">
                    <li v-for="(value, key) in amountData" :key="key">
                        <span :class="{selectAmount: amountIndex == key}"
                              @click="checkAmount(value, key, 1)">{{value}}</span>
                    </li>
                </ul>

                <div class="scan_amount" v-if="showScanInput">
                    <input type="text" v-model="scanAmount" :placeholder= "minPut + '元-' + maxPut + '万元，100的整数倍'" @input="changeAmount(1)">
                    <p v-show="(scanAmount < minPut) || (scanAmount > maxPut)">请输入{{minPut}} 元—{{maxPut}} 万元，100的整数倍</p>
                </div>
            </div>

        </div>

        <div class="buy_product">
            <p>操盘产品</p>
            <div>
                <ul class="amount_list">
                    <li v-for="(value, key) in productData" :key="key">
                        <span :class="{selectAmount: selectProduct.id == value.id}"
                              v-if="value.disable"
                              @click="checkMultiple(value, 1)">{{value.product_times}}倍</span>
                    </li>
                </ul>
            </div>

        </div>

        <div class="financing_info">
            <ul>
                <li>
                    <span>操盘额</span>
                    <span>{{financingAmount}}</span>
                </li>
                <li>
                    <span>预警线</span>
                    <span>{{lossLine}}</span>
                    <span>禁止买入</span>
                </li>
                <li>
                    <span>总操盘资金</span>
                    <span>{{totalFinancingAmount}}</span>
                    <span>保证金+操盘额</span>
                </li>
                <li>
                    <span>平仓线</span>
                    <span>{{warningLine}}</span>
                </li>
            </ul>
        </div>

        <div class="financing_params_week">
            <ul>
                <li v-if="level.length || profitRate">
                    <p v-if="level.length">
                        <span>单票持仓</span>
                        <span v-for="(value, key) in level" :key="key">
                            <span class="content">{{value.broad}}</span>
                            <span class="content">{{value.rate}}</span>
                        </span>
                    </p>
                    <p v-if="profitRate">
                        <span>盈利分成</span>
                        <span>{{(1-profitRate) * 100}}%</span>
                    </p>
                </li>
                <li class="auto">
                    <span>自动延期</span>
                    <div>
                        <el-radio :label="1" :value="1" v-model="isAutoExceed">是</el-radio>
                        <el-radio :label="0" :value="0" v-model="isAutoExceed">否</el-radio>
                    </div>
                    <span @click="showDelayMention">
                        <!-- <img src="~static/images/img_mark.png" alt=""> -->
                        <span>自动延期说明</span>
                    </span>
                </li>

                <li class="auto">
                    <span>自动补保</span>
                    <div>
                        <el-radio :label="1" :value="1" v-model="autoCautionMoney">是</el-radio>
                        <el-radio :label="0" :value="0" v-model="autoCautionMoney">否</el-radio>
                    </div>
                    <span @click="showAutoPay">
                        <!-- <img src="~static/images/img_mark.png" alt=""> -->
                        <span>自动补保说明</span>
                    </span>
                </li>

                <li>
                    <span>利率</span>
                    <span>{{showRate}}%</span>
                </li>

                <li>
                    <span>管理费</span>
                    <span>{{manageCost}}元/月</span>
                </li>
            </ul>
        </div>

        <div class="financing_total" v-if="isCoupon">
            <ul>
                <li>
                    <span>优惠券</span>
                    <div>
                        <el-select v-model="selectDiscount" placeholder="请选择" clearable @change="changeDiscount" size="mini">
                            <el-option
                                v-for="item in discountData"
                                :key="item.id"
                                :label="item.max_discount | formatMoney"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <span v-if="!discountData.length">无可用</span>
                    <span v-if="discountData.length">{{discountData.length}}张可用</span>

                </li>

                <li v-if="selectDiscount" class="coupon_info">
                    <span></span>
                    <span>单次{{couponName}}%抵扣</span>
                    <span >
                        优惠券余额 {{selectDiscountData.remain_discount | formatMoney}}
                    </span>
                    <span>
                        到期日期 {{discountEndTime}}
                    </span>
                </li>

                <li class="last_li">
                    <span>共计支付</span>
                    <span>
                        <span>{{total}}</span>元
                    </span>
                </li>
            </ul>
        </div>

        <div class="financing_button">
            <p>
                阅读并签署
                <span @click="goProtocol">《MOM投资顾问合作协议》</span>
            </p>
            <p class="red">温馨提示：申请操盘资金前请仔细阅读合作协议并签名</p>
            <p>
                <button @click="validApply">立即开通</button>
            </p>
        </div>

        <!--确认申请-->
        <el-dialog
            title="确认申请"
            :visible.sync="confirmFinancing"
            width="350px"
            :before-close="confirmFinancingClose"
            :close-on-click-modal="false">
            <div class="confirm_financing-content">
                <ul>
                    <li>
                        <span>合约类型：</span>
                        <span>按月操盘</span>
                    </li>
                    <li>
                        <span>合约产品：</span>
                        <span>Y{{selectProduct.product_times}}</span>
                    </li>
                    <li>
                        <span>保证金：</span>
                        <span>{{amount}}</span>
                    </li>
                    <li>
                        <span>操盘额：</span>
                        <span>{{financingAmount}}</span>
                    </li>
                    <li>
                        <span>总操盘资金：</span>
                        <span>{{totalFinancingAmount}}</span>
                    </li>
                    <li>
                        <span>管理费：</span>
                        <span>{{manageCost}}</span>
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
            :before-close="confirmFinancingClose"
            :close-on-click-modal="false">
            <div class="confirm_financing">
                <div class="success_financing-content">
                    <ul>
                        <li>
                            <span>合约类型：</span>
                            <span>按月操盘</span>
                        </li>
                        <li>
                            <span>合约产品：</span>
                            <span>Y{{selectProduct.product_times}}—{{id}}</span>
                        </li>
                    </ul>
                    <p>
                        提示：
                    </p>
                    <p>
                        请确保您的账户余额足够支付合约管理费以免因欠费而平仓
                    </p>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showContract">查看合约</el-button>
                <el-button type="primary" @click="goForTrade">去交易</el-button>
            </span>
        </el-dialog>

        <!--余额不足的弹窗-->
        <el-dialog
            title="余额不足"
            :visible.sync="dialogBalanceVisible"
            width="400px"
            :before-close="handleClose"
            :close-on-click-modal="false">
            <div class="balance_pay_mention">
                <div class="charge_box ">
                    <span class="">当前余额：</span>
                    <span class="">{{balance}}元</span>
                </div>
                <div class="charge_box">
                    <span class="">支付保证金：</span>
                    <span class="">{{amount}} 元</span>

                </div>
                <div class="charge_box ">
                    <span class="">预存管理费：</span>
                    <span class="">{{manageCost}}元</span>
                </div>
                <div class="charge_box ">
                    <span class="">总费用：</span>
                    <span class="">{{Number(total).toFixed(2)}}元</span>
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
    import {getItem} from "../../plugins/methods";
    import {getAccountCount} from "../../api/personal";
    import {getStockFinance, getStockFinances, stockFinance, getCoupons} from "../../api/trade";
    import {errorMsg, successMsg} from "../../plugins/methods";
    import {validLogin} from "../../plugins/methods";
    import {checkRealName} from "../../plugins/methods";
    import {bus} from "../../plugins/bus";
    import {toPercent, fixed, enlarge} from "../../plugins/methods";
    import {formatMoney} from "../../plugins/methods";

    export default {
        name: "month",
        data() {
            return {
                productData: [],
                amountData: [],
                scanAmount: "",
                amountIndex: "",
                amount: '', // 选择的金额
                showScanInput: false, // 其他金额的input
                selectProduct: {}, //选中的产品,
                minPut: "", //最小保证金
                maxPut: "", // 最大保证金
                mul: "", //倍数
                rate: "", //利率
                level: [],
                profitRate: "",
                isAutoExceed: 2,
                autoCautionMoney: 2,
                discountData: [],
                selectDiscount: "",
                selectDiscountData: [],
                isSubmitting: false,
                confirmFinancing: false,
                successFinancing: false,
                dialogBalanceVisible: false,
                id: "",
                isEmpty: true, //true没有签名，false有签名
                balance: '',
                sign: '',
                page: 1,
                pageSize: 50,
                isCoupon: false
            }
        },
        methods: {
            checkAmount(value, key, lock) {
                if (lock == 1) {
                    this.isEmpty = true
                }
                this.amountIndex = key
                if (value == "其他金额") {
                    this.amount = this.scanAmount
                    this.showScanInput = true
                } else {
                    this.amount = value
                    this.showScanInput = false
                }
            },
            changeAmount(lock) {
                if (lock == 1) {
                    this.isEmpty = true
                }
                if (this.scanAmount > this.maxPut) {
                    errorMsg("输入金额超过该产品支持的最大保证金：" + this.maxPut)
                    this.scanAmount =  this.maxPut
                } else {
                    this.amount = this.scanAmount
                }
            },
            filtrationProduct() {
                let _this = this
                for (let item in this.productData) {
                    let minPut = this.productData[item].min_stock_finance
                    let max = parseInt(this.productData[item].max_stock_finance / this.productData[item].product_times)
                    let maxPut = parseInt(max / 100) * 100
                    if (this.amount >= Number(minPut) && this.amount <= Number(maxPut)) {
                        _this.productData[item].disable = 1
                    } else {
                        _this.productData[item].disable = 0
                    }
                }
            },
            checkMultiple(value, lock) {
                if (lock == 1) {
                    this.isEmpty = true
                }
                this.selectProduct = value
                this.mul = this.selectProduct.product_times
                this.rate = this.selectProduct.interests_rate
                this.minPut = this.selectProduct.min_stock_finance
                let maxPut = parseInt(this.selectProduct.max_stock_finance / this.selectProduct.product_times)
                this.maxPut = parseInt(maxPut / 100) * 100
                this.level = this.selectProduct.board_risk
            },
            getProduct() {
                this.productData = getItem("products")[2]
                this.checkMultiple(this.productData[0], 0)
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
            // 获取账户可用余额
            getBalance() {
                getAccountCount().then((res) => {
                    if (res.status == 1) {
                        this.balance = res.data.cash
                    }
                })
            },
            getIndexData() {
                let indexData = getItem("indexData")
                this.profitRate = indexData.stock_finance_profit_extract_rate
                this.isCoupon = Number(indexData.isEnableCoupon) && validLogin()
            },
            changeDiscount() {
                this.discountData.forEach((ele, key) => {
                    if (ele.id == this.selectDiscount) {
                        this.selectDiscountData = ele
                    }
                })
            },
            goProtocol() {
                if (validLogin()) {
                    if (this.amount != "") {
                        let options = {}
                        options.productId = this.selectProduct.id
                        options.investMoney = this.amount
                        options.type = this.$route.name
                        options.autoCautionMoney = this.autoCautionMoney
                        options.isAutoExceed = this.isAutoExceed
                        options.selectDiscountId = this.selectDiscount
                        this.$router.push({name: "protocol", query: options})
                    } else {
                        errorMsg("请先输入保证金")
                    }
                } else {
                    errorMsg("请先登录")
                    bus.$emit("logout")
                }
            },
            validApply() {
                if (!validLogin()) {
                    errorMsg("请先登录")
                    this.$router.push({name: 'login'})
                } else if (!this.amount) {
                    errorMsg("请选择或填入正确的投入资金")
                } else if (!this.selectProduct.id) {
                    errorMsg("请先选择操盘产品")
                } else if (Number(this.balance) < Number(this.total)) {
                    this.dialogBalanceVisible = true
                } else if (!checkRealName()) {
                    errorMsg("请先实名认证再开通合约")
                } else if (this.isEmpty) {
                    errorMsg("请阅读并签署《MOM投资顾问合作协议》")
                } else if (this.autoCautionMoney == 2) {
                    errorMsg("请选择是否自动补保")
                    // 是否补保
                } else if (this.isAutoExceed == 2) {
                    errorMsg("请选择是否自动延期")
                    // 是否补保
                } else {
                    this.confirmFinancing = true
                }
            },
            stockFinance() {
                this.isSubmitting = true
                let op = {
                    productId: this.selectProduct.id,
                    investMoney: this.amount,
                    isAutoExceed: this.isAutoExceed,
                    autoCautionMoney: this.autoCautionMoney,
                    sign: this.sign,
                    couponId: this.selectDiscount
                }
                stockFinance(op).then((res) => {
                    if (res.status === 1) {
                        this.findFirstFin()
                        this.confirmFinancing = false
                        this.successFinancing = true
                        this.autoCautionMoney = 2
                        this.isAutoExceed = 2
                        this.checkAmount(this.amountData[0], 0, 1)
                        this.checkMultiple(this.productData[0], 1)
                    } else {
                        if (res.msg == '请先实名认证再开合约') {
                            this.$confirm('请先实名认证再开合约', '提示', {
                                confirmButtonText: '去实名',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                this.$router.push({path: "/personalCenter/authentication"})
                            }).catch(() => {
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
            /*弹窗关闭*/
            confirmFinancingClose(done) {
                done()
            },
            dialogAutoPayClose(done) {
                done()
            },
            handleClose (done) {
                done()
            },
            showContract() {
                // 查看合约
                this.$router.push({name: 'trade-contractDetails', query: {id: this.id}})
            },
            goForTrade() {
                // 去交易
                this.$router.push({name: 'trade-buy', query: {id: this.id}})
            },
            showAutoPay () {
                bus.$emit("openPay")
            },
            showDelayMention () {
                bus.$emit("openDelay")
            },
            valid() {
                this.$confirm('您还没有登录，是否去登录', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$router.push({name: 'login'})
                })
            },
            getCoupon () {
                getCoupons({type: 3}).then((res) => {
                    if (res.status) {
                        this.discountData = res.data.data
                    }
                })
            }
        },
        watch: {
            amount(newVal, oldVal) {
                if (newVal == "") {
                    this.amount = 200
                }
                if (newVal != oldVal) {
                    this.filtrationProduct()
                }
            }
        },
        filters:{
            toPercent: toPercent,
            formatMoney: formatMoney
        },
        computed: {
            financingAmount() {
                //  操盘额
                if (this.amount >= this.minPut) {
                    return this.amount * this.mul
                } else {
                    return "--"
                }
            },
            totalFinancingAmount() {
                if (this.amount >= this.minPut) {
                    return this.amount * (this.mul + 1)
                } else {
                    return "--"
                }
            },
            lossLine() {
                if (this.amount >= this.minPut) {
                    return this.amount * this.mul + this.amount / 2
                } else {
                    return "--"
                }
            },
            warningLine() {
                if (this.amount >= this.minPut) {
                    return this.amount * this.mul + this.amount / 10 * 3
                } else {
                    return "--"
                }
            },
            manageCost() {
                if (this.amount >= this.minPut && this.rate) {
                    return (this.amount * this.mul * this.rate).toFixed(2)
                } else {
                    return "--"
                }
            },
            showRate () {
                let rate = fixed(enlarge(this.selectProduct.interests_rate, 2), 3)
                return  rate
            },
            total() {
                if (this.amount >= this.minPut && this.rate) {
                    return Number(this.amount) + Number(this.manageCost)
                } else {
                    return "--"
                }
            },
            countDifference() {
                if (this.amount >= this.minPut && this.rate) {
                    let num = this.total - this.balance
                    return fixed(num, 2)
                } else {
                    return "--"
                }
            },
            discountEndTime() {
                if (this.selectDiscountData.valid_end_time) {
                    return this.selectDiscountData.valid_end_time.split(' ')[0]
                } else {
                    return " "
                }
            },
            couponName () {
                if (this.selectDiscount) {
                    return enlarge(this.selectDiscountData.rule, 2)
                } else {
                    return " "
                }
            }
        },
        mounted() {
            let _this = this
            this.getProduct()
            if (validLogin()) {
                this.getBalance()
                this.getCoupon()
            }
            this.getIndexData()
            this.amountData = getItem("amount")
            let query = this.$route.query
            if (JSON.stringify(query) == '{}') {
                this.checkAmount(this.amountData[0], 0, 1)
            } else {
                // 赋值保证金
                this.amount = query.investMoney
                // 赋值签名 空，true,非空 false
                query.sign == "" ? this.isEmpty = true : this.isEmpty = false
                this.sign = query.sign
                // 赋值是否补保
                this.autoCautionMoney = Number(query.autoCautionMoney)
                this.isAutoExceed = Number(query.isAutoExceed)
                // 赋值产品（倍数）
                this.productData.forEach((obj) => {
                    if (obj.id == query.productId) {
                        _this.checkMultiple(obj, 0)
                    }
                })
                // 保证金为其他金额时
                for (let i = 0; i < this.amountData.length; i++) {
                    if (this.amountData[i] == Number(query.investMoney)) {
                        this.checkAmount(this.amountData[i], i, 0)
                        break
                    } else {
                        this.checkAmount("其他金额", this.amountData.length - 1, 0)
                        this.scanAmount = query.investMoney
                    }
                }
                // 优惠券id
                this.selectDiscount = query.selectDiscountId
            }
        },
        updated() {
            this.changeDiscount()
        }
    }
</script>

<style scoped lang="less">
    @import url(~assets/less/trade.less);
</style>
