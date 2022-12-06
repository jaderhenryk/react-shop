import { useContext } from 'react';

import { GetStaticProps } from 'next';
import Link from 'next/link';
import Image from 'next/future/image';
import Head from 'next/head';

import { Bag } from 'phosphor-react';

import Stripe from 'stripe';
import { stripe } from '../lib/stripe';

import { useKeenSlider } from 'keen-slider/react';

import { HomeContainer, ProductAnchor } from "../styles/pages/home";
import 'keen-slider/keen-slider.min.css';

import { Product } from '../models/Product.interface';
import { CartContext } from '../context/CartContext';
import { priceFormatter } from '../utils/formatter';

interface HomeProps {
  products: Product[]
}

export default function Home({ products }: HomeProps) {
  const { addItem } = useContext(CartContext);
  const [ sliderRef ] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48
    }
  })
  return (
    <>
      <Head>
        <title>Home | React shop</title>
      </Head>
      <HomeContainer ref={sliderRef} className="keen-slider">
      {
        products.map(product => {
          return (
            <ProductAnchor className="keen-slider__slide" key={product.id}>
              <Link href={`/product/${product.id}`} prefetch={false} passHref>
                <a>
                  <Image src={product.imageUrl} alt="" width={520} height={480}/>
                </a>
              </Link>
              <footer>
                <div>
                  <strong>{product.name}</strong>
                  <span>{priceFormatter.format(product.price / 100)}</span>
                </div>
                <button type="button" onClick={() => addItem(product)}>
                  <Bag size={24}/>
                </button>
              </footer>
            </ProductAnchor>
          )
        })
      }
      </HomeContainer>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await stripe.products.list({
    expand: ['data.default_price']
  })
  const products = response.data.map(product => {
    const price = product.default_price as Stripe.Price;
    return {
      id: product.id,
      name: product.name,
      imageUrl: product.images[0],
      price: price.unit_amount,
      priceId: price.id
    }
  })
  return {
    props: {
      products
    },
    revalidate: 60 * 60 * 2
  }
}
