<template>
    <section id="orderDetailUnit">
        <el-steps :active="order_obj.status | formatStepStatus" finish-status="success" align-center style="margin-bottom: 25px;">
            <el-step title="提交订单"></el-step>
            <el-step title="支付订单"></el-step>
            <el-step title="平台发货"></el-step>
            <el-step title="确认收货"></el-step>
            <el-step title="完成评价"></el-step>
        </el-steps>

        <el-card shadow="never">
            <section slot="header" class="operate-container">
                <div class="icon-box">
                    <i class="el-icon-warning"></i>
                </div>
                
                <div class="order-status">当前订单状态：{{order_obj.status | formatStatus}}</div>

                <div class="operate-box" v-show="order_obj.status===0">
                    <el-button @click="consigneeWay">修改收货人信息</el-button>
                    <el-button>修改商品信息</el-button>
                    <el-button @click="costWay">修改费用信息</el-button>
                    <el-button @click="messageWay">发送站内信</el-button>
                    <el-button @click="closeWay">关闭订单</el-button>
                    <el-button @click="remarksWay">备注订单</el-button>
                </div>
                <div class="operate-box" v-show="order_obj.status===1">
                    <el-button @click="consigneeWay">修改收货人信息</el-button>
                    <el-button @click="messageWay">发送站内信</el-button>
                    <el-button>取消订单</el-button>
                    <el-button @click="remarksWay">备注订单</el-button>
                </div>
                <div class="operate-box" v-show="order_obj.status===2||order_obj.status===3">
                    <el-button @click="followUpWay">订单跟踪</el-button>
                    <el-button @click="messageWay">发送站内信</el-button>
                    <el-button @click="remarksWay">备注订单</el-button>
                </div>
                <div class="operate-box" v-show="order_obj.status===4">
                    <el-button @click="deleteWay">删除订单</el-button>
                    <el-button @click="remarksWay">备注订单</el-button>
                </div>
            </section>

            <section class="content-box">
                <div class="title-box">基本信息</div>
                <el-row :gutter="20">
                    <el-col :span="4">订单编号:</el-col>
                    <el-col :span="8">{{order_obj.orderSn}}</el-col>
                    <el-col :span="4">发货单流水号:</el-col>
                    <el-col :span="8">暂无</el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="4">用户账号:</el-col>
                    <el-col :span="8">{{order_obj.memberUsername}}</el-col>
                    <el-col :span="4">支付方式:</el-col>
                    <el-col :span="8">{{order_obj.payType | formatPayType}}</el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="4">订单来源:</el-col>
                    <el-col :span="8">{{order_obj.sourceType | formatSourceType}}</el-col>
                    <el-col :span="4">订单类型:</el-col>
                    <el-col :span="8">{{order_obj.orderType | formatOrderType}}</el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="4">配送方式:</el-col>
                    <el-col :span="8">{{order_obj.deliveryCompany | formatNull}}</el-col>
                    <el-col :span="4">物流单号:</el-col>
                    <el-col :span="8">{{order_obj.deliverySn | formatNull}}</el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="4">自动确认收货时间:</el-col>
                    <el-col :span="8">{{order_obj.autoConfirmDay}}天</el-col>
                    <el-col :span="4">订单可得优币:</el-col>
                    <el-col :span="8">{{order_obj.integration}}</el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="4">订单可得成长值:</el-col>
                    <el-col :span="8">{{order_obj.growth}}</el-col>
                    <el-col :span="4">活动信息:</el-col>
                    <el-col :span="8">
                        <el-popover
                        placement="top-start"
                        title="活动信息"
                        width="200"
                        trigger="hover"
                        :content="order_obj.promotionInfo">
                        <span slot="reference">{{order_obj.promotionInfo | formatLongText}}</span>
                        </el-popover>
                    </el-col>
                </el-row>
                <div class="title-box">收货人信息</div>
                <el-row :gutter="20">
                    <el-col :span="4">收货人:</el-col>
                    <el-col :span="8">{{order_obj.receiverName}}</el-col>
                    <el-col :span="4">手机号码:</el-col>
                    <el-col :span="8">{{order_obj.receiverPhone}}</el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="4">邮政编码:</el-col>
                    <el-col :span="8">{{order_obj.receiverPostCode}}</el-col>
                    <el-col :span="4">收货地址:</el-col>
                    <el-col :span="8">{{order_obj | formatAddress}}</el-col>
                </el-row>
                <div class="title-box">商品信息</div>
                <el-table
                    ref="orderItemTable"
                    :data="order_obj.orderItemList"
                    style="width: 100%;margin-top: 20px" border>
                    <el-table-column label="商品图片" width="120" align="center">
                    <template slot-scope="scope">
                        <img :src="scope.row.productPic" style="height: 80px">
                    </template>
                    </el-table-column>
                    <el-table-column label="商品名称" align="center">
                    <template slot-scope="scope">
                        <p>{{scope.row.productName}}</p>
                        <p>品牌：{{scope.row.productBrand}}</p>
                    </template>
                    </el-table-column>
                    <el-table-column label="价格/货号" width="120" align="center">
                    <template slot-scope="scope">
                        <p>价格：￥{{scope.row.productPrice}}</p>
                        <p>货号：{{scope.row.productSn}}</p>
                    </template>
                    </el-table-column>
                    <el-table-column label="属性" width="140" align="center">
                    <template slot-scope="scope">
                        {{scope.row.productAttr | formatProductAttr}}
                    </template>
                    </el-table-column>
                    <el-table-column label="数量" width="120" align="center">
                    <template slot-scope="scope">
                        {{scope.row.productQuantity}}
                    </template>
                    </el-table-column>
                    <el-table-column label="小计" width="120" align="center">
                    <template slot-scope="scope">
                        ￥{{scope.row.productPrice*scope.row.productQuantity}}
                    </template>
                    </el-table-column>
                </el-table>
                <div class="total-amount">
                    合计：<span style="color: #f56c6c;">￥{{order_obj.totalAmount}}</span>
                </div>
                <div class="title-box">费用信息</div>
                <el-row :gutter="20">
                    <el-col :span="4">商品合计:</el-col>
                    <el-col :span="8">￥{{order_obj.totalAmount}}</el-col>
                    <el-col :span="4">运费:</el-col>
                    <el-col :span="8">￥{{order_obj.freightAmount}}</el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="4">优惠券:</el-col>
                    <el-col :span="8">￥{{order_obj.couponAmount}}</el-col>
                    <el-col :span="4">积分抵扣:</el-col>
                    <el-col :span="8">￥{{order_obj.integrationAmount}}</el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="4">活动优惠:</el-col>
                    <el-col :span="8">-￥{{order_obj.promotionAmount}}</el-col>
                    <el-col :span="4">折扣金额:</el-col>
                    <el-col :span="8">-￥{{order_obj.discountAmount}}</el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="4">订单总金额:</el-col>
                    <el-col :span="8">￥{{order_obj.totalAmount+order_obj.freightAmount}}</el-col>
                    <el-col :span="4">应付款金额:</el-col>
                    <el-col :span="8">￥{{order_obj.payAmount+order_obj.freightAmount-order_obj.discountAmount}}</el-col>
                </el-row>
                <div class="title-box">操作信息</div>
                <el-table style="margin-top: 20px;width: 100%"
                            ref="orderHistoryTable"
                            :data="order_obj.historyList" border>
                    <el-table-column label="操作者"  width="120" align="center">
                    <template slot-scope="scope">
                        {{scope.row.operateMan}}
                    </template>
                    </el-table-column>
                    <el-table-column label="操作时间"  width="160" align="center">
                    <template slot-scope="scope">
                        {{scope.row.createTime}}
                    </template>
                    </el-table-column>
                    <el-table-column label="订单状态"  width="120" align="center">
                    <template slot-scope="scope">
                        {{scope.row.orderStatus | formatStatus}}
                    </template>
                    </el-table-column>
                    <el-table-column label="付款状态"  width="120" align="center">
                    <template slot-scope="scope">
                        {{scope.row.orderStatus | formatPayStatus}}
                    </template>
                    </el-table-column>
                    <el-table-column label="发货状态"  width="120" align="center">
                    <template slot-scope="scope">
                        {{scope.row.orderStatus | formatDeliverStatus}}
                    </template>
                    </el-table-column>
                    <el-table-column label="备注" align="center">
                    <template slot-scope="scope">
                        {{scope.row.note}}
                    </template>
                    </el-table-column>
                </el-table>
            </section>
        </el-card>

        <consigneeDialog ref="consignee" @sureWay="detailWay"></consigneeDialog>
        <messageDialog ref="message"></messageDialog>
        <remarksDialog ref="remarks" @sureWay="detailWay"></remarksDialog>
        <followUpDialog ref="followUp"></followUpDialog>
        <closeDialog ref="close" @sureWay="detailWay"></closeDialog>
        <costDialog ref="cost" @sureWay="detailWay"></costDialog>
    </section>
