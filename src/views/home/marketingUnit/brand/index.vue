<template>
    <section id="brandUnit" ref="refUnit">
        <searchDesign @queryWay="queryWay" ref="refHeader" :tianjia="false" :chongzhi="true" @resetWay="resetWay">
            <el-form ref="form" :model="queryData" label-width="100px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="品牌名称：">
                            <el-input v-model="queryData.brandName" placeholder=""></el-input>
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
            <el-button type="primary" slot="apple" @click="addWay">选择品牌</el-button>
        </searchDesign>
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
            <el-table-column prop="id" label="编号" min-width="80"></el-table-column>
            <el-table-column prop="brandName" label="品牌名称" min-width="120"></el-table-column>
            <el-table-column min-width="80">
                <template slot="header">是否推荐</template>
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.recommendStatus" :active-value="1" :inactive-value="0" @change="(val)=>{switchChange(val, scope.row)}"></el-switch>
                </template>
            </el-table-column>
            <el-table-column prop="sort" label="排序" min-width="60"></el-table-column>
            <el-table-column label="状态" min-width="100">
                <template slot-scope="scope">{{scope.row.recommendStatus | formatRecommendStatus}}</template>
            </el-table-column>

            <el-table-column width="150" fixed="right">
                <template slot="header">操作</template>
                <template slot-scope="scope">
                    <el-button type="text" @click="sortWay(scope.row)">设置排序</el-button>
                    <el-button type="text" @click="deleteWay(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination :pagingObj="pagingObj" @emitWay="queryWay"></pagination>

        <addDialog ref="add" @sureWay="queryWay"></addDialog>
        <sortDialog ref="sort" @sureWay="queryWay"></sortDialog>

    </section>
</template>

<script>
import addDialog from "./addDialog.vue"
import sortDialog from "./sortDialog.vue"
export default {
    name: "brandUnit",
    components: { addDialog, sortDialog },
    data() {
        return {
            queryData: {
                brandName: '',
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
            tableHeight: 0,
            // -----------------
            pagingObj: { pageNum: 1, pageSize: 10, total: 0 },
        }
    },
    filters: {
        formatRecommendStatus(status){
            if(status===1){
                return '推荐中';
            }else{
                return '未推荐';
            }
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
        sortWay(row) {
            this.$refs.sort.initForm(row);
        },
        resetWay() {
            this.queryData = {
                brandName: '',
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
                url: process.env.core_url + '/sky/homeBrand/list',
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
                        url: process.env.core_url + '/sky/homeBrand/update',
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
                        ids: row.id
                    };
                    that.$apihttp({
                        url: process.env.core_url + '/sky/homeBrand/delete',
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
}
</style>

