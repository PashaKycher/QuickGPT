import express from 'express'
import cors from 'cors'
import "dotenv/config"
import connectDB from './configs/db.js'
import userRouter from './routes/userRoutes.js'
import chatRouter from './routes/chatRoutes.js'
import messageRouter from './routes/messageRouter.js'
import creditRouter from './routes/creditRoutes.js'
import { stripeWebhooks } from './controllers/webhooksController.js'

const app = express()

// Connect to MongoDB
await connectDB()

// stripe webhook
app.post('/api/stripe', express.raw({ type: 'application/json' }), stripeWebhooks)

//  Middleware
app.use(cors())
app.use(express.json())

// Routes
app.get('/', (req, res) => { res.send('Hello World!') })
// ------
app.use('/api/user', userRouter)
app.use('/api/chat', chatRouter)
app.use('/api/message', messageRouter)
app.use('/api/credit', creditRouter)

// Start the server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
