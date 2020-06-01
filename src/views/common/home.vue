<template>
<div>
  <div class="img-box">
    <img src="static/img/piture.png" alt="" />
    <div class="title">欢迎进入易用链后台管理系统</div>
  </div>
  <div class="main-content">
    <div class="fengshui">易用币（YYC）众筹进度</div>
    <el-table
    :data="tableData"
    border
    style="width: 100%">
    <el-table-column
      prop="stage"
      label="阶段"
      width="180">
    </el-table-column>
    <el-table-column
      prop="number"
      label="总配送量（万个）"
      width="180">
    </el-table-column>
    <el-table-column
      prop="progress"
      label="配送进度">
    </el-table-column>
    <el-table-column
      prop="progress1"
      label="剩余配送量（万个）">
      </el-table-column>
    <el-table-column
      prop="progress2"
      label="本期数">
    </el-table-column>
    <el-table-column
      prop="progress1"
      label="本期配送量（万个）">
    </el-table-column>
    <el-table-column
      prop="progress3"
      label="当前YYC价格（元/万个）">
    </el-table-column>
    <el-table-column
      prop="progress4"
      label="当前USDT价格（枚/万个）">
    </el-table-column>
    <el-table-column
      prop="progress5"
      label="开始时间">
    </el-table-column>
    <el-table-column
      prop="progress6"
      label="完成时间">
    </el-table-column>

  </el-table>
  <div class="fengshui">人员数量</div>
  <el-table
    :data="tableData1"
    border
    style="width: 100%">
    <el-table-column
      prop="title"
      label=""
      width="80">
    </el-table-column>
    <el-table-column
      prop="stage"
      label="合伙人"
      width="180">
    </el-table-column>
    <el-table-column
      prop="number"
      label="领导人"
      width="180">
    </el-table-column>
    <el-table-column
      prop="progress"
      label="发起 人">
    </el-table-column>
    <el-table-column
      prop="progress1"
      label="vip会员">
      </el-table-column>
    <el-table-column
      prop="progress2"
      label="普通会员">
    </el-table-column>
  </el-table>
  <div class="fengshui">订单信息</div>
  <el-row :gutter="10">
  <el-col :xs="24" :sm="12" :md="12" :lg="6">
    <div class="order-info">
      <div class="title">总订单数（条）:</div>
      <div class="content">10000</div>
    </div>
  </el-col>
  <el-col :xs="24" :sm="12" :md="12" :lg="6">
    <div class="order-info">
      <div class="title">昨日新增订单数（条）：</div>
      <div class="content">10000</div>
    </div>
  </el-col>
  <el-col :xs="24" :sm="12" :md="12" :lg="6" >
    <div class="order-info">
      <div class="title">总金额（USDT）： </div>
      <div class="content">10000.000000</div>
    </div>
  </el-col>
  <el-col :xs="24" :sm="12" :md="12" :lg="6">
    <div class="order-info">
      <div class="title">昨日新增订单金额（ETH）:</div>
      <div class="content">20000000.56780023</div>
    </div>
  </el-col>
  </el-row>
  <div class="border-grey"></div>
  <div class="fengshui">待处理订单数量</div>
    <el-row :gutter="10" class="process">
  <el-col :xs="24" :sm="12" :md="12" :lg="6">
    <div class="order-info">
      <div class="title">实名认证待审核数：</div>
      <div class="content">10000</div>
    </div>
  </el-col>
  <el-col :xs="24" :sm="12" :md="12" :lg="6">
    <div class="order-info">
      <div class="title">充币订单待处理数： </div>
      <div class="content">10000</div>
    </div>
  </el-col>
  <el-col :xs="24" :sm="12" :md="12" :lg="6" >
    <div class="order-info">
      <div class="title">提币订单待处理数： </div>
      <div class="content">100</div>
    </div>
  </el-col>
  <el-col :xs="24" :sm="12" :md="12" :lg="6">
    <div class="order-info">
      <div class="title">提币订单处理中数：</div>
      <div class="content">20000</div>
    </div>
  </el-col>
  </el-row>
  </div>
</div>
</template>

<script>
  export default {
    data () {
      return {
        tableData: [{
          stage: '2016-05-02',
          number: '王小虎',
          progress: '上海市普陀区金沙江路 1518 弄',
          progress1: '王小虎',
          progress2: '王小虎',
          progress3: '王小虎',
          progress4: '王小虎',
          progress5: '王小虎',
          progress6: '王小虎'
        }],
        tableData1: [{
          title: '总数',
          stage: '2016-05-02',
          number: '王小虎',
          progress: '上海市普陀区金沙江路 1518 弄',
          progress1: '王小虎',
          progress2: '王小虎'
        }]
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .img-box{position: relative;margin-bottom: 34px;background: #fff;margin-top: -40px;height: 135px;
    img{
      width: 100%;
      height: 135px;
    }
    .title{position: absolute;top: 0;left: 0;line-height: 135px;font-size:30px;
font-weight:bold;
color:rgba(51,51,51,1);width: 100%;text-align: center;}
  }

  .fengshui{font-size: 20px;line-height: 76px;}
  .el-table{margin-bottom: 14px;text-align: center;}
  .order-info{
    .title{
      font-size: 14px;
      line-height: 22px;
      color: #333333;
      margin-bottom: 12px;
    }
    .content{
      font-size: 30px;

    }
  }
  .border-grey{height: 1px;background: #e9e9e9;margin: 20px 0 0;}
  .process{
    padding-bottom: 60px;
    .order-info{
      width: 264px;
  height: 119px;
  background-color: #ffffff;
  box-shadow: 0px 3px 6px 0px
    rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    padding:18px 0 0 24px;
    margin-bottom: 20px;
    }
  }
</style>

