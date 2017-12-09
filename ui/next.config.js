module.exports = {
  webpack: (config, { dev }) => {
    config.module.rules.push({
      test: /\.css$/,
      loader: 'css-loader',
    });
    if (dev) {
      config.module.rules.push({
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      });
    }
    return config;
  },
};
