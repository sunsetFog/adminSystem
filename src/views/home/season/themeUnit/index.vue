<template>
    <section id="themeUnit">
        <!-- study: 皮肤切换 -->
        方式1<br/><br/>
        <el-button @click="changeTheme('white')">白色</el-button>
        <el-button @click="changeTheme('black')">黑色</el-button>
        <el-button @click="changeTheme('blue')">蓝色</el-button>
        <br/><br/>方式2<br/><br/>
        <el-button @click="changeTheme2('daylight')">白天主题</el-button>
        <el-button @click="changeTheme2('night')">黑夜主题</el-button>
        <el-button @click="changeTheme2('macaron')">马卡龙主题</el-button>
    </section>
</template>

<script>
export default {
    name: 'themeUnit',
    methods: {
        changeTheme(type) {
            console.log("-切换主题-0=", type);
            this.$means.changeTheme(type);
        },
        changeTheme2(type) {
            this.$means.changeTheme2(type);
        },
    }
}
</script>

<style lang="scss">
/*
bug: vue全局使用scss样式文件
main.js加载scss, 结果js文件加载scss导致变量用不了，建议放app.vue且lang="scss"。
那么问题来了，react是如何用全局scss的呢？在news\build\utils.js vue全局使用scss样式文件

*/

// @import '~@static/crm/themeUnit/themeSkin2/index.scss';
#themeUnit {
    width: 100%;
    height: 100%;
    background: #61A5FF;
    @include theme-night() {
        background: #2774FF;
    }
    @include theme-macaron() {
        background: #73d5ff;
    }
}
</style>
