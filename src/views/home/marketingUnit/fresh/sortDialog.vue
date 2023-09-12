<template>
    <section id="sortDialog">
        <el-dialog
            title="设置排序"
            :visible.sync="dialogVisible"
            width="500px"
            :close-on-click-modal="false"
            >
            <section class="mercury">
                <el-form :model="withForm" :rules="rulesCheck" ref="withForm" label-width="100px">
                    <el-form-item label="排序:" prop="sort">
                        <el-input v-model="withForm.sort"></el-input>
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
    name: "sortDialog",
    data() {
        return {
            dialogVisible: false,
            // ----------
            withForm: {
                sort: 0
            },
            rulesCheck: {

            },
            save_row: {}
        }
    },
    methods: {
        initForm(row = {}) {
            this.dialogVisible = true;
            this.withForm = {
                sort: row.sort || 0
            }
            this.save_row = row
        },
        cancelWay() {
            this.dialogVisible = false;
        },
        sureWay() {
            let that = this;
            let params = that.withForm;
            params.id = that.save_row.id
            that.$apihttp({
                url: process.env.core_url + '/sky/homeNewProduct/update',
                method: 'post',
                data: params
            })
                .then(res => {
                    if (res.code == '200') {
                        that.$emit("sureWay");
                        that.dialogVisible = false;
                        that.$message({
                            type: 'success',
                            message: '添加成功!'
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
#sortDialog {

}
</style>


