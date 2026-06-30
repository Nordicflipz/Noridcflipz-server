import express from "express";
import Stripe from "stripe";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// DIN STRIPE SECRET KEY
const stripe = new Stripe("sk_test_51To22nJvSIpNlW173JhQmxiPb9F6fr9Tpx9rmx11OCdk5KqN0Ey4OdpmvebA8vGrzWAaecqyHUv8L9qRDAGnRIYE00gPLf5w7J");

// ROUTE FÖR CHECKOUT
app.post("/create-checkout-session", async (req, res) => {
  const { cart, customer } = req.body;

  // Konvertera cart till Stripe line items
  const lineItems = cart.map(item => ({
    price_data: {
      currency: "sek",
      product_data: {
        name: item.name,
        images: [item.img]
      },
      unit_amount: item.price * 100 // SEK → öre
    },
    quantity: item.qty
  }));

  // Skapa Stripe checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    customer_email: customer.email,
    success_url: "https://nordicflipz.github.io/order-confirmation.html",
    cancel_url: "https://nordicflipz.github.io/checkout.html"
  });

  res.json({ url: session.url });
});

// STARTA SERVERN
app.listen(3000, () => console.log("Server körs på port 3000"));
