<template>
<div class="detail">
    <div class="main">
      <div class="content">
        <NavBar :options="navBarOptions" />
        <template v-if="hardReset">
          <Mark
            v-for="item in formData"
            :key="item.formKey"
            :title="item.formLabel"
            :unfold="true"
            :id="item.formKey"
          >
            <GeneralTable
              :ref="item.formKey"
              v-if="item.viewType == 'basic'"
              :options = item.basicFields
              :isReadOnly = curLoanItem.isReadOnly
            ></GeneralTable>
            <div class="tips" v-if="item.formKey == 'fundingRequireInfo'">特别提示：标<i class="hl-icon hl-icon-430"></i>的字段将在维客端展示</div>
          </Mark>
        </template>
        <Mark
          title="城市分配"
          :unfold="true"
          id="allocation"
        >
          <CityAllot
            ref="allot"
            :formData = "formData"
            :fundFeeList = "fundFeeDetailList"
            :fundFeeTemplate = "fundFeeDetailListTemplate"
            :isReadOnly = curLoanItem.isReadOnly
            @changeCity = 'changeCity'
            @change = 'changeConditions'
            :defaultConditions = 'conditions'
          ></CityAllot>
        </Mark>
        <div v-if="!curLoanItem.isReadOnly"  class="btn-box">
          <Button class="finish" size="big" @click="save()">保存</Button>
          <Button class="finish" size="big" @click="giveUp()">放弃</Button>
        </div>
      </div>
    </div>
    <Toast ref="toast"></Toast>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import BS from '@/common/bs'
