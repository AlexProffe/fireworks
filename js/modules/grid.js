export function filter(selectorKey = '.filter') {
    //Filter queries
    const filter = document.querySelector(selectorKey);
    const applyFilterButton = document.querySelector(selectorKey + '-button');
    const filterTriggerButton = filter.querySelector(selectorKey + '-trigger');
    const filterForm = filter.querySelector('form'); 
    const body = document.querySelector('body');
    const htmlElement = document.querySelector(".html");

    let selectedCategories = [];
    let selectedIndex;
    let previewItems;

    //Grid queries
    const gridItemsWrapper = document.querySelector('.portfolio-grid');
    const gridItems = Array.from(document.querySelectorAll('.portfolio-item'));

    gridItemsWrapper.style.setProperty('--grid-rows-count', Math.ceil(gridItems.length / getComputedStyle(gridItemsWrapper).getPropertyValue('--grid-columns-count')));

    window.addEventListener('resize', () => {
        gridItemsWrapper.style.setProperty('--grid-rows-count', Math.ceil(gridItems.length / getComputedStyle(gridItemsWrapper).getPropertyValue('--grid-columns-count')));
    })

    gridItems.forEach(gridItem => {

        const button = gridItem.querySelector('button');
        button.addEventListener('click', openPreview);
    })
    const gridItemsSortedByCategory = gridItems.reduce((prev, curr) => {
        const key = curr.dataset.itemCategory;
        if(prev[key]) {
            return {...prev, [key]: [...prev[key], convertDomItemToGridItemModel(curr)]}
        }

        return {...prev, [key]: [convertDomItemToGridItemModel(curr)]};

    }, {});
    const gridItemsArray = Object.values(gridItemsSortedByCategory).flat(Infinity).sort((a, b) => +a.id - +b.id);
    const gridItemsCategoriesName = Object.keys(gridItemsSortedByCategory);
    let selectedItems = gridItemsArray;

    function filterTrigger() {
        const isFilterOpen = filterForm.classList.contains('visible');
        if(!isFilterOpen) {
            filterForm.style.maxHeight = '300px';
            filterForm.classList.add('visible');
        } else {
            filterForm.style.maxHeight = null;
            filterForm.classList.remove('visible');
        }
    }

    function applyFilter() {
        const currentValues = [];
        for(let i = 0; i < filterForm.length; i++ ) {
            const control = filterForm[i];
            control.checked && currentValues.push(control.value);
        }
        if(isItemsAreIncludesInSecondArray(currentValues, selectedCategories)) {
            selectedCategories = currentValues;
            return;
        };

        selectedCategories = currentValues;

        selectedItems = selectedCategories.length 
            ? selectedCategories.reduce((prev, curr) => [...prev, ...gridItemsSortedByCategory[curr]], [])
            : [...gridItemsArray];
        
        const columnsCount = getComputedStyle(gridItemsWrapper).getPropertyValue('--grid-columns-count');
        const rowsCount = Math.ceil(selectedItems.length / columnsCount)
           

        gridItemsWrapper.style.setProperty('--grid-rows-count', rowsCount);
        
        gridItemsWrapper.innerHTML = '';
        selectedItems.forEach( item => {
            gridItemsWrapper.insertAdjacentElement('beforeend', item.item);
        })
    }

    filterTriggerButton.addEventListener('click', filterTrigger);
    applyFilterButton.addEventListener('click', applyFilter);

    function convertDomItemToGridItemModel(domItem) {
        const id = domItem.querySelector('button').dataset.itemId;
        const name = domItem.querySelector('h2').textContent;
        const image = domItem.querySelector('img').src;
        const category = domItem.dataset.itemCategory;
        return {
            item: domItem,
            name: name,
            id: id,
            image: image,
            category: category,
        }
    }

    function generateCardsFromGridItemModel() {}

    function isItemsAreIncludesInSecondArray(source, destination) {
        return source.length !== destination.length
            ? false 
            : source.every( (elem, index) => destination[index] === elem);
    }

    function openPreview(event) {
        const preview = document.getElementById('preview');
        if(preview) {
            preview.removeEventListener('click', removePreviewElement);
            preview.querySelector('.preview-content').removeEventListener('click', preventContentClick)
            preview && removePreviewElement();
        }
        selectedIndex = selectedItems.findIndex(gridItem => +gridItem.id === +event.target.dataset.itemId);
        const item = selectedItems[selectedIndex];
        generatePreview();
        htmlElement.classList.add('html-no-scroll');
    }

    function generatePreview() {
        const preview = createElementWithOptions('div', {id: 'preview'});
        preview.addEventListener('click', removePreviewElement)
        const previewWrapper = document.createElement('div');

        const leftArrow = createArrowElement('left');
        const rightArrow = createArrowElement('right');
        const closePreviewButton = createElementWithOptions('button', {id: 'preview-close', innerHTML: `<i class="fa-solid fa-times"></i>`});

        previewWrapper.classList.add('preview-content');
        selectedItems.forEach( item => {
            previewWrapper.insertAdjacentElement('beforeend', createPreviewItem(item));
        });
        previewItems = previewWrapper.querySelectorAll('.preview-item');

        previewItems[selectedIndex].classList.add('visible');
      

        preview.insertAdjacentElement('beforeend', previewWrapper);
        preview.insertAdjacentElement('beforeend', leftArrow);
        preview.insertAdjacentElement('beforeend', rightArrow);
        preview.insertAdjacentElement('beforeend', closePreviewButton);
        body.insertAdjacentElement('beforeend', preview);
    }

    function createPreviewItem(item) {
        const previewItem = document.createElement('div');
        previewItem.classList.add('preview-item');
        
        const previewImage = createElementWithOptions('img', {src: item.image});

        if(previewImage.width / previewImage.height > 1) {
            previewItem.style.height = 'auto';
            previewItem.style.maxHeight = '100%';
        }

        previewImage.addEventListener('click', preventContentClick);

        const previewImageWrapper = document.createElement('div');
        previewImageWrapper.classList.add('preview-item__image');
        previewImageWrapper.insertAdjacentElement('beforeend', previewImage);
        const previewTitle = createElementWithOptions('h2', {textContent: item.name});
        previewTitle.classList.add('preview-item__title');
        previewItem.insertAdjacentElement('beforeend', previewImageWrapper);
        previewItem.insertAdjacentElement('beforeend', previewTitle);
        return previewItem;
    }   
    
    function removePreviewElement() {
        const preview = document.getElementById('preview');
        htmlElement.classList.remove('html-no-scroll');
        preview.remove();
    }


    function preventContentClick(event) {
        event.stopPropagation();
    }

    function createElementWithOptions(tagName, options) {
        const element = document.createElement(tagName);
        return Object.assign(element, options);
    }

    function createArrowElement(direction = 'left') {
        const arrowElement = createElementWithOptions('button', {innerHTML: `<i class="fa-solid fa-chevron-${direction}"></i>`});
        arrowElement.classList.add(`preview-arrow-${direction}`);
        arrowElement.classList.add('preview-arrow');
        const clickEventHandler = direction === 'left'
            ? leftArrowClickHandler
            : rightArrowClickHandler
        arrowElement.addEventListener('click', clickEventHandler)
        return arrowElement;
    }

    function leftArrowClickHandler(event) {
        event.stopPropagation();

        selectedIndex--;

        if(selectedIndex < 0) {
            selectedIndex = selectedItems.length - 1;
        }

        previewItems.forEach(item => item.classList.remove('visible'));
        previewItems[selectedIndex].classList.add('visible');
    }

    function rightArrowClickHandler(event) {
        event.stopPropagation();

        selectedIndex++;

        if(selectedIndex === selectedItems.length) {
            selectedIndex = 0;
        }

        previewItems.forEach(item => item.classList.remove('visible'));
        previewItems[selectedIndex].classList.add('visible');
    }
}

