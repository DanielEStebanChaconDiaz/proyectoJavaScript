class MyFrame extends HTMLElement {
    id
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {}

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
            'X-RapidAPI-Key': '39b6e55d38msh8fdabe584af59cfp1f959bjsn348b230a42b1',
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
                await reproducirPrimerTrack(uri);
                mostrarTracks(uri);
            });
        }
    } catch (error) {
        console.error(error);
    }
}


async function reproducirPrimerTrack(albumUri){
    let albumId = albumUri.split(":")[2];
    let url = `https://spotify23.p.rapidapi.com/albums/?ids=${albumId}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '39b6e55d38msh8fdabe584af59cfp1f959bjsn348b230a42b1',
            'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        const tracks = result.albums[0].tracks.items;
        const uri = tracks[0]?.uri; 
        const frame = document.querySelector("my-frame");
        frame.setAttribute("uri", uri); 
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
            'X-RapidAPI-Key': '39b6e55d38msh8fdabe584af59cfp1f959bjsn348b230a42b1',
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
            const imagen = result.albums[0].images[0].url

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

const listarAlbum = document.querySelector('#listarAlbum');
const listarTrack = document.querySelector('#listarTrack');
const listarPlayList = document.querySelector('#listarPlayList');

const urlRecommendations = `https://spotify23.p.rapidapi.com/recommendations/?limit=20&seed_tracks=0c6xIDDpzE81m2q797ordA&seed_artists=4NHQUGzhtTLFvgF5SZesLK&seed`
const optionsRecommendations = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '39b6e55d38msh8fdabe584af59cfp1f959bjsn348b230a42b1',
        'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
    }
};

try {
    const response = await fetch(urlRecommendations, optionsRecommendations);
    const result = await response.json();
    const tracks = result.tracks;
    for (let i = 0; i < 10; i++) {
        const img = tracks[i]?.album.images[0]?.url;
        const img2 = tracks[i]?.album.images[i]?.url;
        const imagen = img ?? img2;
        const nombre = tracks[i].name;
        const nombreArtista = tracks[i].artists[0].name;
        const uri = tracks[i].uri;
        const div = document.createElement("div");
        div.classList.add("track_Recomendations");
        div.innerHTML = `
            <div class="track_order" data-id="${uri}">
            <i class='bx bx-menu-alt-left' style='color:#1db954' ></i>
                <div class="imagen_track">
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

const urlPlaylists = 'https://spotify23.p.rapidapi.com/search/?q=%3CREQUIRED%3E&type=playlist&offset=0&limit=10&numberOfTopResults=5';
const optionsPlaylists = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '39b6e55d38msh8fdabe584af59cfp1f959bjsn348b230a42b1',
        'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
    }
};

try {
    const response = await fetch(urlPlaylists, optionsPlaylists);
    const result = await response.json();
    const playlist = result.items;
    for (let i = 0; i < 10; i++) {
        const img = playlist[i]?.track.album?.images[0].url;
        const imagen = img;
        const nombre = playlist[i].track.album.name;
        const uri = playlist[i].track.album.uri;
        const div = document.createElement("div");
        div.classList.add("PlayList");
        div.innerHTML = `
            <div class="track_order" data-id="${uri}">
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
