import Hls from "hls.js";
import AniListScraper from "./AniListScraper";
import ConsumetAniListClient from "./ConsumetAniListClient";
import ConsumetZoroClient from "./ConsumetZoroClient";

export default class AniListPlayer {
    public static GeneratePlayButton(entryRow: HTMLElement): void {
        const entryRowChildren = AniListScraper.GetEntryRowChildren(entryRow);
        if (!entryRowChildren) {
            return;
        }

        const aniListId = AniListScraper.GetAniListId(entryRowChildren);
        if (!aniListId) {
            return;
        }

        const playButton = document.createElement("button");
        playButton.textContent = "Play";
        playButton.addEventListener("click", async () => {
            const episodeProgress = AniListScraper.GetEpisodeProgress(entryRowChildren);
            if (!episodeProgress) {
                return;
            }

            const episodeNumber = episodeProgress + 1;
            const episode = await ConsumetAniListClient.GetEpisode(aniListId, episodeNumber);
            if (!episode) {
                return;
            }

            const episodeSources = await ConsumetZoroClient.GetEpisodeSources(episode.id);
            if (!episodeSources) {
                return;
            }

            AniListPlayer.PlayVideoHls(episodeSources.sources[0].url);
        });

        entryRow.insertBefore(playButton, entryRowChildren.titleElement.nextSibling);
    }

    public static PlayVideoHls(videoUrl: string) {
        const videoPlayer = document.createElement("video");
        videoPlayer.style.position = "fixed";
        videoPlayer.style.top = "0";
        videoPlayer.style.left = "0";
        videoPlayer.style.width = "100vw";
        videoPlayer.style.height = "100vh";
        videoPlayer.style.backgroundColor = "black";
        videoPlayer.style.zIndex = "10000";
        videoPlayer.controls = true;
        videoPlayer.autoplay = true;

        document.body.appendChild(videoPlayer);

        const hls = new Hls();
        hls.loadSource(videoUrl);
        hls.attachMedia(videoPlayer);

        videoPlayer.requestFullscreen().catch(console.error);

        videoPlayer.addEventListener("ended", () => {
            document.body.removeChild(videoPlayer);
        });

        document.addEventListener("fullscreenchange", () => {
            if (!document.fullscreenElement) {
                document.body.removeChild(videoPlayer);
            }
        });
    }
}
