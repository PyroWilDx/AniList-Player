import AniListClient from "./AniListClient";

export default class ZoroClient {
    private static readonly baseApiUrl = "https://aniwatch-api-de46.onrender.com";

    public static async PlayEpisode(aniListId: string, episodeNumber: number): Promise<void> {
        console.log(await AniListClient.GetMALId(aniListId));
    }
}
