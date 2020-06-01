<template>
  <div class="body-grey">
    <main-body navIndex="1">
      <div slot="content">
        <div class="box-card2">
          <div class="top-nav">
            <div aria-label="Breadcrumb" role="navigation" class="el-breadcrumb">
              <span class="el-breadcrumb__item">
                <span role="link" class="el-breadcrumb__inner">我的账户</span>
                <i class="el-breadcrumb__separator el-icon-arrow-right"></i>
              </span>
              <span class="el-breadcrumb__item">
                <span role="link" class="el-breadcrumb__inner">个人信息</span>
                <i class="el-breadcrumb__separator el-icon-arrow-right"></i>
              </span> <span class="el-breadcrumb__item bold" aria-current="page">
                <span role="link" class="el-breadcrumb__inner default">忘记支付密码</span>
                <i class="el-breadcrumb__separator el-icon-arrow-right"></i></span></div>
          </div>
          <div class="box-body min425">
            <div class="charge-coin set-password forget-password">
              <div class="form-group combo-form">
                <label for="zhuan" class="col-sm-2 control-label">手机号码</label>
                <input type="text" class="form-control input" placeholder="请输入您绑定的手机号码" v-model="phone">
              </div>
              <div class="form-group combo-form">
                <label for="zhuan" class="col-sm-2 control-label">短信验证码</label>
                <input type="text" class="form-control input" placeholder="请输入短信验证码" v-model="captcha">
                <!-- <div class="btn-sub">获取验证码</div> -->
                <div class="btn-sub" :class="{active:computeTime != '获取验证码'}" @click="getCaptcha()">{{computeTime}}</div>
              </div>
              <div class="form-group combo-form">
                <label for="zhuan" class="col-sm-2 control-label">新支付密码</label>
                <input type="password" class="form-control input" placeholder="请输入支付密码" v-model="newPwd">
                <span class="tip">*</span>
              </div>
              <div class="form-group combo-form">
                <label for="zhuan" class="col-sm-2 control-label">确认支付密码</label>
                <input type="password" class="form-control input" placeholder="再次输入新支付密码" v-model="repeatPwd">
              </div>
              <div class="btn-ti" @click="update()">提交</div>
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
  // import { getUUID } from '@/utils'
  import MainBody from '@/components/common/mainBody'
  export default {
    data() {
      return {
        computeTime: '获取验证码',
        phone: '',
        phoneFormat: '',
        captcha: '',
        newPwd: '',
        repeatPwd: ''
      }
    },
    components: {
      MainBody
    },
    methods: {
      // 重置支付密码
      update(){
        const regPhone = /^1[3|4|5|7|8|6|9][0-9]\d{8}$/
        if (!regPhone.test(this.phone)){
          this.$message.error('请输入正确的手机号')
          return;
        }

        if (this.newPwd != this.repeatPwd){
          this.$message.error('您两次输入的新密码不一致')
          return;
        }

        const regPsw = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/
        if (!regPsw.test(this.newPwd) || !regPsw.test(this.repeatPwd)){
          this.$message.error('请输入8-16位，数字、字母和符号组合两种以上的新支付密码')
          return;
        }

        if (!this.captcha){
          this.$message.error('请输入验证码')
          return
        }

        this.$http({
          url: this.$http.adornUrl('/users/resetPayPasswordByCaptcha'),
          method: 'post',
          params: this.$http.adornParams({
            'oldPwd': '',
            'password': this.newPwd,
            'type': 2,
            'phone': this.phone,
            'captcha': this.captcha
          })
        }).then(({data}) => {
          if (data && data.code === '0000') {
            this.$message.success('支付密码重置成功')
            this.$router.push({name: 'personalInformation'})
          } else {
            this.$message.error(data.message)
          }
        })
      },
      // 获取验证码
      getCaptcha () {
        if (this.computeTime !== '获取验证码') {
          // 处于倒计时
          return false
        }
        let phone = this.phone
        if (phone == null || phone === '') {
          this.$message.error('请先填写手机号')
          return
        }
        this.countdown()
        this.$http({
          url: this.$http.adornUrl('/sms/getCaptcha'),
          method: 'get',
          params: this.$http.adornParams({
            'phone': this.phone,
            'countryCode': '86',
            'signCode': 'yunniao'
          })
        }).then(({data}) => {
          if (data && data.code === '0000') {
            this.$message.success('验证码发送成功')
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      countdown () {
        var second = 120
        var that = this
        this.computeTime = '剩余' + second-- + '秒'
        var time = setInterval(() => {
          if (second === 0) {
            console.log(this.computeTime)
            that.computeTime = '获取验证码'
            clearInterval(time)
            return false
          }
          this.computeTime = '剩余' + second + '秒'
          second--
        }, 1000)
      },
      // 获取当前登录人的手机号
      getUserinfo () {
        this.$http({
          url: this.$http.adornUrl('/users/info'),
          method: 'get'
        }).then(({data}) => {
          if (data && data.code === '0000') {
            this.phone = data.users.phone
            this.phoneFormat = this.formatPhone(this.phone)
          } else {
            this.$message.error(data.msg)
          }
        }).catch(({error}) => {
          this.$message.error(error)
        })
      },
      formatPhone (value) {
        if (value.length > 8) {
          return value.substr(0, 3) + '****' + value.substr(7)
        }
        return value
      }
    },
    created () {
      this.getUserinfo()
    }
  }
</script>
