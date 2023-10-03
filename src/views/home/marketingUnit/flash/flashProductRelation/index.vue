<template>
    <section id="flashProductRelation" ref="refUnit">
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
            <el-table-column label="商品名称" min-width="120">
                <template v-slot="scope">{{scope.row.product.name}}</template>
            </el-table-column>
            <el-table-column label="货号" min-width="80">
                <template v-slot="scope">NO.{{scope.row.product.productSn}}</template>
            </el-table-column>
            <el-table-column label="商品价格" min-width="80">
                <template v-slot="scope">NO.{{scope.row.product.price}}</template>
            </el-table-column>
            <el-table-column label="剩余数量" min-width="80">
                <template v-slot="scope">NO.{{scope.row.product.stock}}</template>
            </el-table-column>
            <el-table-column label="秒杀价格" min-width="60">
                <template v-slot="scope">NO.{{scope.row.flashPromotionPrice}}</template>
            </el-table-column>
            <el-table-column prop="flashPromotionCount" label="秒杀数量" min-width="80"></el-table-column>
            <el-table-column prop="flashPromotionLimit" label="限购数量" min-width="80"></el-table-column>
            <el-table-column prop="sort" label="排序" min-width="60"></el-table-column>

            <el-table-column width="100" fixed="right">
                <template #header>操作</template>
                <template v-slot="scope">
                    <el-button link @click="editWay(scope.row)">编辑</el-button>
                    <el-button link @click="deleteWay(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        </main>


        <pagination :pagingObj="pagingObj" @emitWay="queryWay"></pagination>

        <addDialog ref="add" @sureWay="queryWay"></addDialog>
        <editDialog ref="edit" @sureWay="queryWay"></editDialog>

    </section>
</template>

<script>
import addDialog from "./addDialog.vue"
import editDialog from "./editDialog.vue"
export default {
    name: "flashProductRelation",
    components: { addDialog, editDialog },
    data() {
        return {
            queryData: {
                keyword: ''
            },
            // -----------------
            tableData: [],
            // -----------------
            pagingObj: { pageNum: 1, pageSize: 10, total: 0 }
        }
    },
    created() {
        this.queryWay();
    },
    methods: {
        addWay() {
            this.$refs.add.initForm();
        },
        editWay(row) {
            this.$refs.edit.initForm(row);
        },
        queryWay() {
            console.log("---搜索---");
            let that = this;
            let params = {
                flashPromotionId: that.$route.query.flashPromotionId,
                flashPromotionSessionId: that.$route.query.flashPromotionSessionId,
                pageNum: that.pagingObj.pageNum,
                pageSize: that.pagingObj.pageSize
            };
            that.$apihttp({
                url: '/sky/flashPromotionProductRelation/list',
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
                        status: value
                    };
                    that.$apihttp({
                        url: '/sky/flashProductRelation/update',
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
            that.$confirm('是否要删除该商品关联?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    let params = {

                    };
                    that.$apihttp({
                        url: '/sky/flashPromotionProductRelation/delete/' + row.id,
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
#flashProductRelation {
    height: 100%;
    display: flex;
    flex-direction: column;
    main {
        flex: 1;
    }
}
</style>

