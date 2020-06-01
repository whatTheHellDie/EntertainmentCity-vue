<template>
  <div>
    <my-header></my-header>
    <el-carousel>
      <el-carousel-item v-for="item in carousel" :key="item.id">
        <div class="carousel-img y-carousel-img" :style="{backgroundImage:'url(' + item.showPath + ')'}"></div>
      </el-carousel-item>
    </el-carousel>
    <div class="bdb">
      <div class="wrap">
        <div class="scroll_bg">
          <icon-svg name="laba" class="site-sidebar__menu-icon index-public"></icon-svg>
          <ul class="scroll_content" :style="{ top }">
            <li v-for="(item,index) in invit_info.text_roll" @click="$router.push({name:'newsDetails',params:{title:item.title,publishTime:item.publishTime,content:item.content}})">公告：{{item.title}}</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="progress-wrap">
      <div class="wrap" v-for="item in productList">
        <div class="progress-title">第&nbsp;{{item.periodization}}&nbsp;期</div>
        <div class="progress-one clearfix">
          <div class="hang clearfix">
            <!-- <div class="status pull-left">进行中</div> -->
            <div class="status pull-left" :class="{status1:item.statusOne}" >{{ item.statusStr }}</div>
          </div>
          <div class="left">
            <div role="progressbar" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100" class="el-progress m-progress el-progress--circle">
              <div class="el-progress-circle" style="height: 220px; width: 220px;">
                <svg viewBox="0 0 100 100">
                  <path d="M 50 50 m 0 -47 a 47 47 0 1 1 0 94 a 47 47 0 1 1 0 -94" stroke="#b71f6a" stroke-width="4.5" fill="none" class="el-progress-circle__track"></path>
                  <path d="M 50 50 m 0 -47 a 47 47 0 1 1 0 94 a 47 47 0 1 1 0 -94" stroke-linecap="round" stroke="#fff" stroke-width="4.5" fill="none" class="el-progress-circle__path"
                    :style="{'stroke-dasharray':item.w}"  style=" stroke-dashoffset: 270.02px; transition: stroke-dashoffset 0.6s ease 0s, stroke 0.6s ease;"></path>
                </svg>
              </div>
              <div class="el-progress__text">{{item.rate}}<span class="size">%</span>
                <div class="pei">已出售</div>
              </div>
            </div>
            <div class="have">本期剩余：<span>{{ item.rightsAmount-item.soldAmount | three}}</span>股</div>
          </div>
          <div class="right">
            <dl>
              <dt>娱乐城扩股，售卖{{item.rightsAmount}}股</dt>
              <dd>
                <icon-svg name="target" class="site-sidebar__menu-icon"></icon-svg>目标出售股份：{{item.rightsAmount}}股</dd>
              <dd>
                <icon-svg name="qipei" class="site-sidebar__menu-icon"></icon-svg>目标扩股金额：{{item.amount}}元</dd>
              <dd>
                <icon-svg name="present" class="site-sidebar__menu-icon"></icon-svg>最低入股数量：{{item.limitAmount}}股</dd>
            </dl>
            <div class="time-price">
              <div class="title">当前单价</div>
              <div class="content"><span class="span">CNY：{{item.price}}元/股</span><span class="span">BTC约：{{item.btc}}枚/股</span>
                <el-button class="gu-btn pull-right" :class="{'no-use':item.disBtn}"  @click="toBuyPackage(item)">{{item.textBtn}}</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <my-footer></my-footer>
  </div>
