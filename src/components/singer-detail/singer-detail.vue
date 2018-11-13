<template>
  <div class="singer-detail">
    <music-list :singerMessage="singerMessage" :singer="singer" :songlist="songlist"> 
      <p class="onMore" @click="onMoreloading" v-show="songlist.length>0">点击加载更多...</p>
    </music-list>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {getSinger,getSingerdes} from '../../api/getSinger.js'
import {createSong} from '../../api/singerList.js'
import MusicList from '../../base/musicList/musicList'

export default {
  data () {
    return {
      songlist:[],
      singerMessage:{},
      num:20,
      begin:0,
      more:false
    };
  },
  computed: {
    ...mapGetters({
      singer: 'singer'
    })
  },
  methods: {
    _getSinger(){
      if(!this.singer.id){
        this.$router.push('/singer')
        return 
      }
      getSinger(this.singer.id).then((res)=>{
        this._getSingerdes(res.data.singer_id,this.num,this.begin)
      })
    },
    _getSingerdes(id,num,begin,more){
      getSingerdes(id,num,begin).then((res)=>{
        if(!this.more){
          this.songlist = this.getsongList(res.data.list)
          this.singerMessage.fansCount = res.data.fans
          this.singerMessage.total = res.data.total
          this.singerMessage.SingerDesc = res.data.SingerDesc
          this.singerMessage.singer_mid = res.data.singer_mid
          this.singerMessage.name = res.data.singer_name
          this.singerMessage.songlist = res.data.songlist
        }else{
          res.data.list.forEach(element => {
            this.songlist.push(this.getsongList(element)[0])
          })
        }
      })
    },
    getsongList(list){
      let empty = []
      if(list.constructor === Array){
        list.forEach((item,index)=>{
          let musicdata = item.musicData
          if(musicdata.songid && musicdata.albummid){
            empty.push(createSong(musicdata))
          }
        })
      }else if(list.constructor === Object){
        if(list.musicData.singer[0].id && list.musicData.albummid){
            empty.push(createSong(list.musicData))
          }
      }
      return empty
    },
    onMoreloading(){
      this.begin += this.num
      this._getSingerdes(this.songlist[0].singer[0].id,this.num,this.begin,this.more)
    },
    back(){
      this.$router.back()
    }
  },
  created(){
    this._getSinger()
  },
  components:{MusicList}
}

</script>
<style lang='scss' scoped>
  *{padding: 0;margin: 0;box-sizing: border-box;}
  ul,li{list-style: none;}
  .singer-detail{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #fff;
    z-index: 999;
  }
</style>