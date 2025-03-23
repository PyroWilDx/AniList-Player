import AnimEmbedClient from "../client/AnimEmbedClient";
import ConsumetClient from "../client/consumet/ConsumetClient";
import ZoroClient from "../client/ZoroClient";
import AniListScraper from "../scraper/AniListScraper";
import User from "../user/User";

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
        playButton.style.cursor = "pointer";
        playButton.style.display = "flex";
        playButton.style.alignItems = "center";
        playButton.style.justifyContent = "center";
        playButton.style.padding = "8px 16px";
        playButton.textContent = "Play";
        playButton.style.fontSize = "18px";
        playButton.style.fontWeight = "bold";
        playButton.style.color = "white";
        playButton.style.backgroundColor = "#FF0000";
        playButton.style.border = "none";
        playButton.style.borderRadius = "8px";
        playButton.style.transition = "background 0.2s ease";
        playButton.onmouseover = () => (playButton.style.backgroundColor = "#CC0000");
        playButton.onmouseout = () => (playButton.style.backgroundColor = "#FF0000");
        playButton.addEventListener("click", async () => {
            const playButtonSize = playButton.getBoundingClientRect();
            playButton.textContent = "";
            playButton.style.width = `${playButtonSize.width}px`;
            playButton.style.height = `${playButtonSize.height}px`;

            const loaderIcon = document.createElement("div");
            loaderIcon.style.width = "24px";
            loaderIcon.style.height = "24px";
            loaderIcon.style.border = "3.2px solid white";
            loaderIcon.style.borderTop = "3.2px solid transparent";
            loaderIcon.style.borderRadius = "50%";
            loaderIcon.style.animation = "spin-anilist-player 1s linear infinite";

            playButton.appendChild(loaderIcon);

            const episodeNumber = AniListScraper.GetEpisodeNumber(entryRowChildren);
            if (!episodeNumber) {
                return;
            }

            await AniListPlayer.PlayEpisode(aniListId, episodeNumber);

            playButton.textContent = "Play";
            playButton.style.width = "";
            playButton.style.height = "";
        });

        entryRow.insertBefore(playButton, entryRowChildren.titleElement.nextSibling);
    }

    private static async PlayEpisode(aniListId: string, episodeNumber: number): Promise<void> {
        switch (User.GetProvider()) {
            case "AnimEmbed":
                await AnimEmbedClient.PlayEpisode(aniListId, episodeNumber);
                break;
            case "Zoro":
                await ZoroClient.PlayEpisode(aniListId, episodeNumber);
                break;
            case "Consumet_Zoro":
                await ConsumetClient.PlayEpisode(aniListId, episodeNumber, "Zoro");
                break;
            default:
                break;
        }
    }
}
