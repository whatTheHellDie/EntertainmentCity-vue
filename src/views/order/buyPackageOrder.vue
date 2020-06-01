<template>
  <div class="body-grey">
    <main-body navIndex="1">
      <div slot="content">
        <div class="box-card2 mt20">
          <div class="box-body no-padding">
            <div class="charge-list">
              <div class="choose-box">
                <div class="choose-list">
                  <div v-for="item,i in chooseList" class="box" @click="loadList(i)" :class="{'active':activeNumber == i}"><span class="span">{{item.name}}</span></div>

                </div>
              </div>
            </div>
            <div class="bechoose-list">
              <dl v-if="chooseContent.length">
                <dd class="clearfix" v-for="item,i in chooseContent">
                  <div class="clearfix">
                    <div class="title clearfix">订单编号：<span class="cnumber">{{item.number}}</span>
                      <div class="show-phone"></div>
                      <span class="download" v-if="item.status==3||item.status==2" ><a href="http://39.108.159.195/pics/POS支付收单协议20180921(1).docx">下载合同</a></span><span v-show="false" class="download"  @click="confirmGet(item.id,i,2)" v-if="item.status==3||item.status==2" >收件信息</span>
                      <span class="download" v-if="item.status==4"><a href="http://39.108.159.195/pics/POS支付收单协议20180921(1).docx">下载合同</a></span><span v-show="false" class="download"  @click="confirmGet(item.id,i,3)" v-if="item.status==4" >寄件信息</span>
                      <span v-if="item.status==1" class="span active">待处理</span>
                      <span v-if="item.status==2" class="span active">待发货</span>
                      <span v-if="item.status==3" class="span active">待发货</span>
                      <span v-if="item.status==4" class="span">已发货</span>
                      <span v-if="item.status==5" class="span">已收货</span>
                      <span v-if="item.status==6" class="span">取消订单</span>
                    </div>
                    <div class="left">
                      <div class="content">
                        <div class="number">商品名称<br> <span class="hao">{{item.goodsName}}</span></div>
                        <div class="number">数量<br> <span class="hao">{{item.amount}}</span></div>
                        <div class="number">规格<br> <span class="hao">{{item.specification}}</span></div>
                      </div>
                      <div class="content" style="padding-bottom: 0;">
                        <div class="info">
                          <icon-svg name="man" class="site-sidebar__menu-icon hide-phone"></icon-svg>
                          {{item.consignee}}，{{item.phone}}，{{item.address}}
                        </div>
                      </div>
                    </div>
                    <div class="gradient"></div>
                    <div class="right">
                      <div class="he">合计<br><span class="default"> {{item.actualPay}}</span></div>
                    </div>
                    <div class="right right1">
                      <span v-if="item.status==4">
                      <div class="see-btn see-btn1" @click="confirmGet(item.id,i,1)">确认收货</div>
                    </span>
                      <div class="see-btn" @click="seeImg(item.id,item.uploadUrl)">查看凭证</div>
                    </div>
                  </div>
                  <div class="d-time">
                    <span class="hao">下单时间</span>：{{item.createTime}}
                  </div>
                </dd>
              </dl>
							<div v-else><img src="/static/img/no-data.jpg" alt="暂无数据" class="no-data"></div>
            </div>
            <div class="block" style="text-align: center;margin: 30px 0 40px">
              <el-pagination v-show="elementTotal" @size-change="sizeChangeHandle" @current-change="currentChangeHandle" background="" :current-page="pageNum" :page-size="pageSize" layout="prev, pager, next, jumper" :total="elementTotal">
              </el-pagination>
            </div>

          </div>
        </div>
      </div>
    </main-body>
    <!--弹窗-->
  <el-dialog title="寄件信息" :visible.sync="dialogVisible" width="30%">
		<div v-if="chooseContent.length" >
      <div v-if="fromType ==3">
        <div class="mb20">快递公司：{{chooseContent[getIndex].expressCompany}}</div>
        <div class="mb20">快递单号：{{chooseContent[getIndex].expressNumber}}</div>
        <span slot="footer" class="dialog-footer" style="text-align: center;" v-if="fromType == 3">
                          <el-button type="primary" @click="dialogVisible=false">好的</el-button>
                        </span>
      </div>
      <div v-else>
      <div class="mb20">收件人：{{chooseContent[getIndex].consignee}}</div>
      <div class="mb20">收件地址：{{chooseContent[getIndex].address}}</div>
      <div class="mb20">联系电话：{{chooseContent[getIndex].phone}}</div>
      <span slot="footer" class="dialog-footer" style="text-align: center;" v-if="fromType == 1">
                          <el-button type="primary" @click="clickOk(chooseContent[getIndex].number,chooseContent[getIndex].status)">好的</el-button>
                        </span>
      <span slot="footer" class="dialog-footer" style="text-align: center;" v-if="fromType == 2">
                          <el-button type="primary" @click="dialogVisible=false">好的</el-button>
                        </span>

      </div>
		</div>
    </el-dialog>
    <el-dialog title="查看凭证" :visible.sync="imgVisible" width="30%" >

      <img :src="uploadUrl" style="max-width: 100%;display: block;margin: 0 auto;"/>
      <span slot="footer" class="dialog-footer" style="text-align: center;">
                          <el-button type="primary" @click="imgVisible = false">好的</el-button>
                        </span>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
  .mb20 {
    margin-bottom: 20px;
  }
