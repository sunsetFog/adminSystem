<template>
    <section id="customer" ref="refUnit">
        <searchDesign @queryWay="queryWay" ref="refHeader" @addWay="addWay" :chongzhi="true" @resetWay="resetWay">
            <el-form ref="form" :model="queryData" label-width="100px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="商品名称：">
                            <el-input v-model="queryData.keyword" placeholder="请输入商品名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="商品货号：">
                            <el-input v-model="queryData.productSn" placeholder="请输入商品货号"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="商品分类：">
                            <el-cascader
                            v-model="queryData.productCategoryId"
                            :options="product_category_list"
                            :props="defaultProps">
                            </el-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="商品品牌：">
                            <el-select v-model="queryData.brandId" placeholder="请选择">
                                <el-option
                                v-for="item in brand_list"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="上架状态：">
                            <el-select v-model="queryData.publishStatus" placeholder="请选择">
                                <el-option
                                v-for="item in publish_list"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="审核状态：">
                            <el-select v-model="queryData.verifyStatus" placeholder="请选择">
                                <el-option
                                v-for="item in verify_list"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </searchDesign>
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
            <el-table-column min-width="60">
                <template slot="header">商品图片</template>
                <template slot-scope="scope">
                    <previewPictures :photoList="[scope.row.pic]"></previewPictures>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="商品名称" min-width="100"></el-table-column>
            <el-table-column min-width="100">
                <template slot="header">价格/货号</template>
                <template slot-scope="scope">
                    <div>价格: {{scope.row.price}}</div>
                    <div>货号: {{scope.row.productSn}}</div>
                </template>
            </el-table-column>
            <el-table-column min-width="80">
                <template slot="header">标签</template>
                <template slot-scope="scope">
                    <div>上架: <el-switch v-model="scope.row.status" @change="(val)=>{switchChange(val, scope.row)}"></el-switch></div>
                    <div>新品: <el-switch v-model="scope.row.status" @change="(val)=>{switchChange(val, scope.row)}"></el-switch></div>
                    <div>推荐: <el-switch v-model="scope.row.status" @change="(val)=>{switchChange(val, scope.row)}"></el-switch></div>
                </template>
            </el-table-column>
            <el-table-column prop="sort" label="排序" min-width="60"></el-table-column>
            <el-table-column min-width="60">
                <template slot="header">SKU库存</template>
                <template slot-scope="scope">
                    <i class="el-icon-edit" @click="skuStockShow(scope.row)"></i>
                </template>
            </el-table-column>
            <el-table-column prop="sale" label="销量" min-width="60"></el-table-column>
            <el-table-column min-width="80">
                <template slot="header">审核状态</template>
                <template slot-scope="scope">
                    <div>未审核</div>
                    <div>审核详情</div>
                </template>
            </el-table-column>

            <el-table-column width="100" fixed="right">
                <template slot="header">操作</template>
                <template slot-scope="scope">
                    <el-button type="text" @click="addWay(scope.row)">编辑</el-button>
                    <el-button type="text" @click="deleteWay(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination :pagingObj="pagingObj" @emitWay="queryWay"></pagination>

        <addDialog ref="add" @sureWay="queryWay"></addDialog>
        <skuStockDialog ref="skuStock" @sureWay="queryWay"></skuStockDialog>
        
    </section>
</template>

<script>
import addDialog from "./addDialog"
import skuStockDialog from "./skuStockDialog"
import apple from "./apple"
export default {
    name: "customer",
    components: { addDialog, skuStockDialog },
    mixins: [apple],
    data() {
        return {
            queryData: {
                keyword: '',
                productSn: '',
                productCategoryId: [],
                brandId: '',
                publishStatus: '',
                verifyStatus: ''
            },
            publish_list: [
                { value: 1, label: '上架' },
                { value: 0, label: '下架'}
            ],
            verify_list: [
                { value: 1, label: '审核通过' },
                { value: 0, label: '未审核' }
            ],
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
        // 添加，编辑
        addWay(row) {
            this.$refs.add.initForm(row);
        },
        // SKU库存
        skuStockShow(row) {
            this.$refs.skuStock.initForm(row);
        },
        resetWay() {
            this.queryData.keyword = ''
            this.queryData.productSn = ''
            this.queryData.productCategoryId = []
            this.queryData.brandId = ''
            this.queryData.publishStatus = ''
            this.queryData.verifyStatus = ''
        },
        queryWay() {
            console.log("---搜索---");
            let that = this;
            let params = {
                keyword: that.queryData.keyword,
                productSn: that.queryData.productSn,
                productCategoryId: that.queryData.productCategoryId.length == 0 ? '' : that.queryData.productCategoryId[0],
                brandId: that.queryData.brandId,
                publishStatus: that.queryData.publishStatus,
                verifyStatus: that.queryData.verifyStatus,
                pageNum: that.pagingObj.pageNum,
                pageSize: that.pagingObj.pageSize
            };
            that.$apihttp({
                url: process.env.core_url + '/sky/product/list',
                method: 'post',
                data: params
            })
                .then(res => {
                    if (res.code == '200') {
                        that.pagingObj.total = res.data.totalSize;
                        that.tableData = res.data.content;
                        for (let index = 0; index < that.tableData.length; index++) {
                            let item = that.tableData[index];
                            item.download_url = item.icon;
                            item.icon = process.env.core_url + '/sky' + item.icon;
                            if (item.status == 1) {
                                item.status = true
                            } else {
                                item.status = false
                            }
                        }
                    }
                })
                .catch(err => {
                    console.log('error', err);
                });
        },
        switchChange(value, row) {
            console.log("--switchChange--", value, row);
            let that = this;
            that.$confirm('是否要修改该状态?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    let params = {
                        id: row.id,
                        status: value ? 1 : 0
                    };
                    that.$apihttp({
                        url: process.env.core_url + '/sky/admin/update',
                        method: 'post',
                        data: params
                    })
                        .then(res => {
                            if (res.code == '200') {
                                that.queryWay();
                                that.$message({
                                    type: 'success',
                                    message: '修改成功!'
                                });
                            }
                        })
                        .catch(err => {
                            console.log('error', err);
                        });
                })
                .catch(() => {
                    that.queryWay();
                    that.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
        },
        deleteWay(row) {
            let that = this;
            that.$confirm('是否要进行删除操作?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    let params = {
                        ids: row.id
                    };
                    that.$apihttp({
                        url: process.env.core_url + '/sky/product/deleteStatus',
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
#customer {
    height: 100%;
}
</style>

