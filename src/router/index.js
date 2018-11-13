import Vue from 'vue'
import VueRouter from 'vue-router'
import rank from '../components/rank/rank.vue'
import recommend from '../components/recommend/recommend.vue'
import search from '../components/search/search.vue'
import singer from '../components/singer/singer.vue'
import singerDetail from '../components/singer-detail/singer-detail.vue'
import hotlist from '../components/hotlist/hotlist.vue'
import ranklist from '../components/rank-list/rank-list.vue'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: recommend,
      children:[
        {
          path:':id',
          component:hotlist
        }
      ]
    },
    {
      path: '/rank',
      component: rank,
      children:[
        {
          path:':id',
          component:ranklist
        }
      ]
    },
    {
      path: '/search',
      component: search
    },
    {
      path: '/singer',
      component: singer,
      children:[
        {
          path:':id',
          component:singerDetail
        }
      ]
    }
  ]
})
