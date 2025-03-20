import Fetcher from "../Fetcher";
import ConsumetClient from "./ConsumetClient";

export default class ConsumetZoroClient {
    public static async GetEpisodeSources(
        episodeId: string,
        server?: string,
    ): Promise<EpisodeSources | null> {
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

            const episodeSources: EpisodeSources = await response.json();
            return episodeSources;
        } catch (error) {
            Fetcher.LogFetchError(fetchUrl, error);
        }
        return null;
    }

    public static GetSubtitle(subtitles: Subtitle[]): Subtitle | null {
        const lang = ConsumetClient.GetSubtitleLang();

        let englishSubtitle: Subtitle | null = null;
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
}

type EpisodeSources = {
    intro: Intro;
    outro: Outro;
    sources: Source[];
    subtitles: Subtitle[];
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
};

type Subtitle = {
    url: string;
    lang: string;
};
