import Hls from "hls.js";
import AniListPlayer, { EntryRowInfo } from "./AniListPlayer";

export default class Video {
    public static OpenWebsite(z: EntryRowInfo, srcUrl: string): void {
        window.open(srcUrl, "_blank");
    }

    public static EmbedWebsite(z: EntryRowInfo, srcUrl: string): void {
        const iFrame = document.createElement("iframe");
        iFrame.style.border = "none";
        iFrame.src = srcUrl;
        iFrame.allowFullscreen = true;

        Video.GenerateVideoContainer(z, iFrame);

        console.log("AniList-Player: Opening embed website.", srcUrl);
    }

    public static PlayVideoEmbed(z: EntryRowInfo, videoUrl: string): void {
        const iFrame = document.createElement("iframe");
        iFrame.style.border = "none";
        iFrame.src = videoUrl;
        iFrame.allowFullscreen = true;

        Video.GenerateVideoContainer(z, iFrame, () => {
            iFrame.src = "about:blank";
        });

        console.log("AniList-Player: Playing embed video.", videoUrl);
    }

    public static PlayVideoHls(
        z: EntryRowInfo,
        videoUrl: string,
        subLang?: string,
        subUrl?: string,
    ): void {
        const videoPlayer = document.createElement("video");
        videoPlayer.style.backgroundColor = "black";
        videoPlayer.controls = true;
        videoPlayer.autoplay = true;
        videoPlayer.crossOrigin = "anonymous";

        if (subLang && subUrl) {
            const subTrack = document.createElement("track");
            subTrack.kind = "subtitles";
            subTrack.label = subLang;
            subTrack.srclang = subLang;
            subTrack.src = subUrl;
            subTrack.default = true;
            videoPlayer.appendChild(subTrack);
            Video.ShowSubtitles(videoPlayer, subLang);
        }

        const hls = new Hls();
        hls.loadSource(videoUrl);
        hls.attachMedia(videoPlayer);

        Video.GenerateVideoContainer(z, videoPlayer, () => {
            hls.destroy();
        });

        console.log("AniList-Player: Playing HLS video.", videoUrl);
    }

    private static GenerateVideoContainer(
        z: EntryRowInfo,
        videoPlayer: HTMLElement,
        onExit?: () => void,
    ): void {
        videoPlayer.style.width = "96%";
        videoPlayer.style.height = "100%";

        const videoContainer = document.createElement("div");
        videoContainer.style.display = "flex";
        videoContainer.style.position = "fixed";
        videoContainer.style.top = "0";
        videoContainer.style.left = "0";
        videoContainer.style.width = "100%";
        videoContainer.style.height = "100%";
        videoContainer.style.zIndex = "10000";

        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.flexDirection = "column";
        buttonContainer.style.width = "4%";
        buttonContainer.style.height = "100%";

        const nextButton = document.createElement("div");
        nextButton.style.cursor = "pointer";
        nextButton.style.display = "flex";
        nextButton.style.justifyContent = "center";
        nextButton.style.alignItems = "center";
        nextButton.style.width = "100%";
        nextButton.style.height = "50%";
        nextButton.style.backgroundColor = "green";
        const nextIcon = document.createElement("span");
        nextIcon.textContent = "→";
        nextIcon.style.fontSize = "4rem";
        nextIcon.style.color = "white";
        nextButton.appendChild(nextIcon);

        const closeButton = document.createElement("div");
        closeButton.style.cursor = "pointer";
        closeButton.style.display = "flex";
        closeButton.style.justifyContent = "center";
        closeButton.style.alignItems = "center";
        closeButton.style.width = "100%";
        closeButton.style.height = "50%";
        closeButton.style.backgroundColor = "red";
        const closeIcon = document.createElement("span");
        closeIcon.textContent = "×";
        closeIcon.style.fontSize = "4rem";
        closeIcon.style.color = "white";
        closeButton.appendChild(closeIcon);

        nextButton.addEventListener("click", async () => {
            nextButton.textContent = "";

            const loaderIcon = document.createElement("div");
            loaderIcon.style.width = "24px";
            loaderIcon.style.height = "24px";
            loaderIcon.style.border = `3.2px solid white`;
            loaderIcon.style.borderTop = "3.2px solid transparent";
            loaderIcon.style.borderRadius = "50%";
            loaderIcon.style.animation = "spin-anilist-player 1s linear infinite";

            nextButton.appendChild(loaderIcon);

            z.progressPlusElement.click();

            await AniListPlayer.PlayEpisode({
                aniListId: z.aniListId,
                episodeNumber: z.episodeNumber + 1,
                progressPlusElement: z.progressPlusElement,
            });

            closeButton.click();
        });
        closeButton.addEventListener("click", () => {
            if (onExit) {
                onExit();
            }
            document.body.removeChild(videoContainer);
        });

        buttonContainer.appendChild(nextButton);
        buttonContainer.appendChild(closeButton);

        videoContainer.appendChild(videoPlayer);
        videoContainer.appendChild(buttonContainer);

        Video.AddExitListener(videoContainer, onExit);

        document.body.appendChild(videoContainer);
    }

    private static AddExitListener(videoContainer: HTMLElement, onExit?: () => void): void {
        function handleEscapeListener(e: KeyboardEvent): void {
            if (e.key === "Escape" || e.key === "Backspace" || e.key === "Delete") {
                removeVideoPlayer();
            }
        }

        function removeVideoPlayer(): void {
            if (onExit) {
                onExit();
            }
            document.body.removeChild(videoContainer);
            window.removeEventListener("keydown", handleEscapeListener);
        }

        window.addEventListener("keydown", handleEscapeListener);
    }

    private static ShowSubtitles(videoPlayer: HTMLVideoElement, subLang: string): void {
        for (const textTrack of videoPlayer.textTracks) {
            if (
                textTrack.kind === "subtitles" &&
                textTrack.label === subLang &&
                textTrack.language === subLang
            ) {
                textTrack.mode = "showing";
                break;
            }
        }
    }
}
