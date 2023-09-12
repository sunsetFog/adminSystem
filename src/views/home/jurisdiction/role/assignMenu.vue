<template>
  <section id="assignMenu">
    <el-tree
      ref="refTree"
      :data="menu_list"
      show-checkbox
      node-key="id"
      :default-expanded-keys="open_list"
      :default-checked-keys="checked_list"
      :props="defaultProps"
    ></el-tree>
    <div class="footer-apt">
        <el-button type="primary" @click="sureWay">保存</el-button>
        <el-button @click="emptyWay">清空</el-button>
    </div>
  </section>
</template>

<script>
export default {
    name: "assignMenu",
    data() {
        return {
            menu_list: [],
            defaultProps: {
                children: 'children',
                label: 'title',
            },
            open_list: [],
            checked_list: [],
            save_list: [],
            role_id: null
        };
    },
    created() {
        console.log("-----", this.$route.query.roleId)
        this.role_id = Number(this.$route.query.roleId)
        this.menuWay();
    },
    methods: {
        menuWay() {
            let that = this;
            let params = {
                subject: 'crm'
            };
            that.$apihttp({
                url: process.env.core_url + '/sky/menu/treeMenu',
                method: 'get',
                params: params
            })
                .then(res => {
                    if (res.code == '200') {
                        that.save_list = res.data;
                        this.roleMenuWay();
                    }
                })
                .catch(err => {
                    console.log('error', err);
                });
        },
        roleMenuWay() {
            let that = this;
            let params = {

            };
            that.$apihttp({
                url: process.env.core_url + '/sky/role_menu/listMenu/' + that.role_id,
                method: 'get',
                params: params
            })
                .then(res => {
                    if (res.code == '200') {
                        let arr = res.data
                        arr = arr.filter(function(item) {
                            return item.parentId != 0;
                        })
                        for (let index = 0; index < arr.length; index++) {
                            let item = arr[index];
                            that.checked_list.push(item.id);
                        }
                        console.log("--that.checked_list--", that.checked_list);


                        that.menu_list = that.save_list;
                        for (let index = 0; index < that.menu_list.length; index++) {
                            let item = that.menu_list[index];
                            that.open_list.push(item.id);
                        }
                    }
                })
                .catch(err => {
                    console.log('error', err);
                });
        },
        sureWay() {
            let that = this;
            let checkedArr = this.$refs.refTree.getCheckedKeys();
            let params = {
                roleId: that.role_id,
                menuIds: checkedArr.join(",")
            };
            that.$apihttp({
                url: process.env.core_url + '/sky/role_menu/deleteAdd',
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
            this.$refs.refTree.setCheckedKeys([]);
        }
    }
};
</script>

<style lang="less" scoped>
#assignMenu {
    .footer-apt {
        padding: 20px 0 35px 0;
        box-sizing: border-box;
        text-align: center;
    }
}
</style>


