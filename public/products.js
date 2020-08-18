const productsSection = document.querySelector('#products')
const cartDialog = document.querySelector('#dialog')
const cartButton = document.querySelector('#cart-button')
const lineItemsList = document.querySelector('#line-items')
  
const cart = {}
let products = [];

function addToCart(event){
  const theButtonThatGotClicked = event.currentTarget
  const priceId = theButtonThatGotClicked.closest('[data-priceid]').dataset.priceid
  if (cart[priceId]) {
    cart[priceId] += 1 
  }else {
    cart[priceId] = 1
  }
  renderCart()
}
  
function subtractFromCart(event){
  const theButtonThatGotClicked = event.currentTarget
  const priceId = theButtonThatGotClicked.closest('[data-priceid]').dataset.priceid
  if (cart[priceId] > 1){
    cart[priceId] -= 1 
  }else{
    delete cart[priceId]
  }
  renderCart()
}
  
const renderLineItem = priceId => {
  const product = products.find(prod => prod.price_id === priceId)
  const html = `
  <li data-priceid="${priceId}"> 
    <span>${product.name}: ${cart[priceId]}</span>
    <span>
      <button class="add">+</button>
      <button class="subtract">-</button>
    </span>
  </li>`
  const fragment = document.createRange().createContextualFragment(html)
  const addButton = fragment.querySelector('.add')
  const subtractButton = fragment.querySelector('.subtract')
  addButton.addEventListener('click', addToCart)
  subtractButton.addEventListener('click', subtractFromCart)
  return fragment
}

const renderCart = () => {
  cartDialog.open = true
  const priceIds = Object.keys(cart)
  const lineItems = priceIds.map(renderLineItem)
  lineItemsList.innerHTML = ''
  lineItemsList.prepend(...lineItems)
}

const toggleCart = () => {
  cartDialog.open = !cartDialog.open
}  


renderProduct = product => {
  const html = `
    <div class = "product" data-priceid="${product.price_id}">
       <img src = "${product.image}" alt="${product.name}"/>  
        <h2>${product.name}</h2>      
      <button class = "add-to-cart">
        Add <span class = "currency">$${product.currency}</span> 
        ${(product.price_cents / 100).toFixed(2)}</button>
      <p>${product.nutrition} cal</p>
    </div>`;
  const fragment = document.createRange().createContextualFragment(html);
  const button = fragment.querySelector('button');
  button.addEventListener('click', addToCart);
  return fragment;
}


async function fetchProducts(){
  const response = await fetch('/products');
  products = await response.json();
  const fragments = products.map(renderProduct);
  productsSection.innerHTML = '';
  productsSection.prepend(...fragments)
}


cartButton.addEventListener('click', toggleCart)

fetchProducts();