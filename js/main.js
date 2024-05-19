class MyFrame extends HTMLElement {
    id
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() { }

    static get observedAttributes() {
        return ["uri"];
    }

    attributeChangedCallback(name, oldVal, newVal) {
        let [, , id] = newVal.split(":");
        const uri = this.getAttribute("uri");
        const type = uri.split(":")[1];
        this.id = id;
        this.type = type;
        this.shadowRoot.innerHTML = `
            <iframe class="spotify-iframe" width="100%" height="100%" src="https://open.spotify.com/embed/${this.type}/${this.id}" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
        `;
        if (type === "track") {
            this.shadowRoot.innerHTML = `
                <iframe class="spotify-iframe" width="70%" height="400" src="https://open.spotify.com/embed/${this.type}/${this.id}" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
            `;
        }
    }
}
customElements.define("my-frame", MyFrame);

const searchInput = document.querySelector('.search-header__input');
const searchButton = document.querySelector('.search-header__button');

const codes = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
const randomCode = codes[Math.floor(Math.random() * codes.length)];
const code = randomCode.replace(" ", "%20");

document.addEventListener('DOMContentLoaded', () => {
    mostrarAlbums(code);
});

searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        const formattedQuery = query.replace(" ", "%20");
        mostrarAlbums(formattedQuery);
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
            const formattedQuery = query.replace(" ", "%20");
            mostrarAlbums(formattedQuery);
        }
    }
});

async function mostrarAlbums(code) {
    let url = `https://spotify23.p.rapidapi.com/search/?q=${code}&type=albums&offset=0&limit=10&numberOfTopResults=5`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'f39f63f611msh8bc0f870d3507dap1ccbeajsn30cb22305b23',
            'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        const albums = result.albums.items;
        listarAlbum.innerHTML = '';
        for (let i = 0; i < albums.length; i++) {
            const getImage = albums[i]?.data.coverArt.sources[i]?.url;
            const firstImage = albums[i]?.data.coverArt.sources[0]?.url;
            const imagen = getImage ?? firstImage;
            const nombre = albums[i].data.name;
            const nombreArtista = albums[i].data.artists.items[i]?.profile.name ?? albums[i].data.artists.items[0]?.profile.name;
            const fecha = albums[i].data.date.year;
            const uri = albums[i].data.uri;

            const div = document.createElement("div");
            div.classList.add("album");
            div.innerHTML = `
                <div class="album_order" data-uri="${uri}">
                    <div class="imagen_album">
                        <img src="${imagen}" alt="" class="portada">
                    </div>
                    <div class="info_album">
                        <h3>${nombre}</h3>
                        <p>${nombreArtista}</p>
                        <p>${fecha}</p>
                    </div>
                </div>
            `;
            listarAlbum.append(div);
            div.querySelector('.album_order').addEventListener('click', async () => {
                await reproducirPrimerTrack(uri); // Espera a que se reproduzca el primer track
                mostrarTracks(uri); // Mostrar los tracks del álbum
            });
        }
    } catch (error) {
        console.error(error);
    }
}

async function reproducirPrimerTrack(albumUri) {
    let albumId = albumUri.split(":")[2];
    let url = `https://spotify23.p.rapidapi.com/albums/?ids=${albumId}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'f39f63f611msh8bc0f870d3507dap1ccbeajsn30cb22305b23',
            'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        const tracks = result.albums[0].tracks.items;
        const uri = tracks[0]?.uri; // URI del primer track
        const frame = document.querySelector("my-frame");
        frame.setAttribute("uri", uri); // Establecer la URI del primer track
    } catch (error) {
        console.error(error);
    }
}

async function mostrarTracks(albumUri) {
    let albumId = albumUri.split(":")[2];
    let url = `https://spotify23.p.rapidapi.com/albums/?ids=${albumId}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'f39f63f611msh8bc0f870d3507dap1ccbeajsn30cb22305b23',
            'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        const tracks = result.albums[0].tracks.items;
        listarTrack.innerHTML = '';
        for (let i = 0; i < tracks.length; i++) {
            const track = tracks[i];
            const nombre = track.name;
            const nombreArtista = track.artists[0].name;
            const uri = track.uri;
            const imagen = result.albums[0].images[0].url;

            const div = document.createElement("div");
            div.classList.add("track");
            div.innerHTML = `
                <div class="track_order" data-id="${uri}">
                    <div class="imagen_track">
                        <i class='bx bx-menu-alt-left' style='color:#1db954' ></i>
                        <img src="${imagen}" alt="" class="portada">
                    </div>
                    <div class="info_track">
                        <h3>${nombre}</h3>
                        <p>${nombreArtista}</p>
                    </div>
                </div>
            `;
            listarTrack.append(div);
            div.querySelector('.track_order').addEventListener('click', () => {
                const frame = document.querySelector("my-frame");
                frame.setAttribute("uri", uri);
            });
        }
    } catch (error) {
        console.error(error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    buscarTrack(code);
});

searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        const formattedQuery = query.replace(" ", "%20");
        buscarTrack(formattedQuery);
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
            const formattedQuery = query.replace(" ", "%20");
            buscarTrack(formattedQuery);
        }
    }
});

const listarTrack = document.querySelector('#listarTrack');

