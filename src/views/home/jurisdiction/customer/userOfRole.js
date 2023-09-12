export default {
    data () {
        return {
            dialogRole: false,
            role_value: [],
            role_list: []
        }
    },
    created () {
        this.roleList();
    },
    methods: {
        roleWay(row) {
            let that = this;
            that.editSaveRow = row
            let params = {
                adminId: row.id
            };
            that.$apihttp({
                url: process.env.core_url + '/sky/admin_role/list',
                method: 'get',
                params: params
            })
                .then(res => {
                    if (res.code == '200') {
                        that.role_value = res.data.map(function(item){
                            return item.id;
                        })
                        that.dialogRole = true;
                    }
                })
                .catch(err => {
                    console.log('error', err);
                });
        },
        roleList() {
            let that = this;
            let params = {
                keyword: null,
                pageNum: 1,
                pageSize: 9999
            };
            that.$apihttp({
                url: process.env.core_url + '/sky/role/list',
                method: 'post',
                params: params
            })
                .then(res => {
                    if (res.code == '200') {
                        that.role_list = res.data.content;
                    }
                })
                .catch(err => {
                    console.log('error', err);
                });
        },
        cancelRoleWay() {
            this.dialogRole = false;
        },
        sureRoleWay() {
            let that = this;
            let params = {
                adminId: that.editSaveRow.id,
                roleIds: that.role_value.join(",")
            };
            that.$apihttp({
                url: process.env.core_url + '/sky/admin_role/deleteAdd',
                method: 'get',
                params: params
            })
                .then(res => {
                    if (res.code == '200') {
                        that.cancelRoleWay();
                        that.$message({
                            type: 'success',
                            message: '添加成功!'
                        });
                    }
                })
                .catch(err => {
                    console.log('error', err);
                });
        }
    }
}