<template>
    <div>
        <ul class="cf main" v-for="(value, key) in data" :key="key" @click="showDetails(value.id)">
            <li class="fl">{{value.title}}</li>
            <li class="fr">{{value.created_time.split(' ')[0]}}</li>
            <li class="fr">阅读{{value.click}}次</li>
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
        getArticles () {
            getIndexArticles().then((res) =>{
                if (res.status == 1) {
                    this.data = res.data[3]
                }
            })
        },
        showDetails (id) {
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
    li {
        font-size: 14px;
        color: #333;
        cursor: pointer;
    }
    li:nth-child(2), li:nth-child(3) {
        color: #999;
    }
    li:nth-child(3) {
        margin-right: 40px;
    }
}
</style>