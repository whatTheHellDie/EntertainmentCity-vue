<template>
  <div>
    <my-header></my-header>
    <div class="login-wrap-box">
      <div class="wrap clearfix">
        <div class="news-wrap">
          <div class="title title1" v-html="title"></div>
          <div class="time1">发布时间：<span v-html="publishTime"></span></div>
          <div class="content" v-html="content"></div>
        </div>
      </div>
    </div>
    <my-footer></my-footer>
  </div>
</template>

<script>
  import MyHeader from '@/components/common/header'
  import MyFooter from '@/components/common/footer'
  export default {
    data () {
      return {
        title:'',
        publishTime:'',
        content:''
      }
    },
    components: {
      MyHeader,
      MyFooter
    },
    created(){
      this.title=this.$route.params.title;
      this.publishTime=this.$route.params.publishTime;
      this.content=this.$route.params.content;
    },
    methods: {
    }
  }
</script>

<style lang="scss">
.time1{
  color: #666;
  margin: 15px 0 -25px;
  text-align: center;
  font-size: 12px;
}
</style>
