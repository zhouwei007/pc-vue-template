<template>
  <div class='add-item'>
    <draggable
        :list="value" :options="{animation: 100,handle:'.dargDiv'}"
     >
      <div class="item" v-for="(item, index) in value" :key="index">
        <div class="item-content">
          <div class="item-name " v-if="!item.isEdit" :class="[
          { 'disabled': !item.itemStatusBool },
          { 'normal': item.itemStatusBool }
        ]">
            {{item.name}}
          </div>
          <div class="value" v-show="item.isEdit"
          >
            <input type="text" v-model="item.name" :ref="'input_'+index"/>
          </div>
        </div>
        <div class="item-icon">
          <div class="left-icon" @click="edit(item, index)" v-if="!item.isEdit">
            <i class="hl-icon hl-icon-558" v-if="item.itemStatusBool">
            </i>
          </div>
          <div class="right-icon">
            <i class="hl-icon hl-icon-546" v-if="item.isEdit" @click="edit(item, index)">
            </i>
            <i class="hl-icon hl-icon-544" v-if="item.isEdit" @click="back(item, index)">
            </i>
            <el-switch
                    v-model="item.itemStatusBool"
                    :key="index"
            >
            </el-switch>
            <i class="hl-icon hl-icon-559 dargDiv">
            </i>
          </div>
        </div>
      </div>
    </draggable>
    <div class="item add">
      <div class="item-content">
      </div>
      <div class="item-icon">
        <div class="right-icon" @click="add">
          <i class="hl-icon hl-icon-549">

          </i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import  ElSwitch  from '@/components/switch'
  import draggable from "vuedraggable";
  export default {
    name: "AddItem",
    model: {
      prop: 'value',
      event: 'update:value'
    },
    props: {
      value: {
        type: Array,
        default: () => []
      },
    },
    data(){
      return {
        banks: []
      }
    },
    computed: {
    },
    components: {
      ElSwitch,
      draggable
    },
    mounted() {
    },
    methods: {
      add() {
        this.value.push({
          name: '',
          isEdit: true,
          itemStatusBool: true
        })
        this.$nextTick(function () {
          this.$refs['input_' + (this.value.length -1)][0].focus();
        })
      },
      back(item, index) {
        this.$set(item, 'isEdit', !item.isEdit)
        this.$set(item, 'name', item.original)
        this.$nextTick(function () {
          this.$refs['input_' + index][0].blur();
        })
      },
      edit(item, index) {
        // item.isEdit = !item.isEdit;
        this.$set(item, 'isEdit', !item.isEdit)
        this.$set(item, 'original', item.name)
        if (item.isEdit) {
          this.$nextTick(function () {
            this.$refs['input_' + index][0].focus();
          })
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .add-item{
    width: 52%;
    border: 1px solid #E2E6ED;
    .item{
      display: flex;
      padding: 2px 5px;
      border-bottom: 1px solid  #E2E6ED;
      .dargDiv{
        cursor: -webkit-grabbing;
      }
      &:last-child{
      }
      .item-content{
        .item-name{
          font-size: 14px;
        }
        .disabled{
          color: #999999; ;
        }
        .normal{
          color: #333333;
        }
        .value{
          input{
            color: #999999;
          }
        }
      }
      .item-icon{
        margin-left: auto;
        display: flex;
        color: #6975C9;
        .left-icon{
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 5px;
        }
        .right-icon{
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
</style>
<style  lang="scss">
  .right-icon{
    display: flex;
    justify-content: center;
    align-items: center;
    & .el-checkbox .el-checkbox__input.is-checked .el-checkbox__inner{
      background-color: #6975C9;
      border-color: #6975C9;
    }
    & .el-checkbox__input.is-checked .el-checkbox__inner{
      border-color: #6975C9;
    }
  }
</style>
