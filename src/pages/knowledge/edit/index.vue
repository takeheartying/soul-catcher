<template>
  <section class="page-knowledge-add-or-edit">
    <g-loading :loading="loading"></g-loading>
    <g-noresult
    v-if="!loading && knowledgeId && !knowledgeInfo._id"
    :show="knowledgeId && !knowledgeInfo._id"
    :message="'未能查到知识库~'">
    </g-noresult>
    <form @submit="formSubmit" v-if="!loading && (!knowledgeId || knowledgeInfo._id)">
      <div class="zan-panel">
        <div class="upload-img-warp">
          <div class="upload-label">图片：</div>
          <i class="iconfont icon-shangchuan" @click="chooseImage()" v-if="(!picUrl && !knowledgeInfo.picUrl)"></i>
          <image class="upload-image" :src="picUrl || knowledgeInfo.picUrl" v-if="picUrl || knowledgeInfo.picUrl" @click="chooseImage()" mode="aspectFill"></image>
        </div>
        <zan-field v-bind="Object.assign({}, handleFunctions, base.title)" :value="knowledgeInfo.title" :focus="curComponentId === base.title.componentId"/>
        <zan-field v-bind="Object.assign({}, handleFunctions, base.desc)" :value="knowledgeInfo.desc" :focus="curComponentId === base.desc.componentId"/>
        <zan-field v-bind="Object.assign({}, handleFunctions, base.content)" :value="knowledgeInfo.content" :focus="curComponentId === base.content.componentId"/>
        <div class="good-at">类型：</div>
        <radio-group class="tag-list" @change="radioChange($event)">
          <label class="tag-list-item" v-for="(item, index) in base.tagList" :key="index">
            <radio class="radio" :value="item.name" :checked="tagType === item.name || item.checked" />
            <span class="radio-value">{{item.value}}</span>
          </label>
        </radio-group>
      </div>
      <div class="zan-btns">
        <button class="zan-btn submit-btn" formType="submit">提交</button>
      </div>
    </form>
  </section>
