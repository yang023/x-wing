import { NestedItemType } from "../antd-ui/layout/menu";

const config: NestedItemType[] = [
  {
    name: "test",
    children: [
      {
        name: "test1",
        children: [
          {
            name: "index"
          }
        ]
      },
      {
        name: "form"
      }
    ]
  },
  {
    name: "test2",
    children: [
      {
        name: "test12",
        children: [
          {
            name: "form"
          }
        ]
      },
      {
        name: "index"
      }
    ]
  }
];

export default config;
