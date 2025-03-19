import AniListClient from "./AniListClient";
import Fetcher from "./Fetcher";

export default class MALSyncClient {
    private static readonly baseApiUrl = "https://api.malsync.moe";

    public static async GetZoroId(aniListId: string): Promise<string | null> {
        const malId = await AniListClient.GetMALId(aniListId);
        if (!malId) {
            return null;
        }

        const fetchUrl = `${MALSyncClient.baseApiUrl}/mal/anime/${malId}`;
        try {
            const response = await Fetcher.Fetch(fetchUrl);
            if (!response.ok) {
                console.error(
                    "AniList-Player: Could not fetch Zoro id.",
                    `HTTP ${response.status}`,
                );
                return null;
            }

            const animeInfo = await response.json();
        } catch (error) {
            Fetcher.LogFetchError(fetchUrl, error);
        }
        return null;
    }
}
