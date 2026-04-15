import { db } from "./firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { setSubscribed, setSubscription } from "./slices/authSlice";
import { store } from "./store";




    export interface SubscriptionData {//this is static.Structure/Interface: Used to define the Shape. It’s the "Law." or The "Blueprint" Analogy or 
        plan: string;
        startDate: string;
        endDate: string;
        status: 'active' | 'expired' | 'cancelled';
    }


    //calculates 1 year in milliseconds
    const yearinMs:number = 365 * 24 * 60 * 60 * 1000;


    // since you are 
    export class subscriptionService{
        
        //This is an asyc Active Subscription (call this after payment only)
        //[TODO] set up payment
        static async activatePremium (userId:string, plan:string = 'premium') {
            try {
                const userRef =  doc(db, 'users', userId);
                const subscriptionData: SubscriptionData = {//this dymanic because it is holding the actual values. you are creating a Plain Old JavaScript Object (POJO) or "Object Instance"."Object" (The Reality)and "Instance" (The Relationship) but we cannot it  "Map" since it isn't a "Map Object" because "Map" is used for large amount of data and it also is looped like .map()
                    plan: plan,
                    startDate: new Date().toISOString(),
                    endDate: new Date(Date.now() + yearinMs).toISOString(),
                    status: 'active'
                };
                // Update Firestore
                await updateDoc(userRef, {// this is technically a PUT call to update doc
                    isSubscribed: true,
                    subscription: subscriptionData,
                    updatedAt: new Date().toISOString(),
                });
                store.dispatch(setSubscribed(true));
                store.dispatch(setSubscription(subscriptionData));
                return { success: true, subscription: subscriptionData};
            
            } catch(error) {
                console.error ("Error when trying to Activate subscription", error);
                return {success: false, error};
            }    
        }



        static async cancelSubscription(userId: string) {
            try {
                const userRef = doc( db, 'users', userId);//this creates a reference to point to a doc based on userId
                const userDoc = await getDoc(userRef); //this will take userRef and get doc
                
                    if(!userDoc.exists()){
                        throw new Error('User not found');// if stored in a variable ti will be created using your rams
                    };

                const currentSubscription = userDoc.data().subscription;
               
                    await updateDoc( userRef, 
                        {
                            isSubscribed: false,
                            'subscription.status': 'cancelled',
                            updatedAt: new Date().toISOString(),
                        }
                    );
                    //Update "isSubscribed" state for Redux to reflect cancel state because Redux cannot see Firebase
                    //this is sent to the authSlice.ts that is a slice of redux's store.ts
                    store.dispatch(setSubscribed(false));
                    if(currentSubscription) {//checks if currentSubscription is true
                        store.dispatch(setSubscription(
                            {                        
                                ...currentSubscription,//  this is copying a Shallow Copy the existing state from currentSubscription(an object)
                                // If you didn't use ...currentSubscription and
                                // .you would delete the user's plan name and their start date from Redux. The UI would show they are "Cancelled," but it might also show 
                                // "Plan: Unknown" or crash because the startDate is suddenly missing. By copying the old data, you maintain the "History" of the subscription while only changing the "State" of it.
                                status: 'cancelled', // this is holding the "cancelled" state which will be passed to Redux authSlice.ts
                            }
                        ));
                    }
                    
                    return{ success:true };//everything above worked, it returns a success "receipt" to whatever component called this function (like your Cancel Button).

            } catch(error) {
                console.error('Error cancelling subscription', error )
                return {sucess: false, error};//What it does: If the internet went out or Firestore crashed, the code jumps here. It logs the error so you can see it in the console and tells the UI "Hey, it didn't work."
            }
        }

        
        
        // Check subscription current status
        static async checkSubscriptionStatus(userId:string) {
            try {
                //Goes to Firestore and fetches that user's document. Think of it as a database lookup by user ID.
                const userRef = doc(db, 'users', userId);
                const userDoc = await getDoc(userRef);

                    // If the user doesn't exist in the database at all, just return false immediately and stop.
                    if(!userDoc.exists()) {
                        return { isSubscribed : false};
                    }

                // this will run if "!userDoc.exists()" is false and skip to here
                const data = userDoc.data();
                const subscription = data.subscription;

                    //Grabs the subscription object from the user's data. The ?. means "only read .status if subscription isn't null/undefined." Then checks two things — status must be "active" AND an endDate must exist before going further.
                    if(subscription?.status === 'active' && subscription.endDate) {// checks 3 things, "subscription = true", status === "active", and endDate = true
    
                        const now = new Date();// tores the current date
                        const endDate = new Date(subscription.endDate);//stores the endDate that defines when it "expired"
                        
                        //Firebase gets updated — writes isSubscribed: false and flips status to "expired" in the database
                        //This is the expiry check. Converts both dates to Date objects so you can compare them. If the stored end date is in the past, the subscription has expired.
                        if(endDate < now){//if "endate" is less than "now" then set it to expired
                            await updateDoc ( userRef, {//async call to updateDoc (PUT, PATCH)
                                isSubscribed: false,// set subscribed to false
                                'subscription.status' : 'expired',// switch status to expired
                            });

                            store.dispatch(setSubscribed(false));// sets the store to false for Redux
                            return { isSubscribed: false, expired: true }//Returns the result with expired: true so the caller knows why it came back false
                        }
                    }
                
                // this will return if subscription isn't expired
                //This is the happy path — only reached if the subscription is active and not expired yet. Just returns whatever is in the database as-is.
                return {
                    // checks "subscription" exist? then check if subscription is "active"? then return data.isSubscribed else false
                    //Instead of "isSubscribed: data.isSubscribed," you want to safeguard it from status being "expired" | "cancelled" | undefined and only triggers on active
                    isSubscribed: subscription?.status === 'active' ? data.isSubscribed : false ,  
                    subscription: data.subscription ,  // this is the "subscription" status that is 'active' | 'expired' | 'cancelled'
                };

            } catch (error) {
                console.error('Errror checking subscription', error);
                return { isSubscribed: false, error }; 

            }    
          
        }
    }














