<template>
  <div class="slider" ref="slider">
      <div class="slider-group" ref="sliderGroup">
          <slot></slot>
      </div>
      <div class="dots">
        <span class="dota" v-for="(item,index) in dots" :class="{active:currentPageIndex === index}"></span>
      </div>
  </div>
</template>

<script>
import Bscroll from "better-scroll";
import {addClass} from '../../common/js/dom.js'
export default {
  data() {
    return {
      dots:[],
      currentPageIndex:0
    };
  },
  components: {},
  computed: {},
  mounted() {
    setTimeout(() => {
      this._setSilderWidth();
      this._initDots();
      this._initSlider();
      if(this.autoPlay){
        this._play()
      }
    }, 20);

    window.addEventListener('resize',()=>{
      if(!this.slider){
        return 
      }
      this._setSilderWidth(true)
      this.slider.refresh()
    })
  },
  methods: {
    _setSilderWidth(isResize) {
      //获取轮播图片的数量
      this.children = this.$refs.sliderGroup.children;

      let width = 0;
      // 获取图片的宽度
      let sliderWidth = this.$refs.slider.clientWidth;
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i]
        addClass(child, 'slider-item')
        child.style.width = sliderWidth + 'px'
        width += sliderWidth
      }
      if(this.loop && !isResize){
        width += 2*sliderWidth
      }
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    _initSlider() {
      this.slider = new Bscroll(this.$refs.slider,{
        scrollX:true,
        scrollY:false,
        momentum:false,
        snap:{
          loop:this.loop,
          threshold:0.3,
          speed:400
        }
        
      })
      this.slider.on('scrollEnd',()=>{
        let pageIndex = this.slider.getCurrentPage().pageX
        this.currentPageIndex = pageIndex
        if(this.autoPlay){
          clearTimeout(this.timer)
          this._play()
        }
      })

      
    },
    _initDots(){
      this.dots = new Array(this.children.length)
    },
    _play(){
      this.timer = setTimeout(()=>{
        this.slider.next(400)
      },this.interval)
    }
  },
  props: ["loop", "autoPlay", "interval"],
  destroyed(){
    clearTimeout(this.timer)
  }
};
</script>
<style lang='scss' scoped>
  .slider{
    position: relative;
    overflow: hidden;
    .slider-group{
      display: flex;
      .slider-item{
        a{
          width: 100%;
          img{
            width: 100%;
          }
        }
      }
    }
    .dots{
      display: flex;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 12px;
      .dota{
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: rgba(144,144,144,.8);
        border:1px solid #ccc;
        margin-right: 5px;
        }
      .active{
        width: 12px;
        border-radius: 5px;
        background: #fff;
      }
    }
  }
</style>