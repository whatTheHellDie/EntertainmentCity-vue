<template>
  <div>
    <my-header></my-header>
    <div class="box-card order-page">
      <!-- <h1>订单详情</h1> -->
      <div class="box-body no-padding">
        <div class="buy-detail">
          <div class="charge-order order-number">
              <ul class="">
                <li>
                  <div class="number">{{product.rightsAmount-product.soldAmount | three}}</div>
                  <div class="content">本期剩余股份（股）</div>
                </li>
              </ul>
              <div class="situation">
                <span class="span blo">当前价格</span>
                <span class="span">CNY : <span class="default2">{{product.price}}</span> 元/股</span>
                <span>BTC约 <span class="default2">{{asBTC | coinFixed}}</span> 枚/股<span><span class="tan in-b">!<div class="tip-box">BTC 价格实时变动，以实际支付为准。</div></span></span></span>
              </div>
            </div>
        </div>
      </div>
    </div>
    <div class="box-card order-page">
      <h1>入股</h1>
      <div class="box-body no-padding">
        <div class="buy-detail">
          <dl>
            <dd><label>最低入股数量 ： </label><span class="span">{{product.limitAmount}}股</span></dd>
            <dd><label>入股数量：</label>
              <span class="span">
                <div class="add_one clearfix">
            <div class="add reduce" @click="subOrAdd(0)">-</div>
            <input type="text" v-model="quantity" @blur="testPatten">
            <div class="pull-left wan">股</div>
            <div class="add pull-right" @click="subOrAdd(1)">+</div>
          </div>
              </span>
            </dd>
            <dd><label>套餐金额：</label><span class="span value"><span class="fu">￥</span>{{buySumRMB}}</span></dd>
            <dd><label>支付币种：</label><span class="span"><span class="box active">BTC</span><div class="need2">（约需要支付 <span class="btc"> {{buySumASBTC}}</span>枚BTC，以实际支付为准）</div></span></dd>
            <dd><label>分红方式：</label><span class="span"><span class="box" :class="{active:shareWay==0}" @click="selectPayWay(0)">年化13%</span><span class="box" :class="{active:shareWay==1}" @click="selectPayWay(1)">季度股份分红</span></span></dd>
            <dd><label>支付方式：</label><span class="span"><span class="box active">币利交易所</span></span></dd>
            <!-- <div class="gu-btn" @click="pay()">提交订单</div> -->
            <div class="gu-btn" @click="checkOrder">提交订单</div>
          </dl>
        </div>
      </div>
    </div>
    <my-footer></my-footer>
    <!--弹窗
    <el-dialog
  title="协议"
  :visible.sync="dialogVisible"
  :show-close="false"
  :close-on-click-modal="false"
  :close-on-press-escape="false"
  class="protocol-wrap"
   :before-close="handleClose"
 >
  <span>内容由运营部提供暂无内容由运营部提供暂无暂无暂
内容由运营部提供暂无内容由运营部提供暂无暂无暂
内容由运营部提供暂无内容由运营部提供暂无暂无暂
内容由运营部提供暂无内容由运营部提供暂无暂无暂
内容由运营部提供暂无内容由运营部提供暂无暂无暂
内容由运营部提供暂无内容由运营部提供暂无暂无暂
内容由运营部提供暂无内容由运营部提供暂无暂无暂
内容由运营部提供暂无内容由运营部提供暂无暂无暂
内容由运营部提供暂无内容由运营部提供暂无暂无暂
内容由运营部提供暂无内容由运营部提供暂无暂无暂
内容由运营部提供暂无内容由运营部提供暂无暂无暂
内容由运营部提供暂无内容由运营部提供暂无暂无暂
内容由运营部提供暂无内容由运营部提供暂无暂无暂
</span>
<div class="check"><el-checkbox v-model="checked" @change="checkAgree">我同意以上协议</el-checkbox></div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="handleClose">不同意</el-button>
    <el-button type="primary"  :class="{active:checked}" @click="agree">确定同意</el-button>
  </span>
</el-dialog> -->
  </div>
</template>
<style lang="scss" scoped>
.tip-box{background-image: url(/static/img/tip-box.png);}
</style>

