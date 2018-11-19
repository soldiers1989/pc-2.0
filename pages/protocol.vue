<template>
    <no-ssr>
        <div class="protocol_page wrap">
            <div class="protocolPage" v-html="content"></div>
            <div>
                <v-sign></v-sign>
            </div>
        </div>
    </no-ssr>
</template>

<script>
    import {getContract} from "../api/trade";
    import vSign from '~/components/signature.vue'
    import {errorMsg} from "../plugins/methods";

    export default {
        name: "protocol",
        data () {
            return {
                content: ""
            }
        },
        components: {
            vSign
        },
        methods: {
            update: function () {
                let _this = this
                getContract({productId: _this.$route.query.productId, investMoney: _this.$route.query.investMoney})
                    .then(function (res) {
                        if (res.status == 1) {
                            _this.content = res.data.data
                        } else {
                            errorMsg("获取失败")
                        }
                    })
            }
        },
        activated () {
            this.update()
        },
        mounted () {
            this.update()
        },
    }
</script>

<style lang="less" >
.protocol_page{
    padding: 40px;
    border: 1px solid #eee;
    background-color: #fff;
    margin-top: 140px;
    line-height: 1.8;
    margin-bottom: 30px;
    text-align: left;
}

.protocolPage {
    h1 {
        font-size:24px;
        text-align: center;
        margin:20px auto;
        padding-bottom:20px;
        font-weight:400
    }
    h2 {
        font-size:18px;
        margin:10px 0;
        font-weight:400
    }
    ul {
        text-indent:2em
    }
    p  {
        padding-bottom:10px
    }
}
</style>
