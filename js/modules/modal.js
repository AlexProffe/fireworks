export function modal() {
  const body = document.querySelector('body');

  body.insertAdjacentHTML(
    "beforeend",
    ` <div id="modal">
  <div class="modal-content">
      <h2 class="section-title modal-title">Заказать фейерверк по акции</h2>
      <p class="section-description modal-description">Менеджер свяжется с Вами для уточнения деталей</p>
      <form action="sendmail.php" class="modal-form">
        <p style="font-family: 'Exo 2', sans-serif;">Поля обозначенные звёздочкой(*), обязательны для заполнения</p>
          <label for="name"><input class="form-control" type="text" placeholder="Имя*" id="name" required="true" minlength="2"></label>
          <label for="phone"><input class="form-control" type="text" placeholder="Телефон*" id="phone" required="true" minlength="9"></label>
          <label for="city"><input class="form-control" type="text" placeholder="Город*" required="true" minlength="3"></label>
          <label for="info">
              <textarea placeholder="Ваша информация" id="info" class="form-control form-control-2x"></textarea>
          </label>
          <label>
              <input type="checkbox" name="accept-personal-info" class="form-checkbox" required="true">
              Согласен на обработку персональных данных*
          </label>
          <button type="submit">Отправить</button>
      </form>
  </div>
  <div class="modal-info hidden">
      <h2 class="section-title">Сообщение успешно отправлено, благодарим вас за ваше cообщение</h2>
  </div>
  <button id="close-modal">
      <i class="fa-solid fa-times"></i>
  </button>
</div>`
  );

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
      htmlElement.classList.add("html-no-scroll");
    });
  });

  closeButton.addEventListener("click", (e) => {
    e.stopPropagation();
    modalWrapper.classList.remove("visible");
    htmlElement.classList.remove("html-no-scroll");
  });

  modalContent.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  modalWrapper.addEventListener("click", () => {
    modalWrapper.classList.remove("visible");
    modalInfo.classList.add("hidden");
    modalContent.classList.remove("hidden");
    htmlElement.classList.remove("html-no-scroll");
  });

  modalForm.addEventListener("submit", sendMail);

  async function sendMail(e) {
    e.preventDefault();

    const [name, phone, city, info, checkbox] = modalForm;

    const data = {
      name: name.value,
      phone: phone.value,
      city: city.value,
      message: info.value,
    };
    const link = window.location.pathname.includes('pages')
      ? '../sendmail.php'
      : 'sendmail.php';
    const request = await fetch(link, {
      method: "POST",
      body: JSON.stringify(data),
    });
    console.log(request);
    name.value = '';
    phone.value = '';
    city.value = '';
    info.value = '';
    checkbox.value = false;

    modalContent.classList.add("hidden");
    modalInfo.classList.remove("hidden");

    setTimeout(() => {
      modalContent.classList.remove("hidden");
      modalInfo.classList.add("hidden");
      modalWrapper.classList.remove("visible");
      htmlElement.classList.remove("html-no-scroll");
    }, 2500);

    const result = await request.text();
  }
}
