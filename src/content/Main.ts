import AniList from "./AniList";

console.log("AniList-Player Started.");

AniList.WatchEntryRow((entryRow) => {
    const animeId = AniList.GetAnimeId(entryRow);
    if (!animeId) {
        return;
    }

    const userProgress = AniList.GetUserProgress(entryRow);
    if (!userProgress) {
        return;
    }

    console.log("animeId: " + animeId + ", userProgress: " + userProgress);
});
