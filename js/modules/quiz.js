import {addClassesToElement, createElementWithOptions, generateRandomID} from "./utils.js";

const defaultConfig = {
    quizID: generateRandomID(),
    questions: [
        {
            questionConfig: {
                bio: {
                    field: 'text',
                    label: 'Фио',
                    required: true,
                },
                phone: {
                    field: 'text',
                    label: 'Телефон',
                    required: true,
                },
                info: {
                    field: 'textarea',
                    label: 'Ваше сообщение',
                }
            },
            questionTitle: 'Личные данные',
            questionInfo: 'Эти данные нам нужны, чтобы с вами связался менеджер',
            id: 1,
        },
        {
            questionConfig: {
                test2: {
                    field: 'text',
                    label: 'Инфо',
                },
                test: {
                    field: 'dropdown',
                    label: 'Выберите любимое блюдо',
                    fieldValue: [
                        {
                            value: 'пирог',
                            label: 'Яблочный пирог',
                            default: true,
                        },
                        {
                            value: 'картошка',
                            label: 'Картошка',
                        }
                    ]
                }
            },
            questionTitle: 'Название карточки',
            questionInfo: 'Описание карточки',
            id: 2,
        },
    ],
};

export function generateQuiz(config) {
    const mergedConfig = {...defaultConfig, ...config};
    const {quizID, questions} = mergedConfig;
    const quizWrapper = document.querySelector('.quiz-questions');
    const prevButton = document.getElementById('quiz-prev');
    const answers = {};
    const nextButton = document.getElementById('quiz-next');
    const headerLogo = document.querySelector('.section-title a');

    prevButton.addEventListener('click', handlePrevClick);
    nextButton.addEventListener('click', handleNextClick);


    let questionIndex = 0;

    questions.forEach(question => {
        quizWrapper.insertAdjacentElement('beforeend', generateQuestion(question));
    });

    quizWrapper.insertAdjacentElement('beforeend', generateFinalQuestion());

    const questionElements = quizWrapper.querySelectorAll('.question');
    const finalElement = quizWrapper.querySelector('.quiz-final');
    addClassesToElement(questionElements[questionIndex], ['visible']);


    function generateQuestion(question) {
        const {id, questionTitle: title, questionInfo: info, questionConfig} = question;

        const questionWrapper = createElementWithOptions('form', {id: `question-${id}`});
        addClassesToElement(questionWrapper, ['question']);

        const questionTitle = createElementWithOptions('h2', {textContent: title})
        const questionInfo = createElementWithOptions('p', {textContent: info});

        questionWrapper.insertAdjacentElement('beforeend', questionTitle);
        questionWrapper.insertAdjacentElement('beforeend', questionInfo);

        const questionsFormControls = generateQuestionsForm(questionConfig);

        questionsFormControls.forEach(control => questionWrapper.insertAdjacentElement('beforeend', control));

        const errorsBlock = createElementWithOptions('div');
        addClassesToElement(errorsBlock, ['hidden', 'form-errors']);

        questionWrapper.insertAdjacentElement('beforeend', errorsBlock);
        return questionWrapper;
    }

    function generateQuestionsForm(config) {
        const controls = Object.keys(config).reduce((prev, curr) => {
            const controlType = config[curr].field;
            let element;
            switch (controlType) {
                case 'text': {
                    element = generateTextField(curr, config[curr]);
                    break;
                }

                case 'radio':
                case 'checkbox': {
                    element = generateRadioOrCheckboxField(curr, config[curr]);
                    break;
                }

                case 'dropdown':
                case 'multiple-dropdown': {
                    element = generateDropdownField(curr, config[curr]);
                    break;
                }
                case 'textarea': {
                    element = generateTextAreaField(curr, config[curr]);
                }
            }

            prev.push(element);
            return prev;
        }, [])

        return controls;
    }

    function handlePrevClick() {
        --questionIndex;

        if (questionIndex >= 0) {
            nextButton.textContent = 'Следующий';
            questionElements.forEach(question => question.classList.remove('visible'));
            questionElements[questionIndex].classList.add('visible');
            nextButton.classList.remove('hidden');
            return;
        }
        questionIndex = 0;
        prevButton.classList.add('hidden');
    }

    function checkFormValue() {
        const form = questionElements[questionIndex];
        const errorsWrapper = form.querySelector('.form-errors');
        errorsWrapper.innerHTML = '';
        if (form.checkValidity()) {
            questionElements.forEach(question => question.classList.remove('visible'));
            return true;
        }

        for (let i = 0; i < form.length; i++) {
            const item = form[i];


            if (item.validity.valueMissing) {

                errorsWrapper.insertAdjacentHTML('beforeend', `<p class='form-error'>
                    Поле ${questions[questionIndex].questionConfig[item.name].label} обязательно для заполнения
                </p>`)
            }
        }
        return false;
    }

    function handleNextClick() {
        checkFormValue() && ++questionIndex;

        const form = questionElements[questionIndex - 1 || 0];
        for (let i = 0; i < form.length; i++) {
            const item = form[i];

            if (item.checked) {
                answers[item.name] = item.value;
            } else {
                answers[item.name] = item.value;
            }

        }

        if (questionIndex === questions.length) {
            pickFinal();
            return;
        }


        if (questionIndex <= questions.length - 1) {
            nextButton.textContent = 'Следующий';

            if (questionIndex === questions.length - 1) {
                nextButton.textContent = 'Отправить'
            }

            prevButton.classList.remove('hidden');
            questionElements[questionIndex].classList.add('visible');
            return;
        }
        questionIndex = questions.length - 1;


        nextButton.classList.add('hidden');
    }

    function pickFinal() {
        questionElements.forEach(question => {
            question.classList.remove('visible');
            for(let i = 0; i < question.length; i++) {
                const item = question[i];
                item.value = '';
            }
        });
        finalElement.classList.add('visible');
        nextButton.classList.add('hidden');
        prevButton.classList.add('hidden');
        setTimeout(() => {
            headerLogo.click();
        }, 10000)
        console.log(answers);
    }

    function generateFinalQuestion() {
        const finalElement = createElementWithOptions('div');
        finalElement.classList.add('quiz-final');
        const finalTitle = createElementWithOptions('h2', {textContent: "Спасибо, за вашу заявку"});
        const finalInfo = createElementWithOptions('p', {textContent: 'Наш менеджер свяжется с вами в ближайшее время'});
        finalElement.insertAdjacentElement('beforeend', finalTitle);
        finalElement.insertAdjacentElement('beforeend', finalInfo);
        return finalElement;
    }

    function generateTextField(key, element) {
        const elementID = generateRandomID();
        const rootElement = createElementWithOptions('label', {
            for: elementID,
            textContent: element.label + (element.required ? ' *' : '')
        });
        const inputElement = createElementWithOptions('input', {
            name: key,
            type: element.field,
            value: element.value ?? '',
            required: element.required
        });
        rootElement.insertAdjacentElement('beforeend', inputElement);

        return rootElement;
    }

    function generateRadioOrCheckboxField(key, element) {
        const rootElement = createElementWithOptions('div', {textContent: element.label});
        element.fieldValue.forEach(fieldValue => {
            const elementID = generateRandomID();
            const labelElement = createElementWithOptions('label', {for: elementID, textContent: fieldValue.label});
            const inputElement = createElementWithOptions('input', {
                name: key,
                type: element.field,
                value: fieldValue.value,
                checked: fieldValue.default
            });

            labelElement.insertAdjacentElement('beforeend', inputElement);
            rootElement.insertAdjacentElement('beforeend', labelElement);
        });

        return rootElement;
    }

    function generateDropdownField(key, element) {
        const elementID = generateRandomID();
        const rootElement = createElementWithOptions('label', {for: elementID});
        const selectElement = createElementWithOptions('select', {id: elementID, name: key});
        element.fieldValue.forEach(fieldValue => {
            const optionElement = createElementWithOptions('option', {
                textContent: fieldValue.label,
                value: fieldValue.value,
                selected: !!fieldValue.required,
            });
            selectElement.insertAdjacentElement('beforeend', optionElement);
        });
        rootElement.insertAdjacentElement('beforeend', selectElement);
        return rootElement;
    }

    function generateTextAreaField(key, element) {
        const elementID = generateRandomID();
        const rootElement = createElementWithOptions('label', {for: elementID, textContent: element.label});
        const inputElement = createElementWithOptions('textarea', {
            id: elementID,
            name: key,
            required: element.required,
        });
        rootElement.insertAdjacentElement('beforeend', inputElement);
        return rootElement;
    }
}