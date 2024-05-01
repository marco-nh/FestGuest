import { database } from "../../firebase/initializeDatabase.js";
import { app } from "../../firebase/initializeDatabase.js";
import { auth } from "../../firebase/initializeDatabase.js";
import { ref, push, set, serverTimestamp, query, orderByChild, equalTo, get, update, onChildAdded } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js";

document.addEventListener("DOMContentLoaded", function() {
    fetchChat();
    const sendMessageButton = document.getElementById("sendMessageButton");
    sendMessageButton.addEventListener("click", sendMessage);
    const urlParams = new URLSearchParams(window.location.search);
    const chatName = urlParams.get('chatName');
    if(chatName == "Global"){
        createChat("Global")
    }
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

    //window.location.href = `/src/pages/chat/chat.html?chatName=${name}`;
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



function loadUserMessages() {
    auth.onAuthStateChanged(function(user) {
        if (user){ 
            const userEmail = user.email;
            console.log(userEmail);
            const chatRef = ref(database, 'chats');
        
            
            get(chatRef).then((snapshot) => {
                if (snapshot.exists()) {
                    snapshot.forEach((chatSnapshot) => {
                        const chatData = chatSnapshot.val();
        
                        
                        if (chatData.messages) {
                            
                            Object.values(chatData.messages).some((message) => {
                                
                                if (message.sender === userEmail) {
                                    
                                    console.log("Se encontró un mensaje del usuario actual en el chat:", chatSnapshot.key, "Mensaje:", message);
                                    const chatElement = document.createElement('div');
                                    chatElement.classList.add('chat-box');
                                    chatElement.textContent = chatSnapshot.key;

                                    chatElement.addEventListener('click', function() {
                                        window.location.href = `/src/pages/chat/chat.html?chatName=${chatSnapshot.key}`;
                                    });

                                    document.getElementById("chatList").appendChild(chatElement);
                                    
                                    return true;
                                }
                                
                                return false;
                            });
                        }
                    });
                } else {
                    console.log("No se encontraron chats en la base de datos.");
                }
            }).catch((error) => {
                console.error("Error al cargar los chats:", error);
            });
          
        } else {
          console.log("Fallo");
        }
      });

    
}


loadUserMessages();







