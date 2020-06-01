<template>
  <div class="body-grey">
    <main-body navIndex="1">
      <div slot="content">
        <div class="box-card2 zero-padding">
          <div class="box-body no-padding">
            <div class="my-zichang my-zichang2">
              <div class="hu in-b">
                <div class="name">虎链积分余额</div>
                <div class="number">0.00</div>
              </div>
              <div class="jiang in-b">
                <ul>
                	<li><span class="span">直推奖：</span>0.00</li>
                	<li><span class="span">出局奖：</span>0.00</li>
                	<li><span class="span">激活奖：</span>0.00</li>
                	<li><span class="span">提成奖：</span>0.00</li>
                	<li><span class="span">分润奖：</span>0.00</li>
                </ul>
              </div>
            </div>
            <div class="my-zichang my-zichang2 withdrawal clearfix" style="border-bottom: 1px solid #f0f0f0;">
                <div class="card-name">
									提现到银行卡：<!-- 中国建设银行（****  ****  **** 1145）<span class="default cursor underline">换绑</span> -->
									<!-- 您还没有实名认证 <span class="default cursor underline" @click="$router.push({ name: 'realNameAuthentication' })">去实名</span> -->
									</div>
                <div class="card-name">请选择提现虎链积分类型：</div>
                <el-checkbox-group v-model="form.type">
                  <div class="inter-list">
                    <el-checkbox label="直推奖" @change="change(0)" name="type"></el-checkbox>
                    <div class="in-b" v-if="beSelect[0]">
                      <el-input v-model="form.name" placeholder="请输入提现直推奖数额"></el-input>
                      <div class="gu-btn">全部提现</div>
                    </div>
                  </div>
                  <div class="inter-list">
                    <el-checkbox label="激活奖" @change="change(1)" name="type"></el-checkbox>
                    <div class="in-b" v-if="beSelect[1]">
                      <el-input v-model="form.name" placeholder="请输入提现激活数额"></el-input>
                      <div class="gu-btn">全部提现</div>
                    </div>
                  </div>
                  <div class="inter-list">
                    <el-checkbox label="分润奖" @change="change(2)" name="type"></el-checkbox>
                    <div class="in-b" v-if="beSelect[2]">
                      <el-input v-model="form.name" placeholder="请输入提现分润奖数额"></el-input>
                      <div class="gu-btn">全部提现</div>
                    </div>
                  </div>
                  <div class="inter-list">
                    <el-checkbox label="出局奖" @change="change(3)" name="type"></el-checkbox>
                    <div class="in-b" v-if="beSelect[3]">
                      <el-input v-model="form.name" placeholder="请输入提现出局奖数额"></el-input>
                      <div class="gu-btn">全部提现</div>
                    </div>
                  </div>
                  <div class="inter-list">
                    <el-checkbox label="提成奖" @change="change(4)" name="type"></el-checkbox>
                    <div class="in-b" v-if="beSelect[4]">
                      <el-input v-model="form.name" placeholder="请输入提现提成奖数额"></el-input>
                      <div class="gu-btn">全部提现</div>
                    </div>
                  </div>
                </el-checkbox-group>
              </div>
            <div class="withdrawal">
              <div class="x"><label class="label" for="">合计虎链积分：</label><span class="span default">0.00</span></div>
              <div class="x"><label class="label" for="">支付密码：</label><el-input type="password" v-model="form.name"></el-input>
              <div class="gu-btn">提现</div>
              </div>
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
  export default {
    data () {
      return {
        beSelect:[false,false,false,false,false],
        checkPerson: false,
        person: '身份未认证',
        checkPaymentPassword: false,
        paymentPassword: '支付密码未设置',
        activeNumber: 0,
        userNumber: '尊敬的HL15844551用户，欢迎您来到虎链！',
        form:{
          type:[],
          name:""
        }
      }
    },
    components: {
      MainBody
    },
    methods: {
      change(index){
        this.beSelect[index]=!this.beSelect[index];
      },
      resetVal (number) {
        var mNumber = parseInt(number)
        number = number.toString()
        var point = number.split('.')[1];
        console.log(point)
        mNumber = mNumber.toString()
        if (mNumber.length <= 3){
          if(!point) {
            return (mNumber == '' ? '0' : mNumber)
          }else{
            return (mNumber == '' ? '0' : mNumber) + '.' + point
          }
        }else {
          var mod = mNumber.length % 3;
          var output = (mod == 0 ? '' : (mNumber.substring(0, mod)))
          for (var i = 0; i < Math.floor(mNumber.length / 3); i++) {
            if ((mod == 0) && (i == 0)) {
              output += mNumber.substring(mod + 3 * i, mod + 3 * i + 3)
            } else {
              output += ',' + mNumber.substring(mod + 3 * i, mod + 3 * i + 3)
            }
          }
          console.log(typeof point)
          if(!point){

            return output
          }else{
          return (output + '.<span class="little-num">' + point + '</span>')

          }
        }
        //      return `${val.parseInt}.<span class="little-word">${dian}</span>`
      },
      personFund () {
        this.$http({
          url: this.$http.adornUrl('/fund/au/person'),
          method: 'get'
        }).then(({data}) => {
          if (data && data.code === '0000') {
            this.userNumber = data.data.userNumber
            this.fund.yyc = data.data.yyc
            this.fund.yyi = data.data.yyi
            this.fund.usdt = data.data.usdt
            this.fund.sendYyi = data.data.sendYyi
            this.fund.incentiveYyi = data.data.incentiveYyi
            this.fund.frozenYyi = data.data.frozenYyi
            this.fund.directlyUserCount = data.data.directlyUserCount

            if (data.data.payPassword !== '') {
              this.checkPaymentPassword = true
              this.paymentPassword = '支付密码已设置'
            }
            if (data.data.auth === '3') {
              this.checkPerson = true
              this.person = '身份已认证'
            }
          } else {
            this.$message.error(data.msg)
          }
        }).catch(({error}) => {
          this.dataListLoading = false
          this.$message.error(error)
        })
      }
    },
    mounted: function () {
      this.personFund()
    }
  }
</script>
<style lang="scss" scoped>
  .wei{
        width: 35px;height: 35px;background-image: url(/static/img/ic_chair_nor.png);
        display:inline-block; vertical-align: top;
         margin-right: 10px;
    }
    .wei.dang{
      background-image: url(/static/img/ic_chair_dang.png);
    }
    .wei.disabled{
      background-image: url(/static/img/ic_chair_dis.png);
    }
</style>
