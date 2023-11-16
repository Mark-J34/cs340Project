function deleteUserGame(userId, gameId) {
    // Put our data we want to send in a JavaScript object
    let data = {
        idUser: userId,
        idGame: gameId
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-user-game", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            // If deletion was successful, remove the corresponding row from the table
            deleteRow(userId, gameId);
        } else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.");
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}

function deleteRow(userId, gameId) {
    let table = document.getElementById("user-games-table"); // Replace with your actual table ID
    for (let i = 0, row; row = table.rows[i]; i++) {
        // Check if this row's data matches both userId and gameId
        if (row.getAttribute("data-userId") == userId && row.getAttribute("data-gameId") == gameId) {
            table.deleteRow(i);
            break;
        }
    }
}