<template>
    <section id="addDialog">
        <el-dialog
            :title="dialog_title"
            :visible.sync="dialogVisible"
            width="800px"
            :close-on-click-modal="false"
            >
            <section class="mercury">
                <el-steps :active="guide_active" finish-status="success" align-center style="margin-bottom: 25px;">
                    <el-step title="填写商品信息"></el-step>
                    <el-step title="填写商品促销"></el-step>
                    <el-step title="填写商品属性"></el-step>
                    <el-step title="选择商品关联"></el-step>
                </el-steps>

                <el-form v-if="guide_active == 0" :model="formOf01" :rules="rulesCheck" ref="formOf01" label-width="100px">
                    <el-form-item label="商品分类:" prop="productCategoryId">
                        <el-cascader
                        v-model="formOf01.productCategoryId"
                        :options="product_category_list"
                        :props="defaultProps">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label="商品名称:" prop="name">
                        <el-input v-model="formOf01.name" placeholder="请输入商品名称"></el-input>
                    </el-form-item>
                    <el-form-item label="副标题:" prop="subtitle">
                        <el-input v-model="formOf01.subtitle" placeholder="请输入副标题"></el-input>
                    </el-form-item>
                    <el-form-item label="商品品牌:" prop="brandId">
                        <el-select v-model="formOf01.brandId" placeholder="请选择">
                            <el-option
                            v-for="item in brand_list"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品介绍:" prop="introduce">
                        <el-input type="textarea" v-model="formOf01.introduce" maxlength="100" show-word-limit></el-input>
                    </el-form-item>
                    <el-form-item label="商品货号:" prop="productSn">
                        <el-input v-model="formOf01.productSn" placeholder="请输入商品货号"></el-input>
                    </el-form-item>
                    <el-form-item label="商品售价:" prop="price">
                        <el-input v-model="formOf01.price" placeholder="请输入商品售价"></el-input>
                    </el-form-item>
                    <el-form-item label="市场价:" prop="market_value">
                        <el-input v-model="formOf01.market_value" placeholder="请输入市场价"></el-input>
                    </el-form-item>
                    <el-form-item label="商品库存:" prop="stock">
                        <el-input v-model="formOf01.stock" placeholder="请输入商品库存"></el-input>
                    </el-form-item>
                    <el-form-item label="计算单位:" prop="company">
                        <el-input v-model="formOf01.company" placeholder="请输入计算单位"></el-input>
                    </el-form-item>
                    <el-form-item label="商品重量:" prop="weight">
                        <el-input v-model="formOf01.weight" placeholder="请输入商品重量">
                            <div slot="suffix">克</div>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="排序:" prop="sort">
                        <el-input v-model="formOf01.sort" placeholder="请输入排序"></el-input>
                    </el-form-item>
                </el-form>


                <el-form v-if="guide_active == 1" :model="formOf02" :rules="rulesCheck" ref="formOf02" label-width="100px">
                    <el-form-item label="赠送积分:" prop="integral">
                        <el-input v-model="formOf02.integral" placeholder="请输入赠送积分"></el-input>
                    </el-form-item>
                    <el-form-item label="赠送成长值:" prop="grow">
                        <el-input v-model="formOf02.grow" placeholder="请输入赠送成长值"></el-input>
                    </el-form-item>
                    <el-form-item label="积分购买限制:" prop="buyLimit">
                        <el-input v-model="formOf02.buyLimit" placeholder="请输入积分购买限制"></el-input>
                    </el-form-item>
                    <el-form-item label="预告商品:" prop="advanceNotice">
                        <el-switch v-model="formOf02.advanceNotice"></el-switch>
                    </el-form-item>
                    <el-form-item label="商品上架:" prop="putOn">
                        <el-switch v-model="formOf02.putOn"></el-switch>
                    </el-form-item>
                    <el-form-item label="商品推荐:">
                        新品&nbsp;&nbsp;<el-switch v-model="formOf02.newProduct"></el-switch>&nbsp;&nbsp;&nbsp;
                        推荐&nbsp;&nbsp;<el-switch v-model="formOf02.recommend"></el-switch>
                    </el-form-item>
                    <el-form-item label="服务保证:" prop="price">
                        <el-checkbox-group v-model="formOf02.serviceList">
                            <el-checkbox label="无忧退货"></el-checkbox>
                            <el-checkbox label="快速退款"></el-checkbox>
                            <el-checkbox label="免费包邮"></el-checkbox>      
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="详细页标题:" prop="detailTitle">
                        <el-input v-model="formOf02.detailTitle" placeholder="请输入详细页标题"></el-input>
                    </el-form-item>
                    <el-form-item label="详细页描述:" prop="description">
                        <el-input v-model="formOf02.description" placeholder="请输入详细页描述"></el-input>
                    </el-form-item>
                    <el-form-item label="商品关键字:" prop="keyword">
                        <el-input v-model="formOf02.keyword" placeholder="请输入商品关键字"></el-input>
                    </el-form-item>
                    <el-form-item label="商品备注:" prop="remarks">
                        <el-input type="textarea" v-model="formOf02.remarks" maxlength="100" show-word-limit></el-input>
                    </el-form-item>
                    <el-form-item label="选择优惠方式:">
                        <el-tabs type="border-card">
                            <el-tab-pane label="无优惠">无优惠</el-tab-pane>
                            <el-tab-pane label="特惠促销">

                               <el-row :gutter="20" style="margin-bottom: 15px;">
                                    <el-col :span="4">时间：</el-col>
                                    <el-col :span="20">
                                        <el-date-picker
                                        v-model="formOf02.time_value"
                                        type="datetimerange"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期">
                                        </el-date-picker>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="4">促销价格：</el-col>
                                    <el-col :span="20">
                                        <el-input v-model="formOf02.promotion_price" placeholder=""></el-input>
                                    </el-col>
                                </el-row>

                            </el-tab-pane>
                            <el-tab-pane label="会员价格">

                                <el-row :gutter="20" style="margin-bottom: 15px;">
                                    <el-col :span="4">黄金会员：</el-col>
                                    <el-col :span="20">
                                        <el-input v-model="formOf02.gold" placeholder=""></el-input>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20" style="margin-bottom: 15px;">
                                    <el-col :span="4">白金会员：</el-col>
                                    <el-col :span="20">
                                        <el-input v-model="formOf02.platinum" placeholder=""></el-input>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="4">钻石会员：</el-col>
                                    <el-col :span="20">
                                        <el-input v-model="formOf02.diamonds" placeholder=""></el-input>
                                    </el-col>
                                </el-row>

                            </el-tab-pane>
                            <el-tab-pane label="阶梯价格">

                                <el-table
                                    :data="formOf02.ladder_list"
                                    border
                                    style="width: 100%"
                                >
                                    <el-table-column min-width="100">
                                        <template slot="header">数量</template>
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.quantity" placeholder=""></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column min-width="100">
                                        <template slot="header">折扣</template>
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.discount" placeholder=""></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column width="180">
                                        <template slot="header">
                                            操作：<el-button type="primary" @click="addLadderWay()">添加</el-button>
                                        </template>
                                        <template slot-scope="scope">
                                            
                                            <el-button type="text" @click="deleteLadderWay(scope)">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>

                            </el-tab-pane>
                            <el-tab-pane label="满减价格">

                                    <el-table
                                    :data="formOf02.full_minus"
                                    border
                                    style="width: 100%"
                                >
                                    <el-table-column min-width="100">
                                        <template slot="header">满</template>
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.fullPrice" placeholder=""></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column min-width="100">
                                        <template slot="header">立减</template>
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.reducePrice" placeholder=""></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column width="180">
                                        <template slot="header">
                                            操作：<el-button type="primary" @click="addFullMinusWay()">添加</el-button>
                                        </template>
                                        <template slot-scope="scope">
                                            
                                            <el-button type="text" @click="deleteFullMinusWay(scope)">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>

                            </el-tab-pane>
                        </el-tabs>
                    </el-form-item>
                </el-form>


                <el-form v-show="guide_active == 2" :model="formOf03" :rules="rulesCheck" ref="formOf03" label-width="100px">
                    <el-form-item label="属性类型:" prop="productAttributeCategoryId">
                        <el-select v-model="formOf03.productAttributeCategoryId" placeholder="请选择">
                            <el-option
                            v-for="item in attribute_type_list"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品规格:"></el-form-item>
                    <el-form-item label="商品参数:"></el-form-item>
                    <el-form-item label="商品相册:">
                        <upload1 ref="refUpload"></upload1>
                    </el-form-item>
                    <el-form-item label="规格参数:">
                        <el-tabs type="border-card">
                            <el-tab-pane label="电脑端详情">电脑端详情</el-tab-pane>
                            <el-tab-pane label="移动端详情">移动端详情</el-tab-pane>
                        </el-tabs>
                    </el-form-item>
                </el-form>


                <el-form v-if="guide_active == 3" :model="formOf04" :rules="rulesCheck" ref="formOf04" label-width="100px">
                    <el-form-item label="关联专题:">
                        <el-transfer
                            filterable
                            :filter-method="filterMethod1"
                            filter-placeholder="请输入"
                            v-model="subject_value"
                            :data="subject_list"
                            :titles="['待选择', '已选择']"
                            :props="asProps1">
                        </el-transfer>
                    </el-form-item>
                    <el-form-item label="关联优选:">
                        <el-transfer
                            filterable
                            :filter-method="filterMethod2"
                            filter-placeholder="请输入"
                            v-model="optimization_value"
                            :data="optimization_list"
                            :titles="['待选择', '已选择']"
                            :props="asProps2">
                        </el-transfer>
                    </el-form-item>
                </el-form>



            </section>
            <section slot="footer" class="dialog-footer">
                <el-button @click="cancelWay">取 消</el-button>
                <el-button type="primary" @click="backWay" v-if="guide_active != 0">上一步</el-button>
                <el-button type="primary" @click="nextWay"  v-if="guide_active != 3">下一步</el-button>
                <el-button type="primary" @click="sureWay">确 定</el-button>
            </section>
        </el-dialog>
    </section>
