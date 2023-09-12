<template>
    <section id="addDialog">
        <el-dialog
            :title="dialog_title"
            :visible.sync="dialogVisible"
            width="600px"
            :close-on-click-modal="false"
            >
            <section class="mercury">
                <el-form :model="withForm" :rules="rulesCheck" ref="withForm" label-width="100px">
                    <el-form-item label="广告名称:" prop="name">
                        <el-input v-model="withForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="广告位置:">
                        <el-select v-model="withForm.type">
                        <el-option
                            v-for="type in typeOptions"
                            :key="type.value"
                            :label="type.label"
                            :value="type.value">
                        </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="开始时间:" prop="startTime">
                        <el-date-picker
                        type="datetime"
                        placeholder="选择日期"
                        v-model="withForm.startTime"
                        value-format="yyyy-MM-dd hh:mm:ss">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="到期时间:" prop="endTime">
                        <el-date-picker
                        type="datetime"
                        placeholder="选择日期"
                        v-model="withForm.endTime"
                        value-format="yyyy-MM-dd hh:mm:ss">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="上线/下线：">
                        <el-radio-group v-model="withForm.status">
                        <el-radio :label="0">下线</el-radio>
                        <el-radio :label="1">上线</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="广告图片：">
                        <upload1 ref="refUpload"></upload1>
                    </el-form-item>
                    <el-form-item label="排序:" prop="sort">
                        <el-input v-model="withForm.sort"></el-input>
                    </el-form-item>
                    <el-form-item label="广告链接:" prop="url">
                        <el-input v-model="withForm.url"></el-input>
                    </el-form-item>
                    <el-form-item label="广告备注:" prop="note">
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
    name: "addDialog",
    data() {
        return {
            dialog_title: '添加广告',
            dialogVisible: false,
            // ----------
            withForm: {
                name: null,
                type: '',
                status: 1,
                startTime: '',
                endTime: '',
                status: 1,
                sort: 0,
                url: '',
                note: ''
            },
            rulesCheck: {

            },
            save_row: {},
            typeOptions: [
                {
                    label: 'PC首页轮播',
                    value: 0
                },
                {
                    label: 'APP首页轮播',
                    value: 1
                }
            ]
        }
    },
    methods: {
        initForm(row = {}) {
            let that = this;
            that.dialog_title = JSON.stringify(row) == "{}" ? "添加广告" : "编辑广告";
            that.dialogVisible = true;
            that.withForm = {
                name: row.name || null,
                type: JSON.stringify(row) == "{}" ? '' : row.type,
                startTime: row.startTime || '',
                endTime: row.endTime || '',
                status: JSON.stringify(row) == "{}" ? 1 : row.status,
                sort: row.sort || 0,
                url: row.url || '',
                note: row.note || ''
            }
            that.save_row = row
            that.$nextTick(function() {
                that.$refs.refUpload.download_url = row.download_url || '';
                that.$refs.refUpload.imageUrl = row.pic || '';
            });
        },
        cancelWay() {
            this.dialogVisible = false;
        },
        sureWay() {
            if (this.dialog_title == '添加广告') {
                this.addSure();
            } else if (this.dialog_title == '编辑广告') {
                this.editSure();
            }
        },
        paramsWay() {
            return {
                ...this.withForm,
                pic: this.$refs.refUpload.download_url
            }
        },
        addSure() {
            let that = this;
            let params = that.paramsWay();
            that.$apihttp({
                url: process.env.core_url + '/sky/homeAdvertise/add',
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
            let params = that.paramsWay();
            params.id = that.save_row.id;
            that.$apihttp({
                url: process.env.core_url + '/sky/homeAdvertise/update',
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
