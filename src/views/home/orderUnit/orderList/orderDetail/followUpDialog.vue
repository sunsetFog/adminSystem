<template>
    <section id="followUpDialog">
        <el-dialog
            title="订单跟踪"
            :visible.sync="dialogVisible"
            width="500px"
            :close-on-click-modal="false"
            >
            <el-steps direction="vertical"
                    :active="6"
                    finish-status="success"
                    space="50px">
            <el-step  v-for="item in logisticsList"
                        :key="item.name"
                        :title="item.name"
                        :description="item.time"></el-step>
            </el-steps>
        </el-dialog>
    </section>
</template>

<script>
export default {
    name: "followUpDialog",
    data() {
        return {
            dialogVisible: false,
            // ----------
            logisticsList: [
                {name: '订单已提交，等待付款',time:'2017-04-01 12:00:00 '},
                {name: '订单付款成功',time:'2017-04-01 12:00:00 '},
                {name: '在北京市进行下级地点扫描，等待付款',time:'2017-04-01 12:00:00 '},
                {name: '在分拨中心广东深圳公司进行卸车扫描，等待付款',time:'2017-04-01 12:00:00 '},
                {name: '在广东深圳公司进行发出扫描',time:'2017-04-01 12:00:00 '},
                {name: '到达目的地网点广东深圳公司，快件将很快进行派送',time:'2017-04-01 12:00:00 '},
                {name: '订单已签收，期待再次为您服务',time:'2017-04-01 12:00:00 '}
            ]
        }
    },
    methods: {
        initForm(order_obj = {}) {
            this.dialogVisible = true;
        },
        cancelWay() {
            this.dialogVisible = false;
        },
        sureWay() {
            let that = this;
            that.dialogVisible = false;
        }
    }
}
</script>

<style lang="less" scoped>
#followUpDialog {

}
</style>


