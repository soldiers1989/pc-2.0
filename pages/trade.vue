<template>
    <div class="wrap">
        <div class="trade_title">
            <span>当前您所在的位置：</span>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item>股票操盘</el-breadcrumb-item>
                <el-breadcrumb-item>开通合约</el-breadcrumb-item>
                <el-breadcrumb-item v-if="pathName == 'trade-day'">按天操盘</el-breadcrumb-item>
                <el-breadcrumb-item v-if="pathName == 'trade-week'">按周操盘</el-breadcrumb-item>
                <el-breadcrumb-item v-if="pathName == 'trade-month'">按月操盘</el-breadcrumb-item>
                <el-breadcrumb-item v-if="pathName == 'trade-free'">免息T+1</el-breadcrumb-item>
                <el-breadcrumb-item v-if="fullPath == '/trade/financingDetails?id=1'">操盘中</el-breadcrumb-item>
                <el-breadcrumb-item v-if="fullPath == '/trade/financingDetails?id=2'">已结算</el-breadcrumb-item>
                <el-breadcrumb-item v-if="pathName == 'trade-limit'">今日限买</el-breadcrumb-item>
                <el-breadcrumb-item v-if="pathName == 'trade-stockPool'">自选</el-breadcrumb-item>
                <el-breadcrumb-item v-if="pathName == 'trade-buy'">买入</el-breadcrumb-item>
                <el-breadcrumb-item v-if="pathName == 'trade-sell'">卖出</el-breadcrumb-item>
                <el-breadcrumb-item v-if="pathName == 'trade-cancel'">撤单</el-breadcrumb-item>
                <el-breadcrumb-item v-if="pathName == 'trade-holdings'">持仓</el-breadcrumb-item>
                <el-breadcrumb-item v-if="pathName == 'trade-dailyEntrust'">当日委托</el-breadcrumb-item>
                <el-breadcrumb-item v-if="pathName == 'trade-dailyDealing'">当日成交</el-breadcrumb-item>
                <el-breadcrumb-item v-if="pathName == 'trade-historyEntrust'">历史委托</el-breadcrumb-item>
                <el-breadcrumb-item v-if="pathName == 'trade-historyDealing'">历史成交</el-breadcrumb-item>
                <el-breadcrumb-item v-if="pathName == 'trade-flow'">资金流水</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="trade_content">
            <div class="person_menu">
                <ul class="hole_menu">
                    <li @click="changeTab(1)" >
                        <nuxt-link to="/trade/day">
                            <div :class="{selectPage: bgColor == 1}">
                                <p>开通合约</p>
                                <i class="el-icon-arrow-down" v-if="showMenu == 1"></i>
                                <i class="el-icon-arrow-up" v-else></i>
                            </div>
                        </nuxt-link>
                    </li>
                    <li v-show="showMenu == 1" class="little_menu_trade" >
                        <ul>
                            <li><nuxt-link to="/trade/day">按天操盘</nuxt-link></li>
                            <li><nuxt-link to="/trade/week">按周操盘</nuxt-link></li>
                            <li><nuxt-link to="/trade/month">按月操盘</nuxt-link></li>
                            <li v-if="freeFlag"><nuxt-link to="/trade/free">免息T+1</nuxt-link></li>
                        </ul>
                    </li>

                    <li @click="changeTab(2)" >
                        <nuxt-link :to="{name: 'trade-financingDetails', query: {id: 1}}">
                            <div :class="{selectPage: bgColor == 2}">
                                <p>我的合约</p>
                                <i class="el-icon-arrow-down" v-if="showMenu == 2"></i>
                                <i class="el-icon-arrow-up" v-else></i>
                            </div>
                        </nuxt-link>
                    </li>
                    <li v-show="showMenu == 2" class="little_menu_trade" >
                        <ul>
                            <li @click="changeDetails(1)"><nuxt-link :to="{name: 'trade-financingDetails', query: {id: 1}}">操盘中</nuxt-link></li>
                            <li @click="changeDetails(2)"><nuxt-link :to="{name: 'trade-financingDetails', query: {id: 2}}">已结算</nuxt-link></li>
                        </ul>
                    </li>


                    <li @click="changeTab(3)" >
                        <nuxt-link to="/trade/limit">
                            <div :class="{selectPage: bgColor == 3}">
                                <p>股票交易</p>
                                <i class="el-icon-arrow-down" v-if="showMenu == 3"></i>
                                <i class="el-icon-arrow-up" v-else></i>
                            </div>
                        </nuxt-link>
                    </li>
                    <li v-show="showMenu == 3" class="little_menu_trade" >
                        <ul>
                            <li><nuxt-link to="/trade/limit">今日限买</nuxt-link></li>
                            <li><nuxt-link to="/trade/stockPool">自选</nuxt-link></li>
                            <li><nuxt-link to="/trade/buy">买入</nuxt-link></li>
                            <li><nuxt-link to="/trade/sell">卖出</nuxt-link></li>
                            <li><nuxt-link to="/trade/cancel">撤单</nuxt-link></li>
                            <li><nuxt-link to="/trade/holdings">持仓</nuxt-link></li>
                            <li><nuxt-link to="/trade/dailyEntrust">当日委托</nuxt-link></li>
                            <li><nuxt-link to="/trade/dailyDealing">当日成交</nuxt-link></li>
                            <li><nuxt-link to="/trade/historyEntrust">历史委托</nuxt-link></li>
                            <li><nuxt-link to="/trade/historyDealing">历史成交</nuxt-link></li>
                            <li><nuxt-link to="/trade/flow">资金流水</nuxt-link></li>
                        </ul>
                    </li>

                </ul>
            </div>

            <div class="person_content-content">
                <nuxt-child/>
            </div>
        </div>

        <dialog-pay/>

        <dialog-delay/>
    </div>
