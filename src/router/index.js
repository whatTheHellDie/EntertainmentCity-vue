/**
 * 全站路由配置
 *
 * 建议:
 * 1. 代码中路由统一使用name属性跳转(不使用path属性)
 */
import Vue from 'vue'
import Router from 'vue-router'
import http from '@/utils/httpRequest'
import { isURL } from '@/utils/validate'
import { clearLoginInfo } from '@/utils'

Vue.use(Router)

// 开发环境不使用懒加载, 因为懒加载页面太多的话会造成webpack热更新太慢, 所以只有生产环境使用懒加载
const _import = require('./import-' + process.env.NODE_ENV)

// 全局路由(无需嵌套上左右整体布局)
const globalRoutes = [
  { path: '/index', component: _import('common/index'), name: 'index', meta: { title: '易用链首页',status:"noAccount" } },
  { path: '/404', component: _import('common/404'), name: '404', meta: { title: '404未找到' } },
  { path: '/login', component: _import('common/login'), name: 'login', meta: { title: '登录',status:"noAccount" } },
  { path: '/register', component: _import('common/register'), name: 'register', meta: { title: '注册',status:"noAccount" } },
  { path: '/forgetPassword', component: _import('common/forgetPassword'), name: 'forgetPassword', meta: { title: '忘记密码',status:"noAccount" } },
  { path: '/newsDetails', component: _import('common/newsDetails'), name: 'newsDetails', meta: { title: '新闻详情',status:"noAccount" } },
  //购买
  { path: '/buy-vip-Package', component: _import('purchase/buy-vip-Package'), name: 'buy-vip-Package', meta: { title: '购买vip套餐',status:"noAccount" } },
  { path: '/buyPackage', component: _import('purchase/buyPackage'), name: 'buyPackage', meta: { title: '购买套餐',status:"noAccount" } },
  { path: '/buyPackage-Pay', component: _import('purchase/buyPackage-Pay'), name: 'buyPackage-Pay', meta: { title: '支付页面',status:"noAccount" } },
  { path: '/buyPackageStatus', component: _import('purchase/buyPackageStatus'), name: 'buyPackageStatus', meta: { title: '支付页面',status:"noAccount" } },
   //订单
  { path: '/shareOrder', component: _import('order/shareOrder'), name: 'shareOrder', meta: { title: '入股订单' } },
  { path: '/shareOrderDetail', component: _import('order/shareOrderDetail'), name: 'shareOrderDetail', meta: { title: '入股订单详情' } },
  { path: '/buyPackageOrder', component: _import('order/buyPackageOrder'), name: 'buyPackageOrder', meta: { title: '购买订单' } },
  //账户

  { path: '/accountIndex', component: _import('account/index'), name: 'accountIndex', meta: { title: '账户首页' } },
  { path: '/personalInformation', component: _import('account/personalInformation'), name: 'personalInformation', meta: { title: '个人信息' } },
  { path: '/myRecommendation', component: _import('account/myRecommendation'), name: 'myRecommendation', meta: { title: '我的推荐' } },
  { path: '/CapitalDetails', component: _import('account/CapitalDetails'), name: 'CapitalDetails', meta: { title: '资金明细' } },
  { path: '/realNameAuthentication', component: _import('account/realNameAuthentication'), name: 'realNameAuthentication', meta: { title: '设置支付密码' } },
  { path: '/changeBankcard', component: _import('account/changeBankcard'), name: 'changeBankcard', meta: { title: '更换银行卡' } },
  { path: '/address', component: _import('account/address'), name: 'address', meta: { title: '地址信息' } },
  { path: '/setPaymentPassword', component: _import('account/setPaymentPassword'), name: 'setPaymentPassword', meta: { title: '实名认证' } },
  { path: '/forgetPaymentPassword', component: _import('account/forgetPaymentPassword'), name: 'forgetPaymentPassword', meta: { title: '设置支付密码' } },
  { path: '/resetPaymentPassword', component: _import('account/resetPaymentPassword'), name: 'resetPaymentPassword', meta: { title: '重置支付密码' } },
  { path: '/resetLoginPassword', component: _import('account/resetLoginPassword'), name: 'resetLoginPassword', meta: { title: '重置登录密码' } },
  { path: '/changePhone', component: _import('account/changePhone'), name: 'changePhone', meta: { title: '更换手机' } },
  //资金管理
  { path: '/withdrawal', component: _import('order/withdrawal'), name: 'withdrawal', meta: { title: '提现' } },
  { path: '/withdrawalOrder', component: _import('order/withdrawalOrder'), name: 'withdrawalOrder', meta: { title: '提现订单' } },
]