// Subscription Service (subscriptionService.ts)
// Location: Service layer (utility functions)
// Purpose: Handles Firestore database operations for subscriptions
// What it does: Reads/writes to Firestore, updates Redux after changes
// Lifetime: Functions that run when called
// Think of this as the Action/Worker.

// What it does: It contains "Static Methods" (functions) that perform heavy lifting, like talking to Firestore to update a document or calculating an expiration date.

// Purpose: It organizes your logic in one place. Instead of writing 20 lines of database code inside a Button component, you just write SubscriptionService.activatePremium().

// How it interacts with Redux: If you look at the Subscription Service code, you'll see it actually calls the store:

// store.dispatch(setSubscribed(true))

// The Service does the work in the database, then "taps the Brain" (Redux) to tell it to update its memory.

// ┌─────────────────────────────────────────────────────────┐
// │                     YOUR APP                            │
// ├─────────────────────────────────────────────────────────┤
// │                                                         │
// │  ┌──────────────────┐        ┌──────────────────────┐   │
// │  │   Redux Slice    │        │  SubscriptionService │   │
// │  │   (authSlice)    │◄──────►│   (service layer)    │   │
// │  │                  │        │                      │   │
// │  │ • Client state   │        │ • Database operations│   │
// │  │ • Temporary      │        │ • Business logic     │   │
// │  │ • UI only        │        │ • Calls Firestore    │   │
// │  └──────────────────┘        └──────────────────────┘   │
// │           ▲                              ▲              │
// │           │                              │              │
// │           │                              ▼              │
// │           │                    ┌──────────────────────┐ │
// │           │                    │     Firestore        │ │
// │           └────────────────────│   (Database)         │ │
// │                                │                      │ │
// │                                │ • Persistent data    │ │
// │                                │ • Source of truth    │ │
// │                                └──────────────────────┘ │
// └─────────────────────────────────────────────────────────┘
// Data Flow:
// When User Subscribes:
// User clicks "Subscribe" → UI calls SubscriptionService.activatePremium()

// SubscriptionService writes to Firestore (persistent storage)

// SubscriptionService dispatches Redux action to update authSlice

// authSlice updates isSubscribed in Redux state

// UI re-renders showing premium access