import { NestedItemType } from "./menu";

export const resolveOpenKeys = (config: NestedItemType[], _val: string) => {
  if (_val === "") {
    return [] as string[];
  }
  const stack = config.map(item => {
    return {
      p: [] as string[],
      key: item.name,
      item,
      children: item.children || []
    };
  });

  while (stack.length > 0) {
    const _item = stack.pop();

    if (!_item) {
      continue;
    }
    if (_item.key === _val) {
      return [..._item.p, _item.key];
    }

    const _next = _item.children.map(i => {
      return {
        p: [..._item.p, _item.key],
        key: i.name,
        item: i,
        children: i.children || []
      };
    });
    stack.push(..._next);
  }
  return [];
};
