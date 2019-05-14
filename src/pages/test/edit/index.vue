<template>
  <section class="page-test-add-or-edit">
    <g-loading :loading="loading"></g-loading>
    <g-noresult
    v-if="!loading && testId && !testInfo.id"
    :show="testId && !testInfo.id"
    :message="'未能查到测试题~'">
    </g-noresult>
    <form @submit="formSubmit" v-if="!loading && (!testId || testInfo.id)">
      <div class="zan-panel">
        <div class="upload-img-warp">
          <div class="upload-label">图片：</div>
          <i class="iconfont icon-shangchuan" @click="chooseImage()" v-if="(!pic && !testInfo.pic)"></i>
          <image class="upload-image" :src="pic || testInfo.pic" v-if="pic || testInfo.pic" @click="chooseImage()" mode="aspectFill"></image>
        </div>
        <zan-field v-bind="Object.assign({}, handleFunctions, base.title)" :value="testInfo.title" :focus="curComponentId === base.title.componentId"/>
        <zan-field v-bind="Object.assign({}, handleFunctions, base.desc)" :value="testInfo.desc" :focus="curComponentId === base.desc.componentId"/>
        <zan-field v-bind="Object.assign({}, handleFunctions, base.detail)" :value="testInfo.detail" :focus="curComponentId === base.detail.componentId"/>
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
      loading: false,
      pic: '',
      title: '',
      testId: '',
      testInfo: {},
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
        detail: {
          title: '详情：',
          type: 'textarea',
          placeholder: '请输入描述详情',
          componentId: 'detail'
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
    this.testId = options.id
    if (this.testId) { // 编辑测试
      this.getTestById()
    }
  },
  methods: {
    async upload (file) { // 上传单张图片
      const tempFiles = file.tempFiles
      const path = tempFiles[0].path
      const size = tempFiles[0].size
      if (size > 2 * 1024 * 1024) {
        this.$toast('请上传小于2M的图片')
        return
      }
      this.$loading.show('正在上传')
      await api.upload({
        url: '/kanoupload/imageupload.json', // 上传的地址
        path: path,
        name: 'testPic'
      }).then(res => {
        if (res) {
          console.log('上传成功！')
        }
      }).catch(err => {
        console.log(err)
        this.$toast('上传失败！')
      })
      this.$loading.hide()
    },
    chooseImage () { // 图片上传
      let that = this
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success (res) {
          that.pic = res.tempFilePaths[0]
          // 上传图片：
          that.upload(res)
        }
      })
    },
    async getTestById () {
      this.loading = true
      await api.test.getTestDetailInfoById({
        id: this.testId
      }).then(res => {
        this.testInfo = res || {}
      }).catch(err => {
        console.log(err)
      })
      // mock数据：
      this.testInfo = {
        picUrl: 'http://img3.imgtn.bdimg.com/it/u=2870322368,453611869&fm=26&gp=0.jpg',
        title: '从积极心理学到幸福感',
        desc: '心境由心而设，态度可以决定我们的生活',
        detail: '围殴减肥的空间打发时间爱发科的结论是开饭啦司法解释口岸疯狂夺金萨福克精神科拉飞机拉萨九分裤大富科技按时付款了贷款酸辣粉东方健康路撒放开了的附件安联大厦积分卡斯加咖啡拉萨到付款荆防颗粒三加上端口分类考试了',
        tagType: 4, // 1爱情脱单 2智商情商 3趣味性格 4心理综合
        tagTypeDesc: '心理综合',
        testNum: 111,
        id: '111',
        examList: [ // 测试题目列表
          {
            questionTitle: '你曾经想要成为小说家或者词作者吗？',
            questionId: '22333',
            options: [
              {
                content: '想过',
                score: 7, // 心理健康积分
                isChecked: false
              },
              {
                content: '从没想过',
                score: 8,
                isChecked: false
              }
            ]
          },
          {
            questionTitle: '学生时代，在文艺汇演时，你基本都是主角？',
            questionId: '33323',
            options: [
              {
                content: '是的',
                score: 7, // 心理健康积分
                isChecked: false
              },
              {
                content: '没有，我一般低调',
                score: 8,
                isChecked: false
              }
            ]
          },
          {
            questionTitle: '你一次都没有被异性追过？',
            questionId: '654756',
            options: [
              {
                content: '是的',
                score: 7, // 心理健康积分
                isChecked: false
              },
              {
                content: '当然不是',
                score: 8,
                isChecked: false
              }
            ]
          },
          {
            questionTitle: '舞会前，你会积极调查即将出席的异性情况？',
            questionId: '454354',
            options: [
              {
                content: '是的',
                score: 7, // 心理健康积分
                isChecked: false
              },
              {
                content: '不会的呀呀呀呀呀呀呀呀呀晕晕晕晕晕晕晕呀呀呀呀呀呀晕晕晕晕晕晕晕晕晕晕晕晕晕晕晕晕晕晕嘤嘤嘤嘤嘤嘤嘤',
                score: 8,
                isChecked: false
              }
            ]
          }
        ]
      }

      this.loading = false
      this.initData()
    },
    initData () {
      if (this.testInfo && this.testInfo.tagType) { // 初始设置radio的值
        let index = Number(this.testInfo.tagType) - 1
        if (this.base.tagList[index]) {
          this.base.tagList[index].checked = true
          this.tagType = this.testInfo.tagType
        }
      }
      this.pic = this.testInfo.pic || '' // 初始设置pic
    },
    handleZanFieldChange (e) {
      const { componentId, target } = e
      this.testInfo[componentId] = target.value
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
      wx.showModal({
        content: '确定提交？',
        showCancel: true, // 是否显示取消按钮
        cancelColor: 'skyblue', // 取消文字的颜色
        confirmColor: 'skyblue', // 确定文字的颜色
        success: async res => {
          if (res.cancel) {
            // 点击取消,默认隐藏弹框
          } else {
            // 点击确定
            await api.test.updateTest(submitInfo).then(res => {
              if (res) {
                this.$toast('提交成功！')
              }
            }).catch(err => {
              console.log(err)
              this.$toast('系统错误！')
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
            // 点击确定
            await api.test.addTest(submitInfo).then(res => {
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
      let submitInfo = Object.assign({}, event.target.value, {tagType: this.tagType, pic: this.pic})
      for (const key in submitInfo) {
        if (submitInfo.hasOwnProperty(key)) {
          const element = submitInfo[key]
          if (!element || !element.length) {
            this.$toast('信息不可为空！')
            return false
          }
        }
      }
      if (this.testId) { // 修改测试
        this.submitEdit(submitInfo)
      } else { // 添加测试
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
.page-test-add-or-edit {
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
