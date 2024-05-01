import { database } from "../../firebase/initializeDatabase.js";
import { app } from "../../firebase/initializeDatabase.js";
import { auth } from "../../firebase/initializeDatabase.js";
import { ref, push, set, serverTimestamp, query, orderByChild, equalTo, get, update, onChildAdded } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js";

document.addEventListener("DOMContentLoaded", function() {
    fetchChat();
    const sendMessageButton = document.getElementById("sendMessageButton");
    sendMessageButton.addEventListener("click", sendMessage);
});

export async function createChat(name) {
    const chatMessagesRef = ref(database, `chats/${name}/messages`); // Referencia para la carpeta "messages" dentro del chat

    try {
        const snapshot = await get(chatMessagesRef);
        if (!snapshot.exists()) {
            await set(chatMessagesRef, true); // Crear la carpeta si no existe
            console.log("Carpeta 'messages' creada en el chat para el evento:", name);
        } else {
            console.log("La carpeta 'messages' ya existe en el chat para el evento:", name);
        }
    } catch (error) {
        console.error("Error al crear o verificar la carpeta 'messages' en el chat:", error);
    }

    window.location.href = `/src/pages/chat/chat.html?chatName=${name}`;
}


function sendMessage() {
    const urlParams = new URLSearchParams(window.location.search);
    const chatName = urlParams.get('chatName');

    var user=auth.currentUser;
    if(user){
        console.log("Usuario autenticado")
    }else{
        console.log("Usuario no autenticado")
    }

    const messageInput = document.getElementById("messageInput");
    const message = messageInput.value.trim(); 
    messageInput.value = ""; 

    if (message !== "") { 
        const timestamp = Date.now(); 
        
        const chatMessagesRef = ref(database, `chats/${chatName}/messages`);
        push(chatMessagesRef, {
            message: message,
            sender: user.email,
            timestamp: timestamp
        });
    }
}

function fetchChat(){
    const urlParams = new URLSearchParams(window.location.search);
    const chatName = urlParams.get('chatName');
    const chatMessagesRef = ref(database, `chats/${chatName}/messages`);

    onChildAdded(chatMessagesRef, function(snapshot) {
        const message = snapshot.val(); 
        const messageHTML = `<div><strong>${message.sender}:</strong> ${message.message}</div>`;
        document.getElementById("messages").innerHTML += messageHTML; 
    })
}




