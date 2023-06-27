 export function formatNumber(number) {
    // Check if the input is a valid number
   
    let num = +number
  
    // Format the number with thousand comma separator and always display two decimal places
    return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  