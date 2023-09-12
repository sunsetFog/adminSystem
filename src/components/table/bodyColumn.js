
export default {
    data(){
        return {
            dateFormat: "", // 日期选择器---日期格式
            timeFormat: "", // 日期选择器---时间格式
            validResult: {} // el-tag
        }
    },
    created(){

    },
    methods: {
        // 输入类型·监听
        cellChange(col, row, colIndex, rowIndex) {
            this.cellRuleCheck("change", col, row, rowIndex, colIndex); // 规则校验
            if (col.change) {
                col.change(row, col.prop, row[col.prop], colIndex, rowIndex);
            }
        },
        cellBlur(col, row, colIndex, rowIndex) {
            this.cellRuleCheck("blur", col, row, rowIndex, colIndex); // 规则校验
            if (col.blur) {
                col.blur(row, col.prop, row[col.prop], colIndex, rowIndex);
            }
        },
        cellRuleCheck(trigger, col, row, rowIndex, colIndex) {
            // 按单元格和事件触发类型进行规则校验
            if (col.rule.trigger != trigger) {
                return
            }
            if (col.rules && typeof rule.validator === "function") {
                for (let i = 0; i < rules.length; i++) {
                    let rule = col.rules[i];
                    if(!rule.validator(row)){
                        this.$set(this.validResult,"valid-" + rowIndex + "-" + colIndex,rule.message);
                        break;
                    }else{
                        this.$set(this.validResult,"valid-" + rowIndex + "-" + colIndex,"");
                    }
                }
            }
            if (typeof col.rule.validator === "function") {
                // 调用自定义校验
                if(!col.rule.validator(row)){
                    this.$set(this.validResult,"valid-" + rowIndex + "-" + colIndex,rule.message);
                }else{
                    this.$set(this.validResult,"valid-" + rowIndex + "-" + colIndex,"");
                }

            }
        }
    }
}