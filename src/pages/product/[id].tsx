import { useContext, useState } from "react";

import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from 'next/router';
import Image from "next/future/image";
import Head from "next/head";

import Stripe from "stripe";
import { stripe } from "../../lib/stripe";

import { ImageContainer, ProductContainer, ProductDetails } from "../../styles/pages/product";
import { Product as ProductModel } from "../../models/Product.interface";
import { CartContext } from "../../context/CartContext";
import { priceFormatter } from "../../utils/formatter";

interface ProductProps {
  product: ProductModel
}

export default function Product({ product }: ProductProps) {
  const { addItem } = useContext(CartContext);
  const [ isCreatingCheckoutSession, setIsCreateCheckoutSession ] = useState(false);
  const { isFallback } = useRouter();
  if (isFallback) {
    return <p>Carregando...</p>
  }

  return (
    <>
      <Head>
        <title>{product.name} | React shop</title>
      </Head>
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
          <span>{priceFormatter.format(product.price / 100)}</span>
          <p>{product.description}</p>
          <button 
            disabled={isCreatingCheckoutSession}
            onClick={() => addItem(product)}>
            Adicionar ao Carrinho
          </button>
        </ProductDetails>
      </ProductContainer>
    </>
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
        price: price.unit_amount,
        description: product.description,
        defaultPriceId: price.id
      }
    },
    revalidate: 60 * 60 * 1
  }
}