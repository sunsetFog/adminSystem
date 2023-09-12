<template>
    <section id="orderUnit" ref="refUnit">
        <searchDesign @queryWay="queryWay" ref="refHeader" @addWay="addWay" :tianjia="false" :chongzhi="true" @resetWay="resetWay">
            <el-form ref="form" :model="queryData" label-width="100px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="订单编号：">
                            <el-input v-model="queryData.orderSn" placeholder="订单编号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="收货人：">
                            <el-input v-model="queryData.receiverKeyword" placeholder="收货人姓名/手机号码"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="提交时间：">
                            <el-date-picker
                            v-model="queryData.createTime"
                            type="date"
                            placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="订单状态：">
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
                        <el-form-item label="订单分类：">
                            <el-select v-model="queryData.orderType" placeholder="请选择">
                                <el-option
                                v-for="item in orderTypeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="订单来源：">
                            <el-select v-model="queryData.sourceType" placeholder="请选择">
                                <el-option
                                v-for="item in sourceTypeOptions"
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
            <el-table-column prop="orderSn" label="订单编号" min-width="100"></el-table-column>
            <el-table-column prop="createTime" label="提交时间" min-width="100"></el-table-column>
            <el-table-column prop="memberUsername" label="用户账号" min-width="60"></el-table-column>
            <el-table-column prop="totalAmount2" label="订单金额" min-width="60"></el-table-column>
            <el-table-column prop="payType" label="支付方式" min-width="60"></el-table-column>
            <el-table-column prop="sourceType" label="订单来源" min-width="60"></el-table-column>
            <el-table-column prop="status2" label="订单状态" min-width="60"></el-table-column>

            <el-table-column width="150" fixed="right">
                <template slot="header">操作</template>
                <template slot-scope="scope">
                    <el-button type="text" @click="orderDetail(scope.row)">查看订单</el-button>
                    <el-button v-show="scope.row.status == 0" type="text" @click="closeWay(scope.row)">关闭订单</el-button>
                    <el-button v-show="scope.row.status == 1" type="text" @click="goodsWay(scope.row)">订单发货</el-button>
                    <el-button v-show="scope.row.status == 2" type="text" @click="followUpWay(scope.row)">订单跟踪</el-button>
                    <el-button v-show="scope.row.status == 4" type="text" @click="deleteWay(scope.row)">删除订单</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination :pagingObj="pagingObj" @emitWay="queryWay"></pagination>

        <followUpDialog ref="followUp"></followUpDialog>
        <closeDialog ref="close" @sureWay="queryWay"></closeDialog>
        <deliverGoodsDialog ref="deliverGoods" @sureWay="queryWay"></deliverGoodsDialog>

        <el-dialog
            :title="dialog_title"
            :visible.sync="dialogVisible"
            width="500px"
            :close-on-click-modal="false"
            >
            <section class="mercury">
                <el-form :model="addAndEditForm" :rules="rulesCheck" ref="addAndEditForm" label-width="100px">
                    <el-form-item label="类型名称:" prop="name">
                        <el-input v-model="addAndEditForm.name" placeholder="请输入类型名称"></el-input>
                    </el-form-item>
                </el-form>
            </section>
            <section slot="footer" class="dialog-footer">
                <el-button @click="cancelWay">取 消</el-button>
                <el-button type="primary" @click="sureWay">确 定</el-button>
            </section>
        </el-dialog>

    </section>
</template>

<script>
import addEdit from "./addEdit"
import followUpDialog from "./orderDetail/followUpDialog.vue";
import closeDialog from "./orderDetail/closeDialog.vue";
import deliverGoodsDialog from "./deliverGoodsDialog.vue";
export default {
    name: "orderUnit",
    mixins: [addEdit],
    components: { followUpDialog, closeDialog, deliverGoodsDialog },
    data() {
        return {
            queryData: {
                orderSn: '',
                receiverKeyword: '',
                createTime: '',
                status: '',
                orderType: '',
                sourceType: ''
            },
            statusOptions: [
                {
                    label: '待付款',
                    value: 0
                },
                {
                    label: '待发货',
                    value: 1
                },
                {
                    label: '已发货',
                    value: 2
                },
                {
                    label: '已完成',
                    value: 3
                },
                {
                    label: '已关闭',
                    value: 4
                }
            ],
            orderTypeOptions: [
                {
                    label: '正常订单',
                    value: 0
                },
                {
                    label: '秒杀订单',
                    value: 1
                }
            ],
            sourceTypeOptions: [
                {
                    label: 'PC订单',
                    value: 0
                },
                {
                    label: 'APP订单',
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
        // 订单发货
        goodsWay(row) {
            this.$refs.deliverGoods.initForm(row);
        },
        // 关闭订单
        closeWay(row) {
            this.$refs.close.initForm(row);
        },
        // 订单跟踪
        followUpWay() {
            this.$refs.followUp.initForm();
        },
        resetWay() {
            this.queryData.orderSn = ''
            this.queryData.receiverKeyword = ''
            this.queryData.createTime = ''
            this.queryData.status = ''
            this.queryData.orderType = ''
            this.queryData.sourceType = ''
        },
        queryWay() {
            console.log("---搜索---");
            let that = this;
            let params = {
                orderSn: that.queryData.orderSn,
                receiverKeyword: that.queryData.receiverKeyword,
                createTime: that.queryData.createTime,
                status: that.queryData.status,
                orderType: that.queryData.orderType,
                sourceType: that.queryData.sourceType,
                pageNum: that.pagingObj.pageNum,
                pageSize: that.pagingObj.pageSize
            };
            that.$apihttp({
                url: process.env.core_url + '/sky/order/list',
                method: 'post',
                data: params
            })
                .then(res => {
                    if (res.code == '200') {
                        that.pagingObj.total = res.data.totalSize;
                        that.tableData = res.data.content;
                        for (let index = 0; index < that.tableData.length; index++) {
                            let item = that.tableData[index];
                            item.totalAmount2 = '￥' + item.totalAmount
                            if(item.payType == 0) {
                                item.payType = '未支付'
                            } else if(item.payType == 1) {
                                item.payType = '支付宝'
                            } else if(item.payType == 2) {
                                item.payType = '微信'
                            }
                            if(item.sourceType == 0) {
                                item.sourceType = 'PC订单'
                            } else if(item.sourceType == 1) {
                                item.sourceType = 'app订单'
                            }
                            if(item.status == 0) {
                                item.status2 = '待付款'
                            } else if(item.status == 1) {
                                item.status2 = '待发货'
                            } else if(item.status == 2) {
                                item.status2 = '已发货'
                            } else if(item.status == 3) {
                                item.status2 = '已完成'
                            } else if(item.status == 4) {
                                item.status2 = '已关闭'
                            } else if(item.status == 5) {
                                item.status2 = '无效订单'
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
            that.$confirm('是否要进行该删除操作?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    let params = {
                        ids: row.id,
                        deleteStatus: 1
                    };
                    that.$apihttp({
                        url: process.env.core_url + '/sky/order/deleteStatus',
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
        },
        orderDetail(row) {
            this.$router.push({
                path: "/home/orderUnit/orderList/orderDetail/index?id=" + row.id
            })
        }
    }
}
</script>

<style lang="less" scoped>
#orderUnit {
    height: 100%;
}
</style>

