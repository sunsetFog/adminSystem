<template>
    <section id="flashSessionUnit" ref="refUnit">
        <searchDesign ref="refHeader" :sousuo="false" @addWay="addWay"></searchDesign>
        <main>
            <el-table
            :data="tableData"
            border
            style="width: 100%"
            height="100%"
            ref="refTable"
        >
            <el-table-column width="50" type="index" label="序号"></el-table-column>
            <el-table-column prop="name" label="秒杀时间段名称" min-width="120"></el-table-column>
            <el-table-column prop="startTime" label="每日开始时间" min-width="120"></el-table-column>
            <el-table-column prop="endTime" label="每日结束时间" min-width="120"></el-table-column>
            <el-table-column min-width="80">
                <template #header>启用</template>
                <template v-slot="scope">
                    <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" @change="(val)=>{switchChange(val, scope.row)}"></el-switch>
                </template>
            </el-table-column>

            <el-table-column width="100" fixed="right">
                <template #header>操作</template>
                <template v-slot="scope">
                    <el-button link @click="addWay(scope.row)">编辑</el-button>
                    <el-button link @click="deleteWay(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        </main>



        <addDialog ref="add" @sureWay="queryWay"></addDialog>
    </section>
</template>

<script>
import addDialog from './addDialog';
export default {
    name: "flashSessionUnit",
    components: { addDialog },
    data() {
        return {
            queryData: {
                keyword: ''
            },
            // -----------------
            tableData: [],
        }
    },
    created() {
        this.queryWay();
    },
    methods: {
        addWay(row) {
            this.$refs.add.initForm(row);
        },
        queryWay() {
            console.log("---搜索---");
            let that = this;
            let params = {

            };
            that.$apihttp({
                url: '/sky/flashPromotionSession/list',
                method: 'get',
                params: params
            })
                .then(res => {
                    if (res.code == '200') {
                        that.tableData = res.data;
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
                        url: '/sky/flashPromotionSession/update',
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
            that.$confirm('是否要删除该时间段?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    let params = {

                    };
                    that.$apihttp({
                        url: '/sky/flashPromotionSession/delete/' + row.id,
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
#flashSessionUnit {
    height: 100%;
    display: flex;
    flex-direction: column;
    main {
        flex: 1;
    }
}
</style>

