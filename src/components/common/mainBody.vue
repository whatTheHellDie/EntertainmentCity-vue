<template>
  <div>
    <my-header :navIndex="navIndex"></my-header>
    <div class="main-content">
      <div class="wrap clearfix">
      <my-aside></my-aside>
      <slot name="content"></slot>
      </div>
    </div>
    <my-footer></my-footer>
  </div>
</template>

<script>
  import MyHeader from '@/components/common/header'
  import MyFooter from '@/components/common/footer'
  import MyAside from '@/components/common/aside'
  export default {
    props:['navIndex'],
    components: {
      MyHeader,
      MyFooter,
      MyAside,
    }
  }
</script>

<style>

</style>