
<template>
    <section>
        <h3>Table Attributes</h3>
        <table border="1" width="900px">
            <thead>
                <tr>
                    <th width="200px">参数</th>
                    <th width="300px">说明</th>
                    <th width="90px">类型</th>
                    <th>可选值</th>
                    <th width="90px">默认值</th>
                </tr>
            </thead>

            <tbody>
                <template v-for="(item,index) in table_attributes">
                    <tr>
                        <td>{{item.params}}</td>
                        <td>{{item.explain}}</td>
                        <td>{{item.type}}</td>
                        <td>{{item.optional_value}}</td>
                        <td>{{item.default_value}}</td>
                    </tr>
                </template>
            </tbody>

            <tfoot>
            </tfoot>
        </table>

        <h3>Table Events</h3>
        <table border="1" width="900px">
            <thead>
                <tr>
                    <th width="200px">事件名</th>
                    <th width="300px">说明</th>
                    <th>参数</th>
                </tr>
            </thead>

            <tbody>
                <template v-for="(item,index) in table_events">
                    <tr>
                        <td>{{item.event_name}}</td>
                        <td>{{item.explain}}</td>
                        <td>{{item.params}}</td>
                    </tr>
                </template>
            </tbody>

            <tfoot>
            </tfoot>
        </table>

        <h3>Table Methods</h3>
        <table border="1" width="900px">
            <thead>
                <tr>
                    <th width="200px">函数名</th>
                    <th width="300px">说明</th>
                    <th>入参</th>
                </tr>
            </thead>

            <tbody>
                <template v-for="(item,index) in table_methods">
                    <tr>
                        <td>{{item.event_name}}</td>
                        <td>{{item.explain}}</td>
                        <td>{{item.params}}</td>
                    </tr>
                </template>
            </tbody>

            <tfoot>
            </tfoot>
        </table>

        <h3>TableHeader属性</h3>
        <table border="1" width="900px">
            <thead>
                <tr>
                    <th width="200px">属性</th>
                    <th width="300px">说明</th>
                    <th width="90px">类型</th>
                    <th>可选值</th>
                    <th width="90px">默认值</th>
                </tr>
            </thead>

            <tbody>
                <template v-for="(item,index) in table_header">
                    <tr>
                        <td>{{item.params}}</td>
                        <td>{{item.explain}}</td>
                        <td>{{item.type}}</td>
                        <td>{{item.optional_value}}</td>
                        <td>{{item.default_value}}</td>
                    </tr>
                </template>
            </tbody>

            <tfoot>
            </tfoot>
        </table>
        <h3>Type类型额外属性</h3>
        <table border="1" width="900px">
            <thead>
                <tr>
                    <th width="200px">type类型-属性</th>
                    <th width="300px">说明</th>
                    <th width="90px">类型</th>
                    <th>可选值</th>
                    <th width="90px">默认值</th>
                </tr>
            </thead>

            <tbody>
                <template v-for="(item,index) in type_data">
                    <tr>
                        <td>{{item.params}}</td>
                        <td>{{item.explain}}</td>
                        <td>{{item.type}}</td>
                        <td>{{item.optional_value}}</td>
                        <td>{{item.default_value}}</td>
                    </tr>
                </template>
            </tbody>

            <tfoot>
            </tfoot>
        </table>
    </section>
</template>

