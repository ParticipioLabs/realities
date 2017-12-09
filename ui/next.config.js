module.exports = {
  webpack: (config, { dev }) => {
    // config.module.entry = 'bootstrap-loader';
    // console.log(config);
    config.module.rules.push({
      test: /\.css$/,
      loader: 'bootstrap-loader',
    });
    if (dev) {
      config.module.rules.push({
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      });
    }
    return config;
  }
};
