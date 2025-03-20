import AniListPlayer from "./player/AniListPlayer";
import AniListScraper from "./scraper/AniListScraper";

console.log("AniList-Player Started.");

AniListScraper.WatchEntryRow((entryRow) => {
    AniListPlayer.GeneratePlayButton(entryRow);
});
