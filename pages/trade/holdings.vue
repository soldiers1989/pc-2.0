<template>
    <div>
        <div class="main">
            <no-ssr>
                <table>
                    <thead>
                        <tr>
                            <th>股票/代码</th>
                            <th>持仓</th>
                            <th>可卖</th>
                            <th>成本</th>
                            <th>现价</th>
                            <th>市值</th>
                            <th>盈亏</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody v-for="(value, key) in financings" :key="key" v-if="isloaded && finanlData[key].length != 0">
                        <tr class="tit">合约{{value.product_name}}-{{value.id}}</tr>
                        <tr v-for="(item, key) in finanlData[key]" :key="key">
                            <td>{{item.stock_name}} {{item.stock_code}}</td>
                            <td>{{item.holdings_quantity}}</td>
                            <td>{{item.available_sell_quantity}}</td>
                            <td>{{item.averagePrice}}</td>
                            <td :class="{red: item.value >= item.averagePrice, green: item.value < item.averagePrice}">{{item.value}}</td>
                            <td>{{item.positionValue}}</td>
                            <td :class="{red: item.value >= item.averagePrice, green: item.value < item.averagePrice}">{{item.profitAndLoss}}</td>
                            <td>
                                <nuxt-link :to="{name: 'trade-buy', query: {code: item.stock_code, id: item.stock_finance_id}}"><button>买</button></nuxt-link>
                                <nuxt-link :to="{name: 'trade-sell', query: {id: item.stock_finance_id, entrustID: item.id}}"><button>卖</button></nuxt-link>
                            </td>
                        </tr>

                    </tbody>
                    <tbody v-if="!holdings.length">
                        <tr class="nothing"><td>暂无记录</td></tr>
                    </tbody>
                </table>
            </no-ssr>
        </div>
    </div>
</template>

<script>
import {bus} from '~/plugins/bus';
import {errorMsg, successMsg} from '~/plugins/methods';
import {getStockFinances, getHoldings} from "~/api/trade";

export default {
    name: "holdings",
    data() {
        return {
            page: 1,
            pageSize: 200,
            financings: [],
            finanlData:[],
            holdings: [],
            fin: [],
            isloaded: false,
        }
    },
    methods: {
        getFinancings() {
            getStockFinances(this.page, this.pageSize, {status: [1, 2, 3]}).then((res) => {
                if (res.status == 1) {
                    this.financings = res.data.data
                } else {
                    errorMsg(res.msg)
                }
            }).then((res) => {
                this.getHoldings()
            })
        },
        getHoldings () {
            let _this = this
            getHoldings().then(function (res) {
                if (res.status == 1) {
                    _this.holdings = res.data.data
                    _this.$nextTick(() => {
                        _this.orderData()
                        _this.isloaded = true
                    })
                } else {
                    errorMsg('获取失败')
                }
            })
        },
        goSell(value) {
            this.$router.push({name: 'trade-sell', query: {id: value.stock_finance_id, entrustID: value.id}})
        },
        goBuy(value) {
            this.$router.push({name: 'trade-buy', query: {code: value.stock_code, id: value.stock_finance_id}})
        },
        orderData() {
            let _this = this
            this.financings.forEach((obj, index) => {
                _this.fin.push(obj.id)
                _this.finanlData[index] = []
                _this.holdings.forEach((item) => {
                    if (item.stock_finance_id == _this.fin[index]) {
                        _this.finanlData[index].push(item)
                    }
                })
            })
        },
    },
    mounted() {
        this.getFinancings()
    },
}
</script>

<style scoped lang="less">
@import url(~assets/less/reset.less);
@import url(~assets/less/holding.less);
</style>
