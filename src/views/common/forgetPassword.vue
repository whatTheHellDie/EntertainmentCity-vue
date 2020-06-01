<template>
  <div>
    <my-header></my-header>
    <div class="login-wrap-box">
      <div class="wrap clearfix">
        <div class="login-main login-main2">
          <div class="login-title">忘记密码</div>
          <img :src="stepImg" alt="" class="block-progress" />
          <el-form v-if="step==1" :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit(2)" status-icon>
            <el-form-item prop="userName">
              <label class="label" for="userNumber">会员编号：</label>
              <el-input v-model="dataForm.userNumber" placeholder="请输入会员编号"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <label class="label" for="phone">手机号码：</label>
              <el-input v-model="dataForm.phone" placeholder="请输入手机号码"></el-input>
            </el-form-item>
           <el-form-item prop="captcha">
              <label class="label" for="captcha">短信验证：</label>
              <el-input v-model="dataForm.captcha" placeholder="请输入短信验证码"></el-input>
              <el-button class="captcha captcha1" :class="{active:computeTime!='获取验证码'}" @click="getCaptcha()">{{computeTime}}</el-button>
            </el-form-item>
            <el-form-item>
              <el-button class="login-btn-submit mb124" type="primary" @click="dataFormSubmit(2)">下一步</el-button>
            </el-form-item>
          </el-form>
          <el-form v-else-if="step==2" :model="dataForm1" ref="dataForm" @keyup.enter.native="dataFormSubmit(2)" status-icon>
            <el-form-item class="fixed-forget fixed-forget1" prop="newPassword">
              <label class="label" for="newPassword">设置新登录密码：</label>
              <el-input v-model="dataForm1.newPassword" type="password" placeholder="6-18位数字、字母和符号两种以上组合"></el-input>
            </el-form-item>
            <el-form-item class="fixed-forget fixed-forget1" prop="repeatPassword">
              <label class="label" for="repeatPassword">确认新登录密码：</label>
              <el-input v-model="dataForm1.repeatPassword" type="password" placeholder="再次输入登录密码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="login-btn-submit mb124" type="primary" @click="dataFormSubmit(3)">提交</el-button>
            </el-form-item>
          </el-form>
          <div class="login-main2 pb124" v-else>
            <img src="/static/img/password-success.png" alt="" class="step3" />
            <el-button class="login-btn-submit mb124 fan" type="primary" @click="$router.push({name:'login'})">返回登录</el-button>
          </div>
        </div>
      </div>
    </div>
    <my-footer></my-footer>
  </div>
</template>

