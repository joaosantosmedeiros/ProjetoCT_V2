const express = require('express')
const exphbs = require('express-handlebars')
const flash = require('express-flash')
const session = require('express-session')
const FileStore = require('session-file-store')(session)

const User = require('./models/User')
const Order = require('./models/Order')
const Product = require('./models/Product')

const app = express()
const conn = require('./db/conn')

// Pasta public para arquivos estáticos
app.use(express.static('public'))

// Template engine
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

// Receber resposta no body
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Sessões
app.use(
    session({
        name: 'session',
        secret: 'chave_codificadora',
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: function () { },
            path: require('path').join(require('os').tmpdir(), 'sessions'),
        }),
        cookie: {
            secure: false,
            maxAge: 1000 * 60 * 60 * 24,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
            httpOnly: true
        }
    })
)

// Mensagens flash
app.use(flash())

// Coloca a sessao na resposta
app.use((req, res, next) => {
    if (req.session.userid || req.session.adminid) {
        res.locals.session = req.session
    }

    next()
})

// Import de rotas
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const orderRoutes = require('./routes/orderRoutes')
const productRoutes = require('./routes/productRoutes')

app.get('/404', (req, res) => {
    res.render('errors/404')
})

// Utilização de rotas
app.use('/', authRoutes)
app.use('/users', userRoutes)
app.use('/products', productRoutes)
app.use('/orders', orderRoutes)

// Realiza conexão com o BD e inicia o APP
conn.sync({ force: false })
    .then(() => {
        app.listen(3000, () => { console.log('Servidor iniciado em http://localhost:3000') })
    })
    .catch(err => console.log(err))