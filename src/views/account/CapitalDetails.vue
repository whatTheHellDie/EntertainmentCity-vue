<template>
  <div class="body-grey">
    <main-body navIndex="1">
      <div slot="content">
        <div class="box-card2 zero-padding">
          <div class="box-body no-padding" style="padding-top: 28px;">
            <div class="charge-list">
              <div class="choose-box">
                <div class="zijin-form y-zijin-form">
                  <div class="y-ts">温馨提示：奖金直接拨付至绑定的交易所账户中。</div>
                  <el-form ref="form" :inline="true" :model="form" label-width="80px">
                    <label for="">奖金类型：</label>
                    <el-form-item  prop="bonusType">
                      <el-select v-model="form.bonusType" clearable>
                        <el-option label="全部" value=""></el-option>
                        <el-option label="固定分配" value="4" v-if="this.role == 'middleMan'"></el-option>
                        <el-option label="固定分配" value="5" v-if="this.role == 'middleCompany'"></el-option>
                        <el-option label="沉淀" value="99" v-if="this.role == 'middleCompany'"></el-option>
                        <el-option label="一级推荐奖" value="1"></el-option>
                        <el-option label="二级推荐奖" value="2"></el-option>
                        <el-option label="代理奖" value="3"></el-option>
                      </el-select>
                    </el-form-item>
                    <div class="show-phone"></div>
                    <span class="phone-time">
                    <label for="">时间：</label>
                    <el-form-item prop="createTime">
                       <el-date-picker
                         v-model="form.sendTime"
                         type="daterange"
                         align="right"
                         unlink-panels
                         range-separator="至"
                         start-placeholder="开始日期"
                         end-placeholder="结束日期"
                         value-format="yyyy-MM-dd"
                         :picker-options="pickerOptions">
          </el-date-picker>
                    </el-form-item>
                    </span>
                    <el-form-item>
                      <el-button type="primary" @click="loadList()">查找</el-button>
                    </el-form-item>
                  </el-form>
                  <el-table :data="dataList" class="money-table">
                    <el-table-column prop="createTime" label="时间">
                    </el-table-column>
                    <el-table-column prop="bonusType" label="奖金类型">
                      <template slot-scope="scope">
                        <div v-if="scope.row.bonusType == 1 && scope.row.isDeposit==0">一级推荐奖</div>
                        <div v-else-if="scope.row.bonusType == 2 && scope.row.isDeposit==0">二级推荐奖</div>
                        <div v-else-if="scope.row.bonusType == 3 && scope.row.isDeposit==0">代理奖</div>
                        <div v-if="scope.row.bonusType == 1 && scope.row.isDeposit==1">沉淀</div>
                        <div v-else-if="scope.row.bonusType == 2 && scope.row.isDeposit==1">沉淀</div>
                        <div v-else-if="scope.row.bonusType == 3 && scope.row.isDeposit==1">沉淀</div>
                        <div v-else-if="scope.row.bonusType == 4 || scope.row.bonusType == 5">固定分配</div>
                      </template>
                    </el-table-column>
                      <el-table-column prop="remark" label="说明" width="309">
                      </el-table-column>
                  </el-table>
                  <div class="phone-table">
                    <div class="tr" v-for="item,i in dataList">
                      <phone-column :prop="item.createTime" label="时间"></phone-column>
                      <phone-column label="奖金类型" :data="dataList" :index="i">
                        <template slot-scope="scope">
                          <div v-if="scope.row.bonusType == 1">一级推荐奖</div>
                          <div v-else-if="scope.row.bonusType == 2">二级推荐奖</div>
                          <div v-else-if="scope.row.bonusType == 3">代理奖</div>
                          <div v-else-if="scope.row.bonusType == 4 || scope.row.bonusType == 5">固定分配</div>
                      </template>
                      </phone-column>
                      <phone-column :prop="item.remark" label="说明"></phone-column>

                    </div>
                    <div v-if="dataList.length==0">
                      <img src="/static/img/no-data.jpg" class="no-data" alt="暂无数据" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="block" style="text-align: center;margin: 30px 0 40px">
              <el-pagination  v-show="elementTotal"
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

</style>

<script>
  import MainBody from '@/components/common/mainBody'
  import PhoneColumn from '@/components/common/phoneColumn'
  import Vue from 'vue'
  export default {
    data () {
      return {
        pageNum: 1,
        pageSize: 8,
        elementTotal: 0,
        role:'',
        form: {
          bonusType:'',
          sendTime:''
        },
        dataList: [],
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        }
      }
    },
    components: {
      MainBody,
      PhoneColumn
    },
    created () {
      this.loadList()
    },
    methods: {
      loadList () {
        this.$http({
          url: this.$http.adornUrl('/casino/bonus/getIndexList'),
          method: 'post',
          params: this.$http.adornParams({
            'pageNum': this.pageNum,
            'pageSize': this.pageSize,
            'bonusType': this.form.bonusType,
            startTime: this.form.sendTime == null ? null : this.form.sendTime.toString().split(',')[0]+" 00:00:00",
            endTime: this.form.sendTime == null ? null : this.form.sendTime.toString().split(',')[1]+" 23:59:59"
          })
        }).then(({data}) => {
          console.log(data)
          if (data && data.code === '0000') {
            this.dataList = data.list
            this.elementTotal = data.elementTotal
            this.role=data.role
          } else {
            this.dataList = []
            this.elementTotal = 0
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
        this.pageNum  = val
        this.loadList()
      }
    },
  }
</script>
