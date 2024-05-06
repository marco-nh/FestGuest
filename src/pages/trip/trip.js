//firebase
import { app } from "../../firebase/initializeDatabase.js";
import { doc, setDoc,query,where, getDocs, getFirestore, collection} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { getLocationByCords } from "../../utils/location/getLocation.js"

//chat
import { createChat, createPrivateChat} from "../chat/chat.js";

function initializeOthers(titulo) {
    const suscripcionButon = document.getElementById("suscripcionButon")
    const desuscripcionButon = document.getElementById("disabledsuscripcionButon")
    const arrayReservados = JSON.parse(localStorage.getItem("eventosSuscritos"))
    try {
        arrayReservados.forEach((fiesta) => {
            if (fiesta == titulo){
                suscripcionButon.classList.add("hidden")
                console.log("Reservado")
                throw BreakException
            }
        })
    } catch (e) {
        console.log("Fallo: Existe suscripcion")
        return false
    };

    desuscripcionButon.classList.add("hidden")
}


async function getTransport(container,title){
    const db = getFirestore(app);
    const querySnapshot = await getDocs(collection(db, "transports"));
    let checkExists = false
    const accommodations ="transports"
    
    querySnapshot.forEach((doc) => {
            checkExists = doc.data().festivalAsociado == title;
            if (checkExists){
                const card = createTransportCard(doc.data(),accommodations)
                
                container.appendChild(card)
            }
        })
}
async function getAccomodations(container,title){
    const db = getFirestore(app);
    const accommodations ="accommodations"
    const querySnapshot = await getDocs(collection(db, "accommodations"));
    let checkExists = false
    querySnapshot.forEach((doc) => {
            checkExists = doc.data().festivalAsociado == title;
            if (checkExists){
                const card = createTransportCard(doc.data(), accommodations)
                container.appendChild(card)
            }
        })
}

function renderAccomodations(location){
    const divTransp = document.getElementById("contentAccomodation")
    divTransp.classList.remove("hidden")
    const base = document.getElementById("baseAccomodation")

    const container = document.createElement('div');
    container.classList.add('grid', 'gap-4');

    getAccomodations(container,location)

    base.appendChild(container);
}

function renderTransport(location){
    const divTransp = document.getElementById("transportDiv")
    divTransp.classList.remove("hidden")
    const base = document.getElementById("base")

    const container = document.createElement('div');
    container.classList.add('grid', 'gap-4');

    getTransport(container,location)

    base.appendChild(container);
}

function createTransportCard(datos, typeDoc) {
    const card = document.createElement('p');
    card.classList.add('flex', 'items-center', 'bg-white', 'border', 'border-gray-200', 'rounded-lg', 'shadow', 'hover:bg-gray-100', 'dark:border-gray-700', 'dark:bg-gray-800', 'dark:hover:bg-gray-700', 'hover:shadow-2xl', 'hover:contrast-125', 'transition-all', 'hover:scale-105');
    card.setAttribute('tabindex', '0');

    const content = document.createElement('div');
    content.classList.add('flex', 'flex-col', 'p-4');

    const divider = document.createElement('div');
    divider.classList.add('flex', 'flex-row', 'p-4','flex-wrap');
  
    const username = document.createElement('h4');
    username.classList.add("flex",'mb-2','mr-2','px-1','text-xl', 'font-bold', 'text-gray-900', 'dark:text-white');
    username.textContent = datos.usuario ;
    username.setAttribute('tabindex', '0');

    const chat = document.createElement('img');
    chat.classList.add("w-10","ml-2");
    chat.setAttribute('src', '/src/images/icon-chat.png');
    chat.setAttribute('tabindex', '0');

    chat.addEventListener('click', function(){
        const nombre = username.textContent;
        createPrivateChat(nombre);
        const usuario = document.getElementById("userNameElement").textContent;
        window.location.href = `/src/pages/chat/chat.html?privatechat=${nombre}_${usuario}`
    });
    
    username.appendChild(chat)

    const title = document.createElement('h5');
    title.classList.add('mb-2', 'px-2','text-xl', 'font-bold', 'text-gray-900', 'dark:text-white', "object-fit-fill");
    
    if(typeDoc=="transports"){
        title.textContent = datos.nombreAnuncioCoche;
    }else{
        title.textContent = datos.nombreAnuncio;
    }
    console.log(datos)
    title.setAttribute('tabindex', '0');

    const descripcion = document.createElement('p');
    descripcion.classList.add('mb-1', 'text-sm', 'text-gray-600', 'dark:text-gray-400');
    descripcion.textContent = datos.descripcion;
    descripcion.setAttribute('tabindex', '0');

    divider.appendChild(title);
    divider.appendChild(username);
    content.appendChild(divider)
    content.appendChild(descripcion);
    card.appendChild(content);

    return card;
}







