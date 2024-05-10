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
let URL = `https://spotify23.p.rapidapi.com/albums/`
let [data] = await fetch(URL)
const randomElement = data[Math.floor(Math.random() * data.length)];