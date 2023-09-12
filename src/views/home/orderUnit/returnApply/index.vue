<template>
    <section id="returnApplyUnit" ref="refUnit">
        <searchDesign @queryWay="queryWay" ref="refHeader" :chongzhi="true" :tianjia="false" @resetWay="resetWay">
            <el-form ref="form" :model="queryData" label-width="100px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="服务单号：">
                            <el-input v-model="queryData.id" placeholder="服务单号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="处理状态：">
                            <el-select v-model="queryData.status" placeholder="请选择">
                                <el-option
                                v-for="item in statusOptions"
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
                        <el-form-item label="申请时间：">
                            <el-date-picker
                            v-model="queryData.createTime"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="操作人员：">
                            <el-input v-model="queryData.handleMan" placeholder="操作人员"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="处理时间：">
                            <el-date-picker
                            v-model="queryData.handleTime"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
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
            <el-table-column width="50" type="index" label="序号"></el-table-column>
            <el-table-column prop="id" label="服务单号" min-width="60"></el-table-column>
            <el-table-column prop="createTime" label="申请时间" min-width="120"></el-table-column>
            <el-table-column prop="memberUsername" label="用户账号" min-width="80"></el-table-column>
            <el-table-column label="退款金额" min-width="80">
                <template slot-scope="scope">{{scope.row.productRealPrice*scope.row.productCount}}</template>
            </el-table-column>
            <el-table-column prop="statusLabel" label="申请状态" min-width="80"></el-table-column>
            <el-table-column prop="handleTime" label="处理时间" min-width="120"></el-table-column>

            <el-table-column width="100" fixed="right">
                <template slot="header">操作</template>
                <template slot-scope="scope">
                    <el-button type="text" @click="detailsWay(scope.row)">查看详情</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination :pagingObj="pagingObj" @emitWay="queryWay"></pagination>



    </section>
</template>

<script>
export default {
    name: "returnApplyUnit",
    data() {
        return {
            queryData: {
                id: null,
                status: null,
                createTime: null,
                handleMan: null,
                handleTime: null
            },
            statusOptions: [
                {
                    label: '待处理',
                    value: 0
                },
                {
                    label: '退货中',
                    value: 1
                },
                {
                    label: '已完成',
                    value: 2
                },
                {
                    label: '已拒绝',
                    value: 3
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
        resetWay() {
            this.queryData = {
                id: null,
                status: null,
                createTime: null,
                handleMan: null,
                handleTime: null
            }
        },
        queryWay() {
            console.log("---搜索---");
            let that = this;
            let params = {
                pageNum: that.pagingObj.pageNum,
                pageSize: that.pagingObj.pageSize
            };
            params = { ...that.queryData, ...params };
            that.$apihttp({
                url: process.env.core_url + '/sky/returnApply/list',
                method: 'post',
                data: params
            })
                .then(res => {
                    if (res.code == '200') {
                        that.pagingObj.total = res.data.totalSize;
                        that.tableData = res.data.content;
                        for (let index = 0; index < that.tableData.length; index++) {
                            let item = that.tableData[index];
                            for (let y = 0; y < that.statusOptions.length; y++) {
                                let val = that.statusOptions[y];
                                if(item.status == val.value) {
                                    item.statusLabel = val.label;
                                }
                            }
                        }
                    }
                })
                .catch(err => {
                    console.log('error', err);
                });
        },
        detailsWay(row) {
            this.$router.push({
                path: "/home/orderUnit/returnApply/applyDetail?id=" + row.id
            })
        }
    }
}
</script>

<style lang="less" scoped>
#returnApplyUnit {
    height: 100%;
}
</style>

