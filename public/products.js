const cart = {}
let products = [];
let sanityData = {}

const sanityUrl = 'https://6buksnvq.api.sanity.io/v1/graphql/production/default'
const sanityQuery =`
query {
  allSiteSettings{
    menuHeroText
    logo{
      asset{
        url
      }
    }
    bagIcon{
      asset{
        url
      }
    }
  }
 allCategory{
    name 
   primaryImage{
     asset{
       url
     }
   }
   carouselImage{
     asset{
       url
     }
   }
 }
}
`

const productsSection = document.querySelector('#products')
const categoriesSection = document.querySelector('#categories');
const cartDialog = document.querySelector('#dialog')
const cartButton = document.querySelector('#cart-button')
const lineItemsList = document.querySelector('#line-items')
const logo = document.querySelector('#logo')
const bagIcon = document.querySelector('#bag-icon')
const backtoMainMenu = document.querySelector('#back-to-main-menu')

//so data comes back from API as an object//
async function fetchSanityData(){
  const response = await fetch(sanityUrl, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ query: sanityQuery})
  })
  const { data } = await response.json()
  console.log(data)
  sanityData = data
}

async function initialPageLoad(){
  await fetchSanityData()
  bagIcon.src = sanityData.allSiteSettings[0].bagIcon.asset.url
  bagIcon.classList.remove('hidden')
  logo.src = sanityData.allSiteSettings[0].logo.asset.url
  logo.classList.remove('hidden')
  const fragments = sanityData.allCategory.map(renderCategory)
  categoriesSection.innerHTML = ''
  categoriesSection.prepend(...fragments)
}

const renderCategory = category => {
  const html = `
    <button class="category" data-category="${category.name}">
      <img 
        src="${category.primaryImage.asset.url}" 
        alt="${category.name}"
        data-primaryimage="${category.primaryImage.asset.url}" 
        data-carouselimage="${category.carouselImage.asset.url}" 
      />
      <h2>${category.name}</h2>
    </button>`
  const fragment = document.createRange().createContextualFragment(html)
  const button = fragment.querySelector('button')
  button.addEventListener('click', selectCategory)
  return fragment
}


const selectCategory = event => {
  categoriesSection.classList.add('carousel')
  const theButtonThatGotClicked = event.currentTarget
  const allCategories = document.querySelectorAll('.category')
  allCategories.forEach(category => {
    category.classList.remove('selected')
    const img = category.querySelector('img')
    img.src = img.dataset.carouselimage
  })
  theButtonThatGotClicked.classList.add('selected')
  const selectedCategory = theButtonThatGotClicked.dataset.category
  const filteredProducts = products.filter(
    product => product.category === selectedCategory
  )
  const fragments = filteredProducts.map(renderProduct);
  productsSection.innerHTML = '';
  productsSection.prepend(...fragments);  
}

const unselectCategory = () => {
  categoriesSection.classList.remove('carousel')
  const allCategories = document.querySelectorAll('.category')
  allCategories.forEach(category => {
    category.classList.remove('selected')
    const img = category.querySelector('img')
    img.src = img.dataset.primaryimage
  })
  productsSection.innerHTML = '';
}


function addToCart(event){
  console.log('clicked')
  const theButtonThatGotClicked = event.currentTarget
  const priceId = theButtonThatGotClicked.closest('[data-priceid]').dataset.priceid
  if (cart[priceId]) {
    cart[priceId] += 1 
  }else {
    cart[priceId] = 1
  }
  console.log(cart)
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
      <p>${product.nutrition} Cal</p>
    </div>`;
  const fragment = document.createRange().createContextualFragment(html);
  const button = fragment.querySelector('button');
  button.addEventListener('click', addToCart);
  return fragment;
}

async function fetchProducts(){
  const response = await fetch('/products');
  products = await response.json();
}

cartButton.addEventListener('click', toggleCart)
backtoMainMenu.addEventListener('click', unselectCategory)

initialPageLoad()
fetchProducts();