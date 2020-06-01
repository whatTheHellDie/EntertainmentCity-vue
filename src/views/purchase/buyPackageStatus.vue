<template>
  <div>
    <my-header></my-header>
    <div class="box-card mb50 mt40">
      <h1>支付成功</h1>
      <div class="box-body">
        <div class="pay-status">
          <img src="/static/img/success.png"/><span class="title"  >恭喜您，您已成功支付订单！</span>
          <div class="to">
            <div class="gu-btn back-index" @click="toOrderViwe()">查看订单</div>
            <div class="gu-btn" @click="toIndexViwe()">返回首页</div>
          </div>
        </div>
      </div>
    </div>
    <div class="box-card mb50 mt40" v-if="status==1">
      <h1>支付失败</h1>
      <div class="box-body">
        <div class="pay-status" >
          <img src="/static/img/failed.png"/><span class="title" >抱歉，您的订单支付失败</span>
          <div class="to">
            <div class="gu-btn back-index">重新下单</div>
            <div class="gu-btn">返回首页</div>
          </div>
        </div>
      </div>
    </div>
    <my-footer></my-footer>
  </div>
</template>
<style lang="scss" scoped>

</style>

<script>
  //import { getUUID } from '@/utils'
  import MyHeader from '@/components/common/header'
  import MyFooter from '@/components/common/footer'
  export default {
    data () {
      return {
        status: 0,
        consignee:'',
        phone:'',
        address:''
      }
    },
    components: {
      MyHeader,
      MyFooter
    },
    created: function () {
      console.log(this.$route.query);
      this.consignee = this.$route.query.consignee;
      this.phone = this.$route.query.phone;
      this.address  = this.$route.query.address;
    },
    methods: {
      toOrderViwe () {
        //跳到订单页面
        this.$router.push({
          name: 'shareOrder',
          query: {}
        })
      },
      toIndexViwe () {
        //跳到主页
        this.$router.push({
          name: 'index',
          query: {}
        })
      }
    }
  }
</script>
