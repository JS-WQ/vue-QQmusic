import jsonp from '../common/js/jsonp'
import {commonParams} from './config'
import axios from 'axios'

import {getLyric} from '../api/lyric'
import {Base64} from 'js-base64'
import {rejects} from 'assert';

export function getSearch(name,page){
    const url = '/tosearch'
    const data = Object.assign({},commonParams,{
        g_tk: 590641488,
        format: 'json',
        inCharset: 'utf-8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'h5',
        needNewCode: 1,
        w: name,
        zhidaqu: 1,
        catZhida: 1,
        t: 0,
        flag: 1,
        ie: 'utf-8',
        sem: 1,
        aggr: 0,
        perpage: 20,
        n: 20,
        p: page,
        remoteplace: 'txt.mqq.all',
        _: 1541680033051
    })
    return axios.get(url,{
        params: data
    }).then((res)=>{
        return Promise.resolve(res.data)
    })
}

export default class Song{
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

export function creatSearchSong(data,vkey){
    return new Song({
        id:data.songid,
        mid:data.songmid,
        singer:data.singer[0],
        name:data.songname,
        album:data.albumname,
        duration:data.interval,
        image:`https://y.gtimg.cn/music/photo_new/T002R300x300M000${data.albummid}.jpg?max_age=2592000`,
        url: `http://dl.stream.qqmusic.qq.com/C400${data.songmid}.m4a?fromtag=38&guid=5931742855&vkey=${vkey}`

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
