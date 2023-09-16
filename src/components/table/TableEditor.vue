
<template>
<section :style="{height:setHeight}" id="TableEditor">
      <el-table
        stripe
        border
        :fit="fitTable"
        highlight-current-row
        size="mini"
        @current-change="currentChange"
        @selection-change="selectionChange"
        @row-click="rowClick"
        @row-dblclick="rowDblclick"
        :data="tableData"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.3)"
        :cell-class-name="setCellClass"
        :row-class-name="setRowClass"
        height="99%"
        ref="refTable"
        style="flex: 1;"
      >
        <!-- 勾选 -->
        <el-table-column v-if="checkbox" width="40" type="selection" fixed/>
        <!-- 序列号 -->
        <el-table-column v-if="showIndex" width="50" type="index" align="center" fixed/>
        <!-- 列·遍历 -->
        <template v-for="(col, key) in tableHeader">
          <el-table-column
            v-if="col.hidden !== true"
            :key="key"
            :prop="col.prop"
            :min-width="col.minWidth"
            :width="col.width"
            :align="col.align?col.align:'center'"
            :fixed="col.fixed?col.fixed:false"
            :show-overflow-tooltip="true"
          >
            <!-- 表头 -->
            <template #header>
              <span
                v-if="col.rule && col.rule.required === true"
                style="color:red;margin-right:2px;"
              >*</span>
              <!-- 显示表头信息 -->
              <el-tooltip
                v-if="showHeaderTooltip"
                effect="dark"
                placement="top"
                :content="col.label"
              >
                <span>{{col.label}}</span>
              </el-tooltip>
              <span v-else>{{col.label}}</span>
              <filter-column :col="col" :queryData="filterColumnData" :onQuery="filterColumnQuery"></filter-column>
            </template>
           <!-- 表体 -->
            <template v-slot="scope">
              <!-- 自定义slot插槽 -->
              <slot name="tableBody" :lyItem="scope"></slot>
              <!-- 自定义组件 -->
              <component v-if="col.component !== undefined" :is="col.component.reference" :params="col.component.params" @incident="col.component.event"/>
              <!-- 操作1：函数式组件 -->
              <table-edit-formatter v-else-if="typeof(col.formatter)==='function'" :row="scope.row" :column="col" :index="scope.$index"/>
              <template v-else-if="cellEditing(scope.row,col,scope.$index)">
                <el-input
                  v-if="col.type === 'input' && scope.row.___editting"
                  v-model="scope.row[col.prop]"
                  @change="cellChange(col, scope.row, key, scope.$index)"
                  @blur="cellBlur(col, scope.row, key, scope.$index)"
                  :maxlength="col.maxlength ? col.maxlength : null"
                  :placeholder="col.placeholder"
                  style="width: 99%;"
                />
                <el-input
                  v-else-if="col.type === 'textarea'"
                  v-model="scope.row[col.prop]"
                  @change="cellChange(col, scope.row, key, scope.$index)"
                  @blur="cellBlur(col, scope.row, key, scope.$index)"
                  type="textarea"
                  :autosize="true"
                  :maxlength="col.maxlength ? col.maxlength : null"
                  :placeholder="col.placeholder"
                  style="width: 99%;"
                />
                <el-input-number
                  v-else-if="col.type === 'number'"
                  v-model="scope.row[col.prop]"
                  @change="cellChange(col, scope.row, key, scope.$index)"
                  @blur="cellBlur(col, scope.row, key, scope.$index)"
                  :precision="col.precision"
                  :step="col.step"
                  :min="col.min"
                  :max="col.max"
                  :controls="col.controls"
                  :placeholder="col.placeholder"
                  controls-position="right"
                  style="width: 99%;"
                />
                <el-select
                  v-if="col.type === 'select'"
                  v-model="scope.row[col.prop]"
                  @change="cellChange(col, scope.row, key, scope.$index)"
                  @visible-change="(status)=>{visibleChange(status,col, scope.row, key, scope.$index)}"
                  @blur="cellBlur(col, scope.row, key, scope.$index)"
                  :filterable="col.filterable?col.filterable:false"
                  :clearable="col.clearable?col.clearable:false"
                  :allow-create="col.allowCreate?col.allowCreate:false"
                  :default-first-option="col.defaultFirstOption?col.defaultFirstOption:false"
                  :placeholder="col.placeholder"
                  :multiple="col.multiple?true:false"
                  :multiple-limit="col.filter.multiplelimit"
                 
                >
                  <el-option
                    v-for="(o, okey) in typeof(col.options) === 'function' ? col.options(scope.row) : col.options"
                    :disabled="col.disabledField?o[col.disabledField]:o.disabled"
                    :key="okey"
                    :value="col.valueField?o[col.valueField]:o.value"
                    :label="col.labelField?o[col.labelField]:o.label"
                  >{{col.labelField?o[col.labelField]:o.label}}</el-option>
                </el-select>
                <el-checkbox
                  v-else-if="col.type === 'checkbox'"
                  v-model="scope.row[col.prop]"
                  @change="cellChange(col, scope.row, key, scope.$index)"
                  :true-label="col.trueValue?col.trueValue:'Y'"
                  :false-label="col.falseValue?col.falseValue:'N'"
                />
                <el-switch
                  v-else-if="col.type === 'switch'"
                  v-model="scope.row[col.prop]"
                  @change="cellChange(col, scope.row, key, scope.$index)"
                  :active-value="col.trueValue?col.trueValue:'Y'"
                  :inactive-value="col.falseValue?col.falseValue:'N'"
                />
                <!-- 日期选择器 -->
                <el-date-picker
                  v-else-if="col.type === 'date'"
                  v-model="scope.row[col.prop]"
                  @change="cellChange(col, scope.row, key, scope.$index)"
                  @blur="cellBlur(col, scope.row, key, scope.$index)"
                  :type="col.dateType"
                  :value-format="col.dateType=='date'?dateFormat:col.dateType=='datetime'?dateFormat + ' ' + timeFormat: false"
                  :format="col.dateType=='date'?dateFormat:col.dateType=='datetime'?dateFormat + ' ' + timeFormat: false"
                  :placeholder="col.placeholder"
                 
                />
                <!-- 时间选择器 -->
                <el-time-picker
                  v-else-if="col.type === 'time'"
                  v-model="scope.row[col.prop]"
                  @change="cellChange(col, scope.row, key, scope.$index)"
                  @blur="cellBlur(col, scope.row, key, scope.$index)"
                  :value-format="timeFormat"
                  :format="timeFormat"
                  :placeholder="col.placeholder"
                 
                />
              </template>
              <!-- 字段内容 -->
              <span v-else>{{formatter(scope.row,col,scope.$index)}}</span>
              <!-- 校验信息展示   'valid-' + 行下标 + '-' + 列下标 -->
              <div>
                <el-tag
                  ref="refMessage"
                  type="danger"
                  class="message-div"
                  v-if="validResult['valid-' + scope.$index + '-' + key] !== undefined && validResult['valid-' + scope.$index + '-' + key].length > 0"
                >{{validResult['valid-' + scope.$index + '-' + key]}}</el-tag>
              </div>
            </template>
          </el-table-column>
        </template>
        <!-- 操作2：slot插槽 -->
        <el-table-column v-if="showOperation" width="90" align="center">
          <!-- 表头 -->
          <template #header>
              操作
          </template>
          <!-- 表体 -->
          <template v-slot="scope">
              <slot name="operationBody" :lyItem="scope"></slot>
          </template>
        </el-table-column>
      </el-table>

      <pagination :pagingObj="queryData" :pageStep="[10,15]" @emitWay="sunQuery"></pagination>
