export default {
    data() {
        return {
            dialog_title: '添加角色',
            dialogVisible: false,
            addAndEditForm: {
                name: '',
                description: '',
                status: true
            },
            rulesCheck: {},
            editSaveRow: {}
        }
    },
    methods: {
        addWay() {
            this.dialog_title = "添加角色";
            this.dialogVisible = true;
            this.initForm();
        },
        editWay(row) {
            this.editSaveRow = row
            this.dialog_title = "编辑角色";
            this.dialogVisible = true;
            this.initForm(row);
        },
        initForm(row = {}) {
            let that = this;
            that.addAndEditForm.name = row.name || '';
            that.addAndEditForm.description = row.description || '';
            that.addAndEditForm.status = row.status || true;
        },
        cancelWay() {
            this.dialogVisible = false;
        },
        sureWay() {
            if (this.dialog_title == '添加角色') {
                this.addSure();
            } else if (this.dialog_title == '编辑角色') {
                this.editSure();
            }
        },
        addSure() {
            let that = this;
            let params = {
                name: that.addAndEditForm.name,
                description: that.addAndEditForm.description,
                status: that.addAndEditForm.status ? 1 : 0
            }
            that.$apihttp({
                url: process.env.core_url + '/sky/role/add',
                method: 'post',
                data: params
            })
                .then(res => {
                    if (res.code == '200') {
                        that.queryWay();
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
                id: that.editSaveRow.id,
                name: that.addAndEditForm.name,
                description: that.addAndEditForm.description,
                status: that.addAndEditForm.status ? 1 : 0
            }
            that.$apihttp({
                url: process.env.core_url + '/sky/role/update',
                method: 'post',
                data: params
            })
                .then(res => {
                    if (res.code == '200') {
                        that.queryWay();
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