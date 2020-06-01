 <template>
  <div class="body-grey">
    <main-body navIndex="1">
      <div slot="content">
        <div class="box-card2 mt20">
          <div class="top-nav1">地址信息<span class="more">最多保存20个地址</span></div>

          <div class="box-body min425">
            <form class="form-horizontal" role="form">
              <div class="form-group combo-form">
                <label for="zhuan" class="col-sm-3 control-label">收货人姓名：</label>
                <div class="col-sm-4">
                  <input class="form-control input" placeholder="不超过20个字符" v-model="form.consignee">
                </div>
                <div class="tips lh40 red">* </div>
              </div>
              <div class="form-group combo-form">
                <label for="zhuan" class="col-sm-3 control-label" >联系电话：</label>
                <div class="col-sm-4">
                  <input class="form-control input" placeholder="请输入手机号码" v-model="form.phone">
                </div>
              </div>
              <div class="form-group combo-form">
                <label for="zhuan" class="col-sm-3 control-label">收货地址：</label>
                <div class="col-sm-4 province-choose">
                  <el-select
                      v-model="form.province"
                      @change="choseProvince">
                      <el-option
                        v-for="item in provinces"
                        :key="item.value"
                        :label="item.value"
                        :value="item.value">
                    </el-option>
                  </el-select>
    <el-select
      v-model="form.city"
      @change="choseCity"
      >
      <el-option
        v-for="item in citys"
        :key="item.value"
        :label="item.value"
        :value="item.value">
      </el-option>
    </el-select>
    <el-select
      v-model="form.district"
      @change="choseBlock"
      >
      <el-option
        v-for="item in districts"
        :key="item.value"
        :label="item.value"
        :value="item.value">
      </el-option>
    </el-select>

                </div>
                <div class="form-group combo-form" style="margin-top: 18px;">
                  <label for="zhuan" class="col-sm-3 control-label"></label>
                  <div class="col-sm-4">
                    <input class="form-control input" placeholder="请输入详细地址" v-model="form.address">
                  </div>
                </div>
                <div class="form-group combo-form" style="margin-top: -18px;margin-bottom: -10px;">
                  <label for="zhuan" class="col-sm-3 control-label" ></label>
                  <div class="col-sm-4">
                    <el-checkbox  v-model="form.defaultAddress">设置为默认地址</el-checkbox>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <div class="col-sm-offset-3 col-sm-9">
                  <div class="btn-ti cursor" @click="submitData()">保存</div>
                </div>
              </div>
            </form>
            <el-table :data="tableData" class="grey-table" border>
                    <el-table-column prop="consignee" label="收货人姓名" width="130">
                    </el-table-column>
                    <el-table-column prop="phone" label="联系电话" width="165">
                    </el-table-column>
                    <el-table-column prop="fullAddress" label="收货地址"  width="300">
                      </el-table-column>
                      <el-table-column prop="remark" label="操作 " width="163">
                        <template slot-scope="scope">
                          <span class="cursor" @click="updateAddress(scope.row)">修改</span> |
                          <span class="cursor" @click="delAddress(scope.row)">删除</span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="defaultAddress" label="">
                        <template slot-scope="scope">
                          <div v-if="scope.row.defaultAddress==0" class="gu-btn" @click="setDefault(scope.row)">设为默认</div>
                          <div v-if="scope.row.defaultAddress==1" class="cursor default text-center"> 默认地址</div>
                        </template>
                      </el-table-column>
                  </el-table>
                  <div class="phone-table">
                    <div class="tr" v-for="item,i in tableData">
                    	<phone-column :prop="item.consignee" label="收货人姓名"></phone-column>
                    	<phone-column :prop="item.phone" label="联系电话"></phone-column>
                    	<phone-column :prop="item.fullAddress" label="收货地址"></phone-column>
                    	<phone-column label="操作" :data="tableData" :index="i">
                    	  <template slot-scope="scope">
                          <span class="cursor" @click="updateAddress(scope.row)">修改</span> |
                          <span class="cursor" @click="delAddress(scope.row)">删除</span>
                        </template>
                    	</phone-column>
                    	<phone-column label="是否默认" :data="tableData" :index="i">
                        <template slot-scope="scope">
                          <div class="grey-table clearfix">
                            <div v-if="scope.row.defaultAddress==0" class="gu-btn pull-right" @click="setDefault(scope.row)">设为默认</div>
                            <div v-if="scope.row.defaultAddress==1" class="cursor default"> 默认地址</div>
                          </div>
                        </template>
                      </phone-column>
                  	</div>
                  	<div v-if="tableData.length==0">
                  	  <img src="/static/img/no-data.jpg" class="no-data" alt="暂无数据" />
                  	</div>
                  </div>
                  <!--<phone-table :data="tableData">
                    <phone-column label="收货人姓名" prop="consignee"></phone-column>
                    <phone-column label="收货人姓名" prop="consignee"></phone-column>
                  </phone-table>-->
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
      mapJson:'../static/json/map.json',
      provinces:[],
      citys: [],
      districts: [],
        form: {
          id:'',
          phone: '',
          consignee: '',
          address: '',
          district: '',
          city: '',
          province:'',
          defaultAddress:false,
        },
        tableData: [
        ]
      }
    },
    computed: {},
    components: {
      MainBody,
      PhoneColumn,
    },
    methods: {
      updateAddress(e){
        console.log(e)
        this.$http({
          url:this.$http.adornUrl('/userAddress/get'),
          method:'get',
          params:this.$http.adornParams({
            "id":e.id
          })
        }).then(({data})=>{
          if(data && data.code === '0000') {
            this.form = data.data
            this.form.defaultAddress = data.data.defaultAddress==1
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      delAddress(e){
        console.log(e)
        this.$http({
          url:this.$http.adornUrl('/userAddress/del'),
          method:'get',
          params:this.$http.adornParams({
            "id":e.id
          })
        }).then(({data})=>{
          if(data && data.code === '0000') {
            this.$message.success('删除成功');
            this.listAddress()
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      setDefault(e){
        this.$http({
          url:this.$http.adornUrl('/userAddress/setDefault'),
          method:'get',
          params:this.$http.adornParams({
            "id":e.id
          })
        }).then(({data})=>{
          if(data && data.code === '0000') {
            this.$message.success('设置成功');
            this.listAddress()
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      getCityData:function(){
        var that = this
        this.$axios.get(this.mapJson).then(function(response){
          if (response.status==200) {
            var data = response.data
            that.provinces = []
            that.citys = []
            that.districts = []
            // 省市区数据分类
            for (var item in data) {
              if (item.match(/0000$/)) {//省
                that.provinces.push({id: item, value: data[item], children: []})
              } else if (item.match(/00$/)) {//市
                that.citys.push({id: item, value: data[item], children: []})
              } else {//区
                that.districts.push({id: item, value: data[item]})
              }
            }
            // 分类市级
            for (var index in that.provinces) {
              for (var index1 in that.citys) {
                if (that.provinces[index].id.slice(0, 2) === that.citys[index1].id.slice(0, 2)) {
                  that.provinces[index].children.push(that.citys[index1])
                }
              }
            }
            // 分类区级
            for(var item1 in that.citys) {
              for(var item2 in that.districts) {
                if (that.districts[item2].id.slice(0, 4) === that.citys[item1].id.slice(0, 4)) {
                  that.citys[item1].children.push(that.districts[item2])
                }
              }
            }
          }
          else{
          }
        }).catch(function(error){console.log(typeof+ error)})
      },
      // 选省
      choseProvince:function(e) {
        for (var index2 in this.provinces) {
          if (e === this.provinces[index2].value) {
            this.citys = this.provinces[index2].children
            this.form.city = this.provinces[index2].children[0].value
            this.districts =this.provinces[index2].children[0].children
            this.form.district = this.provinces[index2].children[0].children[0].value
          }
        }
      },
      // 选市
      choseCity:function(e) {
				for(let i=0;i<this.citys.length;i++){
					if (e === this.citys[i].value) {
						this.districts=this.citys[i].children;
						this.form.district = this.citys[i].children[0].value
						this.E = this.qu1[0].id
					}
				}
//         for (var index3 in this.citys) {
//           if (e === this.city[index3].value) {
//             this.qu1 = this.city[index3].children
//             this.qu = this.city[index3].children[0].value
//             this.E = this.qu1[0].id
//             // console.log(this.E)
//           }
//         }
				// console.log(this.city)
      },
      // 选区
      choseBlock:function(e) {
        this.E=e;
        // console.log(this.E)
      },
      submitData() {
        if(!this.form.consignee){
          this.$message.error("收货人不能为空!")
          return;
        }
         if(!this.form.phone){
           this.$message.error("电话不能为空!")
           return;
         }
        if(!this.form.address){
          this.$message.error("详细地址不能为空!")
          return;
        }
        if(!this.form.province){
          this.$message.error("省份不能为空!")
          return;
        }
        if(!this.form.city){
          this.$message.error("市不能为空!")
          return;
        }
        if(!this.form.district){
          this.$message.error("区不能为空!")
          return;
        }

        this.$http({
          url: this.$http.adornUrl('/userAddress/createOrUpdate'),
          method: 'post',
          data: this.$http.adornData({
            "id":this.form.id,
            "phone":this.form.phone,
            "consignee":this.form.consignee,
            "address":this.form.address,
              "district":this.form.district,
            "city":this.form.city,
            "province":this.form.province,
            "defaultAddress":this.form.defaultAddress?1:0
          }
           )
        }).then(({data}) => {
          if(data && data.code === '0000') {
            this.form= {
               id:'',
                phone: '',
                consignee: '',
                address: '',
                district: '',
                city: '',
                province:'',
                defaultAddress:false}

                this.listAddress()
            this.$message.success('提交成功');
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      listAddress() {
        this.$http({
          url: this.$http.adornUrl('/userAddress/list'),
          method: 'get'
        }).then(({data}) => {
          if(data && data.code === '0000') {
            this.tableData = data.data
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    },
    created: function() {
      this.listAddress()
      this.getCityData()
    }
  }
</script>

<style lang="scss" scoped>
  .finish_room {
    width: 430px;
    height: auto;
  }

  .finish_room2 {
    width: 100%;
    height: auto;
    padding-top: 15px;
    padding-bottom: 15px;
    display: flex;
    align-items: center;
    border-bottom: 2px solid #e1e1e1;
  }

  .finish_room2 .room_img {
    width: 150px;
    height: 100px;
    margin-right: 10px;
    position: relative;
    overflow: hidden;
  }

  .finish_room2 .room_img img {
    width: 100%;
    height: 100%;
  }

  .finish_room2>.room_img span {
    position: absolute;
    width: auto;
    height: auto;
    right: 5px;
    bottom: 3px;
  }

  .room_add_img {
    width: 148px;
    height: 98px;
    border: 1px solid #e1e1e1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    position: relative;
  }

  .room_add_img>span:nth-child(1) {
    margin-top: 20px;
    width: 40px;
    height: 40px;
    overflow: hidden;
  }

  .room_add_img>span:nth-child(2) {
    margin-bottom: 10px;
  }

  .btn-chuan input,
  .room_add_img input {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    z-index: 99999;
    opacity: 0;
  }

  .upload-button {
    height: 60px;
    width: 60px;
    background: red
  }

  .col-sm-3 {
    margin-right: 10px;
    width: 141px;
    text-align: right;
    display: inline-block;
    vertical-align: top;
    line-height: 40px;
  }

  .col-sm-4 {
    width: 300px;
    line-height: 40px;
    display: inline-block;
    vertical-align: top;
    input {
      width: 100%;
      height: 40px;
      padding-left: 11px;
    }
  }

  .col-sm-8 {
    display: inline-block;
    vertical-align: top;
    width: 550px;
  }

  .combo-form {
    margin-bottom: 30px;
  }

  .lh40 {
    line-height: 40px;
    display: inline-block;
    vertical-align: top;
  }

  .red {
    color: #f43837;
  }

  .tips {
    margin-left: 6px;
  }

  .card-box {
    display: inline-block;
    vertical-align: top;
    &.mr45 {
      margin-right: 45px;
    }
  }

  .card-wrap {
    margin-bottom: 30px;
    display: inline-block;
    vertical-align: top;
    .img {
      margin-right: 26px;
      width: 300px;
      height: 144px;
    }
    .card-tip {
      margin: 10px 40px;
      color: #999;
    }
    .mr45 {
      margin-right: 45px;
    }
  }

  .btn-chuan {
    position: relative;
    width: 90px;
    height: 32px;
    line-height: 32px;
    padding: 0;
    background: #ffc32d;
    color: #fff;
    display: inline-block;
    vertical-align: bottom;
    margin: 0 auto;
    text-align: center;
    border-radius: 20px;
    cursor: pointer;
  }

  .btn-ti {
    width: 240px;
    height: 50px;
    line-height: 50px;
    background: #e2231a;
    color: #fff;
    text-align: center;
    border-radius: 5px;
    margin-left: 154px;
    margin-bottom: 10px;
    font-size: 18px;
  }
</style>
