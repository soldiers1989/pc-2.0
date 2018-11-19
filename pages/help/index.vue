<template>
    <div class="wrap">
        <div class="person_title">
            <span>当前您所在的位置：</span>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item>{{this.showName}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="main cf">
            <ul class="main-left fl">
                <li v-for="(item, k) in articleList" :key=k  @click="setHelpArticle(k)">
                    <a href="javascript:;" :class="{hoverSelected: showFlag==k}">{{item.name}}</a>
                </li>
            </ul>
            <div class="main-right fr">
                <div class="main-content" v-html="content"></div>
            </div>
        </div>
    </div>
</template>

<script>
import {errorMsg, getItem} from "~/plugins/methods.js";
import {getHelpArticles} from '~/api/personal.js';
import {bus} from '~/plugins/bus.js';

export default {
    data: function() {	
        return {
            showFlag: 1,
            articleList: [],
            content: "",
            tab: '',
            showName: '',
            code: ''
        }
    },
    methods: {
        update() {
            this.getHelpArticles()
        },
        getHelpArticles() {
            getHelpArticles({type: '帮助中心'}).then((res) => {
                if (res.status == 1) {
                    this.articleList = res.data
                    if (res.data.length > 0) {
                        if (this.$route.query.code === 2) {
                            this.setHelpArticle(1)
                        } else {
                            this.setHelpArticle(0)
                        }
                    }
                }
            })
        },
        setHelpArticle(index) {
            this.showFlag = index
            this.content = this.articleList[index].content
            this.showName = this.articleList[index].name
        },
    },
    mounted() {
        this.update()
        bus.$on('selectedArticle', (index) => {
            this.setHelpArticle(index)
        })
    }
}
</script>

<style lang="less" scoped>
@import url(~assets/less/reset.less);
@import url(~assets/less/mine.less);
.main {
    margin-top: 30px;
    margin-bottom: 150px;
    .main-left {
        background-color: #fff;
        width: 240px;
        li {
            line-height: 50px;
            a {
                width: 100%;
                height: 100%;
                display: block;
                text-decoration: none;
                text-align: center;
                line-height: 50px;
                color: #333;
            }
        }
    }
    .main-right {
        background-color: #fff;
        width: 920px;
        padding: 35px;
    }
}

 .hoverSelected {
    background-color: #EB2F30 !important;
    color: #fff !important;
}
</style>