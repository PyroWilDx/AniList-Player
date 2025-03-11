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

    public static GetEntryRowInfo(entryRow: HTMLElement): EntryRowInfo | null {
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

        const progressEl = entryRow.querySelector(".progress");
        if (!progressEl) {
            console.error("AniList-Player: Could not find .progress element in .entry.row element.", entryRow);
            return null;
        }

        return {
            titleEl: titleEl,
            titleAnchorEl: titleAnchorEl,
            progressEl: progressEl,
        };
    }

    public static GetAnimeId(entryRowInfo: EntryRowInfo): string | null {
        const regExpMatchArray = entryRowInfo.titleAnchorEl.href.match(/\/anime\/(\d+)\//);
        if (!regExpMatchArray) {
            console.error(
                "AniList-Player: Could not find anime id from hRef of <a> element.",
                entryRowInfo.titleAnchorEl,
            );
            return null;
        }

        return regExpMatchArray[1];
    }

    public static GetUserProgress(entryRowInfo: EntryRowInfo): string | null {
        const textContent = entryRowInfo.progressEl.textContent;
        if (!textContent) {
            console.error("AniList-Player: Could not find textContent in .progress element.", entryRowInfo.progressEl);
            return null;
        }

        return textContent.replace("+", "").trim().split("/")[0];
    }
}

type EntryRowInfo = {
    titleEl: Element;
    titleAnchorEl: HTMLAnchorElement;
    progressEl: Element;
};
