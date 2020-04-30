import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn:'root'
})
export class CryptoService {

  private key:string = 'pMpjo5429#@-.&';
  constructor() { }

  set(value){
    var encrypted = CryptoJS.AES.encrypt(value, this.key);
    return encrypted.toString();
  }

  get(value){
    var key = CryptoJS.enc.Utf8.parse(this.key);
    var decrypted = CryptoJS.AES.decrypt(value, this.key);
    return decrypted.toString(CryptoJS.enc.Utf8);
  }








}




