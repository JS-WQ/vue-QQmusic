<template>
  <div class="singer">
    <div class="singerview" ref="singer">
      <div class="singerlist" ref="singerList">
        <div class="singer-wrapper" v-for="items in singerList" >
          <div class="list-box">
            <h2 class="title">{{items.title}}</h2>
            <ul class="item-list">
              <li class="item" v-for="item in items.items" :data-id="item.id" @click="selectSinger(item,$event)">
                <img class="avatar" :src="item.avatar">
                <span class="singer-name">{{item.name}}</span>
              </li>
            </ul>
          </div>      
        </div>
      </div>
    </div>
    <div class="listZ">
      <ul class="zview">
        <li class="z-item" v-for="(item,index) in zList" :class="{'active':currentIndex === index}" @touchstart="ztoushstart(index,$event)">
          <span href="">{{item}}</span>
        </li>
      </ul>
    </div>
    <transition name="slider">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import { getSingerList } from "../../api/singerList.js";
import Singer from "../../common/js/singer.js";
import Bscroll from 'better-scroll'
import {mapMutations} from 'vuex'

const Host = "热门";
const HostLength = 10;

export default {
  data() {
    return {
      singerList: [],
      zList:[],
      scrollY:0,
      listHeight:[]
    };
  },
  components: {},
  methods: {
    _getSingerList() {
      getSingerList().then(res => {
        if (res.code === 0) {
          this.singerList = this._normalSinger(res.data.list);
          this.singerList.forEach((item)=>{
            this.zList.push(item.title.slice(0,1))
          })
          this.$nextTick(()=>{
            this._initBscroll()
            this._getSingerWrappHeight()
          })
        }
      });
      
    },
    _normalSinger(list) {
      //把前十个数据当作热门数据
      let map = {
        hot: {
          title: Host,
          items: []
        }
      };

      list.forEach((item, index) => {
        //热门的数据
        if (index < HostLength) {
          map.hot.items.push(
            new Singer({
              name: item.Fsinger_name,
              id: item.Fsinger_mid
            })
          );
        }

        //剩下的数据按照字母进行分类
        let key = item.Findex;
        //新建字母的分类
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          };
        }

        //把所有的数据都放在不同的类上了
        map[key].items.push(
          new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          })
        );
      });
      let ret = [];
      let hot = [];
      for (let key in map) {
        let newArr = map[key];
        if (newArr.title.match(/[a-zA-Z]/)) {
          ret.push(newArr);
        } else if (newArr.title === Host) {
          hot.push(newArr);
        }
      }

      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });

      return hot.concat(ret); //把两个数据合并
    },
    _initBscroll(){
      this.zscroll = new Bscroll(this.$refs.singer,{
        click:true,
        probeType:3
      }) 
      this.zscroll.on('scroll',(position)=>{
        this.scrollY = Math.abs(Math.round(position.y))
      })
    },
    ztoushstart(index,event){
      let list = this.$refs.singerList.querySelectorAll('.singer-wrapper')
      this.zscroll.scrollToElement(list[index],300)      
    },
    _getSingerWrappHeight(){
      let singerlist = this.$refs.singerList.querySelectorAll('.singer-wrapper')
      let itemHeight = 0
      this.listHeight.push(itemHeight)
      for(let i=0;i<singerlist.length;i++){
        itemHeight += singerlist[i].clientHeight
        this.listHeight.push(itemHeight)
      }
    },
    selectSinger(item,event){
      this.$router.push({path:`/singer/${item.id}`})
      this.setSinger(item)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  },
  created() {
    this._getSingerList();
  },
  computed:{
    currentIndex(){
      for(let i=0;i<this.listHeight.length;i++){
        let height1 = this.listHeight[i]
        let height2 = this.listHeight[i+1]
        if(!height2 || (this.scrollY >= height1 && this.scrollY < height2)){
          return i
        }
      }
    }
  }
};
</script>
<style lang='scss' scoped>
ul,li {
  list-style: none;
}
*{padding: 0;margin:0}
.singer{
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
  .singerview{
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden;
    background: #31c27c;
    .singerlist{
      .singer-wrapper{
        padding-bottom: 22px;
        .list-box{
          .title{
            font-size: 14px;
            background: #b2f5d5a3;
            font-weight: 500;
            color: #6d5d5d;
            padding: 5px 0;
            text-align: left;
            padding-left: 20px;
          }
          .item-list{

            padding-left: 30px;
            .item{
              display: flex;
              align-items: center;
              padding-top: 20px;
              .avatar{
                height: 50px;
                width: 50px;
                border-radius: 50%;
              }
              .singer-name{
                font-size: 14px;
                margin-left: 18px;
              }
            }
          }
        }
      }
    }
  }
  .listZ{
    position: fixed;
    right: 0;
    top: 50%;
    background: #14ef50ba;
    border-radius: 15px;
    transform: translateY(-50%);
    z-index: 99;
    .zview{
      padding: 5px 0;
      .z-item{
        span{
          color: #000;
          font-size: 12px;
          display: inline-block;
          width: 20px;
        }
      }
      .z-item.active{
        span{
          color:red;
        }
      }
    }
  }
  .slider-enter-active, .slider-leave-active{
    transition: all 0.3s
  }
  .slider-enter, .slider-leave{
    transform: translate3d(10%,0,0)
  }
}
</style>