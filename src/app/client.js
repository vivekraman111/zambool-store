"use client";

// client.js

import React from "react";
import {
  DataProviderGeneric,
  DataProviderExtensions,
  useField,
  useData,
  useIterationField,
  useIterationData
} from "zambool";

export function ClientData({ data, children }) {
  return (
    <DataProviderExtensions
      derivedFields={{
        processedProducts: (data) =>
          data.products.map((product) => ({
            ...product,
            formattedPrice: formatPrice(product.price),
            formattedSalePrice:
              product.salePrice == null
                ? null
                : formatPrice(product.salePrice),
            isDiscounted:
              product.salePrice != null,
            tag: getTag(product),
          })),
        processedCart: (data) =>
          data.cart.map((item) => {
            const product = data.products.find(
              product => product.id === item.id
            );

            return {
              ...item,
              title: product.title,
              formattedPrice: formatPrice(product.price),
            };
          }),
        cartTotals: (data) => {
          const subtotal = data.cart.reduce((total, item) => {
            const product = data.products.find(
              product => product.id === item.id
            );

            return total + product.price * item.quantity;
          }, 0);

          const tax = subtotal * 0.15;

          return {
            subtotal: formatPrice(subtotal),
            tax: formatPrice(tax),
            grandTotal: formatPrice(subtotal + tax),
          };
        },
        cartState: (data) => {
          const isEmpty = data.cart.length === 0;

          return {
            isEmpty,
            hasItems: !isEmpty,
          };
        },
      }}
    >
      <DataProviderGeneric schema={data}>
        {children}
      </DataProviderGeneric>
    </DataProviderExtensions>
  );
}

function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(price / 100);
}

function getTag(product) {
  if (product.salePrice != null) {
    return {
      type: "sale",
      text: "Sale",
    };
  }

  return null;
}

export function Thumbnail({ srcField, className }) {
  const src = useIterationData(srcField);

  return (
    <img
      src={src}
      className={className}
    />
  );
}

export function BoxC({
  as = "div",
  renderIf,
  className,
  children,
  fieldName,
  ...props
}) {
  let content = children;
  const renderValue = useData(renderIf ?? null);
  const fieldContent = useData(fieldName);

  if (renderIf && !renderValue) {
    return null;
  }

  if (fieldName) {
    content = fieldContent;
  }

  return React.createElement(
    as,
    {
      ...props,
      className,
    },
    content
  );
}

export function BoxIC({
  as = "div",
  renderIf,
  className,
  fieldNameIterator,
  ...props
}) {
  const renderValue = useIterationData(renderIf ?? null);
  const fieldContent = useIterationData(fieldNameIterator);

  if (renderIf && !renderValue) {
    return null;
  }

  return React.createElement(
    as,
    {
      ...props,
      className,
    },
    fieldContent
  );
}

export function AddToCartButton({
  cartField,
  idField = "id",
  qtyField = "quantity",
  className,
  children
}) {
  const product = useIterationData();
  const [cart, setCart] = useField(cartField);

  return (
    <button
      className={className}
      onClick={() => {
        const id = product[idField];

        const index = cart.findIndex(
          item => item[idField] === id
        );

        const nextCart =
          index !== -1
            ? cart.map((item, i) =>
                i === index
                  ? {
                      ...item,
                      [qtyField]: item[qtyField] + 1
                    }
                  : item
              )
            : [
                ...cart,
                {
                  [idField]: id,
                  [qtyField]: 1
                }
              ];

        setCart(nextCart);
      }}
    >
      {children}
    </button>
  );
}

export function RemoveButton({
  arrField,
  idField = "id",
  className,
  children
}) {
  const [arr, setArr] = useField(arrField);
  const removeId = useIterationData(idField);

  return (
    <button
      className={className}
      onClick={() =>
        setArr(
          arr.filter(item => item[idField] !== removeId)
        )
      }
    >
      {children}
    </button>
  );
}