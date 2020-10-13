<template>
    <div :class="{navbar: true,  fixed: fixed}" ref="navbar" :style="{height: curLines ? 60 * curLines + 'px' : 'auto'}">
        <div
          v-for="(option, index) in options"
          :key="index"
          class="option"
        ><a href="javascript:;" @click.prevent="custormAnchor(option.code)" :class="{curItem: curItemIndex === index}">{{option.name}}</a></div>
        <div v-if="totalLines > 1" class="unfold" @click="toggleFold">{{curLines == 1 ? '展开' : '收起'}}</div>
    </div>
</template>
<script>
export default {
  name: 'Navbar',
  components: {
  },
  props: {
    options: {
      type: Array,
      default () {
        return []
      }
    },
    fixed: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      totalLines: 1,
      curLines: 0,
      curItemIndex: 0
    }
  },
  watch: {
    options () {
      this.$nextTick(() => {
        this.getLines()
      })
    }
  },
  methods: {
    toggleFold: function () {
      if (this.totalLines > 1) {
        if (this.curLines === 1) {
          this.curLines = this.totalLines
        } else {
          this.curLines = 1
        }
      }
    },
    getLines: function () {
      this.totalLines = this.$refs['navbar'].offsetHeight / 60
      this.curLines = 1
    },
    custormAnchor (id) {
      let anchorElement = document.getElementById(id)
      let top = anchorElement.offsetTop - 150
      if (anchorElement) {
        // anchorElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
        window.scrollTo({
          top: top,
          behavior: 'smooth'
        })
      }
    },
    throttle (func, wait) {
      let lastTime = null
      let timeOut
      return function () {
        let context = this
        let now = new Date()
        // 如果上次执行的时间和这次触发的时间大于一个执行周期，则执行
        if (now - lastTime - wait > 0) {
          if (timeOut) {
            clearTimeout(timeOut)
            timeOut = null
          }
          lastTime = now
          func.apply(context, arguments)
        } else if (!timeOut) {
          timeOut = setTimeout(() => {
            func.apply(context, arguments)
          }, wait)
        }
      }
    },
    bindScroll () {
      let exThrottle = this.throttle(() => {
        // 滚动条高度+视窗高度 = 可见区域底部高度
        let visibleBottom = window.scrollY + document.documentElement.clientHeight
        // 可见区域顶部高度
        let visibleTop = window.scrollY + 60
        for (let i = 0; i < this.options.length; i++) {
          let option = this.options[i]
          let ele = document.getElementById(option.code)
          if (!ele) {
            return
          }
          let centerY = ele.offsetTop
          if (centerY > visibleTop && centerY < visibleBottom) {
            this.curItemIndex = i
            break
          }
        }
      }, 1000)
      document.addEventListener('scroll', exThrottle)
    }
  },
  mounted () {
    this.bindScroll()
  }
}
</script>
<style lang="scss" scoped>
.navbar {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: left;
  align-items: center;
  height: 60px;
  background: #ffffff;
  font-size: 14px;
  color: #333333;
  padding: 0 35px;
  position: fixed;
  top: 60px;
  overflow: hidden;
  transition: all .3s;
  height: auto;
  margin-left: -30px;
  z-index: 10;
  box-shadow: 0 0px 4px rgba(0, 0, 0, 0.1);
  .option {
    a{
      display: block;
      text-decoration: none;
      color: #333;
      height: 58px;
      line-height: 58px;
      margin-right: 30px;
      border-bottom: 2px solid #ffffff;
      cursor: pointer;
      &:hover,&.curItem {
        color: #7C7AF1;
        border-bottom: 2px solid #7C7AF1;
      }
    }
  }
  .unfold {
    position: absolute;
    width: 30px;
    height: 58px;
    line-height: 58px;
    font-size: 14px;
    color: #7C7AF1;
    right: 45px;
    cursor: pointer;
    font-weight: bold;
  }
  &.fixed {
    font-size: 14px;
    color: #FFFFFF;
    background: #2B2C3B;
    box-shadow: 0 4px 10px 0 rgba(0,0,0,0.34);
    border-bottom: 2px solid #2B2C3B;
    .option {
      a{
        border-bottom: 2px solid #2B2C3B;
        color: #999999;
        border-bottom: 2px solid #2B2C3B;
        &:hover {
          color: #ffffff;
          border-bottom: 2px solid #ffffff;
        }
      }
    }
    .unfold {
      color: #ffffff;
    }
  }
}
</style>
