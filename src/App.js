import React from 'react';
import ReactDOM from 'react-dom';
import Main from './componets/Main';
import { sanityUrl, sanityQuery } from './data/Sanity';

const App = () => {
  const [siteSettings, setSiteSettings] = React.useState({
    bagIcon: { asset: { url: '' } },
    logo: { asset: { url: '' } },
    menuHeroText: '',
  });
  const [categories, setCategories] = React.useState([]);
  const [products, setProducts] = React.useState([]);

  const fetchSanityData = async () => {
    const response = await fetch(sanityUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ query: sanityQuery }),
    });
    const { data } = await response.json();
    console.log(data)
    // sanityData = data;
    setSiteSettings(data.allSiteSettings[0]);
    setCategories(data.allCategory);
  };

  const fetchProducts = async () => {
    const response = await fetch('/products');
    data = await response.json();
    setProducts(data);
  };

  React.useEffect(() => {
    fetchSanityData();
    fetchProducts();
  }, []);

  return (
    <>
      <Main siteSettings={siteSettings} categories={categories} products={products}/>
    </>
  );
};
ReactDOM.render(<App />, document.querySelector('#root'));
