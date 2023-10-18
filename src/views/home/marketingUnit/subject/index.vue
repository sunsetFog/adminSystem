<template>
    <section id="freshUnit" ref="refUnit">
        <searchDesign @queryWay="queryWay" ref="refHeader" :tianjia="false" :chongzhi="true" @resetWay="resetWay">
            <el-form ref="form" :model="queryData" label-width="100px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="专题名称:">
                            <el-input v-model="queryData.subjectName" placeholder=""></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="推荐状态:">
                            <el-select v-model="queryData.recommendStatus" placeholder="" clearable>
                                <el-option v-for="item in recommendOptions"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #apple>
                <el-button type="primary" @click="addWay">选择品牌</el-button>
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
            <el-table-column prop="id" label="编号" min-width="80"></el-table-column>
            <el-table-column prop="subjectName" label="专题名称" min-width="120"></el-table-column>
            <el-table-column min-width="80">
                <template #header>是否推荐</template>
                <template v-slot="scope">
                    <el-switch v-model="scope.row.recommendStatus" :active-value="1" :inactive-value="0" @change="(val)=>{switchChange(val, scope.row)}"></el-switch>
                </template>
            </el-table-column>
            <el-table-column prop="sort" label="排序" min-width="60"></el-table-column>
            <el-table-column label="状态" min-width="100">
                <template v-slot="scope">{{formatRecommendStatus(scope.row.recommendStatus)}}</template>
            </el-table-column>

            <el-table-column width="150" fixed="right">
                <template #header>操作</template>
                <template v-slot="scope">
                    <el-button link @click="sortWay(scope.row)">设置排序</el-button>
                    <el-button link @click="deleteWay(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        </main>

        <pagination :pagingObj="pagingObj" @emitWay="queryWay"></pagination>

        <addDialog ref="add" @sureWay="queryWay"></addDialog>
        <sortDialog ref="sort" @sureWay="queryWay"></sortDialog>

    </section>
</template>

<script>
import addDialog from "./addDialog.vue"
import sortDialog from "./sortDialog.vue"
export default {
    name: "freshUnit",
    components: { addDialog, sortDialog },
    data() {
        return {
            queryData: {
                subjectName: '',
                recommendStatus: ''
            },
            recommendOptions: [
                {
                    label: '未推荐',
                    value: 0
                },
                {
                    label: '推荐中',
                    value: 1
                }
            ],
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
        formatRecommendStatus(status){
            if(status===1){
                return '推荐中';
            }else{
                return '未推荐';
            }
        },
        sortWay(row) {
            this.$refs.sort.initForm(row);
        },
        resetWay() {
            this.queryData = {
                subjectName: '',
                recommendStatus: ''
            }
        },
        addWay() {
            this.$refs.add.initForm();
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
                url: '/sky/homeRecommendSubject/list',
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
            that.$confirm('是否要修改推荐状态?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    let params = {
                        id: row.id,
                        recommendStatus: value
                    };
                    that.$apihttp({
                        url: '/sky/homeRecommendSubject/update',
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
            that.$confirm('是否要删除该推荐?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    let params = {
                        ids: row.id
                    };
                    that.$apihttp({
                        url: '/sky/homeRecommendSubject/delete',
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
#freshUnit {
    height: 100%;
    display: flex;
    flex-direction: column;
    main {
        flex: 1;
    }
}
</style>

