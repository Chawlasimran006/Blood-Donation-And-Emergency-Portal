let btn = document.querySelector('#toggle-bnt');
let menu = document.querySelector('.menu');
let count = 1;
btn.addEventListener('click',()=>{
    if(count == 1){
       menu.style.left = "0";
       count = 1-count;
     }
     else if(count == 0){
       menu.style.left = "-100%";
       count = 1-count;
     }
});


