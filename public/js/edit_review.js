function editReview(reviewID) {
    // Get the review data to be edited
    let data = {
        idReview: reviewID,

    };

    // Setup AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/edit-review", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Handle the AJAX response
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
        } else if (xhttp.readyState == 4) {
            console.log("There was an error with the edit.");
        }
    };

    // Send the request
    xhttp.send(JSON.stringify(data));
}
