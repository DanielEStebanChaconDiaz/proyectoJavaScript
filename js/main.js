class MyFrame extends HTMLElement {
    id

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }
    
    connectedCallback() {
        // Este método se llama cuando el elemento se conecta al DOM
        // Aquí puedes inicializar elementos, establecer eventos, etc.
    }

    static get observedAttributes() {
        return ["uri"];
    }

    attributeChangedCallback(name, oldVal, newVal) {
        let [, , id] = newVal.split(":");
        this.id = id;
        this.shadowRoot.innerHTML = `
            <iframe class="spotify-iframe" width="454" height="690" src="https://open.spotify.com/embed/album/${this.id}" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
        `;
    }
}

customElements.define("my-frame", MyFrame);

let code = "%3CREQUIRED%3E"
code.replace(" ", "%20")
console.log(code);


const url = `https://spotify23.p.rapidapi.com/search/?q=${code}&type=album&offset=0&limit=10&numberOfTopResults=5`;
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
    let va = result.albums.items;

    for(let i = 0; i < va.length; i++) {
        const getImage = va[i]?.data.coverArt.sources[i]?.url;
        const firstImage = va[i]?.data.coverArt.sources[0]?.url;
        let imagen = getImage ?? firstImage;
        let nombre = va[i].data.name
        let nombreArtista = va[i].data.artists.items[i]?.profile.name ?? va[i].data.artists.items[0]?.profile.name;
        let fecha = va[i].data.date.year
        let uri = va[i].data.uri
        
        const div = document.createElement("div");
        div.classList.add("album")
        div.innerHTML =`
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
        div.querySelector('.album_order').addEventListener('click', () => {
            const frame = document.querySelector("my-frame");
            frame.setAttribute("uri", uri);
        });
    }
} catch (error) {
    console.error(error);
};