<template>
    <div>
        <div class="main">
            <p class="title">优惠券</p>
            <div class="main-body">
                <div class="select">
                    <span v-for="(tab, index) in tabs" :class="{cur: iscur==index}" :key=index
                          @click="iscur=index, tabChange('select' + (index + 1))">{{tab.name}}</span>
                </div>
                <ul class="deal">
                    <li>使用说明：</li>
                    <li>1.一个合约仅使用一张优惠券，不与其他优惠活动共享</li>
                    <li>2.多个合约可使用同一张优惠券，优惠券余额抵扣完或过期为止</li>
                </ul>
                <component :is="tabView" :discountData="useData"></component>
            </div>
        </div>
    </div>
</template>

<script>
    import select2 from '~/pages/discount/noUse.vue';
    import select1 from '~/pages/discount/use.vue';
    import select3 from '~/pages/discount/expired.vue';

    export default {
        name: "discount",
        data() {
            return {
                tabView: 'select1',
                tabs: [{name: "可用"}, {name: "不可用"}],
                iscur: 0,
                discountData: [],
                useData: []
            }
        },
        components: {
            select1,
            select2,
            select3
        },
        methods: {
            tabChange(tab) {
                this.tabView = tab
            }
        }
    }
</script>

<style scoped lang="less">
    .main {
        padding: 0 35px;
        .title {
            font-size: 18px;
            line-height: 40px;
            padding-top: 50px;
            color: #333;
            border-bottom: 1px solid #eee;
            text-indent: 15px;
        }
        .main-body {
            .select {
                padding-left: 15px;
                margin-top: 30px;
                margin-bottom: 30px;
                span {
                    width: 90px;
                    height: 36px;
                    line-height: 36px;
                    text-align: center;
                    display: inline-block;
                    border: 1px solid #ccc;
                    cursor: pointer;
                }
                span:nth-child(2) {
                    margin-left: 25px;
                }
                span:nth-child(3) {
                    margin-left: 25px;
                }
            }
            .deal {
                font-size: 14px;
                color: #449DE8;
                line-height: 30px;
                margin-bottom: 30px;
                padding-left: 15px;
            }
        }
    }

    .cur {
        background-color: #EB2F30 !important;
        color: #fff;
        border: 1px solid #EB2F30 !important;
    }
</style>
