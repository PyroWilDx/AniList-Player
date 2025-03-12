import AniListScraper from "./AniListScraper";
import ConsumetAniListClient from "./ConsumetAniListClient";
import ConsumetZoroClient from "./ConsumetZoroClient";

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
            const episode = await ConsumetAniListClient.GetEpisode(aniListId, episodeNumber);
            if (!episode) {
                return;
            }

            const episodeSources = await ConsumetZoroClient.GetEpisodeSources(episode.id);
            console.log(episodeSources);
        });

        entryRow.insertBefore(playButton, entryRowChildren.titleElement.nextSibling);
    }
}
