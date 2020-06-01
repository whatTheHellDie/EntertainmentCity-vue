<template>
  <div>
    <my-header></my-header>
    <div class="login-wrap-box">
      <div class="wrap clearfix">
        <div class="login-main pull-right">
          <div class="login-title">会员登录</div>
          <el-form v-if="this.checkStatus" :model="loginForm" :rules="loginFormRule" ref="loginForm" @keyup.enter.native="login()" status-icon>
            <el-form-item prop="userNumber">
              <label class="label" for="userNumber">会员编号：</label>
              <el-input v-model="loginForm.userNumber"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <label class="label" for="password">登录密码：</label>
              <el-input v-model="loginForm.password" placeholder="8-16位数字、字母和符号两种以上组合" type="password"></el-input>
            </el-form-item>
             <el-form-item prop="imgCaptcha">
              <label class="label" for="text">图形验证：</label>
              <el-input v-model="loginForm.imgCaptcha" placeholder="请输入图形验证码" type="text"></el-input>
              <div class="r-yan"  @click="refreshCode"><s-identify :identifyCode="identifyCode" :contentWidth="73" :contentHeight="28"></s-identify></div>
            </el-form-item>
            <el-form-item>
              <el-button class="login-btn-submit" type="primary" @click="login()">立即登录</el-button>
              <!-- <div class="no-account"><span class="cursor default pull-left" @click="$router.push({name:'forgetPassword'})">忘记密码</span><span @click="$router.push({ name: 'register' })" class="cursor default"><icon-svg name="circle" class="site-sidebar__menu-icon" style="vertical-align: -2px;margin-right: 10px;"></icon-svg>没有账号？去注册</span></div> -->
              <div class="no-account">
                <span class="cursor default pull-left" @click="$router.push({name:'forgetPassword'})">忘记密码</span>
                <span @click="$router.push({ name: 'register' })" class="cursor"><span class="span">没有账号,</span>去注册</span>
                </div>
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
  import SIdentify from '@/components/identify'

  export default {
    data () {
      window.addEventListener("popstate", function(e) {
          window.history.pushState({}, "", "/login");
      });
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
      var validateReffer = (rule, value, callback) => {

      }

      var checkPass = (rule, value, callback) => {
        const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/
          // console.log(reg.test(value));
          if (reg.test(value)) {
            callback();
          } else {
            return callback(new Error('请输入6-18位数字、字母组合密码'));
          }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.registerForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      var checkImgCaptcha = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('验证码不能为空'));
        } else if (value.toUpperCase() !== this.identifyCode.toUpperCase()) {
          callback(new Error('验证码不一致!'));
        } else {
          callback();
        }
      };
      return {
        identifyCodes: "1234567890abcdefghjkmnopqrstuvwxyzABCDEFGHJKMNOPQRSTUVWXYZ",
        identifyCode: "",
        computeTime:'获取验证码',
        loginForm: {
          userNumber: 'LB',
          password: '',
          imgCaptcha: ''
        },
        loginFormRule: {
          userNumber: [{
            required: true,
            message: '会员编号不能为空',
            trigger: 'blur'
          }
          ],
          password: [{
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          }
          ],
          imgCaptcha:[
          { required: true,validator: checkImgCaptcha, trigger: 'blur' },
          ]
//        captcha: [{
//          required: true,
//          message: '验证码不能为空',
//          trigger: 'blur'
//        }]
        },
        rememberPass: false
        //      captchaPath: ''
      }

    },
    components: {
      MyHeader,
      MyFooter,
      SIdentify
    },
    computed:{
      checkStatus(){
        if (this.$route.name == 'register') {
          return false
        } else {
          return true
        }
      }
    },
    beforeCreate(){
      // console.log('token: ',this.$cookie.get('hu-chain-token'))
      // console.log('user session: ',window.sessionStorage.getItem('userNumber'))
      if(this.$cookie.get('casino-front-token') && window.sessionStorage.getItem('userNumber')) {
        this.$router.replace({ name: 'accountIndex' })
      }
    },
    created() {
      if(this.$route.query.loginStatus=="failed"){
        this.$message({ message: "登录超时，请重新登录！", type: 'error' });
      }
      if(window.sessionStorage.getItem('userNumber')){
        this.loginForm.userNumber = window.sessionStorage.getItem('userNumber');
      }
        // this.createUserNumber();
    },
    watch: {

      '$route' (to, from) {
        // 对路由变化作出响应...

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
    },

    forgetPassword (){
      this.$alert('若忘记密码，请联系客服。', '提示', { confirmButtonText: '确定' })
    },
      // 切换注册登录
      createUserNumber () {
        this.$http({
          url: this.$http.adornUrl('/id/create'),
          method: 'get'
        }).then(({data}) => {
          this.dataListLoading = false
          if (data && data.code === '0000') {
            this.registerForm.userNumber = data.data
          } else {
             this.$message({
                  message: data.msg,
                  type: 'error'
                });
          }
        }).catch(({error}) => {
          this.dataListLoading = false
          this.$message({
                  message: error,
                  type: 'error'
                });
        })
      },
      // 登录
      login () {
        this.$refs['loginForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/users/login'),
              method: 'post',
              params: {
                'userNumber': this.loginForm.userNumber,
                'password': this.loginForm.password
              }
            }).then(({data}) => {
              if (data && data.code === '1031') {
                this.$cookie.set('casino-front-token', data.token)
                this.$router.replace({
                  name: 'index'
                })
                window.sessionStorage.removeItem('userNumber')
                window.sessionStorage.removeItem('auth')
                window.sessionStorage.setItem('auth', data.auth)
                window.sessionStorage.setItem('userNumber', data.user.userNumber)
              } else {
                this.$message.error(data.message)
                this.refreshCode()
              }
            }).catch(({error}) => {
              error = (error == null ? '请求失败!' : error)
              this.$message({ message: error, type: 'error' })
            })
          }
        })
      },
      // 图片验证码
      createCode () {
        var code = ''
        var codeLength = 4 // 验证码的长度
        var random = new Array(0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R',
                       'S','T','U','V','W','X','Y','Z'); // 随机数
           for(var i = 0; i < codeLength; i++) {
                 //循环操作
                 var index = Math.floor(Math.random()*36);//取得随机数的索引（0~35）
                 code += random[index];//根据索引取得随机数加到code上
           }
           this.checkCode = code;//把code值赋给验证码
      },
      // 失焦验证图和密码
      checkLpicma(){
           this.picLyanzhengma.toUpperCase();//取得输入的验证码并转化为大写
           if(this.picLyanzhengma == '') {
                  //代码是直接复制项目内容，这里选择器选择时 请根据自己的需求来实现提示语效果，很简单，我懒，就不改了 ~
                 $(".login_content1 span:eq(2)").text("请输入验证码")
                 $(".login_content1 span:eq(2)").removeClass("disappear");
           }else if(this.picLyanzhengma.toUpperCase() != this.checkCode ) {
                  //若输入的验证码与产生的验证码不一致时
                  // console.log( this.picLyanzhengma.toUpperCase())
                  //代码是直接复制项目内容，这里选择器选择时 请根据自己的需求来实现提示语效果，很简单，我懒，就不改了 ~
                  $(".login_content1 span:eq(2)").text("验证码不正确")
                  $(".login_content1 span:eq(2)").removeClass("disappear");
                  this.createCode();//刷新验证码
                  this.picLyanzhengma = '';
            }else {
                  //输入正确时
                 //代码是直接复制项目内容，这里选择器选择时 请根据自己的需求来实现提示语效果，很简单，我懒，就不改了 ~
                  $(".login_content1 span:eq(2)").addClass("disappear");
                  $(".login_content1 span:eq(2)").text("请输入验证码")
                  return true;
            }
      }

    }
  }
</script>

<style lang="scss">

</style>
