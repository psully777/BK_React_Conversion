const productsSection = document.querySelector('#products')

function handleButtonClick(event){
  console.log(`You clicked ${event.currentTarget.innerText}`)
}

renderProduct = product => {
  const html = `
    <div class = "product">
       <img src = "${product.image}" alt="${product.name}"/>  
        <h2>${product.name}</h2>      
      <button class = "add-to-cart">
        Add <span class = "currency">$${product.currency}</span> 
        ${(product.price_cents / 100).toFixed(2)}</button>
      <p>${product.nutrition} cal</p>
    </div>`;
  const fragment = document.createRange().createContextualFragment(html);
  const button = fragment.querySelector('button');
  button.addEventListener('click', handleButtonClick);
  return fragment;
}

let products = [];

async function fetchProducts(){
  const response = await fetch('/products');
  products = await response.json();
  const fragments = products.map(renderProduct);
  productsSection.innerHTML = '';
  productsSection.prepend(...fragments)
}

fetchProducts();