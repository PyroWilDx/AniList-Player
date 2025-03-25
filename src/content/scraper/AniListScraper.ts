export default class AniListScraper {
    public static WatchEntryRow(onWatchEntryRow: (entryRow: HTMLElement) => void): void {
        const mObserver = new MutationObserver((mRecords: MutationRecord[]) => {
            for (const mRecord of mRecords) {
                for (const addedNode of mRecord.addedNodes) {
                    if (addedNode.nodeType === 1) {
                        const nodeElement = <HTMLElement>addedNode;
                        const nodeElementClassList = nodeElement.classList;
                        if (
                            nodeElementClassList.contains("entry") &&
                            nodeElementClassList.contains("row")
                        ) {
                            onWatchEntryRow(nodeElement);
                        } else {
                            const entryRows =
                                nodeElement.querySelectorAll<HTMLElement>(".entry.row");
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

    public static GetEntryRowChildren(entryRow: HTMLElement): EntryRowChildren | null {
        const titleElement = entryRow.querySelector(".title");
        if (!titleElement) {
            console.error(
                "AniList-Player: Could not find .title element in .entry.row element.",
                entryRow,
            );
            return null;
        }

        const titleAnchorElement = titleElement.querySelector("a");
        if (!titleAnchorElement) {
            console.error(
                "AniList-Player: Could not find <a> element in .title element.",
                titleElement,
            );
            return null;
        }

        const progressElement = entryRow.querySelector(".progress");
        if (!progressElement) {
            console.error(
                "AniList-Player: Could not find .progress element in .entry.row element.",
                entryRow,
            );
            return null;
        }

        const progressPlusElement = progressElement.querySelector(".plus-progress");
        if (!progressPlusElement) {
            console.error(
                "AniList-Player: Could not find .plus-progress element in .progress element.",
                entryRow,
            );
            return null;
        }

        return {
            titleElement: titleElement,
            titleAnchorElement: titleAnchorElement,
            progressElement: progressElement,
            progressPlusElement: <HTMLElement>progressPlusElement,
        };
    }

    public static GetAniListId(entryRowChildren: EntryRowChildren): string | null {
        const regExpMatchArray = entryRowChildren.titleAnchorElement.href.match(/\/anime\/(\d+)\//);
        if (!regExpMatchArray) {
            console.error(
                "AniList-Player: Could not find anime id from hRef of <a> element.",
                entryRowChildren.titleAnchorElement,
            );
            return null;
        }

        return regExpMatchArray[1];
    }

    public static GetEpisodeNumber(entryRowChildren: EntryRowChildren): number | null {
        const textContent = entryRowChildren.progressElement.textContent;
        if (!textContent) {
            console.error(
                "AniList-Player: Could not find textContent in .progress element.",
                entryRowChildren.progressElement,
            );
            return null;
        }

        const episodeProgress = parseInt(textContent.replace("+", "").trim().split("/")[0]);
        return episodeProgress + 1;
    }
}

type EntryRowChildren = {
    titleElement: Element;
    titleAnchorElement: HTMLAnchorElement;
    progressElement: Element;
    progressPlusElement: HTMLElement;
};
