<template>
    <div class="auth_page">
        <p>实名认证</p>
        <div class="auth_content" v-if="!isAuth">
            <div>
                <label for="username">姓名</label>
                <input type="text" required v-model="formData.username" id="username" placeholder="请输入姓名">
            </div>
            <div>
                <label for="idCard">身份证号码</label>
                <input type="text" required v-model="formData.id" id="idCard" placeholder="请输入身份证号码">
            </div>
            <!-- <div>
                <label for="repeatID">重复身份证号码</label>
                <input type="text" required v-model="repeatID" id="repeatID" placeholder="请再次输入身份证号码">
            </div> -->

            <div class="submit_button">
                <button @click="valid">提交</button>
            </div>

            <div class="auth_mention">
                <p>提交后不可修改，请正确填写</p>
                <p>填写错误将影响您的充值与提现</p>
            </div>
        </div>


        <div class="auth_content-isAuth" v-else>
            <p>您已实名认证通过！</p>
            <ul>
                <li>
                    <span>姓名</span>
                    <span>{{user.real_name}}</span>
                </li>
                <li>
                    <span>身份证号码</span>
                    <span>{{user.id_card}}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import {errorMsg, checkRealName, isCardID, getItem, successMsg} from "@/plugins/methods";
    import {createCertification} from "@/api/personal";
    import {getUserInfo} from "@/api/ajax";

    export default {
        name: "authentication",
        data() {
            return {
                // true 已认证，false未认证
                isAuth: false,
                formData: {
                    username: "",
                    id: ''
                },
                user: {
                    real_name: '',
                    id_card: ''
                },
                repeatID: ""
            }
        },
        methods: {
            update() {
                let userInfo = getItem("userInfo")
                if (userInfo) {
                    this.user.real_name = userInfo.real_name
                    this.user.id_card = userInfo.id_card
                }
            },
            valid() {
                let realName = /^[\u4e00-\u9fa5]+(·[\u4e00-\u9fa5]+)*$/
                let regName = realName.test(this.formData.username)
                let regId = isCardID(this.formData.id)
                if (this.formData.username == '') {
                    errorMsg('请输入姓名')
                } else if (!regName) {
                    errorMsg('姓名输入不正确')
                } else if (this.formData.id == '') {
                    errorMsg('请输入身份证号码')
                } else if (!regId) {

                } else {
                    this.submit()
                }
            },
            submit() {
                let _this = this
                createCertification({real_name: this.formData.username, id_card: this.formData.id}).then((res) => {
                    if (res.status == 1) {
                        getUserInfo().then((res) => {
                            successMsg('实名认证成功')
                            _this.$router.push('/personalCenter/account')
                        })
                    } else {
                        errorMsg('认证失败，请重试')
                    }
                })
            }
        },
        mounted() {
            this.isAuth = checkRealName()
            this.update()
            if (this.isAuth) {
                let reg = /(.*)(.)$/
                this.user.real_name = this.user.real_name.replace(reg, (a, b, c) => {
                    return b.replace(/./g, "*") + c
                })
                this.user.id_card = this.user.id_card.replace(/(.{1}).*(.{1})/,"$1****************$2")
            }
        }
    }
</script>

<style scoped lang="less">
    @import url(~assets/less/mine.less);
</style>
