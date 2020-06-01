<template>
  <div class="body-grey">
    <main-body navIndex="1">
      <div slot="content">
        <div class="box-card2  zero-padding">
          <div class="box-body no-padding">
            <div class="index-i">
              <img src="/static/img/profile.png" alt="" class="tou">
              <div class="title">
                {{userNumber}}，欢迎您登录皇家娱乐城扩股系统！
                <div class="renzheng">
                  <ul>

                    <li>
                       <el-popover placement="bottom" trigger="hover" :content="person">
                        <el-button slot="reference">
                          <div class="icon" :class="{active:checkPerson}" style="background-image:url(/static/img/i1.png);"></div>
                        </el-button>
                      </el-popover>
                    </li>
                    <!--
                     <li>
                        <el-popover placement="bottom" trigger="hover" content="您还未进行实名认证">
                          <el-button slot="reference"><div class="icon" :class="{active:checkPerson}" style="background-image:url(/static/img/i1.png);"></div></el-button>
                        </el-popover>
                    </li>
                    -->
                    <li>
                      <el-popover placement="bottom" trigger="hover" :content="paymentPassword">
                        <el-button slot="reference">
                          <div class="icon" :class="{active:checkPaymentPassword}" style="background-image:url(/static/img/i2.png);"></div>
                        </el-button>
                      </el-popover>
                    </li>
                    <li>
                      <!-- <el-tooltip class="item" effect="light" :content="phone" placement="bottom">
                        <el-button> -->
                      <el-popover placement="bottom" trigger="hover" :content="phone">
                        <el-button slot="reference">
                          <div class="icon" :class="{active:checkPhone}" style="background-image:url(/static/img/i3.png);"></div>
                        </el-button>
                      </el-popover>
                    </li>
                  </ul>
                  <!-- <div class="icon active" :class="{active:checkPerson}" style="background-image:url(/static/img/i1.png) ;"
                       :title="person"></div> -->
                  <!-- <div class="icon" :class="{active:checkPaymentPassword}" style="background-image:url(/static/img/i2.png) ;" :title="paymentPassword"></div>
                  <div class="icon " :class="{active:checkPhone}" style="background-image:url(/static/img/i3.png) ;" :title="phone"></div> -->
                </div>
              </div>
            </div>
            <div class="my-zichang">
              <div class="title">持有股份</div>
              <!-- <div class="hu in-b">
                <div class="name">虎链积分余额</div>
                <div class="number">{{fund.hci|money}}</div>
              </div> -->
              <!-- <div class="jiang in-b">
                <ul>
                  <li><span class="span">直推奖<span class="hidephone">：</span></span>{{fund.referralBonus|money}}</li>
                  <li><span class="span">出局奖<span class="hidephone">：</span></span>{{fund.outBonus|money}}</li>
                  <li><span class="span">激活奖<span class="hidephone">：</span></span>{{fund.activateBonus|money}}</li>
                  <li><span class="span">提成奖<span class="hidephone">：</span></span>{{fund.deductionBonus|money}}</li>
                </ul>
              </div> -->
              <!-- 已持有股份 -->
              <div class="y-cont y-chiyou"  v-if="owner">
                <div class="y-top">
                  <span>{{shareSum}}</span>
                </div>
                <div class="y-bottom">
                  <span>持有总股权数（股）</span>
                </div>
                <div class="y-apply-btn" @click="agent()" v-if="shareSum >= 3 && agentStatus == 0">申请代理>></div>
                <div class="y-apply-btn-text" v-if="agentStatus == 1">申请代理中</div>
                <div class="y-apply-btn" @click="agent()" v-if="agentStatus == 2">代理审核未通过>></div>
              </div>
              <!-- 未持有股份 -->
              <div class="y-cont y-chiyou"  v-if="!owner">
                <div class="ts">暂时无法持有股份，请先成为<span>vip会员</span></div>
                <div class="gu-btn" @click="$router.push({name:'buy-vip-Package'})">购买vip套餐</div>
              </div>
            </div>
            <div class="my-zichang clearfix">
              <div class="title">账户概况
                <!-- <div class="see-detail pull-right cusor" @click="$router.push({ name: 'myRecommendation' })">查看详情 ></div> -->
              </div>
              <div class="y-cont y-gaikuang">
                <ul class="y-float-left">
                  <li>
                    <h2>累积推荐人数</h2>
                    <span @click="$router.push({name:'myRecommendation'})">{{referrerSum }}</span>
                    <div class="y-more">></div>
                  </li>
                  <li>
                    <h2>累计获得奖励BTC数额</h2>
                    <span @click="$router.push({name:'CapitalDetails'})"></span>
                    <div class="y-more">></span></div>
                  </li>
                </ul>

              </div>

            </div>
          </div>
        </div>
      </div>
    </main-body>
  </div>
