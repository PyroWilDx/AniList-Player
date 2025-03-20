import Video from "../player/Video";
import AniListClient from "./AniListClient";
import Fetcher from "./Fetcher";

export default class AnimEmbedClient {
    private static readonly baseApiUrl = "https://animembed.com";

    public static async PlayEpisode(aniListId: string, episodeNumber: number): Promise<void> {
        const episodeEmbedLink = await AnimEmbedClient.GetEpisodeEmbedLink(
            aniListId,
            episodeNumber,
        );
        if (!episodeEmbedLink) {
            console.error("AniList-Player: Could not fetch AnimEmbed episode embed link.");
            return;
        }

        Video.PlayVideoEmbed(episodeEmbedLink);
    }

    private static async GetEpisodeEmbedLink(
        aniListId: string,
        episodeNumber: number,
    ): Promise<string | null> {
        const malId = await AniListClient.GetMALId(aniListId);
        if (!malId) {
            return null;
        }

        const fetchUrl = `${AnimEmbedClient.baseApiUrl}/api/anime/${malId}/episodes`;
        try {
            const response = await Fetcher.Fetch(fetchUrl);
            if (!response.ok) {
                console.error(
                    "AniList-Player: Could not fetch AnimEmbed anime episodes.",
                    `HTTP ${response.status}`,
                );
                return null;
            }

            const animeEpisodes: AnimeEpisodes = await response.json();
            for (const episodeVostFr of animeEpisodes.data.episodes_vostfr) {
                if (episodeVostFr.episode_number !== episodeNumber) {
                    continue;
                }
                return episodeVostFr.embed.replace("http://", "https://");
            }
        } catch (error) {
            Fetcher.LogFetchError(fetchUrl, error);
        }
        return null;
    }
}

type AnimeEpisodes = {
    data: AnimeEpisodesData;
};

type AnimeEpisodesData = {
    id: number;
    type: string;
    title: string;
    season: number;
    episodes_vostfr: EpisodeVostFr[];
};

type EpisodeVostFr = {
    episode_number: number;
    title: string;
    active_players: number;
    embed: string;
};
