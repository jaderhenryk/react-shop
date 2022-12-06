import Image from "next/future/image";
import { useContext } from "react"
import { CartContext } from "../../../context/CartContext"
import { Product } from "../../../models/Product.interface"
import { priceFormatter } from "../../../utils/formatter";
import { CartItemContainer } from "./styles";

interface CartItemProps {
  item: Product
}

export function CartItem({ item }: CartItemProps) {
  const { removeItem } = useContext(CartContext);
  return (
    <CartItemContainer>
      <Image src={item.imageUrl} alt={item.name} width={100} height={100}/>
      <div>
        <strong>{item.name}</strong>
        <span>{priceFormatter.format(item.price / 100)}</span>
        <button type="button" onClick={() => removeItem(item)}>
          Remover
        </button>
      </div>
    </CartItemContainer>
  )
}