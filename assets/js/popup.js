const videosLabel = document.querySelector('#videosLabel');
const videoContainer = document.querySelector('#videos');
const previewElement = document.querySelector('#preview');
const channelElement = document.querySelector('#channel');
const previewTypeElement = document.querySelector('#previewType');
const resetButton = document.querySelector('#reset');
const saveButton = document.querySelector('#save');
const titleInput = document.querySelector('#title');
const canvas = document.querySelector('#canvas');

const getFromStorage = keys => {
    return new Promise((resolve, _) => chrome.storage.sync.get(keys, result => resolve(result)));
}

const setToStorage = data => {
    return new Promise((resolve, _) => chrome.storage.sync.set(data, result => resolve(result)));
}

const removeFromStorage = keys => {
    return new Promise((resolve, _) => chrome.storage.sync.remove(keys, result => resolve(result)));
}

const showPreview = async () => {
    let { previewType=0, preview = [] } = await getFromStorage(["preview", "previewType"]);

    if (preview.length === 0) {
        previewElement.src = "/assets/images/noImage.jpg";
        return;
    }

    const previewBuilder = new PreviewBuilder();
    switch (previewType) {
        case 0:
            await previewBuilder.createBasicPreview(preview[0]);

            break;
        case 1:
            await previewBuilder.createExtendedPreview(preview[0]);

            break;
        case 2:
            await previewBuilder.createCollagePreview(preview);

            break;
    }

    previewElement.src = await previewBuilder.getPreviewUrl();
}

const setup = async () => {
    let { channel=0, previewType=0, videos = [], preview = [] } = await getFromStorage(["channel", "videos", "preview", "previewType"]);

    channelElement.value = channel;
    previewTypeElement.value = previewType;
    videosLabel.textContent = `Добавленные ролики [${videos.length}]:`;

    showPreview();

    for (const video of videos) {
        const wrapper = document.createElement("div");
        wrapper.className = "video";

        const videoName = document.createElement("div");
        videoName.className = "video__name";
        videoName.textContent = video.videoId;

        const videoLink = document.createElement("a");
        videoLink.className = "video__link";
        videoLink.textContent = video.link;
        videoLink.target = "_blank";
        videoLink.href = video.link;

        const videoCropBottom = document.createElement("div");
        videoCropBottom.className = "video__crop";
        videoCropBottom.textContent = `Crop bottom: ${video.crop.bottom}`;

        const videoCropTop = document.createElement("div");
        videoCropTop.className = "video__crop";
        videoCropTop.textContent = `Crop top: ${video.crop.top}`;

        const videoRemove = document.createElement("button");
        videoRemove.className = "video__remove";
        videoRemove.textContent = "Удалить";

        wrapper.appendChild(videoName);
        wrapper.appendChild(videoLink);
        wrapper.appendChild(videoCropBottom);
        wrapper.appendChild(videoCropTop);
        wrapper.appendChild(videoRemove);
        videoContainer.appendChild(wrapper);

        videoRemove.onclick = e => onVideoRemoveFromList(e, video.videoId, videoContainer);
    }
}

const onVideoRemoveFromList = async (e, id, container) => {
    const { videos = [] } = await getFromStorage(["videos"]);
    const newVideos = videos.filter(video => video.videoId === id ? false : true);
    await setToStorage({ videos: newVideos });

    container.innerHTML = null;

    setup();
}

const onReset = async () => {
    const isConfirmed = confirm("Подтвердите действие. Нажми 'OK', если хочешь сбросить данные");

    if (isConfirmed === true) {
        await removeFromStorage(["channel", "videos", "preview", "previewType", "title"]);
        videoContainer.innerHTML = null;
        setup();
    }
}

const onSelect = async (e) => {
    if (e.target == null) return;

    await setToStorage({ [e.target.name]: Number(e.target.value) });

    if (e.target.name === "previewType") {
        showPreview();
    }
}

const onTitleInput = async (e) => {
    if (e.target === undefined) return;

    if (e.target.value === "") {
        await removeFromStorage(["title"]);
        return;
    }

    await setToStorage({ title: e.target.value });
}

titleInput.oninput = onTitleInput;
channelElement.onchange = onSelect;
previewTypeElement.onchange = onSelect;
resetButton.onclick = onReset;
window.onload = setup;