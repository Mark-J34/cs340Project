/*
    Express Application Setup
*/
var express = require('express');
var app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Port configuration
const PORT = 8102;

// Database configuration
var db = require('./database/db-connector');

// Handlebars setup
const { engine } = require('express-handlebars');
app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');

/*
    Routes Configuration
*/

// Routes for games page
app.get('/', function(req, res) {
    let gamesQuery = `SELECT games.idGame, games.title, games.releaseDate, games.genre, developers.name AS developerName 
                      FROM games 
                      JOIN developers ON games.idDeveloper = developers.idDeveloper;`;

    let developersQuery = 'SELECT * FROM developers';

    db.pool.query(gamesQuery, function(error, games) {
        if (error) {
            console.error(error);
            return res.sendStatus(500);
        }

        db.pool.query(developersQuery, (error, developers) => {
            if (error) {
                console.error(error);
                return res.sendStatus(500);
            }

            res.render('index', { data: games, developers: developers });
        });
    });
});

app.post('/add-game', function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Construct your query
    let query = `INSERT INTO games (title, releaseDate, genre, idDeveloper) VALUES ('${data['input-title']}', '${data['input-date']}', '${data['input-genre']}', '${data['input-developer']}')`;

    // Run the query on your database
    db.pool.query(query, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/');
        }
    });
});


app.delete('/delete-game', function(req, res) {
    let gameID = parseInt(req.body.idGame);
    let deleteGameQuery = `DELETE FROM games WHERE idGame = ?`;

    if (isNaN(gameID)) {
        console.log("Invalid gameID: ", req.body.idGame);
        return res.status(400).send("Invalid game ID");
    }
  
    db.pool.query(deleteGameQuery, [gameID], function(error) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    });
});

// Routes for review page
app.get('/reviews', function(req, res)  {
    let query1 = `SELECT reviews.idReview AS reviewId, users.userName As name, games.title AS title, reviews.rating AS rating, reviews.comment AS comment
                        FROM reviews
                        JOIN games ON reviews.idGame = games.idGame
                        JOIN users On reviews.idUser = users.idUser;`;

    let query2 = 'SELECT idGame, title FROM games';

    let query3 = 'SELECT idUser, userName AS name FROM users'

    db.pool.query(query1, function(err, tableData) {
        if (err) {
            console.error(err);
            return res.sendStatus(500);
        }
        
        db.pool.query(query2, function(err, games){
            if (err) {
                console.error(err);
                return res.sendStatus(500);
            }
            
            db.pool.query(query3, function(err, userInfo){
                if (err) {
                    console.error(err);
                    return res.sendStatus(500);
                }
                
                res.render('reviews', { dataTable: tableData, gameData: games, users: userInfo});
            })
        })
    })
});

app.post('/add-review', function(req, res) {
    let data = req.body

    let query = `INSERT INTO reviews (idGame, idUser, rating, comment) VALUES ('${data['input-game']}', '${data['input-user']}', '${data['input-rating']}', '${data['input-comment']}')`;

    db.pool.query(query, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/reviews');
        }
    });
});

