<template>
    <section id="addDialog">
        <el-dialog
            title="选择专题"
            :visible.sync="dialogVisible"
            width="700px"
            :close-on-click-modal="false"
            >
            <section class="mercury">
                <el-row :gutter="20" style="margin-bottom: 20px;">
                    <el-col :span="3">专题名称:</el-col>
                    <el-col :span="11">
                        <el-input placeholder="" v-model="keyword">
                            <el-button slot="append" icon="el-icon-search" @click="queryWay()"></el-button>
                        </el-input>
                    </el-col>
                </el-row>
                <!-- 
                    如何解决分页使勾选消失的问题？
                    加上
                    :row-key="getRowKeys"
                    :reserve-selection="true"
                 -->
                <el-table
                    :data="tableData"
                    border
                    style="width: 100%"
                    ref="refTable"
                    :row-key="getRowKeys"
                    @select="tickSelect"
                >
                    <el-table-column type="selection" :reserve-selection="true" width="60" align="center"></el-table-column>
                    <el-table-column prop="title" label="专题名称" min-width="120"></el-table-column>
                    <el-table-column prop="categoryName" label="所属分类" min-width="120"></el-table-column>
                    <el-table-column prop="createTime" label="添加时间" min-width="120"></el-table-column>
                </el-table>
                <pagination :pagingObj="pagingObj" @emitWay="queryWay"></pagination>
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
            dialogVisible: false,
            // ----------
            tableData: [],
            pagingObj: { pageNum: 1, pageSize: 10, total: 0 },
            keyword: '',
            tick_arr: []
        }
    },
    methods: {
        // 获取勾选数组
        tickSelect(selection, row) {
            this.tick_arr = selection
            console.log("---tickSelect--1-", selection)
            console.log("---tickSelect--2-", row)
        },
        getRowKeys(row) {
            return row.id
        },
        queryWay() {
            console.log("---搜索---");
            let that = this;
            let params = {
                keyword: that.keyword,
                pageNum: that.pagingObj.pageNum,
                pageSize: that.pagingObj.pageSize
            };
            that.$apihttp({
                url: process.env.core_url + '/sky/subject/list',
                method: 'get',
                params: params
            })
                .then(res => {
                    if (res.code == '200') {
                        that.pagingObj.total = res.data.totalSize;
                        that.tableData = res.data.content;
                        that.dialogVisible = true;// 放这里，使渲染正常
                    }
                })
                .catch(err => {
                    console.log('error', err);
                });
        },
        initForm() {
            this.queryWay();
        },
        cancelWay() {
            this.dialogVisible = false;
        },
        sureWay() {
            let that = this;
            let params = [];
            for (let index = 0; index < that.tick_arr.length; index++) {
                let item = that.tick_arr[index];
                params.push({
                    subjectId: item.id,
                    subjectName: item.title
                })
            }
            that.$apihttp({
                url: process.env.core_url + '/sky/homeRecommendSubject/add',
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
        }
    }
}
</script>

<style lang="less" scoped>
#addDialog {

}
</style>
