import jsonp from '../common/js/jsonp'
import {commonParams,options} from './config'

export function getSinger(id){
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
    const data = Object.assign({},commonParams,{
        g_tk: 5381,
        loginUin: 0,
        hostUin: 0,
        format: 'jsonp',
        notice: 0,
        platform: 'yqq',
        needNewCode: 0,
        order: 'listen',
        num: 40,
        begin: 0,
        songstatus: 1,
        singermid: id
    })
    return jsonp(url,data,options)
}

export function getSingerdes(id,num,begin){
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
    const data = Object.assign({},commonParams,{
        singerid: id,
        g_tk: 5381,
        uin: 0,
        format: 'json',
        inCharset: 'utf-8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'h5page',
        needNewCode: 1,
        order: 'listen',
        from: 'h5',
        num: num,
        begin: begin
    })
    return jsonp(url,data,options)
}