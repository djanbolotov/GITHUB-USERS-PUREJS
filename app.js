let infoListNode = null;
let imagePart = null;
let bioPart = null;

let localStorage = window.localStorage;

function showNotif(text, type) {
    let errorWrapper = document.getElementById(type);
    errorWrapper.style.width = '100%';
    errorWrapper.textContent = text;
    console.log('timeout staretd');
    setTimeout(() => {
        console.log('timeout finished');
        errorWrapper.style.width = '0';
        errorWrapper.textContent = ''
    }, 6000)
}

function fillProfile(response) {
    infoListNode.innerHTML = '<h2 class="list__title" name="infoTilte">Info</h2>';
    let ul = document.createElement('ul');
    ul.classList.add('list__items--bullet');
    ul.classList.add('list__items');

    let name = document.createElement('li');
    name.classList.add('list__item');
    let a = document.createElement('a');
    a.setAttribute('href', '#');
    a.classList.add('list__link');
    a.textContent = 'Name: ' + response.name;
    name.append(a);
    ul.appendChild(name);

    let blog = document.createElement('li');
    blog.classList.add('list__item');
    let a1 = document.createElement('a');
    a1.setAttribute('href', '#');
    a1.classList.add('list__link');
    a1.textContent = response.blog != null ? 'Blog: ' + response.blog : 'Blog: empty';
    blog.append(a1);
    ul.appendChild(blog);

    let location = document.createElement('li');
    location.classList.add('list__item');
    let a2 = document.createElement('a');
    a2.setAttribute('href', '#');
    a2.classList.add('list__link');
    a2.textContent = response.location != null ? 'Location: ' + response.location : 'Location: empty';
    location.append(a2);
    ul.appendChild(location);

    return ul;
}

function fillBio(bio) {
    let a3 = document.createElement('pre');
    a3.classList.add('list__link');
    a3.setAttribute('font', 'Tahoma');
    a3.textContent = bio != null ? 'Bio: ' + bio : 'Bio: empty';
    return a3;
}

async function fetchProfile(event) {
    event.preventDefault();

    infoListNode = document.getElementById('info');
    imagePart = document.getElementById('onlyImage');
    bioPart = document.getElementById('onlyBio');

    try {
        let username = document.getElementById('gitUsername');

        if (localStorage.getItem(username.value)){
            showNotif('It was in local storage', 'userInCache');
            response = JSON.parse(localStorage.getItem(username.value));
        }
        else {
            await fetch(`https://api.github.com/users/${username.value}`)
                .then(response => response.json())
                .then(json => {
                    localStorage.setItem(username.value, JSON.stringify(json));
                    response = json;
                })
                .catch(err => console.log('Request Failed', err));
        }

        if (response.status >= 400 ){
            showNotif('Requset failed with Network error', 'error');
            resetInfoPart();
        }

        else if (response.name == null) {
            showNotif(`user not found !!!`, 'error');
            resetInfoPart();
        }
        else {
            resetInfoPart();
            infoListNode.appendChild(fillProfile(response));
            imagePart.appendChild(fillProfileImage(response.avatar_url, 180, 200, 'profile picture '));

            bioPart.appendChild(fillBio(response.bio));

        }
    } catch (e) {
        console.log(e)
    }
}

function fillProfileImage(src, width, height, alt) {
    imagePart.innerHTML = '<h2 class="list__title" id="-">Image</h2>';
    let img = document.createElement('img');
    img.classList.add('roundedImage');
    img.setAttribute('opacity', '2');
    img.src = src;
    img.width = width;
    img.height = height;
    img.alt = alt;
    return img;
}

function resetInfoPart() {
    imagePart.innerHTML = '<h2 class="list__title" id="-">Image</h2>';
    infoListNode.innerHTML = '<h2 class="list__title" name="infoTilte">Info</h2>';
    bioPart.innerHTML = '';
}