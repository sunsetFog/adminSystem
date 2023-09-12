<template>
    <section id="menuUnit" ref="refUnit">
        <searchDesign ref="refHeader" @addWay="addWay" :sousuo="false">
            <el-form ref="form" :model="queryData" label-width="100px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="切换项目：">
                            <el-select v-model="queryData.subject" placeholder="请选择" @change="subjectChange">
                                <el-option
                                v-for="item in subject_list"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="切换类型：">
                            <el-radio v-model="queryData.type" label="1" @change="typeWay">菜单</el-radio>
                            <el-radio v-model="queryData.type" label="2" @change="typeWay">路由</el-radio>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </searchDesign>

        <el-table
            :data="tableData"
            border
            style="width: 100%"
            v-if="tableHeight != 0"
            :height="tableHeight"
            ref="refTable"
            row-key="id"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        >
            <el-table-column width="50" type="index" label="序号"></el-table-column>
            <el-table-column prop="title" label="标题" min-width="120"></el-table-column>
            <!-- <el-table-column prop="path" label="组件路径" min-width="200"></el-table-column> -->
            <el-table-column prop="levelName" label="级数" min-width="80"></el-table-column>
            <el-table-column prop="name" label="路由名称" min-width="80"></el-table-column>
            <el-table-column min-width="80">
                <template slot="header">图标</template>
                <template slot-scope="scope">
                    <!-- <i :class="scope.row.icon"></i> -->
                </template>
            </el-table-column>
            <el-table-column min-width="80">
                <template slot="header">菜单隐藏</template>
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.hidden" :active-value="1" :inactive-value="0" @change="(val)=>{switchChange(val, scope.row, 'hidden')}"></el-switch>
                </template>
            </el-table-column>
            <el-table-column min-width="80">
                <template slot="header">是否缓存</template>
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.cache" :active-value="1" :inactive-value="0" @change="(val)=>{switchChange(val, scope.row, 'cache')}"></el-switch>
                </template>
            </el-table-column>

            <el-table-column width="100" fixed="right">
                <template slot="header">操作</template>
                <template slot-scope="scope">
                    <el-button type="text" @click="editWay(scope.row)">编辑</el-button>
                    <el-button type="text" :disabled="scope.row.children.length != 0" @click="deleteWay(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- <pagination :pagingObj="pagingObj" @emitWay="menuWay"></pagination> -->



        <el-dialog
            :title="dialog_title"
            :visible.sync="dialogVisible"
            width="500px"
            :close-on-click-modal="false"
            >
            <section class="mercury">
                <el-form :model="addAndEditForm" :rules="rulesCheck" ref="addAndEditForm" label-width="100px">
                    <el-form-item label="添加类型">
                        <el-radio-group v-model="addAndEditForm.varieties">
                            <el-radio label="1" @change="initForm">添加菜单</el-radio>
                            <el-radio label="2" @change="initForm">按钮权限</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="标题:" prop="title">
                        <el-input v-model="addAndEditForm.title" placeholder="请输入标题"></el-input>
                    </el-form-item>
                    <el-form-item label="按钮编码:" prop="perms" v-if="addAndEditForm.varieties=='2'">
                        <el-input v-model="addAndEditForm.perms" placeholder="请输入按钮编码"></el-input>
                    </el-form-item>
                    <el-form-item label="上级菜单:" v-if="addAndEditForm.varieties=='1'">
                        <el-cascader
                            v-model="addAndEditForm.menuParentId"
                            :options="menu_level"
                            :props="defaultProps">
                            </el-cascader>
                    </el-form-item>
                    <el-form-item label="上级路由:">
                        <el-cascader
                            v-model="addAndEditForm.routerParentId"
                            :options="router_level"
                            :props="defaultProps">
                            </el-cascader>
                    </el-form-item>
                    <el-form-item label="路由名称:" prop="name" v-if="addAndEditForm.varieties=='1'">
                        <el-input v-model="addAndEditForm.name" placeholder="请输入路由名称"></el-input>
                    </el-form-item>
                    <el-form-item label="图标:" prop="icon" v-if="addAndEditForm.varieties=='1'">
                        <el-input v-model="addAndEditForm.icon" placeholder="请输入图标"></el-input>
                    </el-form-item>
                    <el-form-item label="路由路径:" prop="path" v-if="addAndEditForm.varieties=='1'">
                        <el-input v-model="addAndEditForm.path" placeholder="请输入路由路径"></el-input>
                    </el-form-item>
                    <el-form-item label="菜单隐藏:" prop="hidden" v-if="addAndEditForm.varieties=='1'">
                        <el-switch v-model="addAndEditForm.hidden" :active-value="1" :inactive-value="0"></el-switch>
                    </el-form-item>
                    <el-form-item label="是否缓存:" prop="cache" v-if="addAndEditForm.varieties=='1'">
                        <el-switch v-model="addAndEditForm.cache" :active-value="1" :inactive-value="0"></el-switch>
                    </el-form-item>
                    <el-form-item label="排序:" prop="sort">
                        <el-input v-model.number="addAndEditForm.sort" type="number" placeholder=""></el-input>
                    </el-form-item>
                </el-form>
            </section>
            <section slot="footer" class="dialog-footer">
                <el-button @click="cancelWay">取 消</el-button>
                <el-button type="primary" @click="sureWay">确 定</el-button>
            </section>
        </el-dialog>

    </section>
