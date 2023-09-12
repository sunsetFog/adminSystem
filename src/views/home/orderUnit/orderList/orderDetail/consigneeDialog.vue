<template>
    <section id="consignee">
        <el-dialog
            title="修改收货人信息"
            :visible.sync="dialogVisible"
            width="800px"
            :close-on-click-modal="false"
            >
            <section class="mercury">
                <el-form :model="withForm" :rules="rulesCheck" ref="withForm" label-width="100px">
                    <el-form-item label="收货人姓名:" prop="receiverName">
                        <el-input v-model="withForm.receiverName"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码:" prop="receiverPhone">
                        <el-input v-model="withForm.receiverPhone"></el-input>
                    </el-form-item>
                    <el-form-item label="邮政编码:" prop="receiverPostCode">
                        <el-input v-model="withForm.receiverPostCode"></el-input>
                    </el-form-item>
                    <el-form-item label="所在区域：">
                        <v-distpicker :province="withForm.receiverProvince"
                                        :city="withForm.receiverCity"
                                        :area="withForm.receiverRegion"
                                        @selected="onSelectRegion">
                        </v-distpicker>
                    </el-form-item>
                    <el-form-item label="详细地址:" prop="receiverDetailAddress">
                        <el-input type="textarea" v-model="withForm.receiverDetailAddress" maxlength="100" show-word-limit></el-input>
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
import VDistpicker from 'v-distpicker';
export default {
    name: "consignee",
    components: { VDistpicker },
    data() {
        return {
            dialogVisible: false,
            // ----------
            withForm: {
                orderId: null,
                receiverName: null,
                receiverPhone: null,
                receiverPostCode: null,
                receiverDetailAddress: null,

                receiverProvince: null,
                receiverCity: null,
                receiverRegion: null,

                status: null
            },
            rulesCheck: {

            }
        }
    },
    methods: {
        onSelectRegion(data){
            console.log("--onSelectRegion--", data)
            this.withForm.receiverProvince=data.province.value;
            this.withForm.receiverCity=data.city.value;
            this.withForm.receiverRegion=data.area.value;
        },
        initForm(order_obj = {}) {
            this.dialogVisible = true;
            this.withForm = {
                orderId: order_obj.id,
                receiverName: order_obj.receiverName,
                receiverPhone: order_obj.receiverPhone,
                receiverPostCode: order_obj.receiverPostCode,
                receiverDetailAddress: order_obj.receiverDetailAddress,
                receiverProvince: order_obj.receiverProvince,
                receiverCity: order_obj.receiverCity,
                receiverRegion: order_obj.receiverRegion,
                status:  order_obj.status
            }
        },
        cancelWay() {
            this.dialogVisible = false;
        },
        sureWay() {
            let that = this;
            let params = that.withForm;
            that.$apihttp({
                url: process.env.core_url + '/sky/order/update/receiverInfo',
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
#consignee {

}
</style>


