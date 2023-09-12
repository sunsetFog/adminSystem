export default {
    data() {
        return {
            dialog_title: '添加分类',
            dialogVisible: false,
            addAndEditForm: {
                name: '',
                sort: ''
            },
            rulesCheck: {},
            editSaveRow: {}
        }
    },
    methods: {
        addWay() {
            this.dialog_title = "添加分类";
            this.dialogVisible = true;
            this.initForm();
        },
        editWay(row) {
            this.editSaveRow = row
            this.dialog_title = "编辑分类";
            this.dialogVisible = true;
            this.initForm(row);
        },
        initForm(row = {}) {
            let that = this;
            that.addAndEditForm.name = row.name || '';
            that.addAndEditForm.sort = row.sort == 0 ? 0 : row.sort;
        },
        cancelWay() {
            this.dialogVisible = false;
        },
        sureWay() {
            if (this.dialog_title == '添加分类') {
                this.addSure();
            } else if (this.dialog_title == '编辑分类') {
                this.editSure();
            }
        },
        addSure() {
            let that = this;
            let params = {
                name: that.addAndEditForm.name,
                sort: that.addAndEditForm.sort
            }
            that.$apihttp({
                url: process.env.core_url + '/sky/resourceCategory/add',
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
                sort: that.addAndEditForm.sort
            }
            that.$apihttp({
                url: process.env.core_url + '/sky/resourceCategory/update',
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