const users = [];

function addUser(id, name, room){
  const user = {id, name, room};
  users.push(user);
  return user;
};

function getUser(id) {
  return users.find(user => user.id == id);
};

function removeUser(id) {
  const pos = users.findIndex(user => user.id == id);
  if (pos >= -1){
    return users.splice(pos, 1)[0];
  };
};

function getUsers(room) {
  return users.filter(user => user.room == room);
};

export {addUser, getUser, removeUser, getUsers}