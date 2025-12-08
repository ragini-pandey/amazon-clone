import { buffer } from "micro";
import * as admin from "firebase-admin";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

console.log("🔥 Webhook API Initialized");

// Log env loading (DO NOT log secrets)
console.log("ENV CHECK:", {
   hasServiceAccount: !!process.env.SERVICE_ACCOUNT_JSON,
   hasStripeSecret: !!process.env.STRIPE_SECRET_KEY,
   hasStripeSigningSecret: !!process.env.STRIPE_SIGNING_SECRET,
});

const rawServiceAccount = process.env.SERVICE_ACCOUNT_JSON;

if (!rawServiceAccount) {
   console.error("❌ Missing SERVICE_ACCOUNT_JSON");
   throw new Error("Missing SERVICE_ACCOUNT_JSON env variable");
}

console.log("✔ SERVICE_ACCOUNT_JSON Found");

const serviceAccount = JSON.parse(rawServiceAccount);

// Fix newline escape issue
if (serviceAccount.private_key) {
   console.log("🔧 Fixing private key newlines");
   serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
}

const app = !admin.apps.length
   ? admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
   })
   : admin.app();

console.log("✔ Firebase Admin initialized");

const fulfillOrder = async (session) => {
   console.log("📦 fulfillOrder() called for session:", session.id);
   console.log("➡ Metadata:", session.metadata);

   return app
      .firestore()
      .collection("users")
      .doc(session.metadata.email)
      .collection("orders")
      .doc(session.id)
      .set({
         amount: session.amount_total / 100,
         amount_shipping: session.total_details.amount_shipping / 100,
         images: JSON.parse(session.metadata.images),
         timestamp: admin.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
         console.log(`✅ SUCCESS: Order ${session.id} added to Firestore`);
      })
      .catch((err) => {
         console.error("❌ Firestore write failed:", err);
         throw err;
      });
};

export default async (req, res) => {
   console.log("🚀 Incoming Request:", req.method);

   if (req.method === "POST") {
      console.log("📥 Reading raw body buffer...");

      const requestBuffer = await buffer(req);
      console.log("✔ Buffer read");

      const payload = requestBuffer.toString();
      console.log("📦 Payload length:", payload.length);

      const sig = req.headers["stripe-signature"];
      console.log("📝 Stripe Signature:", sig ? "Present" : "Missing");

      let event;

      try {
         console.log("🔐 Verifying Stripe event...");
         event = stripe.webhooks.constructEvent(
            payload,
            sig,
            process.env.STRIPE_SIGNING_SECRET
         );
         console.log("✔ Stripe verification passed");
      } catch (err) {
         console.error("❌ Stripe verification FAILED:", err.message);
         return res.status(400).send(`Webhook error: ${err.message}`);
      }

      console.log("📌 Event type:", event.type);

      if (event.type === "checkout.session.completed") {
         const session = event.data.object;
         console.log("💰 Checkout session completed:", session.id);

         return fulfillOrder(session)
            .then(() => {
               console.log("🎉 Order fulfilled successfully");
               return res.status(200).send("OK");
            })
            .catch((err) => {
               console.error("❌ fulfillOrder error:", err);
               return res.status(400).send(`Webhook error: ${err.message}`);
            });
      } else {
         console.log("⚠ Ignored event type:", event.type);
      }
   } else {
      console.log("❌ Unsupported request method:", req.method);
   }

   res.status(200).send("Handled");
};

export const config = {
   api: {
      bodyParser: false,
      externalResolver: true,
   },
};
