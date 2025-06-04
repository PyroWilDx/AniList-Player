import User from "../user/User";

export default class Fetcher {
    // private static readonly corsProxy = "https://corsproxy.io";
    // private static readonly corsProxy = "https://api.codetabs.com/v1/proxy?quest=";

    public static async Fetch(
        fetchUrl: string,
        x?: { init?: RequestInit; useCorsProxy?: boolean },
    ): Promise<Response> {
        if (x && x.useCorsProxy) {
            const corsProxy = await User.GetCorsProxy();
            if (corsProxy.endsWith("=")) {
                fetchUrl = `${corsProxy}${fetchUrl}`;
            } else {
                fetchUrl = `${corsProxy}/${fetchUrl}`;
            }
        }

        console.log("AniList-Player: Fetching " + fetchUrl);

        if (x && x.init) {
            return fetch(fetchUrl, x.init);
        }

        return fetch(fetchUrl);
    }

    public static LogFetchError(fetchUrl: string, error: unknown): void {
        console.error("AniList-Player: Fetch error at " + fetchUrl + ".", error);
    }
}