</template>
<style lang="scss" scoped>
  .wei {
    width: 35px;
    height: 35px;
    background-image: url(/static/img/ic_chair_dis.png);
    display: inline-block;
    vertical-align: top;
    margin-right: 10px;
  }

  .wei.dang {
    background-image: url(/static/img/ic_chair_dang.png);
  }

  .wei.light {
    background-image: url(/static/img/ic_chair_nor.png);
  }
  .el-popover {
    text-align: center;
  }
  .el-popover--plain {
    padding: 10px 20px;
  }
</style>

<script>
  // import { getUUID } from '@/utils'
  import MainBody from '@/components/common/mainBody'

  export default {
    data() {
      return {
        isShow: true,
        noShow: false,
        checkPerson: false,
        person: '身份未认证',
        checkPaymentPassword: true,
        paymentPassword: '支付密码未设置',
        checkPhone: true,
        phone: '手机未绑定',
        activeNumber: 0,
        owner: true, // 是否持有股份
        shareSum: 0,
        agentStatus:0,
        chooseList: [{
          name: '全部'
        }, {
          name: '待支付'
        }, {
          name: '已完成'
        }, {
          name: '交易关闭'
        }, {
          name: '交易取消'
        }],
        todayGet: '',
        userNumber: '',
        referrerSum: 0,
        fund: {
          totalHci: '',
          hci: '',
          referralBonus: '',
          activateBonus: '',
          benefitBonus: '',
          outBonus: '',
          deductionBonus: '',
        },
        netWork:{
          maxY:1,
          maxX:1,
          levelY:1,
          levelX:1,
        },
      }
    },
    components: {
      MainBody
    },
    methods: {
      resetVal(number) {
        var mNumber = parseInt(number)
        number = number.toString()
        var point = number.split('.')[1];
        // console.log(point)
        mNumber = mNumber.toString()
        if (mNumber.length <= 3) {
          if (!point) {
            return (mNumber == '' ? '0' : mNumber)
          } else {
            return (mNumber == '' ? '0' : mNumber) + '.' + point
          }
        } else {
          var mod = mNumber.length % 3;
          var output = (mod == 0 ? '' : (mNumber.substring(0, mod)))
          for (var i = 0; i < Math.floor(mNumber.length / 3); i++) {
            if ((mod == 0) && (i == 0)) {
              output += mNumber.substring(mod + 3 * i, mod + 3 * i + 3)
            } else {
              output += ',' + mNumber.substring(mod + 3 * i, mod + 3 * i + 3)
            }
          }
          // console.log(typeof point)
          if (!point) {

            return output
          } else {
            return (output + '.<span class="little-num">' + point + '</span>')
          }
        }
        //      return `${val.parseInt}.<span class="little-word">${dian}</span>`
      },
      personFund () {
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
            this.userNumber = data.users.userNumber
            this.referrerSum = data.users.activityTotalSum
            this.shareSum = data.baseSumInfo.totalAmount
            this.agentStatus = data.baseSumInfo.agentStatus
            this.fund.totalHci = data.baseSumInfo.totalBonus
            if (data.users.secondPassword) {
              this.checkPaymentPassword = true
              this.paymentPassword = '支付密码已设置'
            }
            if (data.users.idCardstatus === 2) {
              this.checkPerson = true
              this.person = '身份已认证'
            }
            if (data.users.phone) {
              this.checkPhone = true
              this.phone = '手机已绑定'
            }
          } else {
            this.$message.error(data.message())
          }
        }).catch(({error}) => {
          this.dataListLoading = false
          this.$message.error(error)
        })
      },
      // 申请代理
      agent () {
        if(this.agentStatus ==0){
          this.$confirm(`您是否确定申请成为代理?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http({
              url: this.$http.adornUrl('/casino/agent/insert'),
              method: 'post',
            }).then(({data}) => {
              if (data && data.result === 'SUCCESS') {
                location.reload();
              } else {
                this.$message.error(data.message)
              }
            })
          })
        }else if(this.agentStatus ==2){
          this.$http({
            url: this.$http.adornUrl('/casino/agent/getUserLatestAgent'),
            method: 'post',
          }).then(({data}) => {
            if (data && data.result === 'SUCCESS') {
              this.$confirm("审核未通过原因："+data.casinoAgentApply.remark, '提示', {
                confirmButtonText: '再次申请',
                cancelButtonText: '我知道了',
                type: 'warning'
              }).then(() => {
                this.$http({
                  url: this.$http.adornUrl('/casino/agent/insert'),
                  method: 'post',
                }).then(({data}) => {
                  if (data && data.result === 'SUCCESS') {
                    location.reload();
                  } else {
                    this.$message.error(data.message)
                  }
                })
              })
            } else {
              this.$message.error(data.message)
            }
          })
        }


      }
    },
    filters:{      //数据过滤器
      money:function(value){
        value =Number(value).toFixed(2);
        return value;
      }
    },
    created(){
       this.$http({
          url:'http://192.168.10.104:8190/app/getRechargeInfo',
          method:'post',
//        params:this.$http.adornParams({
//          "id":e.id
//        })
        }).then(({data})=>{
          console.log(data)
        })
    },
    mounted: function () {
      
      this.personFund()
    }
  }
</script>
