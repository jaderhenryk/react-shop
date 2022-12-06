import { useContext } from 'react';
import { Handbag } from 'phosphor-react';
import Image from 'next/future/image';

import logoImg from '../../assets/logo.svg';
import { CartContext } from '../../context/CartContext';

import { CartListCounter, HeaderContainer, OpenCartButton } from "./styles";

export function Header() {
  const { cartListAmount, setIsCartModalOpen } = useContext(CartContext);

  function handleOpenCartModal() {
    setIsCartModalOpen(true);
  }

  return (
    <HeaderContainer>
      <Image src={logoImg} alt=""/>
      <OpenCartButton type="button" onClick={handleOpenCartModal}>
        <Handbag size={24}/>
        <CartListCounter>
          {cartListAmount}
        </CartListCounter>
      </OpenCartButton>
    </HeaderContainer>
  )
}