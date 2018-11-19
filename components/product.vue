<template>
    <div>
        <div class="wrap main">
            <div class="left">
                <p class="tit">股票操盘</p>
                <p class="sub">小资金 大利润</p>
                <p class="sub sub2">我出资金 盈利翻番</p>
            </div>
            <div class="right">
                <ul class="item">
                    <li>按天操盘</li>
                    <li>盈利放大<i>{{dayData.min}}-{{dayData.max}}</i>倍</li>
                    <li>{{dayData.minInput}}元起 最高<i>{{dayData.maxInput}}</i>元</li>
                    <li><i>{{dayData.minRate}}%-{{dayData.maxRate}}%</i>管理费</li>
                    <li><button @click="goFinancing('trade-day')" class="active1">立即申请</button></li>
                </ul>
                <ul class="item item2">
                    <li>按周操盘</li>
                    <li>盈利放大<i>{{weekData.min}}-{{weekData.max}}</i>倍</li>
                    <li>{{weekData.minInput}}元起 最高<i>{{weekData.maxInput}}</i>元</li>
                    <li><i>{{weekData.minRate}}%-{{weekData.maxRate}}%</i>管理费</li>
                    <li><button @click="goFinancing('trade-week')" class="active2">立即申请</button></li>
                </ul>
                <ul class="item item3">
                    <li>按月操盘</li>
                    <li>盈利放大<i>{{MonthData.min}}-{{MonthData.max}}</i>倍</li>
                    <li>{{MonthData.minInput}}元起 最高<i>{{MonthData.maxInput}}</i>元</li>
                    <li><i>{{MonthData.minRate}}%-{{MonthData.maxRate}}%</i>管理费</li>
                    <li><button @click="goFinancing('trade-month')" class="active3">立即申请</button></li>
                </ul>
            </div>
        </div>

        <!-- 免息t+1 -->
        <div class="wrap main main2" v-if="freeFlag">
            <div class="left">
                <p class="tit">免息T+1</p>
                <p class="sub">热门新活动</p>
            </div>
            <div class="right2">
                <p class="tit">免息T+1</p>
                <div class="detal">
                    <ul class="item">
                        <li>操盘起点</li>
                        <li><i>{{freeData.minInput}}</i>元</li>
                        <li>保证金</li>
                    </ul>
                    <ul class="item">
                        <li>最大操盘资金</li>
                        <li><i>{{freeData.maxInput}}</i>元</li>
                        <li>操盘额</li>
                    </ul>
                    <ul class="item">
                        <li>放大比例</li>
                        <li><i>{{freeData.min}}-{{freeData.max}}</i>倍</li>
                        <li>盈利放大</li>
                    </ul>
                    <ul class="item">
                        <li>操盘费用</li>
                        <li><i>2</i>天</li>
                        <li>免息操盘</li>
                    </ul>
                </div>
                <div align="center" class="free-sub">
                    <button @click="goFinancing('trade-free')" class="active4">立即申请</button>
                </div>
                <!-- <p class="tip">每人限1次</p> -->
            </div>
        </div>

        <!-- 免息体验 -->
        <div class="wrap main main2 main4">
            <div class="left">
                <p class="tit">新手专享</p>
                <p class="sub">新手专享 福利多多</p>
            </div>
            <div class="right2">
                <p class="tit">免息体验</p>
                <div class="detal">
                    <ul class="item">
                        <li>操盘起点</li>
                        <li><i>{{min_stock_finance}}</i>元</li>
                        <li>保证金</li>
                    </ul>
                    <ul class="item">
                        <li>赠送操盘资金</li>
                        <li><i>{{max_stock_finance}}</i>元</li>
                        <li>操盘额</li>
                    </ul>
                    <ul class="item">
                        <li>放大比例</li>
                        <li><i>{{product_times}}</i>倍</li>
                        <li>盈利放大</li>
                    </ul>
                    <ul class="item">
                        <li>操盘费用</li>
                        <li><i>3</i>天</li>
                        <li>免息操盘</li>
                    </ul>
                </div>
                <div align="center" class="free-sub">
                    <button @click="goFinancing('freeTrial')" class="active4">立即申请</button>
                </div>
                <p class="tip">每人限1次</p>
            </div>
            <div class="right-png">
                <img src="~/static/images/img_new2.png">
            </div>
        </div>

        <!-- app下载 -->
        <div class="wrap main main3">
            <div class="left">
                <p class="tit">APP下载</p>
                <p class="sub">下载APP 操盘更容易</p>
            </div>
            <div class="right3">
                <ul class="item">
                    <li>{{platform_name}}APP</li>
                    <li>随时随地操盘</li>
                    <li>让您的股票飞起来</li>
                </ul>
                <div class="item2"><img src="~/static/images/img_phone.png"></div>
                <div class="item3">
                    <ul v-if="urlData.androidDownloadUrl != ''">
                        <li><img :src="urlData.androidDownloadUrl"></li>
                        <li><img src="~/static/images/img_android.png"></li>
                    </ul>
                    <ul v-if="urlData.iosDownloadUrl != ''">
                        <li><img :src="urlData.iosDownloadUrl"></li>
                        <li><img src="~/static/images/img_iOS.png"></li>
                    </ul>
                    <ul v-if="urlData.androidDownloadUrl == ''">
                        <li class="without-url">暂未提供安卓版APP下载</li>
                        <li><img src="~/static/images/img_android.png"></li>
                    </ul>
                    <ul v-if="urlData.iosDownloadUrl == ''">
                        <li class="without-url">暂未提供ios版APP下载</li>
                        <li><img src="~/static/images/img_iOS.png"></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {getItem, setItem, successMsg, errorMsg, formatTime, validLogin} from "~/plugins/methods";
