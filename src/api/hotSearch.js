import jsonp from '../common/js/jsonp'
import {commonParams,options} from './config'

export function getHotSearch(){
    const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
    const data = Object.assign({},commonParams,{
        g_tk: 5381,
        loginUin: 0,
        hostUin: 0,
        format: 'jsonp',
        notice: 0,
        platform: 'yqq',
        num:10,
        needNewCode: 0
    })
    return jsonp(url,data,options)
}