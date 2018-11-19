<template>
    <div class="page">
        <div class="wrap scroll">
            <div class="notice"><img src="~/static/images/img_notice.png"></div>
            <no-ssr>
                <vue-seamless-scroll :data="newsList" :class-option="optionLeft" class="seamless">
                    <ul class="item">
                        <li v-for="(item, key) in newsList" v-text="item.cellphone + '操盘成功'" :key="key"></li>
                    </ul>
                </vue-seamless-scroll>
            </no-ssr>
        </div>
    </div>
</template>

<script>
import {lastRecord} from '~/api/personal';

export default {
    data() {	
        return {
            newsList: []
            }
    },
    computed: {
        optionLeft() {
            return {
                direction: 2,
                limitMoveNum: 2
            }
        }
    },       
    methods: {
        getData() {
            lastRecord().then((res) => {
                if (res.status == 1) {
                    this.newsList = res.data
                }
            })
        }
    },
    mounted() {
        this.getData()
    },
}
</script>

<style scoped lang="less">
@import url(~assets/less/reset.less);

.page {
    background-color: @fff;
    .scroll {
        height: 50px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .notice {
            width: 25px;
            height: 20px;
            margin-right: 30px;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .seamless {
            overflow: hidden;
            height: 20px;
            width: 1200px;
            ul.item {
                width: 1500px;
                li {
                    float: left;
                    margin-right: 35px;
                    font-size: 16px;
                }
            }
        }
    }
}
</style>