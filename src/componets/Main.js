import React from 'react';
import {stripe} from "../data/Stripe"

const Main = ({siteSettings, categories, products}) => {
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [cart, setCart] = React.useState({});
  const [isCartOpen, setIsCartOpen] = React.useState("false");

  const handleCategorySelect = (categoryName) => {
   
    setSelectedCategory(categoryName)
  };

  const addToCart = (priceId) => {
    const newCart = {...cart, [priceId]: cart[priceId] ? cart[priceId] + 1: 1,
    };
    setCart(newCart);
    setIsCartOpen(true);
  };

  const addToCart = (priceId) => {
    const newCart = {...cart, 
      [priceId]: cart[priceId] - 1,
    };
    if(newCart[priceId] === 0){
      delete newCart[priceId];
    }
    setCart(newCart);
    if(Object.keys(newCart).length === 0){
      setIsCartOpen(false);
    }
  };

  const handleCheckout = async () => {
    const response = await fetch('/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ cart }),
    });
    const data = await response.json();
    stripe.redirectToCheckout({
      sessionId: data.session_id,
    });
  };

   const filteredProducts = products.filter(
      (product) => product.category === selectedCategory
      );

  const totalItemCount = Object.values(cart).reduce((a,b) => a + b, 0);
      

  return (
 <>
 <header>
    <nav>
      <div className="leftNavWrapper">
        <a href="#">Order</a>
        <a href="#">Restaurants</a>
        <a href="#">Offers</a>
        <a href="#">Trending</a>
        <a href="#">More</a>
      </div>
      <div className="logo">
        <img
          id="logo"
          alt="logo"
          className={!siteSettings.logo.asset.url ? 'hidden' : ''}
          src={siteSettings.logo.asset.url}
        />
      </div>
      <div className="rightNavWrapper">
        <button type="button" className="signup">
          sign up
        </button>

        <aside id="cart">
          <button type="button" id="cart-button" onClick={() => setIsCartOpen(!isCartOpen)}>
            $0.00
            <img
              id="bag-icon"
              alt="bag-icon"
              className={!siteSettings.bagIcon.asset.url ? 'hidden' : ''}
              src={siteSettings.bagIcon.asset.url}
            />
            <span id = "cart-number">{totalItemCount}</span>
          </button>

          <dialog id="dialog" open={isCartOpen}>
            <ul id="line-items">
            {
              Object.keys(cart).map(priceId =>{
                const product = products.find(prod => prod.price_id === priceId);
                return(
                  <li key={priceId} data-priceid={priceId}> 
    <span>{product.name}: {cart[priceId]}</span>
    <span>
      <button className="add" onClick={() => addToCart(priceId)}>+</button>
      <button className="subtract" onClick={() => subtractFromCart(priceId)}>-</button>
    </span>
  </li>
                )
              })
            }


              {
              Object.keys(cart).length === 0 && <li>Your Cart is Empty!</li>}
            </ul>
            <button type="button" id="checkout-button" disabled={Object.keys(cart).length === 0} onClick={handleCheckout}>
              Checkout
            </button>
          </dialog>
        </aside>
      </div>
    </nav>
  </header>
  
  <main>
    <section id="categories" className={selectedCategory ? "hidden" : ""}>
  {categories.map((category) => 
  {
      return (
    <button key={category._id} data-trackingid={category.name} className="category" data-category={category.name} onClick={() => handleCategorySelect(category.name)}>
      <img 
        src={category.primaryImage.asset.url}
        alt={category.name}
        data-primaryimage={category.primaryImage.asset.url}
        data-carouselimage={category.carouselImage.asset.url} 
      />
      <h2>{category.name}</h2>
    </button>
      );
      },
      )},
  
        </section>

    <button id="back-to-main-menu" style={{opacity: selectedCategory ? 1 : 0}} onClick={() => setSelectedCategory("")}>&#60; Main Menu</button>
    
    <h3 id="menu-hero-text">{selectedCategory || siteSettings.menuHeroText}</h3>

    <section id="products" className={selectedCategory ? "" : "hidden"}>
      {filteredProducts.map((product) =>{
        return(
          <div className = "product" data-priceid={product.price_id} key ={product.id}>
       <img src = {product.image} data-trackingid={product.name} alt={product.name}/>  
        <h2>${product.name}</h2>      
      <button data-trackingid={product.name} className = "add-to-cart" onClick={() => addToCart(product.price_id)} >
        Add <span className = "currency">$${product.currency}</span> 
        ${(product.price_cents / 100).toFixed(2)}</button>
      <p>${product.nutrition} Cal</p>
    </div>
        )
      })}
    </section>
  </main>
  </>
  );
};

export default Main;
