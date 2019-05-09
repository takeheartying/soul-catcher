<template>
  <!-- 心理档案--记录详情 -->
  <section class="page-my-record">
    <div class="page-my-record--container">
      <mpvue-echarts :echarts="echarts" :throttleTouch="true" :onInit="initChart" canvasId="record-canvas" />
    </div>
    <g-noresult
    v-if="!recordInfo"
    :show="true"
    :record="'没有查到相关记录~'">
    </g-noresult>
  </section>
</template>
<script>

import mpvueEcharts from 'mpvue-echarts'
import echarts from 'public/lib/echarts.min.js'
import api from '@/api'
import GNoresult from '@/components/g-noresult/index.vue'
import moment from 'moment'
let chart = null
export default {
  components: {
    mpvueEcharts,
    GNoresult
  },
  data () {
    return {
      echarts,
      userType: '',
      expertId: '',
      recordInfo: {}
    }
  },
  methods: {
    initChart (canvas, width, height) {
      chart = echarts.init(canvas, 'light', {
        width: width,
        height: height
      })
      canvas.setChart(chart)
      return chart
    },
    setChartOption () {
      if (!this.recordInfo) return false
      let option = {
        title: {
          text: '心理状况记录图',
          textStyle: {
            fontSize: 16
          },
          itemGap: 4,
          subtext: `平均分：${this.recordInfo.averageScore} 分    时间段：${this.recordInfo.interval}\n咨询师：${this.recordInfo.expertName || this.recordInfo.expertNickName}`,
          subtextStyle: {
            lineHeight: 20,
            height: 40
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: { // 图例名
          data: ['分数'],
          show: false
        },
        // 工具框，可以选择
        // toolbox: {
        //   feature: {
        //     saveAsImage: {}
        //   }
        // },
        grid: {
          top: '25%',
          left: '2%', // 图表距边框的距离
          right: '2%',
          bottom: '2%',
          containLabel: true
        },
        xAxis: {
          // name: '时间',
          type: 'category',
          boundaryGap: false,
          data: this.recordInfo.timeList,
          // 坐标轴颜色
          axisLine: {
            lineStyle: {
              // color: 'red'
            }
          },
          // x轴文字旋转
          axisLabel: {
            rotate: (this.recordInfo.timeList.length <= 10) ? 40 : -90,
            fontSize: 10,
            interval: 0
          }
        },
        yAxis: {
          // name: '评分',
          type: 'value',
          axisLabel: {
            formatter: '{value} 分'
          }
        },
        series: [{
          name: '分数',
          type: 'line',
          symbol: 'circle',
          symbolSize: 4, // 拐点圆的大小
          color: ['red'], // 折线条的颜色
          smooth: true, // 实线为true
          itemStyle: {
            normal: {
              color: 'red',
              borderColor: 'red', // 拐点边框颜色
              lineStyle: {
                width: 2,
                type: 'solid' // 'dotted'虚线 'solid'实线
              }
            }
          },
          data: this.recordInfo.scoreList
        }]
      }
      chart.setOption(option)
    },
    async getRecordListByExpertId () {
      // 获取详情：
      await api.my.getRecordListByExpertId({
        expertId: this.expertId,
        dateBegin: this.dateBegin ? moment().subtract(this.dateBegin, 'months') : ''
      }).then(res => {
        this.recordList = res || []
      }).catch(err => {
        console.log(err)
      })
      // mock数据：
      let res = {
        expertId: '3333',
        expertName: '家的看法',
        expertNickName: '家的看法迪士尼开发商',
        averageScore: 9.0,
        dateBegin: '',
        interval: '六个月内',
        items: [
          {
            createTime: '2019-10-19',
            score: 7.0
          },
          {
            createTime: '2019-10-19',
            score: 4.9
          },
          {
            createTime: '2019-10-19',
            score: 9.0
          },
          {
            createTime: '2019-10-19',
            score: 1.6
          },
          {
            createTime: '2019-10-19',
            score: 3.0
          }
        ]
      }
      if (res && res.items) {
        this.recordInfo = Object.assign({}, res, {timeList: [], scoreList: []})
        res.items.forEach((item, index) => {
          this.recordInfo.timeList.push(item.createTime)
          this.recordInfo.scoreList.push(item.score)
        })
        setTimeout(() => {
          this.setChartOption()
        }, 1000)
      }
    }
  },
  onLoad (options) {
    this.userType = this.$app.globalData.userType || ''
    this.expertId = options.expertId
    this.dateBegin = Number(options.dateBegin) || ''
  },
  mounted () {
    wx.setNavigationBarTitle({
      title: '档案详情'
    })
    this.getRecordListByExpertId()
  }
}
</script>

<style lang="less">
  @import "~@/styles/functions.less";
  .page-my-record {
    height: 100%;
    background: #fff;
    display: flex;
    justify-content: center;
    .page-my-record--container {
      padding: 20px;
      width: 100%;
      height: 400px;
      margin: 2px;
      border-radius: 5px;
      border: 4px solid rgb(241, 163, 163);
    }
  }
</style>

