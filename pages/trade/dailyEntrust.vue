<template>
    <div>
        <div class="main">
            <no-ssr>
                <table>
                    <thead>
                        <tr>
                            <th>委托时间</th>
                            <th>股票/代码</th>
                            <th>方向</th>
                            <th>价格</th>
                            <th>数量</th>
                            <th>状态</th>
                        </tr>
                    </thead>
                    <tbody v-for="(value, key) in financings" :key="key" v-if="isloaded ">
                        <tr class="tit">合约{{key}}</tr>
                        <tr v-for="item in value">
                            <td>{{item.stock_finance_entrust_time}}</td>
                            <td>{{item.stock_name}} {{item.stock_code}}</td>
                            <td class="fontRed"  v-if="item.sold_or_buy==1">买入</td>
                            <td class="fontBlue"  v-if="item.sold_or_buy==2">卖出</td>
                            <td>{{item.entrust_price}}</td>
                            <td>{{item.entrust_amount}}</td>
                            <td>{{item.type_text}}</td>
                        </tr>
                    </tbody>
                    <tbody  v-if="financings.length == 0">
                        <tr  class="nothing"><td>暂无记录</td></tr>
                    </tbody>
                </table>
            </no-ssr>
            <div class="pagination" v-if="totalPage > 1">
                <el-pagination
                        background
                        layout="prev, pager, next"
                        :page-count="totalPage"
                        :currentPage = "currentPage"
                        @current-change="handleCurrentChange"
                        @prev-click="handlePrev"
                        @next-click="handleNext"
                >
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import {getEntrusts, getStockFinances} from "../../api/trade";
    import {loadingOpen, loadingClose} from "../../plugins/methods";

    export default {
    name: "dailyEntrust",
    data() {
        return {
            totalPage: 1,
            currentPage: 1,
            pageSize: 15,
            data: [],
            financings: [],
            fin: [],
            finanlData: {},
            isloaded: false
        }
    },
    methods: {
        getData() {
            let _this = this
            _this.isloaded = false
            getEntrusts(this.currentPage, this.pageSize,{withInfo: true}).then((res) => {
                if(res.status == 1) {
                    if (res.data.data.length != 0) {
                        _this.financings = res.data.data
                        _this.totalPage = res.data.last_page
                        _this.$nextTick(() => {
                            _this.isloaded = true
                        })
                    }
                } else {
                    errorMsg(res.msg)
                }
            })
        },
        handleCurrentChange(event){
            this.currentPage = event
            this.getData()
        },
        handlePrev(){
            this.currentPage = this.currentPage --
            this.getData()
        },
        handleNext(){
            this.currentPage = this.currentPage ++
            this.getData()
        }
    },
    mounted() {
        this.getData()
    },
}
</script>

<style scoped lang="less">
@import url(~assets/less/reset.less);
@import url(~assets/less/cancel.less);
    .pagination{
        margin-top: 5px;
        text-align: right;
    }
</style>
