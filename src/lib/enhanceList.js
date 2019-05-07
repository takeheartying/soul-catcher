export default {
  props: {
    list: Array
  },
  computed: {
    computedClassStrs () {
      return this.resolveList.map((item, index) => `${item.className || ''} ${(this.value !== undefined && this.value === index) ? 'active' : ''}`)
    },
    resolveList () {
      if (!this.list.length) return this.list
      return this.list.map(item => {
        if (typeof item === 'object' && item !== null) {
          return item
        }
        return {text: item}
      })
    }
  }
}
