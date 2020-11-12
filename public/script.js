const url = "http://localhost:6587";
const prodURL = "https://dev.contentpedia.ru";
const itemsList = document.querySelector(".get-column-content");

window.onload = () => {
    getData();
    setInterval(() => {
        getData();
    }, 120000);
};

function getData() {
    axios
        .get(`${prodURL}/api/db`)
        .then((res) => res.data)
        .then((data) => {
            updateList(data);
        })
        .catch((err) => console.log(err));
}

function createHtmlItem(item) {
    let wrapDiv = document.createElement("li");
    wrapDiv.classList.add("item");

    let img = document.createElement('img');
    img.src = item.video.previewUrl;
    img.classList.add('item-img-bg');
    wrapDiv.appendChild(img);

    let title = document.createElement("h5");
    const formattedTitle = item.video.name ?
        item.video.name.substr(0, 41) :
        "Нет заголовка";
    if (item.video.name.length > 41) {
        title.innerHTML = `${formattedTitle} ...`;
    } else {
        title.innerHTML = formattedTitle;
    }

    let button = document.createElement("button");
    button.innerHTML = "Delete";
    button.classList.add("btn");
    button.classList.add("btn-danger");
    button.classList.add("btn-sm");
    button.dataset.itemId = item._id;
    button.addEventListener("click", deleteItemButton);

    let span = document.createElement("span");
    span.innerHTML = item.channel.name ? item.channel.name : "Канал не выбран";
    if (item.channel.name === "vdud") {
        span.classList.add("green-background");
    } else if (item.channel.name === "kuji") {
        span.classList.add("blue-background");
    } else {
        span.classList.add("pink-background");
    }

    let innerDiv = document.createElement("div");
    innerDiv.innerHTML = item.general.description ?
        item.general.description :
        "Нет описания";

    wrapDiv.appendChild(title);
    wrapDiv.appendChild(span);
    wrapDiv.appendChild(button);
    wrapDiv.appendChild(innerDiv);

    itemsList.appendChild(wrapDiv);
}

async function updateList(data) {
    while (itemsList.firstElementChild) {
        itemsList.removeChild(itemsList.firstElementChild);
    }

    if (data) {
        data.forEach((item) => {
            createHtmlItem(item);
        });
    }
}

function deleteItemButton(e) {
    const id = e.target.dataset.itemId;

    axios({
            method: "DELETE",
            url: `${prodURL}/api/db/${id}`,
        })
        .then((result) => {
            console.log(result);
            getData();
        })
        .catch((err) => console.log(err));
}

// Form for collecting data

const body = {
    channel: {
        name: "",
    },
    video: {
        name: "",
        url: "",
        previewUrl: "",
    },
    guest: {
        name: "",
        age: null,
        profession: "",
        recommendation: {
            videoContent: [],
            audioContent: [],
            textContent: [],
        },
    },
    general: {
        description: "",
    },
};
const addItemForm = document.getElementById("add-item-form");

// Getting channel name
const channelName = document.getElementById("form-channel-name");
channelName.addEventListener("change", () => {
    const index = channelName.options.selectedIndex;
    const value = channelName.options[index].value;
    body.channel.name = value;
});

// Getting video data
const formVideoLink = document.getElementById("form-video-link");
const formVideoTitle = document.getElementById("form-video-title");
const formVideoPreviewLink = document.getElementById("form-video-preview-link");
formVideoLink.addEventListener("change", (e) => {
    body.video.url = e.target.value;
});
formVideoTitle.addEventListener("change", (e) => {
    body.video.name = e.target.value;
});
formVideoPreviewLink.addEventListener("change", (e) => {
    body.video.previewUrl = e.target.value;
    console.log(body.video)

});

// Getting guest data
const formGuestName = document.getElementById("form-guest-name");
const formGuestAge = document.getElementById("form-guest-age");
const formGuestProfession = document.getElementById("form-guest-profession");
formGuestName.addEventListener("change", (e) => {
    body.guest.name = e.target.value;
});
formGuestAge.addEventListener("change", (e) => {
    body.guest.age = e.target.value;
});
formGuestProfession.addEventListener("change", (e) => {
    body.guest.profession = e.target.value;
});

// Getting and fill out VIDEO content recommendation data
const formVideoContentType = document.getElementById("form-video-content-type");
const formVideoContentTitle = document.getElementById(
    "form-video-content-title"
);
const formVideoTimecode = document.getElementById("form-video-timecode");
const formVideoSource = document.getElementById("form-video-source");
const formVideoComments = document.getElementById("form-video-comments");
const formButtonAddVideoItem = document.getElementById(
    "form-button-add-video-item"
);

// Tags
const formVideoFavoritesTag = document.getElementById("video-favorites");
const formVideoMentionTag = document.getElementById("video-mention");
const formVideoNotFavoritesTag = document.getElementById("video-notFavorites");

