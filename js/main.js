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

const listarAlbum = document.querySelector("#listarAlbum")

let url = 'https://spotify23.p.rapidapi.com/search/?q=%3CREQUIRED%3E&type=albums&offset=0&limit=10&numberOfTopResults=5';
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '825f52aba2mshe0fbee31a795561p1004bbjsn81f444926bbe',
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
        let imagen = result.albums.items[i]?.data.coverArt.sources[i]?.url ?? result.albums.items[i]?.data.coverArt.sources[0]?.url;
        let nombre = result.albums.items[i].data.name
        let nombreArtista = result.albums.items[i].data.artists.items[i]?.profile.name ?? result.albums.items[i].data.artists.items[0]?.profile.name;
        let fecha = result.albums.items[i].data.date.year
        
        const mostrarAlbum = async () => {
            const div = document.createElement("div");
            div.classList.add("album")
            div.innerHTML = `
            <div class="album">
                <div class="album_order">
                    <div class="imagen_album">
                        <img src="${imagen}" alt="" class="portada">
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
        if(imagen){
        }
    }
} catch (error) {
	console.error(error);
}
