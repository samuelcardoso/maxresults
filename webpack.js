const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const baseManifest = require("./browser/manifest.json");
const WebpackExtensionManifestPlugin = require("webpack-extension-manifest-plugin");
const config = {
  mode: "development",
  devtool: "cheap-module-source-map",
  entry: {
    content: path.join(__dirname, "./browser/content.tsx"),
    settings: path.join(__dirname, "./browser/settings.tsx"),
    background: path.join(__dirname, "./browser/_background.tsx"),
    foreground: path.join(__dirname, "./browser/_foreground.tsx")
  },
  output: {
    path: path.resolve(__dirname, "./build"),
    filename: "[name].js"
  },
  resolve: {
    extensions: ['*', '.ts', '.tsx', '.js', '.json']
  },
  plugins: [
    // new HtmlWebpackPlugin({
    //   title: "MaxResults", // change this to your app title
    //   meta: {
    //     charset: "utf-8",
    //     viewport: "width=device-width, initial-scale=1, shrink-to-fit=no",
    //     "theme-color": "#000000"
    //   },
    //   manifest: "manifest.json",
    //   filename: "content.html",
    //   template: "./browser/content.html",
    //   inject: true,
    //   hash: true
    // }),
    // new HtmlWebpackPlugin({
    //     title: "MaxResults Settings", // change this to your app title
    //     meta: {
    //       charset: "utf-8",
    //       viewport: "width=device-width, initial-scale=1, shrink-to-fit=no",
    //       "theme-color": "#000000"
    //     },
    //     manifest: "manifest.json",
    //     filename: "content.html",
    //     template: "./browser/content.html",
    //     hash: true
    //   }),
    new CopyPlugin([
      {
        from: "browser/content.html"
      },
      {
        from: "browser/settings.html"
      },
      {
        from: "browser/manifest.json"
      },
      {
        from: "app/images",
        to: "images"
      }
    ]),
    new WebpackExtensionManifestPlugin({
      config: {
        base: baseManifest
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: ["ts-loader"]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader"]
      }
    ]
  }
};
module.exports = config;