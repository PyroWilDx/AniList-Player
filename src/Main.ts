import AniListUtils from "./content/utils/AniListUtils";
import AniListWatcher from "./content/watcher/AniListWatcher";

console.log("AniList-Player Started.");

const aniListWatcher = new AniListWatcher();
aniListWatcher.WatchEntryRow((entryRow) => {
    const animeId = AniListUtils.GetAnimeId(entryRow);
    if (!animeId) {
        return;
    }

    const userProgress = AniListUtils.GetUserProgress(entryRow);
    if (!userProgress) {
        return;
    }

    console.log("animeId: " + animeId + ", userProgress: " + userProgress);
});
