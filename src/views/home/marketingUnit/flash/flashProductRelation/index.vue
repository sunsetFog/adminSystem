<template>
    <section id="flashProductRelation" ref="refUnit">
        <searchDesign @queryWay="queryWay" ref="refHeader" @addWay="addWay" :sousuo="false"></searchDesign>
        <!-- 
            1.table的滚动条是height值影响的
            2.要是table在mouted生命周期不重新渲染了，强制刷新渲染也没用，那么用v-if="tableHeight != 0"控制渲染延后
        -->
        <el-table
            :data="tableData"
            border
            style="width: 100%"
            v-if="tableHeight != 0"
            :height="tableHeight"
            ref="refTable"
        >
            <el-table-column width="50" type="index" label="序号"></el-table-column>
            <el-table-column label="商品名称" min-width="120">
                <template slot-scope="scope">{{scope.row.product.name}}</template>
            </el-table-column>
            <el-table-column label="货号" min-width="80">
                <template slot-scope="scope">NO.{{scope.row.product.productSn}}</template>
            </el-table-column>
            <el-table-column label="商品价格" min-width="80">
                <template slot-scope="scope">NO.{{scope.row.product.price}}</template>
            </el-table-column>
            <el-table-column label="剩余数量" min-width="80">
                <template slot-scope="scope">NO.{{scope.row.product.stock}}</template>
            </el-table-column>
            <el-table-column label="秒杀价格" min-width="60">
                <template slot-scope="scope">NO.{{scope.row.flashPromotionPrice}}</template>
            </el-table-column>
            <el-table-column prop="flashPromotionCount" label="秒杀数量" min-width="80"></el-table-column>
            <el-table-column prop="flashPromotionLimit" label="限购数量" min-width="80"></el-table-column>
            <el-table-column prop="sort" label="排序" min-width="60"></el-table-column>

            <el-table-column width="100" fixed="right">
                <template slot="header">操作</template>
                <template slot-scope="scope">
                    <el-button type="text" @click="editWay(scope.row)">编辑</el-button>
                    <el-button type="text" @click="deleteWay(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

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
            tableHeight: 0,
            // -----------------
            pagingObj: { pageNum: 1, pageSize: 10, total: 0 }
        }
    },
    created() {
        this.queryWay();
    },
    mounted() {
        console.log('--refUnit-', this.$refs.refUnit.offsetHeight);
        console.log('--refHeader-$el指向模板根标签-', this.$refs.refHeader.$el.offsetHeight);
        this.tableHeight =
            this.$refs.refUnit.offsetHeight -
            (this.$refs.refHeader.$el.offsetHeight + 50 + 1);
        console.log('--tableHeight--', this.tableHeight);
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
                url: process.env.core_url + '/sky/flashPromotionProductRelation/list',
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
                        url: process.env.core_url + '/sky/flashProductRelation/update',
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
                        url: process.env.core_url + '/sky/flashPromotionProductRelation/delete/' + row.id,
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
}
</style>

