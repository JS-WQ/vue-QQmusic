<template>
  <div class="search">
      <div class="search-wrapper">
        <div class="search-box">
          <tosearch :placeholder="placeholder" ref="tosearch" @searchQuery='searchQuery'></tosearch>
        </div>
      </div>
      <searchlist :searchQuery="Query"></searchlist>
      <div class="hotsong">
        <h2>热门搜索</h2>
        <ul class="hotBox">
          <li class="hotList" v-for="item in hotList" @click="addQuery(item.k)">{{item.k}}</li>
        </ul>
      </div>
  </div>
</template>

<script>
import {getHotSearch} from '../../api/hotSearch.js'
import tosearch from '../../base/tosearch/tosearch'
import searchlist from '../../base/searchlist/searchlist'
export default {
  data () {
    return {
      hotList:[],
      placeholder:'搜索歌曲或歌手',
      Query:''
    };
  },
  computed: {},
  methods: {
    _getHotSearch(){
      getHotSearch().then((res)=>{
        this.hotList = res.data.hotkey.slice(0,6)
      })
    },
    addQuery(name){
      this.$refs.tosearch.setQuery(name)
    },
    searchQuery(name){
      this.Query = name
    }
  },
  created(){
    this._getHotSearch()
  },
  components:{tosearch,searchlist}
}

</script>
<style lang='scss' scoped>
ul,li{list-style: none;padding: 0;margin: 0;}
  .search{
    background: #fff;
    position: fixed;
    height: 100%;
    width: 100%;
    .search-wrapper{
      padding: 10px;
      background: #F4F4F4;
      .search-box{
        background: #fff;
        border-radius: 3px;
      }
    }
    .hotsong{
      h2{
        font-size: 16px;
        font-weight: 500;
        text-align: left;
        margin-left: 20px;
        
      }
      .hotBox{
        display: flex;
        flex-wrap: wrap;
        margin: 0 20px;
        .hotList{
          font-size: 14px;
          padding: 4px 10px;
          border-radius: 16px;
          margin-right: 24px;
          margin-bottom: 8px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #00000036;
        }
      }
    }
  }
</style>