</template>

<script>
import consigneeDialog from "./consigneeDialog.vue";
import messageDialog from "./messageDialog.vue";
import remarksDialog from "./remarksDialog.vue";
import followUpDialog from "./followUpDialog.vue";
import closeDialog from "./closeDialog.vue";
import costDialog from "./costDialog.vue";
export default {
    name: 'orderDetailUnit',
    components: { consigneeDialog, messageDialog, remarksDialog, followUpDialog, closeDialog, costDialog },
    data() {
        return {
            order_obj: {}
        }
    },
    created() {
        this.detailWay();
    },
    filters: {
        formatStepStatus(value) {
            if (value === 1) {
            //待发货
            return 2;
            } else if (value === 2) {
            //已发货
            return 3;
            } else if (value === 3) {
            //已完成
            return 4;
            }else {
            //待付款、已关闭、无限订单
            return 1;
            }
        },
        formatDeliverStatus(value) {
            if (value === 0||value === 1) {
                return '未发货';
            } else {
                return '已发货';
            }
        },
        formatPayStatus(value) {
            if (value === 0) {
                return '未支付';
            } else if(value===4){
                return '已退款';
            }else{
                return '已支付';
            }
        },
        formatProductAttr(value){
            if(value==null){
                return '';
            }else{
                let attr = JSON.parse(value);
                let result='';
                for(let i=0;i<attr.length;i++){
                    result+=attr[i].key;
                    result+=":";
                    result+=attr[i].value;
                    result+=";";
                }
                return result;
            }
        },
        formatAddress(order) {
            let str = order.receiverProvince;
            if (order.receiverCity != null) {
            str += "  " + order.receiverCity;
            }
            str += "  " + order.receiverRegion;
            str += "  " + order.receiverDetailAddress;
            return str;
        },
        formatLongText(value) {
            if(value===undefined||value===null||value===''){
                return '暂无';
            }else if(value.length>8){
                return value.substr(0, 8) + '...';
            }else{
                return value;
            }
        },
        formatNull(value) {
            if(value===undefined||value===null||value===''){
                return '暂无';
            }else{
                return value;
            }
        },
        formatOrderType(value) {
            if (value === 1) {
                return '秒杀订单';
            } else {
                return '正常订单';
            }
        },
        formatSourceType(value) {
            if (value === 1) {
                return 'APP订单';
            } else {
                return 'PC订单';
            }
        },
        formatPayType(value) {
            if (value === 1) {
                return '支付宝';
            } else if (value === 2) {
                return '微信';
            } else {
                return '未支付';
            }
        },
        formatStatus(value) {
            if (value === 1) {
                return '待发货';
            } else if (value === 2) {
                return '已发货';
            } else if (value === 3) {
                return '已完成';
            } else if (value === 4) {
                return '已关闭';
            } else if (value === 5) {
                return '无效订单';
            } else {
                return '待付款';
            }
        }
    },
    methods: {
        detailWay() {
            let that = this;
            let params = {
            };
            that.$apihttp({
                url: process.env.core_url + '/sky/order/details/' + that.$route.query.id,
                method: 'get',
                params: params
            })
                .then(res => {
                    if (res.code == '200') {
                        that.order_obj = res.data;
                    }
                })
                .catch(err => {
                    console.log('error', err);
                });
        },
        // 修改收货人信息
        consigneeWay() {
            this.$refs.consignee.initForm(this.order_obj);
        },
        // 修改费用信息
        costWay() {
            this.$refs.cost.initForm(this.order_obj);
        },
        // 发送站内信
        messageWay() {
            this.$refs.message.initForm();
        },
        // 关闭订单
        closeWay() {
            this.$refs.close.initForm(this.order_obj);
        },
        // 备注订单
        remarksWay() {
            this.$refs.remarks.initForm(this.order_obj);
        },
        // 订单跟踪
        followUpWay() {
            this.$refs.followUp.initForm();
        },
        // 删除订单
        deleteWay() {

        }
    }
}
</script>

