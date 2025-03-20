import Fetcher from "../Fetcher";
import ConsumetClient from "./ConsumetClient";

export default class ConsumetAniListClient {
    public static async GetEpisodeId(
        aniListId: string,
        episodeNumber: number,
        episodeProvider: string,
    ): Promise<string | null> {
        const fetchUrl = `${ConsumetClient.baseApiUrl}/meta/anilist/info/${aniListId}?provider=${episodeProvider}`;
        try {
            const response = await Fetcher.Fetch(fetchUrl);
            if (!response.ok) {
                console.error(
                    "AniList-Player: Could not fetch anime information.",
                    `HTTP ${response.status}`,
                );
                return null;
            }

            const animeInfo: AnimeInfo = await response.json();
            for (const episode of animeInfo.episodes) {
                if (episode.number !== episodeNumber) {
                    continue;
                }
                return episode.id;
            }
            console.error("AniList-Player: Could not find episode.", animeInfo);
        } catch (error) {
            Fetcher.LogFetchError(fetchUrl, error);
        }
        return null;
    }
}

type AnimeInfo = {
    episodes: Episode[];
};

type Episode = {
    id: string;
    number: number;
};
