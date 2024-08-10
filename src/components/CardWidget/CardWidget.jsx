import cart from "../../assets/cart.svg";
import { useCart } from "../../hooks/useCart";
import { Link } from "react-router-dom";
import './CardWidget.css'
function CardWidget() {
  const { totalQuantity } = useCart();
  return (
    <Link className="CardWidget" to="/cart">
      <img src={cart} 
        className="CardImg"
        alt='card-widget'
      />
      {totalQuantity > 0 && (
        <div className="CardQuantity">{totalQuantity}</div>
      )}
    </Link>
  );
}

export default CardWidget;