### Popup 弹出层

#### 使用指南

```html
<template>
    <x-popup v-model="showPopup" direction="center">
      <div>
        slot内容内容
      </div>
    </x-popup>
</template>

<script>
import XPopup from '@/components/x-popup/index.vue'
export default {
    components: {
        XPopup
    },
    data () {
        return {
            showPopup: false
        }
    }
}
</script>
```

#### API
| 参数 | 说明 | 类型 | 默认值 |
|-----|------|-----|--------|
|v-model|是否显示弹出层|`Boolean`|-|
|position|弹出层出现的位置，可选值为`top` `bottom` `center` `left` `right`|`String`|`center`|
|clickMaskClose|点击蒙层是否关闭 Popup|`Boolean`|`true`|
|hasMask|是否有蒙层|`Boolean`|`true`|
|className|自定义外部样式类|`String`|''|

#### Event
| 事件名 | 说明 | 参数 |
|-----|------|-----|
|@maskClick|蒙层点击事件|-|

#### 其他说明
- 自定义动画时间，使用自定义外部样式类的方式覆盖`x-popup--mask`和`x-popup--mask`的`transition-duration`属性值
- 自定义蒙层样式，使用自定义外部样式类的方式覆盖`x-popup--mask`样式类
