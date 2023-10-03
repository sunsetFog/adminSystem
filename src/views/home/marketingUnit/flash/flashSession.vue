<template>
    <section id="flashSession" ref="refUnit">
        <searchDesign ref="refHeader" :sousuo="false" :tianjia="false"></searchDesign>
        <main>
            <el-table
            :data="tableData"
            border
            style="width: 100%"
            height="100%"
            ref="refTable"
        >
            <el-table-column width="50" type="index" label="序号"></el-table-column>
            <el-table-column prop="name" label="秒杀时间段名称" min-width="120"></el-table-column>
            <el-table-column prop="startTime" label="每日开始时间" min-width="120"></el-table-column>
            <el-table-column prop="endTime" label="每日结束时间" min-width="120"></el-table-column>
            <el-table-column prop="productCount" label="商品数量" min-width="80"></el-table-column>

            <el-table-column width="180" fixed="right">
                <template #header>操作</template>
                <template v-slot="scope">
                    <el-button link @click="goodsWay(scope.row)">商品列表</el-button>
                </template>
            </el-table-column>
        </el-table>
        </main>


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
        }
    },
    created() {
        this.queryWay();
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
                url: '/sky/flashPromotionSession/status/count',
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
    display: flex;
    flex-direction: column;
    main {
        flex: 1;
    }
}
</style>

