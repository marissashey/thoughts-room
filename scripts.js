
const input = document.getElementById('input');
const tailHolder = document.getElementById('tailHolder');

input.addEventListener('input', function(e) {
  const {value} = this;



  if (value.includes('.')) {
    cretaeTail(value);
    this.value='';
    
  }
  
});

function cretaeTail(text) {
  const tail = document.createElement('div');
  tail.classList.add('gravity');
  tail.innerHTML = text;
  
  tailHolder.append(tail);
  setTimeout(() => tail.remove(), 1000);
  requestAnimationFrame(() => {
    tail.classList.add('fall-right');
  });
}
