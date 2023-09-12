<template>
    <section id="couponUnit" ref="refUnit">
        <searchDesign @queryWay="queryWay" ref="refHeader" @addWay="addWay" :chongzhi="true" @resetWay="resetWay">
            <el-form ref="form" :model="queryData" label-width="100px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="优惠券名称：">
                            <el-input v-model="queryData.name" placeholder=""></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="优惠券类型：">
                            <el-select v-model="queryData.type" placeholder="请选择">
                                <el-option
                                v-for="item in typeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
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
            <el-table-column prop="id" label="编号" min-width="80"></el-table-column>
            <el-table-column prop="name" label="优惠劵名称" min-width="140"></el-table-column>
            <el-table-column label="优惠券类型" min-width="100">
                <template slot-scope="scope">{{scope.row.typeLabel}}</template>
            </el-table-column>
            <el-table-column label="可使用商品" min-width="100">
                <template slot-scope="scope">{{scope.row.useType | formatUseType}}</template>
            </el-table-column>
            <el-table-column label="使用门槛" min-width="120">
                <template slot-scope="scope">满{{scope.row.minPoint}}元可用</template>
            </el-table-column>
            <el-table-column label="面值" min-width="100">
                <template slot-scope="scope">{{scope.row.amount}}元</template>
            </el-table-column>
            <el-table-column label="适用平台" min-width="100">
                <template slot-scope="scope">{{scope.row.platform | formatPlatform}}</template>
            </el-table-column>
            <el-table-column label="有效期" min-width="170">
                <template slot-scope="scope">{{scope.row.startTime}}至{{scope.row.endTime}}</template>
            </el-table-column>
            <el-table-column label="状态" min-width="100">
                <template slot-scope="scope">{{scope.row.endTime | formatStatus}}</template>
            </el-table-column>

            <el-table-column width="150" fixed="right">
                <template slot="header">操作</template>
                <template slot-scope="scope">
                    <el-button type="text" @click="detailsWay(scope.row)">领取详情</el-button>
                    <el-button type="text" @click="addWay(scope.row)">编辑</el-button>
                    <el-button type="text" @click="deleteWay(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination :pagingObj="pagingObj" @emitWay="queryWay"></pagination>

        <addDialog ref="add" @sureWay="queryWay"></addDialog>

    </section>
</template>

<script>
import addDialog from "./addDialog.vue"
export default {
    name: "couponUnit",
    components: { addDialog },
    data() {
        return {
            queryData: {
                name: '',
                type: ''
            },
            typeOptions: [
                {
                    label: '全场赠券',
                    value: 0
                },
                {
                    label: '会员赠券',
                    value: 1
                },
                {
                    label: '购物赠券',
                    value: 2
                },
                {
                    label: '注册赠券',
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
        formatUseType(useType){
            if(useType===0){
                return '全场通用';
            }else if(useType===1){
                return '指定分类';
            }else{
                return '指定商品';
            }
        },
        formatPlatform(platform){
            if(platform===1){
                return '移动平台';
            }else if(platform===2){
                return 'PC平台';
            }else{
                return '全平台';
            }
        },
        formatStatus(endTime){
            let now = new Date().getTime();
            let endDate = new Date(endTime);
            if(endDate>now){
                return '未过期'
            }else{
                return '已过期';
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
        detailsWay(row) {
            this.$router.push({
                path: '/home/marketingUnit/coupon/couponHistory?id=' + row.id
            })
        },
        resetWay() {
            this.queryData = {
                name: '',
                type: ''
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
                url: process.env.core_url + '/sky/coupon/list',
                method: 'get',
                params: params
            })
                .then(res => {
                    if (res.code == '200') {
                        that.pagingObj.total = res.data.totalSize;
                        that.tableData = res.data.content;
                        for (let index = 0; index < that.tableData.length; index++) {
                            let item = that.tableData[index];
                            for(let y = 0; y < that.typeOptions.length; y++) {
                                let val = that.typeOptions[y];
                                if(item.type == val.value) {
                                    item.typeLabel = val.label;
                                }
                            }
                        }
                    }
                })
                .catch(err => {
                    console.log('error', err);
                });
        },
        deleteWay(row) {
            let that = this;
            that.$confirm('是否进行删除操作?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    let params = {

                    };
                    that.$apihttp({
                        url: process.env.core_url + '/sky/coupon/delete/' + row.id,
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
#couponUnit {
    height: 100%;
}
</style>

