<template>
    <section>
        <el-button @click="sunCustom">{{params.label}}</el-button>
    </section>
</template>

<script>
export default {
    name: 'demo_2s',
    props: {
        params: {
            type: Object,
            default: () => {}
        }
    },
    methods: {
        sunCustom(){
            this.$emit('incident','custom')
        }
    }
}
</script>