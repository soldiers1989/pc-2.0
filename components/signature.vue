<template>
    <div class="sign_page container">
        <div class="sign_title">电子签名确认</div>
        <vueSignature ref="signature" :sigOption="option" :h="'400px'" class="canvas_gx"></vueSignature>
        <div class="button_area">
            <button @click="clear" class="clear_button">清除</button>
            <button @click="disagree" class="disagree_button">不同意</button>
            <button @click="save" class="save_button" :disabled="isSubmitAgree">同意</button>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {optionSign, stockUploadSign} from '../api/personal'
    import {errorMsg, successMsg} from "../plugins/methods";

    export default {
        data() {
            return {
                option: {
                    penColor: "rgb(0, 0, 0)"
                },
                options: {},
                judgeEmpty: true,
                isSubmitAgree: false
            }
        },
        methods: {
            save() {
                let _this = this
                let png = _this.$refs.signature.save()
                let jpeg = _this.$refs.signature.save('image/jpeg')
                let svg = _this.$refs.signature.save('image/svg+xml')
                this.isEmpty()
                if (!_this.$refs.signature.sig._lastVelocity) {
                   errorMsg("请填写电子签名")
                } else {
                    this.isSubmitAgree = true
                    stockUploadSign({sign: png}).then(res => {
                        if (res.status == 1) {
                            this.options.sign = res.data.sign
                            this.$router.push({
                                name: this.options.type,
                                query: this.options
                            })
                        }
                    }).then(() => {
                        _this.isSubmitAgree = false
                    })
                }
            },
            isEmpty() {
                let _this = this
                this.judgeEmpty = _this.$refs.signature.isEmpty()
            },
            clear() {
                let _this = this
                _this.$refs.signature.clear()
            },
            disagree() {
                this.clear()
                this.options.sign = ""
                this.$router.push({name: this.options.type, query: this.options})
            }
        },
        mounted () {
            let _this = this
            this.options = this.$route.query
            this.options.sign = ""
        },
        beforeDestroy () {
            this.clear()
        }
    }
</script>

<style scoped>
    .sign_page {
        margin-top: 40px;
        text-align: center;
    }

    .canvas_gx {
        border: 1px solid #CCCCCC;
        border-radius: 20px;
        padding: 10px;
    }

    .sign_title {
        height: 30px;
        margin-top: -10px;
        line-height: 30px;
        font-size: 20px;
        font-weight: 400;
        color: #333333;
    }

    .button_area {
        height: 60px;
        padding: 10px;
    }

    .button_area button {
        height: 40px;
        width: 120px;
        border-radius: 5px;
        margin-right: 50px;
    }

    .save_button {
        color: #ffffff;
        background-color: #E60012;
        border: none;
    }

    .clear_button {
        color: #E60012;
        border: 1px solid #E60012;;
        background-color: #ffffff;
    }

    .disagree_button {
        color: #333333;
        border: 1px solid #333333;;
        background-color: #ffffff;
    }
</style>
