import { EntryRowInfo } from "../../player/AniListPlayer";
import Video from "../../player/Video";
import User from "../../user/User";
import Fetcher from "../Fetcher";
import MALSyncClient from "../MALSyncClient";
import AniWatchClient from "./AniWatchClient";

export default class ZoroClient {
    private static readonly baseUrl = "https://hianime.to";
    private static readonly baseApiUrl = "https://hianime.to/ajax";

    public static async PlayEpisode(z: EntryRowInfo): Promise<boolean> {
        const zoroId = await MALSyncClient.GetZoroId(z.aniListId);
        if (!zoroId) {
            console.error("AniList-Player: Could not fetch Zoro anime id.");
            return false;
        }

        const zoroMode = await User.GetZoroMode();
        switch (zoroMode) {
            case "Open": {
                const episodeNumberId = await ZoroClient.GetEpisodeId(zoroId, z.episodeNumber);
                if (!episodeNumberId) {
                    console.error("AniList-Player: Could not fetch Zoro episode id.");
                    return false;
                }

                const episodeId = `${zoroId}?ep=${episodeNumberId}`;
                Video.OpenWebsite(z, `${ZoroClient.baseUrl}/watch/${episodeId}`);
                break;
            }

            case "Embed": {
                const episodeNumberId = await ZoroClient.GetEpisodeId(zoroId, z.episodeNumber);
                if (!episodeNumberId) {
                    console.error("AniList-Player: Could not fetch Zoro episode id.");
                    return false;
                }

                const episodeId = `${zoroId}?ep=${episodeNumberId}`;
                Video.EmbedWebsite(z, `${ZoroClient.baseUrl}/watch/${episodeId}`);
                break;
            }

            case "Fetch": {
                const episodeId = await AniWatchClient.GetEpisodeId(zoroId, z);
                if (!episodeId) {
                    console.error("AniList-Player: Could not fetch Zoro episode id.");
                    return false;
                }

                const episodeSources = await AniWatchClient.GetEpisodeSources(episodeId);
                if (!episodeSources) {
                    console.error("AniList-Player: Could not fetch Zoro episode sources.");
                    return false;
                }

                const videoUrl = episodeSources.data.sources[0].url;
                const track = AniWatchClient.GetTrack(episodeSources.data.tracks);
                Video.PlayVideoHls(z, videoUrl, track?.label, track?.file);
                break;
            }

            default:
                return false;
        }

        return true;
    }

    private static async GetEpisodeId(
        zoroId: string,
        episodeNumber: number,
    ): Promise<string | null> {
        const zoroNumberId = zoroId.substring(zoroId.lastIndexOf("-") + 1);
        const fetchUrl = `${ZoroClient.baseApiUrl}/v2/episode/list/${zoroNumberId}`;
        try {
            const response = await Fetcher.Fetch(fetchUrl, { useCorsProxy: true });
            if (!response.ok) {
                console.error(
                    "AniList-Player: Could not fetch Zoro anime episodes.",
                    `HTTP ${response.status}`,
                );
                return null;
            }

            const animeEpisodes: AnimeEpisodes = await response.json();

            const htmlDocument = new DOMParser().parseFromString(animeEpisodes.html, "text/html");
            const episodeElement = htmlDocument.querySelector(`[data-number="${episodeNumber}"]`);
            if (!episodeElement) {
                return null;
            }
            return episodeElement.getAttribute("data-id");
        } catch (error) {
            Fetcher.LogFetchError(fetchUrl, error);
        }
        return null;
    }
}

type AnimeEpisodes = {
    status: boolean;
    html: string;
    totalItems: number;
    continueWatch: boolean | null;
};
