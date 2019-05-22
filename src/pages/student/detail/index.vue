<template>
  <div class="page-student-detail" :style="studentInfo.id ? '' : 'height:100%;'">
    <!-- 学生主页详情 -->
    <div class="page-student-detail--container" v-if="studentInfo && studentInfo.id">
      <div class="student-info-top">
        <image class="student-info-top-avatar" mode="aspectFill" :src="studentInfo.avatar"></image>
        <div class="student-info-top-name">{{studentInfo.name || studentInfo.nickName}}</div>
        <div class="student-info-top-organization">{{studentInfo.organization}}</div>
      </div>
      <div class="student-info-middle">
        <div :class="curTab === 'warn' ? 'student-info-middle-tab active' : 'student-info-middle-tab'" @click="switchTab('warn')">预警</div>
        <div :class="curTab === 'record' ? 'student-info-middle-tab active' : 'student-info-middle-tab'" @click="switchTab('record')">心理档案</div>
        <!-- 家长不可以看学生所做测试题： -->
        <div :class="curTab === 'test' ? 'student-info-middle-tab active' : 'student-info-middle-tab'" v-if="userType != '3'" @click="switchTab('test')">测试集</div>
      </div>
      <!-- 预警列表： -->
      <div class="student-info-tabs" v-if="curTab === 'warn'">
        <div class="tab-title" v-if="warnNum">总数【{{warnNum}}】</div>
        <div class="tab-noresult" v-if="!warnNum && !loading">当前没有数据哦~</div>
        <scroll-view  class="tab-scroll-view"  scroll-y @scrolltolower="bindDownLoad" lower-threshold="100">
          <ul class="tab-list" v-if="warnNum">
            <li class="tab-list-item"
              v-for="(warn, index) in warnList" :key="index" >
              <warn-item-card :warnInfo="warn"></warn-item-card>
            </li>
          </ul>
        </scroll-view>
      </div>
      <!-- 心理档案列表 -->
      <div class="student-info-tabs" v-if="curTab === 'record'">
        <div class="tab-noresult" v-if="!recordNum && !loading">当前没有数据哦~</div>
        <div class="tab-filter">
          <!-- top:筛选条离顶部的距离 -->
          <filter-bar
            :top="0"
            :bar-menus="barMenus"
            @changeSelect="changeRecordData">
          </filter-bar>
        </div>
        <!-- 注意：查看scrollView是否需要设置：？？？？？？？？？？？？？？？？？？？？ -->
        <scroll-view  class="tab-scroll-view"  scroll-y @scrolltolower="bindDownLoad" lower-threshold="100">
          <ul class="tab-list" v-if="recordNum">
            <li class="tab-list-item"
              v-for="(record, index) in recordList" :key="index">
              <record-item-card :recordInfo="record"></record-item-card>
            </li>
          </ul>
        </scroll-view>
      </div>
      <!-- 测试列表 -->
      <div class="student-info-tabs" v-if="curTab === 'test'">
        <div class="tab-title" v-if="testResultNum">总数【{{testResultNum}}】</div>
        <div class="tab-noresult" v-if="!testResultNum && !loading">当前没有数据哦~</div>
        <scroll-view  class="tab-scroll-view"  scroll-y @scrolltolower="bindDownLoad" lower-threshold="100">
          <ul class="tab-list" v-if="testResultNum">
            <li class="tab-list-item"
              v-for="(test, index) in testList" :key="index">
              <test-item-card :testInfo="test" :showType="'result'" :studentId="studentId"></test-item-card>
            </li>
          </ul>
        </scroll-view>
      </div>
      <div class="student-info-footer" v-if="userType !== '3'">
        <div class="student-info-footer-item concern" @click.stop="concernChange()">
          <i class="iconfont icon-quxiaoguanzhu" v-if="studentInfo.hasConcern"></i>
          <i class="iconfont icon-tianjiaguanzhu" v-if="!studentInfo.hasConcern"></i>
          <p class="concern-status">{{studentInfo.hasConcern ? '已关注' : '加关注'}}</p>
        </div>
        <div class="student-info-footer-item online"  @click="clickConsult(studentInfo)">线上咨询</div>
        <div class="student-info-footer-item phone"  v-if="studentInfo.phone" @click="clickCallPhone(studentInfo.phone)">拨打电话</div>
      </div>
    </div>
    <g-noresult
    v-if="!studentInfo.id"
    :show="!studentInfo.id"
    :message="'没有该学生信息哦~'">
    </g-noresult>
  </div>
