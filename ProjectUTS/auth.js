const bcrypt = require('bcrypt');
const session = require('express-session')

const salt = 15;

function initAuth(app, db){
   app.use(session({
        secret: 'sangat rahasia',
        resave: false,
        saveUninitialized: true,
        cookie: function (req) {
            const match = req.url.match(/^\/([^/]+)/);
            return {
                path: match ? '/' + match[1] : '/',
                httpOnly: true,
                secure: req.secure || false,
                maxAge: 60000,
            };
        },
    }))

    app.post('/api/register', async (req, res) => {
        if (req.session.userData) {
            res.redirect('/index');
            return;
        }

        const {email, username, password} = req.body;

        const hashedPass = await bcrypt.hash(password, salt);

        db.run(
            'INSERT INTO user (email, password, role, username) VALUES (?, ?, ?, ?)',
            [email, hashedPass, 'user', username],
            function (err) {
                if (err) return res.status(500).json({error: err.message});

                res.redirect('/login');
            }
        );


    });

    app.post('/api/login', (req, res) => {
        if(req.session.userData){
            res.redirect('/index');
            return;
        }

        const { email, password } = req.body;

        db.get('SELECT * FROM user WHERE email = ? LIMIT 1', [email], async (err, user) => {
            if (err) return res.status(500).json({ error: err.message });

            if(!user){
                res.redirect('/login');
                return;
            }

            const result = await bcrypt.compare(password, user.password);
            if(result){
                req.session.userData = {email: user.email, username: user.username};
                res.redirect('/index');
            }
        });
    });

    app.post('/api/logout', (req, res) => {
        req.session.userData = null;
        res.redirect('/login');
    })

    app.get('/api/session', (req, res) => {
        res.json(req.session.userData || null);
    })
}

module.exports = { initAuth };