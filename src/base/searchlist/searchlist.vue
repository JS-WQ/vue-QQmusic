<template>
    <div class="searchlist" ref="searchlist" v-show="searchlist.length>0">
        <ul class="list-box">
            <li class="music-item" v-for="(item,index) in searchlist" @click="selectItem(item,index)">
                <img class="musicicon" src="../../components/images/searchmusic.png">
                <div class="music-ct">
                    <h6 class="musicname">{{item.name}}</h6>    
                    <p class="singer">{{item.singer.name}}</p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import {getSearch} from '../../api/getSearch.js'
import {getSongVkey,creatSearchSong} from '../../api/getSearch.js';
import Bscroll from 'better-scroll'
import {mapActions} from 'vuex'

export default {
data () {
    return {
        searchlist:[],
        page:1
    };
},
components: {},
computed: {},
methods: {
    getSonglist(list){
        let empty = []
        if(list.constructor === Array){
            list.forEach((item,index)=>{
                getSongVkey(item.songmid).then((res)=>{
                    const vkey = res.data.items[0].vkey
                    if(item.singer[0].mid && item.songmid){
                        empty.push(creatSearchSong(item,vkey))
                    }
                })
            })
        }
        console.log(empty)

        return empty
    },
    _initscroll(){
        this.scroll = new Bscroll(this.$refs.searchlist,{
        }) 
    },
    selectItem(item,index){
        this.selectPlay({
            list: this.searchlist,
            index
        })
    },
    ...mapActions([
        'selectPlay'
    ])
},
created(){
    this.$watch('searchQuery',(searchQuery)=>{
        getSearch(searchQuery,this.page).then((res)=>{
            this.searchlist = this.getSonglist(res.data.song.list)
            this.$nextTick(()=>{
                this._initscroll()
            })
        })
    })
},
props:['searchQuery'],
}

</script>
<style lang='scss' scoped>
ul,li{list-style: none;}
*{padding: 0;margin: 0;}
    .searchlist{
        position: fixed;
        top: 148px;
        width: 100%;
        bottom: 0;
        overflow: hidden;
        z-index: 10;
        background: #ffffff;
        .list-box{
            .music-item{
                display: flex;
                padding: 11px 12px;
                border-bottom: 1px solid #cccccc42;
                display: flex;
                align-items: center;
                .musicicon{
                    width: 20px;
                    height: 22px;
                    margin-right: 14px;
                }
                .music-ct{
                    text-align: left;
                    .musicname{
                        font-size: 13px;
                    }
                    .singer{
                        font-size: 12px;
                    }
                }
                
            }
        }
    }
</style>