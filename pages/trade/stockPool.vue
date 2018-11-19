<template>
    <div>
        <div class="main">
            <div class="search">
                <input type="text" placeholder="请输入股票代码或名称" v-model="stock_code" @keyup="searchStocks">
                <img src="~/static/images/img_find.png" class="find">
                <button class="add" @click="add">添加</button>
                <ul v-if="changeStock" class="change">
                    <li v-for="(value, key) in stockData" :key="key" @click="select(value)">
                        <span>{{value.stock_name}}</span>
                        <span>{{value.stock_code}}</span>
                    </li>
                </ul>
            </div>
            <div class="table">
                <table>
                    <thead>
                        <tr>
                            <th>股票/代码</th>
                            <th>现价</th>
                            <th>涨跌幅</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(value, key) in optionStockData" :key="key">
                            <td>{{value.stock_name}} {{value.stock_code}}</td>
                            <td :class="{green: value.price_limit < 0, red:value.price_limit >= 0}">{{stockValue[key]}}</td>
                            <td :class="{green: value.price_limit < 0, red:value.price_limit >= 0}">{{priceLimit[key]}}%</td>
                            <td>
                                <button @click="buy(value)">买入</button>
                                <button @click="del(value)" :disabled="isSubmitting">删自选</button>
                            </td>
                        </tr>
                        <tr v-if="!optionStockData.length" class="nothing"><td>暂无记录</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import {getStockPool, delStockFromPool, addStockToPool} from '~/api/personal';
import {getStocks, getStockFinances} from '~/api/trade';
import {errorMsg, successMsg} from '~/plugins/methods';

export default {
    name: "stockPool",
    data() {
        return {
            changeStock: false,
            stock_code: '',
            optionStockData: [],
            pageSize: 500,
            page: 1,
            stockValue: [],
            priceLimit: [],
            refreshData: null,
            stockData: [],
            isSubmitting: false
        }
    },
    methods: {
        // 模糊搜索股票
        searchStocks() {
            this.changeStock = true
            let _this = this
            let len = this.stock_code.length
            if (len <= 3) {
                this.changeStock = false
            } else {
                getStocks({stock_code: this.stock_code}).then((res) => {
                    if (res.status == 1) {
                        _this.stockData = res.data
                        console.log(res.data)

                    } else {
                        errorMsg(res.msg)
                    }
                })
            }
        },

        getData() {
            let _this = this
            getStockPool({pageSize: this.pageSize}, this.page).then((res) => {
                if (res.status == 1) {
                    const _list = res.data.data
                    console.log(_list)
                    _this.optionStockData = [..._this.optionStockData, ..._list]
                    for (let i = 0; i < _list.length; i++) {
                        _this.stockValue.push(_list[i].value)
                        _this.priceLimit.push((parseInt(_list[i].price_limit * 10000)) / 100)
                    }
                } else {
                    errorMsg(res.msg)
                }
            })
        },
        buy(value) {
            this.$router.push({name: 'trade-buy', query:{code: value.stock_code, id: this.id}})
        },
        del(value) {
            let _this = this
            this.isSubmitting = true
            delStockFromPool({id: value.id}).then((res) => {
                if (res.status == 1) {
                    successMsg('删除成功')
                    _this.optionStockData = []
                    _this.stockValue = []
                    _this.priceLimit = []
                    _this.getData()
                }
            }).then(res => {
                this.isSubmitting = false
            })
        },
        select(value) {
            this.stock_code = value.stock_name + ' ' +value.stock_code
            this.changeStock = false
        },
        add() {
            let _this = this
            let stock = this.stock_code.split(' ')
            let stock_code = this.stock_code.split(' ')[stock.length - 1]
            addStockToPool({stock_code: stock_code}).then((res) => {
                if (res.status == 1) {
                    successMsg('添加成功')
                    _this.optionStockData = []
                    _this.stockValue = []
                    _this.priceLimit = []
                    _this.getData()
                    _this.stock_code = ''
                } else {
                    errorMsg(res.msg)
                }
            })
        },
        polling() {
            let _this = this
            getStockPool({pageSize: this.pageSize}, this.page).then((res) => {
                if (res.status == 1) {
                    const _list = res.data.data
                    for (let i = 0; i < _list.length; i++) {
                        _this.stockValue.push(_list[i].value)
                        _this.priceLimit.push((parseInt(_list[i].price_limit * 10000)) / 100)
                    }
                } else {
                    errorMsg(res.msg)
                }
            })
        },
        initGetStockPool () {
            let _this = this
            this.refreshData = setInterval(() => {
                _this.stockValue = []
                _this.priceLimit = []
                _this.polling()
            }, 8000)
        }
    },
    mounted() {
        this.getData()
        this.initGetStockPool()
    },
    beforeDestroy() {
        clearInterval(this.refreshData)
    }
}
</script>

<style scoped lang="less">
@import url(~assets/less/tabel.less);
.main {
    padding: 50px;
    .search {
        position: relative;
        input {
            width: 260px;
            height: 40px;
            line-height: 40px;
            font-size: 14px;
            border-radius: 5px;
            border: none;
            border: 1px solid #eee;
            outline: none;
            text-indent: 45px;
        }
        .find {
            position: absolute;
            left: 15px;
            top: 50%;
            transform: translateY(-50%);
        }
        .add {
            width: 90px;
            height: 40px;
            line-height: 40px;
            color: #fff;
            font-size: 14px;
            outline: none;
            border-radius: 5px;
            margin-left: 30px;
            background-color: #DC2D39;
            border: none;
            cursor: pointer;
        }
        .change {
            position: absolute;
            width: 260px;
            border: 1px solid #eee;
            border-top: 0;
            border-radius: 5px;
            background-color: #fff;
            z-index: 99;
            li {
                display: flex;
                justify-content: space-around;
                align-items: center;
                line-height: 32px;
                cursor: pointer;
            }
        }
    }
    .table {
        margin-top: 40px;
    }
}
</style>
