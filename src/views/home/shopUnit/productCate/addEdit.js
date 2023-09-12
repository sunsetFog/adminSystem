export default {
    data() {
        return {
            dialog_title: '添加菜单',
            dialogVisible: false,
            addAndEditForm: {
                name: '',
                parentId: null,
                productUnit: '',
                showStatus: true,
                navStatus: true,
                productCategoryId: [],
                keywords: '',
                description: '',
                sort: 0
            },
            rulesCheck: {},
            editSaveRow: {},
            level_list: [
                { id: 0, name: "无上级菜单" }
            ],
            // ---------
            product_category_list: [],
            defaultProps: {// 替换结构字段，不用处理数据
                multiple: true,
                children: 'productAttributeList',
                value: 'id',
                label: 'name'
            },
        }
    },
    created () {
        this.categoryWay();
    },
    methods: {
        // 商品属性分类
        categoryWay() {
            let that = this;
            let params = {
            };
            that.$apihttp({
                url: process.env.core_url + '/sky/PmsProductAttributeCategory/list/withAttr',
                method: 'get',
                params: params
            })
                .then(res => {
                    if (res.code == '200') {
                        that.product_category_list = res.data;
                    }
                })
                .catch(err => {
                    console.log('error', err);
                });
        },
        // 编辑  商品分类 和 商品分类属性 关系表
        productCategoryAttributeRelationWay(row) {
            let that = this;
            let params = {
                productCategoryId: row.id
            };
            that.$apihttp({
                url: process.env.core_url + '/sky/product_category_attribute/list',
                method: 'get',
                params: params
            })
                .then(res => {
                    if (res.code == '200') {
                        that.editSaveRow = row
                        that.dialog_title = "编辑菜单";
                        that.dialogVisible = true;
                        that.initForm(row);
                        for (let index = 0; index < res.data.length; index++) {
                            let element = res.data[index];
                            for (let i = 0; i < that.product_category_list.length; i++) {
                                let item = that.product_category_list[i];
                                for (let y = 0; y < item.productAttributeList.length; y++) {
                                    let val = item.productAttributeList[y];
                                    if(element.productAttributeId == val.id) {
                                        that.addAndEditForm.productCategoryId.push([item.id, val.id]);
                                    }
                                }
                            }
                        }
                        console.log("--that.addAndEditForm.productCategoryId-111-", that.addAndEditForm.productCategoryId)
                        that.$forceUpdate();
                    }
                })
                .catch(err => {
                    console.log('error', err);
                });
        },
        addWay() {
            this.dialog_title = "添加菜单";
            this.dialogVisible = true;
            this.initForm();
        },
        editWay(row) {
            this.productCategoryAttributeRelationWay(row)
        },
        initForm(row = {}) {
            let that = this;
            that.addAndEditForm.name = row.name || '';
            that.addAndEditForm.parentId = row.parentId;
            that.addAndEditForm.productUnit = row.productUnit || '';
            that.addAndEditForm.showStatus = row.showStatus || true;
            that.addAndEditForm.navStatus = row.navStatus || true;
            that.addAndEditForm.productCategoryId = [];
            that.addAndEditForm.keywords = row.keywords || '';
            that.addAndEditForm.description = row.description || '';
            that.addAndEditForm.sort = row.sort || 0;
            
            that.level_list = [];
            for (let index = 0; index < that.saveData.length; index++) {
                let item = that.saveData[index];
                that.level_list.push({
                    id: item.id,
                    name: item.name
                })
            }
            that.$nextTick(function() {
                that.$refs.refUpload.download_url = row.download_url || '';
                that.$refs.refUpload.imageUrl = row.icon || '';
            });
        },
        cancelWay() {
            this.dialogVisible = false;
        },
        sureWay() {
            if (this.dialog_title == '添加菜单') {
                this.addSure();
            } else if (this.dialog_title == '编辑菜单') {
                this.editSure();
            }
        },
        paramsWay() {
            let that = this;
            console.log("--that.addAndEditForm.productCategoryId-222-", that.addAndEditForm.productCategoryId)
            let productAttributeIdList = []
            for (let index = 0; index < that.addAndEditForm.productCategoryId.length; index++) {
                let item = that.addAndEditForm.productCategoryId[index];
                productAttributeIdList.push(item[1]);
            }
            return {
                description: that.addAndEditForm.description,
                icon: that.$refs.refUpload.download_url,
                keywords: that.addAndEditForm.keywords,
                name: that.addAndEditForm.name,
                navStatus: that.addAndEditForm.navStatus ? 1 : 0,
                parentId: that.addAndEditForm.parentId,
                productUnit: that.addAndEditForm.productUnit,
                showStatus: that.addAndEditForm.showStatus ? 1 : 0,
                sort: that.addAndEditForm.sort,
                productAttributeIdList: productAttributeIdList
            }
        },
        addSure() {
            let that = this;
            let params = that.paramsWay();
            that.$apihttp({
                url: process.env.core_url + '/sky/productCategory/add',
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
                url: process.env.core_url + '/sky/productCategory/update',
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