async function buscarTrack(code) {
    const urlRecommendations = `https://spotify23.p.rapidapi.com/search/?q=${code}&type=tracks&offset=0&limit=10&numberOfTopResults=5`;
    const optionsRecommendations = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'f39f63f611msh8bc0f870d3507dap1ccbeajsn30cb22305b23',
            'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(urlRecommendations, optionsRecommendations);
        const result = await response.json();
        const tracks = result.tracks.items;
        listarTrack.innerHTML = '';
        for (let i = 0; i < tracks.length; i++) {
            const track = tracks[i].data;
            const img = track.albumOfTrack.coverArt.sources[0].url;
            const nombre = track.name;
            const nombreArtista = track.artists.items[0].profile.name;
            const uri = track.uri;

            const div = document.createElement("div");
            div.classList.add("track_Recomendations");
            div.innerHTML = `
                <div class="track_order" data-id="${uri}">
                    <p class="num">${i + 1}</p>
                    <i class='bx bx-play'></i>
                    <div class="imagen_track">
                        <img src="${img}" alt="" class="portada">
                    </div>
                    <div class="info_track">
                        <h3>${nombre}</h3>
                        <p>${nombreArtista}</p>
                    </div>
                </div>
            `;
            listarTrack.append(div);
            div.querySelector('.track_order').addEventListener('click', () => {
                const frame = document.querySelector("my-frame");
                frame.setAttribute("uri", uri);
            });
        }
    } catch (error) {
        console.error(error);
    }
}

const url = 'https://spotify23.p.rapidapi.com/search/?q=%3CREQUIRED%3E&type=playlists&offset=0&limit=10&numberOfTopResults=5';
const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': 'f39f63f611msh8bc0f870d3507dap1ccbeajsn30cb22305b23',
        'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
    }
};

try {
    const response = await fetch(url, options);
    const result = await response.json();
    for (let i = 0; i < 10; i++) {
        const img = result.playlist.items[i].data.images.items[0].sources[0].url;
        const imagen = img;
        const nombre = result.playlist.items[i].data.name;
        const uri = result.playlist.items[i].data.uri;
        const div = document.createElement("div");
        div.classList.add("PlayList");
        div.innerHTML = `
            <div class="track_order" data-id="${uri}">
            <p class="num">${i + 1}</p>
            <i class='bx bx-play'></i>
                <div class="imagen_playlist">
                    <img src="${imagen}" alt="" class="portada">
                </div>
                <div class="info_track">
                    <h3>${nombre}</h3>
                </div>
            </div>
        `;
        listarPlayList.append(div);
        div.querySelector('.track_order').addEventListener('click', () => {
            const frame = document.querySelector("my-frame");
            frame.setAttribute("uri", uri);
        });
    }
} catch (error) {
    console.error(error);
}
const checkbox = document.getElementById('toggleColorsCheckbox');
const containers = document.querySelectorAll('.container');
const search = document.querySelectorAll('.search-header__input');
const leftHeaders = document.querySelectorAll('.left header');
const mediumHeaders = document.querySelectorAll('.medium header');
const rightHeaders = document.querySelectorAll('.right header');
const titles = document.querySelectorAll('.title');
const contenedores = document.querySelectorAll('.contenedor');
const trackMusic = document.querySelectorAll('.track_music');
const albumOrders = document.querySelectorAll('.album_order');
const trackOrders = document.querySelectorAll('.track_order');
const iframe = document.querySelectorAll('.iframe');
const movile = document.querySelectorAll('.menu__mobile');

checkbox.addEventListener('change', function () {
    if (this.checked) {
        setStyles(containers, '#f3f3f3', '#191414');
        setStyles(search, 'white', '#191414');
        setStyles(leftHeaders, '#ececec', '#191414');
        setStyles(mediumHeaders, '#ececec', '#191414');
        setStyles(rightHeaders, '#ececec', '#191414');
        setStyles(titles, '#ececec', '#191414');
        setStyles(contenedores, '#ececec', '#191414');
        setStyles(trackMusic, '#ececec', '#191414');
        setStyles(iframe, '#ececec', '#191414');
        setStyles(movile, '#ececec', '#191414');
        addHoverStyles(albumOrders);
        addHoverStyles(trackOrders);
    } else {
        resetStyles(containers);
        resetStyles(search);
        resetStyles(leftHeaders);
        resetStyles(mediumHeaders);
        resetStyles(rightHeaders);
        resetStyles(titles);
        resetStyles(contenedores);
        resetStyles(trackMusic);
        resetStyles(iframe);
        resetStyles(movile);
        removeHoverStyles(albumOrders);
        removeHoverStyles(trackOrders);
        removeHoverStyles(iframe);
    }
});

function setStyles(elements, backgroundColor, color) {
    elements.forEach(function (element) {
        element.style.background = backgroundColor;
        element.style.color = color;
    });
}

function resetStyles(elements) {
    elements.forEach(function (element) {
        element.style.background = '';
        element.style.color = '';
    });
}

function addHoverStyles(elements) {
    elements.forEach(function (element) {
        element.classList.add('hover-active');
    });
}

function removeHoverStyles(elements) {
    elements.forEach(function (element) {
        element.classList.remove('hover-active');
    });
}
