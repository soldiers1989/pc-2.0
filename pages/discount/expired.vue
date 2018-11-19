<template>
    <div>
        <div class="main">
            <div class="item">
                <ul class="left">
                    <li class="money"><i>￥</i>200</li>
                    <li>余额：36</li>
                </ul>
                <ul class="right">
                    <li>50%管理费抵扣券</li>
                    <li><button class="use">已过期</button></li>
                    <li>有效期  2018.8.15-2018.9.14</li>
                </ul>
            </div>
            <div class="item">
                <ul class="left">
                    <li class="money"><i>￥</i>200</li>
                </ul>
                <ul class="right">
                    <li>50%管理费抵扣券</li>
                    <li><button class="use">已过期</button></li>
                    <li>有效期  2018.8.15-2018.9.14</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {}
    },
    props: {
        discountData: {
            type: Array
        }
    },
    methods: {}
}
</script>

<style scoped lang="less">
@import url(~assets/less/reset.less);
@import url(~assets/less/coupon.less);
</style>
