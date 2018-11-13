<template>
  <div class="header">
    <div class="icon"><img src="../images/logo.png"><span class="title"></span></div>
    <div class="mine"><img src="../images/头像.png"></div>
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
  .header{
    background: #31c27c;
    .icon{
      padding: 8px 0;
      display: flex;
      justify-content: center;
      align-items: center;
      img{
        height: 30px;
      }
      .title{
        color: #fff;
        font-size: 20px;
        margin-left: 5px;
      }
    }
    .mine{
      width: 44px;
      height: 44px;
      position: absolute;
      top: 12px;
      right: 0px;
      img{
        width: 22px;
        height: 22px;
      }
    }
  }
  
</style>