</section>
</template>
<script>
import FilterColumn from "./FilterHeaderColumn";
import bodyColumn from "./bodyColumn";
import TableEditFormatter from './TableEditFormatter';
import pagination from '@sky/pcDesign/components/pagination.vue';
export default {
  name: "TableEditor",
  components: {
    FilterColumn,
    TableEditFormatter,
    pagination
  },
  mixins: [bodyColumn],
  data() {
    return {
      setHeight: (document.documentElement.clientHeight - 180) + 'px',
      loading: false, // 加载中
      currentRow: null, // 当前行
      selectionRows: [], // 选择的数组
      filterColumnData: {} // 表头过滤参数
    };
  },
  props: {
    /**
     * 表头是否显示Tooltip
     */
    showHeaderTooltip: {
      type: Boolean,
      default: false
    },
    /**
     * 显示序号
     */
    showIndex: {
      type: Boolean,
      default: true
    },
    /**
     * 显示勾选
     */
    checkbox: {
      type: Boolean,
      default: false
    },
    /**
     * 表头数据
     */
    tableHeader: {
      type: Array,
      default: function() {
        return [];
      }
    },
    /**
     * 表单数据
     */
    tableData: {
      type: Array,
      default: function() {
        return [];
      }
    },
    /**
     * 行修改类型(鼠标事件)
     */
    rowEditType: {
      type: String,
      default: "ALL"
    },
    /**
     * 查询条件
     */
    queryData: {
      type: Object,
      default: function() {
        return {};
      }
    },
    /**
     * 查询url
     */
    queryUrl: {
      type: String,
      default: null
    },
    /**
     * 列的宽度是否自撑开
     */
    fitTable: {
      type: Boolean,
      default: true
    },
    /**
     * 是否显示操作列
     */
    showOperation: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    // table_methods 查询
    sunQuery() {
      const reqData = Object.assign({}, this.queryData, this.filterColumnData);
      this.loading = true;
      // this.$apihttp({
      //   url: this.queryUrl,
      //   method: 'post',
      //   data: reqData
      // }).then(data => {
      let data = {
        total: 18,
        currentPage: 1,
        pageSize: 15,
        totalPage: 2,
        list: [
          // { sex: '男', address: "信宜市东镇镇介可路", date: "2016-05-02 ~ 2016-05-06", country: "中国", province: "广东", Operation: "操作" },
          // { id: 2, sex: '女', address: "上海市普陀区金沙江路", date: "2017-08-16 ~ 2017-08-20", country: "中国", province: "上海", Operation: "操作" },
          // { id: 3, sex: '男', address: "信宜市东镇镇介可路", date: "2016-05-02 ~ 2016-05-06", country: "中国", province: "广东", Operation: "操作" },
          // { id: 4, sex: '女', address: "上海市普陀区金沙江路", date: "2017-08-16 ~ 2017-08-20", country: "中国", province: "上海", Operation: "操作" },
          // { id: 5, sex: '男', address: "信宜市东镇镇介可路", date: "2016-05-02 ~ 2016-05-06", country: "中国", province: "广东", Operation: "操作" },
          // { id: 6, sex: '女', address: "上海市普陀区金沙江路", date: "2017-08-16 ~ 2017-08-20", country: "中国", province: "上海", Operation: "操作" },
          // { id: 7, sex: '男', address: "信宜市东镇镇介可路", date: "2016-05-02 ~ 2016-05-06", country: "中国", province: "广东", Operation: "操作" },
          // { id: 8, sex: '女', address: "上海市普陀区金沙江路", date: "2017-08-16 ~ 2017-08-20", country: "中国", province: "上海", Operation: "操作" },
          // { id: 9, sex: '男', address: "信宜市东镇镇介可路", date: "2016-05-02 ~ 2016-05-06", country: "中国", province: "广东", Operation: "操作" },
          // { id: 10, sex: '女', address: "上海市普陀区金沙江路", date: "2017-08-16 ~ 2017-08-20", country: "中国", province: "上海", Operation: "操作" },
          // { id: 11, sex: '男', address: "信宜市东镇镇介可路", date: "2016-05-02 ~ 2016-05-06", country: "中国", province: "广东", Operation: "操作" },
          // { id: 12, sex: '女', address: "上海市普陀区金沙江路", date: "2017-08-16 ~ 2017-08-20", country: "中国", province: "上海", Operation: "操作" },
          // { id: 13, sex: '男', address: "信宜市东镇镇介可路", date: "2016-05-02 ~ 2016-05-06", country: "中国", province: "广东", Operation: "操作" },
          // { id: 14, sex: '女', address: "上海市普陀区金沙江路", date: "2017-08-16 ~ 2017-08-20", country: "中国", province: "上海", Operation: "操作" },
          // { id: 15, sex: '男', address: "信宜市东镇镇介可路", date: "2016-05-02 ~ 2016-05-06", country: "中国", province: "广东", Operation: "操作" },
          // { id: 16, sex: '女', address: "上海市普陀区金沙江路", date: "2017-08-16 ~ 2017-08-20", country: "中国", province: "上海", Operation: "操作" },
          // { id: 17, sex: '男', address: "信宜市东镇镇介可路", date: "2016-05-02 ~ 2016-05-06", country: "中国", province: "广东", Operation: "操作" },
          // { id: 18, sex: '女', address: "上海市普陀区金沙江路", date: "2017-08-16 ~ 2017-08-20", country: "中国", province: "上海", Operation: "操作" }
        ]
      };
      let list = data.list.slice((this.queryData.pageNum-1)*this.queryData.pageSize,this.queryData.pageNum*this.queryData.pageSize)
      this.queryData.total = data.total
      this.tableData.splice(0);
      for (const item of list) {
        this.tableData.push(item);
      }
      this.refreshCacheData();
      this.loading = false;
      // }).catch(() => {
      //   this.loading = false
      // })
    },
    formatter(row, col, index){
      let label = '';
      if (col.hasOwnProperty('formattor')) {
        label = col.formattor(row[col.prop])
      }else{
        label = row[col.prop];
      }
      return label
    },
    // 行单击事件-----操作___editting的true或false
    rowClick(row) {
      if (this.rowEditType === "CLICK") {
        for (const item of this.tableData) {
            item.___editting = false;
        }
        this.tableData[this.takeIndex(row)].___editting = true;
      } else if (this.rowEditType === "CLICK_ALL") {
        this.tableData[this.takeIndex(row)].___editting = true;
      }
      this.$emit("row-click", row);
    },
    takeIndex(row) {
      for (let i = 0; i < this.tableData.length; i++) {
        const item = this.tableData[i];
        if(item.id == row.id) {
          return i;
        }
      }
    },
    // 行双击事件
    rowDblclick(row) {
      if (this.rowEditType === "DBLCLICK") {
        for (const item of this.tableData) {
            item.___editting = false;
        }
        this.tableData[this.takeIndex(row)].___editting = true;
        // row.___editting = true;
        // this.$set(row, "___editting", true);
      } else if (this.rowEditType === "DBLCLICK_ALL") {
        this.tableData[this.takeIndex(row)].___editting = true;
        // this.$set(row, "___editting", true);
      }
      this.$emit("row-dblclick", row);
    },
    // 选择项监听
    selectionChange(selection) {
      this.selectionRows = selection;
      this.$emit("selection-change", selection); // 选择监听事件
    },
    // 当前行变化监听
    currentChange(currentRow, oldCurrentRow) {
      this.currentRow = currentRow;
      this.$emit("current-change", currentRow, oldCurrentRow);
    },
    // table_methods 单元格的 className 的回调方法
    setCellClass({ row, column, rowIndex, columnIndex }) {
      // 参数：行，列，行下标，列下标
      return "";
    },
    // table_methods 行的 className 的回调方法
    setRowClass: function({ row, rowIndex }) {
      // 参数：行，行下标
      // console.log('行的 className',row, rowIndex);
      if (row.___hidden === true) {
        return "hidden-row";
      }
      return "";
    },

    // table_methods 返回表格当前点击行
    getCurrentRow() {
      return this.currentRow;
    },
    // table_methods 新增行
    lyAddRow() {
      let item = {
        ___editting: true
      };
      // 避开重复添加判断
      if (this.tableData[0].___editting) {
        return;
      }
      this.tableData.unshift({ item });
      this.$refs.refTable.setCurrentRow();

      if (this.rowEditType === "CLICK" || this.rowEditType === "DBLCLICK") {
        for (const item of this.tableData) {
          item.___editting = false;
          // this.$set(item, "___editting", false);
        }
      }
      // this.tableData[0].___editting = true
      // console.log('tableData=--',this.tableData)
      this.currentRow = this.tableData[0];
      if (this.currentRow) {
        this.currentRow.___editting = true;
        // this.$set(this.currentRow, "___editting", true);
      }

      this.$nextTick(() => {
        this.$refs.refTable.bodyWrapper.scrollTop = 0;
        // this.$refs.refTable.bodyWrapper.scrollTop = this.$refs.refTable.bodyWrapper.scrollHeight;// 滚动到最后一行
        // 定位至第几行
        // this.$refs.refTable.bodyWrapper.scrollTop = this.$refs.refTable.bodyWrapper.scrollHeight * rowIndex / this.tableData.length
      });
      this.$emit("add-row-callback", item);
    },
    // 编辑的读写
    cellEditing(row, col, rowIndex) {
      // console.log(
      //   "cellEditing:",
      //   !col.readonly,
      //   row.___editting,
      //   row
      // );
      return (
        !col.readonly &&
        (row.___editting === true || this.rowEditType === "ALL")
      );
    },
    // table_methods 返回表格当前勾选行数组
    getSelectionRows() {
      return this.selectionRows;
    },
    visibleChange(status, col, row, key, index) {
      /**
       * status:下拉框出现则为 true，隐藏则为 false
       **/
      if (col.visibleChange) {
        col.visibleChange(status, col, row, key, index);
      }
    },
    /**
     * table_methods 刷新页面数据缓存
     */
    refreshCacheData() {
      // 遍历删除字段
      for (const item of this.tableData) {
        delete item.___newRow;
        delete item.___editting;
        delete item.___editedRow;
        delete item.___editedCellSet;
        delete item.___hidden;
      }
    },

    // 表头enter键，触发查询方法
    filterColumnQuery() {
      this.sunQuery();
    },
    getFilterColumnData() {
      return this.filterColumnData;
    },
    // table_methods 获取新增行列表
    getAddRows() {
      const list = [];
      for (const item of this.tableData) {
        if (item.___newRow === true) {
          list.push(item);
        }
      }
      return list;
    },
    // table_methods 获取修改行列表
    getUpdateRows() {
      const list = [];
      for (const item of this.tableData) {
        if (item.___editedRow === true) {
          list.push(item);
        }
      }
      return list;
    },
    // table_methods 重置筛选条件清空
    clearFilterColumnData() {
      this.filterColumnData = {};
    },
    // 更新筛选条件
    updateFilterColumnData(){
        this.clearFilterColumnData()
        Object.keys(this.queryData).forEach(key=>{
          this.filterColumnData[key] = this.queryData[key];
            // this.$set(this.filterColumnData, key, this.queryData[key])
        })
    }
  },
  created() {
    this.updateFilterColumnData()
    this.sunQuery();
    this.refreshCacheData();
  }
};
</script>
<style lang="less" scoped>
#TableEditor {
  display: flex;
  flex-direction: column;
}
/deep/.el-table__body-wrapper{
    flex: 1;
}
/deep/ .cell-changed:before {
  content: "";
  top: -5px;
  left: -5px;
  position: absolute;
  border: 5px solid;
  border-color: transparent #f56c6c transparent transparent;
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
}

/deep/ .hidden-row {
  display: none;
}

/deep/ .message-div {
  margin-top: 3px;
  height: 100%;
  white-space: normal;
  word-break: break-all;
  overflow: hidden;
}
// 选择器加remote下拉图标不见问题
/deep/.el-select .el-input .el-icon-::before {
  content: "\e6e1";
  transform: rotate(180deg);
}
/deep/.el-select .el-input.is-focus .el-icon- {
  transform: rotate(0deg);
}
</style>