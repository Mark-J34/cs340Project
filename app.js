/*
    SETUP
*/

// Express
var express = require('express');
var app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
PORT = 3003;

// Database
var db = require('./database/db-connector');

// Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

/*
    ROUTES
*/
app.get('/', function(req, res)
    {  
        let query1 = `SELECT games.idGame, games.title, games.releaseDate, games.genre, developers.name AS developerName 
        FROM games 
        INNER JOIN developers ON games.idDeveloper = developers.idDeveloper;`; 
        
        let query2 = 'SELECT * From developers'

        db.pool.query(query1, function(error, rows, fields){    

            let games = rows;

            db.pool.query(query2, (error, rows, fields) => {

                let developers = rows;
                return res.render('index', {data: games, developers: developers});
            })
                  
        })                                                      
    }); 

    app.get('/reviews', (req, res) => {
        let query = `SELECT reviews.idReview, games.title AS gameTitle, developers.name AS developerName, reviews.comment
             FROM reviews
             JOIN games ON reviews.idGame = games.idGame
             JOIN developers ON games.idDeveloper = developers.idDeveloper;`;
    
        db.pool.query(query, (error, rows, fields) => {
            if (error) {
                console.error(error);
                res.sendStatus(500);
            } else {
                let reviews = rows;
                res.render('reviews', { reviews: reviews });
            }
        });
    });
    
    
    // Route for "Games" link
    app.get('/games', (req, res) => {
    
    });
    

app.post('/add-game', function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Construct your query
    let query = `INSERT INTO games (title, releaseDate, genre, idDeveloper) VALUES ('${data['input-title']}', '${data['input-date']}', '${data['input-genre']}', '${data['input-developer']}')`;

    // Run the query on your database
    db.pool.query(query, function(error, rows, fields) {
        // Check for an error
        if (error) {
            // Log the error and send a bad request response
            console.log(error);
            res.sendStatus(400);
        } else {
            // Redirect to the root route (or another route as needed)
            res.redirect('/');
        }
    });
});

app.delete('/delete-game/', function(req,res,next){
    let data = req.body;
    let gameID = parseInt(data.idGame);
    let delete_game = `DELETE FROM games WHERE idGame = ?`;
  
          // Run the 1st query
          db.pool.query(delete_game, [gameID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              } else {

                res.redirect('/');
              }
  
              
  })});


  app.get('/stats', function(req, res) {
    // Query to fetch user-game relationships
    let query1 = `SELECT users.userName AS userName, games.title AS gameTitle 
                                FROM gameHasUsers 
                                JOIN users ON gameHasUsers.idUser = users.idUser
                                JOIN games ON gameHasUsers.idGame = games.idGame`;

    // Query to fetch all users
    let query2 = `SELECT idUser, userName FROM users`;

    // Query to fetch all games
    let query3 = `SELECT idGame, title FROM games`;

    // Execute the first query
    db.pool.query(query1, function(error, userGamesResults) {
        if (error) {
            console.error(error);
            return res.sendStatus(500);
        }

        // Execute the second query
        db.pool.query(query2, function(error, usersResults) {
            if (error) {
                console.error(error);
                return res.sendStatus(500);
            }

            // Execute the third query
            db.pool.query(query3, function(error, gamesResults) {
                if (error) {
                    console.error(error);
                    return res.sendStatus(500);
                }

                // Render the stats view with all necessary data
                res.render('stats', { 
                    userGames: userGamesResults,
                    users: usersResults,
                    games: gamesResults 
                });
            });
        });
    });
});


app.post('/add-user-game', function(req, res) {
    let userId = req.body.userId;
    let gameId = req.body.gameId;
    let insertQuery = 'INSERT INTO gameHasUsers (idUser, idGame) VALUES (?, ?)';

    db.pool.query(insertQuery, [userId, gameId], function(error, results) {
        if (error) {
            console.error(error);
            return res.sendStatus(500);
        }
        res.redirect('/user-games'); 
    });
});
/*
    LISTENER
*/
app.listen(PORT, function(){
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});