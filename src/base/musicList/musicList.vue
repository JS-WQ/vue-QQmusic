<template>
    <div class="detail-box">
        <div class="detail-wrapper">
        <div class="detail-header">
            <div class="header-box">
                <div class="backcon"><img src="../../components/images/返回.png" @click="back()"></div>
                <div class="header-wrapper">
                    <img class="singer-logo" :src="singer.avatar">
                    <div class="singer-message">
                        <!-- 歌手详情 -->
                        <p class="singername" v-if="singerMessage.name">{{singerMessage.name}}</p>
                        <p class="fansCount" v-if="singerMessage.fansCount">粉丝数: {{singerMessage.fansCount}}</p>
                        <p class="singer_info" v-if="singerMessage.SingerDesc">{{singerMessage.SingerDesc}}</p>
                        <!-- 热门歌单 -->
                        <p class="dissname" v-if="singer.dissname">{{singer.dissname}}</p>
                        <p class="nickname" v-if="singer.nickname">
                            <img :src="singer.headurl" class="headlogo">
                            <span>{{singer.nickname}}</span>
                        </p>
                        <p class="accessnum" v-if="singerMessage.accessnum">播放量：{{singerMessage.accessnum}}</p>
                        <!-- 歌单排行榜 -->
                        <p class="dayoryear" v-if="singerMessage.dayoryear">第{{singerMessage.dayoryear}}天</p>
                        <p class="updatetime" v-if="singerMessage.updatetime">{{singerMessage.updatetime}} 更新</p>
                    </div>
                </div>
                <div class="playbox" v-if="songlist">
                    <div class="playicon"><img src="../../components/images/播放.png"><span>播放全部</span></div>
                </div>
            </div>
            <img class="headerBG" :src="singer.avatar">
        </div>
        <loading v-if="songlist.length === 0"></loading>
        <div class="detail-listbox" >
            <div class="detail-wrapper" >
                <div class="detailList" ref="detailList">
                    <ul class="singbox">
                        <p class="sinCount" v-if="singerMessage.total">歌曲 共{{singerMessage.total}}首</p>
                        <p class="sinCount" v-if="singer.songnum">歌曲共{{singer.songnum}}首</p>
                        <p class="sinCount" v-if="singerMessage.songnum">排行榜 共{{singerMessage.songnum}}首</p>
                        <li class="sinMess" v-for="(item,index) in songlist" @click="selectItem(item,index)">
                            <h3 class="singname">{{item.name}}</h3>
                            <p class="singtext">
                                <span class="singer" v-if="item.singer.name">{{item.singer.name}} - </span>
                                <span>{{item.album}}</span>
                            </p>
                        </li>
                        <slot></slot>
                    </ul>
                </div>
            </div>
        </div>
        </div>
    </div>
</template>

<script>
import Bscroll from 'better-scroll'
import {mapActions} from 'vuex'
import loading from '../loading/loading'
export default {
    data() {
        return {
        };
    },
    mounted() {
        setTimeout(()=>{
            this._initscroll()
        },20)
    },
    methods: {
        back(){
            this.$router.back()
        },
        _initscroll(){
            this.listScroll = new Bscroll(this.$refs.detailList,{
                click:true
            })
        },
        selectItem(item,index){
            this.selectPlay({
                list: this.songlist,
                index
            })
        },
        ...mapActions([
            'selectPlay'
        ])
    },
    props:['singer','singerMessage','songlist'],
    components:{loading},
    created(){
    }
};
</script>
<style lang='scss' scoped>
    * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
    }
    ul,li {
        list-style: none;
    }
    .detail-box {
        .backcon {
            text-align: left;
            padding-left: 15px;
            background: rgba(0, 0, 0, 0.2);
            height: 40px;
            line-height: 40px;
            img {
            vertical-align: middle;
            height: 30px;
            }
        }
        .detail-wrapper {
            .detail-header {
            .header-box {
                position: relative;
                z-index: 3;
                background: rgba(0, 0, 0, 0.5);
                .header-wrapper {
                display: flex;
                padding: 0 15px;
                padding-top: 20px;
                .singer-logo {
                    width: 125px;
                    height: 125px;
                }
                .singer-message {
                    color: #fff;
                    font-weight: 500;
                    text-align: left;
                    padding-left: 10px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    .singername {
                    font-size: 18px;
                    }
                    .fansCount {
                    font-size: 14px;
                    padding: 8px 0;
                    }
                    .singer_info {
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    word-break: break-all;
                    font-size: 12px;
                    }
                    .dayoryear,{
                        margin: 5px 0;
                        font-size: 14px;
                    }
                    .updatetime{
                        font-size: 14px;

                    }
                    .dissname{
                        font-size: 18px;
                        font-family: sans-serif;
                        font-weight: 100;
                    }
                    .nickname{
                        padding: 8px 0;
                        display: flex;
                        align-items: center;
                        .headlogo{
                            width: 24px;
                            height: 24px;
                            border-radius: 50%;
                            margin-right: 8px;
                        }
                        span{
                            font-size: 15px;
                        }
                    }
                    .accessnum{
                        font-size: 14px;
                    }
                }
                }
                .playbox {
                padding: 22px 0;
                .playicon {
                    display: inline-block;
                    padding: 10px 46px;
                    background: #31c27c;
                    border-radius: 16px;
                    img {
                    width: 14px;
                    height: 14px;
                    }
                    span {
                    color: #fff;
                    }
                }
                }
            }
            .headerBG {
                position: fixed;
                top: 0;
                left: 0;
                z-index: 2;
                width: 100%;
                object-fit: cover;
                filter: blur(36px);
            }
            }
            .detail-listbox {
            position: absolute;
            z-index: 3;
            width: 100%;
            left: 0;
            overflow: hidden;
            top: 270px;
            bottom: 0;
            background: #fff;
            .detail-wrapper {
                height: 100%;
                width: 100%;
                .detailList {
                padding: 0 25px;
                text-align: left;
                position: relative;
                height: 100%;
                width: 100%;
                overflow: hidden;
                background: #F4F4F4;
                .sinCount {
                    color: #777;
                    font-size: 15px;
                    padding: 20px 0;
                }
                .singbox {
                    color: #777;
                    .sinMess {
                    padding-bottom: 20px;
                    .singname {
                        font-weight: 300;
                        color: #000;
                        font-size: 17px;
                    }
                    .singtext {
                        font-size: 13px;
                        font-weight: 100;
                    }
                    }
                    .onMore {
                    text-align: center;
                    padding-bottom: 10px;
                    }
                }
                }
            }
            }
        }
    }

</style>