</template>
<script>
import ZanField from '@/components/zan/field'
import GNoresult from '@/components/g-noresult/index.vue'
import GLoading from '@/components/g-loading/index.vue'
import api from '@/api'
export default {
  components: {
    ZanField,
    GNoresult,
    GLoading
  },
  data () {
    return {
      file: {}, // 上传的临时文件
      loading: false,
      originPic: '', // 原有图片，用于删除
      picUrl: '',
      title: '',
      knowledgeId: '',
      knowledgeInfo: {},
      curComponentId: '',
      base: {
        title: {
          title: '标题：',
          placeholder: '请输入不超过15个字的标题',
          componentId: 'title'
        },
        desc: {
          title: '简述：',
          placeholder: '请输入不超过30字的简述',
          componentId: 'desc'
        },
        content: {
          title: '内容：',
          type: 'textarea',
          placeholder: '请输入内容',
          componentId: 'content'
        },
        tagList: [
          {
            name: '1',
            value: '爱情脱单',
            checked: false
          },
          {
            name: '2',
            value: '智商情商',
            checked: false
          },
          {
            name: '3',
            value: '趣味性格',
            checked: false
          },
          {
            name: '4',
            value: '心理综合',
            checked: false
          }
        ]
      },
      handleFunctions: {
        handleZanFieldFocus: this.handleZanFieldFocus,
        handleZanFieldBlur: this.handleZanFieldBlur,
        handleZanFieldChange: this.handleZanFieldChange
      },
      tagType: '',
      userType: '' // 0 管理员 1 学生 2 专家 3 家长
    }
  },
  onLoad (options) {
    this.userType = this.$app.globalData.userType || ''
    this.knowledgeId = options.id
    if (this.knowledgeId) { // 编辑知识库
      this.getKnowledgeById()
    }
  },
  methods: {
    upload (res) { // 上传单张图片
      let uploadParams = {}
      if (res && res.tempFilePaths) {
        const filePath = res.tempFilePaths[0]
        uploadParams = {
          filePath
        }
      }
      return uploadParams
    },
    chooseImage () { // 图片上传
      let that = this
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success (res) {
          // 存储临时路径 -- 提交之后再上传图片：
          const size = res.tempFiles[0].size
          if (size > 2 * 1024 * 1024) {
            that.$toast('请上传小于2M的图片')
            return false
          }
          that.picUrl = res.tempFilePaths[0]
          that.file = res
        }
      })
    },
    async getKnowledgeById () {
      this.loading = true
      await api.knowledgeBase.getKnowledgeDetailById({
        _id: this.knowledgeId
      }).then(res => {
        if (res && res.data) {
          this.knowledgeInfo = res.data || {}
          this.originPic = this.knowledgeInfo.picUrl || ''
        }
      }).catch(err => {
        console.log(err)
      })

      this.loading = false
      this.initData()
    },
    initData () {
      if (this.knowledgeInfo && this.knowledgeInfo.tagType) { // 初始设置radio的值
        let index = Number(this.knowledgeInfo.tagType) - 1
        if (this.base.tagList[index]) {
          this.base.tagList[index].checked = true
          this.tagType = this.knowledgeInfo.tagType
        }
      }
      this.picUrl = this.knowledgeInfo.picUrl || '' // 初始设置picUrl
    },
    handleZanFieldChange (e) {
      const { componentId, target } = e
      this.knowledgeInfo[componentId] = target.value
    },
    handleZanFieldFocus (e) {
      this.curComponentId = e.componentId
    },
    handleZanFieldBlur (e) {
      this.curComponentId = ''
    },
    radioChange (e) {
      this.tagType = e.target.value
    },
    async submitEdit (submitInfo) {
      let that = this
      wx.showModal({
        content: '确定提交？',
        showCancel: true, // 是否显示取消按钮
        cancelColor: 'skyblue', // 取消文字的颜色
        confirmColor: 'skyblue', // 确定文字的颜色
        success: async res => {
          if (res.cancel) {
            // 点击取消,默认隐藏弹框
          } else {
            // 点击确定 -- 上传图片并存储
            await api.knowledgeBase.updateKnowledge(submitInfo).then(res => {
              if (res && res.code === '0') {
                if (res.picUrl) { // 更改了图片
                  that.originPic = res.picUrl // 存储原来的图片后用于删除
                  that.picUrl = res.picUrl // 替换临时图片url 为 服务器的图片url
                }
                that.$toast(res.message || '提交成功！')
                return false
              }
              if (res && res.code === '-1') {
                that.$toast(res.message || '提交失败！')
                return false
              }
            })
          }
        }
      })
    },
    async submitAdd (submitInfo) {
      let that = this
      wx.showModal({
        content: '确定添加？',
        showCancel: true, // 是否显示取消按钮
        cancelColor: 'skyblue', // 取消文字的颜色
        confirmColor: 'skyblue', // 确定文字的颜色
        success: async function (res) {
          if (res.cancel) {
            // 点击取消,默认隐藏弹框
          } else {
            // 点击确定 -- 上传图片并存储
            await api.knowledgeBase.addKnowledge(submitInfo).then(res => {
              if (res) {
                that.$toast('提交成功！')
              }
            }).catch(err => {
              console.log(err)
              that.$toast('系统错误！')
            })
          }
        }
      })
    },
    formSubmit (event) {
      let uploadParams = this.upload(this.file)
      let submitInfo = Object.assign({}, event.target.value, {tagType: this.tagType, picUrl: this.picUrl})
      for (const key in submitInfo) {
        if (submitInfo.hasOwnProperty(key)) {
          const element = submitInfo[key]
          if (!element || !element.length) {
            this.$toast('信息不可为空！')
            return false
          }
        }
      }
      if (this.knowledgeId) {
        submitInfo._id = this.knowledgeId
      }
      if (uploadParams) {
        submitInfo.uploadParams = uploadParams
      }
      if (this.originPic) {
        submitInfo.originPic = this.originPic
      }
      if (this.knowledgeId) { // 修改知识库
        this.submitEdit(submitInfo)
      } else { // 添加知识库
        this.submitAdd(submitInfo)
      }
    }
  },
  mounted () {
    wx.setNavigationBarTitle({
      title: this.title
    })
  }
}
</script>

<style lang="less">
.page-knowledge-add-or-edit {
  height: 100%;
  background: #fff;
  .submit-btn {
    background: #63B8FF;
  }
  .good-at {
    padding: 15px 0 0 20px;
    font-size: 16px;
  }
  .upload-img-warp {
    display: flex;
    flex-direction: row;
    align-items: center;
    .upload-label {
      padding: 15px 0 0 20px;
      font-size: 16px;
    }
    .upload-image {
      width: 90px;
      height: 70px;
      border-radius: 3px;
      padding-top: 20px;
      padding-left: 40px;
    }
    .iconfont {
      color: #63B8FF;
    font-size: 60px;
      left: 31px;
      position: relative;
      top: 10px;
    }
  }
  .tag-list {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    padding: 15px 0;
    .tag-list-item {
      .radio-value {
        margin-left: -3px;
      }
      .radio {
        transform: scale(0.5);
        position: relative;
        top: -1.5px;
      }
    }
  }
}
</style>
