const provider = new firebase.auth.GoogleAuthProvider();
document.querySelector('.btn').addEventListener('click', async e => {
  const result = await firebase.auth().signInWithPopup(provider);
  // This gives you a Google Access Token. You can use it to access the Google API.
  var token = result.credential.accessToken;
  // The signed-in user info.
  var user = result.user;
  console.log(user);
});

const inputText = document.querySelector('.inputText');
const submitText = document.querySelector('.submit');

inputText.addEventListener('keydown', async e => {

  if (e.key === 'Enter') {
    const todoList = document.querySelector('.todo-list');
    todoList.classList.add('todo-list--loading');

    const uid = firebase.auth().currentUser.uid;
    console.log(uid);
    await firebase.database().ref(`/users/${uid}/todos`).push({
      title: e.currentTarget.value,
      complete: false
    })
    e.target.value = "";
    refreshTodos();
  }
})
submitText.addEventListener('click', async e => {
  const todoList = document.querySelector('.todo-list');
  todoList.classList.add('todo-list--loading');

  const uid = firebase.auth().currentUser.uid;
  console.log(uid);
  await firebase.database().ref(`/users/${uid}/todos`).push({
    title: inputText.value,
    complete: false
  })
  inputText.value = "";
  refreshTodos();
});
async function refreshTodos() {

  const todoList = document.querySelector('.todo-list');

  const uid = firebase.auth().currentUser.uid;
  const snapshot = await firebase.database().ref(`/users/${uid}/todos`).once('value');

  // 컨텐츠 삭제하기
  // while (todoList.firstChild) {
  //   todoList.removeChild(todoList.firstChild);
  // };
  todoList.innerHTML = '';

  const todos = snapshot.val();
  for (let [todoId, todo] of Object.entries(todos)) {
    console.log(todoId, todo);
    const liEl = document.createElement('li');
    const btnEl = document.createElement('button');
    liEl.textContent = todo.title;
    liEl.classList.add('todo-list__item');
    btnEl.textContent = 'x';
    if (todo.complete === true) {
      liEl.classList.add('todo-list__item--complete');
    }
    liEl.addEventListener('click', async e => {
      await firebase.database().ref(`/users/${uid}/todos/${todoId}`).update({
        complete: !todo.complete
      });
      refreshTodos();
    })
    btnEl.addEventListener('click', async e => {
      await firebase.database().ref(`/users/${uid}/todos/${todoId}`).remove();
      refreshTodos();
    })
    todoList.appendChild(liEl);
    todoList.appendChild(btnEl);
  }
  todoList.classList.remove('todo-list--loading');
}


// 1. 처음 로그인
// 2. 로그인 후 다시 페이지를 열었을 때
// 3. 로그아웃 했을 때
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    refreshTodos();
  } else {

  }
});
