import Transaction from "../models/Transaction.js"
import Stripe from "stripe"

 
// dummy plans
const plans = [
    {
        _id: "basic",
        name: "Basic",
        price: 1,
        credits: 100,
        features: ['100 text generations', '50 image generations', 'Standard support', 'Access to basic models']
    },
    {
        _id: "pro",
        name: "Pro",
        price: 5,
        credits: 500,
        features: ['500 text generations', '200 image generations', 'Priority support', 'Access to pro models', 'Faster response time']
    },
    {
        _id: "premium",
        name: "Premium",
        price: 10,
        credits: 1000,
        features: ['1000 text generations', '500 image generations', '24/7 VIP support', 'Access to premium models', 'Dedicated account manager']
    }
]

// stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// get all plans
export const getAllPlans = async(req, res) => {
    try {
        res.status(200).json({
            success: true,
            error: false,
            message: "Plans fetched successfully",
            plans
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: true,
            message: error.message
        })
    }
}

// purchase plan
export const purchasePlan = async (req, res) => {
    try {
        const {planId} = req.body
        const userId = req.user._id

        const plan = plans.find(plan => plan._id === planId)

        if(!plan) {
            return res.status(400).json({
                success: false,
                error: true,
                message: "Plan does not exist"
            })
        }

        // create transaction
        const transaction = await Transaction.create({
            userId: userId,
            planId: plan._id,
            amount: plan.price,
            credits: plan.credits,
            isPaid: false
        })

        
        // create checkout session - stripe
        const {origin} = req.headers
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        unit_amount: plan.price * 100,
                        product_data: {
                            name: plan.name
                        },         
                    },
                    quantity: 1
                }
            ],
            mode: "payment",
            success_url: `${origin}/loading`,
            cancel_url: `${origin}`,
            metadata:{ transactionId: transaction._id.toString(), abbId: 'quickgpt' },
            expires_at: Math.floor(Date.now() / 1000) + 30 * 60
        })

        res.status(200).json({
            success: true,
            error: false,
            message: "Plan purchased successfully",
            url: session.url
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: true,
            message: error.message
        })
    }
}