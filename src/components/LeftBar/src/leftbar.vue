<template>
  <div :class="{'left-bar': true, thin: isThinBar}">
    <div class="box">
      <template v-for="(route, index) in routes">
        <div
          :class="{head: true, unfold: foldArr[index]}"
          :key="index"
          @click="toggleList(index)"
          @mouseover="listMouseOver(index)"
          @mouseout="listMouseOut(index)"
        >
          <i :class="{'hl-icon': true, 'icon': true, [route.icon]: true, 'left': true}"></i>
          <span class="title left">{{route.title}}</span>
          <i class="hl-icon fold hl-icon-arrow-down right"></i>
        </div>
        <div
          :class="{list: true, unfold: foldArr[index]}"
          :key="route.key"
          :style="{height: listHeight(index, route), top: 40*index + 'px', width: foldArr[index] ? 160 + 'px' : 0 + 'px'}"
          @mouseover="listMouseOver(index)"
          @mouseout="listMouseOut(index)"
        >
          <div class="title">{{route.title}}</div>
          
          <div
            v-for="child in route.children"
            :class="{item: true, current: curPath === route.path + child.path}"
            :key="child.key"
            @click="routeTo(route.path + child.path)"
          >
          {{child.title}}
          </div>
        </div>
      </template>
      <div class="list-btn" @click="toggleBill">
        <i class="hl-icon hl-icon-363 btn"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import routeData from '@/router/leftbar'
export default {
  name: 'LeftBar',
  data () {
    return {
      routes: [],
      foldArr: [],
      isThinBar: false,
      curPath: this.$route.path
    }
  },
  watch: {
    '$route.path': function () {
      this.curPath = this.$route.path
    }
  },
  computed: {
    ...mapState(['loginInfo', 'leftBar'])
  },
  methods: {
    initFoldArr () {
      routeData.map((item) => {
        let result = this.leftBar.find((bar) => {
          return bar.code == item.key
        })
        if (result) {
          item.title = result.title
          let subs = []
          item.children.map((child) => {
            result.subs.map((subbar) => {
              if (child.key == subbar.code) {
                child.title = subbar.title
                subs.push(child)
              }
            })
          })
          item.children = subs
          this.routes.push(item)
        } 
      })

      this.routes.map(() => {
        this.foldArr.push(true)
      })
    },
    routeTo (path) {
      this.$router.push(path)
    },
    toggleList (index) {
      if (this.isThinBar) {
        return
      }
      this.$set(this.foldArr, index, !this.foldArr[index])
    },
    listMouseOver (index) {
      if (!this.isThinBar) {
        return
      }
      this.$set(this.foldArr, index, true)
    },
    listMouseOut (index) {
      if (!this.isThinBar) {
        return
      }
      this.$set(this.foldArr, index, false)
    },
    listHeight (index, route) {
      if (this.isThinBar) {
        return this.foldArr[index] ? 40 * (route.children.length + 1) + 'px' : '0px'
      } else {
        return this.foldArr[index] ? 40 * route.children.length + 'px' : '0px'
      }
    },
    toggleBill () {
      this.foldArr.map((item, index) => {
        this.$set(this.foldArr, index, false)
      })
      this.isThinBar = !this.isThinBar
    },
    getCurRoute () {
      let result = ''
      this.routes.map((route) => {
        result = route.children.find((child) => {
          return (this.curPath === route.path + child.path || this.curPath.indexOf('detail'))
        })
      })
      if (!result) {
        this.routeTo('/welcome/index')
      }
    },
    ...mapActions([
      'getMenuList'
    ])
  },
  async mounted () {
    await this.getMenuList()
    this.initFoldArr()
    this.getCurRoute()
  }
}
</script>

<style lang="scss" scoped>
.left-bar {
  width: 160px;
  min-width: 160px;
  background: #2B2C3B;
  box-shadow: 0 0 20px 0 rgba(41,87,249,0.10);
  transition: all 0.5s;
  z-index: 13;
  margin-top: 60px;
  .box {
    width: 160px;
    position: fixed;
  }
  .head {
    width: 160px;
    height: 40px;
    line-height: 40px;
    cursor: pointer;
    .hl-icon {
      width: 30px;
      font-size: 18px;
      color: #ffffff;
      text-align: center;
    }
    .icon {
      margin-left: 5px;
      transition: all 0.5s;
    }
    .fold {
      margin-right: 10px;
      transition: transform 0.3s;
    }
    .title {
      font-size: 14px;
      color: #FFFFFF;
    }
    .left {
      float: left;
    }
    .right {
      float: right;
    }
    &.unfold {
      .fold {
        transform:rotate(-180deg);
      }
    }
  }
  .list {
    width: 160px;
    transition: all 0.3s;
    opacity: 0;
    overflow: hidden;
    &.unfold {
      opacity: 1;
    }
    .item {
      height: 40px;
      line-height: 40px;
      font-size: 12px;
      color: #FFFFFF;
      padding-left: 42px;
      cursor: pointer;
      &:hover,&.current {
        background: #6975C9;
      }
    }
    .title {
      display: none;
    }
  }
  &.thin {
    .box {
      width: 40px;
      position: fixed;
    }
    width: 40px;
    min-width: 40px;
    position: relative;
    transition: all 0.5s;
    .head {
      width: auto;
      .icon {
        margin-left: 5px;
      }
      .fold {
        display: none;
      }
      .title {
        display: none;
      }
      &:hover{
        background: #6975C9;
      }
    }
    .list {
      position: absolute;
      top: 0px;
      left: 40px;
      width: 0px;
      background: #2B2C3B;
      font-size: 14px;
      color: #FFFFFF;
      overflow: hidden;
      transition: width 0.3s;
      z-index: 12;
      .item {
        width: 160px;
        height: 40px;
        line-height: 40px;
        font-size: 12px;
        text-align: center;
        padding-left: 0px;
        cursor: pointer;
        &:hover,&.current {
          background: #6975C9;
        }
      }
      .title {
        width: 160px;
        height: 40px;
        line-height: 40px;
        padding-left: 30px;
        display: block;
        font-size: 14px;
        color: #FFFFFF;
      }
    }
    &.hover {
      .list {
        width: 160px;
      }
    }
    .list-btn {
      left: 21px;
      transition: all 0.5s;
    }
  }
  .list-btn {
    position: absolute;
    width: 20px;
    height: 60px;
    opacity: 1;
    top: 270px;
    left: 141px;
    transition: all 0.5s;
    .btn {
      display: block;
      cursor: pointer;
      text-align: center;
      width: 20px;
      height: 60px;
      color: #EFF0F8;
      font-size: 60px;
      line-height: 60px;
    }
  }
}
</style>
