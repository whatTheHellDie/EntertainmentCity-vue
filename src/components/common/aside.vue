<template>
  <div class="left-navbar">
    <dl>
      <dt class="cursor" :class="{ active: $route.name == 'accountIndex' }" @click="$router.push({ name: 'accountIndex' })">
        <icon-svg name="index1" class="site-sidebar__menu-icon"></icon-svg>
        <span>账户首页</span>
      </dt>
    </dl>
    <dl>
      <dt>
        <icon-svg name="account1" class="site-sidebar__menu-icon"></icon-svg>
        <span>我的账户</span>
      </dt>
      <dd v-for="item in sideNav.account" :class="{active:$route.name == item.routeName }" @click="$router.push({ name: item.routeName })">{{item.name}}</dd>
    </dl>
    <dl>
      <dt @click="showList(1)">
        <icon-svg name="order1" class="site-sidebar__menu-icon"></icon-svg>
        <span>订单管理</span>
      </dt>
      <dd v-for="item in sideNav.order" :class="{active:$route.name == item.routeName }" @click="$router.push({ name: item.routeName })">{{item.name}}</dd>
    </dl>
    <!-- <dl>
      <dt>资金管理<i class="el-submenu__icon-arrow el-icon-arrow-down"></i></dt>
      <dd v-for="item in sideNav.fund" :class="{active:$route.name == item.routeName }" @click="turn(item.routeName)">{{item.name}}</dd>
    </dl> -->
    <dl class="show-phone" style="padding-top: 10px;" @click="logout()">
      <dd>注销</dd>
    </dl>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        num1: 1,
        listShow:[false,true,true],
        sideNav: {
          account: [ //账户管理
                        {
                          name: "个人信息",
                          routeName: "personalInformation"
                        },
//                      {
//                        name: "实名认证",
//                        routeName: "realNameAuthentication"
//                      },
                        {
                          name: "我的推荐",
                          routeName: "myRecommendation"
                        },
                        {
                          name: "资金明细",
                          routeName: "CapitalDetails"
                        },
//                      {
//                        name: "设置支付密码",
//                        routeName: "setPaymentPassword"
//                      },
//                      {
//                        name: "忘记支付密码",
//                        routeName: "forgetPaymentPassword"
//                      },
//                      {
//                        name: "重置支付密码",
//                        routeName: "resetPaymentPassword"
//                      },
//                      {
//                        name: "重置登录密码",
//                        routeName: "resetLoginPassword"
//                      },
          ],
          order: [ //订单管理
            // {
            //   name: "购买订单",
            //   routeName: "buyPackageOrder"
            // },
            // {
            //   name: "提现订单",
            //   routeName: "withdrawalOrder"
            // },
            {
              name: "入股订单",
              routeName: "shareOrder"
            }
          ],
          // fund: [ //资金管理
          //   {
          //     name: "提现",
          //     routeName: "withdrawal"
          //   },
          //   {
          //     name: "资金明细",
          //     routeName: "CapitalDetails"
          //   }
          // ],
        }
      }
    },
    computed: {
      iconName() {
        return this.$route.name == 'accountIndex' ? "index1" : "index"
      },
      iconName1() {
        return this.$route.name == 'personalInformation' ? "person1" : "person";
      }
    },
    methods: {
      showList(index){
        console.log(this.listShow)
        this.listShow[index]=!this.listShow[index]
      },
      turn(name) {
        if(name == "chargeCoin") {
          this.getPersonInfo()
          return false;
        } else {
          this.$router.push({
            name: name
          })
        }
      },
      getPersonInfo() {
        this.$http({
          url: this.$http.adornUrl('/user/au/query/one'),
          method: 'get'
        }).then(({
          data
        }) => {
          if(data && data.code === '0000') {
            if(!data.data) {
              return;
            }
            if(data.data.auth == 1) {
              this.$confirm('您还没有实名认证', '提示', {
                confirmButtonText: '去认证',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.$router.push({
                  name: 'realNameAuthentication'
                })
              });
            } else if(data.data.auth == 2) {
              this.$alert('您还在认证中，请验证通过后再试', '提示', {
                confirmButtonText: '确认',
              });
            } else if(data.data.auth == 3) {
              this.$router.push({
                name: 'chargeCoin'
              })
            } else {
              this.$alert('认证失败，请重新认证', '提示', { confirmButtonText: '确定' })
              // this.$confirm('认证失败，请重新认证', '提示', {
              //   confirmButtonText: '去认证',
              //   cancelButtonText: '取消',
              //   type: 'warning'
              // }).then(() => {
              //   this.$router.push({
              //     name: 'realNameAuthentication'
              //   })
              // });
            }
          } else {
            // this.$message.error(data.msg)
            this.$message.error('获取实名认证信息失败')
          }
        }).catch(({
          error
        }) => {
          this.dataListLoading = false
          this.$message.error(error)
        })
      },
      logout() {
        this.$http({
          url: this.$http.adornUrl('/user/logout'),
          method: 'get'
        }).then(({
          data
        }) => {
          if(data && data.code === '0000') {
            this.$cookie.delete('casino-front-token')
            this.$message.success('注销成功')
            this.loginStatus = '0'
            this.$router.push({
              name: 'login'
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    },
    mounted() {}
  }
</script>

<style>
  /* .left-navbar dt.active {
    color: #e2231a;
  }

  .left-navbar dd.active {
    color: #e2231a;
  } */
</style>
