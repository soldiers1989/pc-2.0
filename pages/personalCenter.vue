<template>
    <div class="wrap">

        <div class="person_title">
            <span>当前您所在的位置：</span>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/personalCenter' }">个人中心</el-breadcrumb-item>
                <el-breadcrumb-item>我的账户</el-breadcrumb-item>
                <el-breadcrumb-item v-if="routerName == 'personalCenter-recharge'">充值</el-breadcrumb-item>
                <el-breadcrumb-item v-if="routerName == 'personalCenter-withdraw'">提现</el-breadcrumb-item>
                <el-breadcrumb-item v-if="routerName == 'personalCenter-flow'">资金明细</el-breadcrumb-item>
                <el-breadcrumb-item v-if="routerName == 'personalCenter-authentication'">实名认证</el-breadcrumb-item>
                <el-breadcrumb-item v-if="routerName == 'personalCenter-safeCenter'">安全中心</el-breadcrumb-item>
                <el-breadcrumb-item v-if="routerName == 'personalCenter-cardCenter'">银行卡管理</el-breadcrumb-item>
                <el-breadcrumb-item v-if="routerName == 'personalCenter-discount'">优惠券</el-breadcrumb-item>
                <el-breadcrumb-item v-if="routerName == 'personalCenter-share'">分享赚钱</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="person_content">
            <div class="person_menu">
                <nav class="hole_menu">
                    <div>
                        <div @click="showMenu = !showMenu">
                            <nuxt-link to="/personalCenter/account" class="item" >
                                <img src="~/static/images/icon_account_select.png" class="account" v-if="routerName == 'personalCenter-account'">
                                <img src="~/static/images/icon_account_normal.png" class="account" v-else>
                                <span>我的账户</span>
                                <i class="el-icon-arrow-down" v-if="!showMenu"></i>
                                <i class="el-icon-arrow-up" v-else></i>
                            </nuxt-link>
                        </div>
                        <div v-show="showMenu" >
                            <nuxt-link :to="{name: 'trade-financingDetails', query: {id: 1}}" class="item item2">
                                <span>交易股票</span>
                            </nuxt-link>
                            <div @click="valid1">
                                <nuxt-link to="/personalCenter/recharge" class="item item2">
                                    <span>充值</span>
                                </nuxt-link>
                            </div>
                            <div @click="valid2">
                                <nuxt-link to="/personalCenter/withdraw" class="item item2">
                                    <span>提现</span>
                                </nuxt-link>
                            </div>
                            <nuxt-link to="/personalCenter/flow" class="item item2">
                                <span>资金明细</span>
                            </nuxt-link>
                        </div>
                    </div>
                    <nuxt-link to="/personalCenter/authentication" class="item">
                        <img src="~/static/images/icon_verified_select.png" class="verified" v-if="routerName == 'personalCenter-authentication'">
                        <img src="~/static/images/icon_verified_normal.png" class="verified" v-else>
                        <span>实名认证</span>
                    </nuxt-link>
                    <nuxt-link to="/personalCenter/safeCenter" class="item">
                        <img src="~/static/images/icon_password_select.png" class="password" v-if="routerName == 'personalCenter-safeCenter'">
                        <img src="~/static/images/icon_password_normal.png" class="password" v-else>
                        <span>安全中心</span>
                    </nuxt-link>
                    <nuxt-link to="/personalCenter/cardCenter" class="item">
                        <img src="~/static/images/icon_bankcard_select.png" class="bankcard" v-if="routerName == 'personalCenter-cardCenter'">
                        <img src="~/static/images/icon_bankcard_normal.png" class="bankcard" v-else>
                        <span>银行卡管理</span>
                    </nuxt-link>
                    <nuxt-link to="/personalCenter/discount" class="item" v-show="isEnableCoupon">
                        <img src="~/static/images/icon_coupon_select.png" class="coupon" v-if="routerName == 'personalCenter-discount'">
                        <img src="~/static/images/icon_coupon_normal.png" class="coupon" v-else>
                        <span>优惠券</span>
                    </nuxt-link>
                    <nuxt-link to="/personalCenter/share" class="item">
                        <img src="~/static/images/icon_share_select.png" class="share" v-if="routerName == 'personalCenter-share'">
                        <img src="~/static/images/icon_share_normal.png" class="share" v-else>
                        <span>分享赚钱</span>
                    </nuxt-link>
                </nav>
            </div>

            <div class="person_content-content">
                <nuxt-child />
            </div>
        </div>

    </div>
</template>

<script>
import {mapMutations} from 'vuex';
import {getItem, setItem, checkRealName, successMsg} from '~/plugins/methods';
import {TOKEN_OBJ_ID} from '~/api/ajax.js';
import {logout} from '~/api/personal.js';
import {bus} from "~/plugins/bus";

export default {
    data() {
        return {
            showMenu: true,
            routerName: "",
            isEnableCoupon: 0,
            userInfo: {}
        }
    },
    methods: {
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
                _this.$alert('您还没有绑定银行卡，请先绑定银行卡', '提示', {
                    confirmButtonText: '确定',
                    type: 'warning',
                    callback: action => {
                        _this.$router.push({name: 'personalCenter-cardCenter'})
                    }
                });
            } else {
                _this.$router.push({name: 'personalCenter-withdraw'})
            }
        },
        updateIndexData() {
            let indexData = getItem("indexData")
            if (indexData) {
                this.isEnableCoupon = Number(indexData.isEnableCoupon)
            }
        },
    },
    mounted() {
        this.routerName = this.$route.name
        this.userInfo = getItem('userInfo')
        this.updateIndexData()
        bus.$on('updateIndexData', () => {
            this.updateIndexData()
        })
    },
    updated() {
        this.routerName = this.$route.name
        this.userInfo = getItem('userInfo')
    }
}
</script>

<style lang="less" scoped>
    @import url(~assets/less/reset.less);
    @import url(~assets/less/mine.less);
</style>