</template>
<script>
import moment from 'moment'
import FilterBar from '@/components/g-filter/index.vue'
import warnItemCard from './component/warn-item-card.vue'
import recordItemCard from './component/record-item-card.vue'
import testItemCard from './component/test-item-card.vue'
import GNoresult from '@/components/g-noresult/index.vue'
import api from '@/api'
export default {
  components: {
    FilterBar,
    warnItemCard,
    recordItemCard,
    testItemCard,
    GNoresult
  },
  data () {
    return {
      studentId: '',
      studentInfo: {},
      curTab: 'warn', // 当前tab 'warn' 或 'record' 或 'test'
      userType: '',
      loading: false,
      warnFinished: false,
      warnPageNo: 1,
      warnList: [],
      warnNum: 0,
      testFinished: false,
      testPageNo: 1,
      testList: [],
      testResultNum: 0,
      // 以下是心理记录字段：
      recordFinished: false,
      recordPageNo: 1,
      recordList: [],
      recordNum: 0,
      showConsultMost: false, // 显示专家咨询数最多
      dateBegin: '', // 以月为单位 1 3 6 12   xx月内有过咨询【即为该专家最后一次咨询时间在 筛选时间范围内】
      barMenus: [
        {
          name: '日期筛选', // 按钮名称
          icon: '',
          value: '', // 按钮的默认值
          type: '', // 区分筛选按钮，当type='filter'时，列表为筛选模式。
          showTabHeader: true, // 显示弹框一级目录， 当type='filter'时，其值为false
          defaultIcon: '',
          selectIcon: '',
          selectIndex: 0, // 当type='filter'时，其值为-1
          tabs: [{
            icon: '',
            name: '日期筛选',
            selectIndex: 0,
            detailList: [{ // 二级目录左侧列表数据
              name: '全部',
              icon: '',
              value: '', // 以月为单位 1 3 6 12
              selectIndex: 0
            },
            {
              name: '一个月内',
              icon: '',
              value: 1,
              selectIndex: 1
            },
            {
              name: '三个月内',
              icon: '',
              value: 3,
              selectIndex: 2
            },
            {
              name: '六个月内',
              icon: '',
              value: 6,
              selectIndex: 3
            },
            {
              name: '一年内',
              icon: '',
              value: 12,
              selectIndex: 4
            }]
          }]
        },
        {
          name: '专家筛选',
          icon: '',
          value: '',
          showTabHeader: true,
          defaultIcon: '',
          selectIcon: '',
          selectIndex: 0,
          tabs: [{
            icon: '',
            name: '专家筛选',
            selectIndex: 0,
            detailList: [{
              name: '全部',
              icon: '',
              value: '',
              selectIndex: 0
            }, {
              name: '咨询最多',
              icon: '',
              value: '1',
              selectIndex: 1
            }]
          }]
        }
      ]
    }
  },
  methods: {
    clickCallPhone (phone) { // 拨打电话
      if (phone) {
        wx.makePhoneCall({
          phoneNumber: phone,
          success: (result) => {
            console.log('拨打电话成功！')
          },
          fail: () => {
            console.log('拨打电话失败！')
          },
          complete: () => {}
        })
      }
    },
    async initConsult (consultInfo) { // 新建咨询室
      await wx.showModal({
        content: '确定要咨询学生？',
        showCancel: true, // 是否显示取消按钮
        cancelColor: 'skyblue', // 取消文字的颜色
        confirmColor: 'skyblue', // 确定文字的颜色
        success: async function (res) {
          if (res.cancel) {
            // 点击取消,默认隐藏弹框
          } else {
            // 点击确定
            let consultId = ''
            await api.consult.addConsult({
              studentId: consultInfo.id
            }).then(res => {
              consultId = res.consultId
            }).catch(err => {
              console.log(err)
            })
            // mock数据：
            consultId = '3444444'

            if (consultId) {
              wx.navigateTo({url: `/pages/consult/detail/main?id=${consultId}`})
            }
          }
        }
      })
    },
    async clickConsult (consultInfo) { // 前往咨询室
      if (!consultInfo.isConsulting) {
        // 新建咨询室：
        this.initConsult(consultInfo)
      } else {
        if (consultInfo.consultId) {
          wx.navigateTo({url: `/pages/consult/detail/main?id=${consultInfo.consultId}`})
        }
      }
    },
    async concernChange () { // 关注与取消关注
      await api.my.concernUser({
        concernedId: this.studentInfo.id, // 被关注者id
        hasConcern: !this.studentInfo.hasConcern
      }).then((res) => {
        if (res) {
          console.log(res.message || '')
          this.studentInfo.hasConcern = !this.studentInfo.hasConcern
        }
      }).catch(err => {
        console.log(err || '系统出错')
      })
      // mock数据：
      this.studentInfo.hasConcern = !this.studentInfo.hasConcern
    },
    switchTab (tab) {
      this.curTab = tab || 'warn'
      switch (tab) { // 初始加载列表
        case 'warn':
          if (this.warnPageNo === 1) {
            this.getWarnList()
          }
          break
        case 'record':
          if (this.recordPageNo === 1) {
            this.getRecordList()
          }
          break
        case 'test':
          if (this.testPageNo === 1) {
            this.getTestList()
          }
          break
        default:
          break
      }
    },
    // 获取预警列表：
    async getWarnList () {
      // 获取预警列表：<= 4分
      this.loading = true
      this.warnFinished = false
      await api.common.getRecordListByUserId({
        pageSize: 10,
        pageNo: this.warnPageNo,
        score: 4,
        userId: this.studentId
      }).then(res => {
        this.warnList = this.warnList.concat(res.items)
        this.warnFinished = (res.pageCount && this.warnPageNo >= res.pageCount)
        this.warnNum = res.totalCount || 0
        this.warnPageNo++
      }).catch(err => {
        console.log(err)
      })
      // mock数据：
      let res = {
        pageSize: 5,
        pageNo: 1,
        pageCount: 3,
        totalCount: 15,
        items: [
          {
            avatar: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2014550423,2613559085&fm=26&gp=0.jpg',
            nickName: '对我的积分地方的萨芬的阿道夫大师傅大师傅',
            name: '',
            goodAt: '爱情脱单、趣味性格、心理综合',
            createTime: '2019-03-21',
            score: 3.0,
            id: '23343243'
          },
          {
            avatar: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2014550423,2613559085&fm=26&gp=0.jpg',
            nickName: '对我的积分地方的萨芬的阿道夫大师傅大师傅',
            name: '王大锤',
            goodAt: '爱情脱单、智商情商、心理综合',
            createTime: '2019-03-20',
            score: 3.0,
            id: '23343243'
          },
          {
            avatar: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2014550423,2613559085&fm=26&gp=0.jpg',
            nickName: '对我的积分地方的萨芬的阿道夫大师傅大师傅',
            name: '恒丰',
            goodAt: '爱情脱单、智商情商、趣味性格、心理综合',
            createTime: '2019-05-20',
            score: 3.0,
            id: '23343243'
          },
          {
            avatar: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2014550423,2613559085&fm=26&gp=0.jpg',
            nickName: '对我的积分地方的萨芬的阿道夫大师傅大师傅',
            name: '王大锤',
            goodAt: '智商情商、趣味性格、心理综合',
            createTime: '2019-05-21',
            score: 3.0,
            id: '23343243'
          },
          {
            avatar: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2014550423,2613559085&fm=26&gp=0.jpg',
            nickName: '对我的积分地方的萨芬的阿道夫大师傅大师傅',
            name: '王大锤',
            goodAt: '爱情脱单、智商情商、趣味性格、心理综合',
            createTime: '2019-05-10',
            score: 0,
            id: '23343243'
          }
        ]
      }
      this.warnList = this.warnList.concat(res.items)
      this.warnFinished = (res.pageCount && this.warnPageNo >= res.pageCount)
      this.warnNum = res.totalCount || 0
      this.warnPageNo++

      this.loading = false
    },
    // 获取测试集列表：
    async getTestList () {
      this.loading = true
      this.testFinished = false
      await api.test.getTestResultList({
        pageSize: 10,
        pageNo: this.testPageNo,
        userId: this.studentId || this.$app.globalData.userInfo.userId
      }).then(res => {
        if (res && res.data && res.data.data) {
          this.testList = this.testList.concat(res.data.data)
          this.testFinished = res.data.finished
          this.testResultNum = res.totalCount || 0
          this.testPageNo++
        } else if (res && res.code === '-1') {
          this.$toast(res.message || '系统错误！')
          this.testFinished = true
        } else {
          this.testFinished = true
        }
      }).catch(err => {
        this.testFinished = true
        console.log(err)
      })
      // mock数据：
      // let res = {
      //   pageSize: 5,
      //   pageNo: 1,
      //   pageCount: 3,
      //   totalCount: 15,
      //   items: [
      //     {
      //       picUrl: 'http://img3.imgtn.bdimg.com/it/u=2870322368,453611869&fm=26&gp=0.jpg',
      //       title: '从积极心理学到幸福感',
      //       desc: '心境由心而设，态度可以决定我们的生活',
      //       tagType: '心理综合',
      //       testorNum: 111,
      //       id: '111'
      //     },
      //     {
      //       picUrl: 'http://img5.imgtn.bdimg.com/it/u=2011373020,3359872499&fm=26&gp=0.jpg',
      //       title: '心理健康素养十条',
      //       desc: '今年的主题是“健康心理，快乐人生',
      //       tagType: '心理综合',
      //       testorNum: 3,
      //       id: '111'
      //     },
      //     {
      //       picUrl: 'http://img2.imgtn.bdimg.com/it/u=2620384659,4031296781&fm=26&gp=0.jpg',
      //       title: '性格与情感',
      //       desc: '人的性格不同是因为人的思维方式不同。一个人思维方式的形成，有来自诸多方面的影响。',
      //       tagType: '趣味性格',
      //       testorNum: 904,
      //       id: '20'
      //     },
      //     {
      //       picUrl: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1302036544,1637883161&fm=26&gp=0.jpg',
      //       title: '原来是爱情',
      //       desc: '感情不是兔子，守株是没用的',
      //       tagType: '爱情脱单',
      //       testorNum: 3004,
      //       id: '111'
      //     },
      //     {
      //       picUrl: 'http://img4.imgtn.bdimg.com/it/u=1019369127,2450633653&fm=26&gp=0.jpg',
      //       title: '决定你上限的，不是智商，而是自律',
      //       desc: '人生如苦旅，有时候决定我们上限的，不是智商，而是自律。',
      //       tagType: '智商情商',
      //       testorNum: 21,
      //       id: '111'
      //     }
      //   ]
      // }

      this.loading = false
    },
    // 获取心理档案（记录）列表：
    async getRecordList () {
      await api.my.getRecordList({
        showConsultMost: this.showConsultMost,
        dateBegin: this.dateBegin ? moment().subtract(this.dateBegin, 'months') : ''
      }).then(res => {
        this.recordList = this.recordList.concat(res.items)
        this.recordFinished = (res.pageCount && this.recordPageNo >= res.pageCount)
        this.recordNum = res.totalCount || 0
        this.recordPageNo++
      }).catch(err => {
        console.log(err)
      })
      let res = {
        pageSize: 5,
        pageNo: 1,
        pageCount: 3,
        totalCount: 15,
        items: [
          {
            expertId: '333', // 评分专家ID
            expertName: '撑得到',
            expertNickName: '大家三方卡机了房价快速',
            expertAvatar: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1557296506267&di=54627c45d15fb804ed5cdd0d007595b9&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20180419%2Fbede4a5c0d574550adf1714feaf10faa.jpeg',
            averageScore: 9.0, // 平均分
            dateBegin: '', // 月为单位，''指的是全部
            interval: '全部' // 时间段
          },
          {
            expertId: '333', // 评分专家ID
            expertName: '撑得到',
            expertNickName: '大家三方卡机了房价快速',
            expertAvatar: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1557296506267&di=54627c45d15fb804ed5cdd0d007595b9&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20180419%2Fbede4a5c0d574550adf1714feaf10faa.jpeg',
            averageScore: 9.0, // 平均分
            dateBegin: '', // 月为单位，''指的是全部
            interval: '全部' // 时间段
          },
          {
            expertId: '333', // 评分专家ID
            expertName: '王府井',
            expertNickName: '大家三方卡机了房价快速',
            expertAvatar: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1557296506267&di=54627c45d15fb804ed5cdd0d007595b9&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20180419%2Fbede4a5c0d574550adf1714feaf10faa.jpeg',
            averageScore: 9.0, // 平均分
            dateBegin: '', // 月为单位，''指的是全部
            interval: '全部' // 时间段
          },
          {
            expertId: '333', // 评分专家ID
            expertName: '水润英',
            expertNickName: '大家三方卡机了房价快速',
            expertAvatar: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1557296506267&di=54627c45d15fb804ed5cdd0d007595b9&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20180419%2Fbede4a5c0d574550adf1714feaf10faa.jpeg',
            averageScore: 3.0, // 平均分
            dateBegin: '', // 月为单位，''指的是全部
            interval: '全部' // 时间段
          },
          {
            expertId: '333', // 评分专家ID
            expertName: '撑得到',
            expertNickName: '大家三方卡机了房价快速',
            expertAvatar: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1557296506267&di=54627c45d15fb804ed5cdd0d007595b9&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20180419%2Fbede4a5c0d574550adf1714feaf10faa.jpeg',
            averageScore: 9.0, // 平均分
            dateBegin: '', // 月为单位，''指的是全部
            interval: '全部' // 时间段
          }
        ]
      }
      this.recordList = this.recordList.concat(res.items)
      this.recordFinished = (res.pageCount && this.recordPageNo >= res.pageCount)
      this.recordNum = res.totalCount || 0
      this.recordPageNo++

      this.loading = false
    },
    // 心理档案--筛选项变化：
    changeRecordData (v) { // 返回最终结果。(注：筛选结果的value返回json对象)
      if (v && v.length >= 2) {
        this.dateBegin = v[0].value || ''
        this.showConsultMost = (v[1].value === '1') // 按专家筛选
        // 重置信息：请求数据
        this.recordPageNo = 1
        this.recordList = []
        this.recordFinished = false
        this.switchTab('record')
      }
    },
    bindDownLoad () { // 上拉加载
      switch (this.curTab) {
        case 'warn':
          if (!this.warnFinished) {
            this.getWarnList()
          }
          break
        case 'record':
          if (!this.recordFinished) {
            this.getRecordList()
          }
          break
        case 'test':
          if (!this.testFinished) {
            this.getTestList()
          }
          break
        default:
          break
      }
    },
    async getExpertInfo () {
      await api.common.getUserInfo({
        id: this.studentId
      }).then(res => {
        this.studentInfo = res || {}
      }).catch(err => {
        console.log(err)
      })
      // mock数据：
      this.studentInfo = {
        id: '1111111',
        name: '王灿灿',
        nickName: '大会上开发',
        avatar: 'http://img2.imgtn.bdimg.com/it/u=1191849501,1904057087&fm=11&gp=0.jpg',
        tagList: ['爱情脱单', '智商情商', '趣味性格', '心理综合'],
        isConsulting: false,
        consultId: '',
        desc: 'kfdjsakfjkdjsafklj附近肯德基案发福建斯科拉放假快乐撒九分裤电费卡开飞机拉师傅就看到了撒父级士大夫附件啊时空裂缝京东数科拉风加快速度拉法基第三方进口量撒酒疯考虑到精神科拉飞机考虑到就说了的顺丰快递费啦', // 详细介绍
        organization: '浙江科技学院',
        hasConcern: true, // 是否关注了
        phone: '15868157426'
      }
    }
  },
  onUnload () {
    // 解决页面返回后，数据没重置的问题
    Object.assign(this.$data, this.$options.data())
  },
  onLoad (options) {
    Object.assign(this.$data, this.$options.data())
    this.userType = this.$app.globalData.userType || ''
    this.studentId = options.id || ''
    this.getExpertInfo()
    this.switchTab('warn') // 初始显示预警tab
  },
  mounted () {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#63B8FF'
    })
  }
}
</script>

