<template>
    <div slot="select1">
        <div class="main">
            <ul class="main-header">
                <li class="header-list" @click="changePage('liKePay')" :class="{selected : showFlag == 'liKePay'}" v-if="isSupportLikePay">立客支付</li>
                <li class="header-list" @click="changePage('quickPay')" :class="{selected : showFlag == 'quickPay'}" v-if="isSupportXPay">快捷支付</li>
                <li class="header-list" @click="changePage('bankTransfer')" :class="{selected : showFlag == 'bankTransfer'}" v-if="isSupportOfflineTransfer">银行转账</li>
                <li class="header-list" @click="changePage('gatewayPay')" :class="{selected : showFlag == 'gatewayPay'}" v-if="isSupportXPay">网关支付</li>
                <li class="header-list" @click="changePage('AliCode')" :class="{selected : showFlag == 'AliCode'}" v-if="isSupportPayMonitor">支付宝扫码</li>
                <li class="header-list" @click="changePage('WeChatCode')" :class="{selected : showFlag == 'WeChatCode'}" v-if="isSupportPayMonitor">微信扫码</li>
            </ul>
            <div class="main-body">
                <bankTransfer v-if="showFlag == 'bankTransfer'"></bankTransfer>
                <quickPay v-if="showFlag == 'quickPay'" :uid="this.uid"></quickPay>
                <AliCode v-if="showFlag == 'AliCode'" :uid="this.uid"></AliCode>
                <WeChatCode v-if="showFlag == 'WeChatCode'" :uid="this.uid"></WeChatCode>
                <liKePay v-if="showFlag == 'liKePay'" :uid="this.uid"></liKePay>
                <gatewayPay v-if="showFlag == 'gatewayPay'" :uid="this.uid"></gatewayPay>
            </div>
        </div>
    </div>
</template>

<script>
import bankTransfer from '~/pages/recharge/rechargeItem/bankTransfer.vue';
import quickPay from '~/pages/recharge/rechargeItem/quickPay.vue';
import AliCode from '~/pages/recharge/rechargeItem/AliCode.vue';
import WeChatCode from '~/pages/recharge/rechargeItem/WeChatCode.vue';
import liKePay from '~/pages/recharge/rechargeItem/liKePay.vue';
import gatewayPay from '~/pages/recharge/rechargeItem/gatewayPay.vue';
import {getItem} from "../../plugins/methods";

export default {
    data() {
        return {
            showFlag: 'bankTransfer',
            isSupportHBIPS: 0,
            isAliPay: 0,
            isSupportWx: 0,
            uid: "",
            isSupportOfflineTransfer: 0,
            isSupportUspay: 0,
            isSupportPushua: 0,
            isSupportShande: 0,
            isSupportPlankroads: 0,
            isSupportTfcpay: 0,
            isSupportBisrec: 0,
            isSupportJuhuifu: 0,
            isSupportUnPay: 0,
            isSupportIPS: 0,
            isSupportOrangePay: 0,
            isSupportLikePay: 0,
            isSupportLikeQPay: 0,
            isSupportLianlianPay: 0,
            isSupportAllScorePay: 0,
            isSupportJHZPay: 0,
            isSupportXPay: 0,
            isSupportPayMonitor: 0,
            isWeChatAliPay: 0,
            isSupportLian: 0,
        }
    },
    components: {
        bankTransfer, quickPay, AliCode, WeChatCode, liKePay, gatewayPay

    },
    methods: {
        changePage(pageFlag) {
            this.showFlag = pageFlag
        },
        upIndexData () {
            let indexData = getItem('indexData')
            let userInfo = getItem("userInfo")
            this.uid = userInfo.cust_id
            this.isSupportHBIPS = indexData.is_support_hbIps
            this.isAliPay = indexData.is_support_aliPay
            this.isSupportWx = indexData.is_support_WxPay,
            this.isSupportOfflineTransfer = indexData.is_support_offline_transfer
            this.isSupportUspay = indexData.is_support_uspay
            this.isSupportPushua = indexData.is_support_pushua
            this.isSupportShande = indexData.is_support_shande
            this.isSupportPlankroads = indexData.is_support_plankroads
            this.isSupportTfcpay = indexData.is_support_tfcpay
            this.isSupportBisrec = indexData.is_support_bisrec
            this.isSupportJuhuifu = indexData.is_support_juhuifu
            this.isSupportUnPay = indexData.is_support_unpay
            this.isSupportIPS = indexData.is_support_ips
            this.isSupportOrangePay = indexData.is_support_orangepay
            this.isSupportLikePay = indexData.is_support_likepay
            this.isSupportLianlianPay = indexData.is_support_lianlianpay
            this.isSupportLikeQPay = indexData.is_support_likeQPay
            this.isSupportAllScorePay = indexData.is_support_allScorePay
            this.isSupportJHZPay = indexData.is_support_JHZPay
            this.isSupportXPay = indexData.is_support_XPay
            this.isSupportPayMonitor = indexData.is_support_payMonitor
            this.isWeChatAliPay = Number(indexData.AliPayIsUse)
            this.isSupportLian = indexData.is_support_lian
        }
    },
    mounted () {
        this.upIndexData()
    }
}

</script>

<style scoped lang="less">
.main {
    margin-top: 15px;
    padding: 0 15px;
    .main-header {
        .header-list {
            width: 90px;
            height: 36px;
            line-height: 36px;
            text-align: center;
            display: inline-block;
            border: 1px solid #ccc;
            margin-right: 30px;
            cursor: pointer;
        }
        .selected {
            background-color: #EB2F30 !important;
            color: #fff;
            border: 1px solid #EB2F30 !important;
        }
    }
}

</style>
