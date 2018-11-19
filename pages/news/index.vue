<template>
    <div>
        <div class="wrap main">
            <div class="item">
                <ul>
                    <li><span>最新资讯</span><span @click="more1">更多>></span></li>
                    <li class="del" v-for="(value, key) in newsLeftData" :key="key" @click="showDetails(value.id)">
                        <span>{{value.title}}</span>
                        <span>{{value.created_time.split(' ')[0]}}</span>
                    </li>
                </ul>
            </div>
            <div class="item item2">
                <ul>
                    <li><span>平台公告</span><span @click="more2">更多>></span></li>
                    <li class="del" v-for="(value, key) in newsRightData" :key="key" @click="showDetails(value.id)">
                        <span>{{value.title}}</span>
                        <span>{{value.created_time.split(' ')[0]}}</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import {getIndexArticles} from '~/api/common.js';

export default {
    data() {	
        return {
            newsLeftData: [],
            newsRightData: []
        }
    },
    methods: {
        getArticles () {
            getIndexArticles().then((res) =>{
                if (res.status == 1) {
                    this.newsLeftData = res.data[2]
                    this.newsRightData = res.data[3]
                }
            })
        },
        showDetails (id) {
            this.$router.push('/news/' + id)
        },
        more1() {
            this.$router.push({name: 'consult', query:{tabView: 'select1', iscur: 0}})
        },
        more2() {
            this.$router.push({name: 'consult', query:{tabView: 'select2', iscur: 1}})
        }
    },
    mounted() {
        this.getArticles()
    }
}
</script>

<style scoped lang="less">
@import url(~assets/less/reset.less);
.main {
    display: flex;
    justify-content: space-between;
    margin-top: 50px;
    margin-bottom: 60px;
    .item {
        background-color: @fff;
        width: 580px;
        height: 285px;
        padding: 27px 30px;
        padding-left: 0;
        ul {
            height: 246px;
            max-height: 246px;
            overflow: hidden;
            li {
                display: flex;
                justify-content: space-between;
            }
            li:nth-child(1) {
                margin-bottom: 23px;
                margin-left: 30px;
                span:nth-child(1) {
                    color: #DC2D39;
                    font-size: 18px;
                    font-weight: 400;
                    position: relative;
                    padding-left: 12px;
                    &:before {
                        content: '';
                        display: block;
                        width: 4px;
                        height: 18px;
                        background-color: #DC2D39;
                        border-radius: 2px;
                        position: absolute;
                        left: 0;
                        top: 50%;
                        transform: translateY(-50%);
                    }
                }
            }
            li:nth-child(1) {
                span:nth-child(2) {
                    color: @999;
                    cursor: pointer;
                    font-size: 14px;
                }
            }
            .del {
                line-height: 28px;
                position: relative;
                padding-left: 12px;
                margin-left: 30px;
                span:nth-child(1) {
                    font-size: 14px;
                    color: @333;
                    cursor: pointer;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    width: 400px;
                }
                span:nth-child(2) {
                    color: @999;
                    cursor: pointer;
                    font-size: 14px;
                }
                &:before {
                    content: '';
                    display: block;
                    width: 8px;
                    height: 8px;
                    border: 1px solid #DC2D39;
                    border-radius: 50%;
                    position: absolute;
                    left: -4px;
                    top: 50%;
                    transform: translateY(-50%);
                }
            }
        }
    }
    .item2 {
        ul {
            li:nth-child(1) {
                span:nth-child(1) {
                    color: #8498EC;
                    &:before {
                        background-color: #8498EC;
                    }
                }
            }
            li:nth-child(1) {
                span:nth-child(2) {
                    color: @999;
                    cursor: pointer;
                    font-size: 14px;
                }
            }
            .del {
                &:before {
                    border: 1px solid #8498EC;
                }
            }
        }
    }
}

</style>