app.delete('/delete-review', function(req, res) {
    let reviewId = parseInt(req.body.idReview);
    let query = 'DELETE FROM reviews WHERE idReview = ?';

    db.pool.query(query, [reviewId], function(err) {
        if (err) {
            console.log(err);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    });
});

// Routes for stats page 
app.get('/stats', function(req, res) {
    let userGamesQuery = `SELECT games.idGame AS gameId, users.idUser AS userId, users.userName AS userName, games.title AS gameTitle 
                          FROM gameHasUsers 
                          JOIN users ON gameHasUsers.idUser = users.idUser
                          JOIN games ON gameHasUsers.idGame = games.idGame`;

    let usersQuery = `SELECT idUser, userName FROM users`;
    let gamesQuery = `SELECT idGame, title FROM games`;

    db.pool.query(userGamesQuery, function(error, userGamesResults) {
        if (error) {
            console.error(error);
            return res.sendStatus(500);
        }

        db.pool.query(usersQuery, function(error, usersResults) {
            if (error) {
                console.error(error);
                return res.sendStatus(500);
            }

            db.pool.query(gamesQuery, function(error, gamesResults) {
                if (error) {
                    console.error(error);
                    return res.sendStatus(500);
                }

                res.render('stats', { userGames: userGamesResults, users: usersResults, games: gamesResults });
            });
        });
    });
});


app.put('/put-user-gameId', function(req, res, next) {
    let data = req.body;
    let idGame = parseInt(data.gameId); 
    let idUser = parseInt(data.userId);
    let newGameId = parseInt(data.newgameId);

    let updateUserGameQuery = `UPDATE gameHasUsers SET idGame = ? WHERE idUser = ? and idGame = ?`;
    let tableData = `SELECT games.idGame AS gameId, users.idUser AS userId,  games.title AS gameTitle, users.userName AS userName 
                    FROM gameHasUsers 
                    JOIN users ON gameHasUsers.idUser = users.idUser
                    JOIN games ON gameHasUsers.idGame = games.idGame
                    WHERE games.idGame = ? AND users.idUser = ?;`;

    db.pool.query(updateUserGameQuery, [newGameId, idUser, idGame], function(error) {
        if (error) {
            console.log(error);
            res.status(400).send('Error updating user-game relationship');
        }  
        else {
            // Run the second query
            db.pool.query(tableData, [newGameId, idUser], function(error, rows, fields) {
    
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            }); 
        }
    });
});


app.post('/add-user-game', function(req, res) {
    let insertUserGameQuery = 'INSERT INTO gameHasUsers (idGame, idUser) VALUES (?, ?)';
    let { userId, gameId } = req.body;

    db.pool.query(insertUserGameQuery, [gameId, userId], function(error) {
        if (error) {
            console.error(error);
            return res.sendStatus(500);
        }
        res.redirect('/stats'); 
    });
});


app.delete('/delete-user-game', function(req, res) {
    let deleteUserGameQuery = `DELETE FROM gameHasUsers WHERE idUser = ? AND idGame = ?`;
    let { idUser, idGame } = req.body;

    db.pool.query(deleteUserGameQuery, [idUser, idGame], function(error) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204); 
        }
    });
});

 // Developers section 
 app.get('/developers', function(req, res) {
    let query1 = 'Select * from developers';

    db.pool.query(query1, function(error, developerInfo){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } 
        res.render('developers', {data: developerInfo});
    })
 });

 app.post('/add-developer', function(req, res) {
    let data = req.body;

    let query = `INSERT INTO developers (name, foundedDate, country) VALUES ('${data['name']}', '${data['dateCreated']}', '${data['country']}')`;

    db.pool.query(query, function(error, rows) {
        if (error) {
            console.log(error)
        } 
        res.redirect('/developers')
    })
});

app.delete('/delete-developer', function(req, res) {
    let developerId = parseInt(req.body.idDeveloper);
    let query = 'DELETE FROM developers WHERE idDeveloper = ?';

    db.pool.query(query, [developerId], function(error) {
        if (error) {
            console.log(error);
        } else {
            res.sendStatus(204);
        }
    })
});

// Users section
app.get('/users', function(req, res) {
    let query1 = 'SELECT * FROM users';

    db.pool.query(query1, function(err, users) {
        if (err) {
            console.error(err);
            return res.sendStatus(500);
        }
        res.render('users', { userData: users });
    })
})

app.post('/add-user', function(req, res) {
    let data = req.body

    let query = `INSERT INTO users (userName, email, registrationDate) VALUES ('${data['input-name']}', '${data['input-email']}', '${data['input-registration']}')`;

    db.pool.query(query, function(error, rows) {
        if (error) {
            console.log(error)
        } 
        res.redirect('/users')
    })
});
    
app.delete('/delete-user', function(req, res) {
    let userId = parseInt(req.body.idUser);
    console.log(userId)
    let query = 'DELETE FROM users WHERE idUser = ?';

    db.pool.query(query, [userId], function(err) {
        if (err) {
            console.log(err);
            res.sendStatus(400);
        } else {
            res.sendStatus(204); 
        }
    })
})
   
/*
    Start Express Server
*/
app.listen(PORT, function() {
    console.log(`Express started on http://localhost:${PORT}; press Ctrl-C to terminate.`);
});