import Button from '@/components/Button'
import NavBar from '@/components/Navbar'
import Mark from '@/components/Mark'
import GeneralTable from '../../formTypes/general'
import Toast from '@/components/Toast'
import CityAllot from './cityAllot'
import FundingApi from '@/common/api/funding'
import FundCommon from './common'
import Utils from '@/common/utils'
import Validate from '@/common/validate'
import actioMix from "@/common/seniorActionMix";
export default {
  name:'fundDetail',
  components: {
    NavBar,
    Mark,
    GeneralTable,
    Button,
    Toast,
    CityAllot
  },
  mixins: [actioMix],
  data () {
    return {
      formData: [
        {
          basicFields: [
            {
              fieldName: "资金方", // TODO name 资金方名称
              fieldNameCode: "fundSourceId",
              hide: false,
              must: true,
              readonly: false,
              showUnit: "",
              styleRule: "none",
              type: "select",
              value: "",
              noTransform: true,
              options: [],
              func: this.getBtnText
            },
            {
              fieldName: "资方渠道",
              fieldNameCode: "fundChannel",
              hide: false,
              must: false,
              noTransform: true,
              newOptions: [],
              readonly: false,
              styleRule: "",
              type: "select",
              value: ""
            },
            {
              fieldName: "产品名称",
              fieldNameCode: "productName",
              hide: false,
              must: true,
              readonly: false,
              showUnit: "",
              styleRule: "none",
              type: "text",
              value: "",
              flag: true
            },
            {
              fieldName: "产品类型",
              fieldNameCode: "productType",
              hide: false,
              must: true,
              noTransform: true,
              newOptions: [],
              readonly: false,
              styleRule: "",
              type: "select",
              value: ""
            },
            {
              fieldName: "产品归属",
              fieldNameCode: "productAffiliation", //TODO
              hide: false,
              must: false,
              readonly: false,
              showUnit: "",
              styleRule: "none",
              type: "text-button",
              value: "",
              flag: true,
              btnText: ''
            },
            {
              fieldName: "产品分类",
              fieldNameCode: "productClassify", //TODO
              hide: false,
              must: false,
              noTransform: true,
              newOptions: [],
              readonly: false,
              styleRule: "",
              type: "select",
              value: "",
              flag: true
            },
            {
              fieldName: "产品利率",
              fieldNameCode: "productRate",
              hide: false,
              must: false,
              readonly: false,
              showUnit: "",
              styleRule: "none",
              type: "textarea",
              value: "",
              flag: true
            },
            {
              fieldName: "利率类型",
              fieldNameCode: "rateType", //TODO
              hide: false,
              must: false,
              readonly: false,
              showUnit: "",
              styleRule: "none",
              type: "radio",
              options: [], //取bs.saas_fund_rate_type
              value: "",
              flag: true
            },
            {
              fieldName: "服务费率(%)",
              fieldNameCode: "serverRate",
              hide: false,
              must: true,
              readonly: false,
              showUnit: "",
              styleRule: "float",
              type: "text",
              value: ""
            },
            {
              fieldName: "佣金费率(%)",
              fieldNameCode: "partnerRate",
              hide: false,
              must: true,
              readonly: false,
              showUnit: "",
              styleRule: "float",
              type: "text",
              value: ""
            },
            {
              fieldName: "资金方返佣",
              fieldNameCode: "isRebate",
              hide: false,
              isMust: true,
              readonly: false,
              showUnit: "",
              styleRule: "none",
              type: "radio",
              line: 1,
              options: [{
                code: "1",
                name: "是"
              },
              {
                code: "0",
                name: "否"
              }],
              value: "1"
            },
            {
              fieldName: "资金方返佣费率(%)",
              fieldNameCode: "orgRebateRate",
              hide: false,
              must: true,
              readonly: false,
              showUnit: "",
              styleRule: "float",
              type: "text",
              value: "0"
            },
            {
              fieldName: "资金方返佣频率",
              fieldNameCode: "orgRebateFre",
              hide: false,
              must: true,
              readonly: false,
              showUnit: "",
              styleRule: "none",
              type: "radio",
              options: [],
              value: "1"
            },
            {
              fieldName: "最高授信",
              fieldNameCode: "borrowQuota",
              hide: false,
              must: false,
              readonly: false,
              showUnit: "",
              styleRule: "none",
              type: "text",
              value: "",
              flag: true
            },
            {
              fieldName: "借款期限",
              fieldNameCode: "borrowPeriods", //TODO
              hide: false,
              must: false,
              readonly: false,
              showUnit: "",
              type: "text",
              value: "",
              flag: true
            },
            {
              fieldName: "还款方式",
              fieldNameCode: "repayMethod", //TODO
              hide: false,
              must: false,
              readonly: false,
              showUnit: "",
              styleRule: "none",
              type: "checkbox",
              value: [],
              options:[], // bs.saas_fund_repay_mode
              line: 1,
              checkAll: true
            },
            {
              fieldName: "产品介绍",
              fieldNameCode: "borrowPurpose", //TODO
              hide: false,
              must: false,
              readonly: false,
              showUnit: "",
              // type: "textarea",
              type: "editor",
              value: "",
              flag: true
            },
            {
              fieldName: "借款成数",
              fieldNameCode: "borrowPercentage", //TODO
              hide: false,
              must: false,
              readonly: false,
              showUnit: "",
              type: "text",
              value: ""
            },
            {
              fieldName: "放款周期",
              fieldNameCode: "loanCycle", //TODO
              hide: false,
              must: false,
              readonly: false,
              showUnit: "",
              type: "text",
              value: ""
            },
            {
              fieldName: "产品标签",
              fieldNameCode: "productLabel", //TODO
              hide: false,
              must: false,
              readonly: false,
              showUnit: "",
              type: "select-input", // TODO
              value: [
                {
                  key: '',
                  value: ''
                },
                {
                  key: '',
                  value: ''
                },
                {
                  key: '',
                  value: ''
                }
              ],
              options: [
                {
                  code: '0',
                  name: '[空]'
                },
                {
                  code: 'hot',
                  name: '[hot]',
                  icon: 'hl-icon-428'
                },
                {
                  code: 'new',
                  name: '[new]',
                  icon: 'hl-icon-NEWS'
                },
                {
                  code: 'fire',
                  name: '[fire]',
                  icon: 'hl-icon-426'
                }
              ],
              isIcon: true,
              flag: true
            },
            // {
            //   fieldName: "最长期限(个月)",
            //   fieldNameCode: "periods",
            //   hide: false,
            //   must: false,
            //   readonly: false,
            //   showUnit: "",
            //   styleRule: "num",
            //   type: "text",
            //   value: ""
            // },
            {
              fieldName: "产品特色",
              fieldNameCode: "productAdvantage",
              hide: false,
              must: false,
              readonly: false,
              showUnit: "",
              styleRule: "none",
              type: "textarea",
              value: "",
              flag: true
            },
            {
              fieldName: "排序号",
              fieldNameCode: "sort", //TODO
              hide: false,
              must: false,
              readonly: false,
              showUnit: "",
              type: "text",
              value: "",
              flag: true
            },
            {
              fieldName: "申请条件",
              fieldNameCode: "applyConditions",
              hide: false,
              must: false,
              readonly: false,
              showUnit: "",
              styleRule: "",
              // type: "textarea",
              type: "editor",
              value: "",
              flag: true
            },
            {
              fieldName: "维客展示",
              fieldNameCode: "wkShow",
              hide: false,
              must: false,
              readonly: false,
              showUnit: "",
              styleRule: "none",
              type: "radio",
              options: [{
                code: "1",
                name: "启用"
              },
              {
                code: "0",
                name: "禁用"
              }],
              value: "1"
            },
            {
              fieldName: "启用状态",
              fieldNameCode: "productStatus",
              hide: false,
              must: false,
              readonly: false,
              showUnit: "",
              styleRule: "none",
              type: "radio",
              options: [{
                code: "1",
                name: "启用"
              },
              {
                code: "0",
                name: "禁用"
              }],
              value: "1"
            }
          ],
          formKey: "fundingRequireInfo",
          formLabel: "基本要素",
          viewType: "basic"
        },
        {
          basicFields: [
          {
            fieldName: "借款人年龄",
            fieldNameCode: "accessAge", //accessAgeMax  accessAgeMin
            hide: false,
            must: false,
            readonly: false,
            showUnit: "",
            styleRule: "age",
            type: "rangeinput",
            value: {
              start: '',
              end: ''
            }
          },
            {
              fieldName: "月收入",
              fieldNameCode: "accessIncome", // accessIncomeMax accessIncomeMin
              hide: false,
              must: false,
              readonly: false,
              showUnit: "",
              styleRule: "float",
              type: "rangeinput",
              value: {
                start: '',
                end: ''
              }
            },
            {
              fieldName: "准入行业类别",
              fieldNameCode: "accessIndustry",
              hide: false,
              must: false,
              readonly: false,
              showUnit: "",
              styleRule: "none",
              type: "checkbox",
              value: [],
              options:[],
              line: 1,
              checkAll: true
            },
            {
              fieldName: "房屋类别",
              fieldNameCode: "accessHouseType", // 准入房屋 0代表所有 英文逗号隔开
              hide: false,
              must: false,
              readonly: false,
              showUnit: "",
              styleRule: "none",
              type: "checkbox",
              value: [],
              options:[],
              line: 1,
              checkAll: true
            },
            {
              fieldName: "准入区域",
              fieldNameCode: "accessArea",
              hide: false,
              must: false,
              readonly: false,
              showUnit: "",
              styleRule: "none",
              type: "textarea",
              value: ""
            },
            {
              fieldName: "房屋年龄",
              fieldNameCode: "accessHouseAge", // accessHouseAgeMax accessHouseAgeMin
              hide: false,
              must: false,
              readonly: false,
              showUnit: "",
              styleRule: "age",
              type: "rangeinput",
              value: {
                start: '',
                end: ''
              }
            },
            {
              fieldName: "建筑面积(㎡)",
              fieldNameCode: "accessHouseArea", // accessHouseAreaMin accessHouseAreaMax
              hide: false,
              must: false,
              readonly: false,
              showUnit: "",
              styleRule: "float",
              type: "rangeinput",
              value: {
                start: '',
                end: ''
              }
            },{
              fieldName: "其他准入条件",
              fieldNameCode: "accessRemark",
              hide: false,
              must: false,
              readonly: false,
              showUnit: "",
              styleRule: "none",
              type: "textarea",
              value: ""
            },
          ],
          formKey: "fundingCondition",
          formLabel: "准入条件",
          viewType: "basic"
        }
      ],
      navBarOptions: [],
      fundFeeDetailList: [],
      fundFeeDetailListTemplate: [],
      fundings: [], // 资金方
      hardReset: true, // 用于强制刷新
      // curLoanItem: this.$route.query
      curLoanItem: {
        isReadOnly: Boolean(this.$route.query.isReadOnly),
        id: this.$route.query.id
      },
      conditions: {
        serverRateDefault: 1, // 是否使用默认服务费率 1 默认 0 不默认
        partnerRateDefault: 1, // 是否使用默认佣金费率 1 默认 0 不默认
        accessDefault: 1 // 是否使用默认准入条件 1 默认 0 不默认
      },
      isSubmitDisabled: false
    }
  },
  computed: {
    ...mapState(['paraFormatCheck'])
  },
  watch: {
    formData: {
      handler () {
        // 资金方返佣与资金方返佣费率、资金方返佣频率联动
        let isRebateFiled = this.getOptions('fundingRequireInfo', 'isRebate')
        let orgRebateRateFiled = this.getOptions('fundingRequireInfo','orgRebateRate')
        let orgRebateFreFiled = this.getOptions('fundingRequireInfo','orgRebateFre')
        if (isRebateFiled.value == '0') {
          orgRebateRateFiled.value = '0'
          orgRebateRateFiled.readonly = true
          orgRebateFreFiled.value = '1'
          orgRebateFreFiled.readonly = true
        } else {
          orgRebateRateFiled.readonly = false
          orgRebateFreFiled.readonly = false
        }
      },
      deep:true,
      immediate: true
    }
  },
  methods: {
    async OptionsInit () {
       // 资金方
      this.fundings = await FundingApi.getFundName()
      let fundingsOptions = this.getOptions('fundingRequireInfo', 'fundSourceId')
      fundingsOptions.options = this.getCodeName(this.fundings)
      // 渠道方
      let channels = await FundingApi.getChannelName()
      let channelOptions = this.getOptions('fundingRequireInfo', 'fundChannel')
      channelOptions.options = this.getCodeName(channels)
      // 城市
      this.cityItems = await FundingApi.getCityName()
      // bs
      const codeAll = await BS.getCode()
      // 产品类型
      let fundTypeOptions = this.getOptions('fundingRequireInfo', 'productType')
      fundTypeOptions.options = this.getCodeName(codeAll.saas_fund_fund_type)
       // 准入行业类别
      let fundIndustryOptions = this.getOptions('fundingCondition', 'accessIndustry')
      fundIndustryOptions.options = this.getLabelValue(codeAll.saas_fund_industry)
      let checkoutAll = {
        label: '全选',
        value: 'checkAll'
      }
      fundIndustryOptions.options.push(checkoutAll)
      // 房屋类别
      let houseTypeOptions = this.getOptions('fundingCondition', 'accessHouseType')
      houseTypeOptions.options = this.getLabelValue(codeAll.saas_fund_house_type)
      houseTypeOptions.options.push(checkoutAll)
      // 产品分类
      let productClassifyOptions = this.getOptions('fundingRequireInfo', 'productClassify')
      productClassifyOptions.options = this.getCodeName(codeAll.saas_fund_fund_kind) // TODO 产品分类bs暂未定义
      // 获取利率类型
      let rateTypeOptions = this.getOptions('fundingRequireInfo', 'rateType')
      rateTypeOptions.options = this.getCodeName(codeAll.saas_fund_rate_type)
      // 获取还款方式
      let repayMethodOptions = this.getOptions('fundingRequireInfo', 'repayMethod')
      repayMethodOptions.options = this.getLabelValue(codeAll.saas_fund_repay_mode)
      repayMethodOptions.options.push(checkoutAll)
      // 获取机构返佣频率
      let codeObjAll = await BS.getCodeAll()
      let codeItems = (codeObjAll.saas_fund_commission_mode && codeObjAll.saas_fund_commission_mode.items) || []
      let orgRebateFreOpions = this.getOptions('fundingRequireInfo', 'orgRebateFre')
      orgRebateFreOpions.options = this.getCodeName(codeItems, true)
      // 编辑产品时，资金方和产品名称不可编辑
      // if (this.curLoanItem.id) {
      //   this.formData[0].basicFields[0].readonly = true
      //   this.formData[0].basicFields[2].readonly = true
      // }
      // this.$refs['fundingRequireInfo'][0].init()
    },
    getOptions: function (formKey, fieldNameCode, origin) {
      let formData = this.formData
      if (origin) {
        formData = origin
      }
      let result
      for (let i = 0; i < formData.length; i++) {
        if (formData[i].formKey === formKey) {
          let fields = formData[i].basicFields
          for (let j = 0; j < fields.length; j++) {
            if (fields[j].fieldNameCode === fieldNameCode) {
              result = fields[j]
            }
          }
        }
      }
      return result
    },
    save: async function () {
      if (this.isSubmitDisabled) {
        return
      }
      this.isSubmitDisabled = true
      if (!Validate.validate(this.$refs)) {
        this.$refs.toast.show('数据填写有误！')
        this.isSubmitDisabled = false
        return
      }
      let param = {}
      param = await FundCommon.getFormValue(this.formData)
      param.serverRate = parseFloat(param.serverRate)*1000
      param.orgRebateRate = parseFloat(param.orgRebateRate)*1000
      param.partnerRate = parseFloat(param.partnerRate)*1000
      param.quota = parseInt(param.quota) * 10000 * 100 // 万元转为分
      param.periods = parseInt(param.periods)
      param.accessAgeMax = parseInt(param.accessAgeMax)
      param.accessAgeMin = parseInt(param.accessAgeMin)
      param.accessIncomeMax = parseInt(param.accessIncomeMax)
      param.accessIncomeMin = parseInt(param.accessIncomeMin)
      param.accessHouseAgeMax = parseInt(param.accessHouseAgeMax)
      param.accessHouseAgeMin = parseInt(param.accessHouseAgeMin)
      param.accessHouseAreaMax = parseInt(param.accessHouseAreaMax)
      param.accessHouseAreaMin = parseInt(param.accessHouseAreaMin)
      param.wkShow = parseInt(param.wkShow)
      let productLabel = []
      for (let i = 0; i < param.productLabel.length; i++) {
        let item = param.productLabel[i]
        let obj = {}
        if (item.value) {
          obj[item.key] = item.value
          productLabel.push(obj)
        }
      }
      param.productLabel = JSON.stringify(productLabel)

      param.fundFeeDetailList = Utils.deepCopy(this.fundFeeDetailList, [])
      param.fundFeeDetailDelList = [] //需要删除的城市

      param.id = this.curLoanItem.id || ''
      for (let i = 0; i < param.fundFeeDetailList.length; i++) {
        let item = param.fundFeeDetailList[i]
        item.name = this.fundings[item.fundSourceId]
        item.serverRate = parseFloat(item.serverRate)*1000
        item.partnerRate = parseFloat(item.partnerRate)*1000
        item.accessIncomeMax = parseInt(item.accessIncomeMax)
        item.accessIncomeMin = parseInt(item.accessIncomeMin)
        item.accessHouseAgeMax = parseInt(item.accessHouseAgeMax)
        item.accessHouseAgeMin = parseInt(item.accessHouseAgeMin)
        item.accessHouseAreaMax = parseInt(item.accessHouseAreaMax)
        item.accessHouseAreaMin = parseInt(item.accessHouseAreaMin)
      }
      FundingApi.productConfirm(param).then(() => {
        this.$refs.toast.show('保存成功')
        this.$router.push('/funding/product')
      }, (err) => {
         this.$refs.toast.show(err)
      }).finally(() => {
        this.isSubmitDisabled = false
      })
    },
    giveUp: function () {
      this.$router.push('/funding/product')
    },
    // 获取产品详情
    getProductDeatil: function () {
      let param = {
        id: this.curLoanItem.id
      }
      FundingApi.feeDetailList(param).then((data) => {
        let obj = data
        this.conditions.serverRateDefault = data.serverRateDefault
        this.conditions.partnerRateDefault = data.partnerRateDefault
        this.conditions.accessDefault = data.accessDefault
        // 产品标签处理
        let productLabel = obj['productLabel'] ? JSON.parse(obj['productLabel']) : []
        let productLabelArr = []
        for (let m = 0; m < productLabel.length; m++) {
          let obj = {}
          for (let key in productLabel[m]) {
            obj.key = key
            obj.value = productLabel[m][key]
          }
          productLabelArr.push(obj)
        }
        for (let i = productLabelArr.length; i < 3; i++) {
          productLabelArr.push({key: '', value: ''})
        }
        obj['productLabel'] = productLabelArr
        this.fundFeeDetailListTemplate = FundCommon.getFormTemplate(obj, this.formData)
        this.fundFeeDetailList = obj.fundFeeDetailList
        this.refashComp()
      }, (err) => {
         this.$refs.toast.show(err)
      })
    },
    async init () {
      await this.OptionsInit()
      if (this.curLoanItem.id) {
        this.getProductDeatil()
      }
    },
    getCodeName (list, isAll) {
      if (!list) {
        return ''
      }
      if (isAll) { // 是否是全集（codeset-obj）
        let temp = []
        for (let i in list) {
          if (list[i].status === 1) {
            let obj = {}
            obj.code = list[i].codeValue
            obj.name = list[i].codeName
            temp.push(obj)
          }
        }
        return temp
      }
      if (list.length || list.length === 0) { // 数组
        return list.map((item) => {
          return {name: item.label, code: item.value}
        })
      } else {
        let tempArr = []
        for (let key in list) {
          let obj = {}
          obj.code = key
          obj.name = list[key]
          tempArr.push(obj)
        }
        return tempArr
      }
    },
    getLabelValue (target) {
      let tempArr = []
      for (let key in target) {
        let obj = {}
        obj.value = key
        obj.label = target[key]
        tempArr.push(obj)
      }
      return tempArr
    },
    changeCity (fundFeeDetailList) {
      this.fundFeeDetailList = fundFeeDetailList
    },
    changeConditions (result) {
      this.conditions = result
    },
    refashComp() {
      this.hardReset = false
      // this.$refs['fundingRequireInfo'][0].init() select 和 address 控件格式化 控件自己格式
      this.$refs['allot'].init()
      this.$nextTick(() => {
        this.hardReset= true
      })
    },
    getBtnText () {
      let fundingsOptions = this.getOptions('fundingRequireInfo', 'fundSourceId')
      let result = fundingsOptions.options.find((option) => {
        return option.code == fundingsOptions.value
      })
      let productAffiliation = this.getOptions('fundingRequireInfo', 'productAffiliation')
      productAffiliation.btnText = result ? result.name : ''
    },
    ...mapMutations(['setParaFormatCheck'])
  },
  created() {
    this.init()
  }
}
</script>

