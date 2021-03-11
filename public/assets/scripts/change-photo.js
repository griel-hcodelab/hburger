import Cropper from "cropperjs"
import firebase from './firebase-app'

document.querySelectorAll('.change-photo').forEach(page => {

  let cropper = null
  let userGlobal = null
  const imageElement = page.querySelector('#photo-preview')
  const buttonElement = page.querySelector('.choose-photo')
  const inputFileElement = page.querySelector('#file')
  const form = imageElement.closest('form')
  const btnSubmit = form.querySelector("[type=submit]")
  const bodyElement =  document.body;
  const toast = form.querySelector('#app > section > main > form > div')

  const auth = firebase.auth()

  auth.onAuthStateChanged(user => {
    if (user) {
      userGlobal = user
      imageElement.src = user.photoURL || "https://i.pravatar.cc/256"
    }
  })

  const uploadFile = files => {
    if (files.length) {
      const file = files[0]

      const reader = new FileReader()

      reader.onload = () => {

        imageElement.src = reader.result

        form.classList.add("cropping")

        cropper = new Cropper(imageElement, {
          aspectRatio: 1 / 1
        })

      }

      reader.readAsDataURL(file);

    }
  }

  bodyElement.addEventListener("drop", e => {
    e.preventDefault()
    uploadFile(e.dataTransfer.files)
  })

  bodyElement.addEventListener("dragover", e => e.preventDefault())

  form.addEventListener("submit", e => {

    e.preventDefault()

    form.classList.remove("cropping")

    btnSubmit.disabled = true
    btnSubmit.innerHTML = "Salvando..."

    imageElement.src = cropper.getCroppedCanvas().toDataURL("image/png")

    const blob = cropper.getCroppedCanvas().toBlob(blob => {
      const storage = firebase.storage()

      const fileRef = storage.ref().child(`photos/${userGlobal.uid}.png`)

      fileRef
        .put(blob)
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(photoURL => userGlobal.updateProfile({ photoURL }))
        .then(() => {
          document.querySelector("header > img#avatar").src = userGlobal.photoURL
          userGlobal.photoURL
          console.log("Foto atualizada")
          toast.classList.add('open')
        })

      cropper.destroy()
    })


  })

  imageElement.addEventListener('click', () => {
    inputFileElement.click()
  })

  buttonElement.addEventListener('click', () => {
    inputFileElement.click()
  })

  inputFileElement.addEventListener('change', e => {
    uploadFile(e.target.files)
    e.target.value = "";
  })

})