</template>

<script>
import addEdit from "./addEdit"
export default {
    name: "menuUnit",
    mixins: [addEdit],
    data() {
        return {
            queryData: {
                subject: 'crm',
                type: '1'
            },
            subject_list: [
                { value: 'crm', label: 'crm项目' },
                { value: 'explore', label: 'explore项目' },
                { value: 'reportForms', label: 'reportForms项目' }
            ],
            // -----------------
            tableData: [],
            tableHeight: 0,
            // -----------------
            pagingObj: { pageNum: 1, pageSize: 10, total: 0 },
            id_list: []
        }
    },
    created() {
        this.subjectChange();
    },
    mounted() {
        console.log('--refUnit-', this.$refs.refUnit.offsetHeight);
        console.log('--refHeader-$el指向模板根标签-', this.$refs.refHeader.$el.offsetHeight);
        this.tableHeight =
            this.$refs.refUnit.offsetHeight -
            (this.$refs.refHeader.$el.offsetHeight + 1);
        console.log('--tableHeight--', this.tableHeight);
    },
    methods: {
        typeWay(value) {
            console.log("--typeWay--", value);
            this.playWay();
        },
        subjectChange(value) {
            console.log("--subjectChange--", value);
            this.menuWay();
            this.routerWay();
        },
        playWay() {
            if(this.queryData.type == '1') {
                this.menuWay();
            } else if(this.queryData.type == '2') {
                this.routerWay();
            }
        },
        menuWay() {
            let that = this;
            let params = {
                subject: that.queryData.subject
            };
            that.$apihttp({
                url: process.env.core_url + '/sky/menu/treeMenu',
                method: 'get',
                params: params
            })
                .then(res => {
                    if (res.code == '200') {
                        let list = res.data;
                        if(that.queryData.type == '1') {
                            that.tableData = list;
                            that.recursion(that.tableData);
                        }
                        
                        that.menu_level = JSON.parse(JSON.stringify(list));
                        console.log("-menu-tableData--", that.tableData);
                        
                        for (let i = 0; i < that.menu_level.length; i++) {
                            let item = that.menu_level[i];
                            delete item["children"];
                        }
                        that.menu_level.unshift({ id: -1, title: "不是菜单", menuParentId: 0 });
                        that.menu_level.unshift({ id: 0, title: "第一级菜单", menuParentId: 0 });
                    }
                })
                .catch(err => {
                    console.log('error', err);
                });
        },
        routerWay() {
            let that = this;
            let params = {
                subject: that.queryData.subject
            };
            that.$apihttp({
                url: process.env.core_url + '/sky/menu/treeRouter',
                method: 'get',
                params: params
            })
                .then(res => {
                    if (res.code == '200') {
                        let list = res.data;
                        if(that.queryData.type == '2') {
                            that.tableData = list;
                            that.recursion(that.tableData);
                        }
                        
                        that.router_level = JSON.parse(JSON.stringify(list));
                        // console.log("--router_level--", that.router_level);
                        
                        for (let i = 0; i < that.router_level.length; i++) {
                            let item = that.router_level[i];
                            for (let y = 0; y < item.children.length; y++) {
                                let row = item.children[y];
                                delete row["children"];
                            }
                            if(item.children.length == 0) {
                                delete item["children"];
                            }
                        }
                        that.router_level.unshift({ id: -1, title: "不是路由", routerParentId: 0 });
                        that.router_level.unshift({ id: 0, title: "第一级路由", routerParentId: 0 });
                    }
                })
                .catch(err => {
                    console.log('error', err);
                });
        },
        recursion(arr) {
            arr = arr || []; //退出递归1. 空数组不会遍历，就不会调用自己了
            for (let i = 0; i < arr.length; i++) {
                let item = arr[i];
                if(item.menuLevel == 0 && this.queryData.type == '1') {
                    item.levelName = "一级";
                } else if (item.menuLevel == 1 && this.queryData.type == '1') {
                    item.levelName = "二级";
                } else if (item.menuLevel == 2 && this.queryData.type == '1') {
                    item.levelName = "三级";
                }
                if(item.routerLevel == 0 && this.queryData.type == '2') {
                    item.levelName = "一级";
                } else if (item.routerLevel == 1 && this.queryData.type == '2') {
                    item.levelName = "二级";
                } else if (item.routerLevel == 2 && this.queryData.type == '2') {
                    item.levelName = "三级";
                }
                this.recursion(item.children);
            }
        },
        switchChange(value, row, key) {
            console.log("--switchChange--", value, row);
            let that = this;
            that.$confirm('是否要修改该状态?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    let params = {
                        id: row.id,
                        menuParentId: row.menuParentId,
                        routerParentId: row.routerParentId,
                        [key]: value
                    };
                    that.$apihttp({
                        url: process.env.core_url + '/sky/menu/update',
                        method: 'post',
                        data: params
                    })
                        .then(res => {
                            if (res.code == '200') {
                                that.playWay();
                                
                                that.$message({
                                    type: 'success',
                                    message: '修改成功!'
                                });
                            }
                        })
                        .catch(err => {
                            console.log('error', err);
                        });
                })
                .catch(() => {
                    that.playWay();
                    that.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
        },
        idWay1(arr, id) {
            arr = arr || []; //退出递归1. 空数组不会遍历，就不会调用自己了
            for (let i = 0; i < arr.length; i++) {
                let item = arr[i];
                if(item.id == id) {
                    this.idWay2(item.children);
                    break;
                }
                this.idWay1(item.children, id);
            }
        },
        idWay2(arr) {
            arr = arr || []; //退出递归1. 空数组不会遍历，就不会调用自己了
            for (let i = 0; i < arr.length; i++) {
                let item = arr[i];
                this.id_list.push(item.id);
                this.idWay2(item.children);
            }
        },
        deleteWay(row) {
            let that = this;
            that.$confirm('是否要删除该菜单?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    that.id_list = [row.id]
                    that.idWay1(that.tableData, row.id);
                    let params = {
                        ids: that.id_list.join(",")
                    };
                    that.$apihttp({
                        url: process.env.core_url + '/sky/menu/delete',
                        method: 'get',
                        params: params
                    })
                        .then(res => {
                            if (res.code == '200') {
                                that.playWay();
                                that.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                            }
                        })
                        .catch(err => {
                            console.log('error', err);
                        });
                })
                .catch(() => {
                    that.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
        }
    }
}
</script>

<style lang="less" scoped>
#menuUnit {
    height: 100%;
}
</style>

