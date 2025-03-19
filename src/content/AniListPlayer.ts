import AniListScraper from "./AniListScraper";
import ConsumetClient from "./ConsumetClient";
import ZoroClient from "./ZoroClient";

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
            const episodeNumber = AniListScraper.GetEpisodeNumber(entryRowChildren);
            if (!episodeNumber) {
                return;
            }

            AniListPlayer.PlayEpisode(aniListId, episodeNumber);
        });

        entryRow.insertBefore(playButton, entryRowChildren.titleElement.nextSibling);
    }

    private static async PlayEpisode(aniListId: string, episodeNumber: number): Promise<void> {
        switch (AniListPlayer.GetProvider()) {
            case "Zoro":
                await ZoroClient.PlayEpisode(aniListId, episodeNumber);
                break;
            case "Consumet":
                await ConsumetClient.PlayEpisode(aniListId, episodeNumber);
                break;
        }
    }

    private static GetProvider(): string {
        return "Zoro";
    }
}