</template>
<style lang="scss" scoped>
.progress-title{background-image: url(/static/img/jieduan.png);}
  .progress-one{background-image: url(/static/img/gu-bg.jpg);}
  .gu-btn{background: url(/static/img/gu-btn.png);margin-right: 30px;}
  .gu-btn.no-use{background: #666;}
</style>

<script>
  // import { getUUID } from '@/utils'
  import MyHeader from '@/components/common/header'
  import MyFooter from '@/components/common/footer'
  export default {
    data(){
      return {
        isVipAndAbove: '0',
        carousel: [],
        productList: [],
        invit_info: {
          text_roll: []
        },
        activeIndex: 0,
        w: '270px,300.022px',  // 默认样式 第一阶段已出售比例的画图样式【0% = '270px,300.022px'，100% = '564px,300.022px'，564 = (100 * 2.94) + 270】
      }
    },
    components: {
      MyHeader,
      MyFooter
    },
    computed: {
      top() {
        return -this.activeIndex * 43 + 'px';
      }
    },
    mounted() {
      let _this = this;
      setInterval(function() {
        if(_this.activeIndex < _this.invit_info.text_roll.length - 1) {
          _this.activeIndex += 1;
        } else {
          _this.activeIndex = 0;
        }
      }, 3000);
    },
    created() {
      this.getInfo();
    },
    methods: {
      getInfo(){
         this.$http({
          url:'http://192.168.10.104:8190/app/getRechargeInfo',
          method:'post',
//        params:this.$http.adornParams({
//          "id":e.id
//        })
        }).then(({data})=>{
          console.log(data)
        })
//      this.$http({
//        url: this.$http.adornUrl('/casino/index/getIndexData'),
//        method: 'post',
//        // params: this.$http.adornParams()
//      }).then(({data}) => {
//        if (data && data.code === '0000') {
//          this.invit_info.text_roll=data.noticeList;
//          this.carousel=data.bannerList;
//          this.productList=data.productList;
//          for(let i =0;i<this.productList.length;i++){
//            let rate=this.productList[i].soldAmount/this.productList[i].rightsAmount*100
//            this.productList[i].rate=(rate == 100 || rate == 0) ? rate :rate.toFixed(1);
//            this.productList[i].w=((this.productList[i].rate*2.94)+270)+"px,300.022px";
//            this.productList[i].btc=(this.productList[i].price/data.rmbRate).toFixed(8);
//            if(this.productList[i].status == 0){
//              this.productList[i].statusStr = '敬请期待'
//              this.productList[i].textBtn = '即将开始'
//              this.productList[i].disBtn = true
//            }else if(this.productList[i].status== 1){
//              this.productList[i].statusStr='进行中'
//              this.productList[i].textBtn='我要入股'
//              this.productList[i].disBtn=false
//            }else if(this.productList[i].status== 2){
//              this.productList[i].statusStr='已结束'
//              this.productList[i].textBtn='已售完'
//              this.productList[i].disBtn=true
//            }
//          }
//        }
//      })
      },
      //点击banner跳转url
      turn(url){
        if(url='#'){
          return ;
        }
        location.href=url;
      },
      // 状态类型转换为明文显示
      statusZh (status) {
        return status === 0 ? '敬请期待' : status === 1 ? '进行中' : status === 2 ? '已结束' : '敬请期待'
      },
      toBuyPackage (item) {
        if (item.disBtn) {
          return
        }
        if (this.$cookie.get('casino-front-token') && window.sessionStorage.getItem('userNumber')) {
          this.$http({
            url: this.$http.adornUrl('/users/info'),
            method: 'get'
          }).then(({
            data
          }) => {
            if (data && data.code === '0000') {
              if (!data) {
                return
              }
              if (data.users.idCardstatus === 0) {
                this.$alert('您还没有实名认证,请到云鸟商城实名认证', '提示', {
                  confirmButtonText: '确定',
                  // cancelButtonText: '取消',
                  // type: 'warning'
                }).then(() => {
                  this.$router.push({
                    name: 'realNameAuthentication'
                  })
                })
              } else if (data.users.idCardstatus === 1) {
                this.$alert('您还在认证中，请验证通过后再试', '提示', {
                  confirmButtonText: '确认'
                })
              } else if (data.users.idCardstatus === 3) {
                this.$confirm('身份认证失败，请重新认证', '提示', {
                  confirmButtonText: '去认证',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.$router.push({
                    name: 'realNameAuthentication'
                  })
                })
              } else if (data.isVipAndAbove === '0') {
                this.$alert('您还不是VIP，不能入股，可前往云鸟商城购买VIP', '提示', {
                  confirmButtonText: '确定'
                })
              } else if (data.users.whetherBinding === 0) {
                this.$confirm('您未绑定交易所账号，不能购买', '提示', {
                  confirmButtonText: '去绑定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.$router.push({
                    name: 'changeBankcard'
                  })
                })
              } else if (data.users.idCardstatus === 2 && data.users.whetherBinding === 1 && data.isVipAndAbove === '1') {
                this.$router.push({name: 'buyPackage',
                  params: {
                    product: item
                  }
                })
              }
            } else {
              // this.$message.error(data.msg)
              this.$message.error('获取实名认证信息失败')
            }
          }).catch(({
            error
          }) => {
            this.dataListLoading = false
            this.$message.error(error)
          })

        } else if (window.sessionStorage.getItem('userNumber')) {
          window.sessionStorage.setItem('userNumber')
          this.$confirm('您还没有登录，请登录', '提示', {
            confirmButtonText: '去登录',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$router.push({ name: 'login' })
          })
        } else {
          this.$confirm('您还没有登录，请登录', '提示', {
            confirmButtonText: '去登录',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$router.push({ name: 'login' })
          })
        }
      }
    },
   filters:{      //数据过滤器
     money:function(value){
       value =Number(value).toFixed(1);
       return value;
     },
     three: function (value) {
       value = Number(value).toFixed(3)
       return value
     }
   }
  }
</script>
