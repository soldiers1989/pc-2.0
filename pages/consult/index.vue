<template>
    <div class="wrap">
        <div class="person_title">
            <span>当前您所在的位置：</span>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item>资讯中心</el-breadcrumb-item>
                <el-breadcrumb-item v-if="this.iscur == 0">最新资讯</el-breadcrumb-item>
                <el-breadcrumb-item v-else>平台公告</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="main cf">
            <ul class="main-left fl">
                <li v-for="(tab, index) in tabs" :key=index  @click="iscur=index, tabChange('select' + (index + 1))" >
                    <a href="javascript:;" :class="{cur: iscur==index}">{{tab.name}}</a>
                </li>
            </ul>
            <div class="main-right fr">
                <component :is="tabView"></component>
            </div>
        </div>
    </div>
</template>

<script>
import select1 from './information.vue';
import select2 from './notice.vue';

export default {
    data: function() {	
        return {
            tabView: 'select1',
            tabs: [{name: "最新资讯"}, {name: "平台公告"}],
            iscur: 0,
            tabName: ''
        }
    },
    components: {
        select1,
        select2
    },
    methods: {
        tabChange(tab) {
            this.tabView = tab
        }
    },
    mounted() {
        this.tabView = this.$route.query.tabView
        this.iscur = this.$route.query.iscur
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
 .cur {
    background-color: #EB2F30 !important;
    color: #fff !important;
}
</style>