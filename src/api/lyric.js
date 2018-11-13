import jsonp from '../common/js/jsonp'
import {
   commonParams,
} from './config'
import axios from 'axios'

export function getLyric(mid){
    const url ='/lyric'
    const data = Object.assign({},commonParams,{
        callback:'MusicJsonCallback_Irc',
        songmid:mid,
        pcachetime: +new Date(),
        platform:'yqq',
        hostUin:0,
        needNewCode:0,
        g_tk:590641488,
        format:'json'
    })
    return axios.get(url,{
        params: data
    }).then((res)=>{
        return Promise.resolve(res.data)
    })
}
