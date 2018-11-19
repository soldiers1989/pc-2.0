<template>
    <div>
        <ul class="cf main" v-for="(value, key) in data" :key="key" @click="showDetails(value.id)">
            <li>
                <img :src="value.cover_pic" onerror="onerror=null;src='../../images/news.png'">
            </li>
            <li>
                <p class="fl">{{value.title}}</p>
                <p class="fl">{{value.concept}}</p>
                <p class="fl">
                    <span>
                        {{value.created_time.split(' ')[0]}}
                    </span>
                <span>阅读{{value.click}}次</span>
                <p/>
            </li>

        </ul>
    </div>
</template>

<script>
    import {getIndexArticles} from '~/api/common.js';

    export default {
        data() {
            return {
                data: []
            }
        },
        methods: {
            getArticles() {
                getIndexArticles().then((res) => {
                    if (res.status == 1) {
                        this.data = res.data[2]
                        this.data.map((item, index) => {
                          item.concept = item.summary
                        })
                    }
                })
            },
            showDetails(id) {
                this.$router.push('/news/' + id)
            }
        },
        mounted() {
            this.getArticles()
        },
    }
</script>

<style scoped lang="less">
    .main {
        padding-bottom: 15px;
        border-bottom: 1px solid #eee;
        margin: 15px;
        display: flex;
        justify-content: flex-start;
        li {
            font-size: 14px;
            color: #333;
            cursor: pointer;
        }
        li:nth-child(1) {
            width:160px;
            height:100px;
            img {
                width: 100%;
                height: 100%;
            }
        }
        li:nth-child(2) {
            width: 500px;
            padding-left: 20px;
        }
        p:nth-child(1) {
            color: #333333;
            font-size: 18px;
            font-weight: 600;
            line-height: 25px;
        }
        p:nth-child(2){
            color: #999;
            font-size: 14px;
            width: 100%;
            height: 40px;
            line-height: 20px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            margin-top: 5px;
        }
        p:nth-child(3) {
            color: #999;
            span:nth-child(2) {
                margin-left: 30px;
            }
           margin-top: 10px;
        }
    }
</style>
