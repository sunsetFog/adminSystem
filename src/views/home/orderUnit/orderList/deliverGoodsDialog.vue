<template>
    <section id="deliverGoodsDialog">
        <el-dialog
            title="订单发货"
            :visible.sync="dialogVisible"
            width="800px"
            :close-on-click-modal="false"
            >
            <section class="mercury">
                <el-row :gutter="20">
                    <el-col :span="4">订单编号:</el-col>
                    <el-col :span="8">{{order_obj.orderSn}}</el-col>
                    <el-col :span="4">收货人:</el-col>
                    <el-col :span="8">{{order_obj.receiverName}}</el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="4">手机号码:</el-col>
                    <el-col :span="8">{{order_obj.receiverPhone}}</el-col>
                    <el-col :span="4">邮政编码:</el-col>
                    <el-col :span="8">{{order_obj.receiverPostCode}}</el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="4">收货地址:</el-col>
                    <el-col :span="8">{{order_obj.receiverProvince}}{{order_obj.receiverCity}}{{order_obj.receiverRegion}}{{order_obj.receiverDetailAddress}}</el-col>
                    <el-col :span="4">配送方式:</el-col>
                    <el-col :span="8">
                        <el-select v-model="order_obj.deliveryCompany" placeholder="请选择物流公司">
                            <el-option
                            v-for="item in companyOptions"
                            :key="item"
                            :label="item"
                            :value="item">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="4">物流单号:</el-col>
                    <el-col :span="8">
                        <el-input v-model="order_obj.deliverySn"></el-input>
                    </el-col>
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
    name: "deliverGoodsDialog",
    data() {
        return {
            dialogVisible: false,
            order_obj: {},
            companyOptions: ["顺丰快递", "圆通快递", "中通快递", "韵达快递"]
        }
    },
    methods: {
        initForm(order_obj = {}) {
            this.dialogVisible = true;
            this.order_obj = order_obj
        },
        cancelWay() {
            this.dialogVisible = false;
        },
        sureWay() {
            let that = this;
            let params = {
                orderId: that.order_obj.id,
                deliveryCompany: that.order_obj.deliveryCompany,
                deliverySn: that.order_obj.deliverySn
            };
            that.$apihttp({
                url: process.env.core_url + '/sky/order/update/delivery',
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
#deliverGoodsDialog {
    .el-row {
        padding: 5px 0 5px 0;
        box-sizing: border-box;
    }
    .el-col-4 {
        text-align: right;
    }
}
</style>


