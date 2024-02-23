<template>
    <section id="themeUnit">
        <!-- study: 皮肤切换 -->
        <div>
            <el-button @click="changeTheme('light')">白天主题</el-button>
            <el-button @click="changeTheme('night')">黑夜主题</el-button>
            <el-button @click="changeTheme('macaron')">马卡龙主题</el-button>
        </div>
        <LineTextLine>切换皮肤后，js变量实现重新渲染{{ themeValue }}</LineTextLine>
        <img v-if="themeValue == 'light'" src="@sky/rafaelDesign/static/image1/invoice.png"/>
        <img v-if="themeValue == 'night'" src="@sky/rafaelDesign/static/image1/AR.png"/>
        <img v-if="themeValue == 'macaron'" src="@sky/rafaelDesign/static/image1/apply@2x.png"/>
        <LineTextLine>var变量切换</LineTextLine>
        <main class="scenery">

        </main>
        <LineTextLine>切换皮肤，css改变</LineTextLine>
        <main class="fabulous">

        </main>
    </section>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex';
export default {
    name: 'themeUnit',
    computed: { // 使用vuex
        ...mapGetters(['themeValue'])
    },
    methods: {
        changeTheme(type) {
            console.log("-切换主题-0=", type);
            this.$means.changeTheme(type);
        },
        changeTheme(type) {
            this.$means.changeTheme(type);
        },
    }
}
</script>

<style lang="scss">
#themeUnit {
    width: 100%;
    height: 100%;

    div {
        padding-bottom: 10px;
    }

    .scenery {
        width: 100%;
        height: 100px;
        background: var(--background);
    }

    .fabulous {
        width: 100%;
        height: 100px;

        @include theme-light() {
            background: #ff4d4f;
        }

        @include theme-night() {
            background: #2774FF;
        }

        @include theme-macaron() {
            background: #73d5ff;
        }
    }
}</style>
