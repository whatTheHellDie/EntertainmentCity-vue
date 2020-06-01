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
                <span role="link" class="el-breadcrumb__inner default">重置登录密码</span>
                <i class="el-breadcrumb__separator el-icon-arrow-right"></i></span></div>
          </div>
          <div class="box-body min425">
            <div class="charge-coin set-password forget-password">
              <div class="form-group combo-form">
                <label for="zhuan" class="col-sm-2 control-label">原登录密码</label>
                <input type="password" class="form-control input" placeholder="请输入原登录密码" v-model="oldPwd">
                <span class="lh35 ml10 default cursor" @click="$router.push({ name: 'forgetPassword' })">忘记原密码？</span>
                <!-- <span class="tip min-220">* 格式有误，必须为数字、字母和符号两种以上组合！</span> -->
              </div>
              <div class="form-group combo-form">
                <label for="zhuan" class="col-sm-2 control-label">新登录密码</label>
                <input type="password" class="form-control input" placeholder="8-16位数字、字母和符号两种以上组合" v-model="newPwd">
                  <span class="tip">*</span>
              </div>
              <div class="form-group combo-form">
                <label for="zhuan" class="col-sm-2 control-label">确认新登录密码</label>
                <input type="password" class="form-control input" placeholder="再次输入新登录密码" v-model="repeatPwd">
                 <!-- <span class="tip">* 格式有误，必须为数字、字母和符号两种以上组合！</span> -->
              </div>
              <span class="tip"></span>
              <div class="btn-ti cursor" @click="reset()">提交</div>
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
        activeNumber: 0,
        oldPwd: '',
        newPwd: '',
        repeatPwd: ''
      }
    },
    components: {
      MainBody
    },
    methods: {
      reset () {

        if (this.newPwd != this.repeatPwd){
          this.$message.error('您两次输入的新密码不一致');
          return;
        }

        const regPsw = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/
        if (!regPsw.test(this.newPwd) || !regPsw.test(this.repeatPwd)){
          this.$message.error('请输入8-16位数字、字母和符号两种以上组合的新密码');
          return;
        }

        this.$http({
          url: this.$http.adornUrl('/users/resetPasswordByPassword'),
          method: 'post',
          params: this.$http.adornParams({
            'oldPwd': this.oldPwd,
            'newPwd': this.newPwd,
            'type': 1,
            'phone': '',
            'captcha': ''
          })
        }).then(({data}) => {
          if (data && data.code === '0000') {
            this.$cookie.delete('casino-front-token')
            window.sessionStorage.removeItem('userNumber')
            this.$message.success('登录密码修改成功')
            this.$router.replace({
              name: 'login'
            })
          } else {
            this.$message.error(data.message)
          }
        })
      }
    },
    mounted () {
    }
  }
</script>
