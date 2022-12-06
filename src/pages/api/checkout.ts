import { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "../../lib/stripe";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Http Method not allowed '});
  }
  const { priceIds } = req.body;
  if (!priceIds) {
    return res.status(400).json({ error: 'PriceIds not found' });
  }
  const successUrl = `${process.env.NEXT_URL}/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${process.env.NEXT_URL}/`;

  const getLineItems = function(priceIds: string[]) {
    return priceIds.map(priceId => {
      return {
        price: priceId,
        quantity: priceId.length
      }
    })
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    success_url: successUrl,
    cancel_url: cancelUrl,
    mode: 'subscription',
    line_items: getLineItems(priceIds)
  });
  return res.status(200).json({ checkoutUrl: checkoutSession.url });
}