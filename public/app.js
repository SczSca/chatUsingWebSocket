let socketMain;
// Obtener el input del nombre de usuario
const usernameInput = document.getElementById("username");

// Obtener el botón de login
const usernameRegisterBtn = document.getElementById("usernameRegisterBtn");

// Obtener el div del chat
const chatContainer = document.getElementById("chat-container");

// Obtener el div donde se mostrará el mensaje
const container = document.getElementById("containerr");

//obtener el form del nick de usuario para desaparecerlo
const usernameForm = document.getElementById("usernameForm");

//obtener boton de enviar mensaje
const sendMessageBtn = document.getElementById("sendMessageBtn");

//obtener input de mensaje de texto
const textMessageInput = document.getElementById("message");

const exitUserBtn = document.getElementById("exitBtn");
//variable para almacenar usuario propio
let username;

usernameRegisterBtn.addEventListener('click', () => {
    username = usernameInput.value;
    chatContainer.style.display = "block";
    usernameForm.style.display = "none";
    const socket = new WebSocket('ws://localhost:8080');
    const login = {
        type: 'login',
        name: username
    }
    socket.onopen = (event) => {
        console.log('Connection established');
        socket.send(JSON.stringify(login));
        socketMain = socket;
        socket.onmessage = (event) => {
            const jsonMessage = JSON.parse(event.data);
            if(jsonMessage.type === 'login'){
                const p = document.createElement('p');
                p.textContent = "¡Bienvenido al chat " + jsonMessage.name + "!"; 
                container.appendChild(p);
                    
            }else if(jsonMessage.type === 'message'){
                const p = document.createElement('p');
                p.textContent = `(${jsonMessage.name}): ${jsonMessage.data}`
                container.appendChild(p);
            }else if(jsonMessage.type === 'exit'){
                const p = document.createElement('p');
                p.textContent = `${jsonMessage.name} ha salido del chat`;
                container.appendChild(p);
            }
            console.log('Message received: ' + event.data);
        }
        
    }
    
    
})

sendMessageBtn.addEventListener("click", () => {
    const textMessage = textMessageInput.value;
    const message = {
        type: 'message',
        name: username,
        data: textMessage
    }
    textMessageInput.value = "";
    socketMain.send(JSON.stringify(message));
})

exitUserBtn.addEventListener('click', () => {
    const exit = {
        type: 'exit',
        name: username
    }
    socketMain.send(JSON.stringify(exit));
    socketMain.close();
    chatContainer.style.display = "none";
    usernameForm.style.display = "block";

});

// const scoket = new WebSocket('ws://localhost:8080');
