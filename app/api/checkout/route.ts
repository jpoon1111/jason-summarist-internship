import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe with your secret key from .env.local
// Load Stripe with your secret key (never exposed to the browser)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);


export async function POST(req:NextRequest) {

    // this run a check to see if these are falsy first
    //if STRIPE_SECRET_KEY is falsy then return an error
    if(!process.env.STRIPE_SECRET_KEY){
        return NextResponse.json({error: "Stripe secret key missing"}, {status: 500});
    }
    // same as above if NEXT_PUBLIC_APP_URL then return an error
    if(!process.env.NEXT_PUBLIC_APP_URL) {
        return NextResponse.json({error: "App URL is missing"}, {status: 500});
    }


    try{
    // 1. Get priceId and userId from the request body
    // priceId  = which plan they picked (yearly or monthly) — comes from choose-plan/page.tsx
    // userId   = Firebase uid — so you can find them in Firestore later in the webhook
    // Read the data sent from the frontend (choose-plan page)
    // priceId = which product or plan from stripe the user picked (e.g., monthly or yearly)
    // userId = the user's Firebase UID so we know who is paying
        const { priceId, userId } = await req.json();
            
        if(!priceId){
            return NextResponse.json({error: "priceId is required"}, {status: 400});
        }
        if(!userId){
            return NextResponse.json({error: "userId is required"}, {status:400});
        }
        
        //2. I am createing a check session with Stripe
        // Ask Stripe to create a checkout session – this is the actual "purchase" process
        // this takes an object as a parameter and then returns it
        //  and this will return a session.url 
        const session = await stripe.checkout.sessions.create({
            // Only accept credit/debit card payments (no PayPal, etc.)
            payment_method_types: ['card'],
            // mode set to Subscription means the customer will be billed repeatedly,
            // as opposed to a one-time "payment" mode.
            mode: 'subscription',//  "subscription" because it's recurring not one-time
            line_items: [
                {
                    price:priceId, // this gets the price object (IE price_abc123)  from your stripe dashboard that holds the details (cost amount, currency type, reccuring intervals like monthly, yearly or one-time)
                    quantity: 1, // This specify that you can only have 1 of these per account. Only one subscription per line item
                },
            ],
            // 3. Pass userId as metadata so the webhook can read it later
            // This is the bridge between Stripe and Firebase
            // This Attach your internal user ID to the Stripe session.
            // Stripe will store this and include it in webhook events (like payment success).
            // This allows your server to know which user just paid.
            // This basically Store the user's Firebase UID inside the session.
            // Stripe will send this back in webhooks so we can update the correct user.
            metadata: {
                // this is sent to Stripe so that Stripe knows which user request a plan
                userId: userId,
                // this checks if the current user  sellected monthy if not then yearly plan
                plan: priceId === process.env.NEXT_PUBLIC_MONTHLY_PRICE_MONTHLY? "monthly" : "yearly",
            },
            //4. where to send the user after payment
            // Where to send the user after successful payment
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/for-you?success=true`,
            // Where to send the user if they cancel before paying
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/choose-plan`,
        });
        // Return the checkout page URL to the frontend,
        // so the frontend can redirect the user to Stripe's hosted payment page.
        // this is what is returned when you call stripe.checkout.sessions.create()
        // Send back a JSON response containing the Stripe Checkout page URL.
        // this Serializes the object to JSON: { "url": "https://checkout.stripe.com/..." }
        // Sets Content-Type: application/json and returns a 200 status by default.
        // The frontend (e.g., your choose-plan page) receives this object: { url: "https://checkout.stripe.com/..." }
        // basically it will show the final details for the checkout page before purchase and this is where user can click pay
        // this is what is re
        return NextResponse.json({url: session.url});
    }catch(error:any){
        console.error("Stripe checkout error: ", error);
        return NextResponse.json(
            {error: error.message || "Internal server error"},
            {status:  500}
        );
    }
}