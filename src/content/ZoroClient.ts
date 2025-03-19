import Fetcher from "./Fetcher";
import MalSyncClient from "./MalSyncClient";

export default class ZoroClient {
    private static readonly baseApiUrl = "https://aniwatch-api-de46.onrender.com";

    public static async PlayEpisode(aniListId: string, episodeNumber: number): Promise<void> {
        const zoroId = await MalSyncClient.GetZoroId(aniListId);
        if (!zoroId) {
            console.error("AniList-Player: Failed to fetch Zoro anime id.");
            return;
        }

        const episodeId = await ZoroClient.GetEpisodeId(zoroId, episodeNumber);
        if (!episodeId) {
            console.error("AniList-Player: Failed to fetch Zoro episode id.");
            return;
        }
    }

    private static async GetEpisodeId(
        zoroId: string,
        episodeNumber: number,
    ): Promise<string | null> {
        const fetchUrl = `${ZoroClient.baseApiUrl}/api/v2/hianime/anime/${zoroId}/episodes`;
        try {
            const response = await Fetcher.Fetch(fetchUrl);
            if (!response.ok) {
                console.error(
                    "AniList-Player: Could not fetch Zoro anime episodes.",
                    `HTTP ${response.status}`,
                );
                return null;
            }

            const animeEpisodes: AnimeEpisodes = await response.json();
            if (!animeEpisodes.sucess) {
                return null;
            }

            for (const episode of animeEpisodes.data.episodes) {
                if (episode.number !== episodeNumber) {
                    continue;
                }
                return episode.episodeId;
            }
        } catch (error) {
            Fetcher.LogFetchError(fetchUrl, error);
        }
        return null;
    }
}

type AnimeEpisodes = {
    sucess: boolean;
    data: AnimeEpisodeData;
};

type AnimeEpisodeData = {
    totalEpisodes: number;
    episodes: Episode[];
};

type Episode = {
    title: string;
    episodeId: string;
    number: number;
    isFiller: boolean;
};
