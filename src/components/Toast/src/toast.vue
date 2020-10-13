<template>
  <div class="sass-toast" v-if="showState">
    {{prompt}}
  </div>
</template>
<script>
export default {
  name: 'Toast',
  data () {
    return {
      prompt: '',
      showState: false
    }
  },
  methods: {
    show (str, time) {
      this.showState = false
      this.prompt = str
      this.showState = true
      setTimeout(() => {
        this.showState = false
      }, time || 1000)
    }
  }
}
</script>
<style scoped lang="scss">
.sass-toast{
  position: fixed;
  top: 10%;
  left: 50%;
  transform: translate(0,-50%);
  padding: 5px 10px;
  font-size: 12px;
  text-align: center;
  color:#FFF;
  background: rgba(0,0,0,.7);
  border-radius: 2rem;
  box-shadow: 0 0 4px #4F4F4F;
  animation: moveTop 3s 1;
  animation-fill-mode:forwards;
  z-index: 2000;
  @keyframes moveTop{
    0%{
      display: block;
      top:10%;
      opacity: 0;
    }
    15%{
      top:40%;
      opacity: 1;
    }
    70%{
      top:40%;
      opacity: 1;
    }
    95%{
      top:10%;
      opacity: 0;
    }
    100%{
      top:10%;
      opacity: 0;
      display: none;
    }
  }
}
</style>
