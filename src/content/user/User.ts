export default class User {
    public static GetProvider(): Promise<string> {
        return new Promise<string>((resolve) => {
            chrome.storage.sync.get(["provider"], (result) => {
                if (!result.provider) {
                    resolve("AnimEmbed");
                }
                resolve(result.provider);
            });
        });
    }

    public static GetSubtitleLang(): string {
        // TODO: Add option for user to chose subtitles language.
        return "English";
    }
}
