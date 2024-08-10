import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart'; 
import CartItem from '../CartItem/CartItem';
import './Cart.css'; 

const Cart = () => {
    const { cart, getTotal, totalQuantity, clearCart } = useCart(); 
    const total = getTotal();

    if (totalQuantity === 0) {
        return (
            <div className="cart-empty">
                <h1>No hay items en el carrito</h1>
                <p>Tu carrito está vacío. ¡Explora nuestros productos y agrega algunos a tu carrito!</p>
                <Link to="/" className="btn btn-primary">Volver a la tienda</Link>
            </div>
        );
    }

    return (
        <div>
            {cart.map((item) => (
                <CartItem key={item.id} {...item} />
            ))}
            <h3>Total: $ {total}</h3>
            <div className="d-flex justify-content-center">
                <button className="btn btn-warning" onClick={clearCart}>Limpiar Carrito</button>
                <Link to="/checkout" className="btn btn-info">Checkout</Link>
            </div>
        </div>
    );
}

export default Cart;
