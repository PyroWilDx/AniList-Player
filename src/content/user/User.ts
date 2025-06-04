export default class User {
    public static GetEnabled(): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            chrome.storage.sync.get(["enabled"], (result) => {
                if (result.enabled === undefined) {
                    resolve(true);
                }
                resolve(result.enabled);
            });
        });
    }

    public static GetProvider(): Promise<string> {
        return new Promise<string>((resolve) => {
            chrome.storage.sync.get(["provider"], (result) => {
                if (result.provider === undefined) {
                    resolve("AnimEmbed");
                }
                resolve(result.provider);
            });
        });
    }

    public static GetCorsProxy(): Promise<string> {
        return new Promise<string>((resolve) => {
            chrome.storage.sync.get(["corsProxy"], (result) => {
                if (result.provider === undefined) {
                    resolve("https://api.codetabs.com/v1/proxy?quest=");
                }
                resolve(result.provider);
            });
        });
    }

    public static GetZoroMode(): Promise<string> {
        return new Promise<string>((resolve) => {
            chrome.storage.sync.get(["zoroMode"], (result) => {
                if (result.zoroMode === undefined) {
                    resolve("Embed");
                }
                resolve(result.zoroMode);
            });
        });
    }

    public static GetZoroApi(): Promise<string> {
        return new Promise<string>((resolve) => {
            chrome.storage.sync.get(["zoroApi"], (result) => {
                if (result.zoroApi === undefined) {
                    resolve("");
                }
                resolve(result.zoroApi);
            });
        });
    }

    public static GetConsumetZoroApi(): Promise<string> {
        return new Promise<string>((resolve) => {
            chrome.storage.sync.get(["consumetZoroApi"], (result) => {
                if (result.consumetZoroApi === undefined) {
                    resolve("");
                }
                resolve(result.consumetZoroApi);
            });
        });
    }

    public static GetSubtitleLang(): string {
        // TODO: Add option for user to chose subtitles language.
        return "English";
    }
}
