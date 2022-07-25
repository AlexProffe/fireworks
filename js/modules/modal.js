export function modal() {
  const modalWrapper = document.getElementById("modal");
  const modalContent = document.querySelector(".modal-content");
  const openButtons = document.querySelectorAll("[data-modal='form']");
  const modalForm = document.querySelector(".modal-form");
  const modalInfo = document.querySelector(".modal-info");
  const htmlElement = document.querySelector(".html");
  const closeButton = document.getElementById("close-modal");

  openButtons.forEach((button) => {
    button.addEventListener("click", () => {
      modalWrapper.classList.add("visible");
      htmlElement.classList.add('html-no-scroll');
    });
  });

  closeButton.addEventListener('click', e => {
    e.stopPropagation();
    modalWrapper.classList.remove("visible");
    htmlElement.classList.remove('html-no-scroll');
  })

  modalContent.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  modalWrapper.addEventListener("click", () => {
    modalWrapper.classList.remove("visible");
    modalInfo.classList.add('hidden');
    modalContent.classList.remove('hidden');
    htmlElement.classList.remove('html-no-scroll');
  });

  modalForm.addEventListener("submit", sendMail);

  async function sendMail(e) {
    e.preventDefault();

    const [name, phone, city] = modalForm;

    const data = {
      name: name.value,
      phone: phone.value,
      city: city.value,
    };

    const request = await fetch("sendmail.php", {
        method: "POST",
        body: JSON.stringify(data),
    });
    console.log(request);
    name.value = '',
    phone.value = '',
    city.value = '',
    modalForm[3].value = false;
    
    modalContent.classList.add('hidden');
    modalInfo.classList.remove('hidden');

    setTimeout( () => {
        modalContent.classList.remove('hidden');
        modalInfo.classList.add('hidden');
        modalWrapper.classList.remove('visible');
        htmlElement.classList.remove('html-no-scroll');
    }, 2500)

    //const result = await request.json();
    
  }
}
