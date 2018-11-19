<template>
    <div>
        <div class="main">
            <ul class="row1">
                <li>充值说明：</li>
                <li>1.网上银行、银行柜台或ATM机转账，请使用实名认证对应姓名的银行卡进行转账、汇款</li>
                <li>2.提交凭证，网上银行填写支付平台名称和交易号，其它填写转账银行及卡号</li>
                <li>3.账户核实并入账，周五18:00至周一9:00的转账，将在周一9:30前完成入金</li>
            </ul>
            <ul class="row2">
                <li>银行帐号：{{transformAccount.recharge_bank_account}}</li>
                <li>账户名称：{{transformAccount.recharge_real_name}}</li>
                <li>开户银行：{{transformAccount.recharge_bank_name}}</li>
            </ul>
            <div class="row3">
                <p>转账方式</p>
                <div class="row3-select">
                    <el-select v-model="transferData.transfer_type" clearable placeholder="请选择">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="row3">
                <p>转账金额</p>
                <div class="row3-select row3-input">
                    <input type="text" placeholder="请输入转账金额" v-model="transferData.amount_of_account" @keyup="limitLen">
                </div>
                <p class="row3-p">元</p>
                <p class="row3-tip">仅供校对，以实际到账金额为准</p>
            </div>
            <div class="row3">
                <p>转账说明</p>
                <div class="row3-select row3-input row3-input2">
                    <input type="text" v-model="transferData.cust_remark">
                </div>
            </div>
            <div class="row3">
                <p>上传凭证</p>
                <div class="row3-select row3-input row3-upload">
                    <el-upload
                            class="avatar-uploader"
                            :http-request="uploadFile"
                            :show-file-list="false"
                            action=""
                            :before-upload="beforeAvatarUpload">
                        <img v-if="transferData.cust_pic_remark" :src="transferData.cust_pic_remark" class="avatar">
                        <i v-else class="avatar-uploader-icon">
                            <img src="~static/images/add.png">
                        </i>
                    </el-upload>
                </div>
            </div>
            <div class="row3">
                <button class="submit" @click="submitTransfer">提交</button>
            </div>
        </div>

        <!--转账支付提示-->
        <el-dialog
        title="提交成功"
        :visible.sync="transformMention"
        width="25%" :close-on-click-modal='false'>
            <p class="transformMention_text">温馨提示：</p>
            <p class="transformMention_text">请仔细阅读到账时间说明</p>
            <p class="transformMention_text">为了快速处理，请勿重复提交！！</p>
            <span slot="footer" class="dialog-footer">
                <el-button @click="transformMention = false">取 消</el-button>
                <el-button type="primary" @click="transformMention = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {offlineTransfer, uploadImage} from '~/api/personal.js';
import {successMsg, errorMsg, validLogin, compress, getItem, checkRealName} from "~/plugins/methods.js";
import {mapState, mapMutations} from 'vuex';

export default {
    data() {	
        return {
            transformAccount: {
                recharge_bank_account: '',
                recharge_real_name: '',
                recharge_bank_name: ''
            },
            platform_name: '',
            transferData: {},
            transformMention: false,
            options: [
                {
                    value: 0,
                    label: 'ATM'
                },
                {
                    value: 1,
                    label: '柜台转账'
                }, 
                {
                    value: 2,
                    label: '网上银行'
                }, 
                {
                    value: 3,
                    label: '手机银行'
                }, 
                {
                    value: 4,
                    label: '支付宝'
                },
                {
                    value: 7,
                    label: '其他'
                }
            ],
        }
    },
    methods: {
        limitLen() {
            if (this.transferData.amount_of_account.length > 7) {
                this.transferData.amount_of_account = this.transferData.amount_of_account.substr(0, 7)
                errorMsg("充值金额不能超过7位")
            }
        },
        beforeAvatarUpload(file) {
            const isLt2M = file.size / 1024 / 1024 < 10
            if (!isLt2M) {
                errorMsg('上传图片大小不能超过 10MB!')
            }
            return isLt2M
        },
        uploadFile(file) {
            let _this = this
            compress(file.file, 0.1, function (e, data) {
                if (e) {
                    errorMsg(e)
                }
                uploadImage({file: data}).then((res) => {
                    if (res.status == 1) {
                        _this.transferData.cust_pic_remark = res.data.path
                    } else {
                        errorMsg(res.msg)
                    }
                })
            })
        },
        submitTransfer() {
            let _this = this
            let mount = Number(this.transferData.amount_of_account)
            if (!checkRealName()) {
                this.$confirm('您还未实名认证，请先实名认证再绑卡', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$router.push({name: 'personalCenter-authentication'})
                }).catch(() => {
                });
            } else if (mount === '' || mount < 100) {
                errorMsg('充值金额不得小于100元')
            } else if (this.transferData.cust_remark === '') {
                errorMsg('备注不能为空')
            } else {
                offlineTransfer(this.transferData).then(function (res) {
                    if (res.status == 1) {
                        _this.initTransferForm()
                        _this.transformMention = true
                    } else {
                        errorMsg(res.msg)
                    }
                })
            }
        },
        updateIndexData() {
            let indexData = getItem("indexData")
            if (indexData) {
                this.platform_name = indexData.platform_name
                this.transformAccount.recharge_bank_account = indexData.recharge_bank_account
                this.transformAccount.recharge_bank_name = indexData.recharge_bank_name
                this.transformAccount.recharge_real_name = indexData.recharge_real_name
            }
        },
        initTransferForm() {
            this.transferData = {
                amount_of_account: "",
                transfer_type: '',
                cust_pic_remark: '',
                cust_remark: '本人确认该笔款项用于股票操盘之用'
            }
        },
    },
    mounted() {
        this.initTransferForm()
        this.updateIndexData()
    }
}
</script>

<style scoped lang="less">
.main {
    margin-top: 18px;
    .row1 {
        margin-bottom: 20px;
        li {
            color: #449DE8;
            font-size: 14px;
            line-height: 26px;
        }
    }
    .row2 {
        width: 100%;
        height: 120px;
        padding: 20px;
        line-height: 26px;
        font-size: 14px;
        color: #333;
        background-color: #FFFADB;
        margin-bottom: 20px;
    }
    .row3 {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 14px;
        p {
            font-size: 14px;
            color: #333;
            padding-right: 40px;
        }
        .row3-select {
            width: 200px;
            input {
                width: 100%;
                height: 40px;
                border: none;
                outline: none;
                border-radius: 4px;
                text-indent: 15px;
                font-size: 14px;
            }
        }
        .row3-input {
            border: 1px solid #ccc;
            border-radius: 4px;
            
        }
        .row3-input2 {
            width: 350px;
        }
        .row3-upload {
            border: none;
            border-radius: none;
        }
        .row3-p {
            padding: 0;
            padding-left: 10px;
        }
        .row3-tip {
            color: #DC2D39;
            padding: 0;
            padding-left: 30px;
        }
        .submit {
            width: 200px;
            height: 40px;
            line-height: 40px;
            border: none;
            outline: none;
            cursor: pointer;
            border-radius: 5px;
            color: #fff;
            background-color: #DC2D39;
            margin-left: 96px;
            margin-top: 50px;
        }
    }
}

input::-webkit-input-placeholder {
    color: #C0C4CC;
}

.avatar {
    width: 90px;
    height: 90px;
    display: block;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 90px;
    height: 90px;
    line-height: 90px;
    text-align: center;
    display: block;
}
</style>