<script>
export default {
    name: 'explainTable',
    data(){
        return {
            table_attributes: [
                { params: 'showIndex',explain: '是否显示序号',type: 'Boolean',optional_value: 'true、false',default_value: true },
                { params: 'checkbox',explain: '是否显示勾选',type: 'Boolean',optional_value: 'true、false',default_value: false },
                { params: 'showHeaderTooltip',explain: '表头是否显示Tooltip',type: 'Boolean',optional_value: 'true、false',default_value: false },
                { params: 'tableHeader',explain: '表头数据',type: 'Array',optional_value: '',default_value: '[]' },
                { params: 'tableData',explain: '表单数据',type: 'Array',optional_value: '',default_value: '[]' },
                { params: 'rowEditType',explain: '行修改类型(鼠标事件)',type: 'String',optional_value: 'ALL、CLICK、CLICK_ALL、DBLCLICK、DBLCLICK_ALL',default_value: 'ALL' },
                { params: 'fitTable',explain: '列的宽度是否自撑开',type: 'Boolean',optional_value: 'true、false',default_value: true },
                { params: 'queryUrl',explain: '表格查询url（后台模式）',type: 'String',optional_value: '',default_value: 'null' },
                { params: 'queryData',explain: '表格查询条件（后台模式）',type: 'Object',optional_value: '',default_value: '{}' },
            ],
            table_events: [
                { event_name: 'rowClick',explain: '当某一行被点击时会触发该事件',params: 'row' },
                { event_name: 'rowDblclick',explain: '当某一行被双击时会触发该事件',params: 'row' },
                { event_name: 'addRowCallback',explain: '行新增时回调触发该事件',params: 'row' },
                { event_name: 'saveRowCallback',explain: '行保存时回调触发该事件（非简易模式）',params: 'row' },
                { event_name: 'deleteRowCallback',explain: '行删除时回调触发该事件',params: 'row' },
                { event_name: 'currentChange',explain: '当前行发生变化的时候会触发该事件',params: 'currentRow,oldCurrentRow' },
                { event_name: 'selectionChange',explain: '当选择项发生变化时会触发该事件',params: 'selection' }
            ],
            table_methods: [
                { event_name: 'query',explain: '查询（后台模式）',params: '' },
                { event_name: 'addRow',explain: '新增行',params: 'row，rowIndex' },
                { event_name: 'getAddRows',explain: '获取新增行列表',params: '' },
                { event_name: 'getUpdateRows',explain: '获取修改行列表',params: '' },
                { event_name: 'getCurrentRow',explain: '返回表格当前点击行',params: '' },
                { event_name: 'setCurrentRow',explain: '用于单选表格，设定某一行为选中行，如果调用时不加参数，则会取消目前高亮行的选中状态',params: 'rowIndex或row' },
                { event_name: 'setEditingRow',explain: '设定编辑行',params: 'rowIndex或row' },
                { event_name: 'getSelectionRows',explain: '返回表格当前勾选行数组',params: '' },
                { event_name: 'refreshCacheData',explain: '刷新表格缓存数据（重置已修改标记）',params: '' },
                { event_name: 'clearFilterColumnData',explain: '重置筛选条件清空',params: '' },
                { event_name: 'updateFilterColumnData',explain: '更新筛选条件',params: '' }
            ],
            table_header: [
                { params: 'prop',explain: '字段',type: 'String',optional_value: '',default_value: '' },
                { params: 'label',explain: '字段名称(多语言)',type: 'String',optional_value: '',default_value: '' },

                { params: 'type',explain: '类型',type: 'String',optional_value: 'input、textarea、number、select、checkbox、switch、date、time',default_value: '' },
                
                { params: 'select---options',explain: '支持两种类型：1、下拉数组返回方法，入参为row；2、下拉数组。格式均为：[label:0,value:0,disabled:false]',type: 'Function |Array',optional_value: '',default_value: '' },
                { params: 'select---multiple',explain: '是否多选',type: 'true、false',optional_value: '',default_value: false },
                { params: 'select---multiplelimit',explain: '多选时用户最多可以选择的项目数，为 0 则不限制',type: 'number',optional_value: '',default_value: 0 },

                { params: 'date---dateType',explain: '显示类型',type: 'String',optional_value: 'date、datetime',default_value: '' },
                { params: 'number---ignoreSearch',explain: '忽略全文搜索',type: 'Boolean',optional_value: 'true、false',default_value: false },
                { params: 'number---precision',explain: '数值精度',type: 'Number',optional_value: '',default_value: '' },
                { params: 'number---step',explain: '计数器步长',type: 'Number',optional_value: '',default_value: '' },
                { params: 'number---min',explain: '设置计数器允许的最小值',type: 'Number',optional_value: '',default_value: '' },
                { params: 'number---max',explain: '设置计数器允许的最大值',type: 'Number',optional_value: '',default_value: '' },
                { params: 'number---controls',explain: '是否使用控制按钮',type: 'boolean',optional_value: 'true、false',default_value: true },
                { params: 'number---placeholder',explain: '输入框默认 placeholder',type: 'string',optional_value: '',default_value: '' },

                { params: 'hidden',explain: '是否隐藏',type: 'Boolean',optional_value: 'true、false',default_value: false },
                { params: 'minWidth',explain: '最小宽度',type: 'String',optional_value: '',default_value: '' },
                { params: 'width',explain: '宽度',type: 'String',optional_value: '',default_value: '' },
                { params: 'align',explain: '对齐方式',type: 'String',optional_value: 'left、center、right',default_value: 'center' },
                { params: 'fixed',explain: '固定列',type: 'string, boolean',optional_value: 'true、false、left、right',default_value: '' },
                { params: 'readonly',explain: '是否只读',type: 'Boolean',optional_value: 'true、false',default_value: false },
                { params: 'defaultValue',explain: '默认值，用于新增行初始化操作',type: 'Object',optional_value: '',default_value: '' },
                { params: 'filter',explain: '表头过滤配置项，格式与tableview相同',type: 'Object',optional_value: '',default_value: '' },

                { params: 'change',explain: '表体输入监听，入参为(row, key, value, colIndex, rowIndex)',type: 'Function',optional_value: '',default_value: '' },
                { params: 'blur',explain: '元素失焦时触发的方法，入参为(row, key, value, colIndex, rowIndex)',type: 'Function',optional_value: '',default_value: '' },


                { params: 'component',explain: '自定义格式化内容的组件(使用简单，优先级比formatter低)',type: 'Object',optional_value: '',default_value: '' },
                { params: 'component:reference',explain: '组件引用',type: 'Object',optional_value: '',default_value: '' },
                { params: 'component:params',explain: '传入参数',type: 'Object',optional_value: '',default_value: '' },
                { params: 'component:event',explain: '事件(用于子组件emit回调父组件)',type: 'Function',optional_value: '',default_value: '' },
                { params: 'rule',explain: '校验规则',type: 'Object',optional_value: '',default_value: '' },
                { params: 'rule:required',explain: '是否校验',type: 'Boolean',optional_value: 'true、false',default_value: '' },
                { params: 'rule:trigger',explain: '触发类型',type: 'String',optional_value: 'change、blur',default_value: 'change' },
                { params: 'rule:message',explain: '消息提示',type: 'String',optional_value: '',default_value: '' },
                { params: 'rule:validator',explain: '自定义校验方法，入参为row，需返回true或者false（缺省为必填校验）',type: 'Function',optional_value: '',default_value: '' },
                { params: 'rules',explain: '校验规则(数组结构，元素格式与rule相同) ',type: 'Array',optional_value: '',default_value: '' },
                { params: 'placeholder',explain: '占位文本',type: 'String',optional_value: '',default_value: '' },
                { params: 'formattor',explain: 'id换字段',type: 'Function',optional_value: '',default_value: '' }
            ],
            type_data: [
                { params: 'input---ignoreSearch',explain: '忽略全文搜索',type: 'Boolean',optional_value: 'true、false',default_value: false },
                { params: 'input---maxlength',explain: '最大输入长度',type: 'Number',optional_value: '',default_value: '' },
                { params: 'textarea---ignoreSearch',explain: '忽略全文搜索',type: 'Boolean',optional_value: 'true、false',default_value: false },
                { params: 'textarea---maxlength',explain: '最大输入长度',type: 'Number',optional_value: '',default_value: '' },
                { params: 'number---ignoreSearch',explain: '忽略全文搜索',type: 'Boolean',optional_value: 'true、false',default_value: false },
                { params: 'number---precision',explain: '数值精度',type: 'Number',optional_value: '',default_value: '' },
                { params: 'number---step',explain: '计数器步长',type: 'Number',optional_value: '',default_value: '' },
                { params: 'number---min',explain: '设置计数器允许的最小值',type: 'Number',optional_value: '',default_value: '' },
                { params: 'number---max',explain: '设置计数器允许的最大值',type: 'Number',optional_value: '',default_value: '' },
                
                { params: 'select---ignoreSearch',explain: '忽略全文搜索',type: 'Boolean',optional_value: 'true、false',default_value: false },
                { params: 'select---filterable',explain: '输入过滤下拉值',type: 'Boolean',optional_value: 'true、false',default_value: false },
                { params: 'select---clearable',explain: '是否可以清空选项',type: 'Boolean',optional_value: 'true、false',default_value: false },
                { params: 'select---allowCreate',explain: '是否允许用户创建新条目，需配合 filterable 使用',type: 'Boolean',optional_value: 'true、false',default_value: false },
                { params: 'select---defaultFirstOption',explain: '在输入框按下回车，选择第一个匹配项。需配合 filterable 或 remote 使用',type: 'Boolean',optional_value: 'true、false',default_value: false },
                { params: 'select---options',explain: '支持两种类型：1、下拉数组返回方法，入参为row；2、下拉数组。格式均为：[label:0,value:0,disabled:false]',type: 'Function |Array',optional_value: '',default_value: '' },
                { params: 'select---labelField',explain: 'options数组label自定义字段',type: 'String',optional_value: '',default_value: 'label' },
                { params: 'select---valueField',explain: 'options数组value自定义字段',type: 'String',optional_value: '',default_value: 'value' },
                { params: 'select---disabledField',explain: 'options数组disabled自定义字段',type: 'String',optional_value: '',default_value: 'disabled' },
                { params: 'select---remote',explain: '是否为远程搜索',type: 'Boolean',optional_value: 'true、false',default_value: false },
                { params: 'select---remote-method',explain: '远程搜索方法',type: 'Function',optional_value: '',default_value: '' },
                { params: 'select---visible-change',explain: '下拉框出现/隐藏时触发',type: 'Function',optional_value: '',default_value: '' },

                { params: 'select---multiple',explain: '是否多选',type: 'true、false',optional_value: '',default_value: false },
                { params: 'select---multiplelimit',explain: '多选时用户最多可以选择的项目数，为 0 则不限制',type: 'number',optional_value: '',default_value: 0 },


                { params: 'checkbox---trueValue',explain: '勾选值',type: 'String',optional_value: '',default_value: 'Y' },
                { params: 'checkbox---falseValue',explain: '不勾选值',type: 'String',optional_value: '',default_value: 'N' },
                { params: 'switch---trueValue',explain: '开启值',type: 'String',optional_value: '',default_value: 'Y' },
                { params: 'switch---falseValue',explain: '关闭值',type: 'String',optional_value: '',default_value: 'N' },
                { params: 'date---ignoreSearch',explain: '忽略全文搜索',type: 'Boolean',optional_value: 'true、false',default_value: false },
                { params: 'date---dateType',explain: '显示类型',type: 'String',optional_value: 'daterange、datetimerange',default_value: '' },

                { params: 'time---ignoreSearch',explain: '忽略全文搜索',type: 'Boolean',optional_value: 'true、false',default_value: false }
            ]
        }
    }
}
</script>

<style lang="less" scoped>
section {
    padding: 20px 0px;
    // table加边框，加圆角
    table {
        margin: 0 auto;
        width: 100%;
        border-collapse: collapse;// 合并表格边框，使border不会为2px
        border-radius: 10px;
        border-style: hidden;// 消除外边框---为了圆角
        box-shadow: 0 0 0 1px #ECECEC;// 加阴影替代边框---为了圆角
        overflow: hidden;
        th, td { // 设单元格border、padding
            border: 1px solid #ECECEC;
            padding: 5px;
        }
        thead th {
            height: 48px;
            font-weight: 400;
            font-size: 14px;
            background: #909399;
            color: #fff;
        }
        tbody td {
            height: 40px;
            font-size: 13px;
            color: #495060;
        }
    }
}

</style>