<style lang="scss" scope>
.detail {
    overflow: scroll;
    background: #EFF0F8;
    min-height: 100vh;
    .content {
      width: 100%;
      min-height: 100vh;
      margin-top: 50px;
      margin-bottom: 100px;
      .head {
        height: 64px;
        width: 100%;
        background: #FFFFFF;
        border-radius: 4px;
        font-size: 16px;
        color: #333333;
        text-align: center;
        position: relative;
        .lable {
          line-height: 64px;
          font-size: 16px;
          color: #333333;
          font-weight: bold;
          padding-right: 40px;
        }
        .abandon {
          position: absolute;
          top: 12px;
          right: 30px;
        }
      }
    }
    .btn-box {
      display: flex;
      align-items: center;
      justify-content: center;
      padding-bottom: 50px;
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      z-index: 10;
    }
    .finish {
      margin: 0 20px;
    }
    .main {
      display: flex;
      overflow: hidden;
    }
  }
  .fixed {
    position: fixed;
    width: 100%;
    z-index: 14;
  }
.main-left-bar {
  top: 60px;
  position: relative;
  .box {
    position: fixed;
  }
}
.tips {
  font-size: 14px;
  text-align: center;
  line-height: 40px;
  >i {
    color: #F6622C;
    padding: 0 5px;
  }
}
</style>
