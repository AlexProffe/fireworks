const sliderDefaultOptions = {
    isArrowsVisible: true,
    isDotsVisible: false,
    slidesPerPage: 1,
    gap: 40,
    slidesPerScroll: 1,
    leftArrow: '.left-control',
    rightArrow: '.right-control',
    breakpoints: {
        320: {
            slidesPerPage: 1,
        },
        640: {
            slidesPerPage: 1,
        },
        720: {
            slidesPerPage: 3,
        },
        860: {
            slidesPerPage: 2,
        },
    },
};

export function slider(selector, options = {}) {
    const mergedOptions = { ...sliderDefaultOptions, ...options };
    const slider = document.querySelector(selector);

    const sliderItems = slider.querySelectorAll(`${selector} > *`);

    const sliderItemsCount = sliderItems.length;

    const { gap = 40, leftArrow, rightArrow } = mergedOptions;
    let { slidesPerPage, slidesPerScroll } = mergedOptions;
    const leftArrowButton = document.querySelector(leftArrow);
    const rightArrowButton = document.querySelector(rightArrow);

    let position = 0;

    let itemWidth =  Math.round(window.outerWidth / slidesPerPage);

    let movePosition = itemWidth * slidesPerScroll;


    initWindowResizeEventListener();


    function setPosition() {
        slider.style.transform = `translateX(${position}px)`;
    }



    function initWindowResizeEventListener() {
        function onResize() {
            breakpointCheck();
            
            itemWidth =  Math.round(window.outerWidth / slidesPerPage);
            slider.style.width = `${(window.outerWidth / slidesPerPage) * sliderItemsCount}px`;
            movePosition = itemWidth * slidesPerScroll;
            position = 0;
            rangeCheck();
        }

        window.addEventListener("resize", () => {
            onResize();
            setPosition();
        });
        onResize();
    }


    function breakpointCheck() {
        const keysArray = Object.keys(mergedOptions.breakpoints).filter(key => +key <= window.outerWidth);
        const lastIndex = keysArray[keysArray.length - 1];
        slidesPerPage = mergedOptions.breakpoints[lastIndex]?.slidesPerPage ?? 1;
    }



    leftArrowButton.addEventListener('click', () => {
        calculateDescendingDirection();
    });

    rightArrowButton.addEventListener('click', () => {
        calculateAscendingDirection();
    });

    function calculateDescendingDirection() {

        const leftSlides = Math.floor(Math.abs(Math.abs(position) / (itemWidth + gap * (slidesPerScroll - 1))));
       
        position += leftSlides >= slidesPerScroll
            ? movePosition
            : leftSlides * itemWidth ;

        setPosition();
        rangeCheck();
    }

    function calculateAscendingDirection() {
        const itemsLeft = sliderItemsCount - Math.floor((Math.abs(position) + slidesPerPage * itemWidth + gap * (slidesPerScroll - 1)) / itemWidth);
       
        if (itemsLeft <= 0) return;
        position -= itemsLeft >= slidesPerScroll
            ? movePosition
            : (itemsLeft * itemWidth) + (gap * itemsLeft - 1);

        setPosition();
        rangeCheck();
    }


    function rangeCheck() {
        position === 0
            ? leftArrowButton.setAttribute('disabled', true)
            : leftArrowButton.removeAttribute('disabled');
        const currentPosition = -(sliderItemsCount - slidesPerPage) * (itemWidth + gap * (slidesPerScroll - 1));

        position <= currentPosition
            ? rightArrowButton.setAttribute('disabled', true)
            : rightArrowButton.removeAttribute('disabled');
    }

    let obj = {};
    slider.addEventListener('touchstart', e => {
        obj.startValue = e.changedTouches[0].screenX;
    })

    slider.addEventListener('touchend', e => {
        calculateTouchEvent(e.changedTouches[0].screenX);
    })

    function calculateTouchEvent(value) {
        const difference = obj.startValue - value;
        if (Math.abs(difference) < 50) return;

        difference < 0
            ? calculateDescendingDirection()
            : calculateAscendingDirection();
    }

    rangeCheck();
}
