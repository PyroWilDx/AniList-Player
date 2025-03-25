export default class Fetcher {
    private static readonly corsProxy = "https://corsproxy.io";

    public static Fetch(
        fetchUrl: string,
        x?: { init?: RequestInit; useCorsProxy?: boolean },
    ): Promise<Response> {
        if (x && x.useCorsProxy) {
            fetchUrl = `${Fetcher.corsProxy}/${fetchUrl}`;
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
