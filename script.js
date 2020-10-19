const url = 'http://localhost:6587';
const prodURL = 'http://172.105.77.52:6587'
const itemsList = document.querySelector('.get-column-content');

window.onload = () => {
    getData();
    setInterval(() => {
        getData();
    }, 120000);
}

function getData() {
    axios.get(`${prodURL}/api/db`)
        .then(res => res.data)
        .then(data => {
            updateList(data);
        })
        .catch(err => console.log(err))
}

function createHtmlItem(item) {
    let wrapDiv = document.createElement('li');
    wrapDiv.classList.add('item');

    let title = document.createElement('h5');
    const formattedTitle = item.video.name ?
        item.video.name.substr(0, 41) :
        'Нет заголовка';
    if (item.video.name.length > 41) {
        title.innerHTML = `${formattedTitle} ...`
    } else {
        title.innerHTML = formattedTitle
    }

    let span = document.createElement('span');
    span.innerHTML = item.channel.name ? item.channel.name : 'Канал не выбран';
    if (item.channel.name === 'vdud') {
        span.classList.add('green-background')
    } else if (item.channel.name === 'kuji') {
        span.classList.add('blue-background')
    } else {
        span.classList.add('pink-background')
    }

    let innerDiv = document.createElement('div');
    innerDiv.innerHTML = item.general.description ? item.general.description : 'Нет описания';

    wrapDiv.appendChild(title);
    wrapDiv.appendChild(span);
    wrapDiv.appendChild(innerDiv);

    itemsList.appendChild(wrapDiv);
}

async function updateList(data) {
    while (itemsList.firstElementChild) {
        itemsList.removeChild(itemsList.firstElementChild)
    }

    data.forEach(item => {
        createHtmlItem(item)
    });
}



// Form for collecting data

const body = {
    channel: {
        name: ''
    },
    video: {
        name: '',
        url: '',
        previewUrl: ''
    },
    guest: {
        name: '',
        age: null,
        profession: '',
        recommendation: {
            videoContent: [],
            audioContent: [],
            textContent: []
        }
    },
    general: {
        description: ''
    }
};
const addItemForm = document.getElementById('add-item-form');

// Getting channel name
const channelName = document.getElementById('form-channel-name');
channelName.addEventListener('change', () => {
    const index = channelName.options.selectedIndex;
    const value = channelName.options[index].value;
    body.channel.name = value;
})

// Getting video data
const formVideoLink = document.getElementById('form-video-link');
const formVideoTitle = document.getElementById('form-video-title');
const formVideoPreviewLink = document.getElementById('form-video-preview-link');
formVideoLink.addEventListener('change', (e) => {
    body.video.url = e.target.value;
})
formVideoTitle.addEventListener('change', (e) => {
    body.video.name = e.target.value;
})
formVideoPreviewLink.addEventListener('change', (e) => {
    body.video.previewUrl = e.target.value;
})


// Getting guest data
const formGuestName = document.getElementById('form-guest-name');
const formGuestAge = document.getElementById('form-guest-age');
const formGuestProfession = document.getElementById('form-guest-profession');
formGuestName.addEventListener('change', (e) => {
    body.guest.name = e.target.value
})
formGuestAge.addEventListener('change', (e) => {
    body.guest.age = e.target.value
})
formGuestProfession.addEventListener('change', (e) => {
    body.guest.profession = e.target.value
})


// Getting and fill out VIDEO content recommendation data
const listOfVideoItems = document.getElementById('list-of-video-items');
const formVideoContentType = document.getElementById('form-video-content-type');
const formVideoContentTitle = document.getElementById('form-video-content-title');
const formVideoTimecode = document.getElementById('form-video-timecode');
const formButtonAddVideoItem = document.getElementById('form-button-add-video-item');
let videoItem = {
    type: '',
    title: '',
    timecode: ''
};
formVideoContentType.addEventListener('change', (e) => {
    videoItem.type = e.target.value;
})
formVideoContentTitle.addEventListener('change', (e) => {
    videoItem.title = e.target.value;
})
formVideoTimecode.addEventListener('change', (e) => {
    videoItem.timecode = e.target.value;
})
formButtonAddVideoItem.addEventListener('click', () => {
    createContentItem(
        videoItem.type,
        videoItem.title,
        videoItem.timecode,
        listOfVideoItems
    );
    body.guest.recommendation.videoContent.push(
        JSON.parse(JSON.stringify(videoItem))
    );
    console.log(body)

    videoItem.type = '';
    videoItem.title = '';
    videoItem.timecode = '';
    formVideoContentType.value = '';
    formVideoContentTitle.value = '';
    formVideoTimecode.value = '';
});


