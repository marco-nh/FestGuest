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
    auth.onAuthStateChanged(user => {
        if (user) {
            const userEmail = user.email;
            const chatRef = ref(database, 'chats');
            const privatechatRef = ref(database, 'md');
            
            loadChats(chatRef, userEmail, 'chatList', false);
            loadChats(privatechatRef, userEmail, 'chatUsersLabel', true);
        }
    });
}

function loadChats(ref, userEmail, elementId, isPrivate) {
    get(ref).then(snapshot => {
        if (snapshot.exists()) {
            snapshot.forEach(chatSnapshot => {
                processChatSnapshot(chatSnapshot, userEmail, elementId, isPrivate);
            });
        }
    }).catch(error => {
        console.error("Error al cargar los chats:", error);
    });
}

function processChatSnapshot(chatSnapshot, userEmail, elementId, isPrivate) {
    const chatData = chatSnapshot.val();
    if (chatData.messages) {
        Object.values(chatData.messages).some(message => {
            if (shouldCreateChatElement(message, userEmail, chatSnapshot.key, isPrivate)) {
                createChatElement(chatSnapshot.key, elementId, userEmail, isPrivate);
                return true;
            }
            return false;
        });
    }
}

function shouldCreateChatElement(message, userEmail, chatKey, isPrivate) {
    if (message.sender === userEmail || (isPrivate && userEmail.split("@")[0] === chatKey.split("_")[0])) {
        return true;
    }
    return false;
}

function createChatElement(chatKey, elementId, userEmail, isPrivate) {
    const chatLabel = document.getElementById("chatUsers");
    const chatElement = document.createElement('div');
    chatElement.classList.add('chat-box');
    chatElement.textContent = isPrivate ? getPrivateChatName(chatKey, userEmail) : chatKey;
    chatElement.addEventListener('click', () => {
        window.location.href = `/src/pages/chat/chat.html?${isPrivate ? 'privatechat' : 'chatName'}=${chatKey}`;
    });
    document.getElementById(elementId).appendChild(chatElement);
    if (isPrivate) {
        chatLabel.classList.remove("hidden");
    }
}

function getPrivateChatName(chatKey, userEmail) {
    const keyParts = chatKey.split("_");
    return userEmail.split("@")[0] === keyParts[0] ? keyParts[1] : keyParts[0];
}




