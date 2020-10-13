<template>
  <div class="detail">
    <NavBar :options="navBarOptions" />
    <div class="content">
      <Mark
          v-for="(item, index) in formGroupList"
          :key="index"
          :title="item.formLabel"
          :unfold="true"
          :id="item.formKey"
        >
          <GeneralTable
            :ref="item.formKey"
            v-if="item.viewType == 'basic'"
            v-model = item.basicFields
            :isReadOnly="false"
          ></GeneralTable>
          <MultiTable
            :ref="item.formKey"
            v-if="item.viewType == 'list'"
            v-model = item.basicForms
            :template = item.template
            :isReadOnly="false"
          ></MultiTable>
          <UnableTable
            :ref="item.formKey"
            v-if="item.viewType == 'table'"
            :headerList="item.headerList"
            :keyList="item.keyList"
            :originsour="item.data"
            :isReadOnly = "false"
          ></UnableTable>
        </Mark>
      <div class="btn-box">
        <Button class="finish" size="big" @click="save">保存</Button>
        <Button class="finish" size="big" @click="submit">提交</Button>
      </div>
    </div>
    <Toast ref="toast"></Toast>
  </div>
</template>
<script>
import { mapState } from 'vuex'
// import { request, buildRequestOptions } from '@/common/request'
// import BS from '@/common/bs'
import actioMix from "@/common/seniorActionMix";
import Button from '@/components/Button'
import NavBar from '@/components/Navbar'
import Toast from '@/components/Toast'
import Mark from '@/components/Mark'
import GeneralTable from '../formTypes/general'
import MultiTable from '../formTypes/multiple'
import UnableTable from '../formTypes/unable'
import DemandsApi from '@/common/api/demands'
import Validate from '@/common/validate'
export default {
  template: '.detail',
  mixins: [actioMix],
  components: {
    NavBar,
    Mark,
    Button,
    GeneralTable,
    MultiTable,
    UnableTable,
    Toast
  },
  data () {
    return {
      navBarOptions: [
      ],
      isDisabled: false,
      curLoanItem: this.$route.query,
      getDataFnObj: { // 获取getData 描述
        apiKey: 'getDemandsData', // 接口api
        param: { // 参数
          taskId: this.$route.query.taskId,
          requireCode: this.$route.query.requireCode,
          proKey: this.$route.query.proKey,
          nodeType: this.$route.query.nodeTypeCode,
        }
      },
      isSubmitDisabled: false
    }
  },
  computed: {
    ...mapState(['loginInfo', 'paraFormatCheck', 'bizCodeMap'])
  },
  mounted () {
    this.getData()
  },
  methods: {
    save () {
      if (!Validate.validate(this.$refs)) {
        this.$refs.toast.show('数据填写有误！')
      }
      let {taskId, requireCode, proKey, nodeTypeCode } = this.curLoanItem
      if (this.isDisabled) return
      this.isDisabled = true
      DemandsApi.saveLoanData({ taskId, requireCode, proKey, nodeType: nodeTypeCode, data: this.formGroupList }).then(() => {
        this.$router.push({ path: '/demands/pendding/list' })
        this.isDisabled = false
        return this.$refs.toast.show('保存成功')
      }).catch(() =>{
        this.isDisabled = false
      })
    },
    submit () {
      if (this.isSubmitDisabled) {
        return
      }
      this.isSubmitDisabled = true
      if (!Validate.validate(this.$refs)) {
        this.$refs.toast.show('数据填写有误！')
        setTimeout(() => {
          Validate.custormAnchor('error')
        }, 100)
        this.isSubmitDisabled = false
        return
      }
      let { taskId, requireCode, proKey, nodeTypeCode } = this.curLoanItem
      DemandsApi.submitLoanData({ taskId, requireCode, proKey, nodeType: nodeTypeCode, data: this.formGroupList }).then(() => {
        this.$router.push({ path: '/demands/pendding/list' })
        return this.$refs.toast.show('提交成功')
      }).catch(() =>{
        this.isSubmitDisabled = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .detail {
    background: #EFF0F8;
    min-height: 100vh;
    .content{
      width: 100%;
      min-height: 100vh;
      margin-top: 40px;
    }
    .head {
      height: 64px;
      width: 100%;
      background: #FFFFFF;
      border-radius: 4px;
      font-size: 16px;
      color: #333333;
      text-align: center;
      .lable {
        line-height: 64px;
        font-size: 16px;
        color: #333333;
        font-weight: bold;
        padding-right: 40px;
      }
    }
    .btn-box {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 52px;
    }
    .finish {
      margin: 0 20px;
    }
  }
  .fixed {
      position: fixed;
      width: 100%;
      z-index: 11;
  }
</style>
