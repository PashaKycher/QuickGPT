import Stripe from "stripe"
import Transaction from "../models/Transaction.js"
import User from "../models/User.js"

export const stripeWebhooks = async (req, res) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const sig = req.headers['stripe-signature']
    let event

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (err) {
        console.log(err)
        return res.status(400).send(`Webhook Error: ${err.message}`)
    }

    try {
        switch (event.type) {
            case 'payment_intent.succeeded':{
                const paymentIntent = event.data.object
                const sessionList = await stripe.checkout.sessions.list({
                    payment_intent: paymentIntent.id,
                })

                const session = sessionList.data[0]
                const { transactionId, appId } = session.metadata

                if (appId === 'quickgpt') {
                    // update transaction
                    const transaction = await Transaction.findOne({ _id: transactionId, isPaid: false })
                    transaction.isPaid = true
                    await transaction.save()

                    // update user credits
                    await User.updeteOne({ _id: transaction.userId }, { $inc: { credits: transaction.credits } })
                    
                } else {
                    return res.json({ received: true, message: "Ignored event: Invalid app" })
                }
                break;
            }
            default:
                console.log(`Unhandled event type: ${event.type}`);
                break;
        }
    } catch (error) {
        console.error("Webhook Error:", error.message || error)
        return res.status(500).send('Internal Server Error')
    }
}