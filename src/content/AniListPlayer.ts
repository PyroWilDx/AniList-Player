import AniListScraper from "./AniListScraper";

export default class AniListPlayer {
    public static GeneratePlayButton(entryRow: HTMLElement): void {
        const entryRowChildren = AniListScraper.GetEntryRowChildren(entryRow);
        if (!entryRowChildren) {
            return;
        }

        const aniListId = AniListScraper.GetAniListId(entryRowChildren);
        if (!aniListId) {
            return;
        }

        const playButton = document.createElement("button");
        playButton.textContent = "Play";
        playButton.addEventListener("click", () => {
            const episodeProgress = AniListScraper.GetEpisodeProgress(entryRowChildren);
            if (!episodeProgress) {
                return;
            }
        });

        entryRow.insertBefore(playButton, entryRowChildren.titleElement.nextSibling);
    }
}
