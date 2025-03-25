import Fetcher from "./Fetcher";

export default class AniListClient {
    private static readonly baseApiUrl = "https://graphql.anilist.co";

    public static async GetMALId(aniListId: string): Promise<string | null> {
        const fetchUrl = AniListClient.baseApiUrl;
        try {
            const response = await Fetcher.Fetch(fetchUrl, {
                init: {
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
                },
            });

            if (!response.ok) {
                console.error(
                    "AniList-Player: Could not fetch MyAnimeList id.",
                    `HTTP ${response.status}`,
                );
                return null;
            }

            const animeInfo: MALId_Response = await response.json();
            return animeInfo.data.Media.idMal.toString();
        } catch (error) {
            Fetcher.LogFetchError(fetchUrl, error);
        }
        return null;
    }
}

type MALId_Response = {
    data: MALId_Data;
};

type MALId_Data = {
    Media: MALId_Media;
};

type MALId_Media = {
    idMal: number;
};
