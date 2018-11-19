<template>
    <div>
        <div class="main wrap">
            <div class="row1">
                <ul>
                    <li>报名时间</li>
                    <li>每月1-15日</li>
                </ul>
                <ul>
                    <li>比赛时间</li>
                    <li>当月交易日</li>
                </ul>
                <ul>
                    <li>参赛方式</li>
                    <li>投入保证金2000元</li>
                    <li>平台提供20000元</li>
                    <li>总操盘资金22000元</li>
                </ul>
            </div>
            <p class="tit">大赛奖励</p>
            <ul class="row2">
                <li><img src="~/static/images/img_first.png"></li>
                <li><img src="~/static/images/img_second.png"></li>
                <li><img src="~/static/images/img_third.png"></li>
                <li><img src="~/static/images/img_fourth.png"></li>
            </ul>
        </div>
        <div class="main-rule">
            <div class="wrap row3">
                <ul>
                    <li>交易规则</li>
                    <li>1. 上午9:30至11：30，下午13:00至15:00，买卖委托，系统撮合成交。</li>
                    <li>2. 当日未成交委托将作撤单处理。</li>
                    <li>3. 不得购买S、ST、*ST、S*ST、SST、以及被交易所特别处理的股票。</li>
                    <li>4. 不得购买权证类可以 T+0 交易的证券。</li>
                    <li>5. 不得购买首日上市新股（或复牌首日股票）等当日不设涨跌停板限制的股票。</li>
                    <li>6. 新股打开连续涨停一个月后方可开放交易。</li>
                </ul>
                <ul>
                    <li>参赛细则</li>
                    <li>1. 参赛人员必须实名认证。</li>
                    <li>2. 报名成功即可交易，合约免息，不可追保，不可追配，盈亏自负。</li>
                    <li>3. 平仓线：当总操盘资金低于20600时，系统自动平仓，比赛自动出局，剩余保证金退还。</li>
                    <li>4. 到期日：当月最后一个交易日，不可买入，14：30若仍有持仓，系统自动平仓自动结算，核算当月收益率排行榜。参赛人员提前结算视为退赛。</li>
                    <li>5. 若遇停牌股，到期日仍未复牌，平台将以停牌价回收，本条仅适用于炒股大赛。</li>
                    <li>6. 奖励发放：工作人员联系获奖人员发放现金和证书。</li>
                    <li>本次活动最终解释权归{{platform_name}}所有</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import {getItem} from "../../plugins/methods";

    export default {
    data() {
        return {
            platform_name: ''
        }
    },
    methods: {
        getData () {
            this.platform_name = getItem('indexData').platform_name
        }
    },
    mounted () {
        this.getData()
    }
}
</script>

<style scoped lang="less">
.main {
    .row1 {
        height: 194px;
        border: 5px solid #2B386F;
        border-radius: 20px;
        background-color: #0F1943;
        margin-top: 60px;
        display: flex;
        justify-content: space-between;
        padding: 30px 302px 0 227px;
        ul {
            li {
                font-size: 18px;
                color: #fff;
                line-height: 28px;
            }
            li:first-child {
                font-size: 24px;
                color: #EE7421;
                padding-bottom: 20px;
            }
        }
        ul:last-child {
            li:first-child {
                text-align: center;
            }
        }
    }
    .tit {
        font-size: 32px;
        color: #EE7421;
        padding-top: 65px;
        padding-bottom: 50px;
        text-align: center;
    }
    .row2 {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 104px;
        li {
            img {
                width: 260px;
                height: 220px;
            }
        }

    }
}
.main-rule {
    background-color: #091733;
    height: 512px;
    .row3 {
        display: flex;
        justify-content: flex-start;
        padding-top: 53px;
        ul {
            li {
                color: #BCA072;
                line-height: 32px;
            }
            li:first-child {
                font-size: 24px;
                color: #EE7421;
                padding-bottom: 25px;
            }
        }
        ul:last-child {
            margin-left: 100px;
        }
    }
}
</style>
