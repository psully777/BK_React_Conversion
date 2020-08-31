export const sanityUrl =
  'https://6buksnvq.api.sanity.io/v1/graphql/production/default';

export const sanityQuery = `
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
   _id
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
`;
