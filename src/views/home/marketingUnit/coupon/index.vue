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
            <el-table-column prop="name" label="优惠劵名称" min-width="140"></el-table-column>
            <el-table-column label="优惠券类型" min-width="100">
                <template v-slot="scope">{{scope.row.typeLabel}}</template>
            </el-table-column>
            <el-table-column label="可使用商品" min-width="100">
                <template v-slot="scope">{{formatUseType(scope.row.useType)}}</template>
            </el-table-column>
            <el-table-column label="使用门槛" min-width="120">
                <template v-slot="scope">满{{scope.row.minPoint}}元可用</template>
            </el-table-column>
            <el-table-column label="面值" min-width="100">
                <template v-slot="scope">{{scope.row.amount}}元</template>
            </el-table-column>
            <el-table-column label="适用平台" min-width="100">
                <template v-slot="scope">{{formatPlatform(scope.row.platform)}}</template>
            </el-table-column>
            <el-table-column label="有效期" min-width="170">
                <template v-slot="scope">{{scope.row.startTime}}至{{scope.row.endTime}}</template>
            </el-table-column>
            <el-table-column label="状态" min-width="100">
                <template v-slot="scope">{{formatStatus(scope.row.endTime)}}</template>
            </el-table-column>

            <el-table-column width="150" fixed="right">
                <template #header>操作</template>
                <template v-slot="scope">
                    <el-button link @click="detailsWay(scope.row)">领取详情</el-button>
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
            // -----------------
            pagingObj: { pageNum: 1, pageSize: 10, total: 0 },
        }
    },
    created() {
        this.queryWay();
    },
    methods: {
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
        },
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
                url: '/sky/coupon/list',
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
                        url: '/sky/coupon/delete/' + row.id,
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
    display: flex;
    flex-direction: column;
    main {
        flex: 1;
    }
}
</style>

