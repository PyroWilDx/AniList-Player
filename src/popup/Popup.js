const enabledSwitch = document.getElementById("enabled-switch");
const providersSelect = document.getElementById("providers-select");

const zoroOpt = document.getElementById("zoro-opt");
const zoroModeSelect = document.getElementById("zoro-mode-select");

chrome.storage.sync.get(["enabled", "provider", "zoroMode"], (result) => {
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

    if (result.zoroMode !== undefined) {
        zoroModeSelect.value = result.zoroMode;
    } else {
        zoroModeSelect.value = "Embed";
        StoreZoroMode(zoroModeSelect.value);
    }

    InitLabelHints();
    DisplayProviderOpt();
});

enabledSwitch.addEventListener("change", () => {
    StoreEnabled(enabledSwitch.checked);
});

providersSelect.addEventListener("change", () => {
    StoreProvider(providersSelect.value);

    DisplayProviderOpt();
});

zoroModeSelect.addEventListener("change", () => {
    StoreZoroMode(zoroModeSelect.value);
});

function InitLabelHints() {
    document.querySelectorAll("label").forEach((label) => {
        label.addEventListener("mouseenter", () => {
            const hintText = label.getAttribute("hint");
            let hintElement = label.hintElement;

            if (!hintElement) {
                hintElement = document.createElement("div");
                hintElement.classList.add("hint");

                label.parentElement.appendChild(hintElement);
                label.hintElement = hintElement;
            }

            hintElement.style.display = "block";
            hintElement.textContent = hintText;
        });

        label.addEventListener("mouseleave", () => {
            label.hintElement.style.display = "none";
        });
    });
}

function DisplayProviderOpt() {
    zoroOpt.style.display = "none";

    switch (providersSelect.value) {
        case "AnimEmbed":
            break;
        case "Zoro":
            zoroOpt.style.display = "";
            break;
        case "Consumet_Zoro":
            break;
        default:
            break;
    }
}

function StoreEnabled(enabled) {
    chrome.storage.sync.set({ enabled }, () => {});
}

function StoreProvider(provider) {
    chrome.storage.sync.set({ provider }, () => {});
}

function StoreZoroMode(zoroMode) {
    chrome.storage.sync.set({ zoroMode }, () => {});
}
