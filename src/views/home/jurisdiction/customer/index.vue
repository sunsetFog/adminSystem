<template>
    <section id="customer" ref="refUnit">
        <searchDesign @queryWay="queryWay" ref="refHeader" @addWay="addWay">
            <el-form ref="form" :model="queryData" label-width="100px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="账号/姓名：">
                            <el-input v-model="queryData.keyword" placeholder="请输入账号/姓名"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </searchDesign>
        <main>
            <el-table
            :data="tableData"
            border
            style="width: 100%"
            height="100%"
            ref="refTable"
        >
            <el-table-column width="50" type="index" label="序号"></el-table-column>
            <el-table-column prop="username" label="账号" min-width="80"></el-table-column>
            <el-table-column min-width="80">
                <template #header>头像</template>
                <template v-slot="scope">
                    <previewPictures :photoList="[scope.row.icon]"></previewPictures>
                </template>
            </el-table-column>
            <el-table-column prop="nickName" label="姓名" min-width="80"></el-table-column>
            <el-table-column prop="email" label="邮箱" min-width="100"></el-table-column>
            <el-table-column prop="createTime" label="添加时间" min-width="100"></el-table-column>
            <el-table-column prop="loginTime" label="最后登录" min-width="100"></el-table-column>
            <el-table-column min-width="80">
                <template #header>是否启用</template>
                <template v-slot="scope">
                    <el-switch v-model="scope.row.status" @change="(val)=>{switchChange(val, scope.row)}"></el-switch>
                </template>
            </el-table-column>

            <el-table-column width="180" fixed="right">
                <template #header>操作</template>
                <template v-slot="scope">
                    <el-button link @click="roleWay(scope.row)">分配角色</el-button>
                    <el-button link @click="editWay(scope.row)">编辑</el-button>
                    <el-button link @click="deleteWay(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        </main>


        <pagination :pagingObj="pagingObj" @emitWay="queryWay"></pagination>



        <el-dialog
            :title="dialog_title"
            v-model="dialogVisible"
            width="500px"
            :close-on-click-modal="false"
            >
            <section class="mercury">
                <el-form :model="addAndEditForm" :rules="rulesCheck" ref="addAndEditForm" label-width="100px">
                    <el-form-item label="账号:" prop="username">
                        <el-input v-model="addAndEditForm.username" placeholder="请输入账号"></el-input>
                    </el-form-item>
                    <el-form-item label="头像:">
                        <upload1 ref="refUpload"></upload1>
                    </el-form-item>
                    <el-form-item label="姓名:" prop="nickName">
                        <el-input v-model="addAndEditForm.nickName" placeholder="请输入姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱:" prop="email">
                        <el-input v-model="addAndEditForm.email" placeholder="请输入邮箱"></el-input>
                    </el-form-item>
                    <el-form-item label="密码:" prop="password">
                        <el-input v-model="addAndEditForm.password" placeholder="请输入密码"></el-input>
                    </el-form-item>
                    <el-form-item label="备注:" prop="note">
                        <el-input type="textarea" v-model="addAndEditForm.note" maxlength="100" show-word-limit></el-input>
                    </el-form-item>
                    <el-form-item label="是否启用:" prop="status">
                        <el-switch v-model="addAndEditForm.status"></el-switch>
                    </el-form-item>
                </el-form>
            </section>
            <template #footer>
                <section class="dialog-footer">
                    <el-button @click="cancelWay">取 消</el-button>
                    <el-button type="primary" @click="sureWay">确 定</el-button>
                </section>
            </template>
        </el-dialog>

        <el-dialog
            title="分配角色"
            v-model="dialogRole"
            width="500px"
            :close-on-click-modal="false"
            >
            <section class="mercury">
                <el-select v-model="role_value" multiple placeholder="请选择" style="width: 320px;">
                    <el-option
                    v-for="item in role_list"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </section>
            <template #footer>
                <section class="dialog-footer">
                    <el-button @click="cancelRoleWay">取 消</el-button>
                    <el-button type="primary" @click="sureRoleWay">确 定</el-button>
                </section>
            </template>
        </el-dialog>
    </section>
</template>

<script>
import addEdit from "./addEdit"
import userOfRole from "./userOfRole"
export default {
    name: "customer",
    mixins: [addEdit, userOfRole],
    data() {
        return {
            queryData: {
                keyword: ''
            },
            // -----------------
            tableData: [],
            // -----------------
            pagingObj: { pageNum: 1, pageSize: 10, total: 0 },
        }
    },
    created() {
        this.queryWay();
    },
    methods: {
        queryWay() {
            console.log("---搜索---");
            let that = this;
            let params = {
                keyword: that.queryData.keyword,
                pageNum: that.pagingObj.pageNum,
                pageSize: that.pagingObj.pageSize
            };
            that.$apihttp({
                url: '/sky/admin/list',
                method: 'post',
                params: params
            })
                .then(res => {
                    if (res.code == '200') {
                        that.pagingObj.total = res.data.totalSize;
                        that.tableData = res.data.content;
                        for (let index = 0; index < that.tableData.length; index++) {
                            let item = that.tableData[index];
                            item.download_url = item.icon;
                            item.icon = '/sky' + item.icon;
                            if (item.status == 1) {
                                item.status = true
                            } else {
                                item.status = false
                            }
                        }
                    }
                })
                .catch(err => {
                    console.log('error', err);
                });
        },
        switchChange(value, row) {
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
                        status: value ? 1 : 0
                    };
                    that.$apihttp({
                        url: '/sky/admin/update',
                        method: 'post',
                        data: params
                    })
                        .then(res => {
                            if (res.code == '200') {
                                that.queryWay();
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
                    that.queryWay();
                    that.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
        },
        deleteWay(row) {
            let that = this;
            that.$confirm('是否要删除该角色?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    let params = {

                    };
                    that.$apihttp({
                        url: '/sky/admin/delete/' + row.id,
                        method: 'get',
                        params: params
                    })
                        .then(res => {
                            if (res.code == '200') {
                                that.queryWay();
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
#customer {
    height: 100%;
    display: flex;
    flex-direction: column;
    main {
        flex: 1;
    }
}
</style>

