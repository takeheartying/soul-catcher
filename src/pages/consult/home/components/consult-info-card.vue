<template>
  <navigator class="consult-home-info-card-navigator" v-if="consultInfo && consultInfo.name"  :url="'/pages/expert/detail/main?id=' + consultInfo._id">
    <div class="consult-home-info-card" >
      <image class="consult-home-info-card--image" :src="consultInfo.avatarUrl" mode="aspectFill"></image>
      <p class="consult-home-info-card--name">{{consultInfo.name}}</p>
      <div class="consult-home-info-card--number" v-if="consultInfo.consultorNum">
        咨询人数&nbsp;<span class="consult-home-info-card--consultor-num">{{consultInfo.consultorNum}}人</span>
        /&nbsp;
        <span class="consult-home-info-card--score">{{consultInfo.averageScore}}分</span>
      </div>
      <p class="consult-home-info-card--goodat">
        擅长: &nbsp;{{goodAt}}
      </p>
      <p class="consult-home-info-card--academic-title">{{consultInfo.academicTitle}}</p>
    </div>
  </navigator>
</template>
<script>
export default {
  props: {
    consultInfo: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      goodAt: '无'
    }
  },
  methods: {
    filterTagType (tagType) {
      if (tagType) {
        switch (tagType) {
          case '1':
            tagType = '爱情脱单'
            break
          case '2':
            tagType = '智商情商'
            break
          case '3':
            tagType = '趣味性格'
            break
          case '4':
            tagType = '心理综合'
            break
          default: break
        }
      }
      return tagType
    }
  },
  mounted () {
    if (this.consultInfo && this.consultInfo.tagList && this.consultInfo.tagList.length) {
      let goodAt = ''
      this.consultInfo.tagList.forEach((tagType, index) => {
        goodAt += (this.filterTagType(tagType) + '、')
      })
      this.goodAt = goodAt.slice(0, goodAt.length - 1) || '无'
    }
  }
}
</script>

<style lang="less">
@import '~@/styles/functions.less';
.consult-home-info-card {
  margin-right: 20px;
  display: block;
  padding: 8px 8px 5px 8px;
  box-shadow: 0 0 10px rgba(216, 213, 213, 0.6);
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 140px;
  height: 155px;
  .consult-home-info-card--image {
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }
  .consult-home-info-card--name {
    font-size: 18px;
    font-weight: bold;
    margin: 2px 0 3px 0;
  }
  .consult-home-info-card--number {
    color: rgb(173, 169, 169);
    font-size: 12px;
    .consult-home-info-card--consultor-num {
      color: #FFD161;
    }
    .consult-home-info-card--score {
      color: #FFD161;
    }
  }
  .consult-home-info-card--goodat {
    font-size: 12px;
    width: 134px;
    color: rgb(173, 169, 169);
    .fn_ellipsis();
  }
  .consult-home-info-card--academic-title {
    font-size: 14px;
  }
}
</style>
