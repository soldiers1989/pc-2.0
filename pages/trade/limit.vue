<template>
    <div>
        <div class="main">
            <p class="tip">平台不可交易基金、S、N、ST、*ST、S*ST及SST类股票</p>
            <ul class="content">
                <li v-for="(value, key) in limitData" :key=key>
                    <span>{{value.stock_name}}</span>
                    <span>{{value.stock_code}}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import {disabledStocks} from  '~/api/personal';

export default {
    name: 'limit',
    data() {	
        return {
            limitData: []
        }
    },
    methods: {
        getLimitData() {
            disabledStocks().then(res => {
                if (res.status == 1) {
                    this.limitData = res.data
                }
            })
        }
    },
    mounted() {
        this.getLimitData()
    }
}
</script>

<style scoped lang="less">
.main {
    padding: 50px;
    padding-right: 190px;
    .tip {
        color: #333;
        margin-bottom: 40px;
    }
    .content {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        text-align: center;
        li {
            width: 120px;
            height: 64px;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            border: 1px solid #DC2D39;
            border-radius: 5px;
            font-size: 14px;
            margin-right: 20px;
            margin-bottom: 20px;
            span {
                line-height: 24px;
            }
        }
        li:nth-child(5n) {
            margin-right: 0;
        }
    }
}
</style>