const providersOpt = document.getElementById("providers-opt");
providersOpt.addEventListener("change", () => {
    chrome.storage.sync.set({ provider: providersOpt.value }, () => {});
});
