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
                        <th>委托时间</th>
                        <th>股票/代码</th>
                        <th>方向</th>
                        <th>价格</th>
                        <th>数量</th>
                        <th>状态</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr class="tit" v-if="stockId != ''">合约{{stockName}}</tr>
                    <tr v-for="item in stocksData">
                        <td>{{item.entrust_date}} {{item.entrust_time}}</td>
                        <td>{{item.stock_name}} {{item.stock_code}}</td>
                        <td class="">
                            <span v-if="item.sell_buy==2" class="fontBlue">卖出</span>
                            <span v-if="item.sell_buy==1" class="fontRed">买入</span>
                        </td>
                        <td>{{item.makedeal_price}}</td>
                        <td>{{item.makedeal_quantity}}</td>
                        <td>
                            <span v-if="item.entrust_quantity == item.makedeal_quantity">全部成交</span>
                            <span v-if="item.entrust_quantity != item.makedeal_quantity">部分成交</span>
                        </td>
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
    import {getStockFinances, getMakedealsHistory} from "../../api/trade";
    import {errorMsg} from "../../plugins/methods";

    export default {
        name: "historyEntrust",
        data() {
            return{
                status: [1,2,3],
                page: 1,
                pageSize: 500,
                stocks: [],
                stockId: "",
                stocksData: [],
                stockPage: 1,
                totalPage: 1,
                stockKey: "",
                stockName: "",
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
                getMakedealsHistory(_this.stockPage, {id: _this.stockId}).then(function (data) {
                    if(data.status){
                        _this.stocksData = data.data.data
                        _this.totalPage = data.data.last_page
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
                this.stockPage = event
                this.getData()
            },
            handlePrev(){
                this.stockPage = this.stockPage --
                this.getData()
            },
            handleNext(){
                this.stockPage = this.stockPage ++
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
    @import url(~assets/less/cancel.less);
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
