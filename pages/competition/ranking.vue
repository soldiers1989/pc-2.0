<template>
    <div class="wrap">
        <div class="main">
            <table>
                <thead>
                <tr>
                    <th>排名</th>
                    <th>操盘手</th>
                    <th>合约市值</th>
                    <th>盈亏</th>
                    <th>收益率</th>
                </tr>
                </thead>
                <tbody v-if="list.length">
                <tr v-if="list.length">
                    <td><img src="~/static/images/icon_1.png"></td>
                    <td>{{first.user.cellphone}}</td>
                    <td>{{first.market_value}}</td>
                    <td>{{first.win_loss}}</td>
                    <td>{{first.win_loss_rate}}%</td>
                </tr>
                <tr v-if="list.length > 1">
                    <td><img src="~/static/images/icon_2.png"></td>
                    <td>{{second.user.cellphone}}</td>
                    <td>{{second.market_value}}</td>
                    <td>{{second.win_loss}}</td>
                    <td>{{second.win_loss_rate}}%</td>
                </tr>
                <tr v-if="list.length > 2">
                    <td><img src="~/static/images/icon_3.png"></td>
                    <td>{{third.user.cellphone}}</td>
                    <td>{{third.market_value}}</td>
                    <td>{{third.win_loss}}</td>
                    <td>{{third.win_loss_rate}}%</td>
                </tr>
                <tr v-for="(value, key) in others" :key="key" v-if="others.length">
                    <td>{{value.user.cellphone}}</td>
                    <td>{{value.market_value}}</td>
                    <td>{{value.win_loss}}</td>
                    <td>{{value.win_loss_rate}}%</td>
                </tr>
                </tbody>
            </table>
            <p class="end">加油冲进前十名吧！</p>
        </div>
    </div>
</template>

<script>
    import {competitionList} from "../../api/trade";

    export default {
        data: function () {
            return {
                list: [],
                top: [],
                others: [],
                first: {user: {cellphone: ""}},
                second: {user: {cellphone: ""}},
                third: {user: {cellphone: ""}}
            }
        },
        methods: {
            getData() {
                competitionList().then((res) => {
                    if (res.status == 1) {
                        this.list = res.data
                        const [first, second, third, ...others] = this.list
                        this.first = first
                        this.second = second
                        this.third = third
                        this.others = others
                    }
                })
            }
        },
        mounted () {
            this.getData()
        }
    }
</script>

<style scoped lang="less">
    @import url(~assets/less/competition.less);

    .main {
        height: 970px;
        background-color: #0F1943;
        margin-top: 50px;
        border: 5px solid rgba(43, 56, 111, 1);
        border-radius: 20px;
        .end {
            text-align: center;
            color: #98B1E2;
            padding-top: 44px;
        }
    }
</style>
