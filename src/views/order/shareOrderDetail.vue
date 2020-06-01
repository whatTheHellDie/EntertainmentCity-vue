 <template>
  <div class="body-grey">
    <main-body navIndex="1">
      <div slot="content">
        <div class="box-card2">
          <div class="top-nav">
            <div aria-label="Breadcrumb" role="navigation" class="el-breadcrumb">
              <span class="el-breadcrumb__item">
                <span role="link" class="el-breadcrumb__inner">订单管理</span>
                <i class="el-breadcrumb__separator el-icon-arrow-right"></i>
              </span>
              <span class="el-breadcrumb__item">
                <span role="link" class="el-breadcrumb__inner">入股订单</span>
                <i class="el-breadcrumb__separator el-icon-arrow-right"></i>
              </span> <span class="el-breadcrumb__item bold" aria-current="page">
                <span role="link" class="el-breadcrumb__inner default2">订单详情</span>
                <i class="el-breadcrumb__separator el-icon-arrow-right"></i></span></div>
          </div>

          <div class="box-body min425">
            <div class="share-order-detail ">
            <dl class="clearfix">
            <dt class="default2">订单信息</dt>
            <dd><span class="span">订单编号 ：</span><span class="content">{{order.orderNumber}}</span></dd>
            <dd><span class="span">下单时间 ：</span><span class="content">{{order.createTime}}</span></dd>
            <dd><span class="span">支付时间 ：</span><span class="content">{{order.createTime}}</span></dd>
            <dd><span class="span">支付类型 ：</span><span class="content">{{order.payCoin}}</span></dd>
            <dd><span class="span">交易所手续费类型 ：</span><span class="content">{{order.feeCoin}}</span></dd>
            <dd><span class="span">支付数额 ：</span><span class="content">{{order.payAmount | coin}} 枚</span></dd>
            <dd><span class="span">交易所手续费数额 ：</span><span class="content">{{order.fee | coin}} 枚</span></dd>
            <dd><span class="span">订单状态 ：</span><span class="content">已完成</span></dd>
          </dl>

            <el-table :data="productList" class="grey-table pink-table" border>
              <el-table-column  label="入股单价" width="450">
                <template slot-scope="scope">
                   <div class="y-content w402 clearfix">
                    <span class="cny">CNY: {{scope.row.price}}元/股</span>
                    <span class="cny BTC">BTC: {{scope.row.price * scope.row.biliexRate | coin}}枚/股</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="buyNumber" label="数量（股）">
              </el-table-column>
              <el-table-column prop="bonusRelease" label="分红方式">
                </el-table-column>
            </el-table>
            </div>
          </div>
        </div>
      </div>
    </main-body>
  </div>
</template>

<script>
  // import { getUUID } from '@/utils'
  import MainBody from '@/components/common/mainBody'
  import PhoneColumn from '@/components/common/phoneColumn'
  export default {
    data() {
      return {
        mapJson: '../static/json/map.json',
        requestId: '',
        order: {
          id: '',
          orderNumber: '',
          buyAmount: 0,
          payAmount: 0,
          fee: 0,
          payCoin: '',
          feeCoin: '',
          buyNumber: 0,
          bonusRelease: 0,
          createTime: '',
          biliexRate: '',
          remark: ''
        },
        productList: [{
          price: '0',
          buyNumber: '0',
          biliexRate: '0',
          bonusRelease: '0'}]
      }
    },
    computed: {},
    components: {
      MainBody,
      PhoneColumn
    },
    methods: {
      getProduct () {
        this.$http({
          url: this.$http.adornUrl('/casino/order/getInfo'),
          method: 'post',
          params: this.$http.adornParams({
            'id': this.requestId
          })
        }).then(({data}) => {
          if (data && data.code === '0000') {
            this.order = data.order
            this.productList = [{
              price: this.order.price,
              buyNumber: this.order.buyNumber,
              biliexRate: this.order.biliexRate,
              bonusRelease: this.showShareWay(this.order.bonusRelease)
            }]
          } else {
            this.$message.error(data.message)
          }
        })
      },
      showShareWay: function (value) {
        if (value === 0) {
          return '年化13%'
        } else if (value === 1) {
          return '季度股份分红'
        }
      }
    },
    filters: { // 数据过滤器
      coin: function (value) {
        value = Number(value).toFixed(8)
        return value
      }
    },
    created: function () {
      this.requestId = this.$route.params.id
      this.getProduct()
    }
  }
</script>

<style lang="scss" scoped>
</style>
