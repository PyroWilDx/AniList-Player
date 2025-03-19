const path = require("path");

module.exports = {
    entry: "./src/content/Main.ts",
    output: {
        filename: "Main.js",
        path: path.resolve(__dirname, "dist"),
    },
    resolve: {
        extensions: [".ts", ".js"],
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
        maxAssetSize: 100000000,
        maxEntrypointSize: 100000000,
    },
};
