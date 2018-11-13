<template>
    <div class="rank-list" v-if="songlist.length >0">
        <music-list :singerMessage="singerMessage" :singer="singer" :songlist="songlist"></music-list>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
import MusicList from '../../base/musicList/musicList'
import {getMusicList} from '../../api/rank.js'
import {creatRanklistSong,getSongVkey} from '../../api/singerList.js'
export default {
data () {
    return {
        songlist : [],
        singerMessage : {},
        singer:{}
    };
},
computed: {
    ...mapGetters({
        rank: 'rank'
    })
},
methods: {
    _getRanklist(){
        if(this.rank.id === undefined){
            this.$router.push('/rank')
            return 
        }
        getMusicList(this.rank.id).then((res=>{
            this.songlist = this.getsongList(res.songlist)
            this.singerMessage.name = res.topinfo.ListName
            this.singer.avatar = res.topinfo.MacDetailPicUrl
            this.singerMessage.dayoryear = res.day_of_year
            this.singerMessage.updatetime = res.update_time
            this.singerMessage.songnum = res.total_song_num
        }))
    },
    getsongList(list){
        let empty = []
        if(list.constructor === Array){
            list.forEach((item,index)=>{
                getSongVkey(item.data.songmid).then((res) => {
                    console.log(res)
                    const vkey = res.data.items[0].vkey
                    if(item.data.singer[0].mid && item.data.albumname){
                        empty.push(creatRanklistSong(item.data,vkey))
                    }
                })
            })
        }
        return empty
        
    }
},
created(){
    this._getRanklist()
},
components:{MusicList}
}
</script>
<style lang='scss' scoped>
    *{padding: 0;margin: 0;box-sizing: border-box;}
    ul,li{list-style: none;}
    .rank-list{
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        width: 100%;
        background: #fff;
        z-index: 999;
    
    }
</style>