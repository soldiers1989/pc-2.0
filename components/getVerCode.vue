<template>
    <div class="sms_page">
        <button @click="getSms" :disabled="isSubmit || !getVerCode">
            <span v-show="getVerCode">获取短信验证码</span>
            <span v-show="!getVerCode" class="count">{{count}} s 后重新获取</span>
        </button>
    </div>
</template>

<script type="text/ecmascript-6">
    import {successMsg, errorMsg} from "~/plugins/methods";

    export default {
        data() {
            return {
                getVerCode: true,
                count: '',
                timer: null,
                callback: null,
                isSubmit: false
            }
        },
        props: {
            formData: Object,
            requestCallback: Function
        },
        methods: {
            getSms() {
                let _this = this
                this.isSubmit = true
                this.requestCallback(this.formData).then((res) => {
                    if (res.status == 1) {
                        _this.getCode()
                        successMsg("短信验证码获取成功")
                    } else {
                        errorMsg(res.msg)
                    }
                }).then(res => {
                    this.isSubmit = false
                })
            },
            getCode() {
                if (!this.timer) {
                    this.count = 60
                    this.getVerCode = false
                    this.timer = setInterval(() => {
                        if (this.count > 0 && this.count <= 60) {
                            this.count--
                        } else {
                            this.getVerCode = true
                            clearInterval(this.timer)
                            this.timer = null
                        }
                    }, 1000)
                }
            }
        },
        mounted() {
        }
    }
</script>

<style lang="less">
    .sms_page {

    }
    button {
        width:120px;
        height:36px;
        background:rgba(220,45,57,1);
        border-radius:5px;
        font-size: 14px;
        border: none;
        span {
            color: #ffffff;
        }
    }
</style>
