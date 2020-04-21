const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  output: {
    path: `${__dirname}/public`,
  },
  plugins: [new MiniCssExtractPlugin()],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
