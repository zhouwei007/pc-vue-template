<template>
  <div class="multiple">
    <template v-if="hardReset">
      <div class="tabs">
        <div
          v-for="(item, index) in subList"
          :class="{tab: true, selected: curIndex==index}"
          @click="tabChange"
          :data_index="index"
          :key="index"
        >{{(item.basicFields && item.basicFields[0].value) || template.formLabel+(index+1)}}</div>
        <div
          v-if="!isReadOnly"
          class="tab new"
          :data_index="subList.length"
          @click='addNewItem()'>{{`+新增`}}
        </div>
      </div>
      <div class="main">
        <div
          v-for="(item, index) in subList"
          v-show="curIndex==index"
          class="bill"
          :key="index"
        >
          <GeneralTable
            :ref="`list${index}`"
            v-model="item.basicFields"
            :isReadOnly="isReadOnly"
          ></GeneralTable>
        </div>
      </div>
    </template>
    <div v-if="subList.length == 0" class="no-date">
      暂无数据
    </div>
    <div v-show="subList.length > 0 && !isReadOnly" class="delete" @click="tabDel()">
      <i class="delete-icon hl-icon hl-icon-round-minu" />
      <span>删除</span>
    </div>
  </div>
</template>

<script>
import GeneralTable from './general'
import Utils from '@/common/utils'
export default {
  template: '.multiple',
  components: {
    GeneralTable
  },
  data () {
    return {
      curIndex: 0,
      hardReset: true
    }
  },
  props: {
    subList: {
      type: Array,
      default: () => {
        return []
      }
    },
    template: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isReadOnly: {
      type: Boolean,
      default: true
    }
  },
  model: {
    prop: 'subList',
    event: 'update:subList'
  },
  methods: {
    addNewItem () {
      let obj = Utils.deepCopy(this.template)
      this.subList.push(obj)
      this.curIndex = this.subList.length - 1
    },
    tabChange (event) {
      this.curIndex = event.target.getAttribute('data_index')
    },
    tabDel () {
      this.subList.splice(this.curIndex, 1)
      if (this.curIndex >= this.subList.length - 1) {
        this.curIndex = this.subList.length - 1
      }
      this.refashComp()
    },
    refashComp() {
      this.hardReset = false
      this.$nextTick(() => {
        this.hardReset= true
      });
    }
  }
}
</script>

<style lang="scss" scope>
.multiple {
  .tabs{
    margin-left: -30px;
    margin-right: -30px;
    height: 50px;
    border-bottom: 2px solid #ECECEC;
    display: flex;
    padding: 0 60px;
    .tab {
      font-size: 14px;
      color: #666666;
      text-align: center;
      height: 50px;
      line-height: 50px;
      margin-right: 60px;
      cursor: pointer;
      &:hover,&.selected {
        color: #333333;
        font-weight: bold;
        border-bottom: 2px solid #6975C9;
      }
      &.new {
        color: #6975C9;
        &:hover {
        color: #6975C9;
        font-weight: normal;
        border-bottom: 2px solid #ECECEC;
      }
      }
    }
  }
  .main {
    .bill {
      padding: 20px 30px;
    }
  }
  .no-date {
    height: 50px;
    line-height: 50px;
    text-align: center;
  }
  .delete {
    cursor: pointer;
    font-size: 14px;
    color: #F6622C;
    line-height: 20px;
    .delete-icon {
      font-size: 14px;
      color: #F6622C;
      float: left;
    }
    >span {
      display: block;
      float: left;
    }
  }
}
</style>
