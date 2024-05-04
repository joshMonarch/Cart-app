import { ProductService } from './../../services/product.service';
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, catchError, exhaustMap, map } from 'rxjs';
import { findAll, load } from '../products.actions';

@Injectable()
export class ProductsEffects {

  loadProduct$ = createEffect(
    () => this.actions$.pipe(
      ofType(load),
      exhaustMap(() => this.ProductService.findAll())
    ).pipe(
      map( products => ( findAll({ products }))),
      catchError(() => EMPTY)
    )
  );

  constructor(
    private actions$: Actions,
    private ProductService: ProductService,
  ) {}

}
