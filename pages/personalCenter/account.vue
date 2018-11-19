<template>
    <div class="account_page">
        <div class="top_sec">
            <div class="head_pic">
                <img src="~static/images/img_1_big.png" alt="touxiang">
            </div>

            <ul>
                <li>{{userInfo.cellphone}}</li>
                <li>
                    <span>ID</span>
                    <span>{{userInfo.cust_id}}</span>
                </li>
                <li>
                    <span>注册时间</span>
                    <span>{{userInfo.register_time}}</span>
                </li>
            </ul>

            <ul>
                <li>
                    <!--checkRealName  methods.js limian-->
                    <span>实名认证</span>
                    <span @click="$router.push('/personalCenter/authentication')" v-if="!isRealName">去认证</span>
                    <span v-if="isRealName">√</span>
                </li>
                <li>
                    <span>绑定银行卡</span>
                    <span @click="$router.push('/personalCenter/cardCenter')" v-if="!isBindCard">去绑定</span>
                   <span v-if="isBindCard">√</span>
                </li>
            </ul>
        </div>

        <div class="bottom_sec">
            <div class="amount_sec">
                <div>
                    <p>总资产</p>
                    <p>{{moneyData.totalAssets | formatMoney}}</p>
                </div>
                <ul>
                    <li>
                        <span>可用余额</span>
                        <span>{{ moneyData.cash | formatMoney }}</span>
                    </li>
                    <li>
                        <span>冻结资金</span>
                        <span>{{ moneyData.freeze_cash | formatMoney }}</span>
                    </li>
                    <li>
                        <span>证券净值</span>
                        <span>{{ moneyData.securitiesNetWorth | formatMoney }}</span>
                    </li>
                </ul>
            </div>

            <div class="button_sec">
                <button @click="valid1">充值</button>
                <button @click="valid2">提现</button>
                <button @click="$router.push('/personalCenter/flow')">资金明细</button>
            </div>
        </div>
    </div>
</template>

<script>
    import {getAccountCount} from '@/api/personal';
    import {getItem, formatDate, formatMoney, checkRealName} from "@/plugins/methods";

    export default {
        data () {
            return {
                userInfo: {},
                indexData: {},
                moneyData: {},
                isRealName: false,
                isBindCard: false
            }
        },
        filters:{
            formatMoney: formatMoney
        },
        methods: {
            getData() {
                getAccountCount({}).then(res => {
                    if (res.status == 1) {
                        this.moneyData = res.data
                    }
                })
            },
            valid1() {
                let _this = this
                if (!checkRealName()) {
                    _this.$alert('您还没有实名，请先实名认证', '提示', {
                        confirmButtonText: '确定',
                        type: 'warning',
                        callback: action => {
                            _this.$router.push({name: 'personalCenter-authentication'})
                        }
                    });
                    return 
                } else {
                    _this.$router.push({name: 'personalCenter-recharge'})      
                }
            },
            valid2() {
                let _this = this
                if (!checkRealName()) {
                    _this.$alert('您还没有实名，请先实名认证', '提示', {
                        confirmButtonText: '确定',
                        type: 'warning',
                        callback: action => {
                            _this.$router.push({name: 'personalCenter-authentication'})
                        }
                    });
                } else if (this.userInfo.bankCards.length == 0) {
                    _this.$confirm('您还没有绑定银行卡，请先绑定银行卡', '提示', {
                        confirmButtonText: '确定',
                         cancelButtonText: '取消',
                        type: 'warning',
                    }).then(() => {
                        _this.$router.push({name: 'personalCenter-cardCenter'})
                    })
                } else {
                    _this.$router.push({name: 'personalCenter-withdraw'})      
                }
            }
        },
        mounted () {
            this.userInfo = getItem('userInfo')
            this.indexData = getItem('indexData')
            this.isRealName = checkRealName()
            this.isBindCard = this.userInfo.bankCards.length != 0
            this.getData()
        }
    }
</script>

<style scoped lang="less">
    @import url(~assets/less/mine.less);
</style>
