type StorageData<T = any> = {
  _key: string;
  _value: T;
  _timeout: number;
  _setIn: number;
};

type StorageType = "session" | "local";

type StorageOperator = "set" | "get" | "remove";

/**
 * 数据集合存储器，并提供过期机制
 */
interface StorageCore {
  type: StorageType;
  /**
   * 设置
   * @param key 名称
   * @param value 值
   * @param timeout 存活时间，0为不超时清除，默认值为0
   */
  setItem<T>(key: string, value: T, timeout?: number): void;
  /**
   * 获取
   * @param key 名称
   * @param callback 获取值后回调
   *
   * @return 取得的值
   */
  getItem<T>(
    key: string,
    callback?: (value: T | undefined) => void
  ): T | undefined;
  /**
   * 监听设置/获取/删除事件
   * @param callback 回调函数
   */
  subscribe(
    callback: <T>(
      type: "set" | "get" | "remove",
      payload: { name: string; value: T | undefined }
    ) => void
  ): void;
}
