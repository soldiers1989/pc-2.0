<template>
    <div>
        <div class="main">
            <div class="search">
                <p>合约</p>
                <div>
                    <el-select ref="select" v-model="stockKey" placeholder="请选择合约" @change="changeStock()">
                        <el-option
                                v-for="(item,key) in stocks"
                                :key="key"
                                :label="item.product_name +'--'+ item.id"
                                :value="key">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <no-ssr>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>交易时间</th>
                            <th>交易类型</th>
                            <th>交易金额</th>
                            <th>余额</th>
                            <th>股票/代码</th>
                            <th>备注</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in stocksData">
                            <td>{{item.id}}</td>
                            <td>{{item.updated_time}}</td>
                            <td>{{item.account_type_text}}</td>
                            <td>{{item.account_money}}</td>
                            <td>{{item.available_amount}}</td>
                            <td>{{item.stock_name}} {{item.stock_code}}</td>
                            <td>{{item.account_remark}}</td>
                        </tr>
                        <tr  class="nothing" v-if="stockId == ''"><td>请先选择合约</td></tr>
                        <tr  class="nothing" v-if="stockId != '' && stocksData.length == 0"><td>暂无记录</td></tr>
                    </tbody>
                </table>
            </no-ssr>
            <div class="pagination" v-if="totalPage > 1">
                <el-pagination
                        background
                        layout="prev, pager, next"
                        :page-count="totalPage"
                        :currentPage = "stockPage"
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
    import {getStockFinances, getStockFinanceDetails} from "../../api/trade";
    import {errorMsg} from "../../plugins/methods";

    export default {
    name: "flow",
    data() {
        return {
            stocks: [],
            status:[1, 2, 3],
            totalPage: 1,
            currentPage: 1,
            page: 1,
            pageSize: 500,
            stockKey: "",
            stocksData: [],
            stockId: ""
        }
    },
    methods: {
        getStocks(){
            let _this = this
            getStockFinances(_this.page,_this.pageSize,{status: _this.status}).then(function (data) {
                if(data.status){
                    _this.stocks = data.data.data
                }else{
                    errorMsg(data.msg)
                }
            }).catch(function (data) {
                errorMsg("未知错误发生！请稍后再试")
            })
        },
        getData(){
            let _this = this
            getStockFinanceDetails({id: _this.stockId}, _this.currentPage).then(function (data) {
                if(data.status){
                    _this.totalPage = data.data.last_page
                    _this.stocksData = data.data.data
                }else{
                    errorMsg(data.msg)
                }
            }).catch(function (err) {
                errorMsg("未知错误发生！请稍后再试")
            })
        },
        changeStock(){
            let key = this.stockKey
            this.stockId = this.stocks[key].id
            this.stockName =  this.stocks[key].product_name +'--'+  this.stocks[key].id
            this.stockPage = 1
            this.getData()
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
        this.getStocks()
    },
}
</script>

<style scoped lang="less">
@import url(~assets/less/reset.less);
@import url(~assets/less/flow.less);
.search {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 25px;
    font-size: 14px;
    p {
        margin-right: 30px;
    }
    div {
        width: 280px;
    }
}
    .pagination{
        margin-top: 5px;
        text-align: right;
    }
</style>
