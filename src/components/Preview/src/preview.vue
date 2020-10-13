<template>
  <div v-if="isShow" class="picture-viewer" @click="close">
    <div class="main" ref="main">
      <div :class="{'arrow-left': true, show: this.curPicIndex > 0}" @click.stop.prevent="pre">
        <i class="hl-icon hl-icon-arrow-left"></i>
      </div>
      <div class="middle" ref="middleBox">
        <div class="pics" @click.stop.prevent ref="picBox">
          <div
            v-for="(pic, index) in fileList"
            v-show="curPicIndex==index"
            class="img-box"
            :key="index"
            :style="{top: top + 'px', left: left + 'px'}"
          >
            <img
            :src="getUrl(pic.url)"
            :ref="`pic-${index}`"
            :style="{width: curPicIndex==index ? `${scale * boxWidth * 0.7}px` : `${boxWidth * 0.7}px`, transform: curPicIndex==index ? `rotate(${rotate * 180}deg)` : `rotate(180deg)`}"
            @dragstart="dragstart"
            @dragover="drop"
            @mousewheel="setScale1(1,$event)"
          />
          </div>
        </div>
        <div class="picture-icons">
          <div
            v-for="(pic, index) in fileList"
            :class="{'picture-icon': true, on: index == curPicIndex}"
            :key="index"
            @click.stop.prevent="turn(index)"
          ></div>
        </div>
      </div>
      <div :class="{'arrow-right': true, show: this.curPicIndex < this.fileList.length - 1}" @click.stop.prevent="next">
        <i class="hl-icon hl-icon-arrow-right"></i>
      </div>
    </div>
    <div class="pic-opera">
      <span @click.stop.prevent="setScale(1)" class="hl-icon hl-icon-round-add"></span>
      <span @click.stop.prevent="setScale(0)" class="hl-icon hl-icon-round-minu"></span>
      <span @click.stop.prevent="setRotate(1)" class="hl-icon hl-icon-forward"></span>
      <span @click.stop.prevent="setRotate(2)" class="hl-icon hl-icon-reply"></span>
      <span @click.stop.prevent="setReset(true)" class="hl-icon hl-icon-repeal"></span>
    </div>
    <div class="mask"></div>
  </div>
</template>
<script>
export default {
  name: 'Preview',
  data () {
    return {
      isShow: this.show,
      curPicIndex: this.curIndex,
      boxWidth: 0,
      scale: 1,
      rotate: 2,
      clientX: 0,
      clientY: 0,
      diffX: 0,
      diffY: 0,
      left: 0,
      top: 0
    }
  },
  props: {
    fileList: {
      type: Array,
      default: () => {
        return []
      }
    },
    show: {
      type: Boolean,
      default: false
    },
    curIndex: {
      type: Number,
      default: 0
    }
  },
  watch: {
    show: function (val) {
      this.isShow = val
      this.setReset(val)
    },
    curIndex: function (val) {
      this.curPicIndex = val
    }
  },
  methods: {
    getUrl(url) {
      return url.slice(0, url.indexOf('&iopcmd'))
    },
    next () {
      if (this.curPicIndex < this.fileList.length - 1) {
        this.curPicIndex = this.curPicIndex + 1
      }
    },
    pre () {
      if (this.curPicIndex > 0) {
        this.curPicIndex = this.curPicIndex - 1
      }
    },
    turn (index) {
      this.curPicIndex = index
      this.setReset(true)
    },
    close () {
      this.isShow = false
      this.$emit('close')
    },
    setScale (status) {
      this.scale = status === 1 ? this.scale + 0.2 : this.scale - 0.2
    },
    setScale1 (status, event) {
      let main = this.$refs.main;
      main.onmousewheel = function () {return false;}
      this.scale = event.wheelDelta > 0 ? this.scale + 0.15 : this.scale - 0.15
    },
    setRotate (status) {
      this.rotate = status === 1 ? this.rotate + 0.5 : this.rotate - 0.5
    },
    setReset (status) {
      this.scale = 1
      this.rotate = 2
      this.left = 0
      this.top = 0
      if (status) {
        this.$nextTick(() => {
          this.boxWidth = this.$refs.middleBox.offsetWidth
          setTimeout(() => {
            let boxHeight = this.$refs.middleBox.offsetHeight
            let drag = this.$refs[`pic-${this.curPicIndex}`] && this.$refs[`pic-${this.curPicIndex}`][0]
            let dragWidth = parseInt(this.$refs.main.clientWidth)/2 - parseInt(drag.width)/2
            let dragHeight = drag.offsetHeight
            this.left = dragWidth
            this.top = (boxHeight - dragHeight) / 2
          }, 10)
        })
      }
    },
    dragstart (event) {
      let drag = this.$refs[`pic-${this.curPicIndex}`] && this.$refs[`pic-${this.curPicIndex}`][0]
      let left = drag.offsetLeft
      let top = drag.offsetTop
      let clientX = event.clientX
      let clientY = event.clientY
      this.diffX = clientX - left - this.left
      this.diffY = clientY - top - this.top
      // this.diffX = clientX - left
      // this.diffY = clientY - top
    },
    drop (event) {
      // let drag = this.$refs[`pic-${this.curPicIndex}`][0]
      let clientX = event.clientX
      let clientY = event.clientY
      let moveX = clientX - this.diffX
      let moveY = clientY - this.diffY
      this.left = moveX
      this.top = moveY
    }
  }
}
</script>
<style lang="scss" scoped>
.picture-viewer {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 12;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .mask {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 12;
  }
.main {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    z-index: 13;
    position: relative;
    .arrow-left,.arrow-right {
      width: 60px;
      height: 60px;
      background:rgba(0, 0, 0, 0.6);
      border-radius: 30px;
      visibility: hidden;
      z-index: 100;
      .hl-icon-arrow-left,.hl-icon-arrow-right {
        color: #ffffff;
        font-size: 60px;
        text-align: center;
        line-height: 60px;
        cursor: pointer;
      }
      &.show {
        visibility: visible;
      }
    }
    .middle {
      margin: 0 40px;
       min-width: 400px;
      max-width: 60%;
      width: 800px;
      height: 400px;
      // background: #fff;
      // overflow: hidden;
      //position: relative;
      // background: rgba(255, 255, 255, 0.5)
      // background: #f9f9f9;
    }
    .pics {
      width: 100%;
      height: 338px;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      // position: relative;
      .img-box {
        // display: flex;
        // justify-content: center;
        // align-items: center;
        // text-align: center;
        width: 40%;
        position: absolute;
        left: 0;
        right:0;
        img{
          display: block;
          // max-width: 50vw;
          // max-height: 70vh;
        }
      }
      >img {
        max-width: 50vw;
        max-height: 70vh;
      }
    }
    .picture-icons {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 62px;
      position: fixed;
      bottom: 95px;
      left: 0;
      .picture-icon {
        width: 10px;
        height: 10px;
        border-radius: 5px;
        background: rgba(255,255,255,0.3);
        margin-right: 10px;
        cursor: pointer;
        &:hover,&.on {
          background: rgba(255,255,255,1);
        }
      }
    }
  }
}
.pic-opera{
  position: absolute;
  z-index: 99;
  color: #000;
  display: flex;
  bottom:75px;
  span{
    display: block;
    padding:5px;
    font-size: 24px;
    justify-content: center;
    align-items: center;
    background: #fff;
    cursor: pointer;
  }
}
</style>
