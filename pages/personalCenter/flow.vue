<template>
    <div class="flow_page">
        <div class="flow_header">
            <ul>
                <li>
                    <button @click="changeType('全部')" :class="{selectButton: type=='全部'}">全部</button>
                </li>
                <li >
                    <button @click="changeType('充值提款')" :class="{selectButton: type=='充值提款'}">充值</button>
                </li>
                <li>
                    <button @click="changeType('提现明细')" :class="{selectButton: type=='提现明细'}">提现</button>
                </li>
                <li>
                    <button @click="changeType('借款明细')"  :class="{selectButton: type=='借款明细'}">操盘</button>
                </li>
                <li>
                    <button @click="changeType('利润提取')"  :class="{selectButton: type=='利润提取'}">提取利润</button>
                </li>
                <li >
                    <button @click="changeType('服务费明细')" :class="{selectButton: type=='服务费明细'}">管理费</button>
                </li>
                <li >
                    <button @click="changeType('推广收益')" :class="{selectButton: type=='推广收益'}">推广收益</button>
                </li>
                <li v-if="isCoupon">
                    <button @click="changeType('优惠券')" :class="{selectButton: type=='优惠券'}" >优惠券</button>
                </li>

            </ul>
        </div>

        <div class="flow_content" v-if="type != '提现明细' && type != '优惠券'">
            <div class="flow_content-header">
                <ul>
                    <li>时间</li>
                    <li>交易ID</li>
                    <li>类型</li>
                    <li>收入</li>
                    <li>支出</li>
                    <li>余额</li>
                    <li>合约ID</li>
                    <li>备注</li>
                </ul>
            </div>
            <ul class="flow_content-content" v-for="item in FundsDetails" :key="item.key">
                <li>{{item.created_time}}</li>
                <li>{{item.id}}</li>
                <li>{{item.flow_type}}</li>
                <li v-if="item.amount_of_account > 0" class="fontRed">{{item.amount_of_account}}</li>
                <li v-if="item.amount_of_account > 0">--</li>
                <li v-if="item.amount_of_account < 0">--</li>
                <li v-if="item.amount_of_account < 0" class="fontGreen">{{item.amount_of_account}}</li>
                <li>{{item.account_left}}</li>
                <li v-if="item.fundsId">
                    {{item.fundsId.substring(5)}}
                </li>
                <el-tooltip effect="dark" :content="item.otherMark" placement="top" v-if="item.fundsId && item.otherMark.length > 12">
                    <li>
                        {{item.otherMark}}
                    </li>
                </el-tooltip>
                <li v-else>
                    {{item.otherMark}}
                </li>
                <el-tooltip effect="dark" :content="item.remark" placement="top" v-if="!item.fundsId && item.remark.length > 12">
                    <li>
                        {{item.remark}}
                    </li>
                </el-tooltip>
                <li v-if="!item.fundsId && item.remark.length <= 12">{{item.remark}}</li>
            </ul>
            <ul v-if="FundsDetails.length == 0" align="center" class="none">
                <li>暂无记录</li>
            </ul>
        </div>
        <div class="flow_content" v-if="type == '提现明细'">
            <div class="flow_content-header flow_content-header-tq">
                <ul>
                    <li>时间</li>
                    <li>提现银行卡</li>
                    <li>支出</li>
                    <li>状态</li>
                    <li></li>
                </ul>
            </div>
            <ul class="flow_content-content flow_content-header-tq" v-for="item in FundsDetails" :key="item.key">
                <li>{{item.created_time}}</li>
                <li>{{item.bank_card}}</li>
                <li class="fontGreen">{{item.cash_amount}}</li>
                <li v-if="item.cash_status == 0">待审核</li>
                <li v-if="item.cash_status == 1">待打款</li>
                <li v-if="item.cash_status == 2">审核失败</li>
                <li v-if="item.cash_status == 3">已打款</li>
                <li v-if="item.cash_status == 4">撤销成功</li>
                <li></li>
            </ul>
            <ul v-if="FundsDetails.length == 0" align="center" class="none">
                <li>暂无记录</li>
            </ul>
        </div>

        <div class="flow_content" v-if="type == '优惠券'">
            <div class="flow_content-header flow_content-header2">
                <ul>
                    <li>时间</li>
                    <li>交易ID</li>
                    <li>类型</li>
                    <li>收入</li>
                    <li>支出</li>
                    <li>合约ID</li>
                    <li>备注</li>
                </ul>
            </div>
            <ul class="flow_content-content flow_content-header2" v-for="item in FundsDetails" :key="item.key">
                <li>{{item.created_time}}</li>
                <li>{{item.cust_account_flow_id}}</li>
                <li v-if="item.account_type == 1">优惠券返还</li>
                <li class="fontRed">{{item.account_money}}</li>
                <li>--</li>
                <li>{{item.stock_finance_id}}</li>
                <li>{{item.account_remark}}</li>
            </ul>
            <ul v-if="FundsDetails.length == 0" align="center" class="none">
                <li>暂无记录</li>
            </ul>
        </div>
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
</template>

