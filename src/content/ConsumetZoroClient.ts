import ConsumetClient from "./ConsumetClient";

export default class ConsumetZoroClient extends ConsumetClient {
    public static async GetEpisodeSources(
        episodeId: string,
        server?: string,
    ): Promise<EpisodeSources | null> {
        let fetchUrl = `${ConsumetClient.baseApiUrl}/anime/zoro/watch?episodeId=${episodeId}`;
        if (server) {
            fetchUrl += `&server=${server}`;
        }
        try {
            const response = await fetch(fetchUrl);
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
            ConsumetClient.LogFetchError(fetchUrl, error);
        }
        return null;
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
