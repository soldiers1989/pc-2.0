<template>
    <div>
        <div class="main">
            <p class="title">银行卡管理</p>
            <div class="main-body">
                <div v-if="cardData.length != 0" class="main-item1">
                    <ul class="line1" v-for="(value, key) in cardData" :key="key">
                        <li><img :src="`../../images/${value.bank_code}.png`"></li>
                        <li>{{value.bank_name}}</li>
                        <li>{{value.bank_card}}</li>
                        <li @click="modifyCard(value)">修改</li>
                        <li @click="show=true; id=value.id">删除</li>
                    </ul>
                    <div class="line2" align="center">
                        <button @click="routerTo('/personalCenter/bindCard')">添加银行卡</button>
                    </div>
                </div>
                <div v-if="cardData.length == 0" class="main-item2">
                    <p>您当前还未绑定银行卡</p>
                    <div class="line4" align="center">
                        <button class="submit" @click="routerTo('/personalCenter/bindCard')">添加银行卡</button>
                    </div>
                </div>
            </div>
        </div>

        <el-dialog
            title="提示"
            :visible.sync="show"
            width="30%"
            :before-close="handleClose">
            <p>确定要删除银行卡吗？</p>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancel()">取消</el-button>
                <el-button type="primary" @click="deleteCard(id)">确定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex';
import {getItem, msgLoadingOpen, msgLoadingClose, checkRealName} from '@/plugins/methods';
import {bus} from '@/plugins/bus';
import bankCardOptions from '@/plugins/global';
import {getUserInfo} from '@/api/ajax';
import {deleteBankCard} from '@/api/personal';
import {successMsg, errorMsg} from "../../plugins/methods";
export default {
    name: "cardCenter",
    data() {
        return {
            cardData: [],
            show: false,
            id: ''
        }
    },
    methods: {
        ...mapMutations(['routerTo']),
        getBankList() {
            let _this = this
            let userInfo = getItem('userInfo')
            this.cardData = userInfo.bankCards
            for (let i = 0; i < this.cardData.length; i++) {
                bankCardOptions.forEach(function (obj) {
                    if (obj.bankName.indexOf(_this.cardData[i].bank_name) > -1) {
                        _this.cardData[i].bank_code = obj.bankCode
                    }
                })
            }
        },
        getData() {
            let _this = this
            getUserInfo().then((res) => {
                _this.getBankList()
            })
        },
        handleClose(done) {
            done()
        },
        cancel(){
            this.show = false
        },
        deleteCard(id){
            let _this = this
            deleteBankCard({id: id}).then((res) => {
                if (res.status == 1) {
                    _this.show = false
                    _this.getData()
                    successMsg("解绑成功")
                } 
            })
            .catch((err) => {
                errorMsg('请求超时，请稍后再试')
            })
        },
        modifyCard(value) {
            this.$router.push({name: 'personalCenter-changeCard', params: {id: value.id, code: value.bank_code, name:　value.bank_name}})
        },
    },
    mounted() {
        this.getData()
        this.getBankList()
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
        .main-item1 {
            width: 533px;
            margin-left: 15px;
            margin-top: 30px;
            .line1 {
                display: flex;
                justify-content: space-between;
                align-items: center;
                text-align: center;
                margin-bottom: 10px;
                li {
                    color: #333;
                }
                li:nth-child(1) {
                    width: 30px;
                    height: 30px;
                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
                li:nth-child(2) {
                    flex: 1;
                    text-align: left;
                    margin-left: 20px;
                }
                li:nth-child(3) {
                    flex: 1.5;
                }
                li:nth-child(4) {
                    flex: 1;
                    cursor: pointer !important;
                }
                li:nth-child(5) {
                    flex: 1;
                    cursor: pointer !important;
                }
            }
            .line2 {
                padding-bottom: 40px;
                button {
                    width: 270px;
                    height: 40px;
                    line-height: 40px;
                    background: rgba(235,47,48,1);
                    border-radius: 5px;
                    box-shadow: 5px 0px 8px rgba(235,47,48,0.3);
                    color: #fff;
                    border: none;
                    outline: none;
                    cursor: pointer;
                    margin-top: 44px;
                    
                }
            }
        }
        .main-item2 {
            width: 500px;
            padding-bottom: 200px;
            p {
                color: #333;
                text-align: center;
                padding: 40px 0 30px 0;
            }
            .line4 {
                button {
                    width: 270px;
                    height: 46px;
                    line-height: 46px;
                    background: rgba(235,47,48,1);
                    border-radius: 5px;
                    box-shadow: 5px 0px 8px rgba(235,47,48,0.3);
                    color: #fff;
                    border: none;
                    outline: none;
                    cursor: pointer;
                }
            }
        }
    }
}
</style>
