<template>
  <div class="detail">
    <div class="main">
      <div class="content">
        <NavBar :options="navBarOptions" />
        <div class="head">
          <!-- <span v-if="curLoanItem.bizCodeName || curLoanItem.bizCode" class="lable">业务名称：{{curLoanItem.bizCodeName || bizCodeMap[curLoanItem.bizCode]}}</span>
          <span v-if="curLoanItem.loanId" class="lable">进件编号：{{curLoanItem.loanId}}</span>
          <span v-if="curLoanItem.nodeTypeName" class="lable">当前节点：{{curLoanItem.nodeTypeName}}</span> -->
        </div>
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
        <div class="btn-box">
          <Button class="finish" size="big" @click="finish('update')">保存</Button>
          <Button class="finish" size="big" @click="finish('submit')">提交</Button>
        </div>
      </div>
    </div>
    <Toast ref="toast"></Toast>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import Button from '@/components/Button'
import NavBar from '@/components/Navbar'
import Mark from '@/components/Mark'
import actioMix from "@/common/seniorActionMix";
import UnableTable from '../../formTypes/unable'
import GeneralTable from '../../formTypes/general'
import MultiTable from '../../formTypes/multiple'
import Toast from '@/components/Toast'
import DemandsApi from '@/common/api/demands'
import Validate from '@/common/validate'
export default {
  template: '.detail',
  mixins: [actioMix],
  components: {
    NavBar,
    Mark,
    UnableTable,
    GeneralTable,
    MultiTable,
    Button,
    Toast
  },
  data () {
    return {
      navBarOptions: [],
      curLoanItem: this.$route.query,
      getDataFnObj: { // 获取getData 描述
        apiKey: 'getLoanData', // 接口api
        param: { // 参数
          loanId: this.$route.query.loanId,
          fundType: this.$route.query.fundType
        }
      },
      isSubmitDisabled: false
    }
  },
  computed: {
    ...mapState(['loginInfo', 'paraFormatCheck'])
  },
  methods: {
    finish: function (type = 'update') {
      if (this.isSubmitDisabled) {
        return
      }
      this.isSubmitDisabled = true
      // 校验
      if (type !== 'update') {
        if (!Validate.validate(this.$refs)) {
          this.$refs.toast.show('数据填写有误！')
          setTimeout(() => {
            Validate.custormAnchor('error')
          }, 100)
          this.isSubmitDisabled = false
          return
        }
      }
      this.deal(type)
    },
    // 办理
    deal: function (type) {
      let param = {
        loanId: this.curLoanItem.loanId,
        data: this.formGroupList
      }
      if (type === 'update') {
        DemandsApi.saveData(param).then(()=>{
          this.$refs.toast.show('保存成功')
          this.isSubmitDisabled = false
          window.location.reload()
        })
      } else {
        DemandsApi.submitTask(param).then(()=>{
          this.$refs.toast.show('提交成功')
          this.$router.push({ path: '/demands/detailOrEdit', query: {requireCode: this.$route.query.requireCode, isReadOnly: this.$route.query.isReadOnly}})
        }, (err)=>{
          this.$refs.toast.show(err)
          this.isSubmitDisabled = false
        })
      }
    }
  },
  async created () {
    await this.getData()
  }
}
</script>
<style lang="scss" scoped>
  .detail {
    overflow: scroll;
    background: #EFF0F8;
    min-height: 100vh;
    .content {
      width: 100%;
      min-height: 100vh;
      margin-top: 50px;
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
    }
    .finish {
      margin: 0 20px;
    }
    .main {
      display: flex;
      // overflow: hidden;
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
</style>
