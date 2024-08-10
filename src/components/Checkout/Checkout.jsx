import { useState } from "react";
import { useCart } from "../../hooks/useCart";
import { addDoc, collection, documentId, getDocs, query, where, writeBatch } from "firebase/firestore";
import { db } from "../../services/firebase";
import './Checkout.css';

const Checkout = () => {
    const [loading, setLoading] = useState(false);
    const [orderCreated, setOrderCreated] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        address: "",
        comments: ""  
    });
    const [formErrors, setFormErrors] = useState({});

    const { cart, totalQuantity, getTotal, clearCart } = useCart();
    const total = getTotal();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...formData, [name]: value }));
    };

    const validateForm = () => {
        let errors = {};
        if (!formData.firstName) errors.firstName = "El nombre es obligatorio";
        if (!formData.lastName) errors.lastName = "El apellido es obligatorio";
        if (!formData.phone) errors.phone = "El teléfono es obligatorio";
        if (!formData.address) errors.address = "La dirección es obligatoria";
        return errors;
    };

    const createOrder = async () => {
        setLoading(true);
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            setLoading(false);
            return;
        }

        try {
            const objOrder = {
                buyer: formData,
                items: cart,
                totalQuantity,
                total,
                date: new Date()
            };

            const ids = cart.map(item => item.id);
            if (ids.length === 0) {
                throw new Error("El carrito está vacío.");
            }

            const productRef = collection(db, "products");

            const productsAddedFromFirestore = await getDocs(
                query(productRef, where(documentId(), "in", ids))
            );
            const { docs } = productsAddedFromFirestore;

            const outOfStock = [];
            const batch = writeBatch(db);

            docs.forEach((doc) => {
                const dataDoc = doc.data();
                const stockDB = dataDoc.stock;
                const productAddedToCart = cart.find((prod) => prod.id === doc.id);
                const productQuantity = productAddedToCart?.quantity;

                if (stockDB >= productQuantity) {
                    batch.update(doc.ref, { stock: stockDB - productQuantity });
                } else {
                    outOfStock.push({ id: doc.id, ...dataDoc });
                }
            });

            if (outOfStock.length === 0) {
                await batch.commit();
                const orderRef = collection(db, "orders");
                const orderAdded = await addDoc(orderRef, objOrder);
                console.log(`El id de su orden es ${orderAdded.id}`);
                
                setOrderCreated(true);
                clearCart();
            } else {
                console.log("Hay productos que están fuera de stock");
            }
        } catch (error) {
            console.log("Error al crear la orden:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {loading && <h1 className="loading-message">Se está generando la orden...</h1>}
            {orderCreated && <h1 className="success-message">La orden fue creada correctamente</h1>}
            {!loading && !orderCreated && (
                <>
                    <h1 className="text-center">Checkout</h1>
                    <form className="checkout-form" onSubmit={(e) => {
                        e.preventDefault();
                        createOrder();
                    }}>
                        <div className="form-group">
                            <label htmlFor="firstName">Nombre</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className={`form-control ${formErrors.firstName ? 'is-invalid' : ''}`}
                            />
                            {formErrors.firstName && <div className="invalid-feedback">{formErrors.firstName}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName">Apellido</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className={`form-control ${formErrors.lastName ? 'is-invalid' : ''}`}
                            />
                            {formErrors.lastName && <div className="invalid-feedback">{formErrors.lastName}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Teléfono</label>
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`form-control ${formErrors.phone ? 'is-invalid' : ''}`}
                            />
                            {formErrors.phone && <div className="invalid-feedback">{formErrors.phone}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="address">Dirección</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className={`form-control ${formErrors.address ? 'is-invalid' : ''}`}
                            />
                            {formErrors.address && <div className="invalid-feedback">{formErrors.address}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="comments">Comentarios</label>
                            <textarea
                                id="comments"
                                name="comments"
                                value={formData.comments}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>
                        <div className="d-flex justify-content-center p-3">
                            <button type="submit" className="btn btn-info">Generar Orden</button>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
};

export default Checkout;
