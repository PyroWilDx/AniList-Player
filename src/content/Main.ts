import AniListPlayer from "./player/AniListPlayer";
import AniListScraper from "./scraper/AniListScraper";

console.log("AniList-Player Started.");

const styleTag = document.createElement("style");
styleTag.textContent = `
                @keyframes spin-anilist-player {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
document.head.appendChild(styleTag);

AniListScraper.WatchEntryRow((entryRow) => {
    AniListPlayer.GeneratePlayButton(entryRow);
});
