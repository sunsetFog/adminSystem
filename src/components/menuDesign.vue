<template>
  <section id="menuDesign">
      <el-scrollbar style="width:100%;height:90%;">

        <el-menu
        @select="selectMenu"
        @open="openMenu"
        @close="closeMenu"
        :default-active="menuValue"
        background-color="#fff"
        text-color="black"
        unique-opened
        active-text-color="#ffd04b"
        mode="vertical"
        :collapse="isCollapse"
        >
        <div v-for="(item,index) in menuList" :key="index+'w'">
            <!-- 第一级 -->
            <el-menu-item :index="item.key" v-if="item.children.length == 0">
                <el-icon><Menu /></el-icon>
                <span>{{item.title}}</span>
            </el-menu-item>

            <!-- el-menu-item的index绑定是@open事件的参数 -->
            <el-sub-menu :index="'sign'+index" v-else>
                <template #title>
                    <el-icon><Menu /></el-icon>
                    <span>{{item.title}}</span>
                </template>

                    <template v-for="(val,ind) in item.children">
                        <!-- 第二级 -->
                        <!-- el-sub-menu的index绑定是@select事件的参数,也是:default-active的参数 -->
                        <el-menu-item :index="val.key" v-if="val.hidden != 1" :key="val.key">
                            <div style="width: 100%;height: 100%;text-indent: 25px;">{{val.title}}</div>
                        </el-menu-item>
                    </template>
            </el-sub-menu>
        </div>
        </el-menu>

    </el-scrollbar>
  </section>
</template>

<script lang="ts">
import { mapMutations, mapGetters, mapActions } from 'vuex';
import {
    defineComponent
} from "vue";

export default defineComponent({
    name: 'menuDesign',
    data() {
        return {

        };
    },
    props: {
        isCollapse: {
            type: Boolean,
            default: function() {
                return false;
            },
        },
    },
    computed: {
        ...mapGetters(['menuList', 'menuValue'])
    },
    created() {
        // 刷新初始化赋值
        let that = this;
        let tabArr = JSON.parse(sessionStorage.getItem('tabList')) || [];
        tabArr = tabArr.filter(function(item){
            return item.path == that.$route.path;
        })
        that.$store.commit('addTabs', tabArr);
        that.$store.commit("menuOfValue", sessionStorage.getItem('menu_value'));
        that.$store.commit("tabsOfValue", sessionStorage.getItem('tabs_value'));
    },
    methods: {
        // 选中菜单
        selectMenu(key) {
            this.recursion(this.menuList, key);
            console.log('selectMenu', key);
        },
        recursion(arr, key) {
            arr = arr || [];//退出遍历1. 空数组不会遍历，就不会调用自己了
            for (let i = 0; i < arr.length; i++) {
                let item = arr[i];

                if(item.key == key) {
                    // 菜单选中值
                    this.$store.commit('menuOfValue', item.key);
                    // 跳转
                    this.$router.push({ path: item.path });
                    // 修改tabs数组和选中值
                    this.$store.commit('tabsOfValue', item.key);
                    this.$store.commit('addTabs', {
                        title: item.title,
                        path: item.path,
                        key: item.key
                    });
                    break;
                }

                if (!item.children) {//退出遍历2. 结束一次循环，就不会调用自己了
                    continue;
                }
                this.recursion(item.children, key); // 传children数组
            }
        },
        // 展开菜单
        openMenu(index) {
            index = Number(index.split('sign')[1]);
            console.log('openMenu', index);
        },
        // 关闭菜单
        closeMenu(path) {
            console.log('closeMenu', path);
        }
    },
});
</script>

<style lang="less" scoped>
#menuDesign {
    height: calc(100% - 50px);
    :deep(.el-menu) {
        border: none !important;
    }

    :deep(.el-scrollbar__wrap) {
        overflow-x: hidden !important;
    }
    /*水平折叠收起菜单,隐藏文字和标签*/
    :deep(.el-menu--collapse span) {
        display: none;
    }
    :deep(.el-menu--collapse .el-sub-menu__title .el-sub-menu__icon-arrow) {
        display: none;
    }
}
</style>

