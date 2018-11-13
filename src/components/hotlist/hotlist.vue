<template>
  <div class="hotlist">
    <MusicList :singerMessage='singerMessage' :singer="singer" :songlist="songlist"></MusicList>
    <div class="desc">
      <h2>歌单简介</h2>
      <span class="desctext">{{hotdesc}}</span>
    </div>
  </div>
</template>
<script>
import MusicList from '../../base/musicList/musicList'
import {mapGetters} from 'vuex'
import {getHotlist} from '../../api/hotlist.js'
import {creatHotlistSong,getSongVkey} from '../../api/singerList.js'

export default {
  data () {
    return {
      singer:{},
      singerMessage:{},
      num:20,
      begin:0,
      songlist:[],
      hotdesc:null,
      getMore:false
    };
  },
  components: {MusicList},
  computed: {
    ...mapGetters({
      hotList: 'hotList'
    })
  },
  methods: {
    _getHotlist(){
      getHotlist(this.hotList.id).then((res)=>{
        if(!this.getMore){
          this.hotdesc = res.cdlist[0].desc
          this.songlist = this.getsongList(res.cdlist[0].songlist)
          this.singer.avatar = this.hotList.picUrl
          this.singer.nickname = res.cdlist[0].nickname
          this.singer.dissname = res.cdlist[0].dissname
          this.singer.headurl = res.cdlist[0].headurl
          this.singer.songnum = res.cdlist[0].songnum
          this.singerMessage.songListDesc = this.hotList.songListDesc
          this.singerMessage.accessnum = (this.hotList.accessnum/1000).toFixed(1)
          console.log(this.songlist)
        }else{
          console.log(res.cdlist.songlist)
        }
          
      })
    },
    getsongList(list){
      let empty = []
      if(list.constructor === Array){
        list.forEach((item,index)=>{
          getSongVkey(item.mid).then((res) => {
            const vkey = res.data.items[0].vkey
            if(item.singer[0].mid && item.title){
              empty.push(creatHotlistSong(item,vkey))
            }
          })
          
        })
      }
      return empty
    }
  },
  created(){
    this._getHotlist()
  }
}

</script>
<style lang='scss' scoped>
  .hotlist{
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
    background: #ffffff;
    overflow: hidden;
  }
</style>