<style lang="less" scoped>
#orderDetailUnit {
    width: 920px;
    -border: 1px solid red;
    margin: 0 auto;
    padding: 0 0 15px 0;
    box-sizing: border-box;
    /deep/.el-card__header {
        background: #f2f6fc;
    }
    .operate-container {
        width: 100%;
        height: 40px;
        .icon-box {
            float: left;
            height: 40px;
            padding: 11px 0 0 0;
            box-sizing: border-box;
            i {
                font-size: 18px;
                color: #f56c6c;
            }
        }
        
        .order-status {
            float: left;
            font-size: 15px;
            color: #f56c6c;
            height: 40px;
            padding: 8px 0 0 8px;
            box-sizing: border-box;
        }

        .operate-box {
            float: right;
            height: 40px;
            padding: 5px 0 0 0;
            box-sizing: border-box;
        }
    }
    .content-box {
        width: 100%;
        .title-box {
            width: 100%;
            height: 40px;
            line-height: 40px;
            font-size: 15px;
            font-weight: 600;
        }
        .el-row {
            padding: 5px 0 5px 0;
            box-sizing: border-box;
        }
        .el-col-4 {
            text-align: right;
        }
        .total-amount {
            width: 100%;
            height: 60px;
            font-size: 15px;
            line-height: 60px;
            text-align: right;
        }
    }
}
</style>


