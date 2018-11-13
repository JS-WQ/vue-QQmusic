<template>
  <div class="tab">
      <router-link tag="div" class="tab-item" to="/recommend">
        <span class="tab-link">推荐</span>
      </router-link>
      <router-link tag="div" class="tab-item" to="/singer">
        <span class="tab-link">歌手</span>
      </router-link>
      <router-link tag="div" class="tab-item" to="/rank">
        <span class="tab-link">排行</span>
      </router-link>
      <router-link tag="div" class="tab-item" to="/search">
        <span class="tab-link">搜索</span>
      </router-link>
  </div>
</template>

<script>
export default {
  data () {
    return {
    };
  },
  components: {},
  computed: {},
  methods: {}
}

</script>
<style lang='scss' scoped>
  .tab{
    font-family: Helvetica, sans-serif;
    background: #ffffff;
    color: rgba(0,0,0,.6);
    display: flex;
    justify-content: center;
    align-items: center;
    .tab-item{
      flex: 1;
      .tab-link{
        padding: 3px 0;
        margin: 7px 0;
        display: inline-block;
        font-size: 16px;
      }
    }
    .router-link-active{
      .tab-link{
        border-bottom: 1px solid #31c27c;
        font-weight: lighter;
      }
    }
  }
</style>