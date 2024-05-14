class myframe extends HTMLElement{
    id
    constructor(id){
        super();
        this.attachShadow({mode: "open"});
    }
    connectedCallback(){
        this.shadowRoot.innerHTML = /*html*/`
            <iframe class="spotify-iframe" width="454" height="690" src="https://open.spotify.com/embed/album/${this.id}" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
        `
    }
    static get observedAttributes(){
        return ["uri"];
    }
    attributeChangedCallback(name,old,now){
        let[nameUri, album, id] = now.split(":")
        this.id = id;
    }
}
customElements.define("my-frame",myframe)

const url = 'https://spotify23.p.rapidapi.com/search/?q=%3CREQUIRED%3E&type=album&offset=0&limit=10&numberOfTopResults=5';
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '6275bafd33mshb8de4d750097a4fp1e70bcjsne2bdaa25c18e',
		'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
	}
};

try {
	const response = await fetch(url, options);
	const result = await response.json();
    let va = result.albums.items
    for(let i = 0; i < 1000; i++){
        fetch (url)
        .then(response => response.json())
        .then(data => mostrarAlbum(data))
        .then(data => escucharAlbum(data))
        const getImage = result.albums.items[i]?.data.coverArt.sources[i]?.url;
        const firstImage = result.albums.items[i]?.data.coverArt.sources[0]?.url;

        let imagen = getImage ?? firstImage;
        let nombre = result.albums.items[i].data.name
        let nombreArtista = result.albums.items[i].data.artists.items[i]?.profile.name ?? result.albums.items[i].data.artists.items[0]?.profile.name;
        let fecha = result.albums.items[i].data.date.year
        let uri = result.albums.items[i].data.uri
        
        const mostrarAlbum = async () => {
            const searchHeader = document.querySelector(".search-header")
            const div = document.createElement("fragment");
            div.classList.add("album")
            searchHeader.after += `
            <div class="album">
                <div class="album_order" data-id="${uri}">
                    <div class="imagen_album">
                        <img src="${imagen}" alt="" class="portada"">
                    </div>
                    <div class="info_album">
                        <h3>${nombre}</h3>
                        <p>${nombreArtista}</p>
                        <p>${fecha}</p>
                    </div>
                </div>
            </div>`;
            listarAlbum.append(div);
        }
        const escucharAlbum = async () => {
            const div =document.createElement("div");
            div.classList.add("frame");
            div.innerHTML=`
            <my-frame uri="${uri}" class="frame"></my-frame>`
            listarAlbum.append(div)
        }
    }
} catch (error) {
	console.error(error);
}

document.addEventListener("DOMContentLoaded", () => {
    mostrarAlbum();
})
