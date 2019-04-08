# soul-catcher

> 心灵捕手-n次方小程序

## Build Setup

``` bash
# 初始化项目
vue init mpvue/mpvue-quickstart myproject
cd myproject

# 安装依赖
yarn

# 开发时构建
npm dev

# 打包构建
npm build

# 指定平台的开发时构建(微信、百度、头条、支付宝)
npm dev:wx
npm dev:swan
npm dev:tt
npm dev:my

# 指定平台的打包构建
npm build:wx
npm build:swan
npm build:tt
npm build:my

# 生成 bundle 分析报告
npm run build --report
```

## 项目结构
```
├── build
├── config
    ├── index.js // 配置文件
├── dist
	├── pages // 项目页面文件
├── src
    ├── api // 接口
    ├── components // 公共组件
    ├── lib // 工具集
    ├── store
    ├── pages
	├── main.js
	├── App.vue
	├── app.json
  ├── _app.js // 原生小程序全局js文件
  ├── _app.wxss // 原生小程序全局样式
```
## 技术栈

* [mpvue-zanui](https://github.com/samwang1027/mpvue-zanui)
* [mpvue](https://github.com/Meituan-Dianping/mpvue)
* [vuex](https://vuex.vuejs.org/zh-cn/)

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
