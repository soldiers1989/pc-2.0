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
                    <li><button class="use" disabled>不可使用</button></li>
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
export default {
    data() {
        return {
            type: 2, // 不可用优惠券
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
        }
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
