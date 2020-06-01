<template>
  <div class="body-grey">
    <main-body navIndex="1">
      <div slot="content">
        <div class="box-card2 zero-padding">
          <div class="box-body no-padding">
            <div class="index-i index-p">
              <div class="y-avatar">
                <img src="/static/img/profile.png" alt="" class="tou">
                <span></span>
              </div>
              <div class="title">
                <span class="hao">{{personInfo.userNumber}}</span>
                <div class="level">会员身份：{{memberLevel}}</div>
                <div class="level">推荐人：{{personInfo.referrerNumber}}</div>
              </div>
            </div>
            <div class="account-top">
              <div class="title">账户信息</div>
              <dl>
                <dd class="clearfix">
                  <icon-svg name="right" class="site-sidebar__menu-icon info-class" ></icon-svg>
                  <span class="span">手机号码</span><span class="pin">{{phoneShow}}</span>
                </dd>

                <dd class="clearfix" v-if="isAuthentic">
                  <icon-svg name="right" class="site-sidebar__menu-icon info-class" style="vertical-align: -2px;"></icon-svg>
                  <span class="span">实名认证</span><span class="pin">{{authenticText}}<span style="margin-left: 15px;">{{realNameShow}}</span><span style="margin-left: 15px;">{{idCardShow}}</span><div class="icon" style="background-image:url(/static/img/ic_certified.png);"></div></span>
                </dd>

                <dd class="rz clearfix" v-else>
                  <icon-svg name="warning" class="site-sidebar__menu-icon info-class" style="vertical-align: -2px;"></icon-svg>
                  <span class="span">实名认证</span><span class="pin active">{{authenticText}}</span>
                   <div class="gu-btn" @click="toAuthentication">认证</div>
                </dd>

                <dd class="clearfix">
                  <icon-svg name="right" class="site-sidebar__menu-icon info-class" style="vertical-align: -2px;"></icon-svg>
                  <span class="span">登录密码</span><span class="pin">已设置</span>
                  <div class="gu-btn reset" @click="$router.push({name:'resetLoginPassword'})">重置</div>
                </dd>
                <dd class="clearfix" v-if="noSetPass">
                  <icon-svg name="warning" class="site-sidebar__menu-icon info-class" style="vertical-align: -2px;"></icon-svg>
                  <span class="span">支付密码</span><span class="pin active">未设置</span>
                  <div class="gu-btn" @click="$router.push({name:'setPaymentPassword'})">设置</div>
                </dd>
                <dd class="clearfix" v-if="isSetPass">
                  <icon-svg name="right" class="site-sidebar__menu-icon info-class" style="vertical-align: -2px;"></icon-svg>
                  <span class="span">支付密码</span><span class="pin">已设置</span>
                  <div class="gu-btn reset" @click="$router.push({name:'resetPaymentPassword'})">重置</div>
                </dd>

                <dd class="clearfix" v-if="personInfo.whetherBinding == 0 || personInfo.whetherBinding == null">
                  <icon-svg name="warning" class="site-sidebar__menu-icon info-class" style="vertical-align: -2px;"></icon-svg>
                  <span class="span">交易所账号</span><span class="pin active">未绑定</span>
                  <div class="gu-btn" @click="toBind">绑定</div>
                </dd>
                <dd class="clearfix" v-if="personInfo.whetherBinding == 1">
                  <icon-svg name="right" class="site-sidebar__menu-icon info-class" style="vertical-align: -2px;"></icon-svg>
                  <span class="span">交易所账号</span><span class="pin">已绑定 {{ bindingNumberShow }}</span>
                </dd>
              </dl>
            </div>
          </div>

        </div>
      </div>
    </main-body>
  </div>
</template>
<style lang="scss" scoped>
</style>

