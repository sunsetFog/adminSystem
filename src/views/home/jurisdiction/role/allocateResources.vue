<template>
    <section id="allocateResources">
        <div v-for="(item, index) in resource_list" :key="'iu'+index" class="box-apt">
            <div class="header-apt">
                <el-checkbox :indeterminate="item.active" :label="item.name" v-model="item.checked" @change="(value)=>{allChange(value, index)}">{{item.name}}</el-checkbox>
            </div>

            <div class="body-apt">
                <span :span="6" v-for="(val, toBe) in item.children" :key="'tb'+toBe">
                    <el-checkbox v-model="val.checked" :label="val.name" @change="(value)=>{towardsChange(value, index)}">{{val.name}}</el-checkbox>
                </span>
            </div>
        </div>

        <div class="footer-apt">
            <el-button type="primary" @click="sureWay">保存</el-button>
            <el-button @click="emptyWay">清空</el-button>
        </div>
    </section>
</template>

<script>
export default {
    name: "allocateResources",
    data() {
        return {
            resource_list: [],
            save_list: [],
            save_checked: [],
            save_arr: []
        }
    },
    created() {
        this.resourceCategoryWay();
    },
    methods: {
        // 资源分类
        resourceCategoryWay() {
            let that = this;
            let params = {

            };
            that.$apihttp({
                url: process.env.core_url + '/sky/resourceCategory/list',
                method: 'get',
                params: params
            })
                .then(res => {
                    if (res.code == '200') {
                        that.save_list = res.data;
                        that.listResource();
                    }
                })
                .catch(err => {
                    console.log('error', err);
                });
        },
        // 获取角色相关资源
        listResource() {
            let that = this;
            let params = {

            };
            that.$apihttp({
                url: process.env.core_url + '/sky/role_resource/listResource/'+that.$route.query.roleId,
                method: 'get',
                params: params
            })
                .then(res => {
                    if (res.code == '200') {
                        that.save_checked = res.data;
                        this.resourceWay();
                    }
                })
                .catch(err => {
                    console.log('error', err);
                });
        },
        // 资源
        resourceWay() {
            let that = this;
            let params = {
                categoryId: null,
                nameKeyword: null,
                urlKeyword: '',
                pageNum: 1,
                pageSize: 9999
            };
            that.$apihttp({
                url: process.env.core_url + '/sky/resource/list',
                method: 'get',
                params: params
            })
                .then(res => {
                    if (res.code == '200') {
                        that.save_arr = res.data.content;
                        // 勾选
                        for (let index = 0; index < that.save_checked.length; index++) {
                            let item = that.save_checked[index];
                            for (let y = 0; y < that.save_arr.length; y++) {
                                let val = that.save_arr[y];
                                if(item.id == val.id) {
                                    val.checked = true;
                                }
                            }
                        }
                        that.dealWith()
                    }
                })
                .catch(err => {
                    console.log('error', err);
                });
        },
        dealWith(init) {
            let that = this;
            that.resource_list = that.save_list;
            for (let index = 0; index < that.resource_list.length; index++) {
                let item = that.resource_list[index];
                item.children = []
                item.checked = false
                item.active = true
            }

            for (let index = 0; index < that.resource_list.length; index++) {
                let item = that.resource_list[index];
                let count = 0;
                for (let y = 0; y < that.save_arr.length; y++) {
                    let val = that.save_arr[y];
                    val.checked = init ? false : val.checked;
                    if(item.id == val.categoryId) {
                        if(val.checked) {
                            count++;
                        }
                        item.children.push(val);
                    }
                }
                // 全选设置
                if(count == item.children.length) {
                    item.active = false
                    item.checked = true
                } else {
                    item.active = true
                    item.checked = false
                }

            }
            console.log("--resource_list--", this.resource_list);
        },

        allChange(value, index) {
            console.log("--allChange--", value, index);
            for (let y = 0; y < this.resource_list[index].children.length; y++) {
                let item = this.resource_list[index].children[y];
                if(value) {
                    item.checked = true
                } else {
                    item.checked = false
                }
            }
            this.resource_list[index].active = !value;
            this.$forceUpdate();
        },
        towardsChange(value, index) {
            console.log("--tttttttttttt-", value, index);
            // 全选设置
            let count = 0;
            let total = this.resource_list[index].children.length;
            for (let y = 0; y < total; y++) {
                let item = this.resource_list[index].children[y];
                if(item.checked) {
                    count++;
                }
            }
            if(count == total) {
                this.resource_list[index].active = false
                this.resource_list[index].checked = true
            } else {
                this.resource_list[index].active = true
                this.resource_list[index].checked = false
            }
            this.$forceUpdate();
        },
        sureWay() {
            let that = this;
            let arr = []
            for (let i = 0; i < that.resource_list.length; i++) {
                let item = that.resource_list[i];
                for (let y = 0; y < item.children.length; y++) {
                    let val = item.children[y];
                    if(val.checked) {
                        arr.push(val.id);
                    }
                }
            }
            let params = {
                roleId: that.$route.query.roleId,
                resourceIds: arr.join(",")
            };
            that.$apihttp({
                url: process.env.core_url + '/sky/role_resource/deleteAdd',
                method: 'get',
                params: params
            })
                .then(res => {
                    if (res.code == '200') {
                        that.$router.push({ path: '/home/jurisdiction/role/index' });
                        that.$message({
                            type: 'success',
                            message: '修改成功!'
                        });
                    }
                })
                .catch(err => {
                    console.log('error', err);
                });
        },
        emptyWay() {
            this.dealWith(true);
            this.$forceUpdate();
        }
    }
}
</script>

<style lang="less" scoped>
#allocateResources {
    .box-apt {
        padding: 10px 20px 10px 20px;
        box-sizing: border-box;
        .header-apt {
            width: 100%;
            padding: 10px 0 10px 0;
            box-sizing: border-box;
        }
        .body-apt {
            width: 100%;
            padding: 2px 30px 2px 30px;
            box-sizing: border-box;
            span {
                width: 25%;
                display: inline-block;
                padding: 10px 0 10px 0;
                box-sizing: border-box;
            }
        }
    }
    .footer-apt {
        padding: 20px 0 35px 0;
        box-sizing: border-box;
        text-align: center;
    }
}
</style>


