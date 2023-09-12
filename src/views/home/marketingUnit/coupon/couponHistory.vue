<template>
    <section id="couponHistoryUnit">
        <div class="title-box">优惠券信息</div>
        <el-row :gutter="20">
            <el-col :span="4">名称:</el-col>
            <el-col :span="8">{{coupon_row.name}}</el-col>
            <el-col :span="4">优惠券类型:</el-col>
            <el-col :span="8">{{coupon_row.typeLabel}}</el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="4">可使用商品:</el-col>
            <el-col :span="8">{{coupon_row.useType | formatUseType}}</el-col>
            <el-col :span="4">使用门槛:</el-col>
            <el-col :span="8">满{{coupon_row.minPoint}}元可用</el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="4">面值:</el-col>
            <el-col :span="8">{{coupon_row.amount}}元</el-col>
            <el-col :span="4">状态:</el-col>
            <el-col :span="8">{{coupon_row.endTime | formatStatus}}</el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="4">有效期:</el-col>
            <el-col :span="8">{{coupon_row.startTime}}至{{coupon_row.endTime}}</el-col>
            <el-col :span="4">总发行量:</el-col>
            <el-col :span="8">{{coupon_row.publishCount}}</el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="4">已领取:</el-col>
            <el-col :span="8">{{coupon_row.receiveCount}}</el-col>
            <el-col :span="4">待领取:</el-col>
            <el-col :span="8">{{coupon_row.publishCount-coupon_row.receiveCount}}</el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="4">已使用:</el-col>
            <el-col :span="8">{{coupon_row.useCount}}</el-col>
            <el-col :span="4">未使用:</el-col>
            <el-col :span="8">{{coupon_row.publishCount-coupon_row.useCount}}</el-col>
        </el-row>
        <div class="title-box">领取信息</div>
        <searchDesign @queryWay="queryWay" ref="refHeader" :tianjia="false" :chongzhi="true" @resetWay="resetWay">
            <el-form ref="form" :model="queryData" label-width="100px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="使用状态:">
                            <el-select v-model="queryData.useStatus" placeholder="" clearable>
                                <el-option v-for="item in useTypeOptions"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="订单编号:">
                            <el-input v-model="queryData.orderSn" placeholder=""></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </searchDesign>

        <el-table
            :data="tableData"
            border
            style="width: 100%"
            ref="refTable"
        >
            <el-table-column prop="couponCode" label="优惠码" min-width="120"></el-table-column>
            <el-table-column prop="memberNickname" label="领取会员" min-width="100"></el-table-column>
            <el-table-column label="领取方式" min-width="100">
                <template slot-scope="scope">{{scope.row.getType | formatGetType}}</template>
            </el-table-column>
            <el-table-column prop="createTime" label="领取时间" min-width="120"></el-table-column>
            <el-table-column label="当前状态" min-width="140">
                <template slot-scope="scope">{{scope.row.useStatus | formatCouponHistoryUseType}}</template>
            </el-table-column>
            <el-table-column prop="useTime" label="使用时间" min-width="120"></el-table-column>
            <el-table-column label="订单编号" min-width="140">
                <template slot-scope="scope">{{scope.row.orderSn===null?'N/A':scope.row.orderSn}}</template>
            </el-table-column>
        </el-table>

        <pagination :pagingObj="pagingObj" @emitWay="queryWay"></pagination>
    </section>
</template>

<script>
export default {
    name: "couponHistoryUnit",
    data() {
        return {
            queryData: {
                useStatus: '',
                orderSn: ''
            },
            // -----------------
            tableData: [],
            tableHeight: 0,
            // -----------------
            pagingObj: { pageNum: 1, pageSize: 10, total: 0 },
            coupon_row: {},
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
            useTypeOptions: [
                {
                    label: "未使用",
                    value: 0
                },
                {
                    label: "已使用",
                    value: 1
                },
                {
                    label: "已过期",
                    value: 2
                }
            ]
        }
    },
    filters: {
        formatUseType(useType) {
            if (useType === 0) {
                return '全场通用';
            } else if (useType === 1) {
                return '指定分类';
            } else {
                return '指定商品';
            }
        },
        formatStatus(endTime) {
            let now = new Date().getTime();
            if (endTime > now) {
                return '未过期'
            } else {
                return '已过期';
            }
        },
        formatGetType(type) {
            if(type===1){
                return '主动获取';
            }else{
                return '后台赠送';
            }
        },
        formatCouponHistoryUseType(useType) {
            if (useType === 0) {
                return '未使用';
            } else if (useType === 1) {
                return '已使用';
            } else {
                return '已过期';
            }
        },
    },
    created() {
        this.couponRow();
        this.queryWay();
    },
    methods: {
        resetWay() {
            this.queryData = {
                useStatus: '',
                orderSn: ''
            }
        },
        couponRow() {
            let that = this;
            let params = {
                id: that.$route.query.id
            };
            that.$apihttp({
                url: process.env.core_url + '/sky/coupon/row',
                method: 'get',
                params: params
            })
                .then(res => {
                    if (res.code == '200') {
                       that.coupon_row = res.data;
                       for (let index = 0; index < that.typeOptions.length; index++) {
                            let item = that.typeOptions[index];
                            if(that.coupon_row.type == item.value) {
                                that.coupon_row.typeLabel = item.label;
                            }
                       }
                    }
                })
                .catch(err => {
                    console.log('error', err);
                });
        },
        queryWay() {
            console.log("---搜索---");
            let that = this;
            let params = {
                couponId: that.$route.query.id,
                useStatus: that.queryData.useStatus,
                orderSn: that.queryData.orderSn,
                pageNum: that.pagingObj.pageNum,
                pageSize: that.pagingObj.pageSize
            };
            that.$apihttp({
                url: process.env.core_url + '/sky/couponHistory/list',
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
    }
}
</script>

<style lang="less" scoped>
#couponHistoryUnit {
    .title-box {
        width: 100%;
        height: 40px;
        line-height: 40px;
        font-size: 15px;
        font-weight: 600;
    }
    .el-row {
        padding: 5px 0 5px 0;
        box-sizing: border-box;
    }
    .el-col-4 {
        text-align: right;
    }
}
</style>


