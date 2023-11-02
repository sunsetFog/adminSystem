<template>
    <section id="themeUnit">
        <!-- study: 皮肤切换 -->
        <div>
            <el-button @click="changeTheme('light')">白天主题</el-button>
            <el-button @click="changeTheme('night')">黑夜主题</el-button>
            <el-button @click="changeTheme('macaron')">马卡龙主题</el-button>
        </div>
        <LineTextLine>var变量切换</LineTextLine>
        <main class="scenery">

        </main>
        <LineTextLine>切换皮肤</LineTextLine>
        <main class="fabulous">

        </main>
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
}
</style>
