export default class ConsumetClient {
    public static readonly baseApiUrl = "http://localhost:3000";

    public static Fetch(fetchUrl: string): Promise<Response> {
        console.log("AniList-Player: Fetching " + fetchUrl);
        return fetch(fetchUrl);
    }

    public static LogFetchError(fetchUrl: string, error: unknown): void {
        console.error("AniList-Player: Fetch error at " + fetchUrl + ".", error);
    }
}
