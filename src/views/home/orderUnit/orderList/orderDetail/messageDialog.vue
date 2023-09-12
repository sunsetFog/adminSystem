<template>
    <section id="messageDialog">
        <el-dialog
            title="发送站内信"
            :visible.sync="dialogVisible"
            width="500px"
            :close-on-click-modal="false"
            >
            <section class="mercury">
                <el-form :model="withForm" :rules="rulesCheck" ref="withForm" label-width="100px">
                    <el-form-item label="标题:" prop="title">
                        <el-input v-model="withForm.title"></el-input>
                    </el-form-item>
                    <el-form-item label="内容:" prop="content">
                        <el-input type="textarea" v-model="withForm.content" maxlength="100" show-word-limit></el-input>
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
    name: "messageDialog",
    data() {
        return {
            dialogVisible: false,
            // ----------
            withForm: {
                title: null,
                content: null
            },
            rulesCheck: {

            }
        }
    },
    methods: {
        initForm(order_obj = {}) {
            this.dialogVisible = true;
            this.withForm = {
                title: null,
                content: null
            }
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
#messageDialog {

}
</style>


