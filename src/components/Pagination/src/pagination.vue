<template>
  <div class="sass-pagination">
    <span v-if="!small" class="total">共{{totalCount}}条记录</span>
    <ul class="paging">
      <li class="prev"
        :class="{'disabled':currentPage<=1}"
        @click="currentPage<=1?'':turn(currentPage-1)">
        <i class="hl-icon hl-icon-arrow-left"></i>
      </li>
      <template v-for="(i, index) in showPageBtn">
        <li
          class="num"
          :class="{'active':i==currentPage}"
          :key="index"
          v-if="i > 0"
          @click="turn(i)"
        >
          {{i}}
        </li>
        <li
          v-else-if="i==='-'"
          :key="index"
          class="num more"
          :class="{'icon-d-arrow-left':toPrev}"
          @click="turn(currentPage-1)"
          @mouseenter="toPrev=true"
          @mouseleave="toPrev=false"
        >...</li>
        <li
          v-else-if="i==='+'"
          :key="index"
          class="num more"
          :class="{'icon-d-arrow-right':toNext}"
          @click="turn(currentPage+1)"
          @mouseenter="toNext=true"
          @mouseleave="toNext=false"
        >...</li>
      </template>
      <li
        class="next"
        :class="{'disabled':currentPage>=totalPage}"
        @click="currentPage>=totalPage?'':turn(currentPage+1)"
      >
        <i class="hl-icon hl-icon-arrow-right"></i>
      </li>
    </ul>
    <div class="select-box">
      <div class="label">每页显示</div>
      <select class="select" v-if="!small" v-model="limitNum" @change="turn(currentPage)">
        <option v-for="(item, index) in limitNums" :value="item" :key="index">{{item}}条/页</option>
      </select>
    </div>
    <span  v-if="all" class="jump">前往<input type="number" autocomplete="off" min="1" :max="totalPage" v-model="goPage" @keyup.enter="turn(goPage)">页</span>
  </div>
</template>
<script>
/**
 * :currentPage.sync="currentPage"
    :limit.sync="limit"
    :totalCount="totalCount"
    @turn="getTableData"
 */
export default {
  name: 'Pagination',
  props: {
    currentPage: { // 当前页
      type: Number,
      default: 1
    },
    limit: { // 每页显示条数
      type: Number,
      default: 10
    },
    totalCount: { // 总条数
      type: Number,
      required: true
    },
    small: {
      type: Boolean,
      default: false
    },
    all: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      goPage: '',
      limitNum: '',
      limitNums: [5, 10, 15, 20, 25, 30],
      toPrev: false,
      toNext: false
    }
  },
  created: function () {
    this.initLimitNums()
  },
  computed: {
    totalPage () {
      return Math.ceil(this.totalCount / this.limit)
    },
    showPageBtn () {
      let pageNum = Number(this.totalPage)
      let index = Number(this.currentPage)
      let arr = []
      if (pageNum <= 9) {
        for (let i = 1; i <= pageNum; i++) {
          arr.push(i)
        }
        return arr
      }
      if (index < 5) return [1, 2, 3, 4, 5, 6, 7, '+', pageNum]
      if (index >= pageNum - 1) return [1, 2, '-', pageNum - 5, pageNum - 4, pageNum - 3, pageNum - 2, pageNum - 1, pageNum]
      if (index === pageNum - 2) return [1, 2, '-', pageNum - 5, pageNum - 4, pageNum - 3, pageNum - 2, pageNum - 1, pageNum]
      return [1, '-', index - 2, index - 1, index, index + 1, index + 2, '+', pageNum]
    }
  },
  methods: {
    initLimitNums () {
      this.limitNum = this.limit
      if (!this.limitNums.includes(this.limit)) {
        this.limitNums.push(this.limit)
        this.limitNums.sort((a, b) => {
          return a - b
        })
      }
    },
    // 翻页，显示条数变化
    turn (page) {
      let i = parseInt(Number(page))
      if (i < 1) {
        i = 1
      } else if (i > this.totalPage) {
        i = this.totalPage
      }
      if (this.limitNum !== this.limit && this.limitNum !== '') { // 每页显示条数改变
        let pages = Math.ceil(this.totalCount / this.limitNum)
        if (page > pages) {
          i = pages
        }
        this.$emit('update:limit', this.limitNum)
      }
      this.$emit('update:currentPage', i)
      this.$emit('change')
    }
  }
}
</script>
<style lang="scss" scoped>
  .sass-pagination {
    width: 100%;
    font-size: 12px;
    color: #333333;
    line-height: 24px;
    display: flex;
    justify-content:center;
    margin: 19px auto;
    .total{
      line-height: 24px;
      padding-right:16px;
    }
    .paging{
      display: flex;
      li{
        width: 24px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        border:$border;
        border-radius: $component-border-radius;
        margin:0 4px;
        &.num{
          cursor: pointer;
        }
        &.more{
          border: none;
          line-height: 20px;
          width: 12px;
        }
        &.active{
          background: #6975C9;
          border:1px solid #6975C9;
          color:#fff;
        }
        &.prev,&.next{
          .hl-icon{
            font-size: 12px;
            line-height: 20px;
          }
        }
        &.disabled{
          opacity: 0.4;
          cursor: default;
        }
      }
    }
    .jump{
      margin-left:16px;
      input{
        width: 40px;
        height: 24px;
        line-height: 24px;
        border:$border;
        margin:0 5px 0 10px;
        text-align: center;
      }
      input[type=number] {
        -moz-appearance:textfield;
      }
      input[type=number]::-webkit-inner-spin-button,
      input[type=number]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
    }
    .select-box{
      margin-left:16px;
      line-height: 24px;
      display: flex;
      .label{
        width: 50px;
      }
      .select{
        cursor: pointer;
        height: 24px;
        line-height: 24px;
        width: 60px;
        text-align: center;
        padding:0 5px;
        border: 1px #eee solid;
        background: transparent;
        background-image: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        &:focus{
          outline: none;
        }
      }
    }
  }
</style>
