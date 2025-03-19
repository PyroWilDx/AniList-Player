export default class ConsumetClient {
    public static readonly baseApiUrl = "http://localhost:3000";

    public static async GetEpisodeId_AniList(
        aniListId: string,
        episodeNumber: number,
        episodeProvider: string = "Zoro",
    ): Promise<string | null> {
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
                return episode.id;
            }
            console.error("AniList-Player: Could not find episode.", animeInfo);
        } catch (error) {
            ConsumetClient.LogFetchError(fetchUrl, error);
        }
        return null;
    }

    public static async GetEpisodeSources_Zoro(
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

    private static Fetch(fetchUrl: string): Promise<Response> {
        console.log("AniList-Player: Fetching " + fetchUrl);
        return fetch(fetchUrl);
    }

    private static LogFetchError(fetchUrl: string, error: unknown): void {
        console.error("AniList-Player: Fetch error at " + fetchUrl + ".", error);
    }
}

export type AnimeInfo = {
    episodes: Episode[];
};

export type Episode = {
    id: string;
    number: number;
};

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
