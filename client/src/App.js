import React, { useState } from 'react';
import { Button, Center, ChakraProvider, theme } from '@chakra-ui/react';
import StripeCheckout from 'react-stripe-checkout';

function App() {
  const [product, setProduct] = useState({
    name: 'React from facebook',
    price: 10,
    productBy: 'facebook',
  });

  const makePayment = token => {
    const body = {
      token,
      product,
    };
    const headers = {
      'Content-Type': 'application/json',
    };

    return fetch('http://localhost:8080/api/payment', {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })
      .then(res => {
        console.log('Response - ', res);
        const { status } = res;
        console.log('Status - ', status);
      })
      .catch(err => console.log(err));
  };

  return (
    <ChakraProvider theme={theme}>
      <Center h="100vh">
        <StripeCheckout
          stripeKey={process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}
          token={makePayment}
          name="Pay Now"
          amount={product.price * 100}
        />
      </Center>
    </ChakraProvider>
  );
}

export default App;
