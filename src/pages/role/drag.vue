<template>
  <div class="box">
    <div class="drag" ref="drag" @touchstart.stop="dragstart" @touchmove.stop="drop" :style="{ top: top + 'px', left: left + 'px' }"></div>
  </div>
</template>

<script>
export default {
  template: 'role-list',
  data () {
    return {
      clientX: 0,
      clientY: 0,
      diffX: 0,
      diffY: 0,
      drag: null,
      left: 0,
      top: 0
    }
  },
  mounted () {
    this.drag = this.$refs.drag
  },
  methods: {
    dragstart (event) {
      let left = this.drag.offsetLeft
      let top = this.drag.offsetTop
      let clientX = event.touches[0].screenX
      let clientY = event.touches[0].screenY
      this.diffX = clientX - left
      this.diffY = clientY - top
    },
    drop (event) {
      let clientX = event.touches[0].screenX
      let clientY = event.touches[0].screenY
      let moveX = clientX - this.diffX
      let moveY = clientY - this.diffY
      if(moveX < 0){
        moveX = 0
      }else if(moveX > window.innerWidth - this.drag.offsetWidth){
        moveX = window.innerWidth - this.drag.offsetWidth
      }
      if(moveY < 0){
          moveY = 0
      }else if(moveY > window.innerHeight - this.drag.offsetHeight){
          moveY =  window.innerHeight - this.drag.offsetHeight
      }
      this.left = moveX
      this.top = moveY
    }
  }
}
</script>

<style lang="scss" scoped>
.box{
  width: 200px;
  height: 800px;
  background: #ccc;
  position: relative;
  .drag{
    width: 80px;
    height: 100px;
    background: red;
    position: absolute;
  }
}
</style>
