<template>
  <div class="filterbar" :style="{'top': top + 'px'}">
    <div class="container">
      <div class="row" v-if="barMenus">
        <div :class="index === selectedIndexMenu ? 'selected col' : 'col'"
          @click="handleShowDialog(menuItem, index, true)"
          v-for="(menuItem, index) in barMenus" :key="index">
          {{menuItem.name}}
          <span :class="index === selectedIndexMenu ? menuItem.selectIcon : menuItem.defaultIcon"></span>
        </div>
      </div>
      <filter-bar-pop ref="filterPop" :filterTop="top" :show-dialog="isShow" :hasTabHeader="hasTabHeader" :menu="selectedMenu" @changeTab="handleChangeTab"
        @changeMainItem="handleChangeMainItem" @changeSelect="changeSelect" @closeDialog="handleCloseDialog">
      </filter-bar-pop>
    </div>
  </div>
</template>
<script>
  import FilterBarPop from './FilterPop.vue'

  export default {
    props: {
      barMenus: {
        type: Array,
        required: true,
        validator: function (value) {
          // TODO:验证数据有效性
          return true
        }
      },
      top: String
    },
    data () {
      return {
        isShow: false,
        hasTabHeader: false,
        selectedMenu: {},
        selectedIndexMenu: undefined
      }
    },
    methods: {
      handleShowDialog (menu, index, isShow, sideBarIndex) {
        this.isShow = isShow
        this.selectedMenu = menu
        this.selectedIndexMenu = index
        if (menu.showTabHeader) {
          this.hasTabHeader = true
        } else {
          this.hasTabHeader = false
        }
        if (!isShow) {
          this.$nextTick(() => {
            this.$refs.filterPop.changeInitData(this.barMenus[index].tabs[0].detailList[sideBarIndex], sideBarIndex)
          })
        }
        let _menu = JSON.parse(JSON.stringify(menu))
        _menu.tabs = {}
        this.$emit('showDialog', _menu)
      },
      handleChangeTab (tab) {
        this.$emit('changeTab', tab.index)
      },
      handleChangeMainItem (mainItem) {
        let _mainItem = JSON.parse(JSON.stringify(mainItem))
        this.$emit('changeMainItem', _mainItem)
      },
      handleCloseDialog () {
        this.isShow = false
        this.selectedIndexMenu = -1
        this.$emit('closeDialog')
      },
      changeSelect () {
        var selectData = []
        this.barMenus.forEach(function (menuItem, index, arr) {
          let _selectBarData = {}
          // console.log("menuItem.name: " + menuItem.name)

          _selectBarData.name = menuItem.name
          _selectBarData.value = menuItem.value
          _selectBarData.tab = {}
          let tab = menuItem.tabs[menuItem.selectIndex]
          // console.log("tab.name: " + tab.name)
          _selectBarData.tab.name = tab.name
          _selectBarData.tab.value = tab.value
          let mainItem = tab.detailList[tab.selectIndex]
          _selectBarData.tab.mainItem = {}
          // console.log("mainItem.name: " + mainItem.name)
          _selectBarData.tab.mainItem.name = mainItem.name
          _selectBarData.tab.mainItem.value = mainItem.vaule
          let subItem = false
          if (mainItem.list) {
            subItem = mainItem.list[mainItem.selectIndex]
            _selectBarData.tab.mainItem.subItem = {}
            // console.log("subItem.name: " + subItem.name)
            _selectBarData.tab.mainItem.subItem.name = subItem.name
            _selectBarData.tab.mainItem.subItem.value = subItem.value
          } else {
            _selectBarData.tab.mainItem.subItem = subItem
          }
          selectData.push(_selectBarData)
        })
        this.$emit('changeSelect', selectData)
      }
    },
    components: {
      'filter-bar-pop': FilterBarPop
    }
  }
</script>
<style lang="scss">
  .filterbar {
    z-index:1;
    width: 100%;
    background: #fff;
    position:relative;
    top: 0;
    left: 0;
    right: 0;
    .container {
      width: 100%;
      outline: 1px solid #DBDCDE;
      position: relative;
      .row {
        display: flex;
        display: -ms-flexbox;
        display: -moz-box;
        display: -webkit-box;
        display: -webkit-flex;
        flex-direction: row;
        -webkit-flex-direction: row;
        justify-content: space-around;
        -webkit-box-pack: space-around;
        -moz-box-pack: space-around;
        -ms-flex-pack: space-around;
        width: 100%;
        height: 40px;
        margin: 0 auto;
        line-height: 40px;
        .selected {
          color: #63B8FF;
        }
        .col {
          width:100%;
          text-align:center;
          border-right: 1px solid #ccc;
          background-color: #63B8FF;
          color: #fff;
          span {
            margin-left: 5px;
            vertical-align: middle;
          }
        }
        .col:last-child {
          border-right: none;
        }
      }
    }
  }
</style>
