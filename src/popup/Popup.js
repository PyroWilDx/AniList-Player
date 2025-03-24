const enabledSwitch = document.getElementById("enabled-switch");
const providersSelect = document.getElementById("providers-select");

chrome.storage.sync.get(["enabled", "provider"], (result) => {
    if (result.enabled !== undefined) {
        enabledSwitch.checked = result.enabled;
    } else {
        enabledSwitch.checked = true;
        StoreEnabled(enabledSwitch.checked);
    }

    if (result.provider !== undefined) {
        providersSelect.value = result.provider;
    } else {
        providersSelect.value = "AnimEmbed";
        StoreProvider(providersSelect.value);
    }
});

enabledSwitch.addEventListener("change", () => {
    StoreEnabled(enabledSwitch.checked);
});

providersSelect.addEventListener("change", () => {
    StoreProvider(providersSelect.value);
});

function StoreEnabled(enabled) {
    chrome.storage.sync.set({ enabled }, () => {});
}

function StoreProvider(provider) {
    chrome.storage.sync.set({ provider }, () => {});
}
