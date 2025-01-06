



// API for adding serv_center

const addServCenter = async () => {

  try{

    const {sc_name, sc_email, password, serviceType, city, state} = req.body

    const imageFile = req.file 

    console.log({sc_name, sc_email, password, serviceType, city, state, image})

  } catch (error) {

  }

}

export {addServCenter}