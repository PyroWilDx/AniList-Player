export default class AniListWatcher {
    public WatchEntryRow(onWatchEntryRow: (entryRow: HTMLElement) => void): void {
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
}