document.addEventListener('DOMContentLoaded', function() {
    const storedEvent = JSON.parse(localStorage.getItem('selectedEvent'));
    const infoEvent = storedEvent.event;
    localStorage.setItem("transportRendered","false")
    localStorage.setItem("accomodationRendered","false")
    if (storedEvent) {
        const eventNameElement = document.getElementById('eventName');
        const eventImageElement = document.getElementById('eventImage');
        const eventStartElement = document.getElementById('eventStart');
        const eventEndElement = document.getElementById('eventEnd');
        const eventUpdatedElement = document.getElementById('eventUpdated');
        const eventCountryElement = document.getElementById('eventCountry');
        const eventLocationElement = document.getElementById('eventLocation');
        
        eventNameElement.textContent = infoEvent.title;
        eventImageElement.src = storedEvent.imageURL;
        eventStartElement.textContent = `Start Date: ${new Date(infoEvent.start).toLocaleDateString()}`;
        eventEndElement.textContent = `End Date: ${new Date(infoEvent.end).toLocaleDateString()}`;
        eventUpdatedElement.textContent = `Updated: ${new Date(infoEvent.updated).toLocaleDateString()}`;

        if(storedEvent.event) {
            getLocationByCords(storedEvent.event)
                .then(location => {
                    eventLocationElement.textContent = `Location: ${location}`;
                })
                .catch(error => {
                    console.error('Error al obtener la ubicación:', error);
                });
        }
        const transportButton = document.getElementById('transportButton');
        transportButton.addEventListener('click', function() {
            // Pendiente implementar Buscar los transportes relacionados con el evento(Revisar local storage)
            const transportContent = document.getElementById('content')
            transportContent.classList.remove('hidden')
            if (localStorage.getItem("transportRendered") != "true"){
                renderTransport(infoEvent.title)
                localStorage.setItem("transportRendered","true")
                console.log(localStorage.getItem("transportRendered"))
            }
            
        });


        const accommodationsButton = document.getElementById('accommodationsButton');
        accommodationsButton.addEventListener('click', function() {
            const transportContent = document.getElementById('contentAccomodation')
            transportContent.classList.remove('hidden')
            // Pendiente implementar Buscar las acomodaciones relacionados con el evento(Revisar local storage)
            if (localStorage.getItem("accomodationRendered") != "true"){
                renderAccomodations(infoEvent.title)
                localStorage.setItem("accomodationRendered","true")
                console.log(localStorage.getItem("accomodationRendered"))
            }
        });
    }
    initializeOthers(infoEvent.title);

    
        
});


document.getElementById('chatBoton').addEventListener('click', function(){
    const storedEvent = JSON.parse(localStorage.getItem('selectedEvent'));
    const infoEvent = storedEvent.event;
    const nombre = infoEvent.title;
    createChat(nombre);
    window.location.href = `/src/pages/chat/chat.html?chatName=${nombre}`
    console.log(title)
});

//suscribirse

document.getElementById("suscripcionButon").addEventListener('click', function(){
    addSuscription()
    console.log("Suscrito")
});

document.getElementById("disabledsuscripcionButon").addEventListener('click', function(){
    removeSuscription()
    console.log("Desuscrito")
});

async function addSuscription(){
    const db = getFirestore(app);
    const userDocString = localStorage.getItem('userDoc');
    const suscripcionButon = document.getElementById("suscripcionButon")
    const desuscripcion = document.getElementById("disabledsuscripcionButon")
    if (userDocString) {
        const userDoc = JSON.parse(userDocString);          
        const querySnapshot = await getDocs(query(collection(db, 'users'), where('userEmail', '==', userDoc.userEmail)));
        
        querySnapshot.forEach((userdata) => {
            const arraySuscritos = []
            const fiesta = document.getElementById('eventName').textContent

            if (userdata.data().festivalAsociado != null){
                const arrayFiestas = userdata.data().festivalAsociado;

                arrayFiestas.forEach((fiestaBase) => {
                    arraySuscritos.push(fiestaBase)
                    if (fiesta == fiestaBase){
                        console.log("Ya ha sido reservado")
                        localStorage.setItem("reservado","true")
                        return false
                    }
                })
                arraySuscritos.push(fiesta)
            } else{
                arraySuscritos.push(fiesta)
            }
            
            const userRef = doc(db, "users", userdata.id);
            console.log(arraySuscritos)
            if (localStorage.getItem("reservado") == "false"){
                setDoc(userRef, { festivalAsociado: arraySuscritos }, { merge: true });
            }
            //para evitar otra busqueda, agrego la id del usuario y lo meto en local
            localStorage.setItem("userId",userdata.id)

            localStorage.setItem("eventosSuscritos",JSON.stringify(arraySuscritos))
            console.log("Guardado en local")

            localStorage.setItem("reservado",false)
        })
        suscripcionButon.classList.add("hidden")
        desuscripcion.classList.remove("hidden")
    }
}

function removeSuscription() {
    const db = getFirestore(app);
    const fiesta = document.getElementById('eventName').textContent
    const desuscripcion = document.getElementById("disabledsuscripcionButon")
    const suscripcionButon = document.getElementById("suscripcionButon")

    let arrayReservados = JSON.parse(localStorage.getItem("eventosSuscritos"))
    arrayReservados = arrayReservados.filter(e => e !== fiesta); // will return ['A', 'C']
    localStorage.setItem("eventosSuscritos",JSON.stringify(arrayReservados))
    const userRef = doc(db, "users", localStorage.getItem("userId"));
    setDoc(userRef, { festivalAsociado: arrayReservados }, { merge: true });

    desuscripcion.classList.add("hidden")
    suscripcionButon.classList.remove("hidden")

}

