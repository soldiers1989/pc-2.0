<template>
    <div>
        <div class="main">
            <div class="wrap body">
                <ul>
                    <li><img src="~/static/images/icon_one.png"></li>
                    <li>资金保障</li>
                    <li>资金第三方托管</li>
                </ul>
                <ul>
                    <li><img src="~/static/images/icon_two.png"></li>
                    <li>真实交易</li>
                    <li>100%实盘，level2可查委托</li>
                </ul>
                <ul>
                    <li><img src="~/static/images/icon_three.png"></li>
                    <li>快捷提现</li>
                    <li>闪电提现，快速到账</li>
                </ul>
                <ul>
                    <li><img src="~/static/images/icon_four.png"></li>
                    <li>专业服务</li>
                    <li>客户体验至上为宗旨</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {	
        return {}
    },
    methods: {}
}
</script>

<style scoped lang="less">
@import url(~assets/less/reset.less);
.main {
    background-color: @fff;
    border-top: 1px solid @borderColor;
    box-shadow: 0px 6px 12px rgba(0,0,0,0.1);
    .body {
        height: 219px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        text-align: center;
        ul {
            li:nth-child(1) {
                width: 80px;
                height: 80px;
                margin: auto;
                img {
                    width: 100%;
                    height: 100%;    
                }
            }
            li:nth-child(2) {
                font-size: @font_size_22;
                color: @333;
                line-height: 32px;
                margin-top: 16px;
            }
            li:nth-child(3) {
                color: @999;
                line-height: 32px;
            }
        }
    }
}
</style>