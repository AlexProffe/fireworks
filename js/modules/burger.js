

export function burger() {
    const burgerModal = document.getElementById("burger");
    const burgerModalContent = document.querySelector(".burger-content");
    const openModalButton = document.getElementById("burger-open");
    const closeModalButton = document.getElementById("close-burger");
    const links = burgerModalContent.querySelectorAll('*');

    links.forEach(link => {
        link.addEventListener('click', () => {
            burgerModal.classList.remove("visible");
        })
    })


    openModalButton.addEventListener("click", () => {
        toggleModalVisibility();
    });

    closeModalButton.addEventListener("click", (e) => {
        e.stopPropagation();
        burgerModal.classList.remove("visible");
    });

    burgerModalContent.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    burgerModal.addEventListener("click", () => {
        toggleModalVisibility();
    });

    function toggleModalVisibility() {
        burgerModal.classList.toggle("visible");
    }
}