<template>
    <section id="returnReason" ref="refUnit">
        <searchDesign @queryWay="queryWay" ref="refHeader" @addWay="addWay" :chongzhi="true" @resetWay="resetWay">
            <el-form ref="form" :model="queryData" label-width="100px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="广告名称：">
                            <el-input v-model="queryData.name" placeholder=""></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="广告位置：">
                            <el-select v-model="queryData.type" placeholder="" clearable>
                                <el-option v-for="item in typeOptions"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="到期时间：">
                            <el-date-picker
                            v-model="queryData.endTime"
                            value-format="yyyy-MM-dd"
                            type="date"
                            placeholder="">
                            </el-date-picker>
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
            <el-table-column prop="id" label="编号" min-width="80"></el-table-column>
            <el-table-column prop="name" label="广告名称" min-width="120"></el-table-column>
            <el-table-column label="广告位置" min-width="120">
                <template v-slot="scope">{{formatType(scope.row.type)}}</template>
            </el-table-column>
            <el-table-column label="广告图片" min-width="120">
                <template v-slot="scope"><img style="height: 50px" :src="scope.row.pic"></template>
            </el-table-column>
            <el-table-column label="时间" min-width="220">
                <template v-slot="scope">
                    <p>开始时间：{{scope.row.startTime}}</p>
                    <p>到期时间：{{scope.row.endTime}}</p>
                </template>
            </el-table-column>
            <el-table-column min-width="80">
                <template #header>上线/下线</template>
                <template v-slot="scope">
                    <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" @change="(val)=>{switchChange(val, scope.row)}"></el-switch>
                </template>
            </el-table-column>
            <el-table-column prop="clickCount" label="点击次数" min-width="80"></el-table-column>
            <el-table-column prop="orderCount" label="生成订单" min-width="80"></el-table-column>

            <el-table-column width="100" fixed="right">
                <template #header>操作</template>
                <template v-slot="scope">
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
                name: '',
                type: '',
                endTime: ''
            },
            typeOptions: [
                {
                    label: 'PC首页轮播',
                    value: 0
                },
                {
                    label: 'APP首页轮播',
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
        formatType(type){
            if(type===1){
                return 'APP首页轮播';
            }else{
                return 'PC首页轮播';
            }
        },
        resetWay() {
            this.queryData = {
                name: '',
                type: '',
                endTime: ''
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
                url: '/sky/homeAdvertise/list',
                method: 'get',
                params: params
            })
                .then(res => {
                    if (res.code == '200') {
                        that.pagingObj.total = res.data.totalSize;
                        that.tableData = res.data.content;
                        for (let index = 0; index < that.tableData.length; index++) {
                            let item = that.tableData[index];
                            item.download_url = item.pic;
                            item.pic = '/sky' + item.pic;
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
                        url: '/sky/homeAdvertise/update',
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
                        url: '/sky/homeAdvertise/delete',
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

