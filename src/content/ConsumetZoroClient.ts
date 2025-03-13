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
            const response = await ConsumetClient.Fetch(fetchUrl);
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

export type EpisodeSources = {
    intro: Intro;
    outro: Outro;
    sources: Source[];
    subtitles: Subtitle[];
};

export type Intro = {
    start: number;
    end: number;
};

export type Outro = {
    start: number;
    end: number;
};

export type Source = {
    url: string;
};

export type Subtitle = {
    url: string;
    lang: string;
};
