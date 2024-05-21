// https://connections-k01rg.kinsta.page/

let boards = null;

const colors = {
  "1.":'orangered',
  "2.":'yellowgreen',
  "3.":'cornflowerblue',
  "4.":'mediumpurple'
}

let board = null
let board_name = null
let solution = null

let found = 0

let mistakes = 0

function new_game(board_id) {
  board = []
  board_name = board_id
  solution = boards[board_id]["board"]
  let temp_board = boards[board_id]["board"]
  for (let key in temp_board) {
    for (i = 0; i < 4; i++) {
      board.push(temp_board[key][i])
    }
  }
  board = shuffle(board)
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function make_grid(board_data) {
  document.getElementById('author').innerText = "Author: "+boards[board_name]["author"]
  var html = ''
  for (var i = 0; i < 16; i++) {
    html += `<button class="button" id="unselected">${board[i]}</button>`
  }
  document.getElementById('grid').innerHTML = html
}

var amt_selected = 0

function sort_correct_slots(){
  
}

function sortDivsByText(containerId) {
  const parentDiv = document.getElementById(containerId);
  const divElements = Array.from(parentDiv.children);
  divElements.sort((a, b) => a.innerText.localeCompare(b.innerText));
  parentDiv.innerHTML = "";
  divElements.forEach((div) => parentDiv.appendChild(div));
}

function message(id){
  let msgBox = document.getElementById('message')
  if (id===0){
    msgBox.innerText = "One Away!";
    msgBox.style.visibility = 'visible'
  }
  setTimeout(hide_message, 1000);
}

function hide_message(){
  document.getElementById("message").style.visibility = 'hidden'
}

function validate() {
  let submitted = []
  if (amt_selected == 4) {
    let buttons_selected = document.querySelectorAll("button#selected")
    for (let i = 0; i < buttons_selected.length; i++) {
      submitted.push(buttons_selected[i].innerText)
    }
    submitted = submitted.sort()
    let can_found = false
    let index = 0
    for (let key in solution) {
      let amt_correct = 0
      let temp_solution = solution[key].sort()
      for (i=0;i<4;i++){
        if (submitted.includes(temp_solution[i])) {
          amt_correct++
        }
      }
      if (amt_correct===4) {
        buttons_selected.forEach(button => {
          button.remove()
        })
        let color = colors[key.slice(0,2)]
        document.getElementById('correct').innerHTML+=`<div style="background-color:${color}"><h3>${key}</h3><p>${solution[key]}</p></div>`
        amt_selected = 0
        found++
        sortDivsByText("correct");
        can_found = true
        break
      } else if (amt_correct===3){
        message(0)
      }
      index++
    }
    if (!can_found){
      mistakes++
      document.getElementById('mistakes').innerText = `${mistakes}/4`
      if (mistakes === 4){
        alert("Oh no! You had 4 mistakes :(")
        location.reload()
      }
    }
  }
  if (found == 4){
    alert("You Win!")
  }
}

document.addEventListener("click", function(event) {
  if (event.target && event.target.className === "button") {
    if (event.target.id === 'selected') {
      amt_selected--
      event.target.id = 'unselected';
    } else {
      if (amt_selected < 4) {
        event.target.id = "selected";
        amt_selected++
      }
    }
  } else if (event.target && event.target.className === "submit") {
    validate()
  }
});

function load_data(){
  const request = new Request("boards.json");
  fetch(request)
    .then((response) => response.text())
    .then((text) => {
    boards = JSON.parse(text)
    check_url()
  });
}

function check_url(){
  
  const urlParams = new URLSearchParams(window.location.search);
  const board_id = urlParams.get('board');

  // Where I need to get the parent
  if (board_id != null) {
    document.getElementById('browse').style.display = 'none';
    if (board_id in boards){
      new_game(board_id)
      make_grid()
    } else {
      window.location.href='/'
    }
  } else {
    
    document.getElementById('game').style.display = 'none';
    for (key in boards){
      console.log(key)
      document.getElementById('games').innerHTML += `<a href="?board=${key}">${boards[key]["name"]}</a><br>`
    }
  }
}

window.onload = load_data

//make_grid()