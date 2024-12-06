
  const currencyLocaleMap = {
    USD: 'en-US',
    GBP: 'en-GB',
    EUR: 'de-DE',
    INR: 'en-IN',
    JPY: 'ja-JP',
    AUD: 'en-AU',
    CAD: 'en-CA',
    CNY: 'zh-CN',
  };

  window.SubTotalValue = null;

  // Utility Function: Format Currency
  function formatCurrency(amount, currency = 'USD') {
    let local = currencyLocaleMap[currency] || 'en-US';
    let formatted = new Intl.NumberFormat(local, {
      style: 'currency',
      currency: currency,
    }).format(amount || 0);

    if (currency === 'INR') {
      formatted = formatted.replace('₹', 'Rs.');
    }
    return formatted;
  }

  // Change Global Value
  function changeSubTotalValue(newValue) {
    window.SubTotalValue = newValue;
    if (window.alpineData) {
      window.alpineData.SubTotalValue = newValue;
    }
  }

  // Cart Item Component
  function cartItem(initialQuantity, LinePrice, itemId, subTotal, currencyIso) {
    let changeinto_currency = formatCurrency(subTotal / 100, currencyIso);
    changeSubTotalValue(changeinto_currency);
    return {
      quantity: initialQuantity,
      Totalprice: LinePrice / 100,
      isVisible: true,
      currency: currencyIso,
      locale: 'en-IN',
      loading: false,

      decreaseQuantity() {
        if (this.quantity > 1) {
          this.updateCart(this.quantity - 1);
        }
      },

      increaseQuantity() {
        this.updateCart(this.quantity + 1);
      },

      async updateCart(newQuantity) {
        this.loading = true;
        try {
          const response = await fetch('/cart/change.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: itemId, quantity: newQuantity }),
          });

          if (response.ok) {
            if (newQuantity !== 0) {
              await this.getUpdatedCartItems();
            } else {
              const fetchCart = await fetch('/cart.js', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
              });
              if (fetchCart.ok) {
                const data = await fetchCart.json();
                let currency_change = formatCurrency(data.items_subtotal_price / 100, currencyIso);
                changeSubTotalValue(currency_change);
              }
            }
          }
        } catch (error) {
          console.error('Error updating cart:', error);
        } finally {
          this.loading = false;
        }
      },

      removeItem() {
        this.updateCart(0)
          .then(() => {
            this.isVisible = false;
          })
          .catch((error) => console.error('Error removing item:', error));
      },

      async getUpdatedCartItems() {
        try {
          const response = await fetch('/cart.js', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });
          if (response.ok) {
            const data = await response.json();
            const foundItem = data.items.find((item) => item.id === parseInt(itemId));
            if (foundItem) {
              this.quantity = foundItem.quantity;
              this.Totalprice = foundItem.line_price / 100;
              this.currency = data.currency;
              this.locale = this.updateLocale();
              let currency_change = formatCurrency(data.items_subtotal_price / 100, currencyIso);
              changeSubTotalValue(currency_change);
            }
          }
        } catch (error) {
          console.error('Error fetching cart items:', error);
        }
      },

      updateLocale() {
        this.locale = currencyLocaleMap[this.currency] || 'en-US';
        return this.locale;
      },
    };
  }
