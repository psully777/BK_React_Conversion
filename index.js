require('dotenv').config();

const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

app.use(express.static('public'));
app.use(express.json())


app.get('/products', async (_request, response) => {
  const products = await stripe.products.list({
    limit: 100,
  });
 
  const prices = await stripe.prices.list({
    limit: 100,
  });

  prices.data.forEach(price => {
    const theAssociatedProduct = products.data.find(
      product => product.id === price.product
    );
    theAssociatedProduct.price = price;
  });
  const cleanedUpProducts = products.data.map(product => ({
    name: product.name,
    image: product.images[0],
    category: product.metadata.category,
    nutrition: product.metadata.nutrition,
    currency: product.price.currency,
    price_cents: product.price.unit_amount,
    price_id: product.price.id,
  }));
  response.json(cleanedUpProducts);

});

app.post('/checkout', async (request, response) => {
  const { cart } = request.body  
  const lineItems = Object.keys(cart).map(priceId => {
    return {
      price: priceId,
      quantity: cart[priceId]
    }
  })
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: 'http://localhost:3000',
    cancel_url: 'http://localhost:3000',
  });
  response.json({session_id: session.id})
})


app.listen(3000, () => console.log(`Server is up and running 🚀`));