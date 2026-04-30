 window.addEventListener('scroll', function() {
      let num = window.scrollY / window.innerHeight;
      let x = 0;

      document.getElementById('filler').style.display = 'none';

      if(num <= 1) {
        document.getElementById('three').style.opacity = 1-num;
        x = (1-num)*2;
      } else if(num > 1 && num <= 2) {
        document.getElementById('four').style.opacity = 2-num;
        x = (2-num)*2;
      } else if(num > 2 && num <= 3) {
        document.getElementById('five').style.opacity = 3-num;
        x = (3-num)*2;
      } else {
        document.getElementById('filler').style.display = 'block';
      }
    })