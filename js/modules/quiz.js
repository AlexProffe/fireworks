const defaultConfig = {
    quizID: Math.floor(Math.random() * new Date().getTime()),
    questions: [
        {
            questionConfig: {
                name: {
                    field: 'text',
                    label: 'Имя',
                    required: true,
                },
                phone: {
                    field: 'text',
                    label: 'Телефон',
                    required: true,
                },
                sex: {
                    field: 'radio',
                    label: 'Пол',
                    fieldValue: [
                        {
                            value: 'M',
                            label: 'Мужчина',
                            default: true,
                        },
                        {
                            value: 'W',
                            label: 'Женщина',
                        }
                    ]
                }
            },
            questionTitle: 'Название карточки',
            questionInfo: 'Описание карточки',
            id: 1,
        },
        {
            questionConfig: {
                info: {
                    field: 'text',
                    label: 'Инфо',
                },
            },
            questionTitle: 'Название карточки',
            questionInfo: 'Описание карточки',
            id: 2,
        },
    ],
};

export function generateQuiz(config) {
    const mergedConfig = {...defaultConfig, ...config};
    const { quizID, questions } = mergedConfig;
    const quizWrapper = document.querySelector('.quiz-questions');
    const prevButton = document.getElementById('quiz-prev');
    const answers = {};
    const nextButton = document.getElementById('quiz-next');

    prevButton.addEventListener('click', handlePrevClick);
    nextButton.addEventListener('click', handleNextClick);
    

    let questionIndex = 0;

    questions.forEach(question => {
        quizWrapper.insertAdjacentElement('beforeend', generateQuestion(question));
    });
    
    quizWrapper.insertAdjacentElement('beforeend', generateFinalQuestion());

    const questionElements = quizWrapper.querySelectorAll('.question');
    const finalElement = quizWrapper.querySelector('.quiz-final');
    questionElements[questionIndex].classList.add('visible');


    function generateQuestion(question) {
        const { id, questionTitle: title, questionInfo: info, questionConfig } = question;

        const questionWrapper = createElementWithOptions('form', {id: `question-${id}`});
        questionWrapper.classList.add('question');
        const questionTitle = createElementWithOptions('h2', {textContent: title})
        const questionInfo = createElementWithOptions('p', {textContent: info});

        questionWrapper.insertAdjacentElement('beforeend', questionTitle);
        questionWrapper.insertAdjacentElement('beforeend', questionInfo);

        const questionsFormControls = generateQuestionsForm(questionConfig);
        
        questionsFormControls.forEach(control => questionWrapper.insertAdjacentElement('beforeend', control));

        const errorsBlock = createElementWithOptions('div');
        errorsBlock.classList.add('hidden');
        errorsBlock.classList.add('form-errors');
        
        questionWrapper.insertAdjacentElement('beforeend', errorsBlock);
        return questionWrapper;
    }

    function generateQuestionsForm(config) {
        const controls = Object.keys(config).reduce((prev, curr) => {
            if(config[curr].fieldValue && config[curr].fieldValue.length) {
                const rootElement = createElementWithOptions('div', {textContent: config[curr].label});
                config[curr].fieldValue.forEach(fieldValue => {
                    const elementID = Math.floor(Math.random() * new Date().getTime());
                    const element = createElementWithOptions('label', {for: elementID, textContent: fieldValue.label});
                    const inputElement = createElementWithOptions('input', {
                        name: curr, 
                        type: config[curr].field, 
                        value: fieldValue.value,
                        checked: fieldValue.default
                    });
                    element.insertAdjacentElement('beforeend', inputElement);
                    rootElement.insertAdjacentElement('beforeend',element);
                });
                prev.push(rootElement);
                return prev;
            }
            const elementID = Math.floor(Math.random() * new Date().getTime());
            const element = createElementWithOptions('label', {for: elementID, textContent: config[curr].label + (config[curr].required ? ' *' : '')});
            const inputElement = createElementWithOptions('input', {name: curr, type: config[curr].field, value: config[curr].value ?? '', required: config[curr].required });
            element.insertAdjacentElement('beforeend', inputElement);
            
            prev.push(element);
            return prev;
        }, []) 

        return controls;
    }

    function handlePrevClick() {
       --questionIndex;

        if(questionIndex >= 0) {
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
        if(form.checkValidity()) {
            questionElements.forEach(question => question.classList.remove('visible'));
            return true;
        } 
        
        for(let i = 0; i < form.length; i++) {
            const item = form[i];


            if(item.validity.valueMissing) {
                
                errorsWrapper.insertAdjacentHTML('beforeend', `<p class='form-error'>
                    Поле ${questions[questionIndex].questionConfig[item.name].label} обязательно для заполнения
                </p>`)
            }
        }
        return false;
    }

    function handleNextClick() {
        checkFormValue() && ++questionIndex;

        const form = questionElements[questionIndex - 1];
        for(let i = 0; i < form.length; i++) {
            const item = form[i];

            if(item.checked) {
                answers[item.name] = item.value;
            } else {
                answers[item.name] = item.value;
            }
            
        }

        if(questionIndex === questions.length) {
            pickFinal();
            return;
        }

        

        if(questionIndex <= questions.length - 1) {
            nextButton.textContent = 'Следующий';

            if(questionIndex === questions.length - 1) {
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
        questionElements.forEach(question => question.classList.remove('visible'));
        finalElement.classList.add('visible');
        nextButton.classList.add('hidden');
        prevButton.classList.add('hidden');
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

    function createElementWithOptions(tagName, options) {
        const element = document.createElement(tagName);
        return Object.assign(element, options);
    }
}