<style lang="less">
  .page-student-detail {
    background: #fff;
    height: 100%;
    display: flex;
    flex-direction: column;
    .page-student-detail--container {
      height: 100%;
      flex:1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      .student-info-top {
        height: 135px;
        padding: 15px 10px;
        display: flex;
        width: 100%;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-image: linear-gradient(45deg, #fff, #63B8FF);
        .student-info-top-avatar {
          height: 80px;
          width: 80px;
          border-radius: 50%;
          border: 5px solid #63B8FF;
        }
        .student-info-top-name {
          font-weight: bold;
          font-size: 16px;
        }
        .student-info-top-organization {
          font-size: 12px;
          color: rgb(156, 151, 151);
        }
      }
      .student-info-middle {
        height: 20px;
        border-bottom: 10px solid rgb(240, 240, 240);
        border-top: 2px solid #eee;
        display: flex;
        width: 100%;
        flex-direction: row;
        justify-content: space-around;
        .student-info-middle-tab {
          position: relative;
          padding: 10px;
          font-weight: bold;
          text-align: center;
          &.active {
            color: #63B8FF;
          }
          &.active::after {
            width: 100%;
            display: block;
            content: '';
            height: 5px;
            bottom: 0;
            left: 0;
            background: #63B8FF;
            position: absolute;
          }
        }
      }
      .student-info-tabs {
        flex:1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        height: 100%;
        .tab-title {
          height: 40px;
          font-weight: bold;
          line-height: 40px;
          padding: 0 20px;
          border-bottom: 0.5px solid #eee;
        }
        .tab-noresult {
          height: 300px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .tab-filter{
          height: 40px;
          position:relative;
        }
        .tab-list {
          .tab-list-item {
            border-bottom: 0.5px solid #eee;
          }
        }
        .tab-scroll-view {
          flex: 1;
          overflow: auto;
          /*隐藏滚动条*/
          ::-webkit-scrollbar {
            width: 0;
            height: 0;
            color: transparent;
          }
        }
      }
      .student-info-footer {
        display: none;
        height: 53px;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        box-shadow: 0 0 6px rgb(214, 211, 211);
        background: #fff;
        .student-info-footer-item {
          padding: 15px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          margin: 0;
          &.phone {
            background: #63B8FF;
            color: #fff;
            font-size: 16px;
          }
          &.online {
            background: rgb(160, 224, 243);
            color: #fff;
            font-size: 16px;
          }
          &.concern {
            padding: 0;
            .concern-status {
              font-size: 12px;
              color: rgb(194, 186, 186);
            }
            .iconfont {
              font-size: 24px !important;
              height: 30px;
            }
          }
        }
      }
    }
  }
</style>
