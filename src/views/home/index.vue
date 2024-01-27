<template>
  <section id="home-box">
    <aside class="home-left" :style="{width: left_width}">
      <div class="logoBox1" v-if="!isCollapse">
        <img src="@sky/rafaelDesign/static/logo/logo.png">
        <p>爱沃里管理后台</p>
      </div>
      <div class="logoBox2" v-else>
        <img src="@sky/rafaelDesign/static/logo/logo.png">
      </div>
      <menuDesign :isCollapse="isCollapse"></menuDesign>
    </aside>

    <div class="home-right">
      <header class="headerBox">
        <div class="menuActive">
            <el-icon @click="collapseEvent"><Menu/></el-icon>
        </div>
        <el-popover
        placement="bottom"
        width="100px"
        trigger="hover">
            <div class="system-box">
                <ul>
                    <li @click="exitTheSystem">
                        <el-icon><SwitchButton/></el-icon>
                        <span>退出系统</span>
                    </li>
                </ul>
            </div>
            <template #reference>
                <div class="user-box">
                    <div>
                        <img src="@sky/rafaelDesign/static/image1/AheadVenus.png">
                    </div>
                    <div>
                        <span>Rafael</span>
                    </div>
                </div>
            </template>
        </el-popover>


      </header>
      <div class="navigation-tab">
          <tabsDesign></tabsDesign>
      </div>
      <article class="pen-router-view">
        <router-view></router-view>
      </article>
    </div>
  </section>
</template>

<script lang="ts">
import menuDesign from '@/components/menuDesign.vue';
import tabsDesign from '@/components/tabsDesign.vue';
import {
    defineComponent
} from "vue";

export default defineComponent({
    name: 'home',
    components: { menuDesign, tabsDesign },
    data() {
        return {
            isCollapse: false,
            left_width: '300px'
        };
    },
    created() {

    },
    watch: {
        $route(to, from) {
            console.log('bttt-88', to, from);
        }
    },

    mounted() {},
    methods: {
        collapseEvent() {
            if (this.isCollapse) {
                this.isCollapse = false;
                this.left_width = '300px';
            } else {
                this.isCollapse = true;
                this.left_width = '63px';
            }
        },
        exitTheSystem() {
            let that = this;
            let params = {};
            that.$apihttp({
                url: '/sky/user/logout',
                method: 'get',
                data: params
            })
                .then(res => {
                    if (res.code == '200') {
                        that.$router.push({path: "/login"});
                        that.$message({
                            type: 'success',
                            message: '退出登录成功!'
                        });
                    }
                })
                .catch(err => {
                    console.log('error', err);
                });
        }
    },
});
</script>

<style lang="less" scoped>
#home-box {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    .home-left {
        height: 100%;
        float: left;
        box-shadow: 0 1px 2px #999999;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        .logoBox1 {
            width: 300px;
            height: 50px;
            margin: 20px 0 30px 0;
            img {
                width: 50px;
                height: 50px;
                float: left;
                margin: 0 10px;
            }
            p {
                height: 50px;
                line-height: 50px;
                float: left;
                color: #435ebe;
                font-weight: 600;
                font-size: 24px;
            }
        }
        .logoBox2 {
            width: 100%;
            height: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
            img {
                width: 30px;
                height: 30px;
            }
        }

    }
    .home-right {
        flex: 1;
        height: 100%;
        float: right;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        .headerBox {
            width: 100%;
            height: 50px;
            line-height: 50px;
            padding: 0 20px;
            box-shadow: 0 0.5px 2px #999999;
            .menuActive {
                width: fit-content;
                height: 100%;
                float: left;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .show-menu {
                font-size: 24px;
            }

            .user-box {
                height: 100%;
                float: right;
                div:nth-of-type(1) {
                    width: 35px;
                    height: 100%;
                    float: left;
                    margin-right: 10px;
                    img {
                        width: 35px;
                        height: 35px;
                        margin-top: 8px;
                    }
                }
                div:nth-of-type(2) {
                    float: right;
                    height: 100%;
                    span {
                        height: 25px;
                        line-height: 25px;
                        font-size: 14px;
                        margin-top: 14px;
                    }
                }
            }
        }
        .navigation-tab {
            width: 100%;
            height: 50px;
            padding: 0 10px 0px 10px;
            box-shadow: 0 0.5px 2px #999999;
            display: flex;
            align-items: center;
        }
        .pen-router-view {
            width: 100%;
            flex: 1;
            padding: 8px 10px 0px 10px;
            overflow: auto;
        }
    }
}
</style>
