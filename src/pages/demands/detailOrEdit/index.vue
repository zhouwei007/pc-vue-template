<template>
  <div class="detail">
    <div class="main">
      <div class="content">
        <NavBar :options="navBarOptions" />
        <div class="head">
          <!-- <span v-if="curLoanItem.bizCodeName || curLoanItem.bizCode" class="lable">业务名称：{{curLoanItem.bizCodeName || bizCodeMap[curLoanItem.bizCode]}}</span>
          <span v-if="curLoanItem.loanId" class="lable">进件编号：{{curLoanItem.loanId}}</span>
          <span v-if="curLoanItem.nodeTypeName" class="lable">当前节点：{{curLoanItem.nodeTypeName}}</span> -->
          <Button v-if="applyStatus != 4" class="abandon" size="normal" @click="showModel()">废弃需求</Button>
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
            :isReadOnly = curLoanItem.isReadOnly
          ></GeneralTable>
          <MultiTable
            :ref="item.formKey"
            v-if="item.viewType == 'list'"
            v-model = item.basicForms
            :template = item.template
            :isReadOnly = curLoanItem.isReadOnly
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
        <Mark
          title="分配资金方"
          :unfold="true"
          id="allocation"
        >
          <Allocation
            :curLoanItem="curLoanItem"
            @getApplyStatus="getApplyStatus"
          ></Allocation>
        </Mark>
        <div v-if="!curLoanItem.isReadOnly"  class="btn-box">
          <Button class="finish" size="big" @click="finish('update')">保存</Button>
          <Button class="finish" size="big" @click="finish('submit')">提交</Button>
        </div>
      </div>
    </div>
    <Modal
      title="废弃需求"
      :value="isShowModel"
      @ok="abandon"
      @update:value="modelCancel"
    >
    <div class="model-box">
      <span><span style="color: red">*</span>需求说明：</span>
      <Input
        class="abandon-mod"
        type="textarea"
        v-model="remark"
        :errorMessage="modelErrorMessage"
      />
    </div>
    </Modal>
    <Toast ref="toast"></Toast>
  </div>
</template>
<script>
import { mapState } from 'vuex'
// import BS from '@/common/bs'
import Button from '@/components/Button'
import Input from '@/components/Input'
import actioMix from "@/common/seniorActionMix";
import NavBar from '@/components/Navbar'
import Mark from '@/components/Mark'
import UnableTable from '../../formTypes/unable'
import GeneralTable from '../../formTypes/general'
import MultiTable from '../../formTypes/multiple'
import Toast from '@/components/Toast'
import Allocation from '../funding/allocation'
import DemandsApi from '@/common/api/demands'
import { Modal } from '@/components/Modal'
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
    Input,
    Toast,
    Allocation,
    Modal
  },
  data () {
    return {
      navBarOptions: [],
      isShowModel: false,
      remark: '',
      modelErrorMessage: '',
      applyStatus: 0,
      curLoanItem: this.$route.query,
      getDataFnObj: { // 获取getData 描述
        apiKey: 'getDemandsDetail', // 接口api
        param: { // 参数
          applyId: this.$route.query.requireCode,
          fundType: this.$route.query.fundType
        }
      }
    }
  },
  computed: {
    ...mapState(['loginInfo', 'paraFormatCheck'])
  },
  provide() {
    return {
      seniorAction: this.seniorAction
    }
  },
  methods: {
    initQuery: function () {
      if (this.curLoanItem.isReadOnly === 'true' || this.curLoanItem.isReadOnly === true) {
        this.curLoanItem.isReadOnly = true
      } else {
        this.curLoanItem.isReadOnly = false
      }
    },
    getApplyStatus: function (applyStatus) {
      this.applyStatus = applyStatus
    },
    // 废弃需求
    abandon: function () {
      if (!this.remark) {
        this.modelErrorMessage = "请填写备注说明"
        return
      }
      let param = {
        requireCode: this.curLoanItem.requireCode,
        remark: this.remark
      }
      DemandsApi.abandonApply(param).then(() => {
        this.$router.push('/demands/list')
      }, (err) => {
         this.$refs.toast.show(err)
      })
    },
    modelCancel: function () {
      this.isShowModel = false
    },
    showModel: function () {
      this.isShowModel = true
    }
  },
  created () {
    this.initQuery()
    this.getData()
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
    }
    .finish {
      margin: 0 20px;
    }
    .main {
      display: flex;
      overflow: hidden;
    }
    .model-box {
      display: flex;
      >span {
        font-size: 14px;
      }
      .abandon-mod {
        width: 400px;
      }
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
