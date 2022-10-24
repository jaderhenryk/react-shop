import { GetStaticProps } from 'next';

import Stripe from 'stripe'; 
import { stripe } from '../lib/stripe';

import { useKeenSlider } from 'keen-slider/react';

import { HomeContainer, Product } from "../styles/pages/home";
import 'keen-slider/keen-slider.min.css';

import Image from "next/future/image";
interface HomeProps {
  products: {
    id:       string;
    name:     string;
    imageUrl: string;
    price:    number
  }[]
}

export default function Home({ products }: HomeProps) {
  const [ sliderRef ] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48
    }
  })

  return (
    <HomeContainer ref={sliderRef} className="keen-slider">
    {
      products.map(product => {
        return (
          <Product className="keen-slider__slide" key={product.id}>
            <Image src={product.imageUrl} alt="" width={520} height={480}/>
            <footer>
              <strong>{product.name}</strong>
              <span>R$ {product.price / 100}</span>
            </footer>
          </Product>
        )
      })
    }
    </HomeContainer>
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
      price: price.unit_amount
    }
  })
  return {
    props: {
      products
    },
    revalidate: 60 * 60 * 2
  }
}
