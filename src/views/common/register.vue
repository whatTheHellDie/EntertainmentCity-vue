<template>
  <div>
    <my-header></my-header>
    <div class="login-wrap-box">
      <div class="wrap clearfix">
        <div class="login-main login-main3 pull-right">
          <div class="login-title">会员注册</div>
          <el-form  :model="registerForm" :rules="registerRule" ref="registerForm" @keyup.enter.native="register()" status-icon>
            <el-form-item prop="userNumber">
              <label class="label" for="userNumber">会员编号：</label>
              <el-input v-model="registerForm.userNumber" readonly></el-input>
            </el-form-item>
            <el-form-item prop="referrerNumber">
              <label class="label" for="referrerNumber">关注编号：</label>
              <el-input v-model="registerForm.referrerNumber" placeholder="请输入推荐人会员号"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <label class="label" for="password">登录密码：</label>
              <el-input v-model="registerForm.password" placeholder="8-16位数字、字母和符号两种以上组合" type="password"></el-input>
            </el-form-item>
            <el-form-item prop="payPassword">
              <label class="label" for="payPassword">支付密码 ：</label>
              <el-input v-model="registerForm.payPassword" placeholder="8-16位数字、字母和符号两种以上组合" type="password"></el-input>
            </el-form-item>
            <el-form-item prop="realName">
              <label class="label" for="realName">会员姓名 ：</label>
              <el-input v-model="registerForm.realName" placeholder="请输入您的真实姓名"></el-input>
            </el-form-item>
            <el-form-item prop="idCard">
              <label class="label" for="idCard">身份证号 ：</label>
              <el-input v-model="registerForm.idCard" placeholder="请输入您的身份证号码"></el-input>
            </el-form-item>
            <el-form-item prop="phone">
              <el-select v-model="countryCode" placeholder="请选择" class="select1">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-input v-model="registerForm.phone" placeholder="请输入手机号码"></el-input>
            </el-form-item>
            <el-form-item prop="captcha">
              <label class="label" for="captcha">短信验证 ：</label>
              <el-input v-model="registerForm.captcha" placeholder="请输入短信验证码"></el-input>
              <el-button class="captcha captcha1" :class="{active:computeTime!='获取验证码'}" @click="getCaptcha()">{{computeTime}}</el-button>
            </el-form-item>
            <el-form-item>
              <el-button class="login-btn-submit" type="primary" @click="register()">注册</el-button>
              <div class="no-account"><span @click="$router.push({ name: 'login' })" class="cursor"><span class="span">已有账号，</span>去登录</span></div>
            </el-form-item>
          </el-form>
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
      var checkPhone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('手机号不能为空'))
        } else {
          const reg = /^1[3|4|5|7|8|6|9][0-9]\d{8}$/
          // console.log(reg.test(value))
          if (reg.test(value)) {
            callback()
          } else {
            return callback(new Error('请输入正确的手机号'))
          }
        }
      }
      var checkPass = (rule, value, callback) => {
        const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('登录密码是8-16位，数字、字母组合'))
        }
      }
      var checkPayPass = (rule, value, callback) => {
        const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('支付密码是8-16位，数字、字母组合'))
        }
      }
      return {
        countryCode: '',
        options: [{
          value: '',
          label: '中国(86)'
        }, {
          value: '852',
          label: '香港(852)'
        }, {
          value: '853',
          label: '澳门(853)'
        }, {
          value: '886',
          label: '台湾(886)'
        }, {
          value: '84',
          label: '越南(84)'
        }],
        registerForm: {
          userNumber: '',
          password: '',
          paymentPassword: '',
          referrerNumber: '',
          phone: ''
        },
        registerRule: {
          userNumber: [{required: true, message: '会员编号不能为空', trigger: 'blur'}],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'},
            {required: true, min: 8, max: 16, message: '登录密码长度为8-16位', trigger: 'blur'},
            {required: true, validator: checkPass, trigger: 'blur'}
          ],
          payPassword: [
            {required: true, message: '支付密码不能为空', trigger: 'blur'},
            {required: true, min: 8, max: 16, message: '支付密码为8-16位长度', trigger: 'blur'},
            {required: true, validator: checkPayPass, trigger: 'blur'}
          ],
          realName: [
            {required: true, message: '请输入您的真实姓名', trigger: 'blur'},
            {required: true, max: 32, message: '姓名不能超过32位', trigger: 'blur'}
          ],
          idCard: [
            {required: true, message: '请输入您的身份证号码', trigger: 'blur'},
            {required: true, min: 6, max: 18, message: '身份证号不正确', trigger: 'blur'}
          ],
          referrerNumber: [{required: true, message: '推荐人不能为空', trigger: 'blur'}],
          phone: [{validator: checkPhone, trigger: 'blur'}],
          captcha: [{required: true, message: '验证码不能为空', trigger: 'blur'}]
        },
        rememberPass: false,
        computeTime: '获取验证码'
      }
    },
    components: {
      MyHeader,
      MyFooter,
    },
    computed:{
    },
    created() {
      if(this.$route.query.loginStatus == "failed"){
        this.$message({
          message: '登录超时，请重新登录！',
          type: 'error'
        });
      }
      this.createUserNumber();
    },
    watch: {
      '$route' (to, from) {
        this.createUserNumber();
      }
    },
    mounted() {
      this.$nextTick( this.refreshCode())
    },
    methods: {
      randomNum(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
      },
      refreshCode() {
        this.identifyCode = "";
        this.makeCode(this.identifyCodes, 4);
      },
      makeCode(o, l) {
        for (let i = 0; i < l; i++) {
          this.identifyCode += this.identifyCodes[
            this.randomNum(0, this.identifyCodes.length)
            ];
        }
        console.log(this.identifyCode);
      },
      // 获取随机会员编号
      createUserNumber () {
        this.$http({
          url: this.$http.adornUrl('/users/getRadomNumber'),
          method: 'get'
        }).then(({data}) => {
          this.dataListLoading = false
          if (data && data.code === '0000') {
            this.registerForm.userNumber = data.userNumber
          } else {
            this.$message({
              message: data.msg,
              type: 'error'
            })
          }
        }).catch(({error}) => {
          this.dataListLoading = false
          this.$message({
            message: '获取会员编号失败',
            type: 'error'
          })
        })
      },
      register () {
        this.$refs['registerForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/users/register'),
              method: 'post',
              params: {
                'userNumber': this.registerForm.userNumber,
                'referrerNumber': this.registerForm.referrerNumber,
                'password': this.registerForm.password,
                'payPassword': this.registerForm.payPassword,
                'realName': this.registerForm.realName,
                'phone': this.registerForm.phone,
                'idCard': this.registerForm.idCard,
                'captcha': this.registerForm.captcha
              }
            }).then(({data}) => {
              if (data && data.code === '1030') {
                this.$cookie.set('casino-front-token', data.token)
                window.sessionStorage.removeItem('userNumber')
                window.sessionStorage.removeItem('auth')
                window.sessionStorage.setItem('userNumber', this.registerForm.userNumber)
                this.$confirm('恭喜您注册成功，快去实名认证吧！', '提示', {
                  confirmButtonText: '先逛逛',
                  cancelButtonText: '去认证',
                  type: 'success'
                }).then(() => {
                  this.$router.replace({name: 'index'})
                }).catch(() => {
                  this.$router.replace({name: 'realNameAuthentication'})
                })

              } else {
                this.$message({
                  message: data.message,
                  type: 'error'
                })
                this.refreshCode()
              }
            })
          }
        })
      }, // 获取手机验证码
      getCaptcha () {
        if (this.computeTime !== '获取验证码'){
          // 处于倒计时
          return false
        }
        this.countdown()
        let phone = this.registerForm.phone
        if (phone == null || phone === '') {
          this.$message({
            message: '请先填写手机号',
            type: 'error'
          })
          return
        }
        console.log(this.options)
        this.$http({
          url: this.$http.adornUrl('/sms/getCaptcha'),
          method: 'get',
          params: this.$http.adornParams({
            'phone': this.countryCode + this.registerForm.phone
          })
        }).then(({data}) => {
          if (data && data.code === '0000') {
            this.$message({
              message: '验证码发送成功',
              type: 'success'
            })
        } else {
            this.$message({
             message: data.msg,
             type: 'error'
           })
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
      // 图片验证码
      createCode() {
        code = "";
        var codeLength = 4; //验证码的长度
        var random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
          'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');//随机数
        for (var i = 0; i < codeLength; i++) {
          //循环操作
          var index = Math.floor(Math.random() * 36);//取得随机数的索引（0~35）
          code += random[index];//根据索引取得随机数加到code上
        }
        this.checkCode = code;//把code值赋给验证码
      },
      // 失焦验证图和密码
      checkLpicma() {
        this.picLyanzhengma.toUpperCase();// 取得输入的验证码并转化为大写
        if (this.picLyanzhengma == '') {
          // 代码是直接复制项目内容，这里选择器选择时 请根据自己的需求来实现提示语效果，很简单，我懒，就不改了 ~
          $(".login_content1 span:eq(2)").text("请输入验证码")
          $(".login_content1 span:eq(2)").removeClass("disappear");
        } else if (this.picLyanzhengma.toUpperCase() != this.checkCode) {
          //  若输入的验证码与产生的验证码不一致时
          console.log(this.picLyanzhengma.toUpperCase())
          //  代码是直接复制项目内容，这里选择器选择时 请根据自己的需求来实现提示语效果，很简单，我懒，就不改了 ~
          $(".login_content1 span:eq(2)").text("验证码不正确")
          $(".login_content1 span:eq(2)").removeClass("disappear");
          this.createCode();//刷新验证码
          this.picLyanzhengma = '';
        } else {
          //  输入正确时
          // 代码是直接复制项目内容，这里选择器选择时 请根据自己的需求来实现提示语效果，很简单，我懒，就不改了 ~
          $('.login_content1 span:eq(2)').addClass('disappear');
          $('.login_content1 span:eq(2)').text('请输入验证码')
          return true;
        }
      }
    }
  }
</script>

<style lang="scss">

</style>
