import Hls from "hls.js";
import AniListClient from "./AniListClient";
import AniListScraper from "./AniListScraper";
import ConsumetClient, { Subtitle } from "./ConsumetClient";

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
            const episodeNumber = AniListScraper.GetEpisodeNumber(entryRowChildren);
            if (!episodeNumber) {
                return;
            }

            AniListPlayer.PlayEpisode(aniListId, episodeNumber);
        });

        entryRow.insertBefore(playButton, entryRowChildren.titleElement.nextSibling);
    }

    private static async PlayEpisode(aniListId: string, episodeNumber: number): Promise<void> {
        switch (AniListPlayer.GetProvider()) {
            case "AniWatch":
                await AniListPlayer.PlayEpisode_AniWatch(aniListId, episodeNumber);
                break;
            case "Consumet":
                await AniListPlayer.PlayEpisode_Consumet(aniListId, episodeNumber);
                break;
        }
    }

    private static GetProvider(): string {
        return "AniWatch";
    }

    private static async PlayEpisode_AniWatch(
        aniListId: string,
        episodeNumber: number,
    ): Promise<void> {
        console.log(await AniListClient.GetMALId(aniListId));
    }

    private static async PlayEpisode_Consumet(
        aniListId: string,
        episodeNumber: number,
    ): Promise<void> {
        const episodeId = await ConsumetClient.GetEpisodeId_AniList(aniListId, episodeNumber);
        if (!episodeId) {
            return;
        }

        const episodeSources = await ConsumetClient.GetEpisodeSources_Zoro(episodeId);
        if (!episodeSources) {
            return;
        }

        const videoUrl = episodeSources.sources[0].url;
        // TODO: Add option for user to chose subtitles language.
        const subtitle = AniListPlayer.GetSubtitle_Consumet(episodeSources.subtitles);
        AniListPlayer.PlayVideoHls(videoUrl, subtitle);
    }

    private static GetSubtitle_Consumet(subtitles: Subtitle[]): Subtitle | null {
        const lang = AniListPlayer.GetSubtitleLang_Consmet();

        let englishSubtitle: Subtitle | null = null;
        for (const subtitle of subtitles) {
            if (subtitle.lang === lang) {
                return subtitle;
            }
            if (subtitle.lang === "English") {
                englishSubtitle = subtitle;
            }
        }
        return englishSubtitle;
    }

    private static GetSubtitleLang_Consmet(): string {
        return "English";
    }

    private static PlayVideoHls(videoUrl: string, subtitle: Subtitle | null): void {
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
        videoPlayer.crossOrigin = "anonymous";

        if (subtitle) {
            const subTrack = document.createElement("track");
            subTrack.kind = "subtitles";
            subTrack.label = subtitle.lang;
            subTrack.srclang = subtitle.lang;
            subTrack.src = subtitle.url;
            subTrack.default = true;
            videoPlayer.appendChild(subTrack);
            AniListPlayer.ShowSubtitles(videoPlayer, subtitle);
        }

        document.body.appendChild(videoPlayer);

        const hls = new Hls();
        hls.loadSource(videoUrl);
        hls.attachMedia(videoPlayer);

        function handleEscapeListener(e: KeyboardEvent): void {
            if (e.key === "Escape") {
                removeVideoPlayer();
            }
        }

        function removeVideoPlayer(): void {
            hls.destroy();
            document.body.removeChild(videoPlayer);
            document.removeEventListener("keydown", handleEscapeListener);
        }

        document.addEventListener("keydown", handleEscapeListener);
    }

    public static ShowSubtitles(videoPlayer: HTMLVideoElement, subtitle: Subtitle): void {
        for (const textTrack of videoPlayer.textTracks) {
            if (
                textTrack.kind === "subtitles" &&
                textTrack.label === subtitle.lang &&
                textTrack.language === subtitle.lang
            ) {
                textTrack.mode = "showing";
                break;
            }
        }
    }
}
