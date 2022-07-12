const sliderDefaultOptions = {
    isArrowsVisible: true,
    isDotsVisible: false,
    sliderPerPage: 1,
    sliderControls: [
        {
            type: 'descending',
            selector: '.left-control'
        },
        {
            type: 'ascending',
            selector: '.right-control'
        }
    ],
    breakpoints: {
        320: {
            sliderPerPage: 1,
        },
        640: {
            sliderPerPage: 1,
        },
        720: {
            sliderPerPage: 2,
        },
        860: {
            sliderPerPage: 2,
        },
    },
};

export function slider(selector, options = {}) {
    const slider = document.querySelector(selector);

    let sliderItems = slider.querySelectorAll(`${selector} > *`);

    const { items, component, mediaquery } = slider.dataset;

    const mergedOptions = { ...sliderDefaultOptions, ...options };

    let { sliderPerPage, sliderControls } = mergedOptions;

    let index = mergedOptions.startIndex ?? 0;


    let translateCount = 0;

    let isResized = false;

    initWindowResizeEventListener();

    
    function recalculateSlider(direction = 1) {
        sliderItems.forEach((item) => {
            item.style.flexBasis = `${(window.outerWidth - (40 * sliderPerPage - 1 || 1)) / sliderPerPage}px`;
        });
    
        slider.style.paddingLeft = '20px';
        slider.style.width = `${(window.outerWidth / sliderPerPage) * sliderItems.length}px`;

        translateCount = !isResized ? translateCount = translateCount += ((sliderItems[index].offsetWidth + 40) * direction): 0;

        const shiftCount = sliderPerPage - 1 > 0 ? sliderPerPage : 1;

        if (
            translateCount + ((sliderItems[index]?.offsetWidth + 40) * shiftCount) <=
            slider.offsetWidth + 40
        ) {
            slider.style.transform = `translateX(-${translateCount}px)`;
        }
    }

    

    function initWindowResizeEventListener() {
        const sliderMapItems = document.querySelectorAll(`${items} > *`);
        function onResize() {
            isResized = true;
            slider.innerHTML = "";
            matchMedia(`(max-width:${mediaquery}px)`).matches &&
                sliderMapItems.forEach((item) => {
                    slider.insertAdjacentHTML("beforeend", item.outerHTML);
                    breakpointCheck();
                });
            sliderItems = slider.querySelectorAll(`${selector} > *`);
            recalculateSlider();
            isResized = false;
           
        }

        window.addEventListener("resize", event => {
            onResize();  
        });
        onResize();
    }

   

    
    function styleSliderWrapper() {
        
    }

    const button = document.getElementById("test");

    

    

    function breakpointCheck() {
       const keysArray = Object.keys(mergedOptions.breakpoints).filter(key => +key <= window.outerWidth);
       const lastIndex = keysArray[keysArray.length - 1];
       sliderPerPage = mergedOptions.breakpoints[lastIndex]?.sliderPerPage ?? 1;
    }

    

    sliderControls.forEach(item => {
        const direction = item.type === 'descending' ? -1 : 1;
        const button = document.querySelector(item.selector);

        rangeCheck(button, index = direction === -1 ? --index: ++index, item);

        button.addEventListener("click", (e) => {
            let subIndex = index;
            subIndex = direction === -1 ? --subIndex : ++subIndex;

            if(!rangeCheck(button, subIndex, item)) return;

            sliderControls.forEach(item => {
                const button = document.querySelector(item.selector);
                button.removeAttribute('disabled');
            })

            index = subIndex;

            if(index ===  sliderItems.length - sliderPerPage || index === 0 ) {
                button.setAttribute('disabled', true);
            }

            recalculateSlider(direction);
        });
    })

    function rangeCheck(button, subIndex, item) {

        if(subIndex < 0  && item.type === 'descending') {
            button.setAttribute('disabled', true);
            return false;
        }

        if(subIndex === sliderItems.length - sliderPerPage + 1 && item.type === 'ascending') {
            button.setAttribute('disabled', true);
            return false;
        }

        if(subIndex < 0 || subIndex > sliderItems.length - 1) {
            return false;
        }

        return true;
    }
    let obj = {};
    slider.addEventListener('touchstart', e => {
        obj.startValue = e.changedTouches[0].screenX;
    })

    slider.addEventListener('touchend', e => {
        calculateTouchEvent(e.changedTouches[0].screenX);
    })
   
    function calculateTouchEvent(value) {
        let check = true;
        let subIndex = index;
        const difference = obj.startValue - value;
        const direction = difference < 0 ? -1 : 1;
        subIndex = direction === -1 ? --subIndex : ++subIndex;
       
        sliderControls.forEach(item => {
            const button = document.querySelector(item.selector);
            check = rangeCheck(button, subIndex, item);
        });

        if(!check) return;

        sliderControls.forEach(item => {
            const button = document.querySelector(item.selector);
            button.removeAttribute('disabled');
        })

        index = subIndex;
        sliderControls.forEach(item => {
            const button = document.querySelector(item.selector);
            if((index ===  sliderItems.length - sliderPerPage && item.type === 'ascending') || (index === 0 && item.type === 'descending') ) {
                button.setAttribute('disabled', true);
            } else {

            }
        });
        recalculateSlider(direction);
    }
}
