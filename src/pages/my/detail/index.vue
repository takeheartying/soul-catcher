<template>
  <section class="page-my-detail">
    <form @submit="formSubmit">
      <div class="zan-panel">
        <zan-field v-bind="Object.assign({}, handleFunctions, base.nickname)" :value="userInfo.nickName"/>
        <zan-field v-bind="Object.assign({}, handleFunctions, base.name)" :value="userInfo.name"/>
        <zan-field v-bind="Object.assign({}, handleFunctions, base.birthday)"  :value="userInfo.birthday"/>
        <zan-field v-bind="Object.assign({}, handleFunctions, base.phone)"  :value="userInfo.phone"/>
        <zan-field v-bind="Object.assign({}, handleFunctions, base.school)" :value="userInfo.school"/>
        <!-- 以下是生日选择： -->
        <!-- 配合 popup 使用 picker-view -->
        <!-- <div class="zan-cell zan-field">
          <div class="zan-cell__hd zan-field__title">生日</div>
          <div
            class="zan-field__input zan-cell__bd"
            @click="handleBirthdayFieldClick"
          >
            {{ birthdayPickerViewConfig.year[birthdayPickerViewConfig.value[0]] }}
            {{ birthdayPickerViewConfig.month[birthdayPickerViewConfig.value[1]] }}
            {{ birthdayPickerViewConfig.day[birthdayPickerViewConfig.value[1]] }}
          </div>
        </div> -->
        <!-- 对应的 popup 层 -->
        <!-- <div class="zan-popup zan-popup--bottom" :class="{ 'zan-popup--show' : birthdayPickerViewConfig.show }">
          <div class="zan-popup__mask" @click="hideBirthdayPopup"></div>
          <div class="zan-popup__container popup-field-example--bottom">
            <picker-view
              :value="birthdayPickerViewConfig.value"
              indicator-style="height: 50px"
              class="picker-view-example"
              @change="handlePopupBirthdayChange"
            >
              <picker-view-column>
                <div
                  class="picker-view-column-example"
                  v-for="(item, index) in birthdayPickerViewConfig.year"
                  :key="item"
                >{{item}}</div>
              </picker-view-column>
              <picker-view-column>
                <div
                  class="picker-view-column-example"
                  v-for="(item, index) in birthdayPickerViewConfig.month"
                  :key="item"
                >{{item}}</div>
              </picker-view-column>
              <picker-view-column>
                <div
                  class="picker-view-column-example"
                  v-for="(item, index) in birthdayPickerViewConfig.day"
                  :key="item"
                >{{item}}</div>
              </picker-view-column>
            </picker-view>
          </div>
        </div> -->


        <!-- 以下是地区选择： -->
        <!-- 配合 popup 使用 picker-view -->
        <div class="zan-cell zan-field">
          <div class="zan-cell__hd zan-field__title">我的地区</div>
          <div
            class="zan-field__input zan-cell__bd"
            @click="handleAreaFieldClick"
          >
            {{ areaPickerViewConfig.province[areaPickerViewConfig.value[0]] }}
            {{ areaPickerViewConfig.city[areaPickerViewConfig.value[1]] }}
            {{ areaPickerViewConfig.area[areaPickerViewConfig.value[1]] }}
          </div>
        </div>
        <!-- 对应的 popup 层 -->
        <div class="zan-popup zan-popup--bottom" :class="{ 'zan-popup--show' : areaPickerViewConfig.show }">
          <div class="zan-popup__mask" @click="hideAreaPopup"></div>
          <div class="zan-popup__container popup-field-example--bottom">
            <picker-view
              :value="areaPickerViewConfig.value"
              indicator-style="height: 50px"
              class="picker-view-example"
              @change="handlePopupAreaChange"
            >
              <picker-view-column>
                <div
                  class="picker-view-column-example"
                  v-for="(item, index) in areaPickerViewConfig.province"
                  :key="item"
                >{{item}}</div>
              </picker-view-column>
              <picker-view-column>
                <div
                  class="picker-view-column-example"
                  v-for="(item, index) in areaPickerViewConfig.city"
                  :key="item"
                >{{item}}</div>
              </picker-view-column>
              <picker-view-column>
                <div
                  class="picker-view-column-example"
                  v-for="(item, index) in areaPickerViewConfig.area"
                  :key="item"
                >{{item}}</div>
              </picker-view-column>
            </picker-view>
          </div>
        </div>

        <zan-field v-bind="Object.assign({}, handleFunctions, base.address)" :value="userInfo.address"/>
      </div>
      <div class="zan-btns">
        <button class="zan-btn submit-btn" formType="submit">提交</button>
      </div>
    </form>
  </section>