<script>
  import MyHeader from '@/components/common/header'
  import MyFooter from '@/components/common/footer'
  export default {
    data () {
      return {
        step: 1,
        phoneNo: '',  //用于接收手机号，以防格式化后获取到不正确的号码
        computeTime:"获取验证码",
        dataForm: {
          userNumber: '',
          phone: '',
          captcha: ''
        },
        dataForm1: {
          newPassword: '',
          repeatPassword: ''
        },
        registerRule: {
          userName: [{
            required: true,
            message: '账号不能为空',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          }]

        },
        rememberPass: false
      }
    },
    computed: {
      stepImg () {
        return '/static/img/progress' + this.step + '.png'
      }
    },
    components: {
      MyHeader,
      MyFooter
    },
    methods: {
      // 切换注册登录
      switchForm(status) {
        this.checkStatus = status;
        console.log(this.checkStatus)
      },
      // 提交表单
      dataFormSubmit () {
        if (this.step === 1) {
          this.valid()
        } else if (this.step === 2) {
          this.reset()
        }
      },
      // 获取验证码
      getCaptcha () {
        if (this.computeTime !== '获取验证码') {
          // 处于倒计时
          return false
        }
        let phoneNo = this.dataForm.phone
        if (!phoneNo) {
          this.$message.error('手机号为空')
          return
        }
        // 验证是否未正确的手机号
        if (!this.vaildPhone(phoneNo)) {
          this.$message.error('手机号格式不正确')
          return
        }
        this.countdown()
        this.$http({
          url: this.$http.adornUrl('/sms/getCaptcha'),
          method: 'get',
          params: this.$http.adornParams({
            'phone': phoneNo,
            'countryCode': '86',
            'signCode': 'yunniao'
          })
        }).then(({data}) => {
          if (data && data.code === '0000') {
            this.$message.alert('验证码已发送')
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
      valid (step) {
        let userNumber = this.dataForm.userNumber
        if (userNumber == null || userNumber === '') {
          this.$message.error('请先填写会员编号')
          return false
        }
        let phoneNo = this.dataForm.phone
        if (!phoneNo) {
          this.$message.error('手机号为空')
          return false
        }
        // 验证是否未正确的手机号
        if (!this.vaildPhone(phoneNo)){
          this.$message.error('手机号格式不正确')
          return false
        }
        let captcha = this.dataForm.captcha
        if (!captcha) {
          this.$message.error('请先填写验证码')
          return false
        }
        this.$http({
          url: this.$http.adornUrl('/sms/verifyCaptcha'),
          method: 'post',
          params: this.$http.adornParams({
            'userNumber': this.dataForm.userNumber,
            'phone': this.dataForm.phone,
            'captcha': this.dataForm.captcha
          })
        }).then(({data}) => {
          if (data && data.code === '0') {
            this.step = 2
            // this.stepImg = '/static/img/progress' + 3 + '.png'
            return true
          } else {
            this.$message.error(data.message)
            return false
          }
        }).catch(({error}) => {
          error = (error == null ? '网络请求失败!' : error)
          this.$message.error(error)
          return false
        })
      },
      reset (step) {
        let newPassword = this.dataForm1.newPassword
        if (newPassword == null || newPassword === '') {
          this.$message.error('请先填写新密码')
          return
        }
        let repeatPassword = this.dataForm1.repeatPassword
        if (repeatPassword == null || repeatPassword === '') {
          this.$message.error('请再次填写新密码')
          return
        }
        if (newPassword !== repeatPassword) {
          this.$message.error('您两次输入的新密码不一样')
          return
        }
        const regPsw = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/
        if (!regPsw.test(newPassword) || !regPsw.test(repeatPassword)){
          this.$message.error('请输入8-16位数字、字母和符号两种以上组合的新密码')
          return
        }
        this.$http({
          url: this.$http.adornUrl('/users/resetPasswordByCaptcha'),
          method: 'post',
          params: this.$http.adornParams({
            'userNumber': this.dataForm.userNumber,
            'password': this.dataForm1.repeatPassword,
            'phone': this.dataForm.phone,
            'captcha': this.dataForm.captcha
          })
        }).then(({data}) => {
          if (data && data.code === '0000') {
            this.step = 3
            this.stepImg = '/static/img/progress' + 3 + '.png'
          } else {
            this.$message.error(data.message)
          }
        }).catch(({error}) => {
          error = (error == null ? '网络请求失败!' : error)
          this.$message.error(error)
        })
      },
      vaildPhone (value) {
        const reg = /^1[3|4|5|7|8|6|9][0-9]\d{8}$/
        if (reg.test(value)) {
          // this.$message.error('请输入正确的手机号')
          return true
        }
        return false
      },
      getPhoneByNumber(number){
        if (!number){
          return;
        }
        this.$http({
          url: this.$http.adornUrl('/user/getPhoneByNumber'),
          method: 'post',
          params: this.$http.adornParams({
            'userNumber': number
          })
        }).then(({data}) => {
          if (data && data.code === '0000') {
            this.phoneNo = data.data;
            this.dataForm.phone = this.formatPhone(data.data);
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      formatPhone(value){
        if(value.length > 8) {
          return value =  value.substr(0, 3) + '****' + value.substr(7);
        }
        return value;
      }
    }
  }
</script>

<style lang="scss">

</style>