<script>
  // import { getUUID } from '@/utils'
  import MyHeader from '@/components/common/header'
  import MyFooter from '@/components/common/footer'
  export default {
    data () {
      return {
        checked: false,
        asBTC: 0,
        buySumASBTC: 0,
        quantity: 0,
        buySumRMB: 0,
        toBTCRate: 0,
        shareWay: 0, // 0年化率 1季度分红
        feeRate: 0, // 手续费比列
        feeCoin: '', // 手续费币种
        dialogVisible: true,
        product: {
          id: '',
          price: 0,
          limitAmount: 0,
          soldAmount: 0,
          rightsAmount: 0,
          checked: false
        }
      }
    },
    components: {
      MyHeader,
      MyFooter
    },
    methods: {
      checkOrder () {
        if (this.quantity <= 0) {
          this.$alert('金额不正确', '提示', {
            confirmButtonText: '确定'
          })
          return
        }
        const reg = /^\d{0,2}(\.?\d{1,3})$/
        if (!reg.test(this.quantity)) {
          this.$alert('金额不正确', '提示', {
            confirmButtonText: '确定'
          })
          return
        }
        this.$router.push({name: 'buyPackage-Pay',
          params: {
            id: this.product.id,
            quantity: this.quantity,
            shareWay: this.shareWay,
            buySumRMB: this.buySumRMB,
            buySumASBTC: this.buySumASBTC,
            totalFee: this.totalFee,
            feeCoin: this.feeCoin
          }
        })
      },
      handleClose (){
        this.$router.push({name:'index'})
      },
      agree () {
        if (this.checked) {
          this.dialogVisible = false
        }else{
           this.$alert('请先同意协议', '提示', {
          confirmButtonText: '确定'
        })
        }
      },
      getProduct () {
        this.$http({
          url: this.$http.adornUrl('/casino/product/getInfo'),
          method: 'post',
          params: this.$http.adornParams({
            'id': this.product.id
          })
        }).then(({data}) => {
          if (data && data.code === '0000') {
            this.asBTC = data.asBTC
            this.product = data.product
            this.toBTCRate = data.toBTCRate
            this.feeRate = data.feeRate
            this.feeCoin = data.feeCoin
          } else if (data.code === '1053') {
            this.$router.push({name: 'index'})
          } else {
            this.$message.error(data.message)
          }
        })
      },
      subOrAdd (flag) {
        this.testPatten()
        var step = parseFloat(this.product.limitAmount)
        var oldValue = parseFloat(this.quantity)
        var remaind = parseFloat((this.product.rightsAmount - this.product.soldAmount))
        if (flag === 0) {
          oldValue -= step
          if (oldValue < 0) {
            this.quantity = 0
            this.calc()
            return
          }
          this.quantity = oldValue.toFixed(3)
          this.calc()
        } else if (flag === 1) {
          oldValue += step
          if (oldValue > remaind) {
            this.quantity = remaind
            this.calc()
            return
          }
          this.quantity = oldValue.toFixed(3)
          this.calc()
        }
      },
      testPatten () {
        const reg = /^\d{0,2}(\.?\d{1,3})$/
        if (!reg.test(this.quantity)) {
          this.quantity = 0
          this.buySumRMB = 0
        }
        if (this.quantity > (this.product.rightsAmount - this.product.soldAmount)) {
          this.quantity = this.product.rightsAmount - this.product.soldAmount
        }
        this.calc()
      },
      // 联动计算
      calc () {
        this.buySumRMB = (this.quantity * this.product.price).toFixed(2)
        this.buySumASBTC = (this.quantity * this.product.price * this.toBTCRate).toFixed(8)
        this.totalFee = (this.buySumASBTC * this.feeRate).toFixed(8)
      },
      selectPayWay (flag) {
        this.shareWay = flag
      },
      checkAgree () {
        if (event.target.checked) {
          this.checked = true
        } else {
          this.checked = false
        }
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
    filters: {      // 数据过滤器
      coinFixed: function (value) {
        value = Number(value).toFixed(8)
        return value
      },
      three: function (value) {
        value = Number(value).toFixed(3)
        return value
      }
    },
    created: function () {
      // this.product = this.$route.params.product

      this.routeParamsStorage('buyPackage', 'product')
      this.getProduct()
    }
  }
</script>
