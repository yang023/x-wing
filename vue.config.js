// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpack = require("webpack");

const resolvePath = (...dir) => path.resolve(__dirname, ...dir);

const isDev = () => process.env.NODE_ENV === "development";

module.exports = {
  chainWebpack: config => {
    config.resolve.alias.set("@common", resolvePath("common"));
    config.resolve.alias.set("@core", resolvePath("core"));
    config.resolve.alias.set("@antd-ui", resolvePath("antd-ui"));

    config
      .plugin("moment")
      .use(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));
  },
  css: {
    requireModuleExtension: true,
    loaderOptions: {
      css: {
        localsConvention: "camelCase",
        modules: {
          localIdentName: isDev() ? "[path][name]__[local]" : "[hash:base64]"
        }
      },
      less: {
        javascriptEnabled: true,
        modifyVars: {
          // less 全局变量
        }
      }
    }
  }
};
