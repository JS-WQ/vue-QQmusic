<template>
  <div class="recommend">
    <div class="recommend-content">
      <div class="slider-wrapper" v-if="recommends.length">
        <Slider :loop="loop" :autoPlay="autoPlay" :interval="interval">
          <div v-for="item in recommends">
            <a :href="item.linkUrl">
              <img :src="item.picUrl">
            </a>
          </div>
        </Slider>
      </div>
      <div class="loading-content" v-show="!discList.length">
        <loading :loading-title="loadingTitle"></loading>
      </div>
      <div class="recommend-list">
        <h1 class="list-title">热门歌单推荐</h1>
        <ul>
          <li v-for="item in discList" class="recom-songList" @click="selectItem(item)">
            <div class="list-media">
              <img :src="item.picUrl">
              <div class="media-info">
                <span class="listenCount">
                  <i class="listen-icon"></i>
                  {{item.accessnum}}
                </span>
                <span class="play-icon"></span>  
              </div>            
            </div>
            <div class="list-info">
              <p class="info-title">{{item.songListDesc}}</p>
              <span class="singer">{{item.songListAuthor}}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import Slider from '../../base/slider/slider'
import {getRecommend,getDiscList,getRadioList,test1} from '../../api/recommend.js'
import loading from '../../base/loading/loading'
import {mapMutations} from 'vuex'
export default {
  data () {
    return {
      recommends:[],
      discList:[],
      loop:true,
      autoPlay:true,
      interval:1000,
      radioList:[],
      loadingTitle:'正在加载中...'
    };
  },
  components: {Slider,loading},
  computed: {},
  methods: {
    _getRecommend(){
      getRecommend().then((res) =>{
        if(res.code === 0){
          this.recommends = res.data.slider
        }
      })
    },
    _getDiscList(){
      getDiscList().then((res)=>{
        if(res.code === 0){
          this.discList = res.data.songList
        }
      })
    },
    _getRadioList(){
      getRadioList().then((res)=>{
        if(res.code === 0){
          this.radioList = res.data.radioList
        }
      })
    },
    ...mapMutations({
      setHotList: 'SET_HOTLIST'
    }),
    selectItem(item){
      this.$router.push({path:`/recommend/${item.id}`})
      this.setHotList(item)
    }
  },
  created(){
    this._getRecommend()
    this._getDiscList()
    this._getRadioList()
  }

}

</script>
<style lang='scss' scoped>
li,ul{list-style: none;}
  .recommend{
    .recommend-content{
      background: #F4F4F4;
      .slider-wrapper{
        .slider{
          .slider-group{
            .slider-item{
              a{
                img{}
              }
            }
          }
        }
      }
      .recommend-list{
        padding: 0 10px;
        .list-title{
          margin-bottom: 11px;
          font-size: 16px;
          font-weight: 500;
          text-align: left;
        }
        ul{
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          padding: 0;
          margin: 0;
          .recom-songList{
            width: 49%;
            background: #fff;
            margin-bottom: 10px;
            .list-media{
              width: 100%;
              position: relative;
              img{
                width: 100%;
              }
              .media-info{
                position: absolute;
                bottom: 6px;
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .listenCount{
                  color: #fff;
                  margin-left: 5px;
                  font-size: 12px;
                  .listen-icon{
                    display: inline-block;
                    width: 10px;
                    height: 10px;
                    background: url('../images/list_sprite.png') no-repeat;
                    background-position: 0 -50px;
                    background-size: 24px 60px;
                    margin-right: 3px;
                  }
                }
                .play-icon{
                  display: inline-block;
                  width: 24px;
                  height: 24px;
                  background-image: url('../images/list_sprite.png');
                  background-repeat: no-repeat;
                  background-size: cover;
                  margin-right: 5px;

                  }
              }
              
            }
            .list-info{
              font-size: 14px;
              text-align: left;
              padding-bottom: 5px;
              .info-title{
                margin: 0;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              .singer{
                font-size: 12px;
              }
            }
          }
        }
      }
    }
  }
</style>