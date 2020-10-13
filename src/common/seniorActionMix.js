/*
* @ parentCode 此字段所在表单的code值
* @ parentForm 此字段所在表单所有字段集合数组
* @ formGroupList 表单组list数据
* */
import FormApi from '@/common/api/form'
export default {
  data() {
    return {
      formGroupList: [],
      describe: {
        aaa: 11
      }
    }
  },
  provide() { // 给表单下面的空间提供 解析高级交互方法
    return {
      seniorAction: this.seniorAction,
      describe: () => { return this.describe }
    }
  },
  methods: {
    // 获取表单数据方法
    getData() {
      const { apiKey, param } = this.getDataFnObj;
      FormApi[apiKey](param).then((res) => {
        const { data, describe } = res
        this.formGroupList = data;
        this.describe = describe;
        if (describe.page) { // 页面加载高级交互
          this.seniorAction(describe.page.load);
        }
        this.getNavBarOptions()
      }, (err) => {
        this.$refs.toast.show(err)
      })
    },
    getNavBarOptions () {
      if (this.formGroupList) {
        let list = this.formGroupList
        for (let i = 0; i < list.length; i++) {
          let option = {}
          let item = list[i]
          option.name = item.formLabel
          option.code = item.formKey
          this.navBarOptions.push(option)
        }
      }
    },
    // 高级交互启动函数
    seniorAction(describeTypeArrs) {
      describeTypeArrs = describeTypeArrs || [];
      const len = describeTypeArrs.length; // 条件判断的语句数
      for (let i = 0; i < len; i++) {
        try {
          this.evalFn(describeTypeArrs[i]);
        } catch (err) {
          this.$refs.toast.show(`高级交互加载失败：${err}`)
          throw new Error(err);
        }
      }
    },
    /*
    * 读取高级交互内容
    * @ result 表示是否选择读取判断条件 true 则继续判断以下fn判断条件，反之跳过fn
    * @ fn 满足高级交互的判断条件
    * @ content 满足fn后 执行的具体内容
    * @ nums 表示模板表单 长度
    */
    evalFn({ data = [], result }) {
      let fnString = "";
      if (result) { // 进行条件判断
        for (let i = 0; i < data.length; i++) {
          const {
            fn, content, conditionsTittle
          } = data[i];
          if (conditionsTittle !== "else") {
            fnString += `${conditionsTittle}(${this.getConditions(fn)}){${this.getContent(content)}}`;
          } else {
            fnString += `${conditionsTittle}{${this.getContent(content)}}`;
          }
        }
      } else {
        for (let j = 0; j < data.length; j++) {
          const { content } = data[j];
          fnString += `${this.getContent(content)};`;
        }
      }
      // console.log("执行的高级交互", fnString);
      // eslint-disable-next-line
      console.log('eval', fnString)
      eval(fnString); // SONAR
    },
    // 读取判断条件fn的内容
    getConditions(fn) {
      const len = fn.length;
      let resultString = "";
      for (let i = 0; i < len; i++) {
        const addSrting = `${fn[i].relationship
        + fn[i].start
        }this.compare('${
          fn[i].fieldNameCode
        }','${
          fn[i].fieldValue
        }','${
          fn[i].computed
        }','${
          fn[i].formKey
        }')${
          fn[i].end}`;
        resultString += addSrting;
      }
      return resultString;
    },
    /* 具体比较函数
    * @ fieldNameCode 当前判断字段的key
    * @ fieldValue 当前判断字段的目标值
    * @ computed 逻辑关系
    * @ formKey 当前判断字段所在表单的key
    * */
    compare(fieldNameCode, fieldValue, computed, formKey) {
      // 通过formKey 找到 判断字段的父表单
      const form = this.formGroupList.find(formObj => formObj.formKey === formKey);
      const { basicForms = [], viewType = '' } = form;
      let obj = null;
      let result = null;
      // 此表单是非模板表单 obj 为找到的判断字段
      if (viewType === 'basic') {
        obj = form.basicFields.find(item => item.fieldNameCode === fieldNameCode);
        result = this.compareResult(obj, fieldValue, computed);
      }
      if (viewType === 'list' && basicForms.length > 0) { // 模板表单 去找模板表单只要其中一个tab页中的字段满足就可以
        for (let i = 0; i < basicForms.length; i++) {
          const item = basicForms[i];
          obj = item.find(field => field.fieldNameCode === fieldNameCode);
          result = this.compareResult(obj, fieldValue, computed);
          if (result) break; // 当tab里 只有一条字段数据满足要求就停止循环
        }
      }
      return result;
    },
    /* 判断条件返回值函数
    * @ obj 当前操作的字段
    * @ fieldValue 当前判断字段的目标值
    * @ computed 逻辑关系
    * */
    compareResult(obj, fieldValue, computed) {
      if (obj) {
        if (computed === "==") {
          return obj.value === fieldValue;
        } if (computed === "!=") {
          return obj.value !== fieldValue;
        } if (computed === "<") {
          return parseFloat(obj.value) < parseFloat(fieldValue);
        } if (computed === ">") {
          return parseFloat(obj.value) > parseFloat(fieldValue);
        } if (computed === "<=") {
          return parseFloat(obj.value) <= parseFloat(fieldValue);
        } if (computed === ">=") {
          return parseFloat(obj.value) >= parseFloat(fieldValue);
        } if (computed === "in") { // 包含
          // 检索字符串
          return obj.value.indexOf(fieldValue) !== -1;
        } if (computed === "not in") { // 不包含
          // 检索字符串
          return obj.value.indexOf(fieldValue) === -1;
        }
      }
    },
    /*  获取每段执行语句
    * */
    getContent(contents) {
      const len = contents.length;
      const arr = [];
      for (let i = 0; i < len; i++) {
        const addString = `this.Behavior('${
          contents[i].actionName
        }','${
          contents[i].fieldNameCode
        }','${
          contents[i].fieldValue
        }','${
          contents[i].formKey
        }')`;
        arr[i] = addString;
      }
      return arr.join(";");
    },
    /* 拼凑执行函数内容
    * @ actionName 交互类型
    * @ fieldNameCode 目标字段
    * @ fieldValue 目标字段的值
    * @ formKey 目标字段所在表单key
    * @ obj 找到目标字段
    * */
    Behavior(actionName, fieldNameCode, fieldValue, formKey) {
      // 如果是绑定函数 或者调用函数
      if (formKey === "fn") {
        this.bandFnResult(fieldNameCode); // fliedName 函数名 fieldValue 函数参数用,隔开的字符串
        return;
      }
      // 找到这个字段对应的表单
      const form = this.formGroupList.find(formObj => formObj.formKey === formKey);
      const { basicForms = [], viewType = '', template = [] } = form;
      let obj = null;
      if (viewType === 'basic') { // 此表单是非模板表单
        obj = form.basicFields.find(item => item.fieldNameCode === fieldNameCode);
        this.BehaviorResult(obj, fieldValue, actionName);
      } else { // 对模表单进行操作
        const templateObj = template.find(item => item.fieldNameCode === fieldNameCode);
        this.BehaviorResult(templateObj, fieldValue, actionName);
        // 模板表单 subList 内嵌表单 tabledata 不可操作内嵌表格
        if (basicForms.length > 0) {
          for (let i = 0; i < basicForms.length; i++) {
            const item = basicForms[i];
            obj = item.find(field => field.fieldNameCode === fieldNameCode);
            this.BehaviorResult(obj, fieldValue, actionName);
          }
        }
      }
    },
    /* 执行内容的函数
    * @ obj 操作的字段
    * @ fieldValue 字段需要设置的值
    * @ actionName 交互方式
    * */
    BehaviorResult(obj, fieldValue, actionName) {
      if (obj) {
        if (actionName === "setValue") {
          // 设置值
          this.$set(obj, "value", fieldValue);
        } else if (actionName === "hide") {
          // 隐藏
          this.$set(obj, "hide", true);
        } else if (actionName === "show") {
          // 显示
          this.$set(obj, "hide", false);
        } else if (actionName === "inputReadonly") {
          // 禁用
          this.$set(obj, "readonly", true);
        } else if (actionName === "use") {
          // 启用
          this.$set(obj, "readonly", false);
        } else if (actionName === "limitSelect") {
          // 限制选项
          fieldValue = fieldValue.split(",");
          obj.options.map((item) => {
            this.$set(item, 'limit', true)
            return item;
          });
          for (let i = 0; i < fieldValue.length; i++) {
            // 到整个表单组去查找相关字段
            const CodeObj = obj.options.find(item => item.code === fieldValue[i]);
            this.$set(CodeObj, 'limit', false)
          }
        } else if (actionName === "notNone") {
          // 不可为空校验
          this.$set(obj, "must", true);
        } else if (actionName === "None") { // 可为空
          this.$set(obj, "must", false);
        } else if (actionName === "origData") {
          // 设置为初始值
          this.$set(obj, "value", obj.origData);
        } /*else if (actionName === "repeatData") {
        }*/
      }
    },
    /* 执行调用函数
    * @ fieldNameCode 函数名
    * @ fieldValue 函数参数
    * */
    bandFnResult(fieldNameCode) {
      eval(`this.${fieldNameCode}()`); // SONAR
    },
    /* 通过 formKey 和 fieldNameCode找到 对应字段
    *
    * */
    indexOfField(fieldNameCode, formKey) {
      // 遍历整个表单组查找相应的 字段
      let fieldObj = {};
      // 获取表单
      const form = this.formGroupList.find(item => item.formKey === formKey);
      const { viewType = '',} = form;
      if (viewType === 'basic') { // 非模版表单
        fieldObj = form.basicFields.find(item => item.fieldNameCode === fieldNameCode);

      }
      return fieldObj;
    },
    /* 取代自定义js的函数分类 customMix.js
   * */
    totalPrice() { // 计算总价
      const totalField = this.indexOfField('applyMortgage_totalPrice', 'applyMortgage');
      const areaField = this.indexOfField('applyMortgage_area','applyMortgage');
      const unitPriceField = this.indexOfField('applyMortgage_unitPrice','applyMortgage');
      const newTotal = Number(areaField.value) * Number(unitPriceField.value);
      this.$set(totalField, 'value', newTotal.toFixed(2))
    },
    totalServerAmount() { // 计算平台服务费
      const serverAmount = this.indexOfField('loanInfo_serverAmount', 'huliAuditInfo');
      const huliSignAmount = this.indexOfField('loanInfo_huliSignAmount','huliAuditInfo');
      const serverRate = this.indexOfField('loanInfo_serverRate','huliAuditInfo');
      const newServerAmount = (Number(huliSignAmount.value) * Number(serverRate.value))/100;
      this.$set(serverAmount, 'value', newServerAmount.toFixed(2))
    },
    totalPartnerAmount() { // 计算佣金
      const loanInfo_partnerAmount = this.indexOfField('loanInfo_partnerAmount', 'huliAuditInfo');
      const loanInfo_huliSignAmount = this.indexOfField('loanInfo_huliSignAmount','huliAuditInfo');
      const loanInfo_partnerRate = this.indexOfField('loanInfo_partnerRate','huliAuditInfo');
      const newServerAmount = (Number(loanInfo_huliSignAmount.value) * Number(loanInfo_partnerRate.value))/100;
      this.$set(loanInfo_partnerAmount, 'value', newServerAmount.toFixed(2))
    },
    serverFeeTotal() { // 计算服务费合计
      const loanInfo_serverFeeTotal = this.indexOfField('loanInfo_serverFeeTotal', 'huliAuditInfo');
      const loanInfo_huliSignAmount = this.indexOfField('loanInfo_huliSignAmount','huliAuditInfo');
      const loanInfo_partnerRate = this.indexOfField('loanInfo_partnerRate','huliAuditInfo');
      const loanInfo_serverRate = this.indexOfField('loanInfo_serverRate','huliAuditInfo');
      const new_loanInfo_serverFeeTotal = (Number(loanInfo_huliSignAmount.value) * (Number(loanInfo_partnerRate.value) + Number(loanInfo_serverRate.value)))/100;
      this.$set(loanInfo_serverFeeTotal, 'value', new_loanInfo_serverFeeTotal.toFixed(2))
    },
    chargeTotal(){ // 实收金额
      const loanInfo_chargeTotal = this.indexOfField('loanInfo_chargeTotal', 'huliAuditInfo');
      const loanInfo_serverFeeTotal = this.indexOfField('loanInfo_serverFeeTotal','huliAuditInfo');
      this.$set(loanInfo_chargeTotal, 'value', loanInfo_serverFeeTotal.value)
    }
  }
};
