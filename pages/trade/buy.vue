<template>
    <div>
        <div class="main">
            <div class="main-body">
                <div class="search">
                    <p>合约</p>
                    <div>
                        <el-select v-model="id" placeholder="请选择合约" size="small" @change="getFinance">
                            <el-option
                                v-for="item in showFinancing"
                                :key="item.key"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="money cf">
                    <ul>
                        <li>
                            <span>可用余额</span>
                            <span>{{selectFinance.available_amount}}</span>
                        </li>
                        <li>
                            <span>总操盘资金</span>
                            <span>{{selectFinance.totalAssets}}</span>
                        </li>
                    </ul>
                    <ul>
                        <li>
                            <span>持仓市值</span>
                            <span>{{selectFinance.positionValue}}</span>
                        </li>
                        <li>
                            <span>当前资产</span>
                            <span>{{selectFinance.totalAssets}}</span>
                        </li>
                    </ul>
                </div>
                <div class="search-code">
                    <p>股票代码</p>
                    <div>
                        <el-input placeholder="请输入股票代码" size="small" v-model="stock_code" @input="searchStock"></el-input>
                    </div>
                    <ul class="searchStock_list" v-if="showStocks">
                        <li v-for="(value, key) in stockData" :key="key" @click="selectStock(value.stock_code)">
                            <span>{{value.stock_name}}</span>
                            <span>{{value.stock_code}}</span>
                        </li>
                    </ul>
                </div>
                <div class="common">
                    <p>股票名称</p>
                    <input type="text" readonly v-model="stockSelected.name">
                </div>
                <div class="common">
                    <p>最新价</p>
                    <input type="text" readonly v-model="stockSelected.price">
                </div>
                <div class="common entrust">
                    <p>委托方式</p>
                    <div>
                        <el-radio-group v-model="type" size="small">
                            <el-radio-button  label="1" value="1">限价委托</el-radio-button>
                            <el-radio-button  label="2" value="2">市价委托</el-radio-button>
                        </el-radio-group>
                    </div>
                </div>
                <div class="common">
                    <p>委托价格</p>
                    <el-input placeholder="请输入委托价格" size="small" type="number" v-model="entrustPrice" step="0.01" min="0" :disabled="disablePrice" v-if="type == 1"></el-input>
                    <el-input :disabled="true" value="市价" v-if="type == 2" size="small" placeholder="市价"></el-input>
                </div>
                <div class="common">
                    <p>委托数量</p>
                    <el-input placeholder="请输入委托价数量" size="small" type="number" v-model="entrustAmount" step="100" :max="topQuantity" min="0"></el-input>
                </div>
                <div class="common">
                    <p></p>
                    <el-radio-group v-model="rate" @change="quickChangeAmount" type="danger">
                        <el-radio :label="1">全仓</el-radio>
                        <el-radio :label="2">1/2</el-radio>
                        <el-radio :label="3">1/3</el-radio>
                        <el-radio :label="4">1/4</el-radio>
                    </el-radio-group>
                </div>
                <div class="common">
                    <p>最大可买</p>
                    <input type="text" readonly v-model="topQuantity">
                </div>
                <div class="common buy-button">
                    <p></p>
                    <button @click="validBuy">买入</button>
                </div>
                <div class="buy-price">
                    <ul>
                        <li v-for="(value, key) in stockSelected['s']" :key="key">
                            <span>卖{{value.id}}</span>
                            <span
                                :class="{fontRed: value.p >= stockSelected.price, fontGreen:value.p < stockSelected.price}"
                                @click="changePrice(value.p)">{{value.p}}</span>
                            <span>{{value.v}}</span>
                        </li>
                    </ul>
                    <ul>
                        <li v-for="(value, key) in stockSelected['b']" :key="key">
                            <span>买{{value.id}}</span>
                            <span
                                :class="{fontRed: value.p >= stockSelected.price, fontGreen:value.p < stockSelected.price}"
                                @click="changePrice(value.p)">{{value.p}}</span>
                            <span>{{value.v}}</span>
                        </li>
                    </ul>
                    <div class="buy-price-end cf">
                        <ul>
                            <li>
                                <span>昨收</span>
                                <span @click="changePrice(stockSelected.preClose)">{{stockSelected.preClose}}</span>
                            </li>
                            <li>
                                <span>今开</span>
                                <span @click="changePrice(stockSelected.open)">{{stockSelected.open}}</span>
                            </li>
                        </ul>
                        <ul>
                            <li>
                                <span>涨停价</span>
                                <span @click="changePrice(stockSelected.riseLimit)">{{stockSelected.riseLimit}}</span>
                            </li>
                            <li>
                                <span>跌停价</span>
                                <span @click="changePrice(stockSelected.fallLimit)">{{stockSelected.fallLimit}}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <Holding :holdings="holdingData" :id="id" @sendCode="receiveCode"/>
            </div>
        </div>

        <el-dialog
            title="委托确认"
            :visible.sync="confirmTrade"
            width="350px"
            :before-close="handleClose">
            <div class="confirm_financing-content">
                <ul>
                    <li>
                        <span>合约账户：</span>
                        <span>{{selectFinance.product_name}}—{{selectFinance.id}}</span>
                    </li>
                    <li>
                        <span>股票：</span>
                        <span>{{submitData.stock_name}} {{submitData.stock_code}}</span>
                    </li>
                    <li>
                        <span>委托方向：</span>
                        <span>买入</span>
                    </li>
                    <li>
                        <span>委托数量：</span>
                        <span>{{submitData.entrust_quantity}}股</span>
                    </li>
                    <li>
                        <span>委托价格：</span>
                        <span v-if="submitData.price_type==1">{{submitData.entrust_price}}</span>
                        <span v-if="submitData.price_type==2">市价</span>
                    </li>
                </ul>
            </div>
            <span slot="footer" class="dialog-footer">
    <el-button @click="confirmTrade = false">取 消</el-button>
    <el-button type="primary" @click="buy" :disabled="isSubmitBuy">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    import Holding from "~/components/holding";
    import {getStockFinances, getStockFinance, getStocks, getStockInfo, getMaxStockNum, entrustBuy} from "../../api/trade";
    import {errorMsg, successMsg} from "../../plugins/methods";

    export default {
        name: "buy",
        data() {
            return {
                allFinancings: [],
                value: '',
                type: 1,
                radio2: 1,
                stockSelected: {
                    s: [
                        {p: "--", id: "1", v: "--"},
                        {p: "--", id: "2", v: "--"},
                        {p: "--", id: "3", v: "--"},
                        {p: "--", id: "4", v: "--"},
                        {p: "--", id: "5", v: "--"},
                    ],
                    b: [
                        {p: "--", id: "1", v: "--"},
                        {p: "--", id: "2", v: "--"},
                        {p: "--", id: "3", v: "--"},
                        {p: "--", id: "4", v: "--"},
                        {p: "--", id: "5", v: "--"},
                    ],
                    price: '--',
                    fallLimit: '--',
                    riseLimit: '--'
                },
                page: 1,
                pageSize: 500,
                showFinancing: [],
                id: null, // 选中的合约id
                selectFinance: {}, //获取选中的合约
                showStocks: false, // 模糊查询显示所有的股票
                stock_code: "",
                topQuantity: "--",
                stockData: [],
                entrustPrice: '',
                entrustAmount: "",
                rate: 0,
                holdingData: [],
                disablePrice: false,
                confirmTrade: false,
                isSubmitBuy: false,
                submitData: {}
            }
        },
        methods: {
            handleClose (done) {
                done()
            },
            // 获取所有合约
            getAllFinancings () {
                let _this = this
                getStockFinances(this.page, this.pageSize, {status: [1, 2, 3]}).then((res) => {
                    if (res.status == 1) {
                        this.allFinancings = res.data.data
                        this.allFinancings.forEach((obj, index) => {
                            let op = {
                                value: obj.id.toString(),
                                label: obj.product_name + "—" + obj.id,
                                key: index
                            }
                            _this.showFinancing.push(op)
                        })
                    }
                })
            },
            getFinance () {
                getStockFinance({id: this.id}).then((res) => {
                    if (res.status == 1) {
                        this.selectFinance = res.data
                        this.holdingData = res.data.transactionList
                        if (this.stock_code) {
                            this.getTopQuantity()
                        }
                    }
                })
            },
            // 模糊查询股票
            searchStock() {
                let _this = this
                let len = this.stock_code.length
                if (len > 3) {
                    this.showStocks = true
                    getStocks({stock_code: this.stock_code}).then((res) => {
                        if (res.status === 1) {
                            _this.stockData = res.data
                        } else {
                            errorMsg(res.msg)
                        }
                    })
                } else if (len < 6) {
                    this.showStocks = false
                    this.init()
                }
            },
            // 选中股票
            selectStock (code) {
                this.stock_code = code
                this.showStocks = false
                getStockInfo({stock_code: code}).then((res) => {
                    if (res.status == 1) {
                        this.stockSelected = res.data
                        this.entrustPrice = res.data['a1_p']
                        if (this.id) {
                            this.getTopQuantity()
                        }
                    }
                })
            },
            refreshStockInfo () {
                getStockInfo({stock_code: this.stock_code}).then((res) => {
                    if (res.status == 1) {
                        this.stockSelected = res.data
                    }
                })
            },
            // 获取最大可买
            getTopQuantity () {
                let _this = this
                if (_this.stockSelected.haltStatus) {
                    _this.topQuantity = "--"
                    return
                }
                getMaxStockNum({id: this.id, 'entrust_price': this.entrustPrice}).then(function (res) {
                    if (res.status === 1) {
                        _this.topQuantity = res.data.num
                    } else {
                        _this.topQuantity = "--"
                    }
                }).then((res) => {
                    let op = {}
                    if ( _this.topQuantity == 0) {
                        this.entrustAmount = 0
                    } else {
                        this.entrustAmount = 100
                    }
                })
            },
            // 快速选择数量
            quickChangeAmount () {
                if (this.topQuantity == '--' && !this.stock_code && !this.id) {
                    errorMsg("请选择持仓并选择合约")
                    return false
                }
                let rate = 1/ this.rate
                let t
                t = this.topQuantity * rate
                if (t == 0) {
                    t = 0
                } else if (t < 100) {
                    t = 100
                } else {
                    t = Math.floor(t / 100) * 100
                }
                this.entrustAmount = t
            },
            changePrice (value) {
                this.type = 1
                this.entrustPrice = value
            },
            validBuy () {
                // 赋值
                let today = new Date().getDate()
                let lastDay = new Date(this.selectFinance.next_interest_charge_time).getDate() + 1
                let isLastDay = today == lastDay
                if (this.selectFinance.product_type == 6 && isLastDay) {
                    errorMsg('炒股大赛合约最后一个交易日不能买卖')
                    return false
                }
                this.submitData = {
                    id: this.id,
                    price_type: this.type,
                    stock_code: this.stock_code,
                    entrust_price: this.entrustPrice,
                    entrust_quantity: this.entrustAmount
                }
                if (!this.submitData.id) {
                    errorMsg('请选择合约')
                    return false
                } else if (!this.submitData.stock_code) {
                    errorMsg('请填写股票代码')
                    return false
                } else if (this.submitData.entrust_quantity > this.topQuantity) {
                    errorMsg('买入数量不得大于最大可买数量')
                    return false
                } else if (this.submitData.entrust_quantity == 0) {
                    errorMsg('委托数量不正确')
                    return false
                }
                this.confirmTrade = true
            },
            buy () {
                this.isSubmitBuy = true
                entrustBuy(this.submitData).then((res) => {
                    if (res.status == 1) {
                        successMsg('委托成功')
                        this.getFinance()
                    } else {
                        errorMsg(res.msg)
                    }
                }).then((res) => {
                    this.init()
                    this.stock_code= ""
                    this.entrustPrice = ""
                    this.isSubmitBuy = false
                    this.confirmTrade = false
                })
            },
            receiveCode (obj) {
                this.selectStock(obj)
            },
            init () {
                this.stockSelected = {
                    name: '--',
                    s: [
                        {p: "--", id: "1", v: "--"},
                        {p: "--", id: "2", v: "--"},
                        {p: "--", id: "3", v: "--"},
                        {p:"--", id: "4", v: "--"},
                        {p: "--", id: "5", v: "--"},
                    ],
                    b: [
                        {p: "--", id: "1", v: "--"},
                        {p: "--", id: "2", v: "--"},
                        {p: "--", id: "3", v: "--"},
                        {p:"--", id: "4", v: "--"},
                        {p: "--", id: "5", v: "--"},
                    ],
                    price: '--',
                    fallLimit: '--',
                    riseLimit: '--',
                    open: "--",
                    preClose: "--"
                }
                this.topQuantity = '--'
            },
            initFinancing() {
                this.selectFinance = {
                    current_finance_amount: "--",
                    positionValue: "--",
                    available_amount: "--",
                    totalAssets: '--'
                }
            },
        },
        mounted () {
            this.init()
            this.initFinancing()
            this.getAllFinancings()
            let query = this.$route.query
            if (JSON.stringify(query) != "{}") {
                if (query.code) {
                    this.selectStock(query.code)
                }
                if (query.id) {
                    this.id = query.id.toString()
                    this.getFinance()
                }
            }
        },
        watch: {
            entrustPrice (newVal, oldVal) {
                if (newVal != oldVal) {
                    this.getTopQuantity()
                }
            },
            type (newVal, oldVal) {
                if (newVal == 1) {
                    this.entrustPrice = this.stockSelected['a1_p']
                    this.disablePrice = false
                } else {
                    this.disablePrice = true
                }
            }
        },
        components: {
            Holding
        },
        beforeDestroy () {
        }
    }
</script>

<style scoped lang="less">
    @import url(~assets/less/buy.less);
</style>
