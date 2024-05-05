document.addEventListener('DOMContentLoaded', function() {

  var userPhoto = localStorage.getItem('userPhoto');
  if (userPhoto !== null && userPhoto !== undefined) {

      var profileImage = document.getElementById('imageUserElement')
      profileImage.src = userPhoto
      console.log(userPhoto)
  } else {
      // Si no hay valor en localStorage, mostrar un mensaje de error o establecer un valor predeterminado
      profileImage.src = "/src/images/photoPred.png"
  }
  })