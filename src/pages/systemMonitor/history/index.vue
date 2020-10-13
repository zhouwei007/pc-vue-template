<template>
  <div class="loan-apply-list">
    <section>
      <div class="title-line">
        <div>业务id：{{loanId}}</div>
        <div>产品类型：{{bizName}}</div>
        <div>工作流名称：{{processName}}</div>
        <div>状态：{{instStatusName}}</div>
      </div>
      <s-table :columns="columns" :source="source" :isLoading="loading">
        <template v-slot:order="{ row }">
          <div>
            {{source.length - row.index}}
          </div>
        </template>
        <template v-slot:opera="{ row }">
          <div class="opera">
            <a href="javascript:;" @click="tryAgain(row)" v-if="row.item.actStatus === 3">重试</a>
          </div>
        </template>
      </s-table>
    </section>
    <s-modal title="工作流重试" v-model="isShow" @ok="ok" :hascancel="false">
      <div>当前错误节点: {{row.actName}}</div>
      <s-form>
        <form-item label="决策">
          <s-select
            :options="decisionTypeMap"
            v-model="decision"
            placeholder="请选择"
          />
        </form-item>
      </s-form>
    </s-modal>
    <Toast ref="toast"></Toast>
  </div>
</template>

<script>
import systemMonitorApi from '@/common/api/systemMonitor'
import { mapState, mapActions } from 'vuex'
import Table from '@/components/Table'
import Toast from '@/components/Toast'
import Modal from '@/components/Modal'
import Select from '@/components/Select'
import Utils from '@/common/utils'
import { Form, FormItem } from '@/components/Form/index'
export default {
  template: '.workflow-history-list',
  data () {
    return {
      columns: [
        {
          title: '序号',
          width: 80,
          slotName: 'order'
        },
        {
          title: '节点名称',
          width: 124,
          render: (h, obj) => {
            return h('div', {}, obj.actName)
          }
        },
        {
          title: '节点类型',
          width: 124,
          render: (h, obj) => {
            return h('div', {}, obj.nodeTypeName)
          }
        },
        {
          title: '系统节点属性',
          width: 124,
          render: (h, obj) => {
            return h('div', {}, obj.nodeImplCodeName)
          }
        },
        {
          title: '业务状态',
          width: 124,
          render: (h, obj) => {
            return h('div', {}, obj.bizStatusName)
          }
        },
        {
          title: '节点决策',
          width: 200,
          render: (h, obj) => {
            return h('div', {}, obj.decision)
          }
        },
        {
          title: '开始时间',
          width: 124,
          render: (h, obj) => {
            return h('div', {}, Utils.fmtTime(obj.startTime, 'yyyy-MM-dd hh:mm:ss'))
          }
        },
        {
          title: '完成时间',
          width: 124,
          render: (h, obj) => {
            return h('div', {}, Utils.fmtTime(obj.endTime, 'yyyy-MM-dd hh:mm:ss'))
          }
        },
        {
          title: '节点状态',
          width: 124,
          render: (h, obj) => {
            let status = ''
            switch (obj.actStatus) {
              case 1:
                status = '执行中'
                break
              case 2:
                status = '已结束'
                break
              case 3:
                status = '错误'
                break
            }
            return h('div', {}, status)
          }
        },
        {
          title: '操作',
          width: 124,
          slotName: 'opera'
        }
      ],
      source: [],
      loading: true,
      bizName: '',
      instStatusName: '',
      loanId: '',
      processName: '',
      isShow: false,
      row: {},
      decision: '',
      processInstanceId: ''
    }
  },
  components: {
    STable: Table,
    SModal: Modal,
    SSelect: Select,
    SForm: Form,
    FormItem,
    Toast
  },
  computed: {
    ...mapState(['decisionTypeMap'])
  },
  mounted () {
    this.getDecisionType({ processInstanceId: this.$route.query.processInstanceId })
    this.processInstanceId = this.$route.query.processInstanceId
    this.getTableData()
  },
  methods: {
    ...mapActions([
      'getDecisionType'
    ]),
    getTableData () {
      this.loading = true
      systemMonitorApi.instanceHistory({processInstanceId: this.processInstanceId }).then( data => {
        this.bizName = data.bizName
        this.instStatusName = data.instStatusName
        this.loanId = data.loanId
        this.processName = data.processName
        this.source = data.historyList
        this.loading = false
      }).catch(err => {
        this.$refs.toast.show(err)
      })
    },
    tryAgain (row) {
      this.row = row.item
      this.isShow = true
    },
    ok () {
      let params = {
        processInstanceId: this.processInstanceId,
        decision: this.decision,
        actId: this.row.actId,
        paraId: this.$route.query.paraId
      }
      systemMonitorApi.retryProcess(params).then(() => {
        this.$refs.toast.show('重试成功')
        this.getTableData()
        this.isShow = false
      }).catch(err => {
        this.$refs.toast.show('重试失败'+err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .loan-apply-list {
    width: 100%;
    min-height: 730px;
    background: #ffffff;
    padding: 15px 30px;
    .filter-box {
      display: flex;
      .select {
        margin: 0 10px 10px 0;
      }
    }
  }
  .title-line{
    display: flex;
    margin-bottom: 10px;
    justify-content: space-between;
  }
</style>
