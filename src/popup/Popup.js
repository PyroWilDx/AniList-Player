const enabledSwitch = document.getElementById("enabled-switch");
const providersSelect = document.getElementById("providers-select");
const corsProxyInput = document.getElementById("cors-proxy");

const animEmbedOpt = document.getElementById("anim-embed-opt");

const zoroOpt = document.getElementById("zoro-opt");
const zoroModeSelect = document.getElementById("zoro-mode-select");
const zoroApiInput = document.getElementById("zoro-api-input");

const consumetZoroOpt = document.getElementById("consumet-zoro-opt");
const consumetZoroApiInput = document.getElementById("consumet-zoro-api-input");

chrome.storage.sync.get(
    ["enabled", "provider", "corsProxy", "zoroMode", "zoroApi", "consumetZoroApi"],
    (result) => {
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

        if (result.corsProxy !== undefined) {
            corsProxyInput.value = result.corsProxy;
        } else {
            corsProxyInput.value = "https://api.codetabs.com/v1/proxy?quest=";
            StoreCorsProxy("https://api.codetabs.com/v1/proxy?quest=");
        }

        if (result.zoroMode !== undefined) {
            zoroModeSelect.value = result.zoroMode;
        } else {
            zoroModeSelect.value = "Embed";
            StoreZoroMode(zoroModeSelect.value);
        }

        if (result.zoroApi !== undefined) {
            zoroApiInput.value = result.zoroApi;
        } else {
            zoroApiInput.value = "";
            StoreZoroApi(zoroApiInput.value);
        }

        if (result.consumetZoroApi !== undefined) {
            consumetZoroApiInput.value = result.consumetZoroApi;
        } else {
            consumetZoroApiInput.value = "";
            StoreConsumetZoroApi(consumetZoroApiInput.value);
        }

        InitGetHintFn();
        DisplayProviderOpt();
    },
);

enabledSwitch.addEventListener("change", () => {
    StoreEnabled(enabledSwitch.checked);
});

providersSelect.addEventListener("change", () => {
    StoreProvider(providersSelect.value);

    DisplayProviderOpt();
});

let corsProxyTimeout;
corsProxyInput.addEventListener("input", () => {
    clearTimeout(corsProxyTimeout);

    corsProxyTimeout = setTimeout(() => {
        StoreCorsProxy(corsProxyInput.value);
    }, 600);
});

zoroModeSelect.addEventListener("change", () => {
    StoreZoroMode(zoroModeSelect.value);
});

let zoroApiTimeout;
zoroApiInput.addEventListener("input", () => {
    clearTimeout(zoroApiTimeout);

    zoroApiTimeout = setTimeout(() => {
        StoreZoroApi(zoroApiInput.value);
    }, 600);
});

let consumetZoroApiTimeout;
consumetZoroApiInput.addEventListener("input", () => {
    clearTimeout(consumetZoroApiTimeout);

    consumetZoroApiTimeout = setTimeout(() => {
        StoreConsumetZoroApi(consumetZoroApiInput.value);
    }, 600);
});

function InitGetHintFn() {
    document.querySelectorAll("*").forEach((element) => {
        if (!element.getHintFn) {
            return;
        }

        element.addEventListener("mouseenter", () => {
            let hintElement = element.hintElement;

            if (!hintElement) {
                hintElement = document.createElement("div");
                hintElement.classList.add("hint");

                element.parentElement.appendChild(hintElement);
                element.hintElement = hintElement;
            }

            hintElement.style.display = "block";
            hintElement.textContent = element.getHintFn();
        });

        element.addEventListener("mouseleave", () => {
            element.hintElement.style.display = "none";
        });
    });
}

function DisplayProviderOpt() {
    animEmbedOpt.style.display = "none";
    zoroOpt.style.display = "none";
    consumetZoroOpt.style.display = "none";

    switch (providersSelect.value) {
        case "AnimEmbed":
            animEmbedOpt.style.display = "";
            break;
        case "Zoro":
            zoroOpt.style.display = "";
            break;
        case "Consumet_Zoro":
            consumetZoroOpt.style.display = "";
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

function StoreCorsProxy(corsProxy) {
    chrome.storage.sync.set({ corsProxy }, () => {});
}

function StoreZoroMode(zoroMode) {
    chrome.storage.sync.set({ zoroMode }, () => {});
}

function StoreZoroApi(zoroApi) {
    chrome.storage.sync.set({ zoroApi }, () => {});
}

function StoreConsumetZoroApi(consumetZoroApi) {
    chrome.storage.sync.set({ consumetZoroApi }, () => {});
}
