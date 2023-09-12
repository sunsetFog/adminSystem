export default {
    data() {
        return {
            dialog_title: '添加',
            dialogVisible: false,
            addAndEditForm: {
                varieties: '1',
                title: '',
                perms: null,
                menuParentId: [],
                routerParentId: [],
                name: '',
                icon: '',
                path: '',// +
                hidden: 0,
                cache: 0,// +
                sort: 0
            },
            rulesCheck: {},
            editSaveRow: {},
            menu_level: [],
            router_level: [],
            defaultProps: {// 替换结构字段，不用处理数据
                checkStrictly: true,
                children: 'children',
                value: 'id',
                label: 'title'
            }
        }
    },
    methods: {
        addWay() {
            this.dialog_title = "添加";
            this.dialogVisible = true;
            this.addAndEditForm.varieties = '1';
            this.initForm();
        },
        editWay(row) {
            this.editSaveRow = row
            this.dialog_title = "编辑";
            this.dialogVisible = true;
            if (row.perms) {
                this.addAndEditForm.varieties = '2';
            } else {
                this.addAndEditForm.varieties = '1';
            }
            this.initForm(row);
        },
        levelValue(arr, id) {
            arr = arr || []; //退出递归1. 空数组不会遍历，就不会调用自己了
            for (let i = 0; i < arr.length; i++) {
                let item = arr[i];
                if (item.id == id) {
                    // console.log("-dui-", item);
                    if(item.routerParentId == 0 || item.routerParentId == -1) {
                        this.addAndEditForm.routerParentId = [item.id];
                    } else {
                        this.addAndEditForm.routerParentId = [item.routerParentId, item.id];
                    }
                    return
                }
                this.levelValue(item.children, id);
            }
        },
        initForm(row = {}) {
            let that = this;
            that.levelValue(that.router_level, row.routerParentId);
            let list = this.addAndEditForm.routerParentId
            console.log("-nana-", list);
            that.addAndEditForm = {
                varieties: that.addAndEditForm.varieties,
                title: row.title || '',
                perms: row.perms || null,
                menuParentId: [row.menuParentId],
                routerParentId: Object.keys(row).length == 0 ? [] : list,
                name: row.name || '',
                icon: row.icon || '',
                path: row.path || '',
                hidden: row.hidden || 0,
                cache: row.cache || 0,
                sort: row.sort || 0
            }
            console.log("11--", that.addAndEditForm)
        },
        cancelWay() {
            this.dialogVisible = false;
        },
        sureWay() {
            if (this.dialog_title == '添加') {
                this.addSure();
            } else if (this.dialog_title == '编辑') {
                this.editSure();
            }
        },
        paramsWay() {
            let that = this;
            console.log("--22", that.addAndEditForm.routerParentId)
            return {
                title: that.addAndEditForm.title,
                perms: that.addAndEditForm.perms,
                menuParentId: that.addAndEditForm.menuParentId[that.addAndEditForm.menuParentId.length - 1],
                routerParentId: that.addAndEditForm.routerParentId[that.addAndEditForm.routerParentId.length - 1],
                name: that.addAndEditForm.name,
                icon: that.addAndEditForm.icon,
                path: that.addAndEditForm.path,
                hidden: that.addAndEditForm.hidden,
                cache: that.addAndEditForm.cache,
                sort: that.addAndEditForm.sort,
                subject: that.queryData.subject
            };
        },
        addSure() {
            let that = this;
            if(that.addAndEditForm.menuParentId[0] == -1 && that.addAndEditForm.routerParentId[0] == -1) {
                that.$message.error('不能路由和菜单都不是！');
                return;
            }
            let params = that.paramsWay();
            that.$apihttp({
                url: process.env.core_url + '/sky/menu/add',
                method: 'post',
                data: params
            })
                .then(res => {
                    if (res.code == '200') {
                        that.playWay();
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
                url: process.env.core_url + '/sky/menu/update',
                method: 'post',
                data: params
            })
                .then(res => {
                    if (res.code == '200') {
                        that.playWay();
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