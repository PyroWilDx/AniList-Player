import AnimEmbedClient from "../client/AnimEmbedClient";
import ConsumetClient from "../client/consumet/ConsumetClient";
import ZoroClient from "../client/ZoroClient";
import AniListScraper from "../scraper/AniListScraper";
import User from "../user/User";

export default class AniListPlayer {
    private static readonly playButtonTextContent = "Play";
    private static readonly playButtonTextColor = "white";
    private static readonly playButtonMouseOutColor = "#FF5B61";
    private static readonly playButtonMouseInColor = "#FF2A30";

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
        playButton.textContent = AniListPlayer.playButtonTextContent;
        playButton.style.fontSize = "18px";
        playButton.style.fontWeight = "bold";
        playButton.style.color = AniListPlayer.playButtonTextColor;
        playButton.style.backgroundColor = AniListPlayer.playButtonMouseOutColor;
        playButton.style.border = "none";
        playButton.style.borderRadius = "8px";
        playButton.style.transition = "background 0.2s ease";
        playButton.onmouseover = () =>
            (playButton.style.backgroundColor = AniListPlayer.playButtonMouseInColor);
        playButton.onmouseout = () =>
            (playButton.style.backgroundColor = AniListPlayer.playButtonMouseOutColor);
        playButton.addEventListener("click", async () => {
            const playButtonSize = playButton.getBoundingClientRect();
            playButton.textContent = "";
            playButton.style.width = `${playButtonSize.width}px`;
            playButton.style.height = `${playButtonSize.height}px`;

            const loaderIcon = document.createElement("div");
            loaderIcon.style.width = "24px";
            loaderIcon.style.height = "24px";
            loaderIcon.style.border = `3.2px solid ${AniListPlayer.playButtonTextColor}`;
            loaderIcon.style.borderTop = "3.2px solid transparent";
            loaderIcon.style.borderRadius = "50%";
            loaderIcon.style.animation = "spin-anilist-player 1s linear infinite";

            playButton.appendChild(loaderIcon);

            const episodeNumber = AniListScraper.GetEpisodeNumber(entryRowChildren);
            if (!episodeNumber) {
                return;
            }

            await AniListPlayer.PlayEpisode(aniListId, episodeNumber);

            playButton.textContent = AniListPlayer.playButtonTextContent;
            playButton.style.width = "";
            playButton.style.height = "";
        });

        entryRow.insertBefore(playButton, entryRowChildren.titleElement.nextSibling);
    }

    private static async PlayEpisode(aniListId: string, episodeNumber: number): Promise<void> {
        const provider = await User.GetProvider();
        switch (provider) {
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
