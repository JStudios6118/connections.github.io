const boards = {
  "1": {
    "name":"New York Times Daily",
    "author":"NYTimes",
    "board": {
      "1. Sorcerer's Output": ["Charm", "Hex", "Spell", "Magic"],
      "2. Classic Superhero Wear": ["Cape", "Mask", "Tights", "Underwear"],
      "3. One Being Manipulated": ["Instrument", "Pawn", "Tool", "Puppet"],
      "4. Action Movie Directors": ["Bay", "Carpenter", "Scott", "Woo"]
    }
  },
  "2": {
    "name":"Orignal #1",
    "author":"Josh Carlson",
    "board":{
      "1. Multimedia": ["Text","Image","Audio","Video"],
      "2. To Question": ["Inquire","Query","Poll","Interrogate"],
      "3. Antonyms of Move": ["Remain","Stay","Rest","Idle"],
      "4. Harry _____": ["Styles","Truman","Hamlin","Hill"]
    }
  },
  "3": {
    "name":"Orignal #2",
    "author":"Josh Carlson",
    "board":{
      "2. ____Boat": ["Sail","Speed","Banana","Fishing"],
      "1. To Mention": ["Comment","Notice","Reference","Tribute"],
      "4. Head Of a": ["House","Country","Division","River"],
      "3. Increase": ["Multiply","Boost","Raise","Upgrade"]
    }
  }
  
}

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
  console.log(temp_board)
  for (let key in temp_board) {
    for (i = 0; i < 4; i++) {
      board.push(temp_board[key][i])
    }
  }
  board = shuffle(board)
  console.log(board)
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
      if (JSON.stringify(submitted) === JSON.stringify(solution[key].sort())) {
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

window.onload = check_url

//make_grid()