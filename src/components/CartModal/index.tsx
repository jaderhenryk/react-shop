import { useContext } from "react"
import { X } from 'phosphor-react'

import { CartContext } from "../../context/CartContext";
import { CartItem } from "./CartItem";
import { CartContainer, CartItemList, CloseModalButton, ConfirmButton, EmptyCartList, PriceContainer } from "./styles";
import { priceFormatter } from "../../utils/formatter";

export function CartModal() {
  const { cartList, cartListTotal, setIsCartModalOpen, submitCart, cartListAmount } = useContext(CartContext);
  
  const hasItems = cartList.length > 0;

  const renderList = function() {
    if (!hasItems) {
      return <EmptyCartList>O carrinho está vazio.</EmptyCartList>
    }
    return cartList.map(item => <CartItem key={item.id} item={item}/>)
  }

  function handleCloseModal() {
    setIsCartModalOpen(false);
  }

  return (
    <CartContainer>
      <CloseModalButton type="button" onClick={handleCloseModal}>
        <X size={24}/>
      </CloseModalButton>
      <CartItemList>
        <h1>Carrinho de Compras</h1>
        <ul>{renderList()}</ul>
      </CartItemList>
      <PriceContainer>
        <p>
          Quantidade
          <span>
            {cartListAmount} {cartListAmount === 1 ? 'Item' : 'Itens'}
          </span>
        </p>
        <p>
          Valor Total <span>{priceFormatter.format(cartListTotal / 100)}</span>
        </p>
      </PriceContainer>
      <ConfirmButton type="button" onClick={submitCart}>
        Confirmar Compra
      </ConfirmButton>
    </CartContainer>
  )
}