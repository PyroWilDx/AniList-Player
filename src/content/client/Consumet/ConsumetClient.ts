import { EntryRowInfo } from "../../player/AniListPlayer";
import Video from "../../player/Video";
import User from "../../user/User";
import ConsumetAniListClient from "./ConsumetAniListClient";
import ConsumetZoroClient from "./ConsumetZoroClient";

export default class ConsumetClient {
    private static readonly baseApiUrl = "http://localhost:3000";

    public static async PlayEpisode(z: EntryRowInfo, episodeProvider: string): Promise<void> {
        const episodeId = await ConsumetAniListClient.GetEpisodeId(z, episodeProvider);
        if (!episodeId) {
            console.error(`AniList-Player: Could not fetch ${episodeProvider} episode id.`);
            return;
        }

        switch (episodeProvider) {
            case "Zoro":
                ConsumetClient.PlayEpisodeZoro(z, episodeId);
                break;

            default:
                break;
        }
    }

    public static async PlayEpisodeZoro(z: EntryRowInfo, episodeId: string) {
        const episodeSources = await ConsumetZoroClient.GetEpisodeSources(episodeId);
        if (!episodeSources) {
            console.error("AniList-Player: Could not fetch Zoro episode sources.");
            return;
        }

        const videoUrl = episodeSources.sources[0].url;
        const subtitle = ConsumetZoroClient.GetSubtitle(episodeSources.subtitles);
        Video.PlayVideoHls(z, videoUrl, subtitle?.lang, subtitle?.url);
    }

    public static async GetBaseApiUrl(): Promise<string> {
        const userApi = await User.GetConsumetZoroApi();
        if (userApi === "") {
            return ConsumetClient.baseApiUrl;
        }
        return userApi;
    }
}
