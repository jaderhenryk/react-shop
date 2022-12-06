import type { AppProps } from 'next/app';

import { CartProvider as StripeCartProvider } from 'use-shopping-cart';

import { Header } from '../components/Header';
import { CartContextProvider } from '../context/CartContext';

import { globalStyles } from '../styles/global';
import { Container } from '../styles/pages/app';

globalStyles();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Container>
      <StripeCartProvider
        cartMode='checkout-session'
        stripe={process.env.STRIPE_PUBLIC_KEY}
        currency="USD"
        loading={<p aria-live='polite'>Loading...</p>}
      >
        <CartContextProvider>
          <Header/>
          <Component {...pageProps} />
        </CartContextProvider>
      </StripeCartProvider>
    </Container>
  )
}
