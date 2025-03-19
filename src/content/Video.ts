import Hls from "hls.js";

export default class Video {
    public static PlayVideoHls(videoUrl: string, subLang?: string, subUrl?: string): void {
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
