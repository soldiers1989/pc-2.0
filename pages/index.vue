<template>
    <div>
        <Swiper />
        <ScrollText />
        <Item />
        <Product />
        <News />
    </div>
</template>

<script>
import Swiper from '~/components/Swiper.vue';
import ScrollText from '~/components/ScrollText.vue';
import Item from '~/components/Item.vue';
import Product from '~/components/product.vue';
import News from '~/pages/news/index.vue';

export default {
    data() {	
        return {

        }
    },
    components: {
        Swiper,
        ScrollText,
        Item,
        Product,
        News
    },
    methods: {

    }
}
</script>

<style scoped>
</style>