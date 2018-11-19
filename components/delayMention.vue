<template>
    <div>
        <el-dialog
            title="自动延期说明"
            :visible.sync="delayMention"
            width="30%"
            :before-close="delayMentionClose">
            <div class="confirm_financing">
                <p>按天操盘：默认自动延期</p>
                <p>按周操盘：可以选择否，到期日有持仓仍自动延期1周，无持仓则系统自动结算。</p>
                <p>按月操盘：可以选择否，到期日有持仓仍自动延期1个月，无持仓则系统自动结算。</p>
                <p v-if="!isOpenFree">免息操盘：不可延期，3个交易日到期</p>
                <p v-if="isOpenFree">免息T+1操盘：默认自动延期</p>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {bus} from "../plugins/bus";
    import {getItem} from "~/plugins/methods";

    export default {
        name: "delayMention",
        data () {
            return {
                delayMention: false,
                isOpenFree: false, // 是否包含免息T+1
            }
        },
        methods: {
            delayMentionClose (done) {
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
        mounted() {
            this.getProducts()
            bus.$on("openDelay", () => {
                this.delayMention = true
            })
        }
    }
</script>

<style scoped lang="less">
    @import url(~assets/less/trade.less);
</style>
