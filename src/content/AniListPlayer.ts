import AniListScraper from "./AniListScraper";
import ConsumetClient from "./ConsumetClient";

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
        playButton.addEventListener("click", async () => {
            const episodeProgress = AniListScraper.GetEpisodeProgress(entryRowChildren);
            if (!episodeProgress) {
                return;
            }

            const episodeNumber = episodeProgress + 1;
            const episode = await ConsumetClient.GetEpisode(aniListId, episodeNumber);
            console.log(episode);
        });

        entryRow.insertBefore(playButton, entryRowChildren.titleElement.nextSibling);
    }
}
