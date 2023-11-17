module.exports = function(app, passport, db) {

    const {ObjectId} = require('mongodb')

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) { // checks to see if logged in or send them back to homepage if not logged in 

      // console.log('*****************************************************************')
      // console.log('user (get):')
      // console.log(req.user)
      // console.log('*****************************************************************')

      db.collection('tasks').find().toArray((err, result) => {
          if (err) return console.log(err)
          // console.log('------------------------------------------------------------')
          // console.log('result (get) :')
          // console.log(result)
          // console.log('------------------------------------------------------------')
          res.render('profile.ejs', {
            user : req.user,//showcases there usr name when logged in
            tasks: result
            
          })
      })
      
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout(() => {
          console.log('User has logged out!')
        });
        res.redirect('/');
    });

// message board routes ===============================================================

    app.post('/task', (req, res) => {

      // console.log("req.body.id (POST) : ")
      // console.log(req.body)
      // console.log(req.body.progress)
      db.collection('tasks').save(
        {
          progress: req.body.progress,
          creatorId: req.body.creatorId,
          task: req.body.task
          
       }, 
      (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/profile')
      })
    })

    app.put('/tasks', (req, res) => {

    
      console.log(" (put method) : ")
      console.log(req.body)
      db.collection('tasks')
      .findOneAndUpdate(
        {_id: ObjectId(req.body._id)}, 
        {
          $set: {
            progress:req.body.progress,
          }
        }, 
        {
          sort: {_id: -1},
          upsert: true
        }, 
        (err, result) => {
          if (err) return res.send(err)
          res.send(result)
      })
    })

    app.delete('/tasks', (req, res) => {
      console.log("delete method")
      console.log("req.body :")
      console.log(req.body)
      db.collection('tasks').findOneAndDelete(
        {_id: ObjectId(req.body._id)}, 
        (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })

    // app.delete('/task', (req, res) => {
    //   console.log("delete method" , req.body)
    //   db.collection('tasks').findOneAndDelete({_id: ObjectId(req.body.id)}, (err, result) => {
    //     if (err) return res.send(500, err)
    //     res.send('Message deleted!')
    //   })
    // })



// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {// checks to see if user is logged in
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
