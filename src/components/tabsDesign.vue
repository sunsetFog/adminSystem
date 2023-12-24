<template>
  <section id="tabsDesign">
    <el-tabs v-model="tabs_value" type="card" closable @tab-click="penTab" @tab-remove="removeTab" @contextmenu.prevent.native="openContextMenu">
      <el-tab-pane
        v-for="(item, index) in tabList"
        :key="item.key"
        :label="item.title"
        :name="item.key"
      ></el-tab-pane>
    </el-tabs>



    <div v-show="contextMenuVisible">
        <ul :style="{left: clientX+'px',top: clientY+'px'}" class="contextmenu">
            <li><el-button link @click="curTabReload()" size="small">重新加载</el-button></li>
            <li><el-button link @click="closeAllTabs()" size="small">关闭所有</el-button></li>
            <li><el-button link @click="closeOtherTabs('left')" :disabled="false" size="small">关闭左边</el-button></li>
            <li><el-button link @click="closeOtherTabs('right')" :disabled="false" size="small">关闭右边</el-button></li>
            <li><el-button link @click="closeOtherTabs('other')" size="small">关闭其他</el-button></li>
        </ul>
    </div>
  </section>
</template>

<script lang="ts">
import { mapMutations, mapGetters, mapActions } from 'vuex';
import {
    defineComponent
} from "vue";

export default defineComponent({
    name: 'tabsDesign',
    data() {
        return {
            tabs_value: '',
            contextMenuVisible: false,
            clientX: 0,
            clientY: 0,
            sign_key: ''
        };
    },
    computed: {
        ...mapGetters(['tabList', 'tabsValue'])
    },
    watch: {
        // 报错：Computed property "XXX" was assigned to but it has no setter
        // computed没有set函数，因为vuex中，computed和v-model冲突
        tabsValue(cur, old) {
            this.tabs_value = cur;
        },
    },
    mounted() {
        let that = this;
        // document.addEventListener('mouseup', function(e: any){
        //     console.log("--mouseup--", e)
        //     if(e.target.className.indexOf("el-tabs__item") == -1){
        //         that.contextMenuVisible = false;
        //     }
        // })

    },
    destroyed:function(){
        document.removeEventListener('mouseup', function(e){

        })
    },
    methods: {
        // 标签页事情
        penTab(item) {
            let index = Number(item.index);
            console.log('penTab====', item);
            this.$store.commit('menuOfValue', this.tabList[index].key);
            this.$store.commit('tabsOfValue', this.tabList[index].key);
            this.$router.push({ path: this.tabList[index].path });
        },
        // 关闭标签页事件
        removeTab(item) {
            let index = Number(item.index);
            console.log('removeTab====', index);
            this.$store.commit('removeTabs', index);
        },
        // 鼠标右键
        openContextMenu(MouseEvent) {
            MouseEvent.preventDefault(); //防止默认菜单弹出
            console.log("鼠标右击事件", MouseEvent);
            if(MouseEvent.target.className && MouseEvent.target.className.indexOf("el-tabs__item") != -1){
                this.clientX = MouseEvent.clientX;
                this.clientY = MouseEvent.clientY + 10;
                this.sign_key = MouseEvent.target.id.split("tab-")[1];
                console.log("sign_key= ", this.sign_key);
                this.contextMenuVisible = true;
            }
        },
        curTabReload() {
            this.$router.go(0);
            this.contextMenuVisible = false;
        },
        closeAllTabs() {
            this.$store.commit('addTabs', []);
            this.contextMenuVisible = false;
        },
        closeOtherTabs(value) {
            let arr = JSON.parse(JSON.stringify(this.tabList));
            let save_index = -1;
            for(let i = 0; i < arr.length; i++) {
                let item = arr[i];
                if(item.key == this.sign_key) {
                    save_index = i;
                }
            }
            if(value == 'left') {
                arr = arr.filter(function(item, index){
                    return save_index <= index;
                })
            }
            if(value == 'right') {
                arr = arr.filter(function(item, index){
                    return save_index >= index;
                })
            }
            if(value == 'other') {
                arr = arr.filter(function(item, index){
                    return save_index == index;
                })
            }
            this.$store.commit('addTabs', arr);
            this.contextMenuVisible = false;
        }
    },
});
</script>

<style lang="less" scoped>
#tabsDesign {
    :deep(.el-tabs__header) {
        border-bottom: 0px solid #e4e7ed;
        margin: 0;
    }
    :deep(.el-tabs__nav) {
        border-bottom: 1px solid #e4e7ed;
    }

    .contextmenu {
        width: 100px;
        margin: 0;
        border: 1px solid #ccc;
        background: #fff;
        z-index: 3000;
        position: absolute;
        list-style-type: none;
        padding: 5px 0;
        border-radius: 4px;
        font-size: 14px;
        color: #333;
        box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.2);
    }
    .contextmenu li {
        margin: 0;
        padding: 0px 22px;

    }
    .contextmenu li:hover {
        background: #f2f2f2;
        cursor: pointer;
    }
    .contextmenu li button{
    color: #2c3e50;
    }

}
</style>

