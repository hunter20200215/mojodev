export  class utilidad{
  
    public static formatter(curr){
        
      let currency =  new Intl.NumberFormat('de-DE', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits:5,
    
        }).format(curr);
       return `$${currency.replace('$','')}`;
    } 
}