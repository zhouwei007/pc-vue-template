<template>
  <div :class="{mark: true, show: isShow}" :id="id">
    <div class="icon"></div>
    <div class="text" @click="toggleMain">{{title}}</div>
    <div class="mark-arrow" @click="toggleMain">
      <i class="hl-icon hl-icon-arrow-down"></i>
    </div>
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'Mark',
  props: {
    title: {
      type: String,
      default: ''
    },
    unfold: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      isShow: this.unfold
    }
  },
  methods: {
    toggleMain: function () {
      this.isShow = !this.isShow
    }
  }
}
</script>
<style lang="scss" scope>
.mark {
  height: 70px;
  background: #FFFFFF;
  border-radius: 4px;
  margin-top: 16px;
  position: relative;
  padding: 0 30px;
  transition: height 0.5s;
  overflow: hidden;
  &.show{
    height: auto;
    min-height: 70px;
    padding-bottom: 30px;
    overflow: initial;
    .mark-arrow {
      transform:rotate(-180deg);
    }
  }
  .icon {
    position: absolute;
    left: 0;
    top: 25px;
    width: 4px;
    height: 20px;
    background: #6975C9;
  }
  .text {
    line-height: 70px;
    font-size: 22px;
    color: #333333;
    cursor: pointer;
    &:hover {
      color: #6975C9;
    }
  }
  .mark-arrow {
    position: absolute;
    right: 20px;
    top: 20px;
    width: 30px;
    height: 30px;
    cursor: pointer;
    transition: all 0.5s;
    .hl-icon-arrow-down {
      line-height:30px;
      font-size: 30px;
      color: #333333;
    }
  }
}
</style>
