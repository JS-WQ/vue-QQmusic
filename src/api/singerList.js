import jsonp from '../common/js/jsonp'
import {
  commonParams,
  options
} from './config'

import {getLyric} from '../api/lyric'
import {Base64} from 'js-base64'
import {rejects} from 'assert';

export function getSingerList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    platform: 'yqq',
    g_tk: 5381,
    loginUin: '0',
    format: 'jsonp',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    needNewCode: 0
  })
  return jsonp(url, data, options)
}

export function getSongImg(name){
  const url = `https://y.gtimg.cn/music/photo_new/T002R300x300M000${name}.jpg?`
  const data = Object.assign({},commonParams,{
    max_age: 2592000
  })
}

export function getSongurl(name){
  const url =`http://dl.stream.qqmusic.qq.com/C400${name}.m4a?guid=6948956600&vkey=E15336DF8D953BD7087243D55DBE1CA6DAB4EBD22D01801819BC099864FDA47998D2BC02570CC183A5BFF186D0B89A5D082DD80F953D455E`
  const data = Object.assign({}.commonParams,{
    uin : 0,
    fromtag : 38
  })
  return jsonp(url, data, options)
}

export default class Song {
	constructor({id, mid, singer, name, album, duration, image, url}){
		this.id = id
		this.mid = mid
		this.name = name
		this.singer = singer
		this.album = album
		this.duration = duration
		this.image = image
		this.url = url		
  }
  getLyric(){
    if(this.lyric){
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve,reject) =>{
      getLyric(this.mid).then((res)=>{
        if(res.code === 0){
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        }
      })
    })
    
  }
}

export function createSong(musicData){
  return new Song({
    id:musicData.songid,
    mid:musicData.songmid,
    singer:musicData.singer[0],
    name:musicData.songname,
    album:musicData.albumname,
    duration:musicData.interval,
    image:`https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url:`http://ws.stream.qqmusic.qq.com/C100${musicData.songmid}.m4a?fromtag=0&guid=126548448`
  })
}

export function creatHotlistSong(musicData,vkey){
  return new Song({
    id:musicData.album.id,
    mid:musicData.mid,
    singer:musicData.singer[0],
    name:musicData.name,
    album:musicData.album.name,
    duration:musicData.interval,
    image:`https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.album.mid}.jpg?max_age=2592000`,
    url: `http://dl.stream.qqmusic.qq.com/C400${musicData.mid}.m4a?fromtag=38&guid=5931742855&vkey=${vkey}`
  })
}

export function getSongVkey (songmid) { // 获取歌曲的vkey
  const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg'
  const data = Object.assign({}, {
    callback: 'musicJsonCallback',
    loginUin: 3051522991,
    format: 'jsonp',
    platform: 'yqq',
    needNewCode: 0,
    cid: 205361747,
    uin: 3051522991,
    guid: 5931742855,
    songmid: songmid,
    filename: `C400${songmid}.m4a`
  })
  return jsonp(url, data)
}

export function creatRanklistSong(musicData,vkey){
  return new Song({
    id:musicData.albumid,
    mid:musicData.songmid,
    singer:musicData.singer[0],
    name:musicData.songname,
    album:musicData.albumname,
    duration:musicData.interval,
    image:`https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://dl.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?fromtag=38&guid=5931742855&vkey=${vkey}`
  })
}