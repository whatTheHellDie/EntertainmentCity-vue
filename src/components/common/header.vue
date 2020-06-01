<template>
  <header>
    <div class="wrap" style="background-image:url(/static/img/header-bg.jpg);background-repeat:no-repeat ;">
      <div class="index-top">
        <div class="wrap">
          <div class="login-box clearfix">
            <div v-if="loginStatus==0"><span class="span cursor" @click="$router.push({ name: 'login' })">登录</span><span class="hen-line"></span><span class="span cursor " @click="$router.push({ name: 'register' })">注册</span></div>
            <div v-if="loginStatus==1">尊敬的<span class="default">{{loginUserNumber}}</span>用户，欢迎您来到皇家娱乐城！
              <span class="logout cursor default" @click="logout()">注销</span>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="navbar clearfix">
          <img src="/static/img/logo.png" alt="logo" @click="$router.push({name:'index'})" class="logo" />
          <dl class="clearfix">
            <dd class="cursor" :class="{active:myNavIndex==0}" @click="$router.push({name:'index'})">首页</dd>
            <dd v-if="navJudge" class="cursor" :class="{active:myNavIndex==1}" @click="toAccount">我的账户</dd>
            <dd class="active" v-else @click="toggleTab"><button type="button" id="switch" class="navbar-toggle"><span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span></button></dd>
          </dl>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
  export default {
    data() {
      return {
        loginStatus: '0',
        loginUserNumber: window.sessionStorage.getItem('userNumber')
      }
    },
    props: ['navIndex'],
    computed: {
      myNavIndex() {
        if(!this.navIndex) {
          return 0
        } else {
          return this.navIndex
        }
      },
      navJudge() {
        var userAgent = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent) ? 'phone' : 'pc';
        if(this.$route.meta.status != "noAccount" && userAgent == "phone") {

          return false;
        }

        return true;
      }
    },
    created() {
      if(this.$cookie.get('casino-front-token') && window.sessionStorage.getItem('userNumber')) {
        this.loginStatus = 1
      } else {
        if(this.$route.meta.status != 'noAccount') {
          //没有登录不能进个人中心,跳到登录
          this.$router.push({
            name: 'login'
          })
        }
      }
      if(this.$route.name == 'register' || this.$route.name == 'login') {
        this.loginStatus = 2
      }
    },
    methods: {
      toggleTab() {
        let leftBar = document.querySelectorAll(".left-navbar")[0]
        let status = leftBar.style.display;
        if(status && status == 'block') {
          leftBar.style.display = "none";
          return false;
        }
        leftBar.style.display = "block"

      },
      logout() {
        this.$http({
          url: this.$http.adornUrl('/users/logout'),
          method: 'get'
        }).then(({
          data
        }) => {
          if (data && data.code === '0000') {
            window.sessionStorage.removeItem('userNumber')
            this.$cookie.delete('casino-front-token')
            this.$message.success('注销成功')
            this.loginStatus = '0'
            this.$router.push({
              name: 'login'
            })
          } else if(data && data.code === '1036'){
            window.sessionStorage.removeItem('userNumber')
            this.$cookie.delete('casino-front-token')
            this.$message.success('注销成功')
            this.loginStatus = '0'
            this.$router.push({
              name: 'login'
            })
          } else {
            this.$message.error(data.message)
          }
        })
      },
      toAccount() {
        if(this.$cookie.get('casino-front-token') && window.sessionStorage.getItem('userNumber')) {
          this.$router.push({
            name: 'accountIndex'
          })
        } else if(window.sessionStorage.getItem('userNumber')) {
          this.$confirm('您还没有登录，请登录', '提示', {
            confirmButtonText: '去登录',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$router.push({
              name: 'login'
            })
          })
        } else {
          this.$confirm('您还没有登录，请登录', '提示', {
            confirmButtonText: '去登录',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$router.push({
              name: 'login'
            })
          })
        }
      }
    }
  }
</script>

<style>
.navbar dd{background: url(/static/img/nav-bg.jpg);}
</style>
