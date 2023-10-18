<template>
    <section id="resourceUnit" ref="refUnit">
        <searchDesign @queryWay="queryWay" ref="refHeader" @addWay="addWay" :chongzhi="true" @resetWay="resetWay">
            <el-form ref="form" :model="queryData" label-width="100px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="资源名称：">
                            <el-input v-model="queryData.nameKeyword" placeholder="请输入资源名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="资源路径：">
                            <el-input v-model="queryData.urlKeyword" placeholder="请输入资源路径"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="资源分类：">
                            <el-select v-model="queryData.categoryId" placeholder="请选择">
                                <el-option
                                v-for="item in category_list"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #apple>
                <el-button type="primary" @click="categoryWay">资源分类</el-button>
            </template>
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
            <el-table-column prop="name" label="资源名称" min-width="100"></el-table-column>
            <el-table-column prop="url" label="资源路径" min-width="100"></el-table-column>
            <el-table-column prop="description" label="描述" min-width="100"></el-table-column>
            <el-table-column prop="createTime" label="添加时间" min-width="100"></el-table-column>

            <el-table-column width="180" fixed="right">
                <template #header>操作</template>
                <template v-slot="scope">
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
                    <el-form-item label="资源名称:" prop="name">
                        <el-input v-model="addAndEditForm.name" placeholder="请输入资源名称"></el-input>
                    </el-form-item>
                    <el-form-item label="资源路径:" prop="url">
                        <el-input v-model="addAndEditForm.url" placeholder="请输入资源路径"></el-input>
                    </el-form-item>
                    <el-form-item label="资源分类:" prop="categoryId">
                        <el-select v-model="addAndEditForm.categoryId" placeholder="请选择">
                            <el-option
                            v-for="item in category_list"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="描述:" prop="description">
                        <el-input type="textarea" v-model="addAndEditForm.description" maxlength="100" show-word-limit></el-input>
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

    </section>
</template>

<script>
import addEdit from "./addEdit"
export default {
    name: "resourceUnit",
    mixins: [addEdit],
    data() {
        return {
            queryData: {
                nameKeyword: '',
                urlKeyword: '',
                categoryId: null
            },
            category_list: [],
            // -----------------
            tableData: [],
            // -----------------
            pagingObj: { pageNum: 1, pageSize: 10, total: 0 },
        }
    },
    created() {
        this.queryWay();
        this.categoryList();
    },
    methods: {
        resetWay() {
            this.queryData.nameKeyword = ''
            this.queryData.urlKeyword = ''
            this.queryData.categoryId = null
        },
        categoryList() {
            let that = this;
            let params = {

            };
            that.$apihttp({
                url: '/sky/resourceCategory/list',
                method: 'get',
                params: params
            })
                .then(res => {
                    if (res.code == '200') {
                        that.category_list = res.data;
                    }
                })
                .catch(err => {
                    console.log('error', err);
                });
        },
        queryWay() {
            console.log("---搜索---");
            let that = this;
            let params = {
                nameKeyword: that.queryData.nameKeyword,
                urlKeyword: that.queryData.urlKeyword,
                categoryId: that.queryData.categoryId,
                pageNum: that.pagingObj.pageNum,
                pageSize: that.pagingObj.pageSize
            };
            that.$apihttp({
                url: '/sky/resource/list',
                method: 'get',
                params: params
            })
                .then(res => {
                    if (res.code == '200') {
                        that.pagingObj.total = res.data.totalSize;
                        that.tableData = res.data.content;
                        for (let index = 0; index < that.tableData.length; index++) {
                            let item = that.tableData[index];
                        }
                    }
                })
                .catch(err => {
                    console.log('error', err);
                });
        },
        deleteWay(row) {
            let that = this;
            that.$confirm('是否要删除该资源?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    let params = {

                    };
                    that.$apihttp({
                        url: '/sky/resource/delete/' + row.id,
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
        },
        categoryWay() {
            this.$router.push({
                path: "/home/jurisdiction/resource/resourceCategory/index"
            })
        }
    }
}
</script>

<style lang="less" scoped>
#resourceUnit {
    height: 100%;
    display: flex;
    flex-direction: column;
    main {
        flex: 1;
    }
}
</style>

