export default {
    data() {
        return {
            dialog_title: '添加用户',
            dialogVisible: false,
            addAndEditForm: {
                name: '',
                url: '',
                categoryId: '',
                description: ''
            },
            rulesCheck: {},
            editSaveRow: {}
        }
    },
    methods: {
        addWay() {
            this.dialog_title = "添加用户";
            this.dialogVisible = true;
            this.initForm();
        },
        editWay(row) {
            this.editSaveRow = row
            this.dialog_title = "编辑用户";
            this.dialogVisible = true;
            this.initForm(row);
        },
        initForm(row = {}) {
            let that = this;
            that.addAndEditForm.name = row.name || '';
            that.addAndEditForm.url = row.url || '';
            that.addAndEditForm.categoryId = row.categoryId || '';
            that.addAndEditForm.description = row.description || '';
        },
        cancelWay() {
            this.dialogVisible = false;
        },
        sureWay() {
            if (this.dialog_title == '添加用户') {
                this.addSure();
            } else if (this.dialog_title == '编辑用户') {
                this.editSure();
            }
        },
        addSure() {
            let that = this;
            let params = {
                name: that.addAndEditForm.name,
                url: that.addAndEditForm.url,
                categoryId: that.addAndEditForm.categoryId,
                description: that.addAndEditForm.description
            }
            that.$apihttp({
                url: process.env.core_url + '/sky/resource/add',
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
                url: that.addAndEditForm.url,
                categoryId: that.addAndEditForm.categoryId,
                description: that.addAndEditForm.description
            }
            that.$apihttp({
                url: process.env.core_url + '/sky/resource/update',
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