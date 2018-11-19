<template>
    <div v-cloak>
        <Header />
        <div class="wrap-component">
            <nuxt />
        </div>
        <Footer />
        <div class="page-component-up" id="backTop"><i class="el-icon-caret-top"></i></div>
    </div>
</template>

<script>
import Header from '~/components/Header.vue';
import Footer from '~/components/Footer.vue';
import {bus} from '~/plugins/bus.js';
import {setItem} from "~/plugins/methods";
import {getIndexData} from '~/api/common.js';
export default {
    scrollToTop: true,
    components: {
        Header, Footer
    },
    methods: {
        init() {
            getIndexData().then((res) => {
                if (res.status == 1) {
                    setItem('indexData', res.data)
                    bus.$emit('updateIndexData')
                    bus.$emit('updateUserInfo')
                    let seo_title = res.data.seo_title
                    document.title = res.data.platform_name
                }
            })
        }
    },
    mounted() {
        this.init()
        window.onload = function () {
            var btn = document.getElementById("backTop");
            // 获取页面可视区的高度
            var clientHeight = document.documentElement.clientHeight;
            var timer = null;
            var isTop = true;
            // 滚动条滚动时触发事件
            window.onscroll = function () {
                var stop = document.documentElement.scrollTop || document.body.scrollTop;
                if (stop >= 200) {
                    btn.style.display = 'block';
                } else {
                    btn.style.display = 'none';
                }
                if (!isTop) {
                    clearInterval(timer);
                }
                    isTop = false;
            }
            btn.onclick = function () {
                clearInterval(timer);
                timer = setInterval(function () {
                    var stop = document.documentElement.scrollTop || document.body.scrollTop;
                    // 创建滚动条的速度
                    var speed = Math.floor(stop / 5) + 1;
                    document.documentElement.scrollTop = document.body.scrollTop = stop - speed;
                    isTop = true;
                    if (stop == 0) {
                        clearInterval(timer);
                    }
                }, 30)
            }
        }
    }
}
</script>

<style>
[v-cloak] {
    color: transparent;
    -webkit-text-fill-color: transparent;
}
html, body {
    font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
    font-size: 16px;
    background-color: #F5F6F7;
}
.page-component-up {
    background-color: #fff;
    position: fixed;
    right: 100px;
    bottom: 150px;
    width: 40px;
    height: 40px;
    border-radius: 20px;
    cursor: pointer;
    box-shadow: 0 0 6px rgba(0,0,0,.12);
    z-index: 5;
    display: none;
}
.page-component-up i {
    color: #EB2F30;
    display: block;
    line-height: 40px;
    text-align: center;
    font-size: 18px;
}
.el-icon-caret-top:before {
    content: "\E60C";
}
</style>

