<template>
    <div class="financingDetails_page">
        <ul>
            <li v-for="(value, key) in currentData" :key="key">
                <div class="financingDetails_page-header" @click="showDetails(value.id)">
                    <span v-if="value.product_type == 1">按天操盘</span>
                    <span v-if="value.product_type == 2">按月操盘</span>
                    <span v-if="value.product_type == 4">按周操盘</span>
                    <span v-if="value.product_type == 3">免息操盘</span>
                    <span v-if="value.product_type == 5">免息T+1</span>
                    <span v-if="value.product_type == 6">炒股大赛</span>

                    <span v-if="value.product_type != 5 && value.product_type != 6">{{value.product_name}}—{{value.id}}</span>
                    <span v-if="value.product_type == 5">T{{value.product_times}}—{{value.id}}</span>
                    <span v-if="value.product_type == 6">Y10—{{value.id}}</span>
                    <span class="orange_box" v-if="Number(value.totalAssets) <= Number(value.precautious_line_amount) && Number(value.totalAssets) > Number(value.liiquidation_line_amount) && value.status != 4">触预警线</span>
                    <span class="green_box" v-if="Number(value.totalAssets) <= Number(value.liiquidation_line_amount) && value.status != 4">触平仓线</span>
                    <span class="blue_box" v-if="value.coupon_stock_finance">已使用优惠券</span>
                    <span>
                        <img src="~static/images/icon_moreselect.png" alt="">
                    </span>
                </div>

                <ul class="financingDetails_page-content" v-if="queryID == 1">
                    <li>
                        <div>
                            <span>当前资产</span>
                            <span>{{value.totalAssets}}</span>
                            <div>
                                <div :class="{
                bgRed: Number(value.totalAssets) > Number(value.precautious_line_amount),
                bgGreen: Number(value.totalAssets) <= Number(value.liiquidation_line_amount),
                bgYellow: Number(value.totalAssets) < Number(value.precautious_line_amount) && Number(value.totalAssets) > Number(value.liiquidation_line_amount),
                moreWarning: Number(value.totalAssets) > Number(value.precautious_line_amount),
                equalWarning: Number(value.totalAssets) == Number(value.precautious_line_amount),
                lessWarning: Number(value.totalAssets) < Number(value.precautious_line_amount) && Number(value.totalAssets) >Number(value.liiquidation_line_amount),
                equalLoss: Number(value.totalAssets) == Number(value.liiquidation_line_amount),
                lessLoss: Number(value.totalAssets) < Number(value.liiquidation_line_amount),
                                }"></div>
                            </div>
                        </div>
                        <div>
                            <span>可用余额</span>
                            <span>{{value.totalAssets}}</span>
                        </div>
                    </li>

                    <li>
                        <div>
                            <span>预警线</span>
                            <span>{{value.precautious_line_amount}}</span>
                            <div>
                                <div :class="{
                                     bgRed: Number(value.totalAssets) > Number(value.precautious_line_amount),
                bgGreen: Number(value.totalAssets) <= Number(value.liiquidation_line_amount),
                bgYellow: Number(value.totalAssets) < Number(value.precautious_line_amount) && Number(value.totalAssets) > Number(value.liiquidation_line_amount),
                                }" class="equalWarning"></div>
                            </div>
                        </div>
                        <div>
                            <span>保证金</span>
                            <span>{{value.freeze_money}}</span>
                        </div>
                    </li>

                    <li>
                        <div>
                            <span>平仓线</span>
                            <span>{{value.liiquidation_line_amount}}</span>
                            <div>
                                <div :class="{
                                     bgRed: Number(value.totalAssets) > Number(value.precautious_line_amount),
                bgGreen: Number(value.totalAssets) <= Number(value.liiquidation_line_amount),
                bgYellow: Number(value.totalAssets) < Number(value.precautious_line_amount) && Number(value.totalAssets) > Number(value.liiquidation_line_amount),
                                }" class="equalLoss"></div>
                            </div>
                        </div>
                        <div>
                            <span>盈亏</span>
                            <span :class="{fontRed: value.profitAndLoss >= 0, fontGreen: value.profitAndLoss < 0}">{{value.profitAndLoss}}</span>
                        </div>
                    </li>
                </ul>


                <ul class="financingDetails_page-content2" v-if="queryID == 2">
                    <li>
                        <div>
                            <span>当前资产</span>
                            <span>0.00</span>
                        </div>
                        <div>
                            <span>可用余额</span>
                            <span>0.00</span>
                        </div>
                        <div>
                            <span>操盘额</span>
                            <span>{{value.current_finance_amount}}</span>
                        </div>
                    </li>
                    <li>
                        <div>
                            <span>预警线</span>
                            <span>{{value.precautious_line_amount}}</span>
                        </div>
                        <div>
                            <span>保证金</span>
                            <span>{{value.freeze_money}}</span>
                        </div>
                        <div>
                            <span>总操盘资金</span>
                            <span>{{value.totalFinanceAmount}}</span>
                        </div>
                    </li>
                    <li>
                        <div>
                            <span>平仓线</span>
                            <span>{{value.liiquidation_line_amount}}</span>
                        </div>
                        <div>
                            <span>盈亏</span>
                            <span>{{value.profitAndLoss}}</span>
                        </div>
                        <div>
                            <span>盈亏比例</span>
                            <span>{{value.profitAndLossRate}}%</span>
                        </div>
                    </li>
                </ul>
            </li>

        </ul>

        <div class="nodata">
            <img src="~static/images/img_nocontract.png" alt="" v-if="!currentData.length">
        </div>
    </div>
</template>

<script>
    import {getStockFinances} from "../../api/trade";
    import {errorMsg} from "../../plugins/methods";
    import {bus} from "../../plugins/bus";

    export default {
        name: "financingDetails",
        data () {
            return {
                page: 1,
                pageSize: 50,
                currentData: [],
                queryID: 0
            }
        },
        methods: {
            getFinancings() {
                getStockFinances(this.page, this.pageSize, {status: [1, 2, 3]}).then((res) => {
                    if (res.status == 1) {
                        this.currentData = res.data.data
                    } else {
                        errorMsg(res.msg)
                    }
                })
            },
            getFinanced() {
                getStockFinances(this.page, this.pageSize, {status: [4]}).then((res) => {
                    if (res.status == 1) {
                        this.currentData = res.data.data
                    } else {
                        errorMsg(res.msg)
                    }
                })
            },
            showDetails (id) {
                this.$router.push({name: 'trade-contractDetails', query: {id: id}})
            }
        },
        mounted () {
            bus.$on('changeData', (obj) => {
                this.queryID = this.$route.query.id
                if (this.$route.query.id == 1) {
                    this.getFinancings()
                } else {
                    this.getFinanced()
                }
            })
            this.queryID = this.$route.query.id
            if (this.$route.query.id == 1) {
                this.getFinancings()
            } else {
                this.getFinanced()
            }
        },
        beforeDestroy () {
            bus.$off('changeData')
        }
    }
</script>

<style scoped lang="less">
    @import url(~assets/less/contract.less);
</style>

