<template>
  <div class="loading">
      <img class="img-loading" src="../../components/images/loading.gif">
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>
<style lang='scss' scoped>
    .loading{
        position: relative;
        z-index: 99;
        .img-loading{
            width: 80px;
            height: 80px;
        }
       
    }
</style>