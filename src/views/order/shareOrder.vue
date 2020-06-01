<template>
  <div class="body-grey">
    <main-body navIndex="1">
      <div slot="content">
        <div class="box-card2">
          <div class="box-body no-padding">
            <div class="charge-order">
              <ul class="order-number">
                <li>
                  <div class="number">{{!elementTotal ? '0' : elementTotal}}</div>
                  <div class="content">订单总数（笔）</div>
                </li>
                <li>
                  <div class="number">{{!totalShareNum ? '0.0' : totalShareNum}}</div>
                  <div class="content">累计持有总股权数（股）</div>
                </li>

              </ul>
            </div>
            <div class="bechoose-list rugu-list">
              <dl v-if="order.length">
                <dd class="clearfix" v-for="item,i in order">
                  <div class="clearfix">
                    <div class="title clearfix">入股订单编号：{{item.orderNumber}}
                      <span class="span active">已完成</span>
                    </div>
                    <div class="left clearfix">
                      <div class="yy-content">
                        <div class="yy-title">入股单价</div>
                        <div class="y-content w402 clearfix">
                          <span class="cny">CNY: {{item.price}}元/股</span>
                          <span class="cny BTC">BTC: {{item.price * item.biliexRate | coinFixed}}枚/股</span>
                        </div>
                      </div>
                      <div class="yy-content">
                        <div class="yy-title">入股数量</div>
                        <div class="y-content min60 clearfix">
                          <span>{{item.buyNumber}}</span>
                        </div>
                      </div>
                      <div class="yy-content">
                        <div class="yy-title">支付数额（BTC）</div>
                        <div class="y-content min230 clearfix">
                          <span class="default2 he-BTC">{{item.payAmount | coinFixed}}</span>
                        </div>
                      </div>
                      <div class="see-btn pull-right" @click="toDetail(item.id)">查看详情</div>
                    </div>
                  </div>
                </dd>
              </dl>
              <div v-else><img src="/static/img/no-data.jpg" alt="" class="no-data" /></div>
            </div>

            <div class="block" style="text-align: center;margin: 30px 0 40px" v-if="order.length">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                background=""
                :current-page="pageNum"
                :page-size="pageSize"
                layout="prev, pager, next, jumper"
                :total="elementTotal">
              </el-pagination>
            </div>

          </div>
        </div>
      </div>
    </main-body>
  </div>
</template>
<style lang="scss" scoped>
.no-data{
  display: block;
  margin: 0 auto;
  padding: 130px 0;
}
</style>

<script>
  // import { getUUID } from '@/utils'
  import MainBody from '@/components/common/mainBody'
  export default {
    data () {
      return {
        elementTotal: '0',
        totalShareNum: '0',
        totalNumberBTCAmount: '0',
        pageNum: 1,
        pageSize: 5,
        order: [{
          number: '',
          price: 0,
          biliexRate: 0,
          quantity: 0,
          payAmount: 0
        }]
      }
    },
    components: {
      MainBody
    },
    created () {
      this.loadList()
    },
    methods: {
      loadList (i) {
        this.activeNumber = i
        this.$http({
          url: this.$http.adornUrl('/casino/order/listForFront'),
          method: 'post',
          params: this.$http.adornParams({
           pageNum: this.pageNum,
           pageSize: this.pageSize
          })
        }).then(({data}) => {
         if (data && data.code === '0000') {
           this.elementTotal = data.elementTotal
           this.totalShareNum = data.totalShareNum
           this.order = data.list
         } else {
           this.dataList = []
           this.elementTotal = 0
         }
         this.dataListLoading = false
        })
      },
      toDetail (id) {
        this.$router.push({name: 'shareOrderDetail',
          params: {
            id: id
          }
        })
      },
      // 每页数
      handleSizeChange(val) {
        this.pageSize = val
        this.pageNum = 1
        this.loadList()
      },
      // 当前页
      handleCurrentChange (val) {
        this.pageNum = val
        this.loadList()
      },
      pay (id) {
      },
      cancelOrder (id) {
      },
      delOrder (id) {
      }
    },
    filters:{      //数据过滤器
      coinFixed:function(value){
        value =Number(value).toFixed(8);
        return value;
      }
    },
    mounted () {
    }
  }
</script>
