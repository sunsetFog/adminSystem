
<template>
  <el-row width="100%" v-if="col.filter">
    <!-- 自定义 -->
    <slot name="filterHeader" :lyItem="col"></slot>
    <!-- 输入框 -->
    <el-input
      v-if="col.filter.type == 'text'"
      v-model="queryData[col.prop]"
      :maxlength="col.filter.maxlength"
      :clearable="col.filter.clearable"
      :disabled="col.filter.disabled"
      size="mini"
      style="width:100%;"
      @keyup.enter.native="onQuery"
    />
    <!-- 计数器 -->
    <el-input-number
      v-model="queryData[col.prop]"
      v-else-if="col.filter.type == 'number'"
      :min="col.filter.min"
      :max="col.filter.max"
      :controls="col.filter.controls"
      :step="col.filter.step"
      :precision="col.filter.precision"
      size="mini"
      style="width:100%;"
      :disabled="col.filter.disabled"
      controls-position="right"
      @keyup.enter.native="onQuery"
    />
    <!-- 选择器 -->
    <el-select
      v-model="queryData[col.prop]"
      v-else-if="col.filter.type == 'select'"
      :clearable="col.filter.clearable"
      :filterable="col.filter.filterable"
      :disabled="col.filter.disabled"
      :collapse-tags="col.filter.collapsetags"
      size="mini"
      style="width:100%;"
      placeholder
      @keyup.enter.native="onQuery"
      @change="sunQuery(col.filter.changeQuery)"
      :remote="col.filter.remote"
      :remote-method="(val)=>{col.filter.remoteMethod ? col.filter.remoteMethod(val,col):''}"
      @visible-change="(status)=>{col.filter.visibleChange ? col.filter.visibleChange(status,col) : ''}"
      :multiple="col.filter.multiple?true:false"
      :multiple-limit="col.filter.multiplelimit"
    >
      <el-option
        v-for="item in typeof(col.filter.options) === 'function' ? col.filter.options() : col.filter.options"
        :key="item.value + '.' + Math.random()"
        :value="item.value"
        :label="item.label"
      ></el-option>
    </el-select>
    <!-- 日期选择器 -->
    <el-date-picker
      v-else-if="col.filter.type == 'date'"
      v-model="queryData[col.prop]"
      :type="col.filter.dateType"
      range-separator="~"
      size="mini"
      style="width:100%;" 
      :disabled="col.filter.disabled"
      :editable="col.filter.editable"
      :clearable="col.filter.clearable"
      @keydown.enter.native="onQuery"
      @change="sunQuery(col.filter.changeQuery)"
      :value-format="col.filter.dateType=='daterange'?dateFormat:col.filter.dateType=='datetimerange'?dateFormat + ' ' + timeFormat: false"
      :format="col.filter.dateType=='daterange'?dateFormat:col.filter.dateType=='datetimerange'?dateFormat + ' ' + timeFormat: false"
      :default-time="col.filter.dateType=='datetimerange'?['00:00:00', '23:59:59']:''"
    ></el-date-picker>
    <template v-else-if="col.filter.type == 'component'">
      <component
        :is="col.filter.component"
        v-bind="componentBind(col.filter.bind)"
        v-on="componentEvent(col.filter.event || null)"
      ></component>
    </template>
    <!-- 输入框 -->
    <el-input v-else :disabled="true" v-model="queryData[col.prop]" size="mini"/>
  </el-row>
</template>
<script>
export default {
  name: "FilterHeaderColumn",
  data: function() {
    return {
      dateFormat: "", // 日期选择器---日期格式
      timeFormat: "" // 日期选择器---时间格式
    };
  },
  props: {
    queryData: {
      // 查询参数
      type: Object,
      default: function() {
        return {};
      }
    },
    col: {
      type: Object,
      default: function() {
        return {};
      }
    },
    onQuery: {
      // 触发查询
      type: Function,
      default: () => {}
    }
  },
  methods: {
    sunQuery(changeQuery) {
      this.onQuery();
    },
    // 自定义组件-绑定属性
    componentBind(bind) {
      if (typeof bind == "function") {
        return bind(this);
      } else {
        return bind;
      }
    },
    // 自定义组件-绑定事件
    componentEvent(event) {
      if (typeof event == "function") {
        return event(this);
      }
    }
  }
};
</script>
<style lang="less" scoped>
/deep/.el-input--suffix .el-input__inner {
  padding: 0 5px;
}
</style>