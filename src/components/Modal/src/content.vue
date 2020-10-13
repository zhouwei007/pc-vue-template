<template>
<div class="content">
  <template v-for="(option, index) in options">
    <div class="content-item" :key="index">
      <span class="content-lable">
        <i class="hl-icon hl-icon-430" v-if="option.hasIcon"></i>
        {{option.label}}
        <i class="content-required" v-if="option.type=='select' && option.required">*</i>
      </span>
      <Input
        v-if="option.type=='input'"
        class="content-element"
        :attrKey="option.key"
        :required="option.required"
        v-model="value[option.key]"
        @change="change"
        :disabled="disabled || option.disabled"
      />
      <add-item
        v-if="option.type=='addItem'"
        v-model="value[option.key]"
      >
      </add-item>
      <Input
        v-if="option.type=='textarea'"
        type="textarea"
        :attr-key="option.key"
        @change="change"
        :required="option.required"
        class="content-element"
        :disabled="disabled || option.disabled"
        v-model="value[option.key]"
      />
      <Select
        v-if="option.type=='select'"
        class="content-element"
        :isClear="option.isClear !== undefined ?  option.isClear : true"
        :attrKey="option.key"
        @change="change"
        :required="option.required"
        :options="option.options"
        :defaultValue="value[option.key]"
        :isReadOnly="disabled || option.disabled"
        v-model="value[option.key]"
      />
      <Upload
        v-if="option.type=='upload'"
        :fileUrl="value[option.fileUrl] || ''"
        :fileId="value[option.key]"
        class="content-element"
        v-model="value[option.key]"
        @change="change"
      />
      <Checkbox-group
        v-if="option.type=='checkboxGroup'"
        v-model="value[option.key]"
        @change="change"
        class="content-element"
        :attrKey="option.key"
        :disabled="disabled || option.disabled"
      >
        <Checkbox
          :key="item.value"
          :value="item.value"
          v-for="item in option.options"
          :label="item.value">
          {{item.label}}
        </Checkbox>
      </Checkbox-group>
      <RadioGroup
        v-if="option.type=='radioGroup'"
        v-model="value[option.key]"
        @change="change"
        :attrKey="option.key"
      >
        <Radio
          v-for="item in option.options"
          :key="item.value"
          :value="item.value"
          :label="item.label"
          :disabled="disabled || option.disabled"
        ></Radio>
      </RadioGroup>
    </div>
  </template>
</div>
</template>
<script>
import Select from '@/components/Select'
import Input from '@/components/Input'
import Upload from './upload'
import AddItem from '@/components/AddItem'
import { RadioGroup, Radio } from '@/components/RadioGroup'
import { Checkbox, CheckboxGroup } from '@/components/checkbox'
export default {
  name: 'Content',
  data () {
    return {
      checkList:[]
    }
  },
   props: {
     disabled: {
       type: Boolean,
       default: false
     },
    value: {
      type: Object,
      default: () => {
        return {}
      }
    },
    options: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  components: {
    Select,
    Input,
    Upload,
    RadioGroup,
    Radio,
    Checkbox,
    AddItem,
    CheckboxGroup
  },
  model: {
    prop: 'value',
    event: 'update:value'
  },
  watch: {
    value:{
      handler: function (newValue) {
        this.$emit('change', newValue)
      },
      deep: true // 深度监听
    }
  },
  methods: {
    /*subbranchChange(newValue) {
      this.value.subbranch = newValue;
    },*/
    change (obj, vmKey) {  // TODO watch 监听有时候会失效 先用change事件替换？
      this.$emit('elChange', vmKey, obj)
    }
  },
  created() {
  }
}
</script>
<style lang="scss">
.content-item {
  display: flex;
  min-height: 30px;
  margin-bottom: 10px;
  .content-lable {
    width: 146px;
    font-size: 14px;
    color: #333333;
    .hl-icon{
      color:#F6622C;
    }
  }
  .content-required{
    padding-left: 10px;
    font-size: 12px;
    color: #f6622c;
  }
  .content-element {
    width: 270px;
    textarea {
      width: 240px;
      min-height: 30px;
      line-height: 30px;
    }
  }
}
</style>
