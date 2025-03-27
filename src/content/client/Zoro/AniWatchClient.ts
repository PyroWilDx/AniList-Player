import { EntryRowInfo } from "../../player/AniListPlayer";
import User from "../../user/User";
import Fetcher from "../Fetcher";

export default class AniWatchClient {
    private static readonly baseApiUrl = "https://aniwatch-api-de46.onrender.com";

    public static async GetEpisodeId(zoroId: string, z: EntryRowInfo): Promise<string | null> {
        const fetchUrl = `${AniWatchClient.baseApiUrl}/api/v2/hianime/anime/${zoroId}/episodes`;
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
            if (!animeEpisodes.success) {
                return null;
            }

            for (const episode of animeEpisodes.data.episodes) {
                if (episode.number !== z.episodeNumber) {
                    continue;
                }
                return episode.episodeId;
            }
            if (animeEpisodes.data.episodes.length !== 0) {
                return animeEpisodes.data.episodes[0].episodeId;
            }
        } catch (error) {
            Fetcher.LogFetchError(fetchUrl, error);
        }
        return null;
    }

    public static async GetEpisodeSources(episodeId: string): Promise<EpisodeSources | null> {
        const fetchUrl = `${AniWatchClient.baseApiUrl}/api/v2/hianime/episode/sources?animeEpisodeId=${episodeId}&server=hd-2`;
        try {
            const response = await Fetcher.Fetch(fetchUrl);
            if (!response.ok) {
                console.error(
                    "AniList-Player: Could not fetch Zoro episode sources.",
                    `HTTP ${response.status}`,
                );
                return null;
            }

            const episodeSources: EpisodeSources = await response.json();
            if (!episodeSources.success) {
                return null;
            }

            return episodeSources;
        } catch (error) {
            Fetcher.LogFetchError(fetchUrl, error);
        }
        return null;
    }

    public static GetTrack(tracks: Track[]): Track | null {
        const lang = User.GetSubtitleLang();

        let englishTrack: Track | null = null;
        for (const track of tracks) {
            if (track.kind === "captions") {
                if (track.label === lang) {
                    return track;
                }
                if (track.label === "English") {
                    englishTrack = track;
                }
            }
        }
        return englishTrack;
    }
}

type AnimeEpisodes = {
    success: boolean;
    data: AnimeEpisodesData;
};

type AnimeEpisodesData = {
    totalEpisodes: number;
    episodes: Episode[];
};

type Episode = {
    title: string;
    episodeId: string;
    number: number;
    isFiller: boolean;
};

type EpisodeSources = {
    success: boolean;
    data: EpisodeSourcesData;
};

type EpisodeSourcesData = {
    headers: Headers;
    tracks: Track[];
    intro: Intro;
    outro: Outro;
    sources: Source[];
    anilistID: number;
    malID: number;
};

type Headers = {
    Referer: string;
};

type Track = {
    file: string;
    label: string;
    kind: string;
    default?: boolean;
};

type Intro = {
    start: number;
    end: number;
};

type Outro = {
    start: number;
    end: number;
};

type Source = {
    url: string;
    type: string;
};
