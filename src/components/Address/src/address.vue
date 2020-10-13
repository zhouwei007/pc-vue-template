<template>
  <div class="address">
    <Select
      ref="province"
      class="province"
      placeholder="请选择省"
      :isReadOnly="isReadOnly"
      :options="provinces"
      :value="curProvince.value"
      :required="required"
      lable="省"
      @change="provinceChange"
    ></Select>
    <Select
      ref="city"
      class="city"
      placeholder="请选择市"
      :isReadOnly="isReadOnly"
      :options="cities"
      :value="curCity.value"
      :required="required"
      lable="市"
      @change="cityChange"
    ></Select>
    <Select
      ref="county"
      class="county"
      placeholder="请选择区（县）"
      :isReadOnly="isReadOnly"
      :options="counties"
      :value="curCounty.value"
      :required="required"
      lable="区（县）"
      @change="countyChange"
    ></Select>
    <Input
      ref="detail"
      :disabled="isReadOnly"
      :value="curDetail"
      :required="required"
      label="详细地址"
      placeholder="请填写详细地址"
      class="address-detail"
      @blur="blurInput($event)"
    />
  </div>
</template>

<script>
import BS from '@/common/bs'
import Select from '@/components/Select'
import Input from '@/components/Input'
export default {
  name: 'Address',
  components: {
    Select,
    Input
  },
  props: {
    isReadOnly: {
      type: Boolean,
      default: false
    },
    initAddress: { // 传递原始地址数据
      type: Object,
      default: () => {
        return {}
      }
    },
    required: {
      type: [Boolean, Number],
      default: false
    }
  },
  data () {
    return {
      areaCode: {},
      provinces: [],
      cities: [],
      counties: [],
      curProvince: {},
      curCity: {},
      curCounty: {},
      curDetail: ''
    }
  },
  computed: {
    defaultAddress () { // 格式化原始地址数据
      let newAddress = {}
      if (this.initAddress) {
        let addr = this.initAddress
        newAddress.provinceName = addr.refProvinceText
        newAddress.provinceCode = addr.refProvinceVal
        newAddress.cityName = addr.refCityText
        newAddress.cityCode = addr.refCityVal
        newAddress.countyName = addr.refAreaText
        newAddress.countyCode = addr.refAreaVal
        newAddress.detail = addr.refStreet
      }
     return  newAddress
    }
  },
  watch: {
    curProvince: function () {
      this.getProvince()
    },
    curCity: function () {
      this.getCity()
    },
    curCounty: function () {
      this.getCounty()
    }
  },
  methods: {
    async init () {
      await this.getAreaCode()
      await this.getProvince()
      await this.getCity()
      await this.getCounty()
      this.curProvince = this.defaultAddress.provinceCode ? { label: this.defaultAddress.provinceName, value: this.defaultAddress.provinceCode } : {},
      this.curCity = this.defaultAddress.cityCode ? { label: this.defaultAddress.cityName, value: this.defaultAddress.cityCode } : {},
      this.curCounty = this.defaultAddress.countyCode ? { label: this.defaultAddress.countyName, value: this.defaultAddress.countyCode } : {},
      this.curDetail = this.defaultAddress.detail
    },
    async getProvince () {
      let provinces = this.areaCode.PROVINCE
      let result = this.getOptions(provinces)
      this.$set(this, 'provinces', result)
    },
    getCity () {
      if (!this.curProvince.value) {
        return
      }
      let cities = this.areaCode.CITY[this.curProvince.value]
      let result = this.getOptions(cities)
      this.$set(this, 'cities', result)
    },
    getCounty () {
      if (!this.curCity.value) {
        return
      }
      let counties = this.areaCode.COUNTY[this.curCity.value]
      let result = this.getOptions(counties)
      this.$set(this, 'counties', result)
    },
    getOptions (origins) {
      let options = []
      for (let i = 0; i < origins.length; i++) {
        let option = origins[i]
        let temp = {}
        temp.label = option.name
        temp.value = option.code
        options.push(temp)
      }
      return options
    },
    provinceChange (opt) {
      this.curProvince = opt
      this.defaultAddress.provinceCode = opt.value
      this.defaultAddress.provinceName = opt.label
      this.getCity()
      this.curCity = {}
      this.curCounty = {}
      this.$emit('change', this.defaultAddress)
    },
    cityChange (opt) {
      this.curCity = opt
      this.defaultAddress.cityCode = opt.value
      this.defaultAddress.cityName = opt.label
      this.getCounty()
      this.curCounty = {}
      this.$emit('change', this.defaultAddress)
    },
    countyChange (opt) {
      this.curCounty = opt
      this.defaultAddress.countyCode = opt.value
      this.defaultAddress.countyName = opt.label
      this.$emit('change', this.defaultAddress)
    },
    blurInput (e) {
      this.defaultAddress.detail = e.target.value
      this.$emit('change', this.defaultAddress)
    },
    validate () {
      let $refs = this.$refs
      let flag = true
      for (let key in $refs) {
        let ref = $refs[key]
        if (ref.validate) {
          if (!ref.validate()) {
            flag = false
          }
        }
      }
      return flag
    },
    async getAreaCode () {
      let data = await BS.AREA_CODE()
      this.areaCode = data
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="scss" scope>
.address {
  width: 450px;
  min-height: 75px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  .address-detail {
    width: 100%;
  }
  .province,.city,.county {
    flex-grow: 1;
    margin-bottom: 10px;
    margin-right: 10px;
  }
}
</style>