let videoItem = {
    type: "",
    title: "",
    timecode: "",
    url: "",
    comments: "",
    tags: [],
};
formVideoContentType.addEventListener("change", (e) => {
    videoItem.type = e.target.value;
});
formVideoContentTitle.addEventListener("change", (e) => {
    videoItem.title = e.target.value;
});
formVideoTimecode.addEventListener("change", (e) => {
    videoItem.timecode = e.target.value;
});
formVideoSource.addEventListener("change", (e) => {
    videoItem.url = e.target.value;
});
formVideoComments.addEventListener("change", (e) => {
    videoItem.comments = e.target.value;
});
formVideoFavoritesTag.addEventListener("change", (e) => {
    tagsManager(e.target, videoItem.tags);
});
formVideoMentionTag.addEventListener("change", (e) => {
    tagsManager(e.target, videoItem.tags);
});
formVideoNotFavoritesTag.addEventListener("change", (e) => {
    tagsManager(e.target, videoItem.tags);
});
formButtonAddVideoItem.addEventListener("click", () => {
    createContentItem(
        videoItem.type,
        videoItem.title,
        videoItem.timecode,
        videoItem.tags[0],
        "list-of-video-items"
    );
    body.guest.recommendation.videoContent.push(
        JSON.parse(JSON.stringify(videoItem))
    );

    videoItem.type = "";
    videoItem.title = "";
    videoItem.timecode = "";
    videoItem.url = "";
    videoItem.comments = "";
    videoItem.tags = [];
    formVideoContentType.value = "";
    formVideoContentTitle.value = "";
    formVideoTimecode.value = "";
    formVideoSource.value = "";
    formVideoComments.value = "";
    formVideoFavoritesTag.checked = false;
    formVideoMentionTag.checked = false;
    formVideoNotFavoritesTag.checked = false;
});

// Getting and fill out AUDIO content recommendation data
const formAudioContentType = document.getElementById("form-audio-content-type");
const formAudioContentTitle = document.getElementById(
    "form-audio-content-title"
);
const formAudioTimecode = document.getElementById(
    "form-audio-content-timecode"
);
const formAudioSource = document.getElementById("form-audio-source");
const formAudioComments = document.getElementById("form-audio-comments");
const formButtonAddAudioItem = document.getElementById(
    "form-button-add-audio-item"
);

// Tags
const formAudioFavoritesTag = document.getElementById("audio-favorites");
const formAudioMentionTag = document.getElementById("audio-mention");
const formAudioNotFavoritesTag = document.getElementById("audio-notFavorites");
let audioItem = {
    type: "",
    title: "",
    timecode: "",
    url: "",
    comments: "",
    tags: [],
};
formAudioContentType.addEventListener("change", (e) => {
    audioItem.type = e.target.value;
});
formAudioContentTitle.addEventListener("change", (e) => {
    audioItem.title = e.target.value;
});
formAudioTimecode.addEventListener("change", (e) => {
    audioItem.timecode = e.target.value;
});
formAudioSource.addEventListener("change", (e) => {
    audioItem.url = e.target.value;
});
formAudioComments.addEventListener("change", (e) => {
    audioItem.comments = e.target.value;
});
formAudioFavoritesTag.addEventListener("change", (e) => {
    tagsManager(e.target, audioItem.tags);
});
formAudioMentionTag.addEventListener("change", (e) => {
    tagsManager(e.target, audioItem.tags);
});
formAudioNotFavoritesTag.addEventListener("change", (e) => {
    tagsManager(e.target, audioItem.tags);
});
formButtonAddAudioItem.addEventListener("click", () => {
    createContentItem(
        audioItem.type,
        audioItem.title,
        audioItem.timecode,
        audioItem.tags[0],
        "list-of-audio-items"
    );
    body.guest.recommendation.audioContent.push(
        JSON.parse(JSON.stringify(audioItem))
    );

    audioItem.type = "";
    audioItem.title = "";
    audioItem.timecode = "";
    audioItem.url = "";
    audioItem.comments = "";
    audioItem.tags = [];
    formAudioContentType.value = "";
    formAudioContentTitle.value = "";
    formAudioTimecode.value = "";
    formAudioSource.value = "";
    formAudioComments.value = "";
    formAudioFavoritesTag.checked = false;
    formAudioMentionTag.checked = false;
    formAudioNotFavoritesTag.checked = false;
});

// Getting and fill out TEXT content recommendation data
const formTextContentType = document.getElementById("form-text-content-type");
const formTextContentTitle = document.getElementById("form-text-content-title");
const formTextTimecode = document.getElementById("form-text-content-timecode");
const formTextSource = document.getElementById("form-text-source");
const formTextComments = document.getElementById("form-text-comments");
const formButtonAddTextItem = document.getElementById(
    "form-button-add-text-item"
);

