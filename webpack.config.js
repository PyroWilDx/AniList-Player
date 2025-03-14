const path = require("path");

module.exports = {
    entry: "./src/content/Main.ts",
    output: {
        filename: "Main.js",
        path: path.resolve(__dirname, "dist"),
    },
    resolve: {
        extensions: [".ts"],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    mode: "production",
    performance: {
        maxAssetSize: 1000000,
        maxEntrypointSize: 1000000,
    },
};
