import { database, auth } from "../../firebase/initializeDatabase.js";
import { ref, push, set, get, onChildAdded } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js";

document.addEventListener("DOMContentLoaded", function() {
    const sendMessageButton = document.getElementById("sendMessageButton");
    if (sendMessageButton) {
        sendMessageButton.addEventListener("click", sendMessage);
    }

    fetchChat();
    loadUserMessages();
    const urlParams = new URLSearchParams(window.location.search);
    const chatName = urlParams.get('chatName');
    if(chatName == "Global"){
        createChat("Global")
    }
});

export async function createChat(name) {
    const chatMessagesRef = ref(database, `chats/${name}/messages`); 
    try {
        const snapshot = await get(chatMessagesRef);
        if (!snapshot.exists()) {
            await set(chatMessagesRef, true); 
           
        }
    } catch (error) {
        console.error("Error al crear o verificar la carpeta 'messages' en el chat:", error);
    }
}


export async function createPrivateChat(name) {
    const chatMessagesRef = ref(database, `md/${name}/messages`); 
    try {
        const snapshot = await get(chatMessagesRef);
        if (!snapshot.exists()) {
            await set(chatMessagesRef, true); 
            console.log("Carpeta 'messages' creada en el chat para el evento:", name);
        }
    } catch (error) {
        console.error("Error al crear o verificar la carpeta 'messages' en el chat:", error);
    }
}


function sendMessage() {
    const urlParams = new URLSearchParams(window.location.search);
    const chatName = urlParams.get('chatName');
    const privatechat = urlParams.get('privatechat');

    let user = auth.currentUser;
    const messageInput = document.getElementById("messageInput");
    const message = messageInput.value.trim(); 
    messageInput.value = ""; 
    if (message !== "") { 
        const timestamp = Date.now(); 
        if (chatName != null){
            const chatMessagesRef = ref(database, `chats/${chatName}/messages`);
            push(chatMessagesRef, {
                message: message,
                sender: user.email,
                timestamp: timestamp
            });
        } else{
            const chatMessagesRef = ref(database, `md/${privatechat}/messages`);
            push(chatMessagesRef, {
                message: message,
                receiver: privatechat,
                sender: user.email,
                timestamp: timestamp
            });
        }
        
    }
}



async function fetchChat(){
    const urlParams = new URLSearchParams(window.location.search);
    const chatName = urlParams.get('chatName');
    const privatechat = urlParams.get('privatechat')
    let chatMessagesRef = "";
    if (chatName != null){
        chatMessagesRef = ref(database, `chats/${chatName}/messages`)
    }
    else{
        chatMessagesRef = ref(database, `md/${privatechat}/messages`);
    }
    
    onChildAdded(chatMessagesRef, function(snapshot) {
        const message = snapshot.val(); 
        const messages = document.getElementById("messages");
        const flexMessage = document.createElement("div");
        flexMessage.classList.add("flex")
        flexMessage.classList.add("flex-row")

        const element = document.createElement("div")
        element.innerHTML = `<div><strong>${message.sender}:</strong> ${message.message}</div>`;
        flexMessage.appendChild(element)
        messages.appendChild(flexMessage);
    })

}



function loadUserMessages() {
    auth.onAuthStateChanged(function(user) {
        if (user){ 
            const userEmail = user.email;
            const chatRef = ref(database, 'chats');
            const privatechatRef = ref(database, 'md');
            
            get(chatRef).then((snapshot) => {
                if (snapshot.exists()) {
                    snapshot.forEach((chatSnapshot) => {
                        const chatData = chatSnapshot.val();
        
                        
                        if (chatData.messages) {
                            
                            Object.values(chatData.messages).some((message) => {
                                if (message.sender === userEmail) {                                    
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
                }
            }).catch((error) => {
                console.error("Error al cargar los chats:", error);
            });
          
            get(privatechatRef).then((snapshot) => {
                if (snapshot.exists()) {
                    snapshot.forEach((chatSnapshot) => {
                        const chatData = chatSnapshot.val();
        
                        
                        if (chatData.messages) {
                            
                            Object.values(chatData.messages).some((message) => {
                                if (message.sender === userEmail) {
                                    const chatLabel = document.getElementById("chatUsers")
                                    const chatElement = document.createElement('div');
                                    chatElement.classList.add('chat-box');
                                    chatElement.textContent = chatSnapshot.key.split("_")[0];
                                    
                                    chatElement.addEventListener('click', function() {
                                        window.location.href = `/src/pages/chat/chat.html?privatechat=${chatSnapshot.key}`;
                                    });
                                    
                                    document.getElementById("chatUsersLabel").appendChild(chatElement);
                                    chatLabel.classList.remove("hidden")
                                    return true;
                                }

                                if (userEmail.split("@")[0] === chatSnapshot.key.split("_")[0]) {
                                    const chatLabel = document.getElementById("chatUsers")
                                    const chatElement = document.createElement('div');
                                    chatElement.classList.add('chat-box');
                                    chatElement.textContent =  chatSnapshot.key.split("_")[1];
                                    chatElement.addEventListener('click', function() {
                                        window.location.href = `/src/pages/chat/chat.html?privatechat=${chatSnapshot.key}`;
                                    });
                                    document.getElementById("chatUsersLabel").appendChild(chatElement);
                                    chatLabel.classList.remove("hidden")
                                    return true;
                                }
                                
                                return false;
                            });
                        }
                    });
                }
            }).catch((error) => {
                console.error("Error al cargar los chats:", error);
            });

        }
      });    
}



