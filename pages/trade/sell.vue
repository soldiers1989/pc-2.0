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
                        <el-select v-model="hold_id" placeholder="请选择持仓"  size="small" @change="selectHoldings()">
                            <el-option
                                v-for="item in showHoldings"
                                :key="item.key"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="common">
                    <p>股票名称</p>
                    <input type="text" readonly v-model="stockSelected.name">
                </div>
                <div class="common">
                    <p>最新价</p>
                    <input type="text" readonly v-model="stockSelected.price">
                </div>
                <div class="common sell-button">
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
                    <el-input placeholder="请输入委托价数量" size="small" type="number" v-model="entrustAmount" step="100" min="100" :max="stockForSell.available_sell_quantity"></el-input>
                </div>
                <div class="common">
                    <p></p>
                    <el-radio-group v-model="rate" @change="quickChangeAmount">
                        <el-radio :label="1">全仓</el-radio>
                        <el-radio :label="2">1/2</el-radio>
                        <el-radio :label="3">1/3</el-radio>
                        <el-radio :label="4">1/4</el-radio>
                    </el-radio-group>
                </div>
                <div class="common">
                    <p>最大可卖</p>
                    <input type="text" readonly v-model="stockForSell.available_sell_quantity">
                </div>
                <div class="common buy-button sell-button">
                    <p></p>
                    <button @click="validSell">卖出</button>
                </div>
                <div class="buy-price">
                    <ul>
                        <li v-for="(value, key) in stockSelected['s']" :key="key">
                            <span>卖{{value.id}}</span>
                            <span :class="{fontRed: value.p >= stockSelected.price, fontGreen:value.p < stockSelected.price}"
                                @click="changePrice(value.p)">{{value.p}}</span>
                            <span>{{value.v}}</span>
                        </li>
                    </ul>
                    <ul>
                        <li v-for="(value, key) in stockSelected['b']" :key="key">
                            <span>买{{value.id}}</span>
                            <span :class="{fontRed: value.p >= stockSelected.price, fontGreen:value.p < stockSelected.price}"
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

                <Holding :holdings="holdingData" :id="id" @sendID="receiveCode"/>
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
                        <span>卖出</span>
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
    <el-button type="primary" @click="sell" :disabled="isSubmitSell">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    import Holding from "~/components/holding";
    import {getStockFinances, getStockFinance, getStockInfo, entrustSell} from "../../api/trade";
    import {errorMsg, successMsg} from "../../plugins/methods";

export default {
    name: "sell",
    data() {
        return {
             options: [],
            value: '',
            rate: 0,
            holdingData: [],
            stock_code: "",
            hold_id: '',
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
            disablePrice: false,
            confirmTrade: false,
            isSubmitSell: false,
            submitData: {},
            showHoldings: [], // 下拉菜单显示的内容
            stockForSell: {}, // 选中的持仓
            entrustPrice: '',
            entrustAmount: "",
            type: 1,
            query: {}
        }
    },
    methods: {
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
                        // 持仓下拉框显示的数据
                        _this.showFinancing.push(op)
                    })
                }
            })
        },
        getFinance () {
            // 下拉框选择持仓调用这个方法，确定持仓，赋值。
            let _this = this
            this.showHoldings = []
            this.holdingData = []
            this.init()
            getStockFinance({id: this.id}).then((res) => {
                if (res.status == 1) {
                    this.selectFinance = res.data
                    this.holdingData = res.data.transactionList
                    let arrayID = []
                    this.holdingData.forEach((obj, index) => {
                        arrayID.push(obj.id)
                        let op = {
                            value: obj.id,
                            label: obj.stock_name + " " + obj.stock_code,
                            key: index
                        }
                        _this.showHoldings.push(op)

                    })
                    // 判断传过来的持仓Id 在不在这个合约持仓里面，如果在，赋值，如果不在不赋值
                    if (_this.$route.query.entrustID && arrayID.includes(_this.$route.query.entrustID)) {
                        _this.hold_id = this.query.entrustID
                        _this.selectHoldings()
                    } else {
                        _this.hold_id = ""
                    }
                }
            })
        },
        // 选中股票
        selectStock (code) {
            this.stock_code = code
            getStockInfo({stock_code: code}).then((res) => {
                if (res.status == 1) {
                    this.stockSelected = res.data
                    this.entrustPrice = res.data['b1_p']
                }
            })
        },
        // 选中持仓
        selectHoldings() {
            // 根据id 获取持仓
            this.holdingData.forEach((obj, index) => {
                if (obj.id == this.hold_id) {
                    this.stockForSell = obj
                    this.entrustAmount = this.stockForSell.available_sell_quantity
                }
            })
            this.selectStock(this.stockForSell.stock_code)
        },
        quickChangeAmount () {
            let rate = 1/ this.rate
            let t
            t = this.stockForSell.available_sell_quantity * rate
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
        receiveCode (obj) {
            this.hold_id = obj
            this.selectHoldings()
        },
        validSell () {
            this.submitData = {
                id: this.id,
                price_type: this.type,
                stock_code: this.stock_code,
                entrust_price: this.entrustPrice,
                entrust_quantity: this.entrustAmount,
                parent_stock_finance_id: this.stockForSell.parent_stock_finance_id
            }
            if (this.submitData.entrust_quantity > this.available_sell_quantity) {
                errorMsg('买入数量不得大于最大可卖数量')
                return false
            } else if (!this.id) {
                errorMsg('请选择合约')
                return false
            } else if (!this.hold_id) {
                errorMsg('请选择持仓')
                return false
            }
            this.confirmTrade = true
        },
        sell () {
            this.isSubmitSell = true
            entrustSell(this.submitData).then((res) => {
                if (res.status == 1) {
                    successMsg('委托成功')
                    this.getFinance()
                } else {
                    errorMsg(res.msg)
                }
            }).then((res) => {
                this.init()
                this.stock_code = ""
                this.isSubmitSell = false
                this.confirmTrade = false
            })
        },
        handleClose(done) {
            done()
        },
        init () {
            this.entrustPrice = ""
            this.entrustAmount = ""
            this.hold_id = ""
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
            this.stockForSell = {
                name: "--",
                available_sell_quantity: "--"
            }
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
    watch: {
        type (newVal, oldVal) {
            if (newVal == 1) {
                this.entrustPrice = this.stockSelected['a1_p']
                this.disablePrice = false
            } else {
                this.disablePrice = true
            }
        }
    },
    mounted () {
        this.init()
        this.initFinancing()
        this.getAllFinancings()
        this.query = this.$route.query
        if (JSON.stringify(this.query) != "{}") {
            if (this.query.id) {
                this.id = this.query.id.toString()
                this.getFinance()
            }
        }
    },
    components: {
        Holding
    }
}
</script>

<style scoped lang="less">
@import url(~assets/less/buy.less);
</style>
