<template>
    <el-card id="applyDetail">
        <div class="title-box">退货商品</div>
        <el-table
            :data="goods_list"
            border
            style="width: 100%"
            ref="refTable"
        >
            <el-table-column label="商品图片" min-width="80">
                <template slot-scope="scope">
                    <img style="height:80px" :src="scope.row.productPic">
                </template>
            </el-table-column>
            <el-table-column label="商品名称" min-width="110">
                <template slot-scope="scope">
                    <span>{{scope.row.productName}}</span><br>
                    <span>品牌：{{scope.row.productBrand}}</span>
                </template>
            </el-table-column>
            <el-table-column label="价格/货号" min-width="100">
                <template slot-scope="scope">
                    <span>价格：￥{{scope.row.productRealPrice}}</span><br>
                    <span>货号：NO.{{scope.row.productId}}</span>
                </template>
            </el-table-column>
            <el-table-column label="属性" min-width="110">
                <template slot-scope="scope">{{scope.row.productAttr}}</template>
            </el-table-column>
            <el-table-column label="数量" min-width="60">
                <template slot-scope="scope">{{scope.row.productCount}}</template>
            </el-table-column>
            <el-table-column label="小计" min-width="80">
                <template slot-scope="scope">￥{{scope.row.productRealPrice * scope.row.productCount}}</template>
            </el-table-column>
        </el-table>
        <div class="title-box">服务单信息</div>
        <el-row :gutter="20">
            <el-col :span="4">服务单号:</el-col>
            <el-col :span="8">{{reason.id}}</el-col>
            <el-col :span="4">申请状态:</el-col>
            <el-col :span="8">{{reason.status | formatStatus}}</el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="4">订单编号:</el-col>
            <el-col :span="8">
                {{reason.orderSn}}
                <el-button type="text" @click="handleViewOrder">查看</el-button>
            </el-col>
            <el-col :span="4">申请时间:</el-col>
            <el-col :span="8">{{reason.createTime}}</el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="4">用户账号:</el-col>
            <el-col :span="8">{{reason.memberUsername}}</el-col>
            <el-col :span="4">联系人:</el-col>
            <el-col :span="8">{{reason.returnName}}</el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="4">联系电话:</el-col>
            <el-col :span="8">{{reason.returnPhone}}</el-col>
            <el-col :span="4">退货原因:</el-col>
            <el-col :span="8">{{reason.reason}}</el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="4">问题描述:</el-col>
            <el-col :span="8">{{reason.description}}</el-col>
            <el-col :span="4">凭证图片:</el-col>
            <el-col :span="8">
                <img v-for="item in reason.proofPicsList" style="width:80px;height:80px" :src="item">
            </el-col>
        </el-row>
        <div class="title-box">收货人信息</div>
        <el-row :gutter="20">
            <el-col :span="4">订单金额:</el-col>
            <el-col :span="8">￥{{reason.productRealPrice * reason.productCount}}</el-col>
            <el-col :span="4">确认退款金额:</el-col>
            <el-col :span="8">
                ￥
                <el-input size="small" v-model="reason.returnAmount"
                      :disabled="reason.status!==0"
                      style="width:200px;margin-left: 10px">
                </el-input>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="4">选择收货点:</el-col>
            <el-col :span="8">
                <el-select size="small"
                        style="width:200px"
                        :disabled="reason.status!==0"
                        v-model="reason.companyAddressId">
                    <el-option v-for="item in companyAddressList"
                                :key="item.id"
                                :value="item.id"
                                :label="item.addressName">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="4">收货人姓名:</el-col>
            <el-col :span="8">{{reason.name}}</el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="4">所在区域:</el-col>
            <el-col :span="8">{{reason.companyAddress.province + ' ' + reason.companyAddress.city + ' ' + reason.companyAddress.region}}</el-col>
            <el-col :span="4">详细地址:</el-col>
            <el-col :span="8">{{reason.companyAddress.detailAddress}}</el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="4">联系电话:</el-col>
            <el-col :span="8">{{reason.companyAddress.phone}}</el-col>
        </el-row>
        <div class="title-box">处理信息</div>

        <el-row :gutter="20" v-if="reason.status!==0">
            <el-col :span="4">处理人员:</el-col>
            <el-col :span="8">{{reason.handleMan}}</el-col>
            <el-col :span="4">处理时间:</el-col>
            <el-col :span="8">{{reason.handleTime}}</el-col>
        </el-row>
        <el-row :gutter="20" v-if="reason.status!==0">
            <el-col :span="4">处理备注:</el-col>
            <el-col :span="8">{{reason.handleNote}}</el-col>
        </el-row>

        <el-row :gutter="20" v-if="reason.status == 2">
            <el-col :span="4">收货人员:</el-col>
            <el-col :span="8">{{reason.receiveMan}}</el-col>
            <el-col :span="4">收货时间:</el-col>
            <el-col :span="8">{{reason.receiveTime}}</el-col>
        </el-row>
        <el-row :gutter="20" v-if="reason.status == 2">
            <el-col :span="4">收货备注:</el-col>
            <el-col :span="8">{{reason.receiveNote}}</el-col>
        </el-row>

        <el-row :gutter="20" v-if="reason.status == 0">
            <el-col :span="4">处理备注:</el-col>
            <el-col :span="8">
                <el-input v-model="reason.handleNote"></el-input>
            </el-col>
        </el-row>

        <el-row :gutter="20" v-if="reason.status == 1">
            <el-col :span="4">收货备注:</el-col>
            <el-col :span="8">
                <el-input v-model="reason.receiveNote"></el-input>
            </el-col>
        </el-row>


        <div style="margin-top:15px;text-align: center" v-if="reason.status==0">
            <el-button type="primary" @click="sureWay(1)">确认退货</el-button>
            <el-button type="danger" @click="sureWay(3)">拒绝退货</el-button>
        </div>
        <div style="margin-top:15px;text-align: center" v-if="reason.status==1">
            <el-button type="primary" @click="sureWay(2)">确认收货</el-button>
        </div>
    </el-card>
