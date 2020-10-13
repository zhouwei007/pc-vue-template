<template>
  <div class="city-allot">
    <div class="content-item" v-if="!isReadOnly">
      <span class="content-lable">选择城市</span>
      <MultiSelector
        :srcList='cityItems'
        :desList='desCityItems'
        @desChange='desChange'
      ></MultiSelector>
    </div>
    <div class="content-item" v-show="fundFeeDetailList.length > 0">
      <span class="content-lable">城市配置</span>
      <div class="cityConfig">
        <div class="thead">
          <div class="thead-tr" style="width: 100px;">城市</div>
          <div class="thead-tr" style="width: 200px">服务费率（%）</div>
          <div class="thead-tr" style="width: 200px">佣金费率（%）</div>
          <div class="thead-tr" style="width: 80px">准入条件</div>
          <div class="thead-tr" style="width: 60px">启用</div>
        </div>
        <template v-if="hardReset">
          <div
            :class="{tbody: true, abandon: !city.detailStatus}"
            :key="index"
            v-for="(city, index) in fundFeeDetailList"
          >
            <div style="width: 100px;">{{city.cityName}}</div>
            <div style="width: 200px">
              <Input
                :disabled="conditions.value.indexOf(1) > -1 || !city.detailStatus || isReadOnly"
                v-model="city.serverRate"
              />
            </div>
            <div style="width: 200px">
              <Input
                :disabled="conditions.value.indexOf(2) > -1 || !city.detailStatus || isReadOnly"
                v-model="city.partnerRate"
              />
            </div>
            <div style="width: 80px">
              <div :class="{config: true, disabled: conditions.value.indexOf(3) > -1 || !city.detailStatus}" @click="configCity(conditions.value.indexOf(3) > -1 || !city.detailStatus, index)">配置</div>
            </div>
            <div style="width: 60px">
              <Checkbox
                v-model="city.detailStatus"
                :true-label="1"
                :false-label="0"
                :disabled="isReadOnly"
              ></Checkbox>
            </div>
            <div class="table"></div>
          </div>
        </template>
        <div class="conditions" v-if="!isReadOnly">
          <template>
            <Checkbox-group
              ref="allotContions"
              v-model="conditions.value"
            >
              <Checkbox
                :key="option.value"
                :value="option.value"
                v-for="option in conditions.options"
                :label="option.value"
                @change="goon(arguments,option.value)"
              >
                {{option.label}}
              </Checkbox>
            </Checkbox-group>
          </template>
        </div>
      </div>
    </div>
    <Modal
      class="model"
      :value="isShowModel"
      :hasok="!isReadOnly"
      @update:value="modelCancel"
      @ok="modelCertain"
    >
      <Mark
        v-if="fundFeeDetailListTemplate.length > 0 && curModelTempIndex >= 0"
        :title="fundFeeDetailListTemplate[curModelTempIndex].formLabel"
        :unfold="true"
        :id="fundFeeDetailListTemplate[curModelTempIndex].formKey"
      >
        <GeneralTable
          :ref="fundFeeDetailListTemplate[curModelTempIndex].formKey"
          v-if="fundFeeDetailListTemplate[curModelTempIndex].viewType == 'basic'"
          :options ="fundFeeDetailListTemplate[curModelTempIndex].basicFields"
          :isReadOnly = isReadOnly
        ></GeneralTable>
      </Mark>
    </Modal>
    <Modal
      :value="isShowGoon"
      oktxt="继续"
      @ok="change"
      @update:value="goonCancel"
    >
    使用默认配置将覆盖已修改准入条件，是否继续？
    </Modal>
  </div>
</template>

