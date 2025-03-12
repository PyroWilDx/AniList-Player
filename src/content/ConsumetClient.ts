export default class ConsumetClient {
    public static readonly baseApiUrl = "http://localhost:3000";

    public static LogFetchError(fetchUrl: string, error: unknown): void {
        console.error("AniList-Player: Fetch error at " + fetchUrl + ".", error);
    }
}
