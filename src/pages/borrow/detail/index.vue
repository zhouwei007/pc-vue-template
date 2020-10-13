<template>
  <div class="detail">
    <NavBar :options="navBarOptions" />
    <div class="content">
       <div class="head">
        <span class="lable">借款编号:{{curLoanItem.loanId}}</span>
        <span class="lable">借款状态:{{curLoanItem.approveStatusStr}}</span>
      </div>
      <!-- <Mark
        title="登记历史"
        :unfold="true"
        id="borrowLog"
      >
        <Table
          :ref="'borrowLog'"
          :columns="logColumns"
          :source="logData"
        ></Table>
      </Mark> -->
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
          :isReadOnly = "false"
          :isSelectRadio="item.formKey === 'loanApproveForm' && (curLoanItem.approveStatus === 2 || curLoanItem.approveStatus === 4)"
          :approveStatus="curLoanItem.approveStatus"
        ></GeneralTable>
        <MultiTable
          :ref="item.formKey"
          v-if="item.viewType == 'list'"
          v-model = item.basicForms
          :template = item.template
          :isReadOnly = "false"
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
      <!-- <Radio v-model="radioVal" /> -->
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
import Button from '@/components/Button'
import NavBar from '@/components/Navbar'
import Toast from '@/components/Toast'
import Mark from '@/components/Mark'
import actioMix from "@/common/seniorActionMix";
import GeneralTable from '../../formTypes/general'
import MultiTable from '../../formTypes/multiple'
import UnableTable from '../../formTypes/unable'
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
    // Table,
    Toast
  },
  data () {
    return {
      getDataFnObj: { // 获取getData 描述
        apiKey: 'getDemandsData', // 接口api
        param: { // 参数
          loanId: this.$route.query.loanId,
          proKey: this.$route.query.proKey,
          taskId: this.$route.query.taskId,
          nodeType: this.$route.query.nodeTypeCode
        }
      },
      navBarOptions: [
      ],
      curLoanItem: this.$route.query,
      isSubmitDisabled: false
    }
  },
  computed: {
    ...mapState(['loginInfo', 'paraFormatCheck', 'bizCodeMap'])
  },
  provide() {
    return {
      seniorAction: this.seniorAction
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    save () {
      if (!Validate.validate(this.$refs)) {
        this.$refs.toast.show('数据填写有误！')
      }
      let param = {
        proKey: this.curLoanItem.proKey,
        taskId: this.curLoanItem.taskId,
        nodeType: this.curLoanItem.nodeTypeCode,
        loanId: this.curLoanItem.loanId,
        data: this.formGroupList
      }
      DemandsApi.saveLoanData(param).then(() => {
        this.$router.push({ name: this.$route.query.router })
        return this.$refs.toast.show('保存成功')
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
      let param = {
        proKey: this.curLoanItem.proKey,
        taskId: this.curLoanItem.taskId,
        nodeType: this.curLoanItem.nodeTypeCode,
        loanId: this.curLoanItem.loanId,
        data: this.formGroupList
      }
      DemandsApi.submitLoanData(param).then(() => {
        let router = this.$route.query.router;
        this.$router.push({ name: router })
        return this.$refs.toast.show('提交成功')
      }, (err)=>{
        this.$refs.toast.show(err)
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
