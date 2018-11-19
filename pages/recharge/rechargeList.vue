<template>
    <div>
        <div class="main">
            <table>
                <thead>
                    <tr>
                        <th>充值时间</th>
                        <th>到账时间</th>
                        <th>充值金额</th>
                        <th>类型</th>
                        <th>状态</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in listData">
                        <td>{{item.created_time}}</td>
                        <td>{{item.arrival_time}}</td>
                        <td>{{item.amount_of_account}}</td>
                        <td v-if="item.transfer_type">{{item.type +"--"+item.transfer_type}}</td>
                        <td v-else>{{item.type}}</td>
                        <td>{{item.status}}</td>
                    </tr>
                    <tr v-if="!listData.length" class="nothing"><td>暂无记录</td></tr>
                </tbody>
            </table>
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
    import {getRechargeList} from "../../api/personal";

    export default {
        data: function() {
            return {
                totalPage: 1,
                currentPage: 1,
                listData: [],
            }
        },
        methods: {
            getListData(){
                let _this = this
                getRechargeList({}, _this.currentPage).then(function (data) {
                    if(data.data.data.length > 0){
                        _this.totalPage = data.data.last_page
                        _this.listData = data.data.data
                    }else{
                        _this.totalPage = 0
                        _this.listData = []
                    }
                }).catch(function (data) {
                    console.log(data)
                })
            },
            handleCurrentChange(event){
                this.currentPage = event
                this.getListData()
            },
            handlePrev(){
                this.currentPage = this.currentPage--
                this.getListData()
            },
            handleNext(){
                this.currentPage = this.currentPage++
                this.getListData()
            }
        },
        mounted(){
            this.getListData()
        }
}
</script>

<style scoped lang="less">
@import url(~assets/less/tabel.less);
.pagination{
    margin-top: 5px;
    text-align: right;
}
    td{
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
</style>