<script>
  import MainBody from '@/components/common/mainBody'
  export default {
    data () {
      return {
        bindingNumberShow: '',
        idCardShow: '',
        phoneShow: '',
        realNameShow: '',
        activeNumber: 0,
        isCasinoMember: '0',
        isCasinoVerify: '0',
        memberLevel: '普通会员',
        personInfo: {
          userNumber: '',
          userType: '',
          referrerNumber: '',
          phone: '',
          auth: '',
          loginPwd: '',
          payPwd: '',
          bankCard: '',
          realName: '',
          bindingNumber: '',
          IdCard: '',
          idCardstatus: ''
        },
        chooseContent: [],

        isAuthentic: false,  // 是否已认证
        isSetPass: false,    // 是否已设置密码
        noSetPass: true,   // 是否未设置密码

        // isBankCard: false, // 显示换绑
        // noBankCard: true,  // 显示绑定
        authenticText: '未认证'  // '未认证'或'认证失败'文本显示
      }
    },
    components: {
      MainBody
    },
    methods: {
      getPersonInfo () {
        this.$http({
          url: this.$http.adornUrl('/users/info'),
          method: 'get'
        }).then(({data}) => {
          if (data && data.code === '1036') {
            window.sessionStorage.removeItem('userNumber')
            this.$cookie.delete('casino-front-token')
            this.$router.replace({
              name: 'login'
            })
          }
          if (data && data.code === '0000') {
            if (!data.users) {
              return
            }
            this.bindingNumberShow = data.bindingNumberShow
            this.idCardShow = data.idCardShow
            this.phoneShow = data.phoneShow
            this.realNameShow = data.realNameShow
            this.personInfo.userType = data.membership.name
            this.isCasinoMember = data.isCasinoMember
            this.isCasinoVerify = data.isCasinoVerify
            this.memberLevel = data.memberLevel
            this.personInfo = data.users
            this.showValidate()
          } else {
            this.$message.error(data.message)
          }
        }).catch(({error}) => {
          this.dataListLoading = false
          this.$message.error(error)
        })
      },
      // 显示数据时的验证
      showValidate(){
        if (!this.personInfo){
          return
        }
        // 0-未上传 1-待审核 2-审核通过3-审核不通过4-信息不完整
        // 未认证
        if (this.personInfo.idCardstatus === 0) {
          this.authenticText = '未认证'
          this.isAuthentic = false
          this.isBankCard = false
          this.noBankCard = true
        }

        // 审核中
        if (this.personInfo.idCardstatus === 1) {
          this.authenticText = '审核中'
          this.isAuthentic = true
          this.isBankCard = false
          this.noBankCard = true
        }
        // 认证通过
        if (this.personInfo.idCardstatus === 2) {
          this.isAuthentic = true
          this.authenticText = '已认证'

          this.isBankCard = false
          this.noBankCard = true
        }
        // 认证失败
        if (this.personInfo.idCardstatus === 3) {
          this.isAuthentic = false
          this.authenticText = '审核不通过'

          this.isBankCard = false
          this.noBankCard = true
        }
        // 信息不完整
        if (this.personInfo.idCardstatus === 4) {
          this.isAuthentic = false
          this.authenticText = '信息不完整'

          this.isBankCard = true
          this.noBankCard = false
        }
        // 是否设置支付密码
        if (this.personInfo.secondPassword === null || this.personInfo.secondPassword === '') {
          this.noSetPass = true
          this.isSetPass = false
        } else {
          this.noSetPass = false
          this.isSetPass = true
        }
        // 会员等级显示
        switch (this.personInfo.userType = data.users.positionType){

        }
      },
      toAuthentication () {
        if (this.isCasinoMember === '0') {
          this.$alert('非娱乐城注册会员，请前往云鸟商城或My Lifepay钱包进行实名认证', '提示', {
            confirmButtonText: '确认'
          })
          return
        }
        if (this.isCasinoMember === '1' && this.isCasinoVerify === '0' && this.personInfo.idCardstatus !== 0) {
          this.$alert('非娱乐城注册会员，请前往云鸟商城或My Lifepay钱包进行实名认证', '提示', {
            confirmButtonText: '确认'
          })
          return
        }
        this.$router.replace({
          name: 'realNameAuthentication'
        })
      },
      toBind () {
        if (this.personInfo.idCardstatus !== 2) {
          this.$alert('请实名认证通过后，再进行绑定', '提示', {
            confirmButtonText: '确认'
          })
          return
        }
        this.$router.replace({
          name: 'changeBankcard'
        })
      }
    },

    mounted: function () {

    },
    created: function () {
      this.getPersonInfo()
    }
  }
</script>
