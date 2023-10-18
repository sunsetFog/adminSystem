<template>
    <section id="productAttrUnit" ref="refUnit">
        <searchDesign @queryWay="queryWay" ref="refHeader" @addWay="addWay" :sousuo="false"></searchDesign>
        <main>
            <el-table
            :data="tableData"
            border
            style="width: 100%"
            height="100%"
            ref="refTable"
        >
            <el-table-column width="50" type="index" label="序号"></el-table-column>
            <el-table-column prop="name" label="类型名称" min-width="80"></el-table-column>
            <el-table-column prop="attributeCount" label="属性数量" min-width="80"></el-table-column>
            <el-table-column prop="paramCount" label="参数数量" min-width="100"></el-table-column>

            <el-table-column width="300" fixed="right">
                <template #header>操作</template>
                <template v-slot="scope">
                    <el-button link @click="productAttrList(scope.row, 0)">属性列表</el-button>
                    <el-button link @click="productAttrList(scope.row, 1)">参数列表</el-button>
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
                    <el-form-item label="类型名称:" prop="name">
                        <el-input v-model="addAndEditForm.name" placeholder="请输入类型名称"></el-input>
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
    name: "productAttrUnit",
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
                pageNum: that.pagingObj.pageNum,
                pageSize: that.pagingObj.pageSize
            };
            that.$apihttp({
                url: '/sky/PmsProductAttributeCategory/list',
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
            that.$confirm('是否要删除该类型?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    let params = {

                    };
                    that.$apihttp({
                        url: '/sky/PmsProductAttributeCategory/delete/' + row.id,
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
        productAttrList(row, type) {
            this.$router.push({
                path: "/home/shopUnit/productAttr/productAttrList/index?cid=" + row.id + "&cname=" + row.name + "&type=" + type
            })
        }
    }
}
</script>

<style lang="less" scoped>
#productAttrUnit {
    height: 100%;
    display: flex;
    flex-direction: column;
    main {
        flex: 1;
    }
}
</style>

