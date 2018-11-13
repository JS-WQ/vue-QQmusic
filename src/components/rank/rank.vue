<template>
  <div class="rank">
    <div class="rank-wrapper" ref="rankWrapper">
      <div class="listBox">
        <div class="list-item" v-for="item in topList" :data-id="item.id" @click="selecRank(item)">
          <img class="list-img" :src="item.picUrl" >
          <ul class="songList">
            <li class="listname" v-for="(newtem,index) in item.songList"><span>{{index+1}}</span>{{newtem.songname}}-{{newtem.singername}}</li>
          </ul>
        </div>
      </div>
    </div>
    <transition name="slider">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import {mapGetters,mapMutations} from 'vuex'
import {getTopList} from '../../api/rank.js'
import Bscroll from 'better-scroll'

export default {
  data () {
    return {
      topList:[]
    };
  },
  computed: {},
  methods: {
    _getTopList(){
      getTopList().then((res)=>{
        this.topList = res.data.topList
        this.$nextTick(()=>{
          this._initscroll()
        })
      })
    },
    _initscroll(){
      this.rankscroll = new Bscroll(this.$refs.rankWrapper,{
        click:true
      })
    },
    selecRank(item){
      this.$router.push({path:`/rank/${item.id}`})
      this.setRank(item)
    },
    ...mapMutations({
      setRank: 'SET_RANK'
    })
  },
  created(){
    this._getTopList()
  }
}
</script>
<style lang='scss' scoped>
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
.rank {
  background: #31c27c;
  height: 100%;
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
  .rank-wrapper{
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden;
    .listBox {
      padding-top: 20px;
      .list-item {
        display: flex;
        margin-bottom: 20px;
        padding: 0 20px;
        .list-img {
          height: 100px;
          width: 100px;
        }
        .songList {
          flex: 1;
          text-align: left;
          padding: 0 20px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: #b2f5d5a3;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          .listname {
            font-size: 12px;
            padding: 4px 0;
            overflow: hidden;
            text-overflow: ellipsis;
            span {
              padding-right: 2px;
            }
          }
        }
      }
    }
  }
  
}
</style>
