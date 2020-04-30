import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { CryptoService } from '../../servicios/crypto/crypto.service';
import { Usuario } from '../../modelos/usuario';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
              private router:Router,
              private route:ActivatedRoute,
              private _cryptoService:CryptoService ) { }

  usuario:Usuario;

  isLoggedIn$:Observable<boolean>;

  ngOnInit() {
   
    
  }

  logout(){
   
  }

 
  




}
