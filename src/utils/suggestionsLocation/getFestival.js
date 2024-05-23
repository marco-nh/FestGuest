function getFestivalTransportReservation(query){
    const festivalForm = document.getElementById("festivalName")
    const festivales = JSON.parse(localStorage.getItem('events'))
    if (festivales != null){
      festivales.forEach((fes) => {
        console.log(fes[1],query)
        if (fes[1].includes(query)){
          const festival = document.createElement('option');
          festival.textContent = fes[0];
          festival.value = fes[0];
          festival.setAttribute("id", fes[0])
          if (document.getElementById(fes[0]) == null){
            festivalForm.appendChild(festival)
          }
        } 
      })
    }
  }
  
  function cleanFestivalReservation(){
    const festivalForm = document.getElementById("festivalName")
    festivalForm.textContent = ""
  }


  export {getFestivalTransportReservation, cleanFestivalReservation}