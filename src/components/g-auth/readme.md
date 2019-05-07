### 公共授权方法

#### 使用指南

```html
<template>
    <g-auth ref="auth"></g-auth>
</template>

<script>
export default {
  methods: {
    doSomeThing() {
      this.$refs.auth.run(true /* 是否需要绑定手机号, false的话仅仅是登陆 */).then(() => { // 这里会做顺序执行 1登陆流程 2检查手机号流程
        // 这里可以进行业务逻辑处理了
      }) 
    }
  }
}
</script>
```
