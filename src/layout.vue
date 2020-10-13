<template>
  <main>
    <Head></Head>
    <LeftBar></LeftBar>
    <div class="content" id="content">
       <div id="contentScroll">
          <transition name="move" mode="out-in">
            <keep-alive :key='1'>
              <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
          </transition>
          <transition name="move" mode="out-in">
            <router-view :key='2' v-if="!$route.meta.keepAlive"></router-view>
          </transition>
        </div>
    </div>
  </main>
</template>

<script>
import { mapActions } from 'vuex'
import Head from '@/components/Header'
import LeftBar from '@/components/LeftBar'
export default {
  components: {
    Head,
    LeftBar
  },
  methods: {
    ...mapActions([
      'getParaFormatCheck'
    ])
  },
  async created() {
    await this.getParaFormatCheck()
  }
}
</script>
<style lang="scss" scoped>
main {
  display: grid;
  width: 100%;
  height: 100%;
  min-width: 1200px;
  grid-template-rows: min-content 1fr;
  grid-template-columns: min-content 1fr;

  .header {
    grid-column: span 2;
  }
  .content {
    overflow-x: scroll;
    min-height: calc(100vh - 60px);
    width: 100%;
    box-sizing: border-box;
    background: #EFF0F8 ;
    padding: 30px;
    margin-top: 60px;
    padding-bottom: 120px;
  }
}
</style>