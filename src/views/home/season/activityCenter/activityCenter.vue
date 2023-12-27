<template>
<div class="activity-management">
  <el-tabs :tab-position="tabPosition" style="width: 100%;height: 100%;" @tab-click="tabEvent" v-model="tab_value">
    <el-tab-pane label="全部活动"  name="sign">
        <all-activities ref="sign" :tab_value="legend_value"></all-activities>
    </el-tab-pane>
    <el-tab-pane label="新人首存" name="sign1">
      <all-activities ref="sign1" :tab_value="legend_value"></all-activities>
    </el-tab-pane>
    <el-tab-pane label="复存" name="sign2">
      <all-activities ref="sign2" :tab_value="legend_value"></all-activities>
    </el-tab-pane>
    <el-tab-pane label="流水活动" name="sign3">
      <all-activities ref="sign3" :tab_value="legend_value"></all-activities>
    </el-tab-pane>
    <el-tab-pane label="实物" name="sign4">
      <all-activities ref="sign4" :tab_value="legend_value"></all-activities>
    </el-tab-pane>
    <el-tab-pane label="vip豪礼" name="sign5">
      <all-activities ref="sign5" :tab_value="legend_value"></all-activities>
    </el-tab-pane>
    <el-tab-pane label="其他" name="sign6">
      <all-activities ref="sign6" :tab_value="legend_value"></all-activities>
    </el-tab-pane>
  </el-tabs>
</div>
</template>
<script>
  import allActivities from "./allActivities.vue";

  export default {
    components: {
      allActivities
    },
    data() {
      return {
        tabPosition: 'left',
        tab_value: 'sign',
        legend_value: ''
      };
    },
    mounted() {
      this.$refs.sign.platformType();
      this.$refs.sign.getJson();
    },
    methods: {
        tabEvent(value) {
            let name1 = value.props.name;
          console.log('tabEvent', name1);
          this.legend_value = name1.split('sign')[1];
          this.$nextTick(function(){
            this.$refs[name1].platformType();
            this.$refs[name1].getJson();
          })

        }
    }
  };
</script>

<style lang="scss" scoped>
.activity-management {
  width: 100%;
  height: 100%;

  :deep(.el-tabs__content, .el-tab-pane) {
    height: 100%;
  }
}
</style>
