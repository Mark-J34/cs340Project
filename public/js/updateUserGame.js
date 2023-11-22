let updateUsergameId = document.getElementById('update-user-game');

updateUsergameId.addEventListener("submit", function (e) {
    e.preventDefault();

    let idGameIdUser = document.getElementById("userGameId");
    let idGameId = document.getElementById("gameId");

    // Split the userGameId value into oldGameId and idUser
    let [oldGameId, idUser] = idGameIdUser.value.split('-');
    let newGameId = idGameId.value;


    // Prepare the data object for AJAX request
    let data = {
        gameId: oldGameId,
        userId: idUser,
        newgameId: newGameId
    };

    // AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-user-gameId", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Update the row in the table based on the response
            updateRow(xhttp.response, oldGameId);
        } else if (xhttp.readyState == 4) {
            console.log("There was an error with the input.");
        }
    };

    xhttp.send(JSON.stringify(data));
});

function updateRow(data, oldGameId) {
    let parsedData = JSON.parse(data);
    console.log(parsedData[0].gameId);
    console.log(parsedData[0].userId);
    let table = document.getElementById("user-game-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        if (row.getAttribute("data-value1") == oldGameId && row.getAttribute("data-value2") == parsedData[0].userId) {
            console.log("found match")
            let cells = row.getElementsByTagName("td");
            cells[0].innerHTML = `${parsedData[0].gameId}${parsedData[0].userId}`; 
            cells[1].innerHTML = parsedData[0].gameTitle;
            cells[2].innerHTML = parsedData[0].userName;
            
            break; 
        }
    }
}

