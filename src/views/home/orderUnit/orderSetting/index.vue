<template>
<el-card id="orderSetting">
    <el-form :model="withForm" :rules="rulesCheck" ref="withForm" label-width="120px">
        <el-form-item label="秒杀订单超过：" prop="flashOrderOvertime">
            <el-input v-model="order_setting.flashOrderOvertime" class="input-width">
            <template slot="append">分</template>
            </el-input>
            <span class="note-margin">未付款，订单自动关闭</span>
        </el-form-item>
        <el-form-item label="正常订单超过：" prop="normalOrderOvertime">
            <el-input v-model="order_setting.normalOrderOvertime" class="input-width">
            <template slot="append">分</template>
            </el-input>
            <span class="note-margin">未付款，订单自动关闭</span>
        </el-form-item>
        <el-form-item label="发货超过：" prop="confirmOvertime">
            <el-input v-model="order_setting.confirmOvertime" class="input-width">
            <template slot="append">天</template>
            </el-input>
            <span class="note-margin">未收货，订单自动完成</span>
        </el-form-item>
        <el-form-item label="订单完成超过：" prop="finishOvertime">
            <el-input v-model="order_setting.finishOvertime" class="input-width">
            <template slot="append">天</template>
            </el-input>
            <span class="note-margin">自动结束交易，不能申请售后</span>
        </el-form-item>
        <el-form-item label="订单完成超过：" prop="commentOvertime">
            <el-input v-model="order_setting.commentOvertime" class="input-width">
            <template slot="append">天</template>
            </el-input>
            <span class="note-margin">自动五星好评</span>
        </el-form-item>
    </el-form>
    <div class="footer">
        <el-button type="primary" @click="submitWay">提 交</el-button>
    </div>
</el-card>
</template>

<script>
export default {
    name: "orderSetting",
    data() {
        return {
            order_setting: {
                id: null,
                flashOrderOvertime: 0,
                normalOrderOvertime: 0,
                confirmOvertime: 0,
                finishOvertime: 0,
                commentOvertime: 0
            },
            withForm: {
                note: null
            },
            rulesCheck: {

            },
        }
    },
    created() {
        this.detailsWay();
    },
    methods: {
        detailsWay() {
            let that = this;
            let params = {

            }
            that.$apihttp({
                url: process.env.core_url + '/sky/orderSetting/details/1',
                method: 'get',
                params: params
            })
                .then(res => {
                    if (res.code == '200') {
                        that.order_setting = res.data;
                    }
                })
                .catch(err => {
                    console.log('error', err);
                });
        },
        submitWay() {
            let that = this;
            let params = that.order_setting;
            that.$apihttp({
                url: process.env.core_url + '/sky/orderSetting/update',
                method: 'post',
                data: params
            })
                .then(res => {
                    if (res.code == '200') {
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
#orderSetting {
    width: 700px;
    margin: 10px auto;
    .input-width {
        width: 50%;
    }

    .note-margin {
        margin-left: 15px;
    }
    .footer {
        width: 100%;
        height: 40px;
        button {
            float: right;
        }
    }
}
</style>


