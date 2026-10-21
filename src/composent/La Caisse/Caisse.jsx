import React, { useState, useLayoutEffect, useRef, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import gsap from "gsap";
import CaisseSection from "./Section";
import RightSidebar from "./RightSidebar";
import "./Caisse.css";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { getProductSalePrice, hasWholesalePrice } from "../../../shared/productPricing.js";

function LaCaisse() {
  const { t } = useTranslation();
  const [cart, setCart] = useState([]);
  const [discount, setDiscount] = useState({ type: "percent", value: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.LoginAdmin);

  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product._id);

      if (existingItem) {
        if (existingItem.qty >= product.quantite) {
          toast.error(t("cashier.stockInsufficient", { max: product.quantite }));
          return prevCart;
        }
        return prevCart.map((item) =>
          item.id === product._id ? { ...item, qty: item.qty + 1 } : item
        );
      }

      if (product.quantite <= 0) {
        toast.error(t("cashier.productOutOfStock"));
        return prevCart;
      }

      return [
        ...prevCart,
        {
          id: product._id,
          name: product.name,
          price: product.prix_vente,
          priceType: 'retail',
          retailPrice: Number(product.prix_vente),
          wholesalePrice: hasWholesalePrice(product) ? Number(product.prix_gros) : null,
          qty: 1,
          stockMax: product.quantite,
        },
      ];
    });
  };

  const handlePriceTypeChange = (id, priceType) => {
    setCart((current) => current.map((item) => {
      if (item.id !== id) return item;
      const product = { prix_vente: item.retailPrice, prix_gros: item.wholesalePrice };
      if (priceType === 'wholesale' && !hasWholesalePrice(product)) return item;
      return { ...item, priceType, price: getProductSalePrice(product, priceType) };
    }));
  };

  const handleUpdateQty = (id, newQty) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          if (newQty > item.qty && newQty > item.stockMax) {
            toast.error(t("cashier.maxStockReached", { max: item.stockMax }));
            return item;
          }
          return { ...item, qty: newQty };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    if (cart.length === 1 && cart[0].id === id) {
      setDiscount({ type: "percent", value: "" });
    }
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".ticket-section", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "expo.out",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const clearCart = () => {
    setCart([]);
    setDiscount({ type: "percent", value: "" });
  };

  useEffect(() => {
    if (!token) {
      navigate("/LoginChoise");
    }
  }, [token, navigate]);

  return (
    <div
      ref={containerRef}
      className="p-6 bg-gray-100 dark:bg-[#1e293b] min-h-screen text-[#1e293b] dark:text-white flex flex-col gap-6 font-sans"
    >
      <Toaster position="top-center" />
      <div className="flex flex-col lg:flex-row gap-6 flex-1 h-full">
        <CaisseSection
          cart={cart}
          onAddToCart={handleAddToCart}
          onClearCart={clearCart}
          discount={discount}
          onDiscountChange={setDiscount}
          isSubmitting={isSubmitting}
          onSubmittingChange={setIsSubmitting}
        />
        <RightSidebar
          panierItems={cart}
          onUpdateQty={handleUpdateQty}
          onRemoveItem={handleRemoveItem}
          onPriceTypeChange={handlePriceTypeChange}
          disabled={isSubmitting}
        />
      </div>
    </div>
  );
}

export default LaCaisse;