</style>

<script>
  //import { getUUID } from '@/utils'
  import MainBody from '@/components/common/mainBody'
  export default {
    data() {
      return {
        getIndex:0,
        dialogVisible: false,
        imgVisible:false,
        pageNum: 1,
        pageSize: 5,
        elementTotal: 0,
        currentPage3: 5,
        activeNumber: 0,
        orderNumber: '',
        index: 0,
        orderCount: '',
        usdtTotal: 0,
        usdtSurplus: '',
        chooseList: [{
            name: '全部'
          },
          {
            name: '待处理'
          },
          {
            name: '待发货'
          },
          {
            name: '已发货'
          },
          {
            name: '已收货'
          },
        ],
        fromType:'',
        uploadUrl:'/static/img/sub.png',
        chooseContent: [{
          number: "",
          status: '',
          goodsName: '',
          consignee:'',//收货人
          chargeVoucher: "/static/img/sub.png",
          address: '',
          phone: '',
          expressNumber:'',
          expressCompany:'',
          specification: '',
          createTime: '', //下单时间
          uploadUrl: '', //查看凭证
          amount: '', //套餐数量
          actualPay: '' //支付金额
        }]
      }
    },
    created() {
      this.loadList(0)
    },
    components: {
      MainBody
    },
    methods: {
      seeImg(id,uploadUrl) {
        this.imgVisible=true;
        this.uploadUrl = uploadUrl;
      },
      confirmGet(id,index,fromType) {
        this.getIndex=index;
        this.dialogVisible=true;
        this.fromType =fromType;
      },
      //i  0=全部，1=待处理，2=待配货，3=待发货，4=已发货，5=已收货
      loadList(i) {
        this.dataListLoading = true
				this.activeNumber=i;
        this.index = i
        if(i == 0) {
          i = '';
        }
        if (i>=3) {
          i = i+1;
        }
        this.$http({
          url: this.$http.adornUrl('/order/queryOrderList'),
          method: 'get',
          params: this.$http.adornParams({
            'pageNum': this.pageNum,
            'pageSize': this.pageSize,
            'status': i,
            'platform': 2
          })
        }).then(({
          data
        }) => {
          if(data && data.code === '0000') {
            console.log(data.data.dataList)
            this.chooseContent = data.data.dataList;
            this.elementTotal = data.data.elementTotal;
            this.dataListLoading = true;

          } else {
            this.dataList = []
            this.elementTotal = 0
          }
          this.dataListLoading = false;
        })
      },

      // 每页数
      sizeChangeHandle(val) {
        this.pageSize = val
        this.pageNum = 1
        this.loadList(this.index)
      },
      // 当前页
      currentChangeHandle(val) {
        this.pageNum = val
        this.loadList(this.index)
      },
      clickOk(number,status) {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/order/confirm/receipt'),
          method: 'post',
          data: this.$http.adornData({
            number:number,
            status:status
          })
        }).then(({
                   data
                 }) => {
          if(data && data.code === '0000') {
            console.log(data.data.dataList)
            this.dataListLoading = true
          } else {
            this.dataList = []
            this.elementTotal = 0
          }
          location.reload()
          this.dataListLoading = false;
        })
      },
    },
    // 导出
    exportData() {
      this.$http({
        url: this.$http.adornUrl('http://192.168.0.104/pics/POS支付收单协议20180921(1).docx'),
        method: 'get',
        params: this.$http.adornParams({

        }),
        responseType: 'arraybuffer'
      }).then(({
                 data
               }) => {
        let blob = new Blob([data], {
          type: 'application/vnd.ms-docx;charset=UTF-8'
        })
        let objectUrl = URL.createObjectURL(blob)
        let link = document.createElement('a')
        link.href = objectUrl
        link.download = '商品订单信息.xls'

        // 此写法兼容火狐浏览器
        document.body.appendChild(link)

        let evt = document.createEvent('MouseEvents')
        evt.initEvent('click', false, false)
        link.dispatchEvent(evt)

        window.URL.revokeObjectURL(objectUrl)
        this.dataListLoading = false
      })
    },

    mounted() {
      //    var clipboard = new ClipboardJS('.copy');
      //
      //    clipboard.on('success', function(e) {
      //        e.clearSelection()
      //    });
      //    clipboard.on('error', function(e) {
      //        alert('该默认浏览器不支持点击复制,请长按选择复制钱包地址或选择分享二维码图片')
      //    });
    }
  }
</script>
