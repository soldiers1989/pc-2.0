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
                    <tbody>
                    <tr v-for="(value, key) in holdings" :key="key">
                        <td>{{value.stock_name}} {{value.stock_code}}</td>
                        <td>{{value.holdings_quantity}}</td>
                        <td>{{value.available_sell_quantity}}</td>
                        <td>{{value.averagePrice}}</td>
                        <td :class="{fontRed: value.value >= value.averagePrice, fontGreen: value.value < value.averagePrice}">{{value.value}}</td>
                        <td>{{value.positionValue}}</td>
                        <td :class="{fontRed: value.value >= value.averagePrice, fontGreen: value.value < value.averagePrice}">{{value.profitAndLoss}}</td>
                        <td>
                            <a href="javascript:;">
                                <button @click="goBuy(value.stock_code)">买</button>
                            </a>
                            <a href="javascript:;">
                                <button @click="goSell(value.id)">卖</button>
                            </a>
                        </td>
                    </tr>
                    <!-- <tr  class="nothing"><td>暂无记录</td></tr> -->
                    </tbody>
                </table>
            </no-ssr>
        </div>
    </div>
</template>

<script>
    import {bus} from "../plugins/bus";

    export default {
    name: "holdings",
    data() {
        return {
            routerName: ""
        }
    },
    props: {
        holdings: {
            type: Array
        },
        id: {
            type: String
        }
    },
    methods: {
        goBuy (code) {
            if (this.routerName == "buy") {
                this.$emit("sendCode", code)
            } else {
                this.$router.push({name: 'trade-buy', query: {id: this.id, code: code}})
            }
        },
        goSell (id) {
            if (this.routerName == "sell") {
                this.$emit("sendID", id)
            } else {
                this.$router.push({name: 'trade-sell', query: {id: this.id, entrustID: id}})
            }
        }
    },
    mounted() {
        this.routerName = this.$route.name.split("-")[1]
    },
}
</script>

<style scoped lang="less">
@import url(~assets/less/reset.less);
@import url(~assets/less/holding.less);
.main {
    padding: 0 !important;
    margin-top: 70px;
}
</style>
