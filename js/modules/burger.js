export function burger() {
    const burgerModal = document.getElementById("burger");
    const burgerModalContent = document.querySelector(".burger-content");
    const openModalButton = document.getElementById("burger-open");
    const closeModalButton = document.getElementById("close-burger");
    const links = burgerModalContent.querySelectorAll('*');
    const htmlElement = document.querySelector(".html");

    burgerModal.style.display = null;

    links.forEach(link => {
        link.addEventListener('click', () => {
            burgerModal.classList.remove("visible");
            htmlElement.classList.remove('html-no-scroll');
        })
    })


    openModalButton.addEventListener("click", () => {
        toggleModalVisibility();

        htmlElement.classList.add('html-no-scroll');
    });

    closeModalButton.addEventListener("click", (e) => {
        e.stopPropagation();
        burgerModal.classList.remove("visible");
        htmlElement.classList.remove('html-no-scroll');
    });

    burgerModalContent.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    burgerModal.addEventListener("click", () => {
        toggleModalVisibility();
        htmlElement.classList.remove('html-no-scroll');
    });

    function toggleModalVisibility() {
        burgerModal.classList.toggle("visible");
    }
}