<template>
  <section class="page-contact-us">
    <div class="banner">
    </div>
    <div class="container">
      <p class="title">平台介绍：</p>
      <p class="desc">专注大学生心理健康评测，做你的心理捕手师~</p>
      <p class="title">联系我们：</p>
      <p class="desc">客服微信：lxy19971525</p>
    </div>
    <div class="footer">takeheart莹~做你的贴心小助手</div>
  </section>
</template>
<script>
export default {
  mounted () {
    wx.setNavigationBarTitle({
      title: '联系我们'
    })
  }
}
</script>

<style lang="less">
.page-contact-us {
  height: 100%;
  .banner {
    background: url("http://img3.imgtn.bdimg.com/it/u=783236589,2176858074&fm=26&gp=0.jpg") center center no-repeat;
    height: 150px;
    width: 100%;
  }
  .container {
    background-color: #fff;
    padding: 12px 20px;
    .title {
      font-weight: border;
      font-size: 16px;
      margin-bottom: 6px;
      color: rgb(195, 214, 244);
    }
    .desc {
      text-indent: 10px;
      font-size: 12px;
      margin-bottom: 6px;
    }
  }
  .footer {
    font-size: 12px;
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    width: 100%;
    position: absolute;
    bottom: 0;
    color: rgb(195, 214, 244);
  }
}
</style>
