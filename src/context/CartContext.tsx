import axios from "axios";
import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";
import { CartModal } from "../components/CartModal";
import { Product } from "../models/Product.interface";

interface CartContextData {
  cartList:           Product[];
  isCartModalOpen:    boolean;
  cartListAmount:     number;
  cartListTotal:      number;
  setIsCartModalOpen: Dispatch<SetStateAction<boolean>>;
  addItem:            (item: Product) => void;
  removeItem:         (item: Product) => void;
  submitCart:         () => void;
}

interface CartContextProps {
  children: ReactNode
};

const CART = 'react.shop@cart-list';

export const CartContext = createContext({} as CartContextData);

export function CartContextProvider({ children }: CartContextProps) {
  const [ isCartModalOpen, setIsCartModalOpen ] = useState(false);
  const cart = localStorage.getItem(CART);
  const [ cartList, setCartList ] = useState<Product[]>(() => {
    if (cart) {
      return JSON.parse(cart);
    }
    return [];
  });

  const addItem = function(item: Product) {
    const itemFound = cartList.findIndex(cartItem => cartItem.id === item.id);
    if (itemFound != -1) {
      return;
    }
    setCartList(state => [...state, item]);
    localStorage.setItem(CART, JSON.stringify(cartList));
  };

  const removeItem = function(item: Product) {
    const itemFound = cartList.findIndex(cartItem => cartItem.id === item.id);
    if (itemFound == -1) {
      return;
    }
    setCartList(state => state.filter(cartItem => cartItem.id !== item.id));
    localStorage.setItem(CART, JSON.stringify(cartList));
  }

  const submitCart = async function () {
    try {
      const priceIds = cartList.map(itemCart => itemCart.priceId);
      const response = await axios.post('/api/checkout', {
        priceIds
      });
      console.log(response);
      setCartList([]);
      localStorage.removeItem(CART);
      const { checkoutUrl } = response.data;
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error(error.message);
    }
  }

  const cartListAmount = cartList.length;
  const prices = cartList.map(cartItem => cartItem.price);
  const cartListTotal = prices.reduce((total, item) => total + item, 0);

  return (
    <CartContext.Provider
      value={{
        cartList,
        isCartModalOpen,
        cartListAmount,
        cartListTotal,
        addItem,
        removeItem,
        submitCart,
        setIsCartModalOpen
      }}
    >
      { isCartModalOpen && <CartModal/>}
      { children }
    </CartContext.Provider>
  )
}