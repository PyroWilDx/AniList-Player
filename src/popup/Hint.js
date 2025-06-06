let currElement = null;

currElement = document.querySelector("[for='enabled-switch']");
currElement.getHintFn = () => {
    return "Enable AniList-Player on AniList or not.";
};

currElement = document.querySelector("[for='providers-select']");
currElement.getHintFn = () => {
    return "Provider used to find anime episodes.";
};

currElement = document.querySelector("[for='cors-proxy']");
currElement.getHintFn = () => {
    return "Cors proxy to use for requests that needs it.";
};

currElement = document.querySelector("[for='zoro-mode-select']");
currElement.getHintFn = () => {
    return "How to play anime episodes from Zoro.";
};

currElement = document.querySelector("[for='zoro-api-input']");
currElement.getHintFn = () => {
    return "Check https://github.com/ghoshRitesh12/aniwatch-api/.";
};
currElement.style.cursor = "pointer";
currElement.addEventListener("click", () => {
    window.open("https://github.com/ghoshRitesh12/aniwatch-api/", "_blank");
});

currElement = document.querySelector("[for='consumet-zoro-api-input']");
currElement.getHintFn = () => {
    return "Check https://github.com/consumet/api.consumet.org/.";
};
currElement.style.cursor = "pointer";
currElement.addEventListener("click", () => {
    window.open("https://github.com/consumet/api.consumet.org/", "_blank");
});
