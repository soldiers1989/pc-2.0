<template>
    <div>
        <div class="main">
            <p class="money">总资产<i>{{moneyData.totalAssets}}</i>可用余额<i>{{moneyData.cash}}</i>证券净值<i>{{moneyData.securitiesNetWorth}}</i></p>
            <div class="main-body">
                <div class="select">
                    <span v-for="(tab, index) in tabs" :class="{cur: iscur==index}" :key=index @click="iscur=index, tabChange('select' + (index + 1))">{{tab.name}}</span>
                </div>
                <component :is="tabView"></component>
            </div>
        </div>
    </div>
</template>

<script>
import select1 from '~/pages/recharge/recharge.vue';
import select2 from '~/pages/recharge/rechargeList.vue';
import {getAccountCount} from "../../api/personal";

export default {
    name: "recharge",
    data() {
        return {
            tabView: 'select1',
            tabs: [{name: "充值"}, {name: "充值记录"}],
            iscur: 0,
            moneyData: []
        }
    },
    components: {
        select1,
        select2
    },
    methods: {
        tabChange(tab) {
            this.tabView = tab
        },
        getData() {
            getAccountCount({}).then(res => {
                if (res.status == 1) {
                    this.moneyData = res.data
                }
            })
        }
    },
    mounted() {
        this.getData()
    }
}
</script>

<style scoped lang="less">
@import url(~assets/less/reset.less);
.main {
    background-color: #fff;
    .money {
        color: @333;
        margin: 50px;
        margin-bottom: 30px;
        i {
            padding: 0 25px;
            font-style: normal;
        }
    }
    .main-body {
        background-color: #fff;
        margin: 0 35px;
        padding-bottom: 15px;
        .select {
            border-bottom: 1px solid #EEEEEE;
            padding-left: 15px;
            span {
                width: 90px;
                height: 36px;
                line-height: 36px;
                text-align: center;
                display: inline-block;
                border: 1px solid #ccc;
                margin-bottom: 15px;
            }
            span:nth-child(2) {
                margin-left: 25px;
            }
        }
    }
}

.cur {
    background-color: #EB2F30 !important;
    color: #fff;
    border: 1px solid #EB2F30 !important;
}
</style>
