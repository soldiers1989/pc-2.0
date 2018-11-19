<template>
    <div slot="select2">
        <div class="main">
            <table>
                <thead>
                    <tr>
                        <th>申请时间</th>
                        <th>审核/撤销时间</th>
                        <th>申请金额</th>
                        <th>手续费</th>
                        <th>状态</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in allData">
                        <td>{{item.created_time}}</td>
                        <td v-if="item.cash_status != 0">{{item.updated_time}}</td>
                        <td v-else>--------</td>
                        <td>{{item.cash_amount}}</td>
                        <td>{{item.fee}}</td>
                        <td>{{item.cash_status | formatStatus }}</td>
                        <td v-if="item.cash_status == 0"><a @click="checkBack(item.id)" class="checkBack">撤回</a></td>
                        <td v-else>---</td>
                    </tr>
                     <tr v-if="!allData.length" class="nothing"><td>暂无记录</td></tr>
                </tbody>
            </table>

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
    import {withdrawRecord, checkBackWithdraw} from "../../api/personal";
    import {successMsg, errorMsg} from "../../plugins/methods";
    import {bus} from "../../plugins/bus";

    export default {
        data: function() {
            return {
                allData: [],
                currentPage: 1,
                totalPage: 1,
            }
        },
        filters:{
            formatStatus: function (value) {
                switch (value){
                    case 0:
                        return "待审核";
                    case 1:
                        return "待打款";
                    case 2:
                        return "审核失败";
                    case 3:
                        return "已打款";
                    case 4:
                        return "撤销成功"
                }
            }
        },
        methods: {
            getRecordList(){
                let _this = this
                withdrawRecord(_this.currentPage).then(function (data) {
                    if(data.data.length > 0){
                        _this.allData = data.data
                        _this.totalPage = data.last_page
                    }else{
                        _this.allData = []
                        _this.totalPage = 0
                    }
                }).catch(function (data) {
                    console.log(data)
                })
            },
            handleCurrentChange(event){
                this.currentPage = event
                this.getRecordList()
            },
            handlePrev(){
                this.currentPage = this.currentPage--
                this.getRecordList()
            },
            handleNext(){
                this.currentPage = this.currentPage++
                this.getRecordList()
            },
            checkBack(id) {
                let _this = this
                checkBackWithdraw({'id': id}).then(function (data) {
                    if(data.status){
                        _this.getRecordList()
                        bus.$emit("updateData")
                        successMsg(data.msg)
                    }else {
                        errorMsg(data.msg)
                    }
                }).catch(function (data) {
                    console.log(data)
                })
            }
        },
        mounted() {
            this.getRecordList()
        }
}
</script>

<style scoped lang="less">
@import url(~assets/less/tabel.less);
    .pagination{
        margin-top: 5px;
        text-align: right;
    }
    .checkBack{
        color: #7e8c8d;
        cursor: pointer;
    }
    .checkBack:hover{
        color: #337ab7;
        cursor: pointer;
    }
</style>
