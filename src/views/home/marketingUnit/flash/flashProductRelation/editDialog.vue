<template>
    <section id="editDialog">
        <el-dialog
            title="编辑秒杀商品信息"
            :visible.sync="dialogVisible"
            width="700px"
            :close-on-click-modal="false"
            >
            <section class="mercury">
                <el-form :model="withForm" :rules="rulesCheck" ref="withForm" label-width="100px">
                    <el-form-item label="商品名称:" prop="name">
                        {{withForm.name}}
                    </el-form-item>
                    <el-form-item label="货号:" prop="productSn">
                        {{withForm.productSn}}
                    </el-form-item>
                    <el-form-item label="商品价格:" prop="price">
                        {{withForm.price}}
                    </el-form-item>
                    <el-form-item label="秒杀价格:" prop="flashPromotionPrice">
                        <el-input v-model="withForm.flashPromotionPrice">
                            <template slot="prepend">￥</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="剩余数量:" prop="stock">
                        {{withForm.stock}}
                    </el-form-item>
                    <el-form-item label="秒杀数量:" prop="flashPromotionCount">
                        <el-input v-model="withForm.flashPromotionCount"></el-input>
                    </el-form-item>
                    <el-form-item label="限购数量:" prop="flashPromotionLimit">
                        <el-input v-model="withForm.flashPromotionLimit"></el-input>
                    </el-form-item>
                    <el-form-item label="排序:" prop="sort">
                        <el-input v-model="withForm.sort"></el-input>
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
export default {
    name: "editDialog",
    data() {
        return {
            dialogVisible: false,
            // ----------
            withForm: {
                name: null,
                productSn: 0,
                price: 0,
                flashPromotionPrice: 0,
                stock: 0,
                flashPromotionCount: 0,
                flashPromotionLimit: 0,
                sort: 0
            },
            rulesCheck: {

            },
            save_row: {}
        }
    },
    methods: {
        initForm(row = {}) {
            this.dialogVisible = true;
            this.withForm = {
                name: row.product.name || null,
                productSn: row.product.productSn || '',
                price: row.product.price || 0,
                flashPromotionPrice: row.flashPromotionPrice || 0,
                stock: row.product.stock || 0,
                flashPromotionCount: row.flashPromotionCount || 0,
                flashPromotionLimit: row.flashPromotionLimit || 0,
                sort: row.sort || 0
            }
            this.save_row = row
        },
        cancelWay() {
            this.dialogVisible = false;
        },
        sureWay() {
            let that = this;
            let params = {
                flashPromotionCount: that.withForm.flashPromotionCount,
                flashPromotionId: that.$route.query.flashPromotionId,
                flashPromotionLimit: that.withForm.flashPromotionLimit,
                flashPromotionPrice: that.withForm.flashPromotionPrice,
                flashPromotionSessionId: that.$route.query.flashPromotionSessionId,
                id: that.save_row.id,
                productId: that.save_row.product.id,
                sort: that.withForm.sort,
            }
            that.$apihttp({
                url: process.env.core_url + '/sky/flashPromotionProductRelation/update',
                method: 'post',
                data: params
            })
                .then(res => {
                    if (res.code == '200') {
                        that.$emit("sureWay");
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
</script>

<style lang="less" scoped>
#editDialog {

}
</style>