</template>

<script>
    import {bus} from "../plugins/bus";
    import dialogPay from '~/components/dialogAutoPay'
    import dialogDelay from '~/components/delayMention'
    import {getItem} from "../plugins/methods";

    export default {
        name: "trade",
        data () {
            return {
                showMenu: 0,
                bgColor: 1,
                routerName: "",
                pathName: '',
                fullPath: '',
                freeFlag: false
            }
        },
        components: {
            dialogPay, dialogDelay
        },
        methods: {
            changeTab(tab) {
                if (this.showMenu != tab) {
                    this.showMenu = tab
                    this.bgColor = tab
                } else {
                    this.showMenu = 0
                    this.bgColor = 0
                }
            },
            changeDetails (dir) {
                bus.$emit("changeData")
            },
            getProducts() {
                let indexData = getItem("indexData")
                // 是否包含免息T+1
                if (indexData) {
                    this.freeFlag = indexData.product_type.toString().indexOf('5') > -1
                }
            }
        },
        mounted () {
            this.getProducts()
            // 最好写一个数组区分
            let router1 = ['day', 'free', 'month', 'week']
            let router2 = ['financingDetails', 'contractDetails']
            let router3 = ['limit', 'stockPool', 'cancel', 'buy', 'sell', 'holdings', 'dailyEntrust', 'historyEntrust', 'dailyDealing', 'historyDealing']
            this.routerName = this.$route.name.split('-')[1]
            if (router1.includes(this.routerName)) {
                this.changeTab(1)
            } else if (router2.includes(this.routerName)) {
                this.changeTab(2)
            } else if (router3.includes(this.routerName)) {
                this.changeTab(3)
            }
            this.pathName = this.$route.name
            this.fullPath = this.$route.fullPath
            bus.$on("currentPage", () => {
                this.changeTab(3)
            })
        },
        updated() {
            this.pathName = this.$route.name
            this.fullPath = this.$route.fullPath
        },
        beforeDestroy () {
            bus.$off("currentPage")
        }
    }
</script>

<style scoped lang="less">
    @import url(~assets/less/trade.less);
    [v-cloak] {
        display: none;
    }
</style>
