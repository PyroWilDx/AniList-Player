import Video from "../../player/Video";
import MALSyncClient from "../MALSyncClient";
import AniWatchClient from "./AniWatchClient";

export default class ZoroClient {
    public static async PlayEpisode(aniListId: string, episodeNumber: number): Promise<void> {
        const zoroId = await MALSyncClient.GetZoroId(aniListId);
        if (!zoroId) {
            console.error("AniList-Player: Could not fetch Zoro anime id.");
            return;
        }

        const episodeId = await AniWatchClient.GetEpisodeId(zoroId, episodeNumber);
        if (!episodeId) {
            console.error("AniList-Player: Could not fetch Zoro episode id.");
            return;
        }

        const episodeSources = await AniWatchClient.GetEpisodeSources(episodeId);
        if (!episodeSources) {
            console.error("AniList-Player: Could not fetch Zoro episode sources.");
            return;
        }

        const videoUrl = episodeSources.data.sources[0].url;
        const track = AniWatchClient.GetTrack(episodeSources.data.tracks);
        Video.PlayVideoHls(videoUrl, track?.label, track?.file);
    }
}