// Getting and fill out AUDIO content recommendation data
const listOfAudioItems = document.getElementById('list-of-audio-items');
const formAudioContentType = document.getElementById('form-audio-content-type');
const formAudioContentTitle = document.getElementById('form-audio-content-title');
const formAudioTimecode = document.getElementById('form-audio-content-timecode');
const formButtonAddAudioItem = document.getElementById('form-button-add-audio-item');
let audioItem = {
    type: '',
    title: '',
    timecode: ''
};
formAudioContentType.addEventListener('change', (e) => {
    audioItem.type = e.target.value;
})
formAudioContentTitle.addEventListener('change', (e) => {
    audioItem.title = e.target.value;
})
formAudioTimecode.addEventListener('change', (e) => {
    audioItem.timecode = e.target.value;
})
formButtonAddAudioItem.addEventListener('click', () => {
    createContentItem(
        audioItem.type,
        audioItem.title,
        audioItem.timecode,
        listOfAudioItems
    );
    body.guest.recommendation.audioContent.push(
        JSON.parse(JSON.stringify(audioItem))
    );
    console.log(body)

    audioItem.type = '';
    audioItem.title = '';
    audioItem.timecode = '';
    formAudioContentType.value = '';
    formAudioContentTitle.value = '';
    formAudioTimecode.value = '';
});

// Getting and fill out TEXT content recommendation data
const listOfTextItems = document.getElementById('list-of-text-items');
const formTextContentType = document.getElementById('form-text-content-type');
const formTextContentTitle = document.getElementById('form-text-content-title');
const formTextTimecode = document.getElementById('form-text-content-timecode');
const formButtonAddTextItem = document.getElementById('form-button-add-text-item');
let textItem = {
    type: '',
    title: '',
    timecode: ''
};
formTextContentType.addEventListener('change', (e) => {
    textItem.type = e.target.value;
})
formTextContentTitle.addEventListener('change', (e) => {
    textItem.title = e.target.value;
})
formTextTimecode.addEventListener('change', (e) => {
    textItem.timecode = e.target.value;
})
formButtonAddTextItem.addEventListener('click', () => {
    createContentItem(
        textItem.type,
        textItem.title,
        textItem.timecode,
        listOfTextItems
    );
    body.guest.recommendation.textContent.push(
        JSON.parse(JSON.stringify(textItem))
    );
    console.log(body)

    textItem.type = '';
    textItem.title = '';
    textItem.timecode = '';
    formTextContentType.value = '';
    formTextContentTitle.value = '';
    formTextTimecode.value = '';
});

const textAreaDescription = document.getElementById('form-additional-description');
textAreaDescription.addEventListener('change', (e) => {
    body.general.description = e.target.value
})

const addItemToDBButton = document.getElementById('add-item-to-database-button');
addItemToDBButton.addEventListener('click', (e) => {
    e.preventDefault();
    console.log(body);

    axios({
            method: 'POST',
            url: `${prodURL}/api/db`,
            data: body
        })
        .then(result => {
            console.log(result)
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
            showSuccess(700, 'Item added successfully');
            getData();
            formCleaning();
        })
        .catch(err => {
            console.log(err)
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
            showFailed(700, 'Item added failed')
        })
});


// Creating small item for content list
function createContentItem(type, title, timecode, list) {
    let li = document.createElement('li');
    let div = document.createElement('div');
    let spanType = document.createElement('span');
    let spanTitle = document.createElement('span');
    let aTimecode = document.createElement('a');

    spanType.classList.add('col');
    spanTitle.classList.add('col');
    aTimecode.classList.add('col');

    spanType.innerHTML = type;
    spanTitle.innerHTML = title;
    aTimecode.innerHTML = 'Timecode url'
    aTimecode.href = timecode
    aTimecode.target = '_blank'

    div.classList.add('row')
    div.appendChild(spanType);
    div.appendChild(spanTitle);
    div.appendChild(aTimecode);

    li.appendChild(div);
    li.classList.add('list-group-item');

    list.appendChild(li);
}

function formCleaning() {
    addItemForm.reset();

    while (listOfVideoItems.firstElementChild) {
        listOfVideoItems.removeChild(listOfVideoItems.firstElementChild)
    }
    while (listOfAudioItems.firstElementChild) {
        listOfAudioItems.removeChild(listOfAudioItems.firstElementChild)
    }
    while (listOfTextItems.firstElementChild) {
        listOfTextItems.removeChild(listOfTextItems.firstElementChild)
    }
}


function showSuccess(time, text) {
    const sucMsg = document.getElementById('success-msg');
    setTimeout(() => {
        sucMsg.classList.add('show');
        sucMsg.innerHTML = text;
    }, time)

    // Hidding message
    setTimeout(() => {
        hideSuccess(sucMsg);
    }, time + 3000)
}

function hideSuccess(item) {
    item.classList.remove('show');
}

function showFailed(time, text) {
    const failMsg = document.getElementById('failed-msg');
    setTimeout(() => {
        failMsg.classList.add('show');
        failMsg.innerHTML = text;
    }, time)

    // Hidding message
    setTimeout(() => {
        hideSuccess(failMsg);
    }, time + 3000)
}

function hideFailed(item) {
    item.classList.remove('show');
}