<template>
  <!-- 我的心理档案 -->
  <section class="page-my-record">
    <div class="page-my-record--filter">
      <!-- top:筛选条离顶部的距离 -->
      <filter-bar
        top="1"
        :bar-menus="barMenus"
        @showDialog="handleShowDialog"
        @closeDialog="handleCloseDialog"
        @changeTab="handleChangeTab"
        @changeMainItem="handleChangeMainItem"
        @changeSelect="changeData">
      </filter-bar>
    </div>
    <div class="page-my-record--list" v-if="recordList && recordList.length">
      <div class="page-my-record--items">
        <div class="page-my-record--item" v-for="(record, index) in recordList" :key="index" @click="goToDetail(record)">
          <navigator class="page-my-record--item-left-part" :url="'/pages/expert/detail/main?id=' + record.expertId">
            <image class="page-my-record--item-left-part-image" mode="aspectFill" :src="record.expertAvatar"></image>
          </navigator>
          <div class="page-my-record--item-middle-part">
            <p class="record-nickname">咨询师：{{record.expertName || record.expertNickName}}</p>
            <p class="record-score">平均分：<strong>{{record.averageScore}}分</strong></p>
            <p class="record-time">时间段：{{record.interval}}</p>
          </div>
          <div class="page-my-record--item-right-part">
            <button class="record-btn" @click.stop="goToDetail(record)">查看</button>
          </div>
        </div>
      </div>
    </div>
    <g-noresult
    v-if="!recordList.length"
    :show="true"
    :record="'还没有任何记录~'">
    </g-noresult>
  </section>
</template>
<script>
import api from '@/api'
import FilterBar from '@/components/g-filter/index.vue'
import GNoresult from '@/components/g-noresult/index.vue'
import moment from 'moment'
export default {
  components: {
    FilterBar,
    GNoresult
  },
  data () {
    return {
      showConsultMost: false, // 显示专家咨询数最多
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
      ],
      userType: '',
      dateBegin: '', // 以月为单位 1 3 6 12   xx月内有过咨询【即为该专家最后一次咨询时间在 筛选时间范围内】
      recordList: []
    }
  },
  methods: {
    // filterBar的方法们：
    handleShowDialog (v) { // 显示按钮相对应的弹框时调用
      // console.log(v);
    },
    handleCloseDialog (v) { // 弹框消失时调用
      // console.log(v);
    },
    handleChangeTab (v) { // 切换弹框一级目录时调用
      // console.log(v);
    },
    handleChangeMainItem (v) { // 选择二级目录左侧列表时调用
      // console.log(v)
    },
    changeData (v) { // 返回最终结果。(注：筛选结果的value返回json对象)
      if (v && v.length >= 2) {
        this.dateBegin = v[0].value || ''
        this.showConsultMost = (v[1].value === '1') // 按专家筛选
        // 重置信息：请求数据
        this.recordList = []
        this.getRecordList()
      }
    },
    async getRecordList () {
      // 获取我的心理档案（记录）列表：
      await api.my.getRecordList({
        showConsultMost: this.showConsultMost,
        dateBegin: this.dateBegin ? moment().subtract(this.dateBegin, 'months') : ''
      }).then(res => {
        this.recordList = res || []
      }).catch(err => {
        console.log(err)
      })
      this.recordList = [
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
          expertName: '撑得到',
          expertNickName: '大家三方卡机了房价快速',
          expertAvatar: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1557296506267&di=54627c45d15fb804ed5cdd0d007595b9&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20180419%2Fbede4a5c0d574550adf1714feaf10faa.jpeg',
          averageScore: 9.0, // 平均分
          dateBegin: '', // 月为单位，''指的是全部
          interval: '全部' // 时间段
        }
      ]
    },
    goToDetail (record) {
      wx.navigateTo({url: `/pages/my/record/detail/main?expertId=${record.expertId}&dateBegin=${record.dateBegin}`})
    }
  },
  onLoad (options) {
    this.userType = this.$app.globalData.userType || ''
  },
  mounted () {
    wx.setNavigationBarTitle({
      title: '心理档案'
    })
    this.getRecordList()
  }
}
</script>

<style lang="less">
  @import "~@/styles/functions.less";
  .page-my-record {
    height: 100%;
    background: #fff;
    .page-my-record--list {
      .page-my-record--items {
        background: #fff;
        .page-my-record--item:nth-child(1) {
          border-top: 1px solid #eee;
        }
        .page-my-record--item {
          padding: 10px;
          border-bottom: 1px solid #eee;
          display: flex;
          flex-direction: row;
          .page-my-record--item-left-part {
            width: 55px;
            margin-right: 10px;
            .page-my-record--item-left-part-image {
              width: 55px;
              height: 55px;
              border-radius: 50%;
            }
          }
          .page-my-record--item-middle-part {
            flex: 1;
            .record-nickname {
              // font-weight: bolder;
            }
            .record-score {
              strong {
                display: inline;
                font-size: 14px;
                color: #FFD161;
              }
            }
            .record-time {
              // color: rgb(160, 157, 157);
            }
          }
          .page-my-record--item-right-part {
            margin-left: 10px;
            display:flex;
            align-items:center;
            justify-content:center;
            flex-direction:row;
            .record-btn {
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
      }
    }
    .page-my-record--filter{
      height: 40px;
    }
  }
</style>

