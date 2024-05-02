import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card.component';
import { Product } from '../../models/product';
import { Router } from '@angular/router';
import { SharingDataService } from '../../services/sharing-data.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'catalog',
  standalone: true,
  imports: [
    ProductCardComponent
  ],
  templateUrl: './catalog.component.html'
})
export class CatalogComponent implements OnInit{

  products!: Product[];


  constructor(
    private productService: ProductService,
    private sharingDataService: SharingDataService) {}

  ngOnInit(): void {
    if (!this.products) {
      this.products = this.productService.findAll();
    }
  }

  onAddCart(product: Product){
    this.sharingDataService.productEventEmitter.emit(product);
  }

}
