import { EntryRowInfo } from "../../player/AniListPlayer";
import Fetcher from "../Fetcher";
import ConsumetClient from "./ConsumetClient";

export default class ConsumetAniListClient {
    public static async GetEpisodeId(
        z: EntryRowInfo,
        episodeProvider: string,
    ): Promise<string | null> {
        const fetchUrl = `${ConsumetClient.baseApiUrl}/meta/anilist/info/${z.aniListId}?provider=${episodeProvider}`;
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
                if (episode.number !== z.episodeNumber) {
                    continue;
                }
                return episode.id;
            }
            if (animeInfo.episodes.length !== 0) {
                z.episodeNumber = 1;
                return animeInfo.episodes[0].id;
            }
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
