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
            return;
        }

        const episodeSources = await ConsumetZoroClient.GetEpisodeSources(episodeId);
        if (!episodeSources) {
            return;
        }

        const videoUrl = episodeSources.sources[0].url;
        const subtitle = ConsumetZoroClient.GetSubtitle(episodeSources.subtitles);
        Video.PlayVideoHls(videoUrl, subtitle?.lang, subtitle?.url);
    }

    public static GetSubtitleLang(): string {
        // TODO: Add option for user to chose subtitles language.
        return "English";
    }
}
