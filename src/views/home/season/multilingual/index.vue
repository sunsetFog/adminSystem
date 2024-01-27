<template>
    <section>
        <!--
            study: 国际多语言
            $tc , $t , $te , v-t
            1.$tc 用于复数，例如英文一般分单复数
            apple: 'no apples | one apple | {count} apples',

            2.$t用于非复数
            3.$te 返回的是boolean值，判断key是否存在。

            4.v-t 指令
            写法：字符串---双单引号包裹
            <p v-t="'hello'"></p >
            写法：数据绑定
            <p v-t="path"></p >
         -->
        ----{{$t("button.assignRole")}}-----{{$t("home.title")}}-----
        <br/><br/>
        <h3>插件多语言翻译:</h3>
        <pagination :pagingObj="queryData" :pageStep="[10,15]" @emitWay="sunQuery"></pagination>
        <br/><br/><br/><br/>
        切换翻译：<br/>
        <el-button @click="translate('zh')">中文翻译</el-button>
        <br/><br/><br/><br/>

        <el-button @click="translate('en')">英文翻译</el-button>
    </section>
</template>

<script>
import pagination from '@sky/rafaelDesign/web/components/pagination.vue';
export default {
    name: 'multilingual',
    components: { pagination },
    data(){
        return {
            queryData: {
                pageNum: 1,
                pageSize: 15,
                total: 0
            }
        }
    },
    beforeCreate() {
        const lang = this.$i18n.locale;
        console.log("lang==", lang);
        const locals = require(`./locals/${this.$options.name}_${lang}`).default;
        this.$i18n.mergeLocaleMessage(lang, locals);// 动态添加语言
    },
    methods: {
        sunQuery(){

        },
        translate(value) {
            if (value == "zh") {
                this.$i18n.locale = 'en';// 更换语言，无需刷新
                sessionStorage.setItem("language", "zh");
            } else if (value == "en") {
                this.$i18n.locale = 'zh';
                sessionStorage.setItem("language", "en");
            }
        }
    }
}
</script>

<style lang="less" scoped>

</style>
