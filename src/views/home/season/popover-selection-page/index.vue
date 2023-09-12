<template>
    <section id="popover-selection-page">
<!--
   slot="reference" 手动触发 Popover
   下拉框v-model和el-option的数组有关联的，此时要全部数据

    bug: ***
    问题：使该页的el-select下拉框隐藏，不能影响全局，用/deep/和!important样式都无效？
    失效原因：等级提最高都没生效，因为样式有嵌套关系的，要到适当位置写
    解决方案1：
        当前页的mounted里用js操作DOM，body标签添加一个类名popover-page
        let isBody = document.getElementsByTagName("body")[0];
        isBody.classList.add('popover-page');

        App.vue里
        .popover-page .el-select-dropdown {

        }
    解决方案2：下拉框自定一个类名popper-class="cool-dropdown"，App.vue里
    .cool-dropdown {
        display: none !important;
    }
    两者都是自定义类名，使不影响全局

    遇到的问题: bug: ***
    如何解决el-table分页使勾选消失的问题？
    https://blog.csdn.net/LingSnow1019/article/details/119569621
    加上
    :row-key="getRowKeys"
    :reserve-selection="true"

    遇到的问题: bug: ***
    回显勾选只勾选当前页，而不是所有分页一起勾选
-->
<el-popover
  placement="bottom"
  width="600"
  @after-enter="afterEnter"
  trigger="manual"
  v-model="box_visible"
  >

<el-select slot="reference" v-model="choice_arr" multiple placeholder="请选择" @click.native="choiceWay" @remove-tag="removeTag" popper-class="cool-dropdown">
    <el-option
      v-for="item in all_data"
      :key="item.id"
      :label="item.name"
      :value="item.id">
    </el-option>
</el-select>

<el-row :gutter="20" style="margin-bottom: 20px;">
    <el-col :span="12">
        <el-input placeholder="请输入品牌名称" v-model="keyword">
            <el-button slot="append" icon="el-icon-search" @click="queryWay()"></el-button>
        </el-input>
    </el-col>
    <el-col :span="12">
        <el-button type="primary" style="margin-left: 50px;" @click="sureWay">确定</el-button>
        <el-button style="margin-left: 20px;" @click="clearWay">清空</el-button>
        <el-button style="margin-left: 20px;" @click="closeWay">关闭</el-button>
    </el-col>
</el-row>

<el-table
    :row-key="getRowKeys"
    ref="multipleTable"
    :data="table_data"
    tooltip-effect="dark"
    style="width: 100%"
    height="420"
    @select="handleSelection"
    @select-all="handleSelection">
    <el-table-column
      type="selection"
      :reserve-selection="true"
      width="55">
    </el-table-column>
    <el-table-column prop="name" label="品牌名称" min-width="100"></el-table-column>
    <el-table-column prop="brandStory" label="品牌故事" min-width="100"></el-table-column>
  </el-table>
  <pagination :pagingObj="pagingObj" @emitWay="queryWay"></pagination>

</el-popover>


    </section>
</template>

<script>
export default {
    name: "popover-selection-page",
    data () {
        return {
            box_visible: false,
            beanActive: false,

            choice_arr: [6, 58, 4],
            table_data: [],
            all_data: [],
            pagingObj: { pageNum: 1, pageSize: 10, total: 0 },
            keyword: ''
        }
    },
    created() {
        this.queryWay();
        this.allWay();
    },
    methods: {
        // 分页查询数据
        queryWay() {
            console.log("---搜索---");
            let that = this;
            let params = {
                keyword: that.keyword,
                pageNum: that.pagingObj.pageNum,
                pageSize: that.pagingObj.pageSize
            };
            that.$apihttp({
                url: process.env.core_url + '/sky/brand/list',
                method: 'get',
                params: params
            })
                .then(res => {
                    if (res.code == '200') {
                        that.pagingObj.total = res.data.totalSize;
                        that.table_data = res.data.content;
                        that.afterEnter();
                    }
                })
                .catch(err => {
                    console.log('error', err);
                });
        },
        // 获取全部数据
        allWay() {
            console.log("---搜索---");
            let that = this;
            let params = {
                keyword: '',
                pageNum: 1,
                pageSize: 9999
            };
            that.$apihttp({
                url: process.env.core_url + '/sky/brand/list',
                method: 'get',
                params: params
            })
                .then(res => {
                    if (res.code == '200') {
                        that.all_data = res.data.content;
                    }
                })
                .catch(err => {
                    console.log('error', err);
                });
        },
        // 下拉框点击事件，也可以用焦点事件
        choiceWay(value) {
            console.log("当 input 获得焦点时触发", value);
            this.box_visible = true
        },
        // 下拉框删除标签
        removeTag() {
            this.afterEnter();
        },
        // 勾选和全选
        handleSelection(selection) {
            // 删除当前页所有勾选
            let delArr = [];
            for (let i = 0; i < this.choice_arr.length; i++) {
                let item = this.choice_arr[i];
                for (let y = 0; y < this.table_data.length; y++) {
                    let row = this.table_data[y]
                    if (item == row.id) {
                        delArr.push(row.id)
                    }
                }
            }
            console.log("--del--", delArr)
            for (let index = 0; index < delArr.length; index++) {
                let row = delArr[index];
                this.choice_arr = this.choice_arr.filter(function(item, index){
                    return item !=  row;
                });
            }
            console.log("--this.choice_arr-1-", JSON.parse(JSON.stringify(this.choice_arr)))
            console.log("--selection--", selection);
            // 当前页重新勾选
            for (let i = 0; i < selection.length; i++) {
                let item = selection[i];
                for (let y = 0; y < this.table_data.length; y++) {
                    let row = this.table_data[y]
                    if (item.id == row.id) {
                        this.choice_arr.push(row.id);
                    }
                }
            }
            console.log("--this.choice_arr-2-", JSON.parse(JSON.stringify(this.choice_arr)))
        },
        getRowKeys(row) {
            return row.id
        },
        afterEnter() {
            // 清空所有勾选
            this.$refs.multipleTable.clearSelection();
            // 当前页勾选
            for (let i = 0; i < this.choice_arr.length; i++) {
                let item = this.choice_arr[i];
                for (let y = 0; y < this.table_data.length; y++) {
                    let row = this.table_data[y]
                    if (item == row.id) {
                        this.$refs.multipleTable.toggleRowSelection(row, true);
                    }
                }
            }
        },
        // 关闭
        closeWay() {
            this.box_visible = false
        },
        // 清空
        clearWay() {
            this.choice_arr = []
            // 清空所有勾选
            this.$refs.multipleTable.clearSelection();
        },
        // 确定
        sureWay() {
            this.box_visible = false
        }
    }
}
</script>

<style lang="less" scoped>
#popover-selection-page{
    width: 100%;
    height: 100%;
}
</style>
