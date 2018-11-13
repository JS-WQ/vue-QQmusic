<template>
  <div class="player" v-show="playlist.length>0">
      <div class="fullPlay" v-show="fullScreen">
        <div class="playerBg"><img :src="currentSong.image"></div>
        <div class="back">
          <img src="../images/下拉.png" @click="back">
        </div>
        <header class="header" v-if="currentSong.name !== undefined">
          <p class="songname">{{currentSong.name}}</p>
          <p class="singername">{{currentSong.singer.name}}</p>
        </header>
        <div class="rotateBox">
          <div class="rotate-wrapper" @click="toggleRotate">
            <div class="imgBox" v-show="showlyric === false">
              <div class="img-wrapper">
                <img class='musicBg' :src="currentSong.image" ref="musicbg" :class="addRotate">
              </div>
            </div>
            <div class="lyric-box" v-show="showlyric" v-if="currentLyric" ref="lyricBox">
              <div class="lyric-wrapper" ref="lyricWrapper">
                <div  class="lyric-ct">
                  <p ref="lyricLine"
                    class="text"
                    :class="{'currentline': currentLineNum === index}"
                    v-for="(line,index) in currentLyric.lines"
                  >
                  {{line.txt}}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bottomPlay">
          <div class="progress-wrapper">
            <p class="time-left">
              <span>{{getSongDuration(currentTime)}}</span>
            </p>
            <div class="progress-bar-wrapper">
              <div class="progress-bar">
                <div class="bar-inner" ref="barInner">
                  <div class="progress" ref="progress"></div>
                  <div class="progress-btn-wrapper">
                    <span class="progress-btn" 
                      @touchmove.stop.prevent="moveProgress" 
                      @touchstart.stop.prevent="startProgress"
                      @touchend.stop.prevent="endProgress"
                    ></span>
                  </div>
                </div>
              </div>
            </div>
            <p class="time-right">
              <span>{{getSongDuration(currentSong.duration)}}</span>
            </p>
            
          </div>
          <div class="operators">
            <ul class="operators-wrapper">
              <li class="operatror" :class="{sequence:mode === 0,loop:mode === 1,random:mode === 2}" @click="changeMode"></li>
              <li class="operatror playPrev" @click="prevMusic" :class="songReady?'':'disable'"></li>
              <li class="operatror" :class="playing?'play':'pause'" @click="togglePlaying"></li>
              <li class="operatror playNext" @click="nextMusic" :class="songReady?'':'disable'"></li>
              <li class="operatror" :class="toLove?'tolove':'love'"></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="miniPlay" v-show="!fullScreen && playlist.length>0" @click="openMiniPlay">
        <div class="miniPlay-wrapper">
          <div class="miniPlay-left">
            <img class="miniLogo" :src="currentSong.image" :class="playing?'play':'pause'">
            <div class="miniPlaydes" v-if="currentSong.name !== undefined">
              <p class="songname">{{currentSong.name}}</p>
              <p class="singername">{{currentSong.singer.name}}</p>
            </div>
          </div>
          <div class="miniPlay-right">
            <div class="playBox">
              <svg width="34" height="34" viewBox='0 0 34 34'>
                <circle cx="17" cy="17" r="13" stroke-width="2" stroke="#69636340" fill="none"></circle>
                <circle ref="audioStroke" cx="17" cy="17" r="13" stroke-width="2" stroke="#31c27c" fill="none" transform = 'matrix(0,-1,1,0,0,34)' stroke-dasharray="0 1069"></circle>
              </svg>  
              <img class='pauseOrPlay' :src="playing?require('../images/播放.png'):require('../images/暂停.png')" @click.stop="togglePlaying">
            </div>
            <img class="nextplay icon" src="../images/下一首.png" @click.stop="nextMusic">
            <img class='playList icon' src="../images/播放列表.png" @click.stop="showList">
          </div>
        </div>
      </div>
      <div class="mini-list"  v-show="newlist.length>0" @click.stop="closelist">
          <div class="list-wrapper">
            <header>
              <div class="list-left">
                <a class="operatror" :class="{sequence:mode === 0,loop:mode === 1,random:mode === 2}" @click.stop="changeMode"></a>
                <span class="icon-mode">{{modetext}}</span>
              </div>
              <img class="list-right" src="../images/删除icon.png" @click.stop="removelistAll">
            </header>
            <div class="item-wrapper" ref="itemWrapper">
              <div class="list-box">
                <div class="item-list" v-for="(item,index) in newlist" >
                  <li class="item" @click.stop="selectItem(item,index)">
                    <span class="songname">{{item.name}}</span>
                    <span class="singername">- {{item.singer.name}}</span>
                  </li>
                  <span class="delet" @click.stop="removeitem(item,index)">X</span>
                </div>
              </div>
            </div>
          </div>
      </div>
      <audio :src="currentSong.url" ref="audio" @canplay="ready" @error="error" @timeupdate="updateTime" @ended="musicEnded"></audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import { playMode } from "../../common/js/config.js";
