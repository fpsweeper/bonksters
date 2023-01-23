import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

  products = [
    {
      title: 'Active: Relax CBD Oil Cherry Flavour Drops 30ml' ,
      brand: 'https://www.quickvit.co.uk/media/amasty/shopby/option_images/Vitality-CBD.jpg',
      subtitle: 'Strength 500mg / 1000mg / 2000mg',
      img: 'https://cdn.shopify.com/s/files/1/0085/2846/1905/products/Relax-500-Box-_-Bottle_add1cea0-4381-4465-b3b9-0c7a32a22454_1100x.png?v=1618483405',
      startprice: '$19.99 USD' 
    },
    {
      title: 'Active: Relax CBD Oil Cherry Flavour Drops 30ml' ,
      brand: 'https://www.quickvit.co.uk/media/amasty/shopby/option_images/Vitality-CBD.jpg',
      subtitle: 'Strength 500mg / 1000mg / 2000mg',
      img: 'https://cdn.shopify.com/s/files/1/0085/2846/1905/products/Relax-500-Box-_-Bottle_add1cea0-4381-4465-b3b9-0c7a32a22454_1100x.png?v=1618483405',
      startprice: '$19.99 USD' 
    },
    {
      title: 'Active: Recover CBD Oil Lemon Flavour Drops 30ml' ,
      brand: 'https://www.quickvit.co.uk/media/amasty/shopby/option_images/Vitality-CBD.jpg',
      subtitle: 'Strength 500mg / 1000mg / 2000mg',
      img: 'https://cdn.shopify.com/s/files/1/0085/2846/1905/products/Recover-500-Box-_-Bottle_cb1d8439-d47f-47d9-8a77-ea94551266da_1100x.png?v=1618484166',
      startprice: '$19.99 USD' 
    },
    {
      title: 'Active: Focus CBD Oil Lime Flavour Drops 30ml' ,
      brand: 'https://www.quickvit.co.uk/media/amasty/shopby/option_images/Vitality-CBD.jpg',
      subtitle: 'Strength 500mg / 1000mg / 2000mg',
      img: 'https://cdn.shopify.com/s/files/1/0085/2846/1905/products/Focus-500-Box-_-Bottle_9965393a-ab00-4fc2-9dd5-51ccd0cc7d0c_1100x.png?v=1626365274',
      startprice: '$19.99 USD' 
    },
    {
      title: 'Active: Boost CBD Oil Orange Flavour Drops 30ml' ,
      brand: 'https://www.quickvit.co.uk/media/amasty/shopby/option_images/Vitality-CBD.jpg',
      subtitle: 'Strength 500mg / 1000mg / 2000mg',
      img: 'https://cdn.shopify.com/s/files/1/0085/2846/1905/products/Boost-500-Box-_-Bottle_d4659ec4-6d03-4fdb-aeab-7b2930cd7801_1100x.png?v=1618482637',
      startprice: '$19.99 USD' 
    },
    {
      title: 'Active: Muscle Rub 50ml $29.99 ' ,
      brand: 'https://www.quickvit.co.uk/media/amasty/shopby/option_images/Vitality-CBD.jpg',
      subtitle: 'Strength 500mg / 1000mg / 2000mg',
      img: 'https://cdn.shopify.com/s/files/1/0085/2846/1905/products/Muscle-Balm-Box-_-Tub_1100x.png?v=1610154834',
      startprice: '$19.99 USD' 
    }
    
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