<script>
    import {getFundsDetails} from "../../api/personal";
    import {couponFlows} from "../../api/personal";
    import {getItem} from "../../plugins/methods";
    import {fixed} from "../../plugins/methods";

    export default {
        name: "flow",
        data () {
            return {
                type: "全部",
                currentPage: 1,
                FundsDetails: [],
                totalPage: 1,
                isCoupon: false
            }
        },
        methods: {
            changeType (type) {
                let _this = this
                this.type = type
                this.currentPage = 1
                if (type == '优惠券') {
                    couponFlows({"type": type}, this.currentPage).then((res) => {
                        if (res.status == 1) {
                            _this.FundsDetails = res.data.data
                            _this.FundsDetails.forEach((obj) => {
                                obj.account_money = fixed(obj.account_money, 2)
                            })
                            _this.totalPage = res.data.last_page
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
                } else {
                    getFundsDetails({"type": type},this.currentPage).then(function (data) {
                        if(data.data.data){
                            _this.FundsDetails = data.data.data
                            _this.totalPage = data.data.last_page
                        }else{
                            _this.FundsDetails = data.data
                        }
                    }).catch(function (data) {
                        console.log(data)
                    })
                }

            },
            getIndexData() {
                let indexData = getItem("indexData")
                this.isCoupon = Number(indexData.isEnableCoupon)
            },
            pageChange(){
                let _this = this
                let type = this.type
                if (type == '优惠券') {
                    couponFlows({"type": type}, this.currentPage).then((res) => {
                        if (res.status == 1) {
                            _this.FundsDetails = res.data.data
                            _this.FundsDetails.forEach((obj) => {
                                obj.account_money = fixed(obj.account_money, 2)
                            })
                            _this.totalPage = res.data.last_page
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
                } else {
                    getFundsDetails({"type": type}, this.currentPage).then(function (data) {
                        if(data.data.data){
                            _this.FundsDetails = data.data.data
                            _this.totalPage = data.data.last_page
                        }else{
                            _this.FundsDetails = data.data
                        }
                    }).catch(function (data) {
                        console.log(data)
                    })
                }

            },
            handleCurrentChange(event){
                this.currentPage = event
                this.pageChange()
            },
            handlePrev(){
                this.currentPage = this.currentPage--
                this.pageChange()
            },
            handleNext(){
                this.currentPage = this.currentPage++
                this.pageChange()
            }
        },
        mounted() {
            this.changeType("全部");
            this.getIndexData()
        }
    }
</script>

<style scoped lang="less">
    @import url(~assets/less/mine.less);
    .flow_content-header-tq li{
        width: 20% !important;
    }

    .pagination{
        margin-top: 5px;
        text-align: right;
    }
    .none {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid #eee;
        li {
            height: 42px;
            line-height: 42px;
        }
    }
</style>