import {getDownloadApp} from "~/api/personal";
import {bus} from "~/plugins/bus";
import {getProducts} from "../api/trade";
import {amountData} from "../api/api";

export default {
    data() {
        return {
            platform_name: '',
            agent_id: '',
            min_stock_finance: '',
            max_stock_finance: '',
            product_times: '',
            freeProductStartTime: '',
            register_time: '',
            urlData: {},
            dayData: {},
            MonthData: {},
            weekData: {},
            freeData: {},
            freeFlag: false
        }
    },
    methods: {
        updateIndexData() {
            let indexData = getItem('indexData')
            let userInfo = getItem('userInfo')
            if (indexData) {
                this.platform_name = indexData.platform_name
                this.agent_id = indexData.id
                this.freeProductStartTime = indexData.freeProductStartTime
                this.min_stock_finance = indexData.fee_product.min_stock_finance
                this.max_stock_finance = indexData.fee_product.min_stock_finance * indexData.fee_product.product_times
                this.product_times = indexData.fee_product.product_times
                this.freeFlag = indexData.product_type.toString().indexOf('5') > -1
            }
            if (userInfo) {
                this.register_time = userInfo.register_time
            }
        },
        update() {
            getDownloadApp({agent_id: this.agent_id}).then(res => {
                this.urlData = res.data
            })
        },
        getProduct () {
            getProducts().then((res) => {
                if (res.status == 1) {
                    setItem("products", res.data)
                    setItem("amount", amountData)
                    let productData = res.data
                    let day = productData[1]
                    let month = productData[2]
                    let week = productData[4]
                    let free = productData[5]
                    this.dayData = this.maxMin(day)
                    this.MonthData = this.maxMin(month)
                    this.weekData = this.maxMin(week)
                    this.freeData = this.maxMin(free)
                }
            })
        },
        goFinancing (dir) {
            this.$router.push({name: dir})
        },
        goFreeTrial() {
            this.$router.push({name: 'freeTrial'})
        },
        maxMin(arg) {
            return {
                max: arg[0].product_times,
                min: arg[arg.length - 1].product_times,
                maxRate: (arg[0].interests_rate * 100).toFixed(2),
                minRate: (arg[arg.length - 1].interests_rate * 100).toFixed(2),
                minInput: arg[arg.length - 1].min_stock_finance,
                maxInput: arg[arg.length - 1].max_stock_finance
            }
        },
    },
    mounted() {
        this.updateIndexData()
        this.update()
        this.getProduct()
        bus.$on('updateIndexData', () => {
            this.updateIndexData()
        })
    }
}
</script>

<style scoped lang="less">
@import url(~assets/less/reset.less);
@import url(~assets/less/product.less);
</style>
