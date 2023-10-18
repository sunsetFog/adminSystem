<template>
    <section id="returnReason" ref="refUnit">
        <searchDesign @queryWay="queryWay" ref="refHeader" @addWay="addWay" :chongzhi="true" @resetWay="resetWay">
            <el-form ref="form" :model="queryData" label-width="100px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="活动名称：">
                            <el-input v-model="queryData.keyword" placeholder=""></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #apple>
                <el-button type="primary" @click="flashSession">秒杀时间段列表</el-button>
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
            <el-table-column prop="title" label="活动标题" min-width="120"></el-table-column>
            <el-table-column label="活动状态" min-width="100">
                <template v-slot="scope">{{formatActiveStatus(scope.row)}}</template>
            </el-table-column>
            <el-table-column prop="startDate" label="开始时间" min-width="120"></el-table-column>
            <el-table-column prop="endDate" label="结束时间" min-width="120"></el-table-column>
            <el-table-column min-width="80">
                <template #header>上线/下线</template>
                <template v-slot="scope">
                    <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" @change="(val)=>{switchChange(val, scope.row)}"></el-switch>
                </template>
            </el-table-column>

            <el-table-column width="180" fixed="right">
                <template #header>操作</template>
                <template v-slot="scope">
                    <el-button link @click="goodsWay(scope.row)">设置商品</el-button>
                    <el-button link @click="addWay(scope.row)">编辑</el-button>
                    <el-button link @click="deleteWay(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        </main>



        <pagination :pagingObj="pagingObj" @emitWay="queryWay"></pagination>

        <addDialog ref="add" @sureWay="queryWay"></addDialog>

    </section>
</template>

<script>
import addDialog from "./addDialog.vue"
export default {
    name: "returnReason",
    components: { addDialog },
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
        formatActiveStatus(row) {
            let nowTime = new Date().getTime();
            if (nowTime >= row.startDate && nowTime <= row.endDate) {
                return '活动进行中';
            } else if (nowTime > row.endDate) {
                return '活动已结束';
            } else {
                return '活动未开始';
            }
        },
        flashSession() {
            this.$router.push({
                path: '/home/marketingUnit/flash/flashSession/index'
            })
        },
        goodsWay(row) {
            this.$router.push({
                path: '/home/marketingUnit/flash/flashSession?flashPromotionId=' + row.id
            })
        },
        resetWay() {
            this.queryData = {
                keyword: ''
            }
        },
        addWay(row) {
            this.$refs.add.initForm(row);
        },
        queryWay() {
            console.log("---搜索---");
            let that = this;
            let params = {
                ...that.queryData,
                pageNum: that.pagingObj.pageNum,
                pageSize: that.pagingObj.pageSize
            };
            that.$apihttp({
                url: '/sky/flashPromotion/list',
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
                        url: '/sky/flashPromotion/update',
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
            that.$confirm('是否要删除该类型?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    let params = {

                    };
                    that.$apihttp({
                        url: '/sky/flashPromotion/delete/' + row.id,
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
#returnReason {
    height: 100%;
    display: flex;
    flex-direction: column;
    main {
        flex: 1;
    }
}
</style>

