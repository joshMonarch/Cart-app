import { EventEmitter, Injectable } from '@angular/core';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class SharingDataService {

  private _idProductEventEmitter: EventEmitter<number> = new EventEmitter();
  private _productEventEmitter: EventEmitter<Product> = new EventEmitter();

  constructor() { }

  get idProductEventEmitter() {
    return this._idProductEventEmitter;
  }

  get productEventEmitter() {
    return this._productEventEmitter;
  }
}
