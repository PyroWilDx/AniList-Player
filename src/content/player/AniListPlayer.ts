import ConsumetClient from "../client/consumet/ConsumetClient";
import ZoroClient from "../client/ZoroClient";
import AniListScraper from "../scraper/AniListScraper";

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

            await AniListPlayer.PlayEpisode(aniListId, episodeNumber);
        });

        entryRow.insertBefore(playButton, entryRowChildren.titleElement.nextSibling);
    }

    private static async PlayEpisode(aniListId: string, episodeNumber: number): Promise<void> {
        switch (AniListPlayer.GetProvider()) {
            case "Zoro":
                await ZoroClient.PlayEpisode(aniListId, episodeNumber);
                break;
            case "Consumet_Zoro":
                await ConsumetClient.PlayEpisode(aniListId, episodeNumber, "Zoro");
                break;
        }
    }

    private static GetProvider(): string {
        // TODO: Add option for user to chose provider.
        return "Zoro";
    }
}
