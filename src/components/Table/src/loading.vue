<template>
  <transition name="loading-fade">
    <div
      v-if="show"
      class="sass-loading-wrapper"
    >
      <div
        class="sass-loading"
        :style="{ top }"
      >
        <svg viewBox="0 0 32 32">
          <path opacity=".25" d="M16 0 A16 16 0 0 0 16 32 A16 16 0 0 0 16 0 M16 4 A12 12 0 0 1 16 28 A12 12 0 0 1 16 4" />
          <path d="M16 0 A16 16 0 0 1 32 16 L28 16 A12 12 0 0 0 16 4z" />
        </svg>
        <p class="sass-loading-message">
          {{ message }}
        </p>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Loading',
  data () {
    return {
      top: '45%'
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: '数据加载中...'
    }
  }
}
</script>

<style lang="scss" scoped>
.sass-loading-wrapper {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 99;
}

.sass-loading {
  position: absolute;
  left: 50%;
  width: 220px;
  height: 220px;
  margin-top: -110px;
  margin-left: -110px;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  overflow: hidden;

  svg {
    width: 64px;
    height: 64px;
    margin-top: 60px;
    margin-bottom: 20px;
    fill: #fff;
    animation: loading-rotate 2s linear infinite both;
  }

  .sass-loading-message {
    font-size: 14px;
    color: #fff;
  }

  &.loading-fade-enter-active {
    animation: loading-fade-in .1s;
  }

  &.loading-fade-leave-active {
    animation: loading-fade-in .1s reverse;
  }
}

@keyframes loading-fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes loading-rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
