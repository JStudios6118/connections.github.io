// https://connections-k01rg.kinsta.page/

let boards = null;

const colors = {
  "1.":'orangered',
  "2.":'yellowgreen',
  "3.":'cornflowerblue',
  "4.":'mediumpurple'
}

const difficulty_scale = {
  "1":"Easy",
  "2":"Normal",
  "3":"Hard",
  "4":"Harder",
  "5":"Insane"
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
  document.getElementById('puzzle_name').innerText = "Puzzle: "+boards[board_name]["name"]
  var html = ''
  for (var i = 0; i < 16; i++) {
    html += `<button class="button" id="unselected">${board[i]}</button>`
  }
  document.getElementById('grid').innerHTML = html
}

var amt_selected = 0

let direction = -1;

function random_puzzle(){
  
  let ids = Object.keys(boards)
  let random_id = ids[Math.floor(Math.random()*ids.length)]

  
  
  location.href = "?board="+random_id
}

function sortDivsByText(containerId) {
  const parentDiv = document.getElementById(containerId);
  const divElements = Array.from(parentDiv.children);
  divElements.sort((a, b) => a.innerText.localeCompare(b.innerText)); // Sorts in ascending order if mode is false
  parentDiv.innerHTML = "";
  divElements.forEach((div) => parentDiv.appendChild(div));
}

function message(id,delay=1){
  let msgBox = document.getElementById('message')
  if (id===0){
    msgBox.innerText = "One Away!";
  } else if (id === 1){
    msgBox.innerText = "Congratulations! You Win!"
  } else if (id === 2){
    msgBox.innerText = "Wrong :("
  }
  msgBox.style.visibility = 'visible'
  setTimeout(hide_message, delay*1000);
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
    let most_correct = 0
    let final_key = null
    for (let key in solution) {
      let amt_correct = 0
      let temp_solution = solution[key].sort()
      for (i=0;i<4;i++){
        if (submitted.includes(temp_solution[i])) {
          amt_correct++
        }
      }
      if (amt_correct > most_correct){
        most_correct = amt_correct
        final_key = key
      }
    }
    if (most_correct===4) {
      buttons_selected.forEach(button => {
        button.remove()
      })
      let color = colors[final_key.slice(0,2)]
      document.getElementById('correct').innerHTML+=`<div style="background-color:${color}"><h3>${final_key}</h3><p>${solution[final_key]}</p></div>`
      amt_selected = 0
      found++
      can_found = true
    } else if (most_correct===3){
      message(0)
    } else if (most_correct < 3) {
      message(2,1)
    }
    index++
    if (!can_found){
      mistakes++
      document.getElementById('mistakes').innerText = `${mistakes}/4`
      if (mistakes === 4){
        alert("Oh no! You had 4 mistakes :(")
        location.reload()
      }
    }
  }
  if (found === 4){
    message(1,3)
  }
}

function date_sort(){
  let date_filter = document.getElementById("sort_by_date")
  if (direction == 1){
    direction = -1
    date_filter.innerText = "Oldest > Newest"
  } else {
    direction = 1
    date_filter.innerText = "Newest > Oldest"
  }
  console.log(`Num: ${direction}`)
  SortData()
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
  } else if (event.target && event.target.className === "sort") {
    if (event.target.id === 'sort_by_date'){
      date_sort()
    }
  } else if (event.target && event.target.id === "random"){
    random_puzzle()
  }
});

function load_data(){
  const request = new Request("boards.json");
  fetch(request, {cache:"no-cache"})
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
    var last_item = Object.keys(boards)[Object.keys(boards).length - 1]
    document.getElementById("newest_link").href = "?board="+last_item
    document.getElementById("newest_link").innerText = boards[last_item]["name"] + " by " + boards[last_item]["author"]
    
    
    document.getElementById('game').style.display = 'none';
    for (key in boards){
      console.log(key)
      document.getElementById('games').innerHTML += `<div class='game_option' data-id=${key} data-rating=${boards[key]["rating"]}><a href="?board=${key}">${boards[key]["name"]}</a><p>- By ${boards[key]["author"]}</p><br><p id='difficulty'>Difficulty: ${difficulty_scale[boards[key]["rating"].toString()]}</p></div>`
    }
    date_sort()
  }
}

window.onload = load_data

//make_grid()

function comparator(a, b) { 
  a = Number(a.dataset.id)
  b = Number(b.dataset.id)
  if (a < b) 
      return 1 * direction;
  if (a > b) 
      return -1 * direction; 
  return 0; 
} 

// Function to sort Data 
function SortData() {
  var subjects = 
      document.querySelectorAll("[data-id]");

  var subjectsArray = Array.from(subjects); 

  let sorted = subjectsArray.sort(comparator); 
  sorted.forEach(e => 
      document.querySelector("#games"). 
          appendChild(e)); 
} 