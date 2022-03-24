const getFromStorage = keys => {
    return new Promise((resolve, reject) => chrome.storage.sync.get(keys, result => resolve(result)));
}

const setToStorage = data => {
    return new Promise((resolve, _) => chrome.storage.sync.set(data, result => resolve(result)));
}

const removeFromStorage = keys => {
    return new Promise((resolve, _) => chrome.storage.sync.remove(keys, result => resolve(result)));
}

const onPreview = async (e) => {
    const previewPoster = document.querySelector(".tiktok-j6dmhd-ImgPoster");

    if (previewPoster === null) return;

    await setToStorage({ preview: previewPoster.src });
}

const onAddVideo = async (e, cropTop, cropBottom) => {
    const videoUrl = document.querySelector(".tiktok-q3e59-PCopyLinkText").textContent;
    const cropedUrl = videoUrl.split(/\/\@|\?/gi)[1];

    const [user, _, videoId] = cropedUrl.split("/");

    const { channel, videos=[] } = await getFromStorage(["channel", "videos"]);
    if (channel === undefined) {
        alert("Выберите канал перед началом создания подборки");
        return;
    };

    const hasVideoAlreadyAdded = videos.reduce((a, c) => {
        if (c.videoId === videoId) {
            a = true;
        }

        return a;
    }, false);

    if (hasVideoAlreadyAdded === true) {
        alert("Это видео уже было добавлено в подборку");
        return;
    };

    const newVideos = [ ...videos, { videoId, user, link: videoUrl, crop: { bottom: cropBottom, top: cropTop }}];

    setToStorage({ videos: newVideos });
}

const onCropInput = (e, viewer) => {
    if (e.target === null) return;

    viewer.style = `height: ${ e.target.value }%;`;
}

const onResetCrop = (e, bottom, top, vBottom, vTop) => {
    bottom.value = 0;
    top.value = 0;

    vBottom.style = null;
    vTop.style = null;
}

const addControl = () => {
    const cropTop = document.querySelector(".cropTop");
    const cropBottom = document.querySelector(".cropBottom");
    const buttonReset = document.querySelector(".buttonReset");
    const buttonPreview = document.querySelector(".buttonPreview");
    const buttonAddVideo = document.querySelector(".buttonAddVideo");
    const cropBottomViewer = document.querySelector(".cropBottomViewer");
    const cropTopViewer = document.querySelector(".cropTopViewer");

    cropBottom.oninput = e => onCropInput(e, cropBottomViewer);
    cropTop.oninput = e => onCropInput(e, cropTopViewer);
    buttonAddVideo.onclick = e => onAddVideo(e, cropTop.value, cropBottom.value);
    buttonReset.onclick = e => onResetCrop(e, cropBottom, cropTop, cropBottomViewer, cropTopViewer);
    buttonPreview.onclick = e => onPreview(e);
}

const addCropViewer = () => {
    const viewContainer = document.querySelector(".tiktok-1xn27qj-DivVideoWrapper");
    const cropViewerContainer  = document.querySelector(".cropViewer");

    if (viewContainer === null || cropViewerContainer !== null) return;

    const cropViewer = document.createElement("div");
    cropViewer.className = "cropViewer";

    const cropBottomViewer = document.createElement("div");
    cropBottomViewer.className = "cropBottomViewer"

    const cropTopViewer = document.createElement("div");
    cropTopViewer.className = "cropTopViewer"

    cropViewer.appendChild(cropBottomViewer);
    cropViewer.appendChild(cropTopViewer);
    viewContainer.appendChild(cropViewer);
}

const addMenu = () => {
    const menuContainer = document.querySelector(".tiktok-1h8ubbu-DivMainContent");
    const collectorMenu = document.querySelector(".collectorMenu");

    if (menuContainer === null || collectorMenu !== null) return;

    const menu = document.createElement("div");
    menu.className = "collectorMenu";
    
    const cropContainer = document.createElement("div");
    cropContainer.className = "cropContainer";
    
    const wrapperCropTop = document.createElement("div");
    wrapperCropTop.className = "wrapperCropTop";

    const labelCropTop = document.createElement('label');
    labelCropTop.textContent = "Обрезать сверху";
    
    const wrapperCropBottom = document.createElement("div");
    wrapperCropBottom.className = "wrapperCropBottom";

    const labelCropBottom = document.createElement('label');
    labelCropBottom.textContent = "Обрезать снизу";

    const cropTop = document.createElement("input");
    cropTop.className = "cropTop";
    cropTop.type = "range";
    cropTop.step = 0.1;
    cropTop.value = 0;
    cropTop.max = 50;
    cropTop.min = 0;

    const cropBottom = document.createElement("input");
    cropBottom.className = "cropBottom";
    cropBottom.type = "range";
    cropBottom.step = 0.1;
    cropBottom.value = 0;
    cropBottom.max = 50;
    cropBottom.min = 0;

    const buttonReset = document.createElement("button");
    buttonReset.className = "buttonReset";
    buttonReset.textContent = "Сбросить crop";

    const buttonPreview = document.createElement("button");
    buttonPreview.className = "buttonPreview";
    buttonPreview.textContent = "Использовать для превью";
    
    const buttonAddVideo = document.createElement("button");
    buttonAddVideo.className = "buttonAddVideo";
    buttonAddVideo.textContent = "Добавить видео в подборку";

    wrapperCropTop.appendChild(labelCropTop);
    wrapperCropTop.appendChild(cropTop);
    cropContainer.appendChild(wrapperCropTop);

    wrapperCropBottom.appendChild(labelCropBottom);
    wrapperCropBottom.appendChild(cropBottom);
    cropContainer.appendChild(wrapperCropBottom);

    menu.appendChild(cropContainer);
    menu.appendChild(buttonReset);
    menu.appendChild(buttonPreview);
    menu.appendChild(buttonAddVideo);

    menuContainer.appendChild(menu);
}

const start = async () => {
    const observer = new MutationObserver(async mutations => {
        for (const mutation of mutations) {
            if (mutation.target.className === "tiktok-1xn27qj-DivVideoWrapper e1xqvjno9") {
                addMenu();
                addCropViewer();
                addControl();
            }
        }
    });

    observer.observe(document.querySelector("body"), {
        childList: true,
        subtree: true
    });
}

window.addEventListener("load", () => {
    start();
});