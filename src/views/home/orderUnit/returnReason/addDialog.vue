<template>
    <section id="addDialog">
        <el-dialog
            :title="dialog_title"
            :visible.sync="dialogVisible"
            width="500px"
            :close-on-click-modal="false"
            >
            <section class="mercury">
                <el-form :model="withForm" :rules="rulesCheck" ref="withForm" label-width="100px">
                    <el-form-item label="原因类型:" prop="name">
                        <el-input v-model="withForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="排序:" prop="sort">
                        <el-input v-model="withForm.sort"></el-input>
                    </el-form-item>
                    <el-form-item label="是否启用:" prop="status">
                        <el-switch v-model="withForm.status" :active-value="1" :inactive-value="0"></el-switch>
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
    name: "addDialog",
    data() {
        return {
            dialog_title: '添加退货原因',
            dialogVisible: false,
            // ----------
            withForm: {
                name: null,
                sort: 0,
                status: 1
            },
            rulesCheck: {

            },
            save_row: {}
        }
    },
    methods: {
        initForm(row = {}) {
            this.dialog_title = JSON.stringify(row) == "{}" ? "添加退货原因" : "编辑退货原因";
            this.dialogVisible = true;
            this.withForm = {
                name: row.name || null,
                sort: row.sort || 0,
                status: JSON.stringify(row) == "{}" ? 1 : row.status
            }
            this.save_row = row
        },
        cancelWay() {
            this.dialogVisible = false;
        },
        sureWay() {
            if (this.dialog_title == '添加退货原因') {
                this.addSure();
            } else if (this.dialog_title == '编辑退货原因') {
                this.editSure();
            }
        },
        addSure() {
            let that = this;
            let params = that.withForm;
            that.$apihttp({
                url: process.env.core_url + '/sky/returnReason/add',
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
        },
        editSure() {
            let that = this;
            let params = {
                id: that.save_row.id,
                ...that.withForm
            }
            that.$apihttp({
                url: process.env.core_url + '/sky/returnReason/update',
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
#addDialog {

}
</style>
