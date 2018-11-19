<template>
    <div>
        <!-- 免息体验 -->
        <div class="main">
            <img :src="headerImgInfo[0] && headerImgInfo[0].picUrl" class="main-img">
            <div class="row1">
                <div class="row1-img"><img src="~static/images/img_ribbon.png"></div>
                <div class="row1-main">
                    <div class="row1-main-left"><img src="~static/images/img_3888.png"></div>
                    <ul class="row1-main-right">
                        <li>{{freetrialMount}}元体验金</li>
                        <li>今有<i v-for="(n, k) in arr" :key="k">{{n}}</i>人参与</li>
                        <li>总计156324人参与</li>
                    </ul>
                </div>
            </div>
            <div class="row2" @click="trail">
                <button>立即领取</button>
            </div>
            <div class="row3">
                <div class="row3-tit">活动规则</div>
                <ul class="row3-rule">
                    <li>1.赠送{{freetrialMount}}元实盘资金（完全免息）</li>
                    <li>2.您交{{freetrialCost}}元保证金（结束时如无亏损全额返还，如亏损则扣除亏损剩余返还）</li>
                    <li>3.总共{{totalMoney}}元实盘资金（由您操盘，盈利全归您）</li>
                    <li>4.盈利归您，亏损自负（无亏损保证金全额退还，如交易账户总资产低于{{lossLine}}元将会自动平仓并终止体验，亏损将从保证金中扣除，超出保证金亏损部分由{{platform_name}}承担）</li>
                    <li>5.免息操盘资金仅限使用3个交易日，第3个交易日只能卖出不能买入，如第3个交易日未卖出股票，系统将自动卖出股票，不保证卖出价格</li>
                    <li>*{{platform_name}}拥有本次活动最终解释权</li>
                </ul>
            </div>
            <div class="row3 row4">
                <div class="row3-tit">细数券商三宗罪</div>
                <div class="row4-content">
                    <ul>
                        <li><img src="~static/images/img_crime1.png"></li>
                        <li>开户速度慢</li>
                        <li>开户流程繁琐</li>
                        <li>线下排队挤破头</li>
                    </ul>
                    <ul>
                        <li><img src="~static/images/img_crime2.png"></li>
                        <li>风险控制差</li>
                        <li>一不小心就被套</li>
                    </ul>
                    <ul>
                        <li><img src="~static/images/img_crime3.png"></li>
                        <li>客服不尽心</li>
                        <li>客服电话难接通</li>
                        <li>处理问题效率低下</li>
                    </ul>
                </div>
            </div>
            <div class="row3 row5">
                <div class="row5-content">
                    <img :src="compareImgInfo[0] && compareImgInfo[0].picUrl" class="row5-img">
                    <ul class="row5-left-cont">
                        <li>30秒</li>
                        <li>股票上涨10% 利润可达90%</li>
                        <li>分级止损预警</li>
                        <li>人工止损预警</li>
                    </ul>
                    <ul class="row5-right-cont">
                        <li>24小时</li>
                        <li>股票上涨10% 利润可达10%</li>
                        <li>无</li>
                        <li>无</li>
                    </ul>
                </div>
            </div>
            <div class="row6">
                <ul>
                    <li><img src="~static/images/img_protection1.png"></li>
                    <li>资金保障</li>
                    <li>第三方支付机构为平台提供资金委托服务</li>
                    <li>严格把控，确保用户资金安全</li>
                </ul>
                <ul>
                    <li><img src="~static/images/img_protection2.png"></li>
                    <li>信息保障</li>
                    <li>国际领先的系统加密保护技术，保障用户</li>
                    <li>交易信息和资金信息不泄露。</li>
                </ul>
                <ul>
                    <li><img src="~static/images/img_protection3.png"></li>
                    <li>项目保险</li>
                    <li>设立严格的风控制度，从而实现全过程资金</li>
                    <li>严控，保证资金安全。</li>
                </ul>
            </div>
        </div>

        <!-- 弹窗 -->
        <el-dialog title="免息体验" :visible.sync="dialogVisible" width="20%" :center=true :show-close=false>
            <ul class="free-dialog">
                <li>
                    <span>保证金</span>
                    <span>{{freetrialCost}}</span>
                </li>
                <li>
                    <span>操盘额</span>
                    <span>{{freetrialMount}}</span>
                </li>
                <li>
                    <span>总操盘资金</span>
                    <span>{{totalMoney}}</span>
                </li>
                <li>
                    <span>操盘期限</span>
                    <span>3个交易日</span>
                </li>
            </ul>
            <div align="center">
                <button class="free-cancel" @click="dialogVisible = false">取消</button>
                <button class="free-button" :disabled="isSubmitting"  @click="trailRightNow">确认</button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {validLogin, successMsg, errorMsg, getItem} from "~/plugins/methods";
import {stockFinanceOfFree} from '~/api/trade';
import {bus} from '~/plugins/bus';

export default {
    data() {	
        return {
            freetrialCost: '200',
            freetrialMount: '3888',
            totalMoney: '4088',
            lossLine: '3948',
            isSubmitting: false,
            totalPerson: '1326',
            activityRules: {},
            arr: [],
            dialogVisible: false,
            platform_name: '',
            headerImgInfo: [],
            compareImgInfo: [],
            rate: 0
        }
    },
    methods: {
        trail() {
            this.$alert('该合约免费体验3个交易日，第3个交易日只能卖不能买， 如第3个交易日14:30之前未卖清股票，系统将自动卖出持仓股票，不保证卖出价格，由此造成您的本金亏损，我方概不负责。', '提示', {
                confirmButtonText: '确定',
                callback: (action, instance, done) => {
                    if (action === 'confirm') {
                        this.dialogVisible = true
                    }
                }
            })
            .then(action => {})
        },
        trailRightNow() {
            let _this = this
            if (!validLogin()) {
                this.valid()
            } else {
                _this.isSubmitting = true
                stockFinanceOfFree().then(function (res) {
                    if (res.status == 1) {
                        successMsg("领取成功")
                        _this.$router.push({name: 'trade-financingDetails', query: {id: 1}})
                    } else {
                        if (res.msg == "请先实名认证再进行操盘") {
                            _this.$confirm('请先实名认证再开操盘合约', '提示', {
                                confirmButtonText: '去认证',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                _this.$router.push('/personalCenter/authentication')
                            }).catch(() => {
                                _this.dialogVisible = false
                            })
                        } else {
                            errorMsg(res.msg)
                        }
                    }
                }).then((res) => {
                    _this.isSubmitting = false
                })
            }
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
        updateIndexData() {
            let indexData = getItem("indexData")
            if (indexData) {
                this.platform_name = indexData.platform_name
                this.headerImgInfo = indexData.others[8] || this.headerImgInfo
                this.compareImgInfo = indexData.others[9] || this.compareImgInfo
                this.freetrialCost = indexData.fee_product.min_stock_finance
                this.rate = indexData.fee_product.product_times
                this.freetrialMount = Number(this.freetrialCost) * Number(this.rate)
                this.totalMoney = Number(this.freetrialCost) + Number(this.freetrialMount)
                this.lossLine = this.totalMoney - (this.freetrialCost * 0.7)
            }
        }
    },
    mounted() {
        this.updateIndexData()
        bus.$on('updateIndexData', () => {
            this.updateIndexData()
        })
        this.arr = this.totalPerson.split('')
    }
}
</script>

<style scoped lang="less">
@import url(~assets/less/freetrial.less);
</style>