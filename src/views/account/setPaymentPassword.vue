<template>
  <div class="body-grey">
    <main-body navIndex="1">
      <div slot="content">
        <div class="box-card2 mt20">
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
                <span role="link" class="el-breadcrumb__inner default">设置支付密码</span>
                <i class="el-breadcrumb__separator el-icon-arrow-right"></i></span></div>
          </div>
          <div class="box-body min425">
            <div class="charge-coin set-password">
              <div class="form-group combo-form">
                <label for="zhuan" class="col-sm-2 control-label">支付密码</label>
                <input type="password" class="form-control input" placeholder="6-18位数字、字母和符号两种以上组合" v-model="newPwd">
              </div>
              <div class="form-group combo-form">
                <label for="zhuan" class="col-sm-2 control-label">确认支付密码</label>
                <input type="password" class="form-control input" placeholder="再次输入新支付密码" v-model="repeatPwd">
              </div>
              <div class="btn-ti cursor" @click="payPwd()">提交</div>
            </div>
          </div>
        </div>
      </div>
    </main-body>
  </div>
</template>
<style lang="scss" scoped>
  .bold {
    .el-breadcrumb__item:last-child .el-breadcrumb__inner {
      font-weight: 800;
    }
  }
</style>

<script>
  // import { getUUID } from '@/utils'
  import MainBody from '@/components/common/mainBody'
  export default {
    data () {
      return {
        activeNumber: 0,
        newPwd: '',
        repeatPwd: ''
      }
    },
    components: {
      MainBody
    },
    methods: {
      payPwd () {
        if (this.newPwd != this.repeatPwd){
          this.$message.error('两次密码输入不一致')
          return;
        }

        const regPsw = /^[0-9]\d{5}$/
        if (!regPsw.test(this.newPwd) || !regPsw.test(this.repeatPwd)){
          this.$message.error('请输入6位数字密码')
          return;
        }
        this.$http({
          url: this.$http.adornUrl('/users/setPayPassword'),
          method: 'post',
          params: this.$http.adornParams({
            'payPassword': this.newPwd
          })
        }).then(({data}) => {
          if (data && data.code === '0000') {
            this.$message.success('设置支付密码成功')
            this.$router.replace({
              name: 'personalInformation'
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
