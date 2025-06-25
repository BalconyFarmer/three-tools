const UnusedFilesWebpackPlugin = require('unused-files-webpack-plugin').default;

module.exports = {
    runtimeCompiler: true,
    // 其他配置
    // plugins: [
    //     new UnusedFilesWebpackPlugin({
    //         patterns: ['src/assets/components/imgs/result/**/*.*'],
    //         globOptions: {
    //             ignore: ['node_modules/**/*'],
    //         },
    //     }),
    // ],
};
