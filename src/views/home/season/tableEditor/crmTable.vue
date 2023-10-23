
<template>
<section :style="{height: sunHeight+'px'}" class="sun-water">
    <div style="width: 100%;height: 100px;">
        <el-button @click="sunSearch()" style="min-width: 80px;margin-left: 5px;" v-for="(item, index) in crmBtn" :key="index">
            <i :class="item.icon" style="margin-right: 8px;"></i>{{item.label}}
        </el-button>
    </div>
        <table-editor
            ref="refTable"
            :table-header="tableHeader"
            :queryData="queryData"
            query-url="http://10.16.91.160/web/ifin-expense/bankBranches/find"
            :showOperation="false"
            :show-index="true"
            :checkbox="true"
            :auto-query="true"
            :showHeaderTooltip="true"
            row-edit-type="DBLCLICK"
            @row-click = "rowClick"
        >
        <!--         -------slot插槽的用法---------            -->
        <!-- <div slot="operationBody" slot-scope="slotProps">
            <el-button @click="lyDelete(slotProps.lyItem)">删除</el-button>
        </div> -->

        </table-editor>
</section>
</template>

<script>
import TableEditor from '@/components/table/TableEditor'
import demoAssembly from '@/components/table/demoAssembly'
export default {
    name: 'crmTable',
    components: { TableEditor,demoAssembly },
    data(){
        return {
            sunHeight: document.documentElement.clientHeight - 80,
            tableHeader: [],
            queryData: {
                bankName: '',
                bankNameCond: 'cn',
                pageNum: 1,
                pageSize: 15,
                total: 0
            },
            crmBtn: [
                { label: '搜索', icon: 'el-icon-search' },
                { label: '重置', icon: 'el-icon-reset' },
                { label: '新增行', icon: 'el-icon-add' },
                { label: '编辑', icon: 'el-icon-edit' },
                { label: '保存', icon: 'el-icon-save' },
                { label: '删除', icon: 'el-icon-delete' },
                { label: '批量删除', icon: '' },
                { label: '下载', icon: 'el-icon-download' },
                { label: '批量下载', icon: '' },
                { label: '附件上传', icon: '' },
                { label: '提交', icon: '' },
                { label: '文件预览', icon: '' },
                { label: 'Excel导出', icon: 'el-icon-daochu' },
                { label: '驳回', icon: 'fa fa-undo' },
                { label: '发布', icon: 'fa fa-send' },
                { label: '禁用', icon: 'el-icon-disable' },
                { label: '生效', icon: '' },
                { label: '失效', icon: '' },
                { label: '排序', icon: '' }
            ]
        }
    },
    created(){
        let that = this
        let defaultHeaders = [
            {
                prop: "sex",
                label: "性别",
                minWidth: "100px",
                fixed: true,
                type: "select",
                options: [
                    { label: '男', value: 'Y' },
                    { label: '女', value: 'N' }
                ],
                filter: {
                    type: "select",
                    clearable: true,
                    disabled: false,
                    filterable: true,

                    remote: true,
                    remoteMethod: function(flag,col){
                        console.log('flag=---',flag,col);
                        if(flag){
                            that.selectCOA(1,col,flag);
                        }
                    },
                    visibleChange: function(flag,col){
                        console.log('flag=---',flag,col);
                        if(flag){
                            that.selectCOA(1,col);
                        }
                    },
                    options: [
                        { label: '男', value: 'Y' },
                        { label: '女', value: 'N' }
                    ]
                },
               rule: {
                    required: true,
                    message: '请选择下拉框值',
                    trigger: 'change'
                },
                change: function(row, key, value, colIndex, rowIndex){
                    console.log('表体change校验',row, key, value, colIndex, rowIndex);
                },
                blur: function(row, key, value, colIndex, rowIndex){
                    console.log('表体blur校验',row, key, value, colIndex, rowIndex);
                }
            },
            {
                prop: "address",
                label: "地址",
                // fixed: true,
                minWidth: "300px",
                filter: {
                    type: "text",
                    clearable: true
                }
            },
            {
                prop: "date",
                label: "日期",
                minWidth: "300px",
                filter: {
                    type: "date",
                    dateType: "daterange",
                    ignoreSearch: false
                }
            },
            {
                prop: "country",
                label: "国家",
                minWidth: "120px",
                component: {
                    reference: demoAssembly,
                    params: { label: '自定义组件' },
                    event: function (custom){
                        that.mipCallback(custom)
                    }
                }
            },
            {
                prop: "province",
                label: "省份",
                minWidth: "120px",
                filter: {
                    type: "text",
                    clearable: true
                },
                formattor(val) {
                    // console.log('SIGN',val);
                    return val + '+SIGN'
                }
            },
            {
                    prop: "Operation",
                    minWidth: "250",
                    label: '操作',
                    formatter: function (createElement, row, column, index) {
                        return createElement("div", {}, [
                                createElement("el-button", {
                                    attrs: {
                                        type: "primary",
                                        icon: "",
                                        disabled: row.disabled ? true : false
                                    },
                                    domProps: {
                                        innerHTML: '修改'
                                    },
                                    style: { marginRight: "10px" },
                                    on: {
                                        click: () => {
                                            that.lyDelete(row);
                                        }
                                    }
                                }),
                                createElement("el-button", {
                                    attrs: {
                                        type: "primary",
                                        icon: "",
                                        disabled: row.disabled ? true : false
                                    },
                                    domProps: {
                                        innerHTML: '删除'
                                    },
                                    style: {  },
                                    on: {
                                        click: () => {
                                            that.lyDelete(row);
                                        }
                                    }
                                })
                        ])
                    }
                }
        ];
        that.tableHeader = defaultHeaders
    },
    methods: {
        sunSearch(){
            this.$refs.refTable.sunQuery();
        },
        lyAddRow(){
            this.$refs.refTable.lyAddRow();
        },
        // 重置
        lyReset(){
            this.$refs.refTable.clearFilterColumnData();
        },
        // 删除
        lyDelete(slotProps){
            console.log('lyDelete(slotProps)', slotProps);
        },
        selectCOA(num,col,gift) {

        },
        rowClick (row) {

        },
        // component: event
        mipCallback (custom) {
            console.log('custom',custom);
        }
    }
}
</script>

<style lang="less" scoped>
.sun-water {
    display: flex;
    flex-direction: column;
}
</style>
