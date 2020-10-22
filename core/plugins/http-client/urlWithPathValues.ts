/**
 * 根据请求参数，替换 url 模板中的占位变量，返回实际的请求 url
 * @param url url 模板，如：<host>:<port>/url/{param}
 * @param params 请求参数，url 模板使用的替换参数会自动被移除
 */
const urlWithPathValues = (
  url: string,
  params: { [key: string]: any }
): string => {
  return url.replace(/\{.*\}/g, r => {
    const key = r.replace(/\{|\}/g, "");
    const value = params[key];
    if ([undefined, null, "", []].includes(value)) {
      console.warn(`No parameter named "${key}"`);
      return r;
    }
    delete params[key];
    return value;
  });
};

export default urlWithPathValues;
