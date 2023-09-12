export default {
    data() {
        return {
            dialog_title: '添加类型',
            dialogVisible: false,
            addAndEditForm: {
                name: '',
                firstLetter: '',
                brandStory: '',
                sort: 0,
                showStatus: 0,
                factoryStatus: 0
            },
            rulesCheck: {},
            editSaveRow: {}
        }
    },
    methods: {
        addWay() {
            this.dialog_title = "添加类型";
            this.dialogVisible = true;
            this.initForm();
        },
        editWay(row) {
            this.editSaveRow = row
            this.dialog_title = "编辑类型";
            this.dialogVisible = true;
            this.initForm(row);
        },
        initForm(row = {}) {
            let that = this;
            that.addAndEditForm.name = row.name || '';
            that.addAndEditForm.firstLetter = row.firstLetter || '';
            that.addAndEditForm.brandStory = row.brandStory || '';
            that.addAndEditForm.sort = row.sort || 0;
            that.addAndEditForm.showStatus = row.showStatus || 0;
            that.addAndEditForm.factoryStatus = row.factoryStatus || 0;

            that.$nextTick(function() {
                that.$refs.logoUpload.download_url = row.download_url_logo || '';
                that.$refs.logoUpload.imageUrl = row.logo || '';
                that.$refs.picUpload.download_url = row.download_url_pic || '';
                that.$refs.picUpload.imageUrl = row.bigPic || '';
            });
        },
        cancelWay() {
            this.dialogVisible = false;
        },
        sureWay() {
            if (this.dialog_title == '添加类型') {
                this.addSure();
            } else if (this.dialog_title == '编辑类型') {
                this.editSure();
            }
        },
        paramsWay() {
            let that = this;
            return {
                bigPic: that.$refs.picUpload.download_url,
                brandStory: that.addAndEditForm.brandStory,
                factoryStatus: that.addAndEditForm.factoryStatus,
                firstLetter: that.addAndEditForm.firstLetter,
                logo: that.$refs.logoUpload.download_url,
                name: that.addAndEditForm.name,
                productCommentCount: 100,
                productCount: 100,
                showStatus: that.addAndEditForm.showStatus,
                sort: that.addAndEditForm.sort
            }
        },
        addSure() {
            let that = this;
            let params = that.paramsWay();
            that.$apihttp({
                url: process.env.core_url + '/sky/brand/add',
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
            let params = that.paramsWay();
            params.id = that.editSaveRow.id;
            that.$apihttp({
                url: process.env.core_url + '/sky/brand/update',
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