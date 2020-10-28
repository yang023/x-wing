## 异步请求

通过统一接口（interface）整合应用的 http 请求服务，默认使用 fetch 进行实现。支持接入多个 api 服务，并支持对每个接口进行 url 版本配置，简单配置即可完成 api-url 的版本切换

> 兼容不支持 FetchApi 的浏览器，请自行 [polyfill](https://github.com/github/fetch) 或使用其他异步请求库，并通过继承 AbstractHttpClient（doSending 方法）实现对接

> 兼容不支持 PromissionApi 的浏览器，手动实现吧，当背面试题（[polyfill](https://www.npmjs.com/package/promise-polyfill) 它不香吗？-_-）

### 使用
设置 url 前缀
```
import { set } from "@core/plugins/http-client"

set("host", {
    default: "http://www.example.com/api",
    v1: "http://www.example.com/api/v1"
});

// or 

set("host","http://www.example.com/api");
set("host",{
  v1: "http://www.example.com/api/v1"
});

// ==>
{
  default: "http://www.example.com/api",
  v1: "http://www.example.com/api/v1"
}
```

设置 axios 为异步请求库（若使用 jQuery.ajax，同理，继承 AxiosHttpClient）
```
// 创建 AxiosClient:

// src/AxiosHttpClient.ts
export default class AxiosHttpClient<I, P> extends AbstractClient<I, P> {
  async doSending(
    url: string,
    method: "get" | "post" | "put" | "delete",
    data?: I,
    headers = new Headers()
  ): Promise<P> {
    const _headers: { [key: string]: string } = {};
    headers.forEach((value, key) => {
      _headers[key] = value;
    });

    const config: AxiosRequestConfig = {
      url,
      method
    };

    if (method === "get") {
      config.params = Object.assign({}, data);
    } else {
      config.data = Object.assign({}, data);
    }

    const res: AxiosResponse<P> = await _axios(config).then();

    return res.data;
  }
}

// use
import AxiosHttpClient from "@/AxiosHttpClient";
import { setClient } from "@core/plugins/http-client"
setClient(AxiosHttpClient);

```

通过 useHttpClient 函数进行数据的异步请求
```
import { useHttpClient } from "@core/plugins/http-client";

useHttpClient((baseUrl, service) => {
  const key = "host"; // required
  const version = "v1"; // default is "default"
  const url = baseUrl(key, "/example/{test}", version);
  const method = "get"; // "get" or "post" or "delete" or "put"
  const data = {
    test: "a"
  };

  // real url is "http://www.example.com/api/example/a"
  service(url, method, data); 
}, {
  onSuccess: (res) => {
    console.log(res)
  },
  onError: (err) => {
    console.log(err)
  }
})
```

[返回](../README.md)
