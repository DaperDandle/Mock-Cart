const reducer = (state, action) => {
  // set the cart to an empty array
  if (action.type === "CLEAR_CART") {
    return { ...state, cart: [] };
  }
  // filter cart and remove the seleted item
  if (action.type === "REMOVE") {
    return {
      ...state,
      cart: state.cart.filter((cartItem) => cartItem.id !== action.payload),
    };
  }
  if (action.type === "GET_TOTAL") {
    // use reduce function to get the total price of all items in cart
    let { total, amount } = state.cart.reduce(
      (cartTotal, cartItem) => {
        const { price, amount } = cartItem;
        const itemTotal = price * amount;
        cartTotal.total += itemTotal;
        cartTotal.amount += amount;
        return cartTotal;
      },
      {
        total: 0,
        amount: 0,
      }
    );

    // truncate decimal to 2 spaces for cents
    total = parseFloat(total.toFixed(2));

    return { ...state, total, amount };
  }

  if (action.type === "LOADING") {
    return { ...state, loading: true };
  }

  if (action.type === "DISPLAY_ITEMS") {
    return { ...state, cart: action.payload, loading: false };
  }

  if (action.type === "TOGGLE_AMOUNT") {
    // create new cart with new amounts
    let tempCart = state.cart
      .map((cartItem) => {
        // if the item id matches the current payload id
        if (cartItem.id === action.payload.id) {
          // if the action is increase add 1 to item amount
          if (action.payload.type === "inc") {
            return { ...cartItem, amount: cartItem.amount + 1 };
          }
          // if action is decrease subtract 1 from item amount
          if (action.payload.type === "dec") {
            return { ...cartItem, amount: cartItem.amount - 1 };
          }
        }
        return cartItem;
      })
      // filter out any items with 0 amount
      .filter((cartItem) => cartItem.amount !== 0);
    return { ...state, cart: tempCart };
  }
  throw new Error("no matching action");
};

export default reducer;
