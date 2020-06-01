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
                <span role="link" class="el-breadcrumb__inner default">重置支付密码</span>
                <i class="el-breadcrumb__separator el-icon-arrow-right"></i></span></div>
          </div>
          <div class="box-body min425">
            <div class="charge-coin set-password forget-password">
              <div class="form-group combo-form">
                <label for="zhuan" class="col-sm-2 control-label">原支付密码</label>
                <input type="password" class="form-control input" placeholder="请输入原支付密码" v-model="oldPwd">
                <span class="lh35 ml10 default cursor" @click="$router.push({name:'forgetPaymentPassword'})">忘记原密码？</span>
                <span class="tip max-220"></span>
              </div>
              <div class="form-group combo-form">
                <label for="zhuan" class="col-sm-2 control-label">新支付密码</label>
                <input type="password" class="form-control input" placeholder="请输入8-16位，数字、字母和符号两种以上组合的新支付密码" v-model="newPwd">
                <span class="tip"></span>
              </div>
              <div class="form-group combo-form">
                <label for="zhuan" class="col-sm-2 control-label">确认新支付密码</label>
                <input type="password" class="form-control input" placeholder="再次输入新支付密码" v-model="repeatPwd">
                 <span class="tip"></span>
              </div>
              <span class="tip"></span>
              <div class="btn-ti cursor" @click="resetPayPwd()">提交</div>
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
  //import { getUUID } from '@/utils'
  import MainBody from '@/components/common/mainBody'
  export default {
    components: { MainBody },
    data() {
      return {
        oldPwd: '',
        newPwd: '',
        repeatPwd: ''
      }
    },
    methods: {
      //重置支付密码
      resetPayPwd() {

        if (this.newPwd != this.repeatPwd){
          this.$message.error('您两次输入的新密码不一致')
          return;
        }

        const regPsw = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/
        if (!regPsw.test(this.newPwd) || !regPsw.test(this.repeatPwd)){
          this.$message.error('请输入8-16位，数字、字母和符号两种以上的支付密码')
          return;
        }

        this.$http({
          url: this.$http.adornUrl('/users/resetPayPassword'),
          method: 'post',
          params: this.$http.adornParams({
            'oldPwd': this.oldPwd,
            'newPwd': this.newPwd,
            'type': 2, //支付密码

            'phone': '',
            'captcha': ''
          })
        }).then(({data}) => {
          if (data && data.code === '0000') {
            // window.location.href='/personalInformation';
            this.$message.success('支付密码重置成功')
            this.$router.replace({
              name: 'personalInformation'
            })
          } else {
            this.$message.error(data.message)
          }
        })
      },
    },
    mounted() {
    }
  }
</script>
