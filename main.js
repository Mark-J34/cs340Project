function showform(dowhat) {
    /*
    * four DIVS: show, add, edit, delete
    * this function sets one visible the others not
    */
    if (dowhat == 'add'){
        document.getElementById('show').style.display = 'none';
        /*document.getElementById('add').style.display = 'block';*/
        document.getElementById('edit').style.display = 'none';
        /*document.getElementById('delete').style.display = 'none';*/
    }
    else if (dowhat == 'edit'){
        document.getElementById('show').style.display = 'none';
        /*document.getElementById('add').style.display = 'none';*/
        document.getElementById('edit').style.display = 'block';
        /*document.getElementById('delete').style.display = 'none';*/
    }
    else if (dowhat == 'delete'){
        document.getElementById('show').style.display = 'none';
        /*document.getElementById('add').style.display = 'none';*/
        document.getElementById('edit').style.display = 'none';
        /*document.getElementById('delete').style.display = 'none';*/
    }

    else { //by default display show

        document.getElementById('show').style.display = 'block';
        /*document.getElementById('add').style.display = 'none';*/
        document.getElementById('edit').style.display = 'none';
        /*document.getElementById('delete').style.display = 'none';*/
    }
}

function browse() {showform("browse")}
function addGame() {showform('add')}
function editGame() {showform('edit')}
function editDeveloper() {showform('edit')}
function editGameOwner(pid) {showform('edit')}
