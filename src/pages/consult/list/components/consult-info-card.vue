<template>
  <navigator class="consult-info-card" v-if="consultInfo" :url="'/pages/expert/detail/main?id=' + consultInfo._id" >
    <image mode="aspectFit" :src="consultInfo.avatarUrl" class="left-part"></image>
    <div class="middle-part">
      <p class="line1">{{consultInfo.name || consultInfo.nickName}} <span>{{consultInfo.academicTitle}}</span></p>
      <p class="line2" v-if="consultInfo.averageScore">评分：&nbsp;{{consultInfo.averageScore ? consultInfo.averageScore : '暂无'}}</p>
      <p class="line4" v-if="tagDescList">
        <span class="tag" v-for="(tag, index) in tagDescList" :key="index">{{tag}}</span>
      </p>
    </div>
    <!-- 专家不可以咨询其他专家,但可以查看咨询主页 -->
    <div class="right-part" v-if="userType !== '2'">
      <button class="consult-btn" @click.stop="clickConsult(consultInfo)">咨询</button>
    </div>
  </navigator>
</template>
<script>
import api from '@/api'
export default {
  data () {
    return {
      userType: '',
      tagDescList: []
    }
  },
  props: {
    consultInfo: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  methods: {
    async initConsult (consultInfo) { // 新建咨询室
      let consultId = ''
      await api.consult.addConsult({
        expertId: consultInfo.id
      }).then(res => {
        consultId = res.consultId
      }).catch(err => {
        console.log(err)
      })
      // mock数据：
      consultId = '3444444'
      return consultId
    },
    clickConsult (consultInfo) { // 前往咨询室
      if (!consultInfo.isConsulting) {
        // 新建咨询室：
        consultInfo.consultId = this.initConsult(consultInfo)
      }
      wx.navigateTo({url: `/pages/consult/detail/main?id=${consultInfo.consultId}`})
    },
    setTagDescList () {
      if (this.consultInfo && this.consultInfo.tagList) {
        this.consultInfo.tagList.forEach(tagType => {
          let tagTypeDesc = this.filterTagType(tagType)
          this.tagDescList.push(tagTypeDesc)
        })
      }
    },
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
  onLoad (options) {
    this.userType = this.$app.globalData.userType || ''
  },
  mounted () {
    this.setTagDescList()
  }
}
</script>

<style lang="less">
@import '~@/styles/functions.less';
.consult-info-card {
  padding: 12px 15px;
  background: #fff;
  border-bottom: 1px solid #eee;
  display: flex;
  flex-direction: row;
  .left-part {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 15px;
  }
  .middle-part {
    flex: 1;
    .line1 {
      font-size: 16px;
      font-weight: bolder;
      span {
        display: inline-block;
        margin-left: 5px;
        font-size: 12px;
        color: rgb(187, 186, 186);
      }
    }
    .line2 {
      font-size: 14px;
      .fn_ellipsis();
      margin-top: 3px;
    }
    .line4 {
      margin-top: -2px;
      font-size: 12px;
      color:  rgb(187, 186, 186);
      span {
        display: inline-block;
        padding: 0 4px;
        margin-right: 8px;
        border: 1px solid #eee;
        border-radius: 3px;
        margin-top: 10px;
      }
      span:last-child {
        margin-right: 0;
      }
    }
  }
  .right-part {
    margin-left: 10px;
    display:flex;
    align-items:center;
    justify-content:center;
    flex-direction:row;
    .consult-btn {
      border-radius: 10px;
      border: 1px solid #FFD161;
      font-size: 14px;
      color: #FFD161;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 10px;
      height: 30px;
    }
  }
}
</style>
