<template>
    <div>
        <!--自动补保-->
        <el-dialog
            title="自动补保说明"
            :visible.sync="dialogAutoPay"
            width="30%"
            :before-close="dialogAutoPayClose">
            <div class="confirm_financing">
                <p class="font_mention">1、当您申请成功的操盘合约触发预警线时，系统自动补齐保证金（原保证金的60%）至操盘合约中，以确保您的操盘合约处于正常状态；</p>
                <p class="font_mention">2、追加金额来源于您的个人账户余额，请确保账户余额充足，若账户余额不足以追加保证金，系统自动采取个人账户余额有多少即补多少保证金的方案，望知晓；</p>
                <p class="font_mention">3、当您的个人账户余额为负数时，自动补齐保证金功能失效，后果自负。</p>
                <p class="font_mention" v-if="!isOpenFree">4、免息操盘：不可追保</p>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {bus} from "../plugins/bus";
    import {getItem} from "~/plugins/methods";

    export default {
        name: "dialogAutoPay",
        data () {
            return {
                dialogAutoPay: false,
                isOpenFree: false, // 是否包含免息T+1
            }
        },
        methods: {
            dialogAutoPayClose(done) {
                done()
            },
            getProducts() {
                let indexData = getItem("indexData")
                // 是否包含免息T+1
                if (indexData) {
                    this.isOpenFree = indexData.product_type.toString().indexOf('5') > -1
                }
            }
        },
        mounted () {
            this.getProducts()
            bus.$on("openPay", () => {
                this.dialogAutoPay = true
            })
        }
    }
</script>

<style scoped lang="less">
    @import url(~assets/less/trade.less);
</style>
