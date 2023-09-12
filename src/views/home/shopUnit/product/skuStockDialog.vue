<template>
    <section id="skuStockDialog">
        <el-dialog
            title="编辑货品信息"
            :visible.sync="dialogGoods"
            width="800px"
            :close-on-click-modal="false"
            >
            <section class="mercury-box">
                <el-row :gutter="20" style="margin-bottom: 20px;">
                    <el-col :span="3">商品货号:</el-col>
                    <el-col :span="7">{{save_goods.productSn}}</el-col>
                    <el-col :span="3">sku编号:</el-col>
                    <el-col :span="11">
                        <el-input placeholder="sku编号" v-model="sku_value">
                            <el-button slot="append" icon="el-icon-search" @click="skuList()"></el-button>
                        </el-input>
                    </el-col>
                </el-row>
                <el-table
                    :data="sku_list"
                    border
                    style="width: 100%"
                >
                    <el-table-column min-width="120">
                        <template slot="header">sku编号</template>
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.skuCode" placeholder="请输入内容"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="50">
                        <template slot="header">颜色</template>
                        <template slot-scope="scope">
                            {{scope.row.spData[0].value}}
                        </template>
                    </el-table-column>
                    <el-table-column min-width="50">
                        <template slot="header">容量</template>
                        <template slot-scope="scope">
                            {{scope.row.spData[1].value}}
                        </template>
                    </el-table-column>
                    <el-table-column min-width="100">
                        <template slot="header">销售价格</template>
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.price" placeholder="请输入内容"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="100">
                        <template slot="header">商品库存</template>
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.stock" placeholder="请输入内容"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="100">
                        <template slot="header">库存预警值</template>
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.lowStock" placeholder="请输入内容"></el-input>
                        </template>
                    </el-table-column>
                </el-table>
            </section>
            <section slot="footer" class="dialog-footer">
                <el-button @click="cancelGoodsWay">取 消</el-button>
                <el-button type="primary" @click="sureGoodsWay">确 定</el-button>
            </section>
        </el-dialog>
    </section>
</template>

<script>
export default {
    name: "skuStockDialog",
    data() {
        return {
            dialogGoods: false,
            save_goods: {},
            sku_value: '',
            sku_list: []
        }
    },
    methods: {
        // sku商品库存
        skuList() {
            let that = this;
            let params = {
                keyword: that.sku_value
            };
            that.$apihttp({
                url: process.env.core_url + '/sky/sku/list/' +  that.save_goods.id,
                method: 'get',
                params: params
            })
                .then(res => {
                    if (res.code == '200') {
                        that.sku_list = res.data;
                        for (let index = 0; index < that.sku_list.length; index++) {
                            let item = that.sku_list[index];
                            item.spData = JSON.parse(item.spData);
                        }
                    }
                })
                .catch(err => {
                    console.log('error', err);
                });
        },
        initForm(row = {}) {
            this.dialogGoods = true;
            this.save_goods = row;
            this.skuList();
        },
        cancelGoodsWay() {
            this.dialogGoods = false;
        },
        sureGoodsWay() {
            let that = this;
            let arr = JSON.parse(JSON.stringify(that.sku_list));
            for (let index = 0; index < arr.length; index++) {
                let item = arr[index];
                item.spData = JSON.stringify(item.spData);
            }
            that.$apihttp({
                url: process.env.core_url + '/sky/sku/update/' +  that.save_goods.id,
                method: 'post',
                data: arr
            })
                .then(res => {
                    if (res.code == '200') {
                        that.$emit("sureWay");
                        that.dialogGoods = false;
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
</script>

<style lang="less" scoped>
#skuStockDialog {

}
</style>

