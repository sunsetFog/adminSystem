<template>
    <section id="costDialog">
        <el-dialog
            title="修改费用信息"
            :visible.sync="dialogVisible"
            width="700px"
            :close-on-click-modal="false"
            >
            <section class="mercury">
                <el-row :gutter="20">
                    <el-col :span="4">商品合计:</el-col>
                    <el-col :span="8">￥{{order_obj.totalAmount}}</el-col>
                    <el-col :span="4">运费:</el-col>
                    <el-col :span="8">
                        <el-input v-model.number="moneyInfo.freightAmount" size="mini"><template slot="prepend">￥</template></el-input>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="4">优惠券:</el-col>
                    <el-col :span="8">-￥{{order_obj.couponAmount}}</el-col>
                    <el-col :span="4">积分抵扣:</el-col>
                    <el-col :span="8">-￥{{order_obj.integrationAmount}}</el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="4">活动优惠:</el-col>
                    <el-col :span="8">-￥{{order_obj.promotionAmount}}</el-col>
                    <el-col :span="4">折扣金额:</el-col>
                    <el-col :span="8">
                        <el-input v-model.number="moneyInfo.discountAmount" size="mini"><template slot="prepend">-￥</template></el-input>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="4">订单总金额:</el-col>
                    <el-col :span="8">￥{{order_obj.totalAmount+moneyInfo.freightAmount}}</el-col>
                    <el-col :span="4">应付款金额:</el-col>
                    <el-col :span="8">￥{{order_obj.payAmount+moneyInfo.freightAmount-moneyInfo.discountAmount}}</el-col>
                </el-row>
            </section>
            <section slot="footer" class="dialog-footer">
                <el-button @click="cancelWay">取 消</el-button>
                <el-button type="primary" @click="sureWay">确 定</el-button>
            </section>
        </el-dialog>
    </section>
</template>

<script>
export default {
    name: "costDialog",
    data() {
        return {
            dialogVisible: false,
            // ----------
            moneyInfo: {
                orderId: null,
                freightAmount: 0,
                discountAmount: 0,
                status: null
            },
            rulesCheck: {

            },
            order_obj: {}
        }
    },
    methods: {
        initForm(order_obj = {}) {
            this.dialogVisible = true;
            this.moneyInfo = {
                orderId: order_obj.id,
                freightAmount: order_obj.freightAmount,
                discountAmount: order_obj.discountAmount,
                status: order_obj.status
            }
            this.order_obj = order_obj
        },
        cancelWay() {
            this.dialogVisible = false;
        },
        sureWay() {
            let that = this;
            let params = that.moneyInfo;
            that.$apihttp({
                url: process.env.core_url + '/sky/order/update/moneyInfo',
                method: 'post',
                data: params
            })
                .then(res => {
                    if (res.code == '200') {
                        that.$emit("sureWay");
                        that.dialogVisible = false;
                        that.$message({
                            type: 'success',
                            message: '修改成功!'
                        });
                    }
                })
                .catch(err => {
                    console.log('error', err);
                });
        }
    }
}
</script>

<style lang="less" scoped>
#costDialog {
    .el-row {
        padding: 5px 0 5px 0;
        box-sizing: border-box;
    }
    .el-col-4 {
        text-align: right;
    }
}
</style>


