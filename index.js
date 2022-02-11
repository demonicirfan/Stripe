const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { v4: uuid } = require('uuid');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

app.get('/api/hello', (req, res) => {
  res.send('Hello');
});

app.post('/api/payment', (req, res) => {
  const { product, token } = req.body;
  console.log('PRODUCT ', product);
  console.log('PRICE ', product.price);
  const idempontencyKey = uuid();

  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges.create(
        {
          amount: product.price * 100,
          currency: 'usd',
          customer: customer.id,
          receipt_email: token.email,
          description: product.name,
          shipping: {
            name: token.card.name,
            address: {
              country: token.card.address_country,
            },
          },
        },
        { idempontencyKey }
      );
    })
    .then((result) => res.status(200).json(result))
    .catch((err) => console.log(err));
});
app.listen(8080, () => {
  console.log('listening on port 8080');
});
