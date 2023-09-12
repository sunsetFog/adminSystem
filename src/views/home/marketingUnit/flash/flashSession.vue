<template>
    <section id="flashSession" ref="refUnit">
        <searchDesign ref="refHeader" :sousuo="false" :tianjia="false"></searchDesign>
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
            <el-table-column prop="name" label="秒杀时间段名称" min-width="120"></el-table-column>
            <el-table-column prop="startTime" label="每日开始时间" min-width="120"></el-table-column>
            <el-table-column prop="endTime" label="每日结束时间" min-width="120"></el-table-column>
            <el-table-column prop="productCount" label="商品数量" min-width="80"></el-table-column>

            <el-table-column width="180" fixed="right">
                <template slot="header">操作</template>
                <template slot-scope="scope">
                    <el-button type="text" @click="goodsWay(scope.row)">商品列表</el-button>
                </template>
            </el-table-column>
        </el-table>

    </section>
</template>

<script>
export default {
    name: "flashSession",
    data() {
        return {
            queryData: {
                keyword: ''
            },
            // -----------------
            tableData: [],
            tableHeight: 0
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
        goodsWay(row) {
            this.$router.push({
                path: '/home/marketingUnit/flash/flashProductRelation/index?flashPromotionId=' + this.$route.query.flashPromotionId + "&flashPromotionSessionId=" + row.id
            })
        },
        queryWay() {
            console.log("---搜索---");
            let that = this;
            let params = {
                flashPromotionId: that.$route.query.flashPromotionId
            };
            that.$apihttp({
                url: process.env.core_url + '/sky/flashPromotionSession/status/count',
                method: 'get',
                params: params
            })
                .then(res => {
                    if (res.code == '200') {
                        that.tableData = res.data;
                        for (let index = 0; index < that.tableData.length; index++) {
                            let item = that.tableData[index];
                        }
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
#flashSession {
    height: 100%;
}
</style>

