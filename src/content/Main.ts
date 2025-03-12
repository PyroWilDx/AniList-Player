import AniListPlayer from "./AniListPlayer";
import AniListScraper from "./AniListScraper";

console.log("AniList-Player Started.");

AniListScraper.WatchEntryRow((entryRow) => {
    AniListPlayer.GeneratePlayButton(entryRow);
});
