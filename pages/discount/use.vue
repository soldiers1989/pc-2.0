<template>
    <div>
        <div class="main">
            <div class="item" v-for="(item, key) in couponData" :key="key">
                <ul class="left">
                    <li class="money"><i>￥</i>{{ item.max_discount | formatMoney }}</li>
                    <li>余额：{{item.remain_discount | formatMoney }}</li>
                </ul>
                <ul class="right">
                    <li>单次{{item.rule | rules}}%抵扣</li>
                    <li>
                        <button class="no-use" @click="checkCoupon(item.id, item.valid_start_time)">立即使用</button>
                    </li>
                    <li>有效期{{item.valid_start_time.split(' ')[0]}}至{{item.valid_end_time.split(' ')[0]}}</li>
                </ul>
            </div>

            <div v-if="couponData.length == 0" class="no-data"><img src="~/static/images/img_nocontract.png"></div>
        </div>
    </div>
</template>

<script>
    import {coupons} from "~/api/personal";
    import {formatMoney} from "@/plugins/methods";
    import {enlarge} from "../../plugins/methods";
    import {errorMsg} from "../../plugins/methods";

    export default {
        data() {
            return {
                type: 1, // 可用优惠券
                couponData: []
            }
        },
        filters:{
            formatMoney: formatMoney,
            rules (obj) {
                return enlarge(obj, 2)
            }
        },
        methods: {
            getCouponData() {
                let _this = this
                coupons({type: this.type}).then((res) => {
                    if (res.status == 1) {
                        _this.couponData = res.data.data
                    }
                })
            },
            checkCoupon (id, time) {
                let d = new Date(time).getTime()
                let t = new Date().getTime()
                if (d > t) {
                    errorMsg("该优惠券需"+ time.split(" ")[0] +"才可使用")
                    return false
                }
                this.$router.push({name:"trade-day", query: {selectDiscountId: id}})
            }
        },
        computed: {
        },
        mounted() {
            this.getCouponData()
        },
    }
</script>

<style scoped lang="less">
    @import url(~assets/less/reset.less);
    @import url(~assets/less/coupon.less);
</style>
