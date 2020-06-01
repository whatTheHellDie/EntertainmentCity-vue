<template>
  <div class="body-grey">
    <main-body navIndex="1">
      <div slot="content">
        <div class="box-card2 zero-padding">
          <div class="box-body no-padding" style="padding-top: 28px;">
            <div class="charge-list my-recommond">
              <div class="choose-box">
                <div v-if="!dongshi" class="keyong"><!--如果没有代理商董事身份-->
                  <div class="number">{{userInfo.activityTotalSum}}</div>
                  <div class="name">累计推荐人数</div>
                </div>
                <div v-else class="keyong keyong1 clearfix"><!--如果有代理商董事身份-->
                  <div class="left">
                  <div class="number">{{userInfo.referrerSum}}</div>
                  <div class="name">累计直接推荐人数（一级）</div>
                  </div>
                  <div class="left">
                  <div class="number">{{userInfo.referrerSum}}</div>
                  <div class="name">累计间接推荐人数（二级）</div>
                  </div>
                </div>
                <div class="zijin-form text-left">
                  <el-form ref="form" :inline="true" :model="form" label-width="80px">
                    <!--<div v-show="dongshi" class="in-b"><label class="fon14" for="">所属层级:</label>-->
                    <!--<el-form-item>-->
                      <!--<el-select v-model="form.region">-->
                        <!--<el-option v-for="option in typeOptions" :key="option.value" :label="option.label"-->
                                   <!--:value="option.value"></el-option>-->
                      <!--</el-select>-->
                    <!--</el-form-item></div>-->
                    <label class="fon14 turn-label" for="">是否vip</label>
                    <el-form-item>
                      <el-select v-model="form.isVip">
                        <el-option v-for="option in typeOptions" :key="option.value" :label="option.label"
                                   :value="option.value"></el-option>
                      </el-select>
                    </el-form-item>
                    <div class="show-phone"></div>
                    <label class="fon14 turn-label" for="">是否入股</label>
                    <el-form-item>
                      <el-select v-model="form.hasBuy">
                        <el-option v-for="option in typeOptions" :key="option.value" :label="option.label"
                                   :value="option.value"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                     <!-- <div class="gu-btn">搜索</div>-->
                      <el-button type="primary" @click="loadList()">查找</el-button>
                    </el-form-item>
                  </el-form>

                  <el-table :data="tableData" class="money-table">
                    <el-table-column prop="registerTime" label="注册时间">
                      <template slot-scope="scope">
                        <div>{{scope.row.registerTime | dateFormat}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="userNumber" label="会员号">
                    </el-table-column>
                    <el-table-column prop="realName" label="真实姓名">
                    </el-table-column>
                    <el-table-column prop="membershipId" label="是否vip">
                      <template slot-scope="scope">
                        <div>{{scope.row.membershipId | isVip}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="totalAmount" label="是否入股" width="135">
                      <template slot-scope="scope">
                        <div>{{scope.row.totalAmount | haveBuy}}</div>
                    </template>
                    </el-table-column>
                  </el-table>

                  <div class="phone-table">
                    <div class="tr" v-for="item,i in tableData">
                      <phone-column label="注册时间" :prop="item.registerTime"></phone-column>
                      <phone-column label="会员号" :prop="item.number"></phone-column>
                      <phone-column label="是否实名" :data="tableData" :index="i">
                        <template slot-scope="scope">
                        <div v-if="scope.row.auth =='3'" class="default"></div>
                        <div v-else>否</div>
                      </template>
                      </phone-column>

                      <phone-column label="是否购买套餐" :data="tableData" :index="i">
                        <template slot-scope="scope">
                        <div v-if="scope.row.topNumber ==''" class="default">否</div>
                          <div v-else>是</div>
                      </template>
                      </phone-column>
                      <phone-column label="账户余额" :prop="item.hci"></phone-column>
                    </div>
                    <div v-if="tableData.length==0">
                      <img src="/static/img/no-data.jpg" class="no-data" alt="暂无数据" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="block" style="text-align: center;margin: 30px 0 40px">
              <el-pagination v-show="elementTotal"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
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

</style>

<script>
  // import { getUUID } from '@/utils'
  import DateUtil from '@/utils/DateUtil'
  import MainBody from '@/components/common/mainBody'
  import PhoneColumn from '@/components/common/phoneColumn'
  export default {
    data () {
      return {
        dongshi:false,
        pageNum: 1,
        pageSize: 8,
        elementTotal: 1,
        userInfo:{
          activityTotalSum: '',
        },
        form: {
          isVip: '',
          hasBuy: ''
        },
        typeOptions: [
          {value: '', label: '全部'},
          {value: '1', label: '是'},
          {value: '2', label: '否'},
        ],
        tableData: [{
          registerTime:'',
          number:'',
          totalAmount:'',
          auth:'',
          hci:0
        }]
      }
    },
    components: {
      MainBody,
      PhoneColumn,
    },
    created () {
      this.loadList()
    },
    methods: {
      times: function (value){
        var value=value.toString();
        return `${value.getFullYear()}-${value.getMonth()+1}-${value.getDate()} ${value.getHours()} : ${value.getMinutes()} : ${value.getSeconds()}`
      },
      loadList (i) {
        this.$http({
          url: this.$http.adornUrl('/users/listReferrer'),
          method: 'get',
          params: this.$http.adornParams({
            'pageNum': this.pageNum,
            'pageSize': this.pageSize,
            'isVip': this.form.isVip,
            'hasBuy': this.form.hasBuy
          })
        }).then(({data}) => {
          if (data && data.code === '1036') {
            this.$router.push({ name: 'login' })
          }
          if (data && data.code === '0000') {
            // console.log(data.data.dataList);
            this.tableData = data.list
            this.elementTotal = data.elementTotal
            // console.log(data.data)
            // console.log(this.pageNum)
          } else {
            this.dataList = []
            this.elementTotal = 0
          }
          this.dataListLoading = false
        })

        this.$http({
          url: this.$http.adornUrl('/users/info'),
          method: 'get'
        }).then(({data}) => {
          if (data && data.code === '0000') {
            // console.log(data)
            this.userInfo = data.users
          }
          this.dataListLoading = false
        })
      },
      // 每页数
      handleSizeChange (val) {
        this.pageSize = val
        this.pageNum = 1
        this.loadList()
      },
      // 当前页
      handleCurrentChange (val) {
        this.pageNum = val
        this.loadList()
      },
      pay (id) {},
      cancelOrder (id) {},
      delOrder (id) {},
      firstType (row, column, cellValue) {
        if (this.typeOptions.length > 0) {
          for (let i = 0; i < this.typeOptions.length; i++) {
            if (cellValue == this.typeOptions[i].value) {
              return this.typeOptions[i].label
            }
          }
        }
      }
    },
    filters:{      //数据过滤器
      money:function(value){
        value =Number(value).toFixed(2);
        return value;
      },
      isVip: function (value) {
        if (value === '0207e3ae-ef31-4359-91a9-6fbf7f28ebdb') {
          return '否'
        } else {
          return '是'
        }
      },
      dateFormat (value) {
        return (new Date(parseFloat(value))).format('yyyy-MM-dd hh:mm:ss')
      },
      haveBuy: function (value) {
        if (value > 0) {
          return '是'
        } else {
          return '否'
        }
      }
    },
    mounted () {
      //    var clipboard = new ClipboardJS('.copy');
      //
      //    clipboard.on('success', function(e) {
      //        e.clearSelection();
      //
      //    });
      //
      //    clipboard.on('error', function(e) {
      //        alert('该默认浏览器不支持点击复制,请长按选择复制钱包地址或选择分享二维码图片')
      //    });
    }
  }
</script>