import { getRandomArr } from "../../common/js/util.js";
import lyricParse from 'lyric-parser'
import BScroll from 'better-scroll'
export default {
  data() {
    return {
      toLove: true,
      songReady: false,
      currentTime: 0,
      passed: true,
      currentLyric:null,
      currentLineNum:0, //当前歌词高亮
      showlyric:false,
      newlist:[]
    };
  },
  components: {},
  computed: {
    ...mapGetters([
      "fullScreen",
      "playlist",
      "currentSong",
      "mode",
      "playing",
      "currentIndex",
      "sequenceList"
    ]),
    addRotate() {
      return this.playing && this.songReady ? "rotate" : "rotate pause";
    },
    iconMode() {
      return this.mode === playMode.sequence
        ? "icon-sequence"
        : this.mode === playMode.loop
          ? "icon-loop"
          : "icon-random";
    },
    modetext(){
      return this.mode === playMode.sequence
      ?'顺序播放'
      :this.mode === playMode.loop
      ?'单曲循环'
      :'随机播放'
    }
  },
  methods: {
    back() {
      this.setFullScreen(false);
    },
    openMiniPlay() {
      this.setFullScreen(true);
    },
    ...mapMutations({
      setFullScreen: "SET_FULL_SCREEN",
      setPlayingState: "SET_PLAYING_STATE",
      setCurrentIndex: "SET_CURRENT_INDEX",
      setPlayMode: "SET_PLAY_MODE",
      setPlayList: "SET_PLAYLIST",
      setPlayingState: 'SET_PLAYING_STATE'
    }),
    selectItem(item,index){
      this.selectPlay({
          list: this.playlist,
          index
      })
        this.setFullScreen(true);
    },
    ...mapActions([
        'selectPlay'
    ]),
    getSongDuration(s) {
      return Math.floor(s / 60) + ":" + ((s % 60) / 100).toFixed(2).slice(-2);
    },
    togglePlaying() {
      if (!this.songReady) {
        return;
      }
      this.setPlayingState(!this.playing);
    },
    prevMusic() {
      if (!this.songReady) {
        return;
      }
      let index = this.currentIndex - 1;
      if (index < 0) {
        index = this.playlist.length;
      }

      if(this.mode === playMode.loop){
        let index = this.currentIndex  //单曲循环模式 
      }else{
        let index = this.currentIndex - 1;
        if (index < 0) {
          index = this.playlist.length;
        }
      }
      this.setCurrentIndex(index);
      if (!this.playing) {
        this.togglePlaying();
      }
      this.songReady = false;
    },
    nextMusic() {
      if (!this.songReady) {
        return;
      }
      let nextIndex = 0
      if(this.mode === playMode.loop){
        nextIndex = this.currentIndex  //单曲循环模式 
      }else{
        nextIndex = this.currentIndex + 1;
        if(nextIndex === this.playlist.length){
            nextIndex = 0;
        }
      }
      this.setCurrentIndex(nextIndex);
      if (!this.playing) {
        this.togglePlaying();
      }
      this.songReady = false;
    },
    ready() {
      this.songReady = true;
    },
    error() {
      this.songReady = true;
    },
    updateTime(e) {
      this.currentTime = e.target.currentTime;
    },
    startProgress(e) {
      this.touch.initiated = true;
      this.touch.startX = e.targetTouches[0].pageX;
      this.touch.left = this.$refs.progress.clientWidth; //原始的位置
    },
    moveProgress(e) {
      if (!this.touch.initiated) { 
        return;
      }
      const moveWidth = e.targetTouches[0].pageX - this.touch.startX; //得到移动的距离
      const progressWidth = Math.min(
        this.$refs.barInner.clientWidth,
        Math.max(0, this.touch.left + moveWidth)
      ); //移动btn
      this.$refs.progress.style.width = Math.max(progressWidth,0) + "px";
      this.$refs.audio.pause();
    },
    endProgress(e) {
      let lastEnd = e.changedTouches[0].pageX;
      let movescale = (lastEnd - this.touch.startX) / this.$refs.barInner.clientWidth; // 移动的比例
      this.$refs.audio.currentTime = Math.max(this.$refs.audio.currentTime + parseInt(movescale * this.currentSong.duration),0) //跳转到指定的音频位置
      if (!this.$refs.audio.paused) {
        this.togglePlaying()
      }
      if (this.$refs.audio.paused) {
        this.togglePlaying()
      }
      this.touch.initiated = false
    },

    //改变播放模式
    changeMode() {
      const newMode = (this.mode + 1) % 3;
      this.setPlayMode(newMode);
      let emptyList = null;
      if (this.mode === playMode.random) {
        //随机播放模式
        emptyList = getRandomArr(this.sequenceList);
      }else{
        emptyList = this.sequenceList
      }
      this.resetCurrentIndex(emptyList);
      //this.setPlayList(emptyList);
    },
    resetCurrentIndex(list) {
      //获取当前播放音乐的index
      let index = list.findIndex(item => {
        return item.id = this.currentSong.id
      });
      this.setCurrentIndex(index);
    },
    //音乐播放完后切换下一首
    musicEnded(){
      if(this.mode === playMode.loop){
        this.loop()  //单曲循环模式 
      }else{
        this.nextMusic()
      }
    },
    //单曲循环模式
    loop(){
      console.log('单曲循环模式')
      this.setCurrentIndex(this.currentIndex)
    },
    getLyric(){
      this.currentSong.getLyric().then((lyric)=>{
        this.currentLyric = new lyricParse(lyric,this.handleLyric)
        if(this.playing){
          this.currentLyric.play()
        }
        this.$nextTick(()=>{
          this._initScroll()
        })
      })
    },
    handleLyric({lineNum,txt}){
      this.currentLineNum = lineNum
      if(lineNum > 5){
        let lineElement = this.$refs.lyricLine[lineNum - 5]
        this.lyricScroll.scrollToElement(lineElement, 1000)
      }else{
        this.lyricScroll.scrollToElement(0,10,1000)
      }
    },
    toggleRotate(){
      this.showlyric = !this.showlyric
    },
    _initScroll(){
        this.lyricScroll = new BScroll(this.$refs.lyricBox, {})
    },
    //展示播放列表
    showList(){
      this.newlist = this.playlist
      this.$nextTick(()=>{
        this.itemScroll = new BScroll(this.$refs.itemWrapper,{})
      })
      
    },
    closelist(){
      this.newlist=[]
    },
    removelistAll(){
        this.newlist= []
        this.setPlayingState(false)
        this.setPlayList([])
        return
    },
    removeitem(item,index){
      this.playlist.splice(index,1)
      this.setPlayingState(false)
    }
  },
  created() {
    this.touch = {};
  },
  watch: {
    currentSong(newsong, oldsong) {
      if(this.playlist.length === 0){
        return
      }
      if (newsong.id === oldsong.id) {
        return;
      }
      if(this.currentLyric){
        this.currentLyric.stop()
      }
      this.$nextTick(() => {
        this.$refs.audio.play();
        this.getLyric()
      });
    },
    playing(isplay) {
      const audio = this.$refs.audio;
      this.$nextTick(() => {
        isplay ? audio.play() : audio.pause();
        if(this.currentLyric === null){
          return
        }
        isplay ? this.currentLyric.play() : this.currentLyric.stop()
      });
    },
    currentTime() {
      if (!this.touch.initiated) {
        let widthScale = this.currentTime / this.currentSong.duration; //当前播放进度和总时长的比例关系

        let barWidth = this.$refs.barInner.clientWidth; //播放条长度
        if (this.$refs.progress.style.width > barWidth) {
          this.$refs.progress.style.width = barWidth + "px";
        }
        this.$refs.progress.style.width =
          parseFloat(widthScale * barWidth).toFixed(2) + "px";
      }
      if (!this.fullScreen) {
        let widthScale = this.currentTime / this.currentSong.duration;
        let perimeter = Math.PI * 2 * 20;
        this.$refs.audioStroke.setAttribute(
          "stroke-dasharray",
          perimeter * widthScale + " " + perimeter * (1 - widthScale)
        );
      }
    }
  }
};
</script>
<style lang='scss' scoped>
  p {
    margin: 0;
  }
  ul,li {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .player {
    .fullPlay {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 90;
      width: 100%;
      bottom: 0;
      background: #222;
      .playerBg {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: 0.6;
        filter: blur(20px);
        img {
          width: 100%;
          height: 100%;
        }
      }
      .back {
        text-align: left;
        padding-left: 20px;
        padding-top: 15px;
        img {
          width: 25px;
          height: 25px;
        }
      }
      .header {
        color: rgba(225,225,225,.8);
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        .songname {
          font-size: 18px;
          margin-bottom: 5px;
          color: #ffffff;
        }
        .singername {
          font-size: 14px;
        }
      }
      .rotateBox {
        position: fixed;
        top: 180px;
        bottom: 230px;
        width: 100%;
        .rotate-wrapper {
          width: 100%;
          height: 100%;
          overflow: hidden;
          .imgBox {
            width: 80%;
            height: 100%;
            margin: 0 auto;

            .img-wrapper {
              .rotate {
                animation: musicrotating 18s linear infinite;
              }
              @keyframes musicrotating {
                from {
                  transform: rotate(0);
                }
                to {
                  transform: rotate(360deg);
                }
              }
              .pause {
                animation-play-state: paused;
              }
              .musicBg {
                width: 93%;
                height: 93%;
                border-radius: 50%;
                border: 10px solid hsla(0, 0%, 100%, 0.1);
              }
            }
          }
          .lyric-box{
            position: relative;
            height: 100%;
            .lyric-wrapper{
              .lyric-ct{
                margin-top: 95px;
                .text{
                  font-family: poppin,Tahoma,Arial,\5FAE\8F6F\96C5\9ED1,sans-serif;
                  color: rgba(225,225,225,.8);
                  margin: 0 40px;
                  margin-bottom: 10px;
                  font-size: 15px;
                  text-align: center;
                }
                .currentline{
                  color: #31c27c;
                }
              }
            }
          }
        }
      }
      .bottomPlay {
        position: fixed;
        bottom: 120px;
        width: 100%;
        .progress-wrapper {
          margin: 0 30px;
          display: flex;
          align-items: center;
          color: #fff;
          .time-left {
            height: 17px;
          }
          .progress-bar-wrapper {
            flex: 1;
            margin: 0 6px;
            overflow-x: hidden;
            overflow-y: auto;
            width: 100%;
            padding-top: 4px;
            padding-bottom: 4px;
            .progress-bar {
              .bar-inner {
                height: 6px;
                background: #5a5858cf;
                position: relative;
                display: flex;
                align-items: center;
                .progress {
                  background: #4caf50;
                  height: 100%;
                }
                .progress-btn-wrapper {
                  font-size: 0;
                  .progress-btn {
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    background: yellow;
                    border-radius: 50%;
                    border: 3px solid #fff;
                  }
                }
              }
            }
          }
          .time-right {
            height: 17px;
          }
        }
        .operators {
          .operators-wrapper {
            display: flex;
            margin: 0 28px;
            margin-top: 20px;
            justify-content: space-between;
            .operatror {
              display: inline-block;
              height: 30px;
              width: 30px;
              background-size: cover;
              background-repeat: no-repeat;
            }
            .sequence {
              background-image: url("../images/顺序播放.png");
            }
            .loop {
              background-image: url("../images/单曲循环.png");
            }
            .random {
              background-image: url("../images/随机播放.png");
            }
            .playPrev {
              background-image: url("../images/上一首.png");
            }
            .playNext {
              background-image: url("../images/下一首.png");
            }
            .pause {
              background-image: url("../images/暂停.png");
            }
            .play {
              background-image: url("../images/播放.png");
            }
            .love {
              background-image: url("../images/喜欢-on.png");
            }
            .tolove {
              background-image: url("../images/喜欢.png");
            }
          }
        }
      }
    }
    .miniPlay {
      position: fixed;
      bottom: 0;
      left: 0;
      background: #333;
      width: 100%;
      .miniPlay-wrapper {
        display: flex;
        justify-content: space-between;
        padding: 8px 20px;
        
        .miniPlay-left {
          display: flex;
          color: #fff;
          .miniLogo {
            height: 42px;
            width: 42px;
            border-radius: 50%;
            margin-right: 12px;
            animation: musicrotating 18s linear infinite;
          }
          @keyframes musicrotating {
            from {
              transform: rotate(0);
            }
            to {
              transform: rotate(360deg);
            }
          }
          .pause {
            animation-play-state: paused;
          }
          .miniPlaydes {
            .songname {
              font-size: 15px;
              margin-bottom: 3px;
              color: #e0dede;
            }
            .singername {
              font-size: 13px;
              color: #a59c9c;
            }
          }
        }
        .miniPlay-right {
          display: flex;
          align-items: center;
          .playBox {
            position: relative;
            .pauseOrPlay {
              width: 18px;
              height: 18px;
              position: absolute;
              top: 8px;
              left: 9px;
            }
          }
          .playList {
            width: 28px;
            height: 28px;
            
          }
          .nextplay{
            margin: 0 12px;
            width: 30px;
            height: 30px;
          }
        }
      }
    }
    .mini-list{
      position: fixed;
      top: 0;
      bottom: 0;
      width: 100%;
      background: #33333382;
        .list-wrapper{
          position: fixed;
          width: 100%;
          bottom: 0;
          left: 0;
          top: 300px;
          background: #ffffff;
          z-index: 3;
          overflow: hidden;
          border-top-left-radius:15px;
          border-top-right-radius:15px;
          header{
            display: flex;
            justify-content: space-between;
            padding: 8px 20px;
            border-bottom: 1px solid #cccccc61;
            align-items: center;
            .list-left{
              display: flex;
              align-items: center;
              .operatror{
                display: inline-block;
                height: 30px;
                width: 30px;
                background-size: cover;
                background-repeat: no-repeat;
                margin-right: 10px;
              }
              .sequence {
                background-image: url("../images/顺序播放.png");
              }
              .loop {
                background-image: url("../images/单曲循环.png");
              }
              .random {
                background-image: url("../images/随机播放.png");
              }
              .icon-mode{}
            }
            .list-right{
              height: 20px;
              width: 20px;
            }
          }
          .item-wrapper{
            height: 100%;
            overflow: hidden;
            .list-box{
              .item-list{
                display: flex;
                justify-content: space-between;
                padding: 8px 20px;
                border-bottom: 1px solid #cccccc61;
                align-items: center;
                .item{
                  .songname{
                    font-size: 16px;
                  }
                  .singername{
                    font-size: 12px;
                    color: #9e9b9bcc;
                  }
                }
                .delet{
                  color: #333;
                }
              }
            }
          }
          
        }
      
    }
    
  }
</style>