import Fetcher from "./Fetcher";

export default class AniListClient {
    private static readonly baseApiUrl = "https://graphql.anilist.co";

    public static async GetMalId(aniListId: string): Promise<string | null> {
        const fetchUrl = AniListClient.baseApiUrl;
        try {
            const response = await Fetcher.Fetch(fetchUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: `
                query ($id: Int) {
                  Media(id: $id) {
                    idMal
                  }
                }
              `,
                    variables: { id: parseInt(aniListId) },
                }),
            });

            if (!response.ok) {
                console.error(
                    "AniList-Player: Could not fetch MyAnimeList id.",
                    `HTTP ${response.status}`,
                );
                return null;
            }

            const animeInfo: MalId_Response = await response.json();
            return animeInfo.data.Media.idMal.toString();
        } catch (error) {
            Fetcher.LogFetchError(fetchUrl, error);
        }
        return null;
    }
}

type MalId_Response = {
    data: MalId_Data;
};

type MalId_Data = {
    Media: MalId_Media;
};

type MalId_Media = {
    idMal: number;
};
