<template>
    <section id="addDialog">
        <el-dialog
            title="选择商品"
            v-model="dialogVisible"
            width="700px"
            :close-on-click-modal="false"
            >
            <section class="mercury">
                <el-row :gutter="20" style="margin-bottom: 20px;">
                    <el-col :span="3">商品名称:</el-col>
                    <el-col :span="11">
                        <el-input placeholder="" v-model="keyword">
                            <template #append>
                                <el-button @click="queryWay()">
                                    <el-icon><Search /></el-icon>
                                </el-button>
                            </template>
                        </el-input>
                    </el-col>
                </el-row>
                <!--
                    如何解决分页使勾选消失的问题？
                    加上
                    :row-key="getRowKeys"
                    :reserve-selection="true"
                 -->
                <el-table
                    :data="tableData"
                    border
                    style="width: 100%"
                    ref="refTable"
                    :row-key="getRowKeys"
                    @select="tickSelect"
                >
                    <el-table-column type="selection" :reserve-selection="true" width="60" align="center"></el-table-column>
                    <el-table-column prop="name" label="商品名称" min-width="120"></el-table-column>
                    <el-table-column label="货号" min-width="100">
                        <template v-slot="scope">NO.{{scope.row.productSn}}</template>
                    </el-table-column>
                    <el-table-column label="价格" min-width="100">
                        <template v-slot="scope">￥{{scope.row.price}}</template>
                    </el-table-column>
                </el-table>
                <pagination :pagingObj="pagingObj" @emitWay="queryWay"></pagination>
            </section>
            <template #footer>
                <section class="dialog-footer">
                    <el-button @click="cancelWay">取 消</el-button>
                    <el-button type="primary" v-if="sure_active == 1" @click="sureWay1">确 定</el-button>
                    <el-button type="primary" v-if="sure_active == 2" @click="sureWay2">确 定</el-button>
                    <el-button type="primary" v-if="sure_active == 3" @click="sureWay3">确 定</el-button>
                </section>
            </template>
        </el-dialog>
    </section>
</template>

<script>
export default {
    name: "addDialog",
    props: {
        sure_active: {
            type: Number,
            default: 1
        }
    },
    data() {
        return {
            dialogVisible: false,
            // ----------
            tableData: [],
            pagingObj: { pageNum: 1, pageSize: 10, total: 0 },
            keyword: '',
            tick_arr: []
        }
    },
    methods: {
        // 获取勾选数组
        tickSelect(selection, row) {
            this.tick_arr = selection
            console.log("---tickSelect--1-", selection)
            console.log("---tickSelect--2-", row)
        },
        getRowKeys(row) {
            return row.id
        },
        queryWay() {
            console.log("---搜索---");
            let that = this;
            let params = {
                keyword: that.keyword,
                pageNum: that.pagingObj.pageNum,
                pageSize: that.pagingObj.pageSize
            };
            that.$apihttp({
                url: '/sky/product/list',
                method: 'post',
                data: params
            })
                .then(res => {
                    if (res.code == '200') {
                        that.pagingObj.total = res.data.totalSize;
                        that.tableData = res.data.content;
                        that.dialogVisible = true;// 放这里，使渲染正常
                    }
                })
                .catch(err => {
                    console.log('error', err);
                });
        },
        initForm() {
            this.queryWay();
        },
        cancelWay() {
            this.dialogVisible = false;
        },
        sureWay1() {
            let that = this;
            let params = [];
            for (let index = 0; index < that.tick_arr.length; index++) {
                let item = that.tick_arr[index];
                params.push({
                    productId: item.id,
                    flashPromotionId: that.$route.query.flashPromotionId,
                    flashPromotionSessionId: that.$route.query.flashPromotionSessionId
                })
            }
            that.$apihttp({
                url: '/sky/flashPromotionProductRelation/add',
                method: 'post',
                data: params
            })
                .then(res => {
                    if (res.code == '200') {
                        that.$emit("sureWay");
                        that.dialogVisible = false;
                        that.$message({
                            type: 'success',
                            message: '添加成功!'
                        });
                    }
                })
                .catch(err => {
                    console.log('error', err);
                });
        },
        sureWay2() {
            let that = this;
            let params = [];
            for (let index = 0; index < that.tick_arr.length; index++) {
                let item = that.tick_arr[index];
                params.push({
                    productId: item.id,
                    productName: item.name
                })
            }
            that.$apihttp({
                url: '/sky/homeNewProduct/add',
                method: 'post',
                data: params
            })
                .then(res => {
                    if (res.code == '200') {
                        that.$emit("sureWay");
                        that.dialogVisible = false;
                        that.$message({
                            type: 'success',
                            message: '添加成功!'
                        });
                    }
                })
                .catch(err => {
                    console.log('error', err);
                });
        },
        sureWay3() {
            let that = this;
            let params = [];
            for (let index = 0; index < that.tick_arr.length; index++) {
                let item = that.tick_arr[index];
                params.push({
                    productId: item.id,
                    productName: item.name
                })
            }
            that.$apihttp({
                url: '/sky/homeRecommendProduct/add',
                method: 'post',
                data: params
            })
                .then(res => {
                    if (res.code == '200') {
                        that.$emit("sureWay");
                        that.dialogVisible = false;
                        that.$message({
                            type: 'success',
                            message: '添加成功!'
                        });
                    }
                })
                .catch(err => {
                    console.log('error', err);
                });
        }
    }
}
</script>

<style lang="less" scoped>
#addDialog {

}
</style>