</template>

<script>
import apple from "./apple"
export default {
    name: "addDialog",
    mixins: [apple],
    data() {
        return {
            dialog_title: '添加用户',
            dialogVisible: false,
            guide_active: 0,
            // --------------------------------
            formOf01: {
                productCategoryId: [],
                name: '',
                subtitle: '',
                brandId: '',
                introduce: '',
                productSn: '',
                price: 0,
                market_value: 0,
                stock: 0,
                company: '',
                weight: '',
                sort: 0
            },
            rulesCheck: {},
            // --------------------------------
            formOf02: {
                integral: 0,
                grow: 0,
                buyLimit: 0,
                advanceNotice: false,
                putOn: false,
                newProduct: false,
                recommend: false,
                serviceList: [],
                detailTitle: '',
                description: '',
                keyword: '',
                remarks: '',
                // 特惠促销
                time_value: [],
                promotion_price: '',
                // 会员价格
                gold: '',
                platinum: '',
                diamonds: '',
                // 阶梯价格
                ladder_list: [],
                // 满减价格
                full_minus: []
            },
            // --------------------------------
            formOf03: {
                productAttributeCategoryId: ''
            },
            attribute_type_list: [],
            // --------------------------------
            formOf04: {},
            subject_value: [],
            subject_list: [],
            asProps1: {
                key: 'id',
                label: 'title',
                disabled: 'disabled'
            },
            optimization_value: [],
            optimization_list: [],
            asProps2: {
                key: 'id',
                label: 'name',
                disabled: 'disabled'
            },
            // --------------------------------
            editSaveRow: {}
        }
    },
    created () {
        this.attributeWay();
        this.subjectWay();
        this.optimizationWay();
    },
    methods: {
        // ---------------------------------------- formOf02 --------------------------
        addLadderWay() {
            console.log("--row--")
            this.formOf02.ladder_list.push({
                quantity: '',
                discount: ''
            })
        },
        deleteLadderWay(scope) {
            console.log("--scope--", scope)
            this.formOf02.ladder_list.splice(scope.$index, 1);
        },
        addFullMinusWay() {
            this.formOf02.full_minus.push({
                fullPrice: '',
                reducePrice: ''
            })
        },
        deleteFullMinusWay(scope) {
            console.log("--scope--", scope)
            this.formOf02.full_minus.splice(scope.$index, 1);
        },
        // ------------------------------------------ formOf03 ------------------------------------
        // 商品属性分类
        attributeWay() {
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
                        that.attribute_type_list = res.data.content;
                    }
                })
                .catch(err => {
                    console.log('error', err);
                });
        },
        // ------------------------------------------ formOf04 ------------------------------------
        filterMethod1(query, item) {
            return item.title.indexOf(query) > -1;
        },
        filterMethod2(query, item) {
            return item.name.indexOf(query) > -1;
        },
        // 商品专题
        subjectWay() {
            let that = this;
            let params = {
                keyword: '',
                pageNum: 1,
                pageSize: 9999
            };
            that.$apihttp({
                url: process.env.core_url + '/sky/subject/list',
                method: 'get',
                params: params
            })
                .then(res => {
                    if (res.code == '200') {
                        that.subject_list = res.data.content;
                    }
                })
                .catch(err => {
                    console.log('error', err);
                });
        },
        optimizationWay() {
            let that = this;
            let params = {

            };
            that.$apihttp({
                url: process.env.core_url + '/sky/prefrenceArea/list',
                method: 'get',
                params: params
            })
                .then(res => {
                    if (res.code == '200') {
                        that.optimization_list = res.data;
                    }
                })
                .catch(err => {
                    console.log('error', err);
                });
        },
        // ---------------------------------------- 操作 -----------------------------------------
        initForm(row = {}) {
            let that = this;
            let productCategoryId = []
            for (let i = 0; i < that.product_category_list.length; i++) {
                let item = that.product_category_list[i];
                for (let y = 0; y < item.children.length; y++) {
                    let element = item.children[y];
                    if(element.id == row.productCategoryId) {
                        productCategoryId.push(item.id, element.id)
                    }
                }
            }
            that.formOf01.productCategoryId = row.productCategoryId ? productCategoryId : [];
            that.formOf01.name = row.name || '';
            that.formOf01.subtitle = row.subTitle || '';
            that.formOf01.brandId = row.brandId || '';
            that.formOf01.introduce = row.description || '';
            that.formOf01.productSn = row.productSn || '';
            that.formOf01.price = row.price || 0;
            that.formOf01.market_value = row.originalPrice || 0;
            that.formOf01.stock = row.stock || 0;
            that.formOf01.company = row.unit || '';
            that.formOf01.weight = row.weight || '';
            that.formOf01.sort = row.sort || 0;

            that.formOf02.integral = row.giftPoint || 0;
            that.formOf02.grow = row.giftGrowth || 0;
            that.formOf02.buyLimit = row.usePointLimit || 0;
            that.formOf02.advanceNotice = row.previewStatus == 1 ? true : false;
            that.formOf02.putOn = row.publishStatus == 1 ? true : false;
            that.formOf02.newProduct = row.newStatus == 1 ? true : false;
            that.formOf02.recommend = row.recommandStatus == 1 ? true : false;
            that.formOf02.serviceList = [];
            that.formOf02.detailTitle = row.detailTitle || '';
            that.formOf02.description = row.detailDesc || '';
            that.formOf02.keyword = row.keywords || '';
            that.formOf02.remarks = row.note || '';

            that.formOf03.productAttributeCategoryId = row.productAttributeCategoryId || '';

            that.dialog_title = JSON.stringify(row) == "{}" ? "添加用户" : "编辑用户";
            that.dialogVisible = true;
            that.editSaveRow = row
        },
        backWay() {
            if(this.guide_active != 0) {
                this.guide_active--;
            }
        },
        nextWay() {
            if(this.guide_active++ > 3) {
                this.guide_active = 0
            }
        },
        cancelWay() {
            this.dialogVisible = false;
        },
        sureWay() {
            if (this.dialog_title == '添加用户') {
                this.addSure();
            } else if (this.dialog_title == '编辑用户') {
                this.editSure();
            }
        },
        paramsWay() {
            let that = this;
            let brandName = '';
            for (let index = 0; index < that.brand_list.length; index++) {
                let item = that.brand_list[index];
                if(item.id == that.formOf01.brandId) {
                    brandName = item.name;
                }
            }
            let productCategoryName = '';
            for (let i = 0; i < that.product_category_list.length; i++) {
                let item = that.product_category_list[i];
                for (let y = 0; y < item.children.length; y++) {
                    let element = item.children[y];
                    if(element.id == that.formOf01.productCategoryId[1]) {
                        productCategoryName = element.name;
                    }
                }
            }
            let subjectProductRelationList = []
            for (let i = 0; i < that.subject_value.length; i++) {
                let item = that.subject_value[i];
                subjectProductRelationList.push({
                    subjectId: item
                })
            }
            let prefrenceAreaProductRelationList = []
            for (let index = 0; index < that.optimization_value.length; index++) {
                let item = that.optimization_value[index];
                prefrenceAreaProductRelationList.push({
                    prefrenceAreaId: item
                })
            }
            return {
                "albumPics": that.$refs.refUpload.download_url, // @ApiModelProperty(value = "画册图片，连产品图片限制为5张，以逗号分割")
                "brandId": that.formOf01.brandId, // 品牌id
                "brandName": brandName, // @ApiModelProperty(value = "品牌名称")
                "deleteStatus": 0, // @ApiModelProperty(value = "删除状态：0->未删除；1->已删除")
                "description": that.formOf01.introduce, // 商品介绍 @ApiModelProperty(value = "商品描述")
                "detailDesc": that.formOf02.description, 
                "detailHtml": "<p>qqqqqqqqqqqq</p>", // 电脑端详情 @ApiModelProperty(value = "产品详情网页内容")
                "detailMobileHtml": "", // 移动端详情 @ApiModelProperty(value = "移动端网页详情")
                "detailTitle": that.formOf02.detailTitle, // 详细页标题
                "feightTemplateId": 0, // ?id
                "flashPromotionCount": 0, // ? 删
                "flashPromotionId": 0, // ? 删
                "flashPromotionPrice": 0, // ? 删
                "flashPromotionSort": 0, // ? 删
                "giftPoint": that.formOf02.integral, // @ApiModelProperty(value = "赠送的积分")
                "giftGrowth": that.formOf02.grow, // @ApiModelProperty(value = "赠送的成长值") 
                "keywords": that.formOf02.keyword, // 商品关键字
                "lowStock": 0, // @ApiModelProperty(value = "库存预警值")
                "name": that.formOf01.name, // 商品名称
                "newStatus": that.formOf02.newProduct ? 1 : 0, // @ApiModelProperty(value = "新品状态:0->不是新品；1->新品")
                "note": that.formOf02.remarks, // 商品备注
                "originalPrice": that.formOf01.market_value, // @ApiModelProperty(value = "市场价")
                "pic": "", // 规格参数 图片 ？
                "memberPriceList": [ // @ApiModelProperty("商品会员价格设置")
                    // {
                    //     "memberLevelId": 1, 
                    //     "memberLevelName": "黄金会员"
                    // }, 
                    // {
                    //     "memberLevelId": 2, 
                    //     "memberLevelName": "白金会员"
                    // }, 
                    // {
                    //     "memberLevelId": 3, 
                    //     "memberLevelName": "钻石会员"
                    // }
                ], 
                "productFullReductionList": [ // @ApiModelProperty("商品满减价格设置")
                    // {
                    //     "fullPrice": 0, 
                    //     "reducePrice": 0
                    // }
                ], 
                "productLadderList": [ // @ApiModelProperty("商品阶梯价格设置")
                    // {
                    //     "count": 0, 
                    //     "discount": 0, 
                    //     "price": 0
                    // }
                ], 
                "previewStatus": that.formOf02.advanceNotice ? 1 : 0, // @ApiModelProperty(value = "是否为预告商品：0->不是；1->是")
                "price": that.formOf01.price, // 商品售价
                "productAttributeCategoryId": that.formOf03.productAttributeCategoryId, // 属性分类id
                "productAttributeValueList": [ // @ApiModelProperty("商品参数及自定义规格属性")
                    // {
                    //     "productAttributeId": 24, 
                    //     "value": "21"
                    // }, 
                    // {
                    //     "productAttributeId": 25, 
                    //     "value": "春季"
                    // }, 
                    // {
                    //     "productAttributeId": 37, 
                    //     "value": "儿童"
                    // }, 
                    // {
                    //     "productAttributeId": 38, 
                    //     "value": "2018年春"
                    // }, 
                    // {
                    //     "productAttributeId": 39, 
                    //     "value": "中袖"
                    // }
                ], 
                "skuStockList": [ ], // @ApiModelProperty("商品的sku库存信息")
                "subjectProductRelationList": subjectProductRelationList, // @ApiModelProperty("专题和商品关系")
                // [ 
                //     { "subjectId": 1 }
                // ],
                "prefrenceAreaProductRelationList": prefrenceAreaProductRelationList, // @ApiModelProperty("优选专区和商品的关系")
                // [
                //     { "prefrenceAreaId": 1 }
                // ],
                "productCategoryId": that.formOf01.productCategoryId[1], // 商品分类id
                "productCategoryName": productCategoryName, // @ApiModelProperty(value = "商品分类名称")
                "productSn": that.formOf01.productSn, // @ApiModelProperty(value = "货号")
                "promotionEndTime": "", // @ApiModelProperty(value = "促销结束时间")
                "promotionPerLimit": 0, // @ApiModelProperty(value = "活动限购数量")
                "promotionPrice": null, // @ApiModelProperty(value = "促销价格")
                "promotionStartTime": "", // @ApiModelProperty(value = "促销开始时间")
                "promotionType": 0, // @ApiModelProperty(value = "促销类型：0->没有促销使用原价;1->使用促销价；2->使用会员价；3->使用阶梯价格；4->使用满减价格；5->限时购")
                "publishStatus": that.formOf02.putOn ? 1 : 0, // 商品上架 @ApiModelProperty(value = "上架状态：0->下架；1->上架")
                "recommandStatus": that.formOf02.recommend ? 1 : 0, // @ApiModelProperty(value = "推荐状态；0->不推荐；1->推荐")
                "sale": 0, // @ApiModelProperty(value = "销量")
                "serviceIds": "1", // @ApiModelProperty(value = "以逗号分割的产品服务：1->无忧退货；2->快速退款；3->免费包邮")
                "sort": that.formOf01.sort, // @ApiModelProperty(value = "排序")
                "stock": that.formOf01.stock, // @ApiModelProperty(value = "库存")
                "subTitle": that.formOf01.subtitle, // @ApiModelProperty(value = "副标题")
                "unit": that.formOf01.company, // @ApiModelProperty(value = "单位")
                "usePointLimit": that.formOf02.buyLimit, // @ApiModelProperty(value = "限制使用的积分数")
                "verifyStatus": 0, // @ApiModelProperty(value = "审核状态：0->未审核；1->审核通过")
                "weight": that.formOf01.weight // @ApiModelProperty(value = "商品重量，默认为克")
            }
        },
        addSure() {
            let that = this;
            let params = that.paramsWay();
            that.$apihttp({
                url: process.env.core_url + '/sky/product/add',
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
        },
        editSure() {
            let that = this;
            let params = that.paramsWay();
            params.id = that.editSaveRow.id;
            that.$apihttp({
                url: process.env.core_url + '/sky/product/update',
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
#addDialog {
    
}
</style>