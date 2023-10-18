<template>
    <section id="brandUnit" ref="refUnit">
        <searchDesign @queryWay="queryWay" ref="refHeader" @addWay="addWay">
            <el-form ref="form" :model="queryData" label-width="100px">
                <el-row :gutter="20">
                    <el-col :span="15">
                        <el-form-item label="品牌名称：">
                            <el-input v-model="queryData.keyword" placeholder="品牌名称"></el-input>
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
            <el-table-column prop="name" label="品牌名称" min-width="80"></el-table-column>
            <el-table-column prop="firstLetter" label="品牌首字母" min-width="80"></el-table-column>
            <el-table-column prop="sort" label="排序" min-width="50"></el-table-column>
            <el-table-column min-width="80">
                <template #header>品牌制造商</template>
                <template v-slot="scope">
                    <el-switch v-model="scope.row.factoryStatus" @change="(val)=>{switchChange(val, scope.row)}"></el-switch>
                </template>
            </el-table-column>
            <el-table-column min-width="80">
                <template #header>是否启用</template>
                <template v-slot="scope">
                    <el-switch v-model="scope.row.showStatus" @change="(val)=>{switchChange(val, scope.row)}"></el-switch>
                </template>
            </el-table-column>
            <el-table-column min-width="120">
                <template #header>相关</template>
                <template v-slot="scope">
                    商品：<span style="color: #409eff;">{{scope.row.productCount}}</span>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    评价：<span style="color: #409eff;">{{scope.row.productCommentCount}}</span>
                </template>
            </el-table-column>

            <el-table-column width="150" fixed="right">
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
                    <el-form-item label="品牌名称:" prop="name">
                        <el-input v-model="addAndEditForm.name" placeholder="请输入品牌名称"></el-input>
                    </el-form-item>
                    <el-form-item label="品牌首字母:" prop="firstLetter">
                        <el-input v-model="addAndEditForm.firstLetter" placeholder="请输入品牌首字母"></el-input>
                    </el-form-item>
                    <el-form-item label="品牌LOGO:">
                        <upload1 ref="logoUpload"></upload1>
                    </el-form-item>
                    <el-form-item label="品牌专区大图:">
                        <upload1 ref="picUpload"></upload1>
                    </el-form-item>
                    <el-form-item label="品牌故事:" prop="brandStory">
                        <el-input v-model="addAndEditForm.brandStory" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="排序:" prop="sort">
                        <el-input v-model="addAndEditForm.sort" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="是否显示:">
                        <el-radio v-model="addAndEditForm.showStatus" :label="1">是</el-radio>
                        <el-radio v-model="addAndEditForm.showStatus" :label="0">否</el-radio>
                    </el-form-item>
                    <el-form-item label="品牌制造商:">
                        <el-radio v-model="addAndEditForm.factoryStatus" :label="1">是</el-radio>
                        <el-radio v-model="addAndEditForm.factoryStatus" :label="0">否</el-radio>
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
    name: "brandUnit",
    mixins: [addEdit],
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
                url: '/sky/brand/list',
                method: 'get',
                params: params
            })
                .then(res => {
                    if (res.code == '200') {
                        that.pagingObj.total = res.data.totalSize;
                        that.tableData = res.data.content;
                        for (let index = 0; index < that.tableData.length; index++) {
                            let item = that.tableData[index];
                            if(item.factoryStatus == 1) {
                                item.factoryStatus = true
                            } else {
                                item.factoryStatus = false
                            }
                            if(item.showStatus == 1) {
                                item.showStatus = true
                            } else {
                                item.showStatus = false
                            }
                            item.download_url_logo = item.logo;
                            item.logo = '/sky' + item.logo;
                            item.download_url_pic = item.bigPic;
                            item.bigPic = '/sky' + item.bigPic;
                        }
                    }
                })
                .catch(err => {
                    console.log('error', err);
                });
        },
        deleteWay(row) {
            let that = this;
            that.$confirm('是否要删除该品牌?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    let params = {

                    };
                    that.$apihttp({
                        url: '/sky/brand/delete/' + row.id,
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
#brandUnit {
    height: 100%;
    display: flex;
    flex-direction: column;
    main {
        flex: 1;
    }
}
</style>

