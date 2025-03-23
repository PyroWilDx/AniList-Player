const providersOpt = document.getElementById("providers-opt");

chrome.storage.sync.get(["provider"], (result) => {
    if (result.provider) {
        providersOpt.value = result.provider;
    } else {
        providersOpt.value = "AnimEmbed";
        StoreProvider("AnimEmbed");
    }
});

providersOpt.addEventListener("change", () => {
    StoreProvider(providersOpt.value);
});

function StoreProvider(provider) {
    chrome.storage.sync.set({ provider }, () => {});
}
