<template>
    <div class="footer_page">
        <div class="footer_content">
            <div class="footer_content-content">
                <dl>
                    <dt @click="routerTo('/trade/day')" class="dt-title">股票操盘</dt>
                    <dd><nuxt-link :to="{name: 'trade-day'}">按天操盘</nuxt-link></dd>
                    <dd><nuxt-link :to="{name: 'trade-week'}">按周操盘</nuxt-link></dd>
                    <dd><nuxt-link :to="{name: 'trade-month'}">按月操盘</nuxt-link></dd>
                    <dd v-if="freeFlag"><nuxt-link :to="{name: 'trade-free'}">免息T+1</nuxt-link></dd>
                </dl>
                <dl>
                    <dt @click="goToHelp(0)" class="dt-title">帮助中心</dt>
                    <dd @click="goToHelp(0)">常见问题</dd>
                    <dd @click="goToHelp(1)">新手指引</dd>
                </dl>
                <dl>
                    <dt @click="goToAbout(0)" class="dt-title">关于我们</dt>
                    <dd @click="goToAbout(0)">公司简介</dd>
                    <dd @click="goToAbout(1)">联系我们</dd>
                </dl>
                <div>
                    <span>关注微信公众号</span>
                    <div><img :src="cust_qr" alt="这是一张二维码"></div>
                </div>
                <dl>
                    <dt>风险提示</dt>
                    <dd class="default">保护投资者利益是中国证监会工作的重中之重。
                        我们提醒您： 股市有风险，投资需谨慎！
                        市场风险莫测，务请谨慎行事！</dd>
                </dl>
                <dl>
                    <dt>客服热线</dt>
                    <dd class="default">{{phone}}</dd>
                    <dd class="default">周一至周五{{service_time}}</dd>
                    <dd class="complaint" v-if="complaintCall != ''">投诉建议</dd>
                    <dd class="complaint" v-if="complaintCall != ''">{{complaintCall}}</dd>
                </dl>
            </div>
            <hr style="border: 1px solid #404040">
            <div class="footer_link">
                <ul>
                    <li>友情链接：</li>
                    <li><a href="http://www.sse.com.cn/" target="_blank">上海证券交易所</a></li>
                    <li><a href="http://www.eastmoney.com/" target="_blank">东方财富网</a></li>
                    <li><a href="http://www.ebscn.com/" target="_blank">光大证券</a></li>
                    <li><a href="http://www.unspay.com/unspay/personalMain.do" target="_blank">银生宝</a></li>
                </ul>
            </div>
        </div>
        <div class="footer_copyright">
            {{copyright}}
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex'
    import {successMsg, errorMsg, getItem, validLogin} from '~/plugins/methods';
    import {fetchToken} from "../api/ajax";
    import {bus} from '~/plugins/bus.js';

    export default {
        data () {
            return {
                cust_qr: '',
                copyright: '',
                phone: '',
                service_time: '',
                complaintCall: '',
                freeFlag: false
            }
        },
        methods: {
            ...mapMutations(['routerTo']),
            getIndexData() {
                let indexData = getItem("indexData")
                if (indexData) {
                    this.cust_qr = indexData.public_qr
                    this.copyright = indexData.copyright
                    this.phone = indexData.service_phone
                    this.service_time = indexData.service_time
                    this.complaintCall = indexData.complaintCall
                    this.freeFlag = indexData.product_type.toString().indexOf('5') > -1
                }
            },
            goToHelp(key) {
                if (key == 1) {
                    this.$router.push({name: 'help', query: {code: 2}})
                } 
                else {
                    this.$router.push({name: 'help'})
                }
                bus.$emit('selectedArticle', key)
            },
            goToAbout(key) {
                if (key == 1) {
                    this.$router.push({name: 'about', query: {code: 2}})
                } 
                else {
                    this.$router.push({name: 'about'})
                }
                bus.$emit('choiceArticle', key)
            }
        },
        mounted() {
            this.getIndexData()
            bus.$on('updateIndexData', () => {
                this.getIndexData()
            })
        }
    }
</script>

<style lang="less" scoped>
    @import url(~assets/less/footer.less);
</style>


