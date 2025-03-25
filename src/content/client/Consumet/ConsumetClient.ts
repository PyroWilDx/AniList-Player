import Video from "../../player/Video";
import ConsumetAniListClient from "./ConsumetAniListClient";
import ConsumetZoroClient from "./ConsumetZoroClient";

export default class ConsumetClient {
    public static readonly baseApiUrl = "http://localhost:3000";

    public static async PlayEpisode(
        aniListId: string,
        episodeNumber: number,
        episodeProvider: string,
    ): Promise<void> {
        const episodeId = await ConsumetAniListClient.GetEpisodeId(
            aniListId,
            episodeNumber,
            episodeProvider,
        );
        if (!episodeId) {
            console.error(`AniList-Player: Could not fetch ${episodeProvider} episode id.`);
            return;
        }

        switch (episodeProvider) {
            case "Zoro":
                ConsumetClient.PlayEpisodeZoro(episodeId);
                break;
            default:
                break;
        }
    }

    public static async PlayEpisodeZoro(episodeId: string) {
        const episodeSources = await ConsumetZoroClient.GetEpisodeSources(episodeId);
        if (!episodeSources) {
            console.error("AniList-Player: Could not fetch Zoro episode sources.");
            return;
        }

        const videoUrl = episodeSources.sources[0].url;
        const subtitle = ConsumetZoroClient.GetSubtitle(episodeSources.subtitles);
        Video.PlayVideoHls(videoUrl, subtitle?.lang, subtitle?.url);
    }
}
