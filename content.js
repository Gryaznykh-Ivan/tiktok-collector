
const addMenu = () => {
    const menuContainer = document.querySelector(".tiktok-1h8ubbu-DivMainContent");
    const collectorMenu = document.querySelector(".collectorMenu");
    if (menuContainer !== null && collectorMenu === null) {
        const menu = document.createElement("div");
        menu.className = "collectorMenu";

        const button = document.createElement("button");
        button.textContent = "test";
        menu.appendChild(button);

        chrome.storage.sync.get(['foo', 'bar'], function (items) {
            console.log('Settings retrieved', items);
        });

        menuContainer.appendChild(menu);
    }
}

const start = () => {
    let oldHref = document.location.href;

    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (oldHref != document.location.href) {
                oldHref = document.location.href;

                addMenu();
            }
        });
    });

    observer.observe(document.querySelector("body"), {
        childList: true,
        subtree: true
    });
}

window.addEventListener("load", function () {
    start();
});