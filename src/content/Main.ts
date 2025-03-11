import AniList from "./AniList";
import AniListPlayer from "./AniListPlayer";

console.log("AniList-Player Started.");

AniList.WatchEntryRow((entryRow) => {
    AniListPlayer.GeneratePlayButton(entryRow);
});
