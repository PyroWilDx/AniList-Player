export default class Fetcher {
    public static Fetch(fetchUrl: string, init?: RequestInit): Promise<Response> {
        console.log("AniList-Player: Fetching " + fetchUrl);
        return fetch(fetchUrl, init);
    }

    public static LogFetchError(fetchUrl: string, error: unknown): void {
        console.error("AniList-Player: Fetch error at " + fetchUrl + ".", error);
    }
}
