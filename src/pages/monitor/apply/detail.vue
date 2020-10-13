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
            :isReadOnly="true"
          ></GeneralTable>
          <MultiTable
            :ref="item.formKey"
            v-if="item.viewType == 'list'"
            v-model = item.basicForms
            :template = item.template
            :isReadOnly="true"
          ></MultiTable>
          <UnableTable
            :ref="item.formKey"
            v-if="item.viewType == 'table'"
            :headerList="item.headerList"
            :keyList="item.keyList"
            :originsour="item.data"
            :isReadOnly ="true"
          ></UnableTable>
        </Mark>
    </div>
    <Toast ref="toast"></Toast>
  </div>
</template>
<script>
import { mapState } from 'vuex'
// import { request, buildRequestOptions } from '@/common/request'
// import BS from '@/common/bs'
import actioMix from "@/common/seniorActionMix";
import NavBar from '@/components/Navbar'
import Toast from '@/components/Toast'
import Mark from '@/components/Mark'
import GeneralTable from '../../formTypes/general'
import MultiTable from '../../formTypes/multiple'
import UnableTable from '../../formTypes/unable'
// import TaskApi from '@/common/api/task'
export default {
  template: '.detail',
  mixins: [actioMix],
  components: {
    NavBar,
    Mark,
    GeneralTable,
    MultiTable,
    UnableTable,
    Toast
  },
  data () {
    return {
      navBarOptions: [
      ],
      getDataFnObj: { // 获取getData 描述
        apiKey: 'getMonitorDetailData', // 接口api
        param: { // 参数
          requireCode: this.$route.query.requireCode,
          proKey: this.$route.query.proKey
        }
      },
      isDisabled: false,
      curLoanItem: this.$route.query
    }
  },
  computed: {
    ...mapState(['loginInfo', 'paraFormatCheck', 'bizCodeMap'])
  },
  mounted () {
    this.getData()
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
