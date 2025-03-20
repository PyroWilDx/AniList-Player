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

            const animeInfo: AnimeInfo = await response.json();
            const zoroSite = animeInfo.Sites["Zoro"];
            if (!zoroSite) {
                return null;
            }

            const [_, zoroAnimeInfo] = Object.entries(zoroSite)[0];
            if (!zoroAnimeInfo) {
                return null;
            }

            const lastSlashIndex = zoroAnimeInfo.url.lastIndexOf("/");
            return zoroAnimeInfo.url.substring(lastSlashIndex + 1);
        } catch (error) {
            Fetcher.LogFetchError(fetchUrl, error);
        }
        return null;
    }
}

type AnimeInfo = {
    Sites: Record<SiteName, Site | undefined>;
};

type SiteName = string;

type Site = Record<SiteAnimeId, SiteAnimeInfo | undefined>;

type SiteAnimeId = string;

type SiteAnimeInfo = {
    url: string;
};
