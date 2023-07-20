const form = document.getElementById("form");
var input = document.getElementById("msg").value;
const messages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name").innerHTML;
const userList = document.getElementById("users");

const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

//allows for you to add the room name to the screen
document.getElementById("room-name").innerHTML=room;

socket.on("userList", (users) => {
    userList.innerHTML = '';
    users.forEach(user => {
        const li = document.createElement('li');
        li.innerHTML = `<li>${user.name}</li>`;
        userList.appendChild(li);
    });
});

//join a room
socket.emit('joinRoom', { username, room });

//writes all messages in the chat
socket.on('message', (message) => {
    writeMessage(message);
    //scroll to bottom automatically
    messages.scrollTop = messages.scrollHeight;
});
//writes current clients messages offset to the right
socket.on('user_message', (message) => {
    writeUserMessage(message);
    //scroll to bottom automatically
    messages.scrollTop = messages.scrollHeight;
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    //get the text input and emit the value to the server
    const msg = e.target.elements.msg.value;
    socket.emit("chatMessage", msg);
    //clear input box
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

//puts the message in a text element in the html
function writeMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<div class = "time_name">
                        <p class="time">${message.time}</p> 
                        <p class="name">${message.username}</p>
                    </div>
                    <p class = "text">${message.message}</p>`;
    document.querySelector('.chat-messages').appendChild(div);
};
function writeUserMessage(message){
    const div = document.createElement('div');
    div.classList.add('user_message');
    div.innerHTML = `<div class = "time_name">
                        <p class="time">${message.time}</p> 
                        <p class="name">${message.username}</p>
                    </div>
                    <p class = "text">${message.message}</p>`;
    document.querySelector('.chat-messages').appendChild(div);
};