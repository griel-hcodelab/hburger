document.querySelectorAll("#app").forEach(page => {

    
    const openAside = page.querySelector("aside")
    const closeAside = openAside.querySelector("footer .close")

    if (openAside) {
        openAside.addEventListener("click", e => {
            openAside.classList.add("open")
        })
    }

    if(closeAside) {
        closeAside.addEventListener("click", e => {
            openAside.classList.remove("open")
        })
    }


})


