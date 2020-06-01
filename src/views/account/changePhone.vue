<template>
  <div class="body-grey">
    <main-body navIndex="1">
      <div slot="content">
        <div class="box-card2 mt20">
          <div class="top-nav">
            <div aria-label="Breadcrumb" role="navigation" class="el-breadcrumb">
              <span class="el-breadcrumb__item">
                <span role="link" class="el-breadcrumb__inner">账户中心</span>
                <i class="el-breadcrumb__separator el-icon-arrow-right"></i>
              </span>
              <span class="el-breadcrumb__item">
                <span role="link" class="el-breadcrumb__inner">个人信息</span>
                <i class="el-breadcrumb__separator el-icon-arrow-right"></i>
              </span> <span class="el-breadcrumb__item bold" aria-current="page">
                <span role="link" class="el-breadcrumb__inner default">更换手机</span>
                <i class="el-breadcrumb__separator el-icon-arrow-right"></i></span></div>
          </div>
          <div class="box-body min425">
            <div class="charge-coin set-password">
              <div class="form-group combo-form">
                <label for="zhuan" class="col-sm-2 control-label">原手机号码：</label>
                <input type="text" class="form-control input" readonly v-model="phone">
              </div>
              <div class="form-group combo-form">
                <label for="zhuan" class="col-sm-2 control-label">新手机号码：</label>
                <input type="text" class="form-control input" placeholder="请输入新手机号" v-model="repeatPhone">
              </div>
              <div class="gu-btn" @click="repeatPhone()">提交</div>
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
  import { isMobile } from '@/utils/validate'
  import MainBody from '@/components/common/mainBody'
  export default {
    data () {
      return {
        number: '',
        phone: '',
        repeatPhone: ''
      }
    },
    components: {
      MainBody
    },
    methods: {
      repeatPhone () { 
        if (!isMobile(this.repeatPhone)){
          this.$message.error('请输入正确的新手机号')
          return;
        }
        this.$http({
          url: this.$http.adornUrl('/user/au/repeat/phone'),
          method: 'post',
          params: this.$http.adornParams({
            'phone': this.repeatPhone
          })
        }).then(({data}) => {
          if (data && data.code === '0000') {
            this.$message.success('设置支付密码成功')
            this.$router.replace({
              name: 'personalInformation'
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    },
    mounted () {
    }
  }
</script>
