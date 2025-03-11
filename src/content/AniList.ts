export default class AniList {
    public static WatchEntryRow(onWatchEntryRow: (entryRow: HTMLElement) => void): void {
        const mObserver = new MutationObserver((mRecords: MutationRecord[]) => {
            for (const mRecord of mRecords) {
                for (const node of mRecord.addedNodes) {
                    if (node.nodeType === 1) {
                        const nodeEl = <HTMLElement>node;
                        const nodeClassList = nodeEl.classList;
                        if (nodeClassList.contains("entry") && nodeClassList.contains("row")) {
                            onWatchEntryRow(nodeEl);
                        } else {
                            const entryRows = nodeEl.querySelectorAll<HTMLElement>(".entry.row");
                            for (const entryRow of entryRows) {
                                onWatchEntryRow(entryRow);
                            }
                        }
                    }
                }
            }
        });

        mObserver.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    public static GetAnimeId(entryRow: HTMLElement): string | null {
        const titleEl = entryRow.querySelector(".title");
        if (!titleEl) {
            console.error("AniList-Player: Could not find .title element in .entry.row element.", entryRow);
            return null;
        }

        const titleAnchorEl = titleEl.querySelector("a");
        if (!titleAnchorEl) {
            console.error("AniList-Player: Could not find <a> element in .title element.", titleEl);
            return null;
        }

        const animeIdMatch = titleAnchorEl.href.match(/\/anime\/(\d+)\//);
        if (!animeIdMatch) {
            console.error("AniList-Player: Could not find anime id from hRef of <a> element.", titleAnchorEl);
            return null;
        }

        return animeIdMatch[1];
    }

    public static GetUserProgress(entryRow: HTMLElement): string | null {
        const progressEl = entryRow.querySelector(".progress");
        if (!progressEl) {
            console.error("AniList-Player: Could not find .progress element in .entry.row element.", entryRow);
            return null;
        }

        const progressElTextContent = progressEl.textContent;
        if (!progressElTextContent) {
            console.error("AniList-Player: Could not find textContent in .progress element.", progressEl);
            return null;
        }

        return progressElTextContent.replace("+", "").trim().split("/")[0];
    }
}
