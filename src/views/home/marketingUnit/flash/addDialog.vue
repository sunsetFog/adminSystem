<template>
    <section id="addDialog">
        <el-dialog
            :title="dialog_title"
            v-model="dialogVisible"
            width="500px"
            :close-on-click-modal="false"
            >
            <section class="mercury">
                <el-form :model="withForm" :rules="rulesCheck" ref="withForm" label-width="100px">
                    <el-form-item label="活动标题:" prop="title">
                        <el-input v-model="withForm.title"></el-input>
                    </el-form-item>
                    <el-form-item label="开始时间:" prop="startDate">
                        <el-date-picker
                        v-model="withForm.startDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间:" prop="endDate">
                        <el-date-picker
                        v-model="withForm.endDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="上线/下线:" prop="status">
                        <el-switch v-model="withForm.status" :active-value="1" :inactive-value="0"></el-switch>
                    </el-form-item>
                </el-form>
            </section>
            <template #footer>
                <section class="dialog-footer">
                    <el-button @click="cancelWay">取 消</el-button>
                    <el-button type="primary" @click="sureWay">确 定</el-button>
                </section>
            </template>
        </el-dialog>
    </section>
</template>

<script>
export default {
    name: "addDialog",
    data() {
        return {
            dialog_title: '添加活动',
            dialogVisible: false,
            // ----------
            withForm: {
                title: null,
                startDate: '',
                endDate: '',
                status: 1
            },
            rulesCheck: {

            },
            save_row: {}
        }
    },
    methods: {
        initForm(row = {}) {
            this.dialog_title = JSON.stringify(row) == "{}" ? "添加活动" : "编辑活动";
            this.dialogVisible = true;
            this.withForm = {
                title: row.title || null,
                startDate: row.startDate || '',
                endDate: row.endDate || '',
                status: JSON.stringify(row) == "{}" ? 1 : row.status
            }
            this.save_row = row
        },
        cancelWay() {
            this.dialogVisible = false;
        },
        sureWay() {
            if (this.dialog_title == '添加活动') {
                this.addSure();
            } else if (this.dialog_title == '编辑活动') {
                this.editSure();
            }
        },
        addSure() {
            let that = this;
            let params = that.withForm;
            that.$apihttp({
                url: '/sky/flashPromotion/add',
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
                url: '/sky/flashPromotion/update',
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
