import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { debounceTime, tap, switchMap, finalize, filter, distinctUntilChanged, map } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css']
})
export class AutocompleteComponent implements OnInit,OnChanges {

  isLoading = false;
  isValid = false;
  @Input() form: FormGroup;
  @Input() filtro: string;
  @Input() name: string;
  @Input() placeHolder: string;
  @Input() responseType: string;
  @Input() read: boolean=false;

  objectFiltrados: [];
  filtroEnviar: any = {
    filtroObject: {
      filtro: []
    }
  }

  constructor(private _http:HttpClient){
  }

  ngOnChanges(changes:SimpleChanges){
    this.objectFiltrados = [];
    let formChange:FormGroup = changes.form.currentValue;
    this.form = formChange;
    this.loadingAuto();
  }

  ngOnInit(){
    this.loadingAuto();
  }

  loadingAuto() {
    this.form.controls[this.name].valueChanges
      .pipe(
        filter(x => x.length >= 3),
        debounceTime(700),
        tap(() => {
          this.objectFiltrados = [];
          this.isLoading = true;
        }),
        switchMap(value => {
          let url:string, extra:string = '';
          switch(this.filtro){
            case 'track':
              url = 'https://qd2uw2qwd7.execute-api.us-east-1.amazonaws.com/prd/tracks/search?name=';
              break;
            case 'genero':
              url ='https://x3x69cizjj.execute-api.us-east-1.amazonaws.com/dev/genero/search?search=';
              break;
            case 'formaPago':
              url ='https://xji0bduk94.execute-api.us-east-1.amazonaws.com/dev/tipoegresos/search?search=';
              break;
            case 'artista':
              url ='https://faxnnuihpj.execute-api.us-east-1.amazonaws.com/dev/artistas/search?search=';
              break;
            case 'tipo':
              url ='https://pykou7f7m8.execute-api.us-east-1.amazonaws.com/dev/tipoAlbum/search?search=';
              break;
            case 'tipoTrack':
              url ='https://qd2uw2qwd7.execute-api.us-east-1.amazonaws.com/prd/tracks/searchTiposTrack?search=';
              value = '';
              break;
            case 'pais':
              url = 'https://gpqgrg848i.execute-api.us-east-1.amazonaws.com/dev/pais/search?search=';
              break;
            case 'afiliado':
              url = 'https://38m3c0536e.execute-api.us-east-1.amazonaws.com/dev/afiliado/search?search=';
              break;
            case 'trackAnalitycs':
              url = 'https://ds2o6mr54h.execute-api.us-east-1.amazonaws.com/dev/analitycs/track?search=';
                break;
            case 'getArtista':
              url = 'https://ds2o6mr54h.execute-api.us-east-1.amazonaws.com/dev/account/aquery?search='
              extra = `&comboValue=${this.filtro}`;    
            default:
              url = `https://tsyxcs4qll.execute-api.us-east-1.amazonaws.com/dev/comboFilter?search=`;
              extra = `&comboValue=${this.filtro}`;
          }
          return (this._http.get(`${url}${value}${extra}`,{observe:'response'}))
            .pipe(
              map((result: any) => {
                return result.body.result;
              }),
              finalize(() => {
                this.isLoading = false
              })
            )
          } 
          )
      )
      .subscribe((data:any) => {
        if (data == undefined || data.length == 0) {
          this.isValid = false;
          this.form.controls[this.name].setErrors({'incorrect': true});
          this.objectFiltrados = [];
        }else{
          this.isValid = true;
          this.form.controls[this.name].setErrors({'incorrect': true});
          this.objectFiltrados = data;  
        }
      },error => {
        this.isValid = false;
        this.objectFiltrados = [];
      });
  }

  displayFnDescripcion(option){
    console.log("option",option);
      return option ? option.descripcion : undefined;
  }

  displayFnNombre(option){
    return option ? option.nombre : undefined;
  }
}