// Tags
const formTextFavoritesTag = document.getElementById("text-favorites");
const formTextMentionTag = document.getElementById("text-mention");
const formTextNotFavoritesTag = document.getElementById("text-notFavorites");
let textItem = {
    type: "",
    title: "",
    timecode: "",
    url: "",
    comments: "",
    tags: [],
};
formTextContentType.addEventListener("change", (e) => {
    textItem.type = e.target.value;
});
formTextContentTitle.addEventListener("change", (e) => {
    textItem.title = e.target.value;
});
formTextTimecode.addEventListener("change", (e) => {
    textItem.timecode = e.target.value;
});
formTextSource.addEventListener("change", (e) => {
    textItem.url = e.target.value;
});
formTextComments.addEventListener("change", (e) => {
    textItem.comments = e.target.value;
});
formTextFavoritesTag.addEventListener("change", (e) => {
    tagsManager(e.target, textItem.tags);
});
formTextMentionTag.addEventListener("change", (e) => {
    tagsManager(e.target, textItem.tags);
});
formTextNotFavoritesTag.addEventListener("change", (e) => {
    tagsManager(e.target, textItem.tags);
});
formButtonAddTextItem.addEventListener("click", () => {
    createContentItem(
        textItem.type,
        textItem.title,
        textItem.timecode,
        textItem.tags[0],
        "list-of-text-items"
    );
    body.guest.recommendation.textContent.push(
        JSON.parse(JSON.stringify(textItem))
    );

    textItem.type = "";
    textItem.title = "";
    textItem.timecode = "";
    textItem.url = "";
    textItem.comments = "";
    textItem.tags = [];
    formTextContentType.value = "";
    formTextContentTitle.value = "";
    formTextTimecode.value = "";
    formTextSource.value = "";
    formTextComments.value = "";
    formTextFavoritesTag.checked = false;
    formTextMentionTag.checked = false;
    formTextNotFavoritesTag.checked = false;
});

const textAreaDescription = document.getElementById(
    "form-additional-description"
);
textAreaDescription.addEventListener("change", (e) => {
    body.general.description = e.target.value;
});

const addItemToDBButton = document.getElementById(
    "add-item-to-database-button"
);
addItemToDBButton.addEventListener("click", (e) => {
    e.preventDefault();

    axios({
            method: "POST",
            url: `${prodURL}/api/db`,
            data: body,
        })
        .then((result) => {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
            showSuccess(700, "Item added successfully");
            getData();
            formCleaning();
        })
        .catch((err) => {
            console.log(err);
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
            showFailed(700, "Item added failed");
        });
});

// Creating small item for content list
function createContentItem(type, title, timecode, tag, list_id) {
    let list = document.querySelector(`#${list_id}`);
    let li = document.createElement("li");
    let div = document.createElement("div");

    let spanType = document.createElement("span");
    spanType.classList.add("col");
    spanType.innerHTML = type;

    let spanTitle = document.createElement("span");
    spanTitle.classList.add("col");
    spanTitle.innerHTML = title;

    let aTimecode = document.createElement("a");
    aTimecode.classList.add("col");
    aTimecode.innerHTML = "Timecode url";
    aTimecode.href = timecode;
    aTimecode.target = "_blank";

    let removeBtn = document.createElement("button");
    removeBtn.innerHTML = "X";
    removeBtn.classList.add("col-1");
    removeBtn.classList.add("remove-btn-for-item");
    removeBtn.onclick = function(e) {
        e.preventDefault();
        li.remove();
    };

    div.classList.add("row");
    div.appendChild(spanType);
    div.appendChild(spanTitle);
    div.appendChild(aTimecode);
    div.appendChild(removeBtn);

    li.appendChild(div);
    li.classList.add("list-group-item");
    assignColor(tag, li);

    list.appendChild(li);
}

function assignColor(tag, li) {
    switch (tag) {
        case "favorites":
            li.classList.add("favorites-bg-color");
            break;
        case "mention":
            li.classList.add("mention-bg-color");
            break;
        case "notFavorites":
            li.classList.add("not-favorites-bg-color");
            break;
        default:
            break;
    }
}

function formCleaning() {
    addItemForm.reset();

    let videoList = document.querySelector(`#list-of-video-items`);
    let audioList = document.querySelector(`#list-of-audio-items`);
    let textList = document.querySelector(`#list-of-text-items`);

    while (videoList.firstElementChild) {
        videoList.removeChild(videoList.firstElementChild);
    }
    while (audioList.firstElementChild) {
        audioList.removeChild(audioList.firstElementChild);
    }
    while (textList.firstElementChild) {
        textList.removeChild(textList.firstElementChild);
    }
}

function showSuccess(time, text) {
    const sucMsg = document.getElementById("success-msg");
    setTimeout(() => {
        sucMsg.classList.add("show");
        sucMsg.innerHTML = text;
    }, time);

    // Hidding message
    setTimeout(() => {
        hideSuccess(sucMsg);
    }, time + 3000);
}

function hideSuccess(item) {
    item.classList.remove("show");
}

function showFailed(time, text) {
    const failMsg = document.getElementById("failed-msg");
    setTimeout(() => {
        failMsg.classList.add("show");
        failMsg.innerHTML = text;
    }, time);

    // Hidding message
    setTimeout(() => {
        hideSuccess(failMsg);
    }, time + 3000);
}

function hideFailed(item) {
    item.classList.remove("show");
}

function tagsManager(target, tags) {
    if (target.checked) {
        tags.push(target.value);
    } else {
        tags.filter((tag, index) => {
            if (tag === target.value) {
                tags.splice(index, 1);
            }
        });
    }
}