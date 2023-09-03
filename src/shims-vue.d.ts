/*
它是一个 global.d.ts 类型的声明文件,用于补充 Vue 中没有类型声明的模块。
*/
/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
