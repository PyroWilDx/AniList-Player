export default class ConsumetClient {
    public static readonly baseApiUrl = "http://localhost:3000";

    public static async GetEpisode(
        aniListId: string,
        episodeNumber: number,
        episodeProvider: string = "Zoro",
    ): Promise<Episode | null> {
        const fetchUrl = `${ConsumetClient.baseApiUrl}/meta/anilist/info/${aniListId}?provider=${episodeProvider}`;
        try {
            const response = await fetch(fetchUrl);
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
        } catch (error) {
            console.error("AniList-Player: Fetch error at " + fetchUrl + ".", error);
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
