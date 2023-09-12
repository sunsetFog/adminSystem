export default {
    data() {
        return {
            dialog_title: '添加类型',
            dialogVisible: false,
            addAndEditForm: {
                name: '',
                productAttributeCategoryId: '',
                filterType: 0,
                searchType: 0,
                relatedStatus: 0,
                selectType: 0,
                inputType: 0,
                handAddStatus: 0,
                inputList: '',
                sort: 0
            },
            rulesCheck: {},
            editSaveRow: {},
            category_list: []
        }
    },
    created () {
        this.categoryWay();
    },
    methods: {
        categoryWay() {
            let that = this;
            let params = {
                pageNum: 1,
                pageSize: 9999
            };
            that.$apihttp({
                url: process.env.core_url + '/sky/PmsProductAttributeCategory/list',
                method: 'get',
                params: params
            })
                .then(res => {
                    if (res.code == '200') {
                        that.category_list = res.data.content;
                    }
                })
                .catch(err => {
                    console.log('error', err);
                });
        },
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
            that.addAndEditForm.productAttributeCategoryId = row.productAttributeCategoryId || '';
            that.addAndEditForm.filterType = row.filterType || 0;
            that.addAndEditForm.searchType = row.searchType || 0;
            that.addAndEditForm.relatedStatus = row.relatedStatus || 0;
            that.addAndEditForm.selectType = row.selectType || 0;
            that.addAndEditForm.inputType = row.inputType || 0;
            that.addAndEditForm.handAddStatus = row.handAddStatus || 0;
            that.addAndEditForm.inputList = row.inputList || '';
            that.addAndEditForm.sort = row.sort || 0;
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
                filterType: that.addAndEditForm.filterType,
                handAddStatus: that.addAndEditForm.handAddStatus,
                inputList: that.addAndEditForm.inputList,
                inputType: that.addAndEditForm.inputType,
                name: that.addAndEditForm.name,
                productAttributeCategoryId: that.addAndEditForm.productAttributeCategoryId,
                relatedStatus: that.addAndEditForm.relatedStatus,
                searchType: that.addAndEditForm.searchType,
                selectType: that.addAndEditForm.selectType,
                sort: that.addAndEditForm.sort,
                type: that.$route.query.type
            }
        },
        addSure() {
            let that = this;
            let params = that.paramsWay()
            that.$apihttp({
                url: process.env.core_url + '/sky/productAttribute/add',
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
            let params = that.paramsWay()
            params.id = that.editSaveRow.id
            that.$apihttp({
                url: process.env.core_url + '/sky/productAttribute/update',
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