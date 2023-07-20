const form = document.getElementById("form");

form.addEventListener("submit", (e) => {
  console.log("click");
  e.preventDefault();
  //get the text input and emit the value to the server
  const name = e.target.elements.name.value;
  console.log(name);
  const room = e.target.elements.room.value;
  console.log(room);
  window.location.replace(`${window.location.href}chat.html?username=${name}&room=${room}`);
});