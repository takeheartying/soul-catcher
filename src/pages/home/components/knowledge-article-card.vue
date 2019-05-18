<template>
  <div class="knowledge-article-card" v-if="knowledge"  @click="gotoDetail(knowledge._id)">
    <image :src="knowledge.picUrl || defaultImg" class="left-img"  mode="aspectFill" />
    <div class="middle-content">
      <p class="title">{{knowledge.title}}</p>
      <p class="desc">{{knowledge.desc}}</p>
      <p class="type">{{knowledge.tagTypeDesc}}</p>
    </div>
    <div class="right-content"><button class="right-btn" @click="lookOver()">{{showEdit ? '编辑' : '查看'}}</button></div>
  </div>
</template>
<script>
export default {
  methods: {
    gotoDetail (id) {
      if (id) {
        wx.navigateTo({
          url: `/pages/knowledge/article/detail/main?id=${id}`
        })
      }
    },
    lookOver () { // 查看
      if (this.showEdit) { // 专家查看我的知识库-- 前往编辑页
        wx.navigateTo({url: `/pages/knowledge/edit/main?id=${this.knowledge._id}`})
      } else {
        this.gotoDetail(this.knowledge._id)
      }
    }
  },
  props: {
    knowledge: {
      type: Object,
      default () {
        return {}
      }
    },
    showEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      defaultImg: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1558159564465&di=f770eac8e641689eab7ea22a48d81297&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201808%2F27%2F20180827183035_mnsbn.thumb.700_0.jpg'
    }
  }
}
</script>

<style lang="less">
@import '~@/styles/functions.less';
  .knowledge-article-card {
    padding: 12px 8px;
    height: 55px;
    display: flex;
    flex-direction: row;
    justify-items: center;
    background: #fff;
    .left-img {
      width: 55px;
      height: 55px;
      border-radius: 1px;
      margin-left: 5px;
      margin-right: 12px;
    }
    .middle-content {
      flex: 1;
      width: calc(100% - 120px);
      .title {
        font-size: 14px;
        .fn_ellipsis();
        font-weight: bolder;
        line-height: 18px;
      }
      .desc {
        .fn_ellipsis();
        font-size: 12px;
        color: rgb(129, 116, 116)
      }
      .type {
        font-size: 10px;
        margin-top: 5px;
        color: rgb(129, 116, 116)
      }
    }
    .right-content {
      position: relative;
      right: 10px;
      top: 20px;
      height: 55px;
      left:0px;
      margin-left:10px;
      width: 44px;
      line-height: 55px;
      text-align: right;
      .right-btn {
        width: 44px;
        height: 20px;
        line-height: 19px;
        font-size: 14px;
        text-align: center;
        color: rgb(197, 95, 165);
        border-radius: 14px;
        border: 1px solid;
        padding:0 3px;
        background: #fff;
      }
    }
  }
</style>
