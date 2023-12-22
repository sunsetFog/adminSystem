
<template>
<section>
    <div style="width: 100%;height: 100px;">
        <el-button @click="sunSearch()" style="min-width: 80px;margin-left: 5px;" v-for="(item, index) in crmBtn" :key="index">
            <i :class="item.icon" style="margin-right: 8px;"></i>{{item.label}}
        </el-button>
    </div>

</section>
</template>

<script>
export default {
    name: 'crmTable',
    data(){
        return {
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
}
</script>

<style lang="less" scoped>

</style>
