import Hls from "hls.js";

export default class Video {
    public static PlayVideoEmbed(videoUrl: string): void {
        const iFrame = document.createElement("iframe");
        iFrame.style.border = "none";
        iFrame.src = videoUrl;
        iFrame.allowFullscreen = true;

        Video.GenerateVideoContainer(iFrame, () => {
            iFrame.src = "about:blank";
        });

        console.log("AniList-Player: Playing embed video.", videoUrl);
    }

    public static PlayVideoHls(videoUrl: string, subLang?: string, subUrl?: string): void {
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

        Video.GenerateVideoContainer(videoPlayer, () => {
            hls.destroy();
        });

        console.log("AniList-Player: Playing HLS video.", videoUrl);
    }

    private static GenerateVideoContainer(videoPlayer: HTMLElement, onExit?: () => void): void {
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

        const closeButton = document.createElement("div");
        closeButton.style.cursor = "pointer";
        closeButton.style.display = "flex";
        closeButton.style.justifyContent = "center";
        closeButton.style.alignItems = "center";
        closeButton.style.width = "4%";
        closeButton.style.height = "100%";
        closeButton.style.backgroundColor = "red";
        closeButton.addEventListener("click", () => {
            if (onExit) {
                onExit();
            }
            document.body.removeChild(videoContainer);
        });

        const closeIcon = document.createElement("span");
        closeIcon.textContent = "×";
        closeIcon.style.fontSize = "4rem";
        closeIcon.style.color = "white";

        closeButton.appendChild(closeIcon);

        videoContainer.appendChild(videoPlayer);
        videoContainer.appendChild(closeButton);

        Video.AddExitListener(videoContainer, onExit);

        document.body.appendChild(videoContainer);
    }

    private static AddExitListener(animePlayer: HTMLElement, onExit?: () => void): void {
        function handleEscapeListener(e: KeyboardEvent): void {
            if (e.key === "Escape" || e.key === "Backspace" || e.key === "Delete") {
                removeVideoPlayer();
            }
        }

        function removeVideoPlayer(): void {
            if (onExit) {
                onExit();
            }
            document.body.removeChild(animePlayer);
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
