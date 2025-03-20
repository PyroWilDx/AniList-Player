import Hls from "hls.js";

export default class Video {
    public static PlayVideoEmbed(videoUrl: string): void {
        const videoContainer = document.createElement("div");
        videoContainer.style.display = "flex";
        videoContainer.style.position = "fixed";
        videoContainer.style.top = "0";
        videoContainer.style.left = "0";
        videoContainer.style.width = "100%";
        videoContainer.style.height = "100%";
        videoContainer.style.zIndex = "10000";

        const iFrame = document.createElement("iframe");
        iFrame.src = videoUrl;
        iFrame.style.width = "96%";
        iFrame.style.height = "100%";
        iFrame.width = iFrame.style.width;
        iFrame.height = iFrame.style.height;
        iFrame.style.border = "none";
        iFrame.allowFullscreen = true;

        const closeButton = document.createElement("div");
        closeButton.style.cursor = "pointer";
        closeButton.style.display = "flex";
        closeButton.style.justifyContent = "center";
        closeButton.style.alignItems = "center";
        closeButton.style.width = "4%";
        closeButton.style.height = "100%";
        closeButton.style.backgroundColor = "red";
        closeButton.addEventListener("click", () => {
            iFrame.src = "about:blank";
            document.body.removeChild(videoContainer);
        });

        const closeIcon = document.createElement("span");
        closeIcon.textContent = "×";
        closeIcon.style.fontSize = "4rem";
        closeIcon.style.color = "white";

        closeButton.appendChild(closeIcon);

        videoContainer.appendChild(iFrame);
        videoContainer.appendChild(closeButton);

        document.body.appendChild(videoContainer);

        console.log("AniList-Player: Playing embed video.", videoUrl);
    }

    public static PlayVideoHls(videoUrl: string, subLang?: string, subUrl?: string): void {
        const videoPlayer = document.createElement("video");
        videoPlayer.style.position = "fixed";
        videoPlayer.style.top = "0";
        videoPlayer.style.left = "0";
        videoPlayer.style.width = "100%";
        videoPlayer.style.height = "100%";
        videoPlayer.style.backgroundColor = "black";
        videoPlayer.style.zIndex = "10000";
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

        document.body.appendChild(videoPlayer);

        const hls = new Hls();
        hls.loadSource(videoUrl);
        hls.attachMedia(videoPlayer);

        Video.AddControls(videoPlayer, () => {
            hls.destroy();
        });

        console.log("AniList-Player: Playing HLS video.", videoUrl);
    }

    private static AddControls(animePlayer: HTMLElement, onRemove?: () => void): void {
        function handleEscapeListener(e: KeyboardEvent): void {
            if (e.key === "Escape" || e.key === "Backspace" || e.key === "Delete") {
                removeVideoPlayer();
            }
        }

        function removeVideoPlayer(): void {
            if (onRemove) {
                onRemove();
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