<script>
import Input from '@/components/Input'
import FundingApi from '@/common/api/funding'
import MultiSelector from "@/components/MultiSelector"
import { Modal } from '@/components/Modal'
import GeneralTable from '../../formTypes/general'
import Mark from '@/components/Mark'
import { Checkbox, CheckboxGroup } from '@/components/checkbox'
import FundCommon from './common'
import Utils from '@/common/utils'
export default {
  name:'CityAllot',
  components: {
    MultiSelector, Input, Checkbox, Modal, GeneralTable, Mark, CheckboxGroup
  },
  data() {
    return {
      cityItems: [],
      selectCitys: [],
      checked: false,
      fundFeeDetailList: this.fundFeeList,
      fundFeeDetailListTemplate: this.fundFeeTemplate,
      conditions: {
        // value: [1, 2, 3],
        value: [],
        options: [
          {
            value: 1,
            label: '使用默认服务费率'
          },
          {
            value: 2,
            label: '使用默认佣金费率'
          },
          {
            value: 3,
            label: '使用默认准入条件'
          }
        ]
      },
      conditionValeus: [],
      isShowModel: false,
      isShowGoon: false,
      curModelTempIndex: -1,
      hardReset: true // 用于强制刷新
    }
  },
  props: {
    defaultConditions: {
      type: Object,
      default: () => {}
    },
    formData: {
      type: Array,
      default: () => []
    },
    fundFeeList: {
      type: Array,
      default: () => []
    },
    fundFeeTemplate: {
      type: Array,
      default: () => []
    },
    isReadOnly: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    serverRate() {
      let item = this.getOptions('fundingRequireInfo', 'serverRate')
      return item.value
    },
    partnerRate() {
      let item = this.getOptions('fundingRequireInfo', 'partnerRate')
      return item.value
    },
    desCityItems() {
      return this.initCities ()
    }
 },
  watch: {
    serverRate: {
      handler (newValue) {
        this.fundFeeDetailList.map((item) => {
          return item.serverRate = newValue
        })
        this.refashComp()
      },
      immediate: true
    },
    partnerRate: {
      handler (newValue) {
        this.fundFeeDetailList.map((item) => {
          return item.partnerRate = newValue
        })
        this.refashComp()
      },
      immediate: true
    },
    fundFeeList: function (newValue) {
      this.fundFeeDetailList = newValue
    },
    fundFeeTemplate: {
      handler (newValue) {
         this.fundFeeDetailListTemplate = newValue
      },
      immediate: true
    },
    defaultConditions: {
      handler (newValue) {
        this.conditions.value = []
         if (newValue.serverRateDefault) {
           this.conditions.value.push(1)
         }
         if (newValue.partnerRateDefault) {
           this.conditions.value.push(2)
         }
         if (newValue.accessDefault) {
           this.conditions.value.push(3)
         }
      },
      deep:true,
      immediate: true
    }
  },
  methods: {
    initCities () {
      let items = []
      for (let i = 0; i < this.fundFeeList.length; i++) {
        let obj = {}
        obj.label = this.fundFeeList[i].cityName
        obj.value = this.fundFeeList[i].cityId
        items.push(obj)
        this.cityItems.map((city, index) => {
          if (city.value === this.fundFeeList[i].cityId) {
            this.cityItems.splice(index, 1)
          }
        })
      }
      return items
    },
    // 弹框关闭和取消
    modelCancel: function () {
      this.isShowModel = false
    },
    configCity(isHide, index){
      if (!isHide) {
        this.isShowModel = true
        this.curModelTempIndex = index
      }
    },
    // 弹框 确定
    modelCertain: async function () {
      let obj = await FundCommon.getFormValue([this.fundFeeDetailListTemplate[this.curModelTempIndex]])
      let temp = this.fundFeeDetailList[this.curModelTempIndex]
      let result = Object.assign(temp, obj)
      this.fundFeeDetailList[this.curModelTempIndex] = result
      this.isShowModel = false
      this.refashComp()
    },
    // 选城市
    desChange: function (des) {
      this.fundFeeDetailList.map((item, index) => {
        if (!this.isCityExit(des, item.cityId)) { // 删除目标列表中不存在的项
          this.fundFeeDetailList.splice(index, 1, '')
          this.fundFeeDetailListTemplate.splice(index, 1, '')
        }
      })
      this.fundFeeDetailList = this.fundFeeDetailList.filter((item) => {
        return item != ''
      })
      this.fundFeeDetailListTemplate = this.fundFeeDetailListTemplate.filter((item) => {
        return item != ''
      })
      des.map( async (city) => { // 添加现有列表中不存在的项
        if (!this.isCityExit(this.fundFeeDetailList, city.value)) {
          let obj = await FundCommon.getFormValue(this.formData)
          obj.cityId = city.value
          obj.cityName = city.label
          obj.detailStatus = 1
          this.fundFeeDetailList.push(obj)
          let formDataItem = Utils.deepCopy(this.formData[1])
          this.fundFeeDetailListTemplate.push(formDataItem)
        }
      })
      this.$emit('changeCity', this.fundFeeDetailList)
    },
    // 判断现有列表中是否存在某个城市
    isCityExit: function (list, cityId) {
      let tempArr = list.filter((item) => {
        let id = item.cityId || item.value
        return id === cityId
      })
      if (tempArr.length > 0) {
        return true
      }
      return false
    },
    checkClick: function () {

    },
    goon: function (arg, value) {
      if (value == 3 && arg[0]) {
        this.isShowGoon = true
      } else {
        this.change()
      }
    },
    goonCancel: function () {
      let idx = this.conditions.value.indexOf(3)
      if (idx > -1) {
        this.conditions.value.splice(idx, 1)
      }
      this.isShowGoon = false
    },
    change: async function () {
      this.isShowGoon = false
      let value = this.conditions.value
      let result = {
        serverRateDefault: 0,
        partnerRateDefault: 0,
        accessDefault: 0
      }
      if (value.indexOf(1) > -1) {
        result.serverRateDefault = 1
        this.fundFeeDetailList.map((item) => {
          return item.serverRate = this.serverRate
        })
        this.refashComp()
      }
      if (value.indexOf(2) > -1) {
        result.partnerRateDefault = 1
        this.fundFeeDetailList.map((item) => {
        return item.partnerRate = this.partnerRate
      })
      this.refashComp()
      }
      if (value.indexOf(3) > -1) {
        result.accessDefault = 1
        let obj = await FundCommon.getFormValue([this.formData[1]])
        let formDataItem = Utils.deepCopy(this.formData[1])
        this.fundFeeDetailList.map((fund) => {
          Object.assign(fund, obj)
        })
        this.fundFeeDetailListTemplate.map((fundTemp) => {
          Object.assign(fundTemp, formDataItem)
        })
      }

      this.$emit('change', result)
    },
    refashComp() {
      this.hardReset = false
      this.$nextTick(() => {
        this.hardReset= true
      });
    },
    getOptions: function (formKey, fieldNameCode) {
      let result
      for (let i = 0; i < this.formData.length; i++) {
        if (this.formData[i].formKey === formKey) {
          let fields = this.formData[i].basicFields
          for (let j = 0; j < fields.length; j++) {
            if (fields[j].fieldNameCode === fieldNameCode) {
              result = fields[j]
            }
          }
        }
      }
      return result
    },
    async init () {
      this.cityItems = await FundingApi.getCityName();
    }
  },
  created () {
    this.init()
  },
}
</script>

<style lang="scss">
.city-allot {
  .content-item {
    display: flex;
    min-height: 30px;
    margin-bottom: 10px;
    .content-lable {
      width: 146px;
      font-size: 14px;
      color: #333333;
    }
  }
  .cityConfig {
    width: 664px;
    padding: 10px 0;
    border: 1px solid #E2E6ED;
    font-size: 14px;
    .thead{
      display: flex;
      height: 30px;
      .thead-tr{
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .tbody {
      display: flex;
      margin-bottom: 10px;
      &>div {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      &.fail {
        background: #333333;
      }
      &.abandon {
        opacity: 0.5
      }
      .config {
        cursor: pointer;
        &.disabled {
          color: #999999;
          cursor: default;
        }
      }
    }
  }
  .model {
    .sass-main {
      width: 60%;
      min-width: 1024px;
    }
  }
  .conditions {
    display: flex;
    justify-content: center;
  }
}
</style>