<template>
  <div class="allocation">
    <Table :columns="columns" :source="source"></Table>
    <div class="allocation-bottom" @click="showModal" v-if="applyStatus != 4">
      <span class="allocation-add">+</span>
      <span class="allocation-text">分配资金方</span>
    </div>
    <Modal
      class="allocation-modal"
      :hasok="true"
      :hascancel="true"
      :value="isShowModal"
      @ok="modalOk"
      @update:value="modalCancel"
    >
      <Content
        :options="fundingOptions"
        v-model="modalData"
        @elChange="selectChange"
      ></Content>
    </Modal>
    <Toast ref="toast"></Toast>
  </div>
</template>

<script>
import Table from '@/components/Table'
import { Modal, Content } from '@/components/Modal'
import DemandsApi from '@/common/api/demands'
import Toast from '@/components/Toast'
import Utils from 'common/utils'
import BS from '@/common/bs'
export default {
  name: 'Allocation',
  components: {
    Table,
    Modal,
    Content,
    Toast
  },
  data () {
    return {
      columns: [
        {
          title: '序号',
          key: 'serial',
          render: (h, obj, index) => {
            return h('div', {}, index + 1)
          }
        },
        {
          title: '资金方',
          key: 'name',
          render: (h, obj) => {
            return h('div', {}, obj.fundName)
          }
        },
        {
          title: '产品',
          key: 'productName',
          render: (h, obj) => {
            return h('div', {}, obj.fundProductName)
          }
        },
        {
          title: '支行',
          key: 'fundSubbranchName',
          render: (h, obj) => {
            return h('div', {}, obj.fundSubbranchName)
          }
        },
        {
          title: '借款主体',
          render: (h, obj) => {
            return h('div', {}, obj.borrowName)
          }
        },
        {
          title: '申请金额(元)',
          render: (h, obj) => {
            return h('div', {}, Utils.formatMoney(obj.expectedAmount))
          }
        },
        // {
        //   title: '申请期限',
        //   render: (h, obj) => {
        //     return h('div', {}, obj.showPeriods)
        //   }
        // },
        {
          title: '还款方式',
          render: (h, obj) => {
            return h('div', {}, obj.repayMethodName)
          }
        },
        {
          title: '状态',
          render: (h, obj) => {
            return h('div', {}, obj.approveStatusName)
          }
        },
        {
          title: '操作',
          render: (h, obj) => {
            return h('div', {}, [
              h('a', {
                class: obj.approveStatus > 1 ? 'opera disable' : 'opera',
                on: {
                  click: () => {
                    this.opera(obj)
                  }
                }
              }, '办理'),
              h('a', {
                class: obj.approveStatus > 1 ? 'opera disable' : 'opera',
                on: {
                  click: () => {
                    this.delete(obj)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      source: [],
      index: 4,
      applyCityId: '',
      fundingOptions: [
        {
          key: 'fundId',
          label: '资金方',
          type: 'select',
          required: true,
          options: []
        },
        {
          key: 'fundProduct',
          label: '产品',
          type: 'select',
          required: true,
          options: []
        },
        {
          key: 'id',
          label: '支行',
          type: 'select',
          required: true,
          options: [

          ]
        },
        {
          key: 'borrowName',
          label: '借款主体',
          type: 'input'
        },
        {
          key: 'expectedAmount',
          label: '借款金额（元）',
          type: 'input'
        },
        // {
        //   key: 'period',
        //   label: '借款期限',
        //   type: 'select',
        //   options: [
        //   ]
        // },
        {
          key: 'repayMethod',
          label: '还款方式',
          type: 'select',
          required: true,
          options: [
          ]
        }
      ],
      isShowModal: false,
      banks: [],
      fundConfig: {},
      modalData: {
        fundId: '',
        fundProduct: '',
        id: '',
        borrowName: '',
        expectedAmount: '',
        // period: '',
        repayMethod: ''
      },
      applyStatus: 0
    }
  },
  props: {
    curLoanItem: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {
    'modalData.fundId': function (newValue) {
      this.getProducts(newValue)
      this.$set(this.modalData, 'fundProduct', '')
    }
  },
  methods: {
    selectChange(key, obj) {
      if (key === "fundId") {
        this.modalData.subbranchId = ''
       let arr = this.banks.find( bank => {
         return  bank.sourceId === obj.value
        })
        if (this.applyCityId === '120000') {
          if(arr.subbranch.length === 0) {
            this.$set(this.fundingOptions[2], 'options', []);
          }
          else {
            this.$set(this.fundingOptions[2], 'options', arr.subbranch.map(item => {
              return {
                value:item.id,
                label:item.name
              }
            }))
          }
        }
      }
    },
    // 获取资金方数据
    getTableData () {
      let param = {
        requireCode: this.curLoanItem.requireCode
      }
      DemandsApi.getLoadApplyData(param).then((data) => {
        this.source = data.fundLoanList
        this.applyCityId = data.applyInfo.applyCityId
        if (this.applyCityId != '120000') {
          this.fundingOptions.splice(2,1)
        }
        // this.$set(this.fundingOptions[0], 'options', tempOptions)
        this.$set(this.modalData, 'borrowName', data.fundApply.borrowName)
        this.$set(this.modalData, 'expectedAmount', data.fundApply.expectedAmount / 100)
        this.applyStatus =  data.fundApply.applyStatus
        this.$emit('getApplyStatus', data.fundApply.applyStatus)
      }, (err) => {
         this.$refs.toast.show(err)
      })
    },
    // 校验是否可以再次分配资金方
    canCreate () {
      let param = {
        requireCode: this.curLoanItem.requireCode,
        fundType: this.curLoanItem.fundType
      }
      return DemandsApi.canCreate(param)
    },
    // 获取分配资金方产品信息
    getLoadFundData () {
      let param = {
        requireCode: this.curLoanItem.requireCode,
        fundType: this.curLoanItem.fundType
      }
      this.canCreate().then(() => {
        DemandsApi.getLoadFundData(param).then((data) => {
          const { sources } = data;
          this.banks = sources;
          this.fundConfig = data
          let tempOptions = []
          for (let i = 0; i < sources.length; i++) {
            let obj = {}
            obj.value = sources[i].sourceId
            obj.label = sources[i].sourceName
            tempOptions.push(obj)
          }
          this.$set(this.fundingOptions[0], 'options', tempOptions)
          this.isShowModal = true
        })
      }, (err) => {
         this.$refs.toast.show(err)
      })
    },
    getProducts (fundId) {
      let products = this.fundConfig[fundId].products
      let productArr = []
      for (let i = 0; i < products.length; i++) {
        let obj = {}
        obj.value = products[i].productId
        obj.label = products[i].productName
        productArr.push(obj)
      }
      this.$set(this.fundingOptions[1], 'options', productArr)
    },
    createLoan() {
      let fundName = this.findFundName()
      let fundProductName = this.findFundProductName()
      let repayMethodName = this.findRepayMethodName()
      let param = {
        requireCode: this.curLoanItem.requireCode,
        fundName: fundName,
        fundProductName: fundProductName,
        repayMethodName: repayMethodName,
        ...this.modalData
      }
      // 校验
      if (!param.fundName) {
        this.$refs.toast.show('请选择资金方')
        return
      }
      if (!param.fundProductName) {
        this.$refs.toast.show('请选择产品')
        return
      }
      if (!param.borrowName) {
        this.$refs.toast.show('请填写借款主体')
        return
      }
      if (!param.expectedAmount) {
        this.$refs.toast.show('请填写借款金额')
        return
      }
      if (!param.repayMethodName) {
        this.$refs.toast.show('请选择借款方式')
        return
      }
      param.expectedAmount *= 100
      DemandsApi.createLoan(param).then((data) => {
        this.$router.push({ path: '/demands/funding/detailOrEdit', query: {loanId: data, ...this.curLoanItem}})
        this.hideModal()
      }, (err) => {
         this.$refs.toast.show(err)
      })
    },
    findFundName () {
      let fundId = this.modalData.fundId
      let fundObj = this.fundConfig.sources.find((item) => {
        return item.sourceId === fundId
      })
      let sourceName = ''
      if (fundObj) {
        sourceName = fundObj.sourceName
      }
      return sourceName
    },
    findFundProductName () {
      let fundId = this.modalData.fundId
      let fundProduct = this.modalData.fundProduct
      if (!fundId) {
        return ''
      }
      let fundProductObj = this.fundConfig[fundId].products.find((item) => {
        return item.productId === fundProduct
      })
      let fundProductName = ''
      if (fundProductObj) {
        fundProductName = fundProductObj.productName
      }
      return fundProductName
    },
    findRepayMethodName () {
      let result = this.fundingOptions[this.index].options.find((item) => {
        return item.value == this.modalData.repayMethod
      })
      return result ? result.label : ''
    },
    modalOk () {
      this.createLoan()
    },
    modalCancel () {
      this.hideModal()
    },
    showModal () {
      this.getLoadFundData()
    },
    hideModal () {
      this.isShowModal = false
    },
    opera (obj) {
      if (obj.approveStatus < 2) {
        let isReadOnly = false
        let loanId = obj.loanId
        this.$router.push({ path: '/demands/funding/detailOrEdit', query: {loanId: loanId, isReadOnly: isReadOnly, ...this.curLoanItem}})
      }
    },
    delete (obj) {
      let param = {
        loanId: obj.loanId
      }
      DemandsApi.deleteLoan(param).then(() => {
        this.getTableData()
      }, (err) => {
        this.$refs.toast.show(err)
      })
    },
    // 获取还款方式
    async getLoanType () {
      const code = await BS.getCode()
      let options = code.saas_fund_repay_mode
      let repayArr = []
      for (let key in options) {
        let obj = {}
        obj.value = key
        obj.label = options[key]
        repayArr.push(obj)
      }
      this.index = this.applyCityId === '120000'?5:4
      this.$set(this.fundingOptions[this.index], 'options', repayArr)
    }
  },
  mounted () {
    this.getTableData()
    this.getLoanType()
  }
}
</script>

<style lang="scss">
.allocation {
  .allocation-bottom {
    font-size: 12px;
    color: #6975C9;
    line-height: 50px;
    border: 1px solid #ECECEC;
    border-top: none;
    text-align: center;
    cursor: pointer;
    .allocation-add {
      font-size: 16px;
      font-weight: bold;
    }
    .allocation-text {
      padding: 0 6px;
    }
  }
  .allocation-modal {
    .sass-main {
      width: 466px;
    }
  }
  .opera {
    font-size: 12px;
    color: #6975C9;
    padding: 0 5px;
    cursor: pointer;
    &.disable {
      cursor: default;
      color: #999999;
    }
  }
}
</style>