</template>

<script>
export default {
    name: "applyDetail",
    data() {
        return {
            goods_list: [],
            reason: {
                companyAddress: {}
            },
            companyAddressList: []
        }
    },
    created() {
        this.detailWay()
        this.addressWay()
    },
    filters: {
        formatStatus(status) {
            if (status === 0) {
                return "待处理";
            } else if (status === 1) {
                return "退货中";
            } else if (status === 2) {
                return "已完成";
            } else {
                return "已拒绝";
            }
        }
    },
    methods: {
        handleViewOrder(){
            this.$router.push({
                path: '/home/orderUnit/orderList/orderDetail/index?id=' + this.reason.orderId
            });
        },
        detailWay() {
            let that = this;
            let params = {
            };
            that.$apihttp({
                url: process.env.core_url + '/sky/returnApply/details/' + that.$route.query.id,
                method: 'get',
                params: params
            })
                .then(res => {
                    if (res.code == '200') {
                        that.reason = res.data;
                        if(that.reason.proofPics != null) {
                            that.reason.proofPicsList = that.reason.proofPics.split(",");
                        }
                        
                        that.goods_list = [];
                        that.goods_list.push(that.reason);
                    }
                })
                .catch(err => {
                    console.log('error', err);
                });
        },
        addressWay() {
            let that = this;
            let params = {
            };
            that.$apihttp({
                url: process.env.core_url + '/sky/companyAddress/list',
                method: 'get',
                params: params
            })
                .then(res => {
                    if (res.code == '200') {
                        that.companyAddressList = res.data;
                    }
                })
                .catch(err => {
                    console.log('error', err);
                });
        },
        sureWay(status) {
            let that = this;
            let params = {
                id: that.reason.id,
                companyAddressId: that.reason.companyAddressId,
                handleMan: that.reason.handleMan,
                handleNote: that.reason.handleNote,
                receiveMan: that.reason.receiveMan,
                receiveNote: that.reason.receiveNote,
                returnAmount: that.reason.returnAmount,
                status: status
            };
            that.$apihttp({
                url: process.env.core_url + '/sky/returnApply/update/status',
                method: 'post',
                data: params
            })
                .then(res => {
                    if (res.code == '200') {
                        that.detailWay()
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
#applyDetail {
    width: 800px;
    margin: 10px auto;
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
    .el-col {
        min-height: 30px;
        line-height: 30px;
    }
}
</style>

