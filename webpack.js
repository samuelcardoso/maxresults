const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const baseManifest = require("./manifest.json");
const WebpackExtensionManifestPlugin = require("webpack-extension-manifest-plugin");
const config = {
  mode: "development",
  devtool: "cheap-module-source-map",
  entry: {
    content: path.join(__dirname, "./browser/content.js"),
    settings: path.join(__dirname, "./browser/settings.js"),
    background: path.join(__dirname, "./browser/background.js")
  },
  output: {
    path: path.resolve(__dirname, "./build"),
    filename: "[name].js"
  },
  resolve: {
    extensions: ["*", ".js"]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "MaxResults", // change this to your app title
      meta: {
        charset: "utf-8",
        viewport: "width=device-width, initial-scale=1, shrink-to-fit=no",
        "theme-color": "#000000"
      },
      manifest: "manifest.json",
      filename: "content.html",
      template: "./browser/content.html",
      hash: true
    }),
    new HtmlWebpackPlugin({
        title: "MaxResults Settings", // change this to your app title
        meta: {
          charset: "utf-8",
          viewport: "width=device-width, initial-scale=1, shrink-to-fit=no",
          "theme-color": "#000000"
        },
        manifest: "manifest.json",
        filename: "settings.html",
        template: "./browser/settings.html",
        hash: true
      }),
    new CopyPlugin([
      {
        from: "images",
        to: "images"
      },
      {
        from: "manifest.json",
        to: "manifest.json"
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
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
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