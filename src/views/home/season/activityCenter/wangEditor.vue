<template>
    <section id="editorUnit">
        <div :class="'editorBox'+countIndex"></div>
    </section>
</template>

<script>
import wangEditor from 'wangeditor'
export default {
    name: "wangEditor",
    props: {
        countIndex: {
            type: String,
            default: '0'
        }
    },
    data() {
        return {
            isEditor: null,
            config: {
                menus: ['undo', 'redo', 'list', 'table']
            }
        }
    },
    methods: {
        createEditor() {
            console.log('--editor--className--', '.editorBox'+this.countIndex)
            this.isEditor = new wangEditor('.editorBox'+this.countIndex);
            this.isEditor.config.menus = this.config.menus;
            this.isEditor.create();
        },
        setContent(value) {
            this.isEditor.txt.html(value);
        },
        getContent() {
            console.log('---this.isEditor---', this.isEditor.txt.html());
            return this.isEditor.txt.html();
        },
        destroyWay() {
            console.log('--destroyWay--')
            if (this.isEditor) {
                this.isEditor.destroy();
                this.isEditor = null;
            }
        }
    },
    beforeDestroy() {
        console.log('---beforeDestroy---');
        this.destroyWay();
    }
}
</script>

<style lang="scss" scoped>
#editorUnit{
    width: 100%;
    height: 345px;
    text-align: left;
}
</style>

