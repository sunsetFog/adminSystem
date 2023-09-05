<template>
    <section></section>
</template>

<script lang="ts">
import {
    defineComponent
} from "vue";

export default defineComponent({
    name: 'defaultPath',
    beforeCreate() {
        this.$router.push({ path: "/home/world/world"})
    }
});
</script>