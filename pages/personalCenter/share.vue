<template>
    <div>
        <div class="main">
            <p class="title">分享赚钱</p>
            <div class="main-body">
                <div>
                    <img src="~/static/images/img_sharemoney.png">
                </div>
                <div class="item1">
                    <img src="~/static/images/img_title1.png" class="item1-img">
                    <div class="code-img">
                        <img :src="userInfo.bar_code">
                    </div>
                    <p class="txt">专属推荐二维码</p>
                    <ul class="link">
                        <li>专属邀请链接</li>
                        <li><input type="text" v-model="userInfo.pc_adv_url" readonly></li>
                        <li><button type="button" v-clipboard:copy="userInfo.pc_adv_url" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</button></li>
                    </ul>
                    <ul class="link link1">
                        <li>专属邀请码</li>
                        <li><input type="text" v-model="userInfo.cust_rec_code" readonly></li>
                        <li><button type="button" v-clipboard:copy="userInfo.cust_rec_code" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</button></li>
                    </ul>
                </div>
                <div class="item1 item2">
                    <img src="~/static/images/img_title2.png" class="item1-img">
                    <ul class="navTab">
                        <li :class="{selected: flag == '邀请记录'}" @click="changeTab('邀请记录')">邀请记录</li>
                        <li :class="{selected: flag == '我的收益'}" @click="changeTab('我的收益')">我的收益</li>
                    </ul>
                    <div v-if="flag == '邀请记录'">
                        <ul class="itemNav">
                            <li>序号</li>
                            <li>手机号</li>
                            <li>级别</li>
                            <li>注册时间</li>
                        </ul>
                        <div class="nav-item1">
                            <ul class="content" v-for="(item,key) in PromotionUsers" :key="key">
                                <li>{{key+1}}</li>
                                <li>{{item.cellphone}}</li>
                                <li>{{item.level}}</li>
                                <li>{{item.registerTime}}</li>
                            </ul>
                        </div>
                    </div>

                    <div v-if="flag == '我的收益'">
                        <ul class="itemNav itemNav2">
                            <li>手机号</li>
                            <li>操盘类型</li>
                            <li>管理费</li>
                            <li>我的收益</li>
                        </ul>
                        <div class="nav-item1">
                            <ul class="content content1" v-for="(item,key) in PromotionPercentages" :key="key">
                                <li>{{item.cust.cellphone}}</li>
                                <li>{{item.stock_financing.product_type}}</li>
                                <li>{{item.total_insterests}}</li>
                                <li>{{item.cust_interests}}</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="item1 item3">
                    <img src="~/static/images/img_title3.png" class="item1-img">
                    <div class="item3-item">
                        <ul>
                            <li>活动简介</li>
                            <li>自2016年9月1日起邀请新用户注册并成功操盘，可获得被邀请人支付管理费7.00%的返现奖励。</li>
                        </ul>
                        <ul class="rule">
                            <li>返现奖励的生效条件</li>
                            <li>被邀请人申请按天操盘/按月操盘，并成功支付管理费;极惠操盘/互惠操盘/活动产品不参加邀请返现。</li>
                        </ul>
                        <ul class="rule">
                            <li>返现奖励规则</li>
                            <li>被邀请人申请按天操盘/按月操盘，并成功支付管理费;极惠操盘/互惠操盘/活动产品不参加邀请返现。</li>
                        </ul>
                        <ul class="rule">
                            <li>返现奖励发放规则</li>
                            <li>系统在结算完被邀请人合约的管理费后，立即存入返现奖励到邀请人账户中，可直接提现。</li>
                        </ul>
                        <ul class="rule">
                            <li>返现奖励有效期说明</li>
                            <li>自被邀请人完成本站注册之日开始计算，有效期一年。</li>
                        </ul>
                        <ul class="rule">
                            <li>红包奖励说明</li>
                            <li>邀请人可以设置红包金额，被邀请人进行实名认证后，从邀请人的账户余额中发放给被邀请人红包。如果发放的时候，邀请人的账户余额不足，则视为无效的邀请。</li>
                        </ul>
                        <p class="belong"> * 本活动最终解释权归{{platform_name}}所有</p>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {errorMsg, successMsg, getItem} from '~/plugins/methods';
import {getPromotionPercentages, getPromotionUsers} from "../../api/personal";

export default {
    name: "share",
    data() {
        return {
            flag: '',
            platform_name: '',
            userInfo: {},
            PromotionUsers: [],
            PromotionPercentages: []
        }
    },
    methods: {
        onCopy(e) {
            successMsg("您已经复制成功了！")
        },
        onError(e) {
            console.log(e)
        },
        changeTab(tab) {
            this.flag = tab
        },
        getInfo(){
            this.userInfo = getItem('userInfo')
            this.platform_name = getItem('indexData').platform_name
        },
        getData(){
            let _this = this
            getPromotionPercentages({level: 0}).then(function (data) {
                if(data.status){
                    _this.PromotionPercentages = data.data.data
                }else{
                    errorMsg(data.msg)
                }
            }).catch(function (err) {
                errorMsg("未知错误发生！请稍候再试")
            })
            getPromotionUsers({level: 0}).then(function (data) {
                if(data.status){
                    _this.PromotionUsers = data.data.data
                }else{
                    errorMsg(data.msg)
                }
            }).catch(function (err) {
                errorMsg("未知错误发生！请稍候再试")
            })
        }
    },
    mounted() {
        this.changeTab('邀请记录')
        this.getInfo()
        this.getData()
    }
}
</script>

<style scoped lang="less">
@import url(~assets/less/share.less);
</style>
