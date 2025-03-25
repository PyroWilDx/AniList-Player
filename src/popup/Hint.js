let currElement = null;

currElement = document.querySelector("[for='enabled-switch']");
currElement.getHintFn = () => {
    return "Enable AniList-Player on AniList or not.";
};

currElement = document.querySelector("[for='providers-select']");
currElement.getHintFn = () => {
    return "Provider used to find anime episodes.";
};

currElement = document.querySelector("[for='zoro-mode-select']");
currElement.getHintFn = () => {
    return "How to play anime episodes from Zoro.";
};
