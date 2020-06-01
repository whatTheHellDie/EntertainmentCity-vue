<template>
  <div>
    <my-header></my-header>
    <div class="box-card order-page">
      <h1>购买vip套餐</h1>
      <div class="box-body no-padding">
        <div class="buy-detail">
          <dl>
            <dd><label>关注号（推荐人）：</label><span class="span"><el-input v-model="input"></el-input></span></dd>
            <dd><label>排队号（接点人）：</label><span class="span"><el-input v-model="input"></el-input></span></dd>
            <dd><label>接点区域：</label>
              <span class="span">
                <el-select v-model="value" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </span>
            </dd>
            <dd><label>套餐金额：</label><span class="span value"><span class="fu">￥</span>200.00</span></dd>
            <dd><label>支付币种：</label><span class="span"><span class="box active">CNY</span><div class="need">需要支付<span class="default2">200</span>元人民币</div></span></dd>
            <dd><label>支付方式：</label>
              <span class="span">
                <span class="box box2" :class="{active:payway==0}" @click="payway=0"><img src="/static/img/weixin.png" alt="" /></span>
                <span class="box box2" :class="{active:payway==1}" @click="payway=1"><img src="/static/img/alipay.png" alt="" /></span>
              </span>
            </dd>
            <dd><label>支付密码：</label><span class="span"><el-input v-model="input"></el-input></span></dd>
            <dd><label></label></dd>
            <div class="gu-btn" @click="pay()">提交订单</div>
          </dl>
        </div>
      </div>
    </div>
    <my-footer></my-footer>
  </div>
</template>
<style lang="scss" scoped>

</style>

<script>
  // import { getUUID } from '@/utils'
  import MyHeader from '@/components/common/header'
  import MyFooter from '@/components/common/footer'
  export default {
    data () {
      return {
        input:"",
        value:'1',
         options: [{
          value: '1',
          label: 'A区'
        }, {
          value: '2',
          label: 'B区'
        }],
        payway:0
      }
    },
    components: {
      MyHeader,
      MyFooter
    },
    methods: {
      countdown () {
        // sessionStorage.setItem('totalTime', this.totalTime)

        var computeTime = sessionStorage.getItem('totalTime')
        var time = setInterval(() => {
          if(this.$route.path!="/buyPackage-Pay"){
               // 关闭定时器
            clearInterval(time)
            // 清空时间
            sessionStorage.removeItem('totalTime')
            return false;
          }
          
          if (computeTime <= 0) {
            // 关闭定时器
            clearInterval(time)
            // 清空时间
            sessionStorage.removeItem('totalTime')
            // 跳转到首页
            this.$router.push({
              name: 'buyPackage'
            })
            return
          }
          this.totalTime = computeTime
          computeTime--
          sessionStorage.setItem('totalTime', computeTime)
        }, 1000)
      },
      pay () {
        var stageCurrent = Number(this.stageCurrent)
        if (stageCurrent === 1) { // 第一阶段
          this.$http({
            url: this.$http.adornUrl('/shares/au/first/stage/pay'),
            method: 'post',
            data: this.$http.adornData({
              'currentStage': this.stageCurrent,
              'currentRound': this.roundCurrent,
              'sendYyiQuantity': this.yyiQuantity,
              'payUsdtAmount': this.payUsdtAmount,
              'payPassword': this.payPassword
            })
          }).then(({data}) => {
            if (data && data.code === '0000') {
              this.$message.success(data.msg)
              // 跳到支付成功页面
              this.$router.push({
                name: 'buyPackageStatus',
                query: {
                  status: 0
                }
              })
            } else if (data && data.code === '03107') {
              this.$confirm(data.msg, '提示', {
                confirmButtonText: '设置支付密码',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.$router.push({ name: 'setPaymentPassword' })
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        } else if (stageCurrent === 2) { // 第二阶段
          this.$http({
            url: this.$http.adornUrl('/shares/au/second/stage/pay'),
            method: 'post',
            data: this.$http.adornData({
              'currentStage': this.stageCurrent,
              'currentRound': this.roundCurrent,
              'sendYyiQuantity': this.yyiQuantity,
              'payUsdtAmount': this.payUsdtAmount,
              'payPassword': this.payPassword
            })
          }).then(({data}) => {
            if (data && data.code === '0000') {
              this.$message.success(data.msg)
              // 跳到支付成功页面
              this.$router.push({
                name: 'buyPackageStatus',
                query: {
                  status: 0
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })

        }

      },
      resetPaymentPassword () {
        // 跳到重置支付密码页面
        this.$router.push({
          name: 'resetPaymentPassword'
        })
      }
    },
    created: function () {
      this.stageCurrent = this.$route.query.stageCurrent
      this.roundCurrent = this.$route.query.roundCurrent
      this.yyiQuantity = this.$route.query.yyiQuantity
      this.payUsdtAmount = this.$route.query.payUsdtAmount
      // 倒计时
      this.countdown()
    }
  }
</script>
