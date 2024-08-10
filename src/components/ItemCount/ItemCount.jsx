import { useState } from 'react'
import './ItemCount.css'

function ItemCount({initialValue=1, stock, onAdd}) {
    const [count, setCount] = useState(initialValue);
    

    const decrement = () => {
        if(count>1){
            setCount(count => count - 1)
        }
    }
    const increment = () => {
        if(count < stock){
            setCount((count) => count + 1);
        }
    };

  return (
    <>
      <h1>{count}</h1>
      <button className="button decrement-button" onClick={decrement}>- 1</button>
      <button className="button add-button" onClick={() => onAdd(count)}>Agregar al Carrito</button>
      <button className="button increment-button" onClick={increment}>+ 1</button>
    </>
  );
}

export default ItemCount