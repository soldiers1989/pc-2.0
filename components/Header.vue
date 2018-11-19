<template>
    <div>
        <div v-if="loginFlag" class="header">
            <div class="header-top">
                <p class="wrap">
                    <span>欢迎来到{{platform_name}}</span>
                    <span>客服热线：{{service_phone}}</span>
                </p>
            </div>
            <!-- 登入 -->
            <div class="wrap header-container">
                <div class="logo">
                    <h1 class="logo-tit">
                        <nuxt-link :to="'/'" class="item" exact>
                            <img :src="logoInfo[0] && logoInfo[0]['picUrl']">
                        </nuxt-link>
                    </h1>
                    <h2 class="logo-subtit">{{platform_name}}</h2>
                </div>
                <nav class="nav-list">
                    <nuxt-link :to="'/'" class="item" exact>
                        <span>首页</span>
                    </nuxt-link>
                    <nuxt-link to="/trade" class="item" >
                        <span>股票操盘</span>
                    </nuxt-link>
                    <nuxt-link to="/competition" class="item" v-if="isSupportCompetition">
                        <span>炒股大赛</span>
                    </nuxt-link>
                    <!-- <nuxt-link to="/freeTrial" class="item">
                        <span>免息体验</span>
                    </nuxt-link> -->
                    <nuxt-link :to="{name: 'consult', query:{tabView: 'select1', iscur: 0}}" class="item">
                        <span>资讯中心</span>
                    </nuxt-link>
                    <nuxt-link to="/help" class="item">
                        <span>帮助中心</span>
                    </nuxt-link>
                    <nuxt-link to="/about" class="item">
                        <span>关于我们</span>
                    </nuxt-link>
                    <nuxt-link to="/personalCenter" class="item">
                        <span>个人中心</span>
                    </nuxt-link>
                </nav>
                 <ul class="logout">
                    <li><img src="~/static/images/img_zhanghu.png"></li>
                    <li @click="routerTo('/personalCenter/account')">{{userInfo.cellphone}}</li>
                    <li></li>
                    <li @click="logout">退出</li>
                    <!-- <li><img src="~/static/images/img_sanjiao.png"></li> -->
                    <!-- <div class="message-box"  @click="logout">
                        <span>退出</span>
                        <div class="triangle-border tb-border"></div>
                        <div class="triangle-border tb-background"></div>
                    </div> -->
                </ul>
            </div>
        </div>
        <div v-if="!loginFlag" class="header header-logout">
            <div class="header-top">
                <p class="wrap">
                    <span>欢迎来到{{platform_name}}</span>
                    <span>客服热线：{{service_phone}}</span>
                </p>
            </div>
            <!-- 登出 -->
            <div class="wrap header-container">
                <div class="logo">
                    <h1 class="logo-tit">
                        <nuxt-link :to="'/'" class="item" exact>
                            <img :src="logoInfo[0] && logoInfo[0]['picUrl']">
                        </nuxt-link>
                    </h1>
                    <h2 class="logo-subtit">{{platform_name}}</h2>
                </div>
                <nav class="nav-list">
                    <nuxt-link :to="'/'" class="item" exact>
                        <span>首页</span>
                    </nuxt-link>
                    <nuxt-link to="/trade" class="item" >
                        <span>股票操盘</span>
                    </nuxt-link>
                    <nuxt-link to="/competition" class="item" v-if="isSupportCompetition">
                        <span>炒股大赛</span>
                    </nuxt-link>
                    <!-- <nuxt-link to="/freeTrial" class="item">
                        <span>免息体验</span>
                    </nuxt-link> -->
                    <nuxt-link :to="{name: 'consult', query:{tabView: 'select1', iscur: 0}}" class="item">
                        <span>资讯中心</span>
                    </nuxt-link>
                    <nuxt-link to="/help" class="item">
                        <span>帮助中心</span>
                    </nuxt-link>
                    <nuxt-link to="/about" class="item">
                        <span>关于我们</span>
                    </nuxt-link>
                    <a href="javascript:;" class="item" @click="valid">
                        <span>个人中心</span>
                    </a>
                </nav>
                <ul class="login">
                    <li><button @click="routerTo({name: 'login'})">登录</button></li>
                    <li><button @click="routerTo({name: 'register'})">注册</button></li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import {bus} from '~/plugins/bus.js';
import {setItem, getItem, validLogin} from "~/plugins/methods";
import {TOKEN_OBJ_ID, logout} from '~/api/ajax';
import {mapState, mapMutations} from 'vuex';

export default {
    watchQuery: ['page'],
    data() {
        return {
            loginFlag: false,
            userInfo: {},
            logoInfo: [],
            platform_name: '',
            service_phone: '',
            isSupportCompetition: false
        }
    },
    methods: {
        ...mapMutations(['routerTo']),
        logout() {
            this.$confirm('确认退出吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                logout()
                setItem("userInfo", "")
                setItem(TOKEN_OBJ_ID, "")
                this.loginFlag = false
                this.$router.push({name: 'login'})
            })
        },
        updateUserInfo() {
            if (validLogin()) {
                this.userInfo = getItem("userInfo")
                this.loginFlag = true
            }
        },
        updateIndexData() {
            let indexData = getItem("indexData")
            if (indexData) {
                this.platform_name = indexData.platform_name
                this.logoInfo = indexData.others[6] || this.logoInfo
                this.service_phone = indexData.service_phone
                this.isSupportCompetition = indexData.is_show_stock_competition
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
        }
    },
    watch: {
        loginFlag(newVal, oldVal) {}
    },
    mounted() {
        let _this = this
        this.updateUserInfo()
        this.updateIndexData()
        bus.$on('updateIndexData', () => {
            _this.updateIndexData()
        })
        bus.$on('updateUserInfo', () => {
            _this.updateUserInfo()
        })
        bus.$on('logout', () => {
            setItem("userInfo", "")
            setItem(TOKEN_OBJ_ID, "")
            this.loginFlag = false
            this.$router.push({name: 'login'})
        })
    }
}
</script>

<style lang="less" scoped>
@import url(~assets/less/reset.less);
@import url(~assets/less/header.less);
</style>
