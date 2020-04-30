export class  Usuario {
    
    UsuarioAplicacion:string;
    Nombre:string;
    Perfil:string;

    constructor(usuarioAplicacion:string,nombre:string,perfil:string){
        this.UsuarioAplicacion = usuarioAplicacion;
        this.Nombre = nombre;
        this.Perfil = perfil;
    }

}