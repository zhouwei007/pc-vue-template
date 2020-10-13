<template>
  <div class="general">
    <template v-for="(item, index) in options">
      <div v-if="!item.hide" :key="index" :class="{option: true, single: item.line == 1}">
        <span class="lable">
          <span class="flag" v-if="item.flag"><i class="hl-icon hl-icon-430"></i></span>
          {{item.showUnit ? `${item.fieldName}（${item.showUnit}）` : item.fieldName}}
          <span class="must" v-if="item.must">*</span>
        </span>
        <!-- describeObj 为高级交互对象
              目前提供高级的控件
              RadioGroup，Input，input(textarea),Select,DatePicker
        -->
        <RadioGroup
          :ref="item.fieldNameCode"
          class="element"
          v-if="item.type === 'radio'"
          :disabled="isReadOnly || item.isReadonly || item.readonly"
          :required="item.must"
          v-model="item.value"
          :describeObj="describe()[`${item.formKey}&${item.fieldNameCode}`] || {}"
        >
          <template v-for="(col, index) in item.options">
            <Radio :value="col.code" :key="index" :disabled="isReadOnly || item.isReadonly || item.readonly">{{col.name}}</Radio>
          </template>
        </RadioGroup>
        <Input
          :ref="item.fieldNameCode"
          class="element"
          v-if="item.type === 'text'"
          v-model="item.value"
          :disabled="isReadOnly || item.isReadonly || item.readonly"
          :required="item.must"
          :label="item.fieldName"
          :valiRule="item.styleRule?paraFormatCheck[item.styleRule]:''"
          @blur="blurInput($event,item)"
          :describeObj="describe()[`${item.formKey}&${item.fieldNameCode}`] || {}"
        />
        <Input
          :ref="item.fieldNameCode"
          class="element"
          v-if="item.type === 'textarea'"
          type="textarea"
          v-model="item.value"
          :disabled="isReadOnly || item.isReadonly || item.readonly"
          :required="item.must"
          :label="item.fieldName"
          :valiRule="item.styleRule?paraFormatCheck[item.styleRule]:''"
          @change="blurInput($event,item)"
          :describeObj="describe()[`${item.formKey}&${item.fieldNameCode}`] || {}"
        />
        <Editor
          :ref="item.fieldNameCode"
          class="element"
          v-if="item.type === 'editor'"
          v-model="item.value"
          :disabled="isReadOnly || item.isReadonly || item.readonly"
          :menus="[]"
          @change="changeEditor(arguments,item)"
        />
        <div
          v-if="item.type === 'label'"
          class="element">{{item.value}}</div>
        <Select
          :ref="item.fieldNameCode"
          class="element"
          v-if="item.type === 'select'"
          :options="item.options"
          :defaultValue="item.value"
          :isReadOnly="isReadOnly || item.isReadonly || item.readonly"
          :isClear="(isReadOnly || item.isReadonly || item.readonly) ? false : true"
          :required="item.must"
          :label="item.fieldName"
          @change="changeSelect(arguments, item)"
          :describeObj="describe()[`${item.formKey}&${item.fieldNameCode}`] || {}"
        />
        <Address
          :ref="item.fieldNameCode"
          class="element"
          v-if="item.type === 'address'"
          :isReadOnly="isReadOnly || item.isReadonly || item.readonly"
          :initAddress="item.address"
          :required="item.must"
          @change="changeAddress(arguments, item)"
        />
        <DatePicker
          :ref="item.fieldNameCode"
          class="element"
          v-if="item.type === 'date'"
          v-model="item.value"
          :isReadOnly="isReadOnly || item.isReadonly || item.readonly"
          :required="item.must"
          :label="item.fieldName"
          :describeObj="describe()[`${item.formKey}&${item.fieldNameCode}`] || {}"
        />
        <Input
          :ref="item.fieldNameCode"
          class="element"
          v-if="item.type === 'datetime' || item.type === 'time'"
          type="text"
          v-model="item.value"
          :disabled="isReadOnly || item.isReadonly || item.readonly"
          :describeObj="describe()[`${item.formKey}&${item.fieldNameCode}`] || {}"
        />
        <Upload
          :ref="item.fieldNameCode"
          class="element min"
          v-if="item.type === 'picture'"
          :fileList="item.fileList"
          :isPictureViewer="isReadOnly || item.isReadonly || item.readonly"
          :required="item.must"
          :label="item.fieldName"
          @change="changePicture(arguments, item)"
          @delete="deletePicture(arguments, item)"
        />
        <RangeInput
          :ref="item.fieldNameCode"
          class="element"
          v-if="item.type === 'rangeinput'"
          v-model="item.value"
          :disabled="isReadOnly || item.isReadonly || item.readonly"
          :required="item.must"
          :label="item.fieldName"
          :valiRule="item.styleRule?paraFormatCheck[item.styleRule]:''"
        />
        <Checkbox-group
          :ref="item.fieldNameCode"
          class="element"
          :describeObj="describe()[`${item.formKey}&${item.fieldNameCode}`] || {}"
          v-if="item.type=='checkbox'"
          v-model="item.value"
          :disabled="isReadOnly || item.isReadonly || item.readonly"
        >
          <Checkbox
            :key="option.value"
            v-for="option in item.options"
            :label="option.value"
            @change="checkChange(arguments, item)"
            :indeterminate="option.value == 'checkAll' && item.isIndeterminate"
          >
            {{option.label}}
          </Checkbox>
        </Checkbox-group>
        <div v-if="item.type === 'select-input'">
          <SelectInput
            :ref="item.fieldNameCode"
            v-for="(opt, idx) in item.value"
            :key="opt.key + idx"
            :opt="opt"
            :options="item.options"
          ></SelectInput>
        </div>
        <div class="text-button" v-if="item.type === 'text-button'">
          <Input
            :ref="item.fieldNameCode"
            class="element mid"
            v-model="item.value"
            :disabled="isReadOnly || item.isReadonly || item.readonly"
            :required="item.must"
            :label="item.fieldName"
            :valiRule="item.styleRule?paraFormatCheck[item.styleRule]:''"
            @blur="blurInput($event,item)"
          />
          <Button
            v-if="item.btnText && !(isReadOnly || item.isReadonly || item.readonly)"
            class="set"
            @click="textBtnclick(item)"
          >{{`设为“${item.btnText}”`}}</Button>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Select from '@/components/Select'
import Input from '@/components/Input'
import DatePicker from '@/components/DatePicker'
import Upload from '@/components/Upload'
import Address from '@/components/Address'
import { Radio, RadioGroup } from '@/components/RadioGroup'
import RangeInput from '@/components/RangeInput'
import { Checkbox, CheckboxGroup } from '@/components/checkbox'
import SelectInput from '@/components/SelectInput'
import Button from '@/components/Button'
import Editor from '@/components/Editor'
// import Utils from '@/common/utils'
export default {
  template: '.general',
  inject: {
    describe: {
      default: {}
    },
    seniorAction: {
      default: null
    }
  },
  props: {
    options: {
      type: Array,
      default: () => []
    },
    isReadOnly: {
      type: [Boolean, String],
      default: true
    }
  },
  data () {
    return {
      lists: [],
      radioVal: 0
    }
  },
  components: {
    Select,
    Input,
    DatePicker,
    Upload,
    Address,
    Radio,
    RadioGroup,
    RangeInput,
    Checkbox,
    CheckboxGroup,
    SelectInput,
    Button,
    Editor
  },
  computed: {
    ...mapState(['paraFormatCheck'])
  },
  model: {
    prop: 'options',
    event: 'update:options'
  },
  methods: {
    blurInput: function (event, item) {
      item.value = event.target.value
    },
    changeEditor: function (arg, item) {
      item.value = arg[0]
    },
    changeSelect: function (arg, item) {
      item.value = arg[0].value
      if (item.func) {
        item.func()
      }
    },
    changeAddress: function (arg, item) {
      if (!item.address) {
        item.address = {}
      }
      let newAddress = arg[0]
      item.address.refProvinceText = newAddress.provinceName
      item.address.refProvinceVal = newAddress.provinceCode
      item.address.refCityText = newAddress.cityName
      item.address.refCityVal = newAddress.cityCode
      item.address.refAreaText = newAddress.countyName
      item.address.refAreaVal = newAddress.countyCode
      item.address.refStreet = newAddress.detail
      delete item.newAddress
    },
    changePicture: function (arg, item) {
      let tempList = []
      for (let i = 0; i < arg[0].length; i++) {
        let temp = {}
        temp.des = ''
        temp.fileId = arg[0][i].postfix
        temp.fileIdName = arg[0][i].fileName
        temp.sort = ''
        tempList.push(temp)
      }
      if (!item.fileList) {
        item.fileList = []
      }
      item.fileList = item.fileList.concat(tempList)
    },
    deletePicture: function (arg, item) {
      let tempList = []
      if (arg[0] && arg[0].length > 0) {
        tempList = arg[0]
      }
      if (!item.fileList) {
        item.fileList = []
      }
      item.fileList = tempList
    },
    checkChange: function (arg, item) {
      let all = []
      for (let i = 0; i < item.options.length; i++) {
        all.push(item.options[i].value)
      }
      if(arg[1].target.value == 'checkAll') {
        item.value = arg[0] ? all : [];
        item.isIndeterminate = false;
      } else {
        item.isIndeterminate = arg[0].length === item.options.length ? false : true
      }
    },
    validate: function () {
      let $refs = this.$refs
      let flag = true
      for (let key in $refs) {
        let ref = $refs[key][0]
        if (ref && ref.validate) {
          if (!ref.validate()) {
            flag = false
          }
        }
      }
      return flag
    },
    textBtnclick: function (item) {
      item.value = item.btnText
    }
  },
  created () {
  }
}
</script>

<style lang="scss" scope>
.general {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  .option {
    display: flex;
    align-items: center;
    width: calc(50% - 70px);
    padding: 6px 70px 6px 0;
    min-height: 30px;
    .lable {
      width: 184px;
      font-size: 14px;
      color: #333333;
      padding-right: 10px;
    }
    .element {
      width: 100%;
      &.min {
        min-width: 348px;
      }
    }
    &.single {
      width: calc(100% - 70px);
    }
  }
  .must {
    font-size: 14px;
    color: #F6622C;
  }
  .flag {
    font-size: 12px;
    color: #F6622C;
  }
  .text-button {
    display: flex;
    // width: calc(100% - 30px);
     width: 100%;
    .set {
      min-width: 100px;
      margin-left: 5px;
    }
  }
}
</style>
