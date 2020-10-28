## 扩展的 Storage

> 增强/替换 localStorage 和 sessionStorage

基于前端数据的缓存、存储机制的特点和存在问题，localStorage, sessionStorage 相对兼容大部分情况，因此选择 localStorage 和 sessionStorage 构建解决以下问题的 Storage 机制：

* 对非 string 类型的数据存储支持不友好，大部分情况下，要存储 array, obejct 等类型的数据，需要使用 JSON.stringify 转换数据为 string 类型后再储存；获取时也需要调用 JSON.parse 等方法还原对象，产生需对无用，重复的代码

* localStorage 本身为永久存储机制，但大部分数据有一定的使用期限，在有效期中的数据才生效，但又非 sessionStorage 的 “会话” 级别的有效期，浏览器关闭后也需要保留该有效期内的数据供下次浏览器打开时使用

Storage 的扩展点

* 支持 string, number, boolean, object, array 类型的数据结构的存储

* 支持有效期机制（ms）

* 调用方式与原生 localStorage 和 sessionStorage 基本一致，并提供泛型支持

使用

```
import { useStorage } from "@core/app";

const storage = useStorage("local"); // or "session";

const value = {
  a: 1
};
// "key" 指向的数据在 2小时 内有效
storage.setItem("key", value, 7200 * 1000);

// getItem 函数支持泛型
// 若 "key" 已过期，返回 null 
const _value = storage.getItem<{
  a: number
}>("key");
```

[返回](../README.md)
