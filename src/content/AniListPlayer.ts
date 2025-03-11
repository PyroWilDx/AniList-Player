import AniList from "./AniList";

export default class AniListPlayer {
    public static GeneratePlayButton(entryRow: HTMLElement): void {
        const entryRowInfo = AniList.GetEntryRowInfo(entryRow);
        if (!entryRowInfo) {
            return;
        }

        const playButton = document.createElement("button");
        playButton.textContent = "Play";
        playButton.addEventListener("click", () => {
            const userProgress = AniList.GetUserProgress(entryRowInfo);
            if (!userProgress) {
                return;
            }

            playButton.textContent += " " + userProgress;
        });

        entryRow.insertBefore(playButton, entryRowInfo.titleEl.nextSibling);
    }
}
