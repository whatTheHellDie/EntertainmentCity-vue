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
                <span role="link" class="el-breadcrumb__inner default">绑定交易所账号</span>
              <i class="el-breadcrumb__separator el-icon-arrow-right"></i></span>
            </div>
          </div>

          <div class="box-body min425">
            <form class="form-horizontal"  role="form">
              <div class="warm default">请添加币利交易所账号</div>
              <div class="form-group combo-form">
                <label for="zhuan" class="col-sm-3 control-label">交易所账号</label>
                <div class="col-sm-4">
                  <input class="form-control input" placeholder="请输入交易所账号（手机或邮箱）" v-model="form.biliexAccount">
                </div>
                <!-- <div class="tips lh40 red">* </div> -->
              </div>
              <div class="form-group combo-form">
                <label for="zhuan" class="col-sm-3 control-label">验证码</label>
                <div class="col-sm-4">
                  <input class="form-control input" placeholder="请输入验证码" v-model="form.captcha">
                </div>
                <div class="btn-sub" @click="biliexSendCaptcha">获取验证码</div>
                <!-- <div class="btn-sub active">59s后再次申请</div>
                <div class="tips lh40 red y-wxts">温馨提示：验证码已成功发送至注册交易所帐号手机号或邮箱中，请注意查收！</div> -->
              </div>
              <div class="form-group">
                <div class="col-sm-offset-3 col-sm-9">
                  <div class="btn-ti cursor" @click="submitData">提交</div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main-body>
  </div>
</template>


<script>
  // import { getUUID } from '@/utils'
  import MainBody from '@/components/common/mainBody'

  export default {
    data () {
      return {
        imgs: ['/static/img/zhan1.png'],
        imgs1: ['/static/img/zhan2.png'],
        form: {
          captcha: '',
          biliexAccount: ''
        }
      }
    },
    computed: {},
    components: {
      MainBody
    },
    methods: {
      submitData () {
        this.$http({
          url: this.$http.adornUrl('/users/bindBiliexAccount'),
          method: 'post',
          params: this.$http.adornParams({
            'captcha': this.form.captcha,
            'biliexAccount': this.form.biliexAccount
          })
        }).then(({data}) => {
          if (data && data.code === '0000') {
            this.$message.success('提交成功')
            this.$router.push('/personalInformation')
            // window.location.href='/personalInformation';
          } else {
            this.$message.error(data.message)
          }
        })
      },
      biliexSendCaptcha () {
        this.$http({
          url: this.$http.adornUrl('/sms/biliexSendCaptcha'),
          method: 'post',
          params: this.$http.adornParams({
            'username': this.form.biliexAccount
          })
        }).then(({data}) => {
          if (data && data.code === 200) {
            this.$message.success(data.message)
          } else {
            this.$message.error(data.message)
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
.warm{
  margin-bottom: 38px;
  font-size: 16px;
  font-weight: bold;
}


  .room_add_img {
    width: 148px;
    height: 98px;
    border: 1px solid #e1e1e1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    position: relative;
  }

  .room_add_img > span:nth-child(1) {
    margin-top: 20px;
    width: 40px;
    height: 40px;
    overflow: hidden;
  }

  .room_add_img > span:nth-child(2) {
    margin-bottom: 10px;
  }

  .btn-chuan input, .room_add_img input {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    z-index: 99999;
    opacity: 0;
  }

  .upload-button {
    height: 60px;
    width: 60px;
    background: red
  }

  .col-sm-3 {
    margin-right: 10px;
    width: 120px;
    text-align: right;
    display: inline-block;
    vertical-align: top;
    line-height: 40px;
  }

  .col-sm-4 {
    width: 370px;
    line-height: 40px;
    display: inline-block;
    vertical-align: top;
    input {
      width: 100%;
      height: 40px;
      padding-left: 11px;
    }
  }

  .col-sm-8 {
    display: inline-block;
    vertical-align: top;
    width: 870px;
  }

  .combo-form {
    margin-bottom: 30px;
    font-size: 0;
    >*{
      font-size: 14px;
    }
  }

  .lh40 {
    line-height: 40px;
    display: inline-block;
    vertical-align: top;
  }

  .red {
    color: #f43837;
  }

  .tips {
    margin-left: 6px;
  }

  .card-box {
    display: inline-block;
    vertical-align: top;
    &.mr45 {
      margin-right: 45px;
    }
  }

  .card-wrap {
    margin-bottom: 30px;
    display: inline-block;
    vertical-align: top;
    .img {
      margin-right: 26px;
      width: 300px;
      height: 144px;
    }
    .card-tip {
      margin: 10px 40px;
      color: #999;
    }
    .mr45 {
      margin-right: 45px;
    }
  }

  .btn-chuan {
    position: relative;
    width: 90px;
    height: 32px;
    line-height: 32px;
    padding: 0;
    background: #ffc32d;
    color: #fff;
    display: inline-block;
    vertical-align: bottom;
    margin: 0 auto;
    text-align: center;
    border-radius: 20px;
    cursor: pointer;
  }
  .y-wxts {
    margin-left: 130px;
  }
</style>
