// This is Backend

import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";


//  SETUP: Creates an instance of the Stripe class and grants access to Stripe API methods (e.g., creating charges, payment intents, customers, subscriptions).
 // Setups and grants access to Stripe
const stripe = new Stripe (process.env.STRIPE_SECRET_KEY!);//  Reads your Stripe secret key from an environment variable (typically stored in .env.local)


export async function POST(req: NextRequest ) {
    // 1. Get the raw body — Stripe needs this to verify the request 
    // returns the raw, unparsed JSON "string" that Stripe sent in the HTTP request body
    const body = await req.text();//You need it as a (unparsed) raw string(json as a string without format)  because the signature verification works on the exact bytes Stripe sent. If you used req.json(), you'd lose the original formatting and the verification would fail

    const sig = req.headers.get("stripe-signature");//Stripe adds this header containing a cryptographic signature. You grab it so you can verify the request   
    //     Together, they're the security handshake that proves...
        // The request came from Stripe (not a hacker).
        // The payload hasn't been tampered with in transit.


    // If there's no existence of a signature, the request cannot be from Stripe → reject it
    if(!sig) {
        return NextResponse.json ({error: "There are No Signature"}, { status: 400});
    }

    //setup: Declare a variable to hold the verified Stripe event
    // this declares a let variable called "event" and it has a rule that it can only hold Stripe.Event
    // TypeScript type that represents any webhook event object Stripe can send to your server
    let event: Stripe.Event;
    
    try{
        //Zusing event variable that we declared 
        // 3. Verify the request actually came from Stripe (not someone faking it)
        // This uses the webhook secret (whsec_xxx) to check the signature after a  (checkout.session.completed or invoice.payment_succeeded)
        // if They all match then you get a pass
        // If verification fails, it throws an error.
        event = stripe.webhooks.constructEvent(
            //Stripe computes what the signature should be using the secret and the raw body
            body,
            // sig – The signature sent by Stripe in the Stripe-Signature header. It’s a cryptographic signature.
            sig,
            //process.env.STRIPE_WEBHOOK_SECRET! – Your webhook signing secret (different from your API secret key). You get this from the Stripe Dashboard when you set up a webhook endpoint.
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error:any) {
        // Signature invalid or tampered payload → reject the request
        console.error ("Webhook verification failed:", error.message );
        return NextResponse.json({error: error.message}, {status:400});
    }
    
    
    // 4. Handle the event — only care about successful payments
    // Stripe sends many event types; we only act on checkout.session.completed
    if(event.type === 'checkout.session.completed') {
        // It takes the object property from event.data, and assigns it to a variable named session, while telling TypeScript: "Trust me, this object is actually a Stripe Checkout Session object."
        const sessions = event.data.object as Stripe.Checkout.Session;

        // 5. Get the userId we attached in checkout/route.ts metadata
        // This is the Firebase UID we stored when creating the checkout session
        const userId = sessions.metadata?.userId;
        const plan = sessions.metadata?.plan; // Monthly or Yearly
        //sessions.metadata is an object where you can store your own key‑value pairs (strings only)
        // sessions.metadata"?." checks if it is null or undefined or is a string (if it is a number or anyhting then it converts to a string)



         // If there's no userId, we cannot update the correct user → error
        if(!userId){
            console.error('No useerId in session metadata');
            return NextResponse.json({error:'No userId'}, {status: 400});
        }

        try {
            // 6. Update Firestore — this makes the user premium
            // Find the user document by its ID and set subscription fields
            await updateDoc(doc(db, 'users', userId), {
                isSubscribed: true,
                subscription: {
                    status: 'active',
                    plan: plan ?? 'yearly',
                },
            });

            console.log(`User ${userId} is now subscribed to ${plan}`);
        } catch (error: any) {
            //If Firestore update fails, return a 500 error so Stripe retries later
            console.error("Firestore update failed:", error.message);
            return NextResponse.json({error: error.message}, {status:500});
        }
    }

  // 7. Tell Stripe we received the event
  // Stripe expects a 200 response to stop retrying the webhook
    return NextResponse.json({received: true});

}