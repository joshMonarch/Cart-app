import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CatalogComponent } from '../catalog/catalog.component';
import { CartItem } from '../../models/cartItem';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router, RouterOutlet } from '@angular/router';
import { SharingDataService } from '../../services/sharing-data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'cart-app',
  standalone: true,
  imports: [
    CatalogComponent,
    NavbarComponent,
    RouterOutlet
  ],
  templateUrl: './cart-app.component.html'
})
export class CartAppComponent implements OnInit {

  items: CartItem[] = [];
  total: number = 0;

  constructor(
    private sharingDataService: SharingDataService,
    private productService: ProductService,
    private router: Router) { }

  ngOnInit(): void {
    this.items = JSON.parse(sessionStorage.getItem('cart')!) || [];
    this.calculateTotal();
    this.onDeleteCart(); // suscripción
    this.onAddCart(); // suscripción
  }

  onAddCart(): void {
    this.sharingDataService.productEventEmitter.subscribe(product => {
      const hasItem = this.items.find(item => item.product.id === product.id);
      if (hasItem) {
        this.items = this.items.map(item => {
          if (item.product.id === product.id) {
            return {
              ...item,
              quantity: item.quantity + 1
            }
          }
          return item;
        })
      } else {
        this.items = [...this.items, { product: { ...product }, quantity: 1 }]
      }
      this.calculateTotal();
      this.saveSession();
      this.router.navigate(
        ['/cart'],
        {
          state: {
            items: this.items,
            total: this.total
          }
        });
      Swal.fire({
        title: "Shopping Cart",
        text: "Nuevo producto agregado al carro",
        icon: "success"
      });
    });

  }

  onDeleteCart(): void {
    this.sharingDataService.idProductEventEmitter.subscribe(id => {
      Swal.fire({
        title: "Attention",
        text: "Seguro que quieres eliminar el producto del carro?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminalo"
      }).then((result) => {
        if (result.isConfirmed) {

          this.items = this.items.filter(item => item.product.id !== id);
          if (this.items.length == 0) {
            sessionStorage.removeItem('cart');
            sessionStorage.clear()
          }
          this.calculateTotal();
          this.saveSession();

          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate
              (['/cart'],
                {
                  state: { items: this.items, total: this.total }
                });
          });

          Swal.fire({
            title: "Eliminado!",
            text: "El producto ha sido eliminado",
            icon: "success"
          });
        }
      });

    })
  }

  calculateTotal(): void {
    this.total = this.items.reduce((accumulator, item) => accumulator + (item.quantity * item.product.price), 0);
  }

  saveSession(): void {
    sessionStorage.setItem('cart', JSON.stringify(this.items));
  }

}
