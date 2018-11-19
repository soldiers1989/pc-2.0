<template>
    <div class="safeCenter_page">
        <p>{{title}}</p>

        <div class="safeCenter_Content" >
            <ul v-if="tab == 1">
                <li>
                    <span>登录密码</span>
                    <span>******</span>
                    <span @click="tab = 2">修改</span>
                </li>
                <li>
                    <span>提现密码</span>
                    <span v-if="setWithdrawPassword">无</span>
                    <span v-if="!setWithdrawPassword">******</span>
                    <span v-if="setWithdrawPassword"  @click="tab = 3">设置</span>
                    <span v-if="!setWithdrawPassword" @click="tab = 3">修改</span>
                </li>
            </ul>

            <m-login v-if="tab == 2"></m-login>
            <m-withdraw v-if="tab == 3"></m-withdraw>
        </div>
    </div>
</template>

<script>
    import mLogin from '~/components/safeCenter/login'
    import mWithdraw from '~/components/safeCenter/withdraw'
    export default {
        name: "safeCenter",
        components: {
            mLogin, mWithdraw
        },
        data () {
            return {
                // 是否设置提现密码
                setWithdrawPassword: false,
                tab: 1, // 1:显示用户信息， 2：显示修改登录密码  3：显示修改提现密码
            }
        },
        computed: {
            title () {
                if (this.tab == 1) {
                    return "安全中心"
                } else if (this.tab == 2) {
                    return "修改登录密码"
                } else {
                    return "修改提现密码"
                }
            }
        }
    }
</script>

<style scoped lang="less">
    @import url(~assets/less/mine.less);
</style>
