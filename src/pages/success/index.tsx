import { GetServerSideProps } from "next";
import Image from "next/future/image";
import Head from "next/head";
import Link from "next/link";

import Stripe from "stripe";
import { stripe } from "../../lib/stripe";

import { ImageContainer, ImagesContainer, SuccessContainer } from "../../styles/pages/success";

interface SuccessProps {
  customerName: string;
  products: {
    name:     string;
    imageUrl: string
  }[]
}

export default function Success({customerName, products }: SuccessProps) {
  return (
    <>
      <Head>
        <title>Compra Efetuada | React shop</title>
        <meta name="robots" content="noindex"/>
      </Head>
      <SuccessContainer>
        <h1>Compra Efetuada</h1>
        <ImagesContainer>
          {
            products.map(product => {
              return (
                <ImageContainer key={product.imageUrl}>
                  <Image src={product.imageUrl} width={120} height={110} alt=""/>
                </ImageContainer>
              )
            })
          }
        </ImagesContainer>
        <p>
          Uhuul, <strong>{customerName}</strong> sua compra já está a caminho da sua casa.
        </p>
        <Link href="/">
          Voltar ao catálogo
        </Link>
      </SuccessContainer>
    </>
  )
}

export const getServerSideProps: GetServerSideProps =async ({ query }) => {
  if (!query.session_id) {
    return {
      props: {},
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }
  const sessionId = String(query.session_id);
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items', 'line_items.data.price.product']
  });
  const customerName = session.customer_details.name;
  const products = session.line_items.data.map(item => {
    const product = item.price.product as Stripe.Product;
    return {
      name: product.name,
      imageUrl: product.images[0]
    }
  });
  return {
    props: {
      customerName,
      products
    }
  }
}