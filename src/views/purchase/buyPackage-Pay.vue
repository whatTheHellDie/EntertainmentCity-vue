<template>
  <div>
    <my-header></my-header>
    <div class="box-card order-page">
      <h1>购买详情</h1>
      <div class="box-body no-padding">
        <div class="buy-detail">
          <dl>
            <dd><label>入股数量 ： </label><span class="span">{{quantity | three}}股</span></dd>
            <dd><label>分红方式 ： </label><span class="span" >{{shareWay | showShareWay}}</span></dd>
            <dd><label>支付方式 ： </label><span class="span">币利交易所</span></dd>
          </dl>
        </div>
      </div>
    </div>
    <div class="box-card order-page">
      <h1>支付 <span class="fon14">（币价值实时变动，以实际支付数额为准）</span></h1>
      <div class="box-body no-padding">
        <div class="buy-detail">
          <dl>
            <dd><label>支付类型 ： </label><span class="span">BTC</span></dd>
            <dd><label>支付数额 ： </label><span class="span">约 <span class="default2">{{buySumASBTC}}</span></span></dd>
            <dd><label>交易所手续费类型 ： </label><span class="span">{{feeCoin}}</span></dd>
            <dd><label>交易所手续费数额 ： </label><span class="span">约 <span class="default2">{{totalFee}}</span></span></dd>
            <dd><label>交易所安全密码 ： </label><span class="span"><el-input v-model="payPassword" type="password" placeholder="请输入交易所安全密码"></el-input></span></dd>
            <!-- <div class="gu-btn" @click="pay()">确认支付</div> -->
            <div class="gu-btn" :class="{'disabled': isDisabled}" @click="checkout">确认支付</div>
          </dl>
        </div>
      </div>
    </div>
    <my-footer></my-footer>
  </div>
</template>
<style lang="scss" scoped>
.tip-box{background-image: url(/static/img/tip-box.png);}
</style>

<script>
  // import { getUUID } from '@/utils'
  import MyHeader from '@/components/common/header'
  import MyFooter from '@/components/common/footer'
import { setTimeout } from 'timers';
  export default {
    data () {
      return {
        isDisabled: false,
        isCheckout: true,
        payPassword: '',
        productId: '',
        dividend: 0,
        quantity: 0,
        shareWay: 0,
        buySumASBTC: 0,
        fee: 0,
        feeCoin: '',
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
              // name: 'buyPackage'
            })
            return
          }
          this.totalTime = computeTime
          computeTime--
          sessionStorage.setItem('totalTime', computeTime)
        }, 1000)
      },
      checkout () {
        if (this.isCheckout) {
          // $router.push({name:'buyPackageStatus'})
          if (this.payPassword === '' || this.payPassword === null) {
            this.$message.error('请输入安全密码')
            return
          }
          this.isDisabled = true;
          this.isCheckout = false; // 关锁
          this.$http({
            url: this.$http.adornUrl('/casino/order/checkout'),
            method: 'post',
            params: this.$http.adornParams({
              'productId': this.id,
              'quantity': this.quantity,
              'shareWay': this.shareWay,
              'payPassword': this.payPassword,
              'buyAmount': this.buySumRMB
            })
          }).then(({data}) => {
            this.isDisabled = false;
            this.isCheckout = true; // 开锁
            if (data && data.code === '0000') {
              this.$message.success(data.message)
              // 跳到支付成功页面
              this.$router.push({
                name: 'buyPackageStatus',
                query: {
                  status: 0
                }
              })
            } else if (data && data.code === '1036') {
              this.$router.push({ name: 'login' })
            } else if (data && data.code === '03107') {
              this.$confirm(data.msg, '提示', {
                confirmButtonText: '设置支付密码',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.$router.push({ name: 'setPaymentPassword' })
              })
            } else {
              this.$message.error(data.message)
            }
          })
        }
      },
      resetPaymentPassword () {
        // 跳到重置支付密码页面
        this.$router.push({
          name: 'resetPaymentPassword'
        })
      },
      routeParamsStorage (page, ...arg) { // 把上个页面传进来的数据存到Storage，避免刷新页面时获取不到数据
        arg.forEach(ele => {
          if (this.$route.params[ele] != undefined) { // 进人页面，数据从$route里取
            this[ele] = this.$route.params[ele];
            localStorage[ele] = typeof this[ele] === 'object' ? JSON.stringify(this[ele]) : this[ele];
            localStorage[page + 'flag'] = typeof this[ele] === 'object' ? 'obj' : 'str';
          } else { // 刷新页面，数据从Storage取
            this[ele] = localStorage[page + 'flag'] === 'obj' ? JSON.parse(localStorage[ele]) : localStorage[ele];
          }
        });
      }
    },
    filters: {  // 数据过滤器
      showShareWay: function (value) {
        value = parseInt(value); // 避免页面刷新后，value变string类型
        if (value === 0) {
          return '年化13%'
        } else if (value === 1) {
          return '季度股份分红'
        }
      },
      three: function (value) {
        value = Number(value).toFixed(3)
        return value
      }
    },
    created: function () {
      // this.id = this.$route.params.id
      // this.quantity = this.$route.params.quantity
      // this.shareWay = this.$route.params.shareWay
      // this.buySumASBTC = this.$route.params.buySumASBTC
      // this.totalFee = this.$route.params.totalFee
      // this.buySumRMB = this.$route.params.buySumRMB
      // this.feeCoin = this.$route.params.feeCoin
      this.routeParamsStorage('buyPackagePay', 'id', 'quantity', 'shareWay', 'buySumASBTC', 'totalFee', 'buySumRMB', 'feeCoin')
      // 倒计时
      this.countdown()
    }
  }
</script>
