<template>
    <section id="productAttrListUnit" ref="refUnit">
        <searchDesign @queryWay="queryWay" ref="refHeader" @addWay="addWay" :sousuo="false"></searchDesign>
        <!-- 
            1.table的滚动条是height值影响的
            2.要是table在mouted生命周期不重新渲染了，强制刷新渲染也没用，那么用v-if="tableHeight != 0"控制渲染延后
        -->
        <el-table
            :data="tableData"
            border
            style="width: 100%"
            v-if="tableHeight != 0"
            :height="tableHeight"
            ref="refTable"
        >
            <el-table-column width="50" type="index" label="序号"></el-table-column>
            <el-table-column prop="name" label="属性名称" min-width="80"></el-table-column>
            <el-table-column prop="cname" label="商品类型" min-width="80"></el-table-column>
            <el-table-column prop="selectType2" label="属性是否可选" min-width="100"></el-table-column>
            <el-table-column prop="inputType2" label="属性值的录入方式" min-width="130"></el-table-column>
            <el-table-column prop="inputList" label="可选值列表" min-width="130"></el-table-column>
            <el-table-column prop="sort" label="排序" min-width="50"></el-table-column>

            <el-table-column width="150" fixed="right">
                <template slot="header">操作</template>
                <template slot-scope="scope">
                    <el-button type="text" @click="editWay(scope.row)">编辑</el-button>
                    <el-button type="text" @click="deleteWay(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination :pagingObj="pagingObj" @emitWay="queryWay"></pagination>



        <el-dialog
            :title="dialog_title"
            :visible.sync="dialogVisible"
            width="650px"
            :close-on-click-modal="false"
            >
            <section class="mercury">
                <el-form :model="addAndEditForm" :rules="rulesCheck" ref="addAndEditForm" label-width="130px">
                    <el-form-item label="属性名称:" prop="name">
                        <el-input v-model="addAndEditForm.name" placeholder="请输入属性名称"></el-input>
                    </el-form-item>
                    <el-form-item label="商品类型:">
                        <el-select v-model="addAndEditForm.productAttributeCategoryId" placeholder="请选择">
                            <el-option
                            v-for="item in category_list"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="分类筛选样式:">
                        <el-radio v-model="addAndEditForm.filterType" :label="0">普通</el-radio>
                        <el-radio v-model="addAndEditForm.filterType" :label="1">颜色</el-radio>
                    </el-form-item>
                    <el-form-item label="能否进行检索:">
                        <el-radio v-model="addAndEditForm.searchType" :label="0">不需要检索</el-radio>
                        <el-radio v-model="addAndEditForm.searchType" :label="1">关键字检索</el-radio>
                        <el-radio v-model="addAndEditForm.searchType" :label="2">范围检索</el-radio>
                    </el-form-item>
                    <el-form-item label="商品属性关联:">
                        <el-radio v-model="addAndEditForm.relatedStatus" :label="1">是</el-radio>
                        <el-radio v-model="addAndEditForm.relatedStatus" :label="0">否</el-radio>
                    </el-form-item>
                    <el-form-item label="属性是否可选:">
                        <el-radio v-model="addAndEditForm.selectType" :label="0">唯一</el-radio>
                        <el-radio v-model="addAndEditForm.selectType" :label="1">单选</el-radio>
                        <el-radio v-model="addAndEditForm.selectType" :label="2">多选</el-radio>
                    </el-form-item>
                    <el-form-item label="属性值的录入方式:">
                        <el-radio v-model="addAndEditForm.inputType" :label="0">手工录入</el-radio>
                        <el-radio v-model="addAndEditForm.inputType" :label="1">从列表中选取</el-radio>
                    </el-form-item>
                    <el-form-item label="是否支持手动新增:">
                        <el-radio v-model="addAndEditForm.handAddStatus" :label="1">是</el-radio>
                        <el-radio v-model="addAndEditForm.handAddStatus" :label="0">否</el-radio>
                    </el-form-item>
                    <el-form-item label="属性值可选值列表:" prop="inputList">
                        <el-input v-model="addAndEditForm.inputList" placeholder="属性值可选值列表"></el-input>
                    </el-form-item>
                    <el-form-item label="排序:" prop="sort">
                        <el-input v-model="addAndEditForm.sort" placeholder=""></el-input>
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
import addEdit from "./addEdit"
export default {
    name: "productAttrListUnit",
    mixins: [addEdit],
    data() {
        return {
            queryData: {
                keyword: ''
            },
            // -----------------
            tableData: [],
            tableHeight: 0,
            // -----------------
            pagingObj: { pageNum: 1, pageSize: 10, total: 0 },
        }
    },
    created() {
        this.queryWay();
    },
    mounted() {
        console.log('--refUnit-', this.$refs.refUnit.offsetHeight);
        console.log('--refHeader-$el指向模板根标签-', this.$refs.refHeader.$el.offsetHeight);
        this.tableHeight =
            this.$refs.refUnit.offsetHeight -
            (this.$refs.refHeader.$el.offsetHeight + 50 + 1);
        console.log('--tableHeight--', this.tableHeight);
    },
    methods: {
        queryWay() {
            console.log("---搜索---");
            let that = this;
            let params = {
                cid: that.$route.query.cid,
                type: that.$route.query.type,
                pageNum: that.pagingObj.pageNum,
                pageSize: that.pagingObj.pageSize
            };
            that.$apihttp({
                url: process.env.core_url + '/sky/productAttribute/list',
                method: 'get',
                params: params
            })
                .then(res => {
                    if (res.code == '200') {
                        that.pagingObj.total = res.data.totalSize;
                        that.tableData = res.data.content;
                        for (let index = 0; index < that.tableData.length; index++) {
                            let item = that.tableData[index];
                            item.cname = that.$route.query.cname
                            if(item.selectType == 0) {
                                item.selectType2 = "唯一"
                            } else if(item.selectType == 1) {
                                item.selectType2 = "单选"
                            } else if(item.selectType == 2) {
                                item.selectType2 = "多选"
                            }
                            if(item.inputType == 0) {
                                item.inputType2 = "手工录入"
                            } else if(item.inputType == 1) {
                                item.inputType2 = "从列表中选取"
                            }
                        }
                    }
                })
                .catch(err => {
                    console.log('error', err);
                });
        },
        deleteWay(row) {
            let that = this;
            that.$confirm('是否要删除该类型?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    let params = {
                        ids: row.id
                    };
                    that.$apihttp({
                        url: process.env.core_url + '/sky/productAttribute/delete',
                        method: 'get',
                        params: params
                    })
                        .then(res => {
                            if (res.code == '200') {
                                that.queryWay();
                                that.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                            }
                        })
                        .catch(err => {
                            console.log('error', err);
                        });
                })
                .catch(() => {
                    that.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
        }
    }
}
</script>

<style lang="less" scoped>
#productAttrListUnit {
    height: 100%;
}
</style>

