import Fetcher from "./Fetcher";
import Video from "./Video";

export default class ConsumetClient {
    private static readonly baseApiUrl = "http://localhost:3000";

    public static async PlayEpisode(aniListId: string, episodeNumber: number): Promise<void> {
        const episodeId = await ConsumetClient.GetEpisodeId_AniList(aniListId, episodeNumber);
        if (!episodeId) {
            return;
        }

        const episodeSources = await ConsumetClient.GetEpisodeSources_Zoro(episodeId);
        if (!episodeSources) {
            return;
        }

        const videoUrl = episodeSources.sources[0].url;
        // TODO: Add option for user to chose subtitles language.
        const subtitle = ConsumetClient.GetSubtitle_Zoro(episodeSources.subtitles);
        Video.PlayVideoHls(videoUrl, subtitle?.lang, subtitle?.url);
    }

    private static async GetEpisodeId_AniList(
        aniListId: string,
        episodeNumber: number,
        episodeProvider: string = "Zoro",
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

            const animeInfo: AnimeInfo_AniList = await response.json();
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

    private static async GetEpisodeSources_Zoro(
        episodeId: string,
        server?: string,
    ): Promise<EpisodeSources_Zoro | null> {
        let fetchUrl = `${ConsumetClient.baseApiUrl}/anime/zoro/watch?episodeId=${episodeId}`;
        if (server) {
            fetchUrl += `&server=${server}`;
        }
        try {
            const response = await Fetcher.Fetch(fetchUrl);
            if (!response.ok) {
                console.error(
                    "AniList-Player: Could not fetch episode source.",
                    `HTTP ${response.status}`,
                );
                return null;
            }

            const episodeSources: EpisodeSources_Zoro = await response.json();
            return episodeSources;
        } catch (error) {
            Fetcher.LogFetchError(fetchUrl, error);
        }
        return null;
    }

    private static GetSubtitle_Zoro(subtitles: Subtitle_Zoro[]): Subtitle_Zoro | null {
        const lang = ConsumetClient.GetSubtitleLang();

        let englishSubtitle: Subtitle_Zoro | null = null;
        for (const subtitle of subtitles) {
            if (subtitle.lang === lang) {
                return subtitle;
            }
            if (subtitle.lang === "English") {
                englishSubtitle = subtitle;
            }
        }
        return englishSubtitle;
    }

    private static GetSubtitleLang(): string {
        return "English";
    }
}

type AnimeInfo_AniList = {
    episodes: Episode_AniList[];
};

type Episode_AniList = {
    id: string;
    number: number;
};

type EpisodeSources_Zoro = {
    intro: Intro_Zoro;
    outro: Outro_Zoro;
    sources: Source_Zoro[];
    subtitles: Subtitle_Zoro[];
};

type Intro_Zoro = {
    start: number;
    end: number;
};

type Outro_Zoro = {
    start: number;
    end: number;
};

type Source_Zoro = {
    url: string;
};

type Subtitle_Zoro = {
    url: string;
    lang: string;
};
