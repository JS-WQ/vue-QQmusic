<template>
  <div id="app">
    <m-header></m-header>
    <m-tab></m-tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <m-player></m-player>
  </div>
</template>

<script>
import mheader from './components/m-header/m-header.vue'
import mtab from './components/tab/tab.vue'
import player from './components/onplay/onplay'


export default {
  data(){
    return{}
  },
  components:{
    'm-header': mheader,
    'm-tab': mtab,
    'm-player':player
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
