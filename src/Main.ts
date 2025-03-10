import AniListWatcher from "./content/watcher/AniListWatcher";

console.log("AniList-Player Started.");

const aniListWatcher = new AniListWatcher();
aniListWatcher.WatchEntryRow((entryRow) => {
    console.log(entryRow.children[1].children[0].textContent?.trim());
});
