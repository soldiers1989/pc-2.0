<template>
    <div>
        <div class="main">
            <no-ssr>
                <table>
                    <thead>
                        <tr>
                            <th>委托时间</th>
                            <th>股票/代码</th>
                            <th>方向</th>
                            <th>价格</th>
                            <th>数量</th>
                            <th>状态</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody v-for="(value, key) in financings" :key="key" v-if="isloaded && finanlData[key].length != 0">
                        <tr class="tit" v-if="value.product_type != 3">合约{{value.product_name}}—{{value.id}}</tr>
                        <tr v-for="(item, key) in finanlData[key]" :key="key">
                            <td>{{item.created_time }}</td>
                            <td>{{item.stock_name}} {{item.stock_code}}</td>
                            <td class="red" v-if="item.sold_or_buy == 1">买入</td>
                            <td class="blue" v-if="item.sold_or_buy == 2">卖出</td>
                            <td>{{item.entrust_price}}</td>
                            <td>{{item.entrust_amount}}</td>
                            <td>{{item.type_text}}</td>
                            <td><button :class="{error: checkGray(item)}" :disabled="checkGray(item)"
                                @click="cancelOrder(item)">撤</button></td>
                        </tr>
                    </tbody>
                    <tbody v-if="cancelData.length == 0">
                        <tr  class="nothing"><td>暂无记录</td></tr>
                    </tbody>
                </table>
            </no-ssr>
        </div>
    </div>
</template>

<script>
import {bus} from '~/plugins/bus';
import {errorMsg, successMsg} from '~/plugins/methods';
import {getStockFinances, getRevocableEntrusts, cancelEntrustBuy, cancelEntrustCell} from "~/api/trade";

export default {
    name: "cancel",
    data() {
        return {
            page: 1,
            pageSize: 200,
            financings: [],
            fin: [],
            finanlData: {},
            isSubmitCanceled: false,
            isloaded: false,
            cancelData: [],
            selectedItem: [],
        }
    },
    methods: {
        getFinancings () {
            getStockFinances(this.page, this.pageSize, {status:[1, 2, 3]}).then((res) => {
                if (res.status == 1) {
                    this.financings = res.data.data
                    this.getData()
                } else  {
                    errorMsg(res.msg)
                }
            })
        },
        getData () {
            let _this = this
            getRevocableEntrusts(this.page, this.pageSize).then((res) => {
                if (res.status === 1) {
                    this.cancelData = res.data.data
                    console.log(_this.cancelData)
                    _this.$nextTick(() => {
                        _this.orderData()
                        _this.isloaded = true
                    })
                } else {
                    errorMsg('获取失败')
                }
            })
        },
        checkGray (item) {
            let flag = false
            if (this.selectedItem.includes(item.id)) {
                flag = true
            } else {
                flag = false
            }
            return flag
        },
        orderData () {
            let _this = this
            this.financings.forEach((obj, index) => {
                _this.fin.push(obj.id)
                _this.finanlData[index] = []
                this.cancelData.forEach((item) => {
                    if(item.stock_finance_id == _this.fin[index]) {
                        _this.finanlData[index].push(item)
                    }
                })
            })
        },
        cancelOrder (item) {
            let _this = this
            let request = null
            this.selectedItem.push(item.id)
            if (item.sold_or_buy == 1) {
                request = cancelEntrustBuy({id: item.id})
            } else if (item.sold_or_buy == 2) {
                request = cancelEntrustCell({id: item.id})
            }
            request.then(function (res) {
                if (res.status == 1) {
                    successMsg('撤销成功')
                    _this.getFinancings()
                    _this.getData()
                } else {
                    errorMsg(res.msg)
                }
            }).then((res) => {
                console.log(item)
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
@import url(~assets/less/cancel.less);
</style>