</template>
<script>
import ZanField from '@/components/zan/field'
import api from '@/api'
export default {
  components: {
    ZanField
  },
  data () {
    return {
      userInfo: {},
      base: {
        nickname: {
          // focus: true,
          title: '昵称',
          placeholder: '请输入昵称',
          componentId: 'nickname'
        },
        name: {
          // focus: true,
          title: '姓名',
          placeholder: '请输入姓名',
          componentId: 'name'
        },
        phone: {
          // error: true,
          title: '联系电话',
          inputType: 'number',
          placeholder: '请输入手机号',
          componentId: 'phone'
        },
        birthday: {
          // error: true,
          title: '生日',
          inputType: 'number',
          placeholder: '请输入生日',
          componentId: 'birthday'
        },
        address: {
          title: '详细地址',
          type: 'textarea',
          placeholder: '请输入详细地址',
          componentId: 'address'
        },
        school: {
          title: '我的学校',
          type: 'textarea',
          placeholder: '请输入学校名称',
          componentId: 'school'
        }
      },
      handleFunctions: {
        handleZanFieldChange: this.handleZanFieldChange,
        handleZanFieldFocus: this.handleZanFieldFocus,
        handleZanFieldBlur: this.handleZanFieldBlur
      },
      // picker-view 示例配置
      areaPickerViewConfig: {
        show: false,
        value: [0, 0, 0],
        province: ['北京市', '天津市', '河北省', '山西省', '内蒙古自治区', '辽宁省', '吉林省', '黑龙江省', '上海市', '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省', '河南省', '湖北省', '湖南省', '广东省', '广西壮族自治区', '海南省', '重庆市', '四川省', '贵州省', '云南省', '西藏自治区', '陕西省', '甘肃省', '青海省', '宁夏回族自治区', '新疆维吾尔自治区', '台湾省', '香港特别行政区', '澳门特别行政区'],
        city: ['杭州市', '温州市', '宁波市'],
        area: ['萧山区', '西湖区', '拱墅区']
      },
      // picker-view 示例配置
      birthdayPickerViewConfig: {
        show: false,
        value: [0, 0, 0],
        year: [1997, 1998, 1999, 2000],
        month: [].concat(Array.from(new Array(12).keys()).slice(1), [12]),
        day: [].concat(Array.from(new Array(12).keys()).slice(1), [31])
      },
      userType: '1' // 0 管理员 1 学生 2 专家 3 家长
    }
  },
  onLoad (options) {
    this.userType = options.userType || '1'
  },
  methods: {
    getInitArea () {
      this.areaPickerViewConfig.value[0] = this.areaPickerViewConfig.province.indexOf(this.userInfo.provinceName)
      this.areaPickerViewConfig.value[1] = this.areaPickerViewConfig.city.indexOf(this.userInfo.cityName)
      this.areaPickerViewConfig.value[2] = this.areaPickerViewConfig.city.indexOf(this.userInfo.areaName)
    },
    async getUserInfo () {
      await api.common.getUserInfo({
        userType: this.userType || '1'
      }).then(res => {
        this.userInfo = res || {}
      }).catch(err => {
        console.log(err)
      })
      // mock数据：
      this.userInfo = {
        avatar: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1293892983,611103898&fm=27&gp=0.jpg',
        nickName: '驾辕的位置',
        phone: '15868157426',
        name: '梁晓莹',
        provinceName: '浙江省',
        cityName: '杭州市',
        areaName: '萧山区',
        birthday: '1997-10-18',
        address: '杭州微医集团萧山信息港',
        school: '浙江科技学院'
      }
      this.getInitArea()
    },
    onProvinceChange (e) {
      this.provinceIndex = e.target.value
    },

    handleZanFieldChange (e) {
      const { componentId, target, detail } = e
      console.log('[zan:field:change]', componentId, target, detail)
    },

    handleZanFieldFocus (e) {
      const { componentId, target, detail } = e
      console.log('[zan:field:focus]', componentId, target, detail)
    },

    handleZanFieldBlur (e) {
      const { componentId, target, detail } = e

      console.log('[zan:field:blur]', componentId, target, detail)
    },
    formSubmit (event) {
      console.log('[zan:field:submit]', event.target.value)
    },
    /* piker-view 地区示例相关函数 */
    handleAreaFieldClick () {
      this.areaPickerViewConfig.show = true
    },

    handlePopupAreaChange (e) {
      console.log('date', e)
      this.areaPickerViewConfig.value = e.target.value
    },

    hideAreaPopup () {
      this.areaPickerViewConfig.show = false
    },
    /* piker-view 生日示例相关函数 */
    handleBirthdayFieldClick () {
      this.birthdayPickerViewConfig.show = true
    },

    handlePopupBirthdayChange (e) {
      console.log('date', e)
      this.birthdayPickerViewConfig.value = e.target.value
    },

    hideBirthdayPopup () {
      this.birthdayPickerViewConfig.show = false
    }
  },
  mounted () {
    wx._this = this
    wx.setNavigationBarTitle({
      title: '我的资料'
    })
    this.getUserInfo()
  }
}
</script>

<style lang="less">
.page-my-detail {
  height: 100%;
  background: #fff;
  .submit-btn {
    background: #63B8FF;
  }
  .popup-field-example--bottom {
    width: 100%;
    height: 150px;
  }
  .picker-view-example {
    height: 120px;
  }

  .picker-view-column-example {
    line-height: 50px;
    text-align: center;
  }
}
</style>
