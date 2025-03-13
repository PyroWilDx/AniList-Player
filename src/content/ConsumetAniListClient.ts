import ConsumetClient from "./ConsumetClient";

export default class ConsumetAniListClient extends ConsumetClient {
    public static async GetEpisode(
        aniListId: string,
        episodeNumber: number,
        episodeProvider: string = "Zoro",
    ): Promise<Episode | null> {
        const fetchUrl = `${ConsumetClient.baseApiUrl}/meta/anilist/info/${aniListId}?provider=${episodeProvider}`;
        try {
            const response = await ConsumetClient.Fetch(fetchUrl);
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
                return episode;
            }
            console.error("AniList-Player: Could not find episode.", animeInfo);
        } catch (error) {
            ConsumetClient.LogFetchError(fetchUrl, error);
        }
        return null;
    }
}

export type AnimeInfo = {
    episodes: Episode[];
};

export type Episode = {
    id: string;
    number: number;
};