// 主入口路由(需嵌套上左右整体布局)
const mainRoutes = {
  path: '/',
  component: _import('main'),
  name: 'main',
  redirect: { name: 'index' },
  meta: { title: '主入口整体布局' },
  children: [
    // 通过meta对象设置路由展示方式
    // 1. isTab: 是否通过tab展示内容, true: 是, false: 否
    // 2. iframeUrl: 是否通过iframe嵌套展示内容, '以http[s]://开头': 是, '': 否
    // 提示: 如需要通过iframe嵌套展示内容, 但不通过tab打开, 请自行创建组件使用iframe处理!
    { path: '/home', component: _import('common/home'), name: 'home', meta: { title: '首页' } },


  ],
  beforeEnter (to, from, next) {
    let token = Vue.cookie.get('casino-front-token')
    if (!token || !/\S/.test(token)) {
      clearLoginInfo()
      next({ name: 'login' })
    }
    if (to.meta.title) {
      document.title = to.meta.title
    }
    next()
  }
}

const router = new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  isAddDynamicMenuRoutes: false, // 是否已经添加动态(菜单)路由
  routes: globalRoutes.concat(mainRoutes)
})

router.beforeEach((to, from, next) => {
   // 添加动态(菜单)路由
  // 1. 已经添加 or 全局路由, 直接访问
  // 2. 获取菜单列表, 添加并保存本地存储
  // if (router.options.isAddDynamicMenuRoutes || fnCurrentRouteType(to, globalRoutes) === 'global') {
  //   next()
  // } else {
  //   http({
  //     url: http.adornUrl('/sys/menu/nav'),
  //     method: 'get',
  //     params: http.adornParams()
  //   }).then(({data}) => {
  //     if (data && data.code === 0) {
  //       fnAddDynamicMenuRoutes(data.menuList)
  //       router.options.isAddDynamicMenuRoutes = true
  //       sessionStorage.setItem('menuList', JSON.stringify(data.menuList || '[]'))
  //       sessionStorage.setItem('permissions', JSON.stringify(data.permissions || '[]'))
  //       next({ ...to, replace: true })
  //     } else {
  //       sessionStorage.setItem('menuList', '[]')
  //       sessionStorage.setItem('permissions', '[]')
  //       next()
  //     }
  //   }).catch((e) => {
  //     console.log(`%c${e} 请求菜单列表和权限失败，跳转至登录页！！`, 'color:blue')
  //     router.push({ name: 'login' })
  //   })
  // }
  // next()
  if(to.fullPath== '/index' || to.fullPath =='/login' || to.fullPath =='/register' || to.fullPath =='/forgetPassword'
    || to.fullPath == '/newsDetails'){
    next()
  }else{
    http({
      url: http.adornUrl('/users/info'),
      method: 'get',
      params: http.adornParams()
    }).then(({data}) => {
      if (data && data.code === '0000') {
        next()
      } else {
        router.push({ name: 'login' })
      }
    }).catch((e) => {
      router.push({ name: 'login' })
    })
  }
})

/**
 * 判断当前路由类型, global: 全局路由, main: 主入口路由
 * @param {*} route 当前路由
 */
function fnCurrentRouteType (route, globalRoutes = []) {
  var temp = []
  for (var i = 0; i < globalRoutes.length; i++) {
    if (route.path === globalRoutes[i].path) {
      return 'global'
    } else if (globalRoutes[i].children && globalRoutes[i].children.length >= 1) {
      temp = temp.concat(globalRoutes[i].children)
    }
  }
  return temp.length >= 1 ? fnCurrentRouteType(route, temp) : 'main'
}

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function fnAddDynamicMenuRoutes (menuList = [], routes = []) {
  var temp = []
  for (var i = 0; i < menuList.length; i++) {
    if (menuList[i].list && menuList[i].list.length >= 1) {
      temp = temp.concat(menuList[i].list)
    } else if (menuList[i].url && /\S/.test(menuList[i].url)) {
      menuList[i].url = menuList[i].url.replace(/^\//, '')
      var route = {
        path: menuList[i].url.replace('/', '-'),
        component: null,
        name: menuList[i].url.replace('/', '-'),
        meta: {
          menuId: menuList[i].menuId,
          title: menuList[i].name,
          isDynamic: true,
          isTab: true,
          iframeUrl: ''
        }
      }
      // url以http[s]://开头, 通过iframe展示
      if (isURL(menuList[i].url)) {
        route['path'] = `i-${menuList[i].menuId}`
        route['name'] = `i-${menuList[i].menuId}`
        route['meta']['iframeUrl'] = menuList[i].url
      } else {
        try {
          route['component'] = _import(`modules/${menuList[i].url}`) || null
        } catch (e) {}
      }
      routes.push(route)
    }
  }
  if (temp.length >= 1) {
    fnAddDynamicMenuRoutes(temp, routes)
  } else {
    mainRoutes.name = 'main-dynamic'
    mainRoutes.children = routes
    router.addRoutes([
      mainRoutes,
      { path: '*', redirect: { name: '404' } }
    ])
    sessionStorage.setItem('dynamicMenuRoutes', JSON.stringify(mainRoutes.children || '[]'))
    console.log('\n')
    console.log('%c!<-------------------- 动态(菜单)路由 s -------------------->', 'color:blue')
    console.log(mainRoutes.children)
    console.log('%c!<-------------------- 动态(菜单)路由 e -------------------->', 'color:blue')
  }
}

export default router
