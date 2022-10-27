import { useState } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from 'next/router';
import Stripe from "stripe";
import axios from "axios";

import Image from "next/future/image";
import { stripe } from "../../lib/stripe";
import { ImageContainer, ProductContainer, ProductDetails } from "../../styles/pages/product";

interface ProductProps {
  product: {
    id:             string;
    name:           string;
    imageUrl:       string;
    price:          string;
    description:    string;
    defaultPriceId: string;
  }
}

export default function Product({ product }: ProductProps) {
  const [ isCreatingCheckoutSession, setIsCreateCheckoutSession ] = useState(false);
  const { isFallback } = useRouter();
  if (isFallback) {
    return <p>Carregando...</p>
  }

  async function handleBuyProduct() {
    try {
      setIsCreateCheckoutSession(true);
      const response = await axios.post('/api/checkout', {
        priceId: product.defaultPriceId
      });
      const { checkoutUrl } = response.data;
      window.location.href = checkoutUrl;
    } catch (error) {
      console.log(error)
      alert('Falha ao redirecionar ao checkout.');
      setIsCreateCheckoutSession(false);
    }
  }

  return (
    <ProductContainer>
      <ImageContainer>
        <Image
          src={product.imageUrl}
          width={520}
          height={400}
          alt=""
        />
      </ImageContainer>
      <ProductDetails>
        <h1>{product.name}</h1>
        <span>{product.price}</span>
        <p>{product.description}</p>
        <button 
          disabled={isCreatingCheckoutSession}
          onClick={handleBuyProduct}>
          Comprar agora
        </button>
      </ProductDetails>
    </ProductContainer>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true
  }
}

export const getStaticProps: GetStaticProps<any, {id: string}> = async ({ params }) => {
  const productId = params.id;

  const product = await stripe.products.retrieve(productId, {
    expand: ['default_price']
  });
  const price = product.default_price as Stripe.Price;
  return {
    props: {
      product: {
        id: product.id,
        name: product.name,
        imageUrl: product.images[0],
        price: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(price.unit_amount / 100),
        description: product.description,
        defaultPriceId: price.id
      }
    },
    revalidate: 60 * 60 * 1
  }
}