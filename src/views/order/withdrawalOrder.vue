<template>
  <div class="body-grey">
    <main-body navIndex="1">
      <div slot="content">
        <div class="box-card2">
          <div class="box-body no-padding" style="padding-top: 28px;">
            <div class="charge-list">
              <div class="choose-box">
                <div class="zijin-form withdrawal-form">
                  <el-form ref="form" :inline="true" :model="form" label-width="80px">
                    <label for="">状态：</label>
                    <el-form-item>
                      <el-select v-model="form.region">
                        <el-option v-for="option in typeOptions" :key="option.value" :label="option.label"
                                   :value="option.value"></el-option>
                      </el-select>
                    </el-form-item>
                    <div class="show-phone"></div>
                    <label for="">申请时间：</label>
                    <span class="phone-time">
                    <el-form-item prop="createTime">
                      <el-date-picker type="daterange" placeholder="选择日期" v-model="form.createTime"
                                      style="width: 100%;margin-top:2px;"
                                      :unlink-panels="true" value-format="yyyy-MM-dd">

                      </el-date-picker>
                    </el-form-item>
                    </span>
                    <el-form-item>
                     <!-- <div class="gu-btn">搜索</div>-->
                      <el-button type="primary" @click="loadList()">搜索</el-button>
                    </el-form-item>
                  </el-form>
                  <el-table  :data="tableData" class="money-table withdrawal-table" border>
                    <el-table-column prop="createTime" label="订单编号" width="132">
                    </el-table-column>
                    <el-table-column prop="accountType" label="直推奖" width="67">
                    </el-table-column>
                      <el-table-column prop="remark" label="激活奖" width="67">
                      </el-table-column>
                      <el-table-column prop="recordAmount" label="分润奖" width="67">
                      </el-table-column>
                      <el-table-column prop="balance" label="出局奖" width="67">
                      </el-table-column>
                      <el-table-column prop="balance" label="提成奖" width="67">
                      </el-table-column>
                      <el-table-column prop="balance" label="合计" width="67">
                      </el-table-column>
                      <el-table-column prop="balance" label="状态" width="67">
                      </el-table-column>
                      <el-table-column prop="balance" label="申请时间" width="90">
                      </el-table-column>
                      <el-table-column prop="balance" label="完成时间" width="90">
                      </el-table-column>
                      <el-table-column prop="balance" label="说明">
                      </el-table-column>
											<div slot="empty">
												<img src="/static/img/no-data.jpg" alt="暂无数据" class="no-data">
											</div>
                  </el-table>
                  <div class="phone-table">
                    <div class="tr" v-for="item,i in tableData">
                      <phone-column :prop="item.createTime" label="订单编号"></phone-column>
                      <phone-column :prop="item.accountType" label="直推奖"></phone-column>
                      <phone-column :prop="item.remark" label="激活奖"></phone-column>
                      <phone-column :prop="item.recordAmount" label="分润奖"></phone-column>
                      <phone-column :prop="item.balance" label="出局奖"></phone-column>
                      <phone-column :prop="item.consignee" label="提成奖"></phone-column>
                      <phone-column :prop="item.consignee" label="合计"></phone-column>
                      <phone-column :prop="item.consignee" label="状态"></phone-column>
                      <phone-column :prop="item.consignee" label="申请时间"></phone-column>
                      <phone-column :prop="item.consignee" label="完成时间"></phone-column>
                      <phone-column :prop="item.consignee" label="说明"></phone-column>
                    </div>
                    <div v-if="tableData.length==0">
                      <img src="/static/img/no-data.jpg" class="no-data" alt="暂无数据" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="block" style="text-align: center;margin: 30px 0 40px">
              <el-pagination
                v-show="elementTotal"
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
  // import { getUUID } from '@/utils'
  import MainBody from '@/components/common/mainBody'
  import PhoneColumn from '@/components/common/phoneColumn'
  export default {
    data () {
      return {
        activeNumber: 3,
        pageNum: 1,
        pageSize: 8,
        elementTotal: 0,
        accountBalance: 0,
        form: {
          name: '',
          region: '',
          createTime: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        typeOptions: [
          {value: '', label: '全部'},
          {value: '1', label: '入股'},
          {value: '2', label: '奖励'},
          {value: '3', label: '挂卖'},
          {value: '4', label: '销毁'},
          {value: '5', label: '释放'},
          {value: '6', label: '资产分配'},
          {value: '7', label: '充币'},
          {value: '8', label: '提币'},
          {value: '9', label: '转账'}
        ],
        tableData: []
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
      loadList (i) {
        if (i) {
          this.activeNumber = i
        }
        if (!this.form.createTime) {
          this.form.createTime = []
        }
        this.$http({
          url: this.$http.adornUrl('/fund/record/list'),
          method: 'post',
          data: this.$http.adornData({
            'pageNum': this.pageNum,
            'pageSize': this.pageSize,
            'createEndTime': this.form.createTime.length === 2 ? this.form.createTime[1] : '',
            'createStartTime': this.form.createTime.length >= 1 ? this.form.createTime[0] : '',
            'accountType': this.activeNumber,
            'recordFirstType': this.form.region
          })
        }).then(({data}) => {
          console.log(data)
          if (data && data.code === '0000') {
            this.tableData = data.data.dataList
            this.elementTotal = data.data.elementTotal
            console.log(data.data.pageSize)
          } else {
            this.dataList = []
            this.elementTotal = 0
          }
          this.dataListLoading = false
        })
        this.$http({
          url: this.$http.adornUrl('/fund/record/accountBalance'),
          method: 'get',
          params: this.$http.adornParams({'accountType': this.activeNumber})
        }).then(({data}) => {
          console.log(data)
          if (data && data.code === '0000') {
            this.accountBalance = data.data
          } else {
            this.accountBalance = 0
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
