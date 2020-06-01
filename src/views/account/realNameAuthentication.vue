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
                <span role="link" class="el-breadcrumb__inner default">实名认证</span>
              <i class="el-breadcrumb__separator el-icon-arrow-right"></i></span>
            </div>
          </div>
          <div class="box-body min425">
            <form v-if="status==1" class="form-horizontal"  role="form">
              <div class="form-group combo-form">
                <label for="zhuan" class="col-sm-3 control-label red" v-if="reason">认证不通过原因：</label>
                <div class="lh40 red">{{reason}}</div>
              </div>
              <img src="/static/img/step1.png" alt="" class="renzheng-img" />
              <div class="form-group combo-form">
                <label for="zhuan" class="col-sm-3 control-label">真实姓名</label>
                <div class="col-sm-4">
                  <input class="form-control input" placeholder="请输入真实姓名" v-model="form.userName">
                </div>
                <div class="tips lh40 red">* 请输入真实姓名！</div>
              </div>
              <div class="form-group combo-form">
                <label for="zhuan" class="col-sm-3 control-label">身份证号</label>
                <div class="col-sm-4">
                  <input class="form-control input" placeholder="请输入身份证号" v-model="form.idCardNumber">
                </div>
                <div class="tips lh40 red">* 请输入有效身份证号！</div>
              </div>
              <div class="form-group combo-form">
                <label for="zhuan" class="col-sm-3 control-label">上传证件图片</label>
                <div class="col-sm-8 y-float-left">
                  <div class="card-box mr45">
                    <div class="card-wrap">
                      <img :src="imgs[0]" class="img">
                      <div class="btn btn-chuan cursor">上传图片<input @change='add_img($event,0)' accept="image/png,image/jpeg,image/gif" type="file" id="saveImage"></div>
                      <p>上传的身份证照片必须与填写的身份信息一致，否则审核无法通过</p>
                    </div>
                    <div class="text">(身份证正面)</div>
                  </div>
                  <div class="card-box">
                    <div class="card-wrap">
                      <img :src="imgs1[0]" class="img">
                      <div class="btn btn-chuan cursor">上传图片<input @change='add_img($event,1)' accept="image/png,image/jpeg,image/gif" type="file" id="saveImage1"></div>
                      <p>上传的身份证照片必须与填写的身份信息一致，否则审核无法通过</p>
                    </div>
                    <div class="text">(身份证背面)</div>
                  </div>
                </div>
                <div class="tips lh40 red sfz">*</div>
              </div>
              <div class="form-group">
                <div class="col-sm-offset-3 col-sm-9">

                  <div class="btn-ti cursor" @click="submitData()">提交</div>
                </div>
              </div>
            </form>
            <div v-if="status==2" class="gongxi pay-status">
              <div class="zheng"><icon-svg name="right" class="site-sidebar__menu-icon info-class" ></icon-svg>恭喜您，已成功提交实名认证信息！</div>
              <div class="say">
              </div>
              <div class="to"><div class="gu-btn" @click="$router.push({name:'index'})">返回首页</div> <div class="gu-btn back-index" @click="$router.push({name:'personalInformation'})">返回个人信息页</div></div>
            </div>
          </div>
        </div>
      </div>
    </main-body>
    <el-dialog
      title="提示"
      :visible.sync="identityDialog"
      :show-close="false"
      class="identity-wrap"
      width="30%"
      center>
      <span>{{topTip}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="identityDialog = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
  import { isMobile } from '@/utils/validate'
  import MainBody from '@/components/common/mainBody'

  export default {
    data() {
      return {
        mapJson: '../static/json/map.json',
        province: '',
        shi: '',
        shi1: [],
        qu: '',
        qu1: [],
        city: '',
        block: '',
        provinceText: '',
        cityText: '',
        topTip: '',

        status: 1,
        imgs: ['/static/img/zhan.png'],
        imgs1: ['/static/img/zhan.png'],
        reason: '',
        form: {
          userName: '',
          idCardNumber: '',
          idCardFrontPicUrl: '',
          idCardOppositePicUrl: '',
          idCardFrontPicUrlSave: '',
          idCardOppositePicUrlSave: '',

          bankName: '',
          bankCard: '',
          bankProvince: '',
          bankCity: '',
          bankBranch: '',
          bankCardPhone: ''
        },
        identityDialog: false // 对话框
      }
    },
    computed: {},
    components: {
      MainBody
    },
    methods: {
      verify () {
        if (!this.form.userName || !this.form.userName.trim()) {
          this.status = 1
          this.topTip = '真实姓名不能为空！'
          this.identityDialog = true
          return false
        }
        if (!this.form.idCardNumber || !this.form.idCardNumber.trim() ||
          (this.form.idCardNumber.length !== 15 && this.form.idCardNumber.length !== 18)) {
          this.status = 1
          this.topTip = '请输入有效身份证号！'
          this.identityDialog = true
          return false
        }
        if (this.form.idCardFrontPicUrlSave.length <= 0) {
          this.status = 1
          this.topTip = '请先上传身份证正面图片'
          this.identityDialog = true // 显示对话框
          return false
        }
        if (this.form.idCardOppositePicUrlSave.length <= 0) {
          this.topTip = '请先上传身份证反面图片'
          this.status = 1
          this.identityDialog = true // 显示对话框
          return false
        }
        return true
      },
      submitData () {
        if (!this.verify()) {
          return
        }
        this.$http({
          url: this.$http.adornUrl('/users/authenticate'),
          method: 'post',
          params: {
            'userName': this.form.userName,
            'idCardNumber': this.form.idCardNumber,
            'idCardFrontPicUrl': this.form.idCardFrontPicUrlSave,
            'idCardOppositePicUrl': this.form.idCardOppositePicUrlSave
          }
        }).then(({data}) => {
          if (data && data.code === '0000') {
            this.status = 2
            this.$message({message: '提交成功', type: 'success'})
          } else {
            this.status = 1
            // this.$message({message: data.message, type: 'error'})
            this.topTip = data.message
            this.identityDialog = true // 显示对话框
          }
        })
      },
      add_img (event, index) {
        var reader = new FileReader()
        var img1 = event.target.files[0]

        if (!/image\/\w+/.test(img1.type) || !img1.type || !/\.(?:jpg|png|gif)$/.test(img1.name)) {
          this.$alert('图片只能是jpg,gif,png', '提示', {
            confirmButtonText: '确定'
          })
          return false
        }
        if (index === 0 && this.imgs.length > 0) {
          this.imgs.splice(0, 1)
        }
        if (index === 1 && this.imgs1.length > 0) {
          this.imgs1.splice(0, 1)
        }

        reader.readAsDataURL(img1)
        var that = this
        reader.onloadend = function () {
          if (img1.size > 1048576) {
            that.$alert('图片不能大于1M', '提示', {
              confirmButtonText: '确定'
            })
            return false
          }
          if (index === 0) {
            that.imgs.push(reader.result)
            let x = document.getElementById('saveImage').files[0]
            let params = new FormData()
            params.append('file', x)
            that.$axios.post(that.$http.adornUrl('/users/upload'), params, {
              headers: {
                'Content-Type': 'multipart/form-data',
                'ACCESS_TOKEN': that.$cookie.get('casino-front-token')
              }
            }).then(({data}) => {
              this.dataListLoading = false
              if (data && data.code === '0000') {
                that.form.idCardFrontPicUrlSave = data.picPath
              } else {
                // that.$message.error(data.msg)
                that.$message({message: '上传失败', type: 'error'})
              }
            }).catch(({error}) => {
              that.dataListLoading = false
              error = (error == null ? '上次失败' : error)
              that.$message({message: error, type: 'error'})
            })
          } else {
            that.imgs1.push(reader.result)
            let x = document.getElementById('saveImage1').files[0]
            let params = new FormData()
            params.append('file', x)
            that.$axios.post(that.$http.adornUrl('/users/upload'), params, {
              headers: {
                'Content-Type': 'multipart/form-data',
                'ACCESS_TOKEN': that.$cookie.get('casino-front-token')
              }
            }).then(({data}) => {
              this.dataListLoading = false
              if (data && data.code === '0000') {
                that.form.idCardOppositePicUrlSave = data.picPath
              } else {
                // that.$message.error(data.msg)
                that.$message({message: '上传失败', type: 'error'})
              }
            }).catch(({error}) => {
              that.dataListLoading = false
              that.$message({message: error, type: 'error'})
            })
          }
        }
      },
      lastReason () {
        this.$http({
          url: this.$http.adornUrl('/users/getVerifyInfo'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === '0000') {
            this.reason = data.record.remark
            this.form.userName = data.users.realName
            this.form.idCardNumber = data.users.idCard
            if (data.users.idCardFront) {
              this.imgs[0] = data.users.idCardFront
              this.form.idCardFrontPicUrlSave = data.users.idCardFront
            }
            if (data.users.idCardReverse) {
              this.imgs1[0] = data.users.idCardReverse
              this.form.idCardOppositePicUrlSave = data.users.idCardReverse
            }
          } else {
            this.$message({message: data.message, type: 'error'})
          }
        })
      },
      isIntNum (val) {
        var regPos = /^\d+$/ // 非负整数
        if (regPos.test(val)) {
          return true
        } else {
          return false
        }
      },
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
            this.form.userName = data.users.realName
            this.form.idCardNumber = data.users.idCard

            this.showValidate()
          } else {
            this.$message.error(data.message)
          }
        }).catch(({error}) => {
          this.dataListLoading = false
          this.$message.error(error)
        })
      },
    },
    created: function () {
      this.getPersonInfo()
      this.lastReason()
    }
  }
</script>

<style lang="scss" scoped>
.warm{margin-left: 130px;margin-bottom: 38px;}
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
  font-size: 14px;
}
.col-sm-4 {
  width: 370px;
  line-height: 40px;
  display: inline-block;
  vertical-align: top;
  font-size: 14px;
  input {
    width: 100%;
    height: 40px;
    padding-left: 11px;
  }
}
.col-sm-8 {
  display: inline-block;
  vertical-align: top;
  width: 670px;
  font-size: 14px;
}
.combo-form {
  margin-bottom: 30px;
  font-size: 0;
  > * {
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

  .text {
    margin-top: 10px;
    text-align: center;
  }
}
</style>
