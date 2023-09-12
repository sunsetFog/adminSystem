<template>
    <section id="closeDialog">
        <el-dialog
            title="关闭订单"
            :visible.sync="dialogVisible"
            width="500px"
            :close-on-click-modal="false"
            >
            <section class="mercury">
                <el-form :model="withForm" :rules="rulesCheck" ref="withForm" label-width="100px">
                    <el-form-item label="操作备注:" prop="note">
                        <el-input type="textarea" v-model="withForm.note" maxlength="100" show-word-limit></el-input>
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
export default {
    name: "closeDialog",
    data() {
        return {
            dialogVisible: false,
            // ----------
            withForm: {
                note: null
            },
            rulesCheck: {

            },
            order_obj: {}
        }
    },
    methods: {
        initForm(order_obj = {}) {
            this.dialogVisible = true;
            this.withForm = {
                note: null
            }
            this.order_obj = order_obj
        },
        cancelWay() {
            this.dialogVisible = false;
        },
        sureWay() {
            let that = this;
            let params = {
                ids: that.order_obj.id,
                note: that.withForm.note
            };
            that.$apihttp({
                url: process.env.core_url + '/sky/order/update/close',
                method: 'get',
                params: params
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
#closeDialog {

}
</style>


