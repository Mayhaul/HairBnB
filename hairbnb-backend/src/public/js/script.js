// public/js/script.js

(() => {
  'use strict';

  // Fetch all forms that need custom Bootstrap validation
  const forms = document.querySelectorAll('.needs-validation');

  // Loop over them and prevent submission on invalid inputs
  Array.from(forms).forEach((form) => {
    form.addEventListener('submit', (event) => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }

      // Adds the Bootstrap class that displays green/red borders & feedback text
      form.classList.add('was-validated');
    }, false);
  });
})();