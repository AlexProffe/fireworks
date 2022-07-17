import {slider} from "./modules/slider.js";
import {burger} from "./modules/burger.js";


slider("#services-slider", {});
burger()

const header = document.querySelector('header');
const sections = document.querySelectorAll('section');
const intersection = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.id.replace('#', '') === 'welcome' ?  header.classList.remove('_light') : header.classList.add('_light')
        }
    })
}, {
    threshold: 0.55,
});

sections.forEach(section => {
    intersection.observe(section);
})

const clientsSlider= new Swiper('.clients__slider', {
	autoplay: {
		delay: 0,
		disableOnInteraction: false,
		waitForTransition: true,

	},
	slidesPerView: 8,
	spaceBetween: 40,
	autoHeight: false,
	speed: 3000,
	loop: true,
	breakpoints: {
		320: {
			slidesPerView: 2,
			spaceBetween: 10,
		},
		440: {
			slidesPerView: 3,
			spaceBetween: 10,
		},
		576: {
			slidesPerView: 4,
			spaceBetween: 10,
		},
		768: {
			slidesPerView: 5,
			spaceBetween: 20,
		},
		992: {
			slidesPerView: 6,
			spaceBetween: 20,
		},
		1400: {
			slidesPerView: 8,
			spaceBetween: 20,
		},

	},

	on: {
		lazyImageReady: function () {
			ibg();
		},
	}
});

const reviewersSlider = new Swiper('.reviews-client', {
	autoplay: {
		delay: 3000,
		disableOnInteraction: false,
	},
	slidesPerView: 3,
	spaceBetween: 30,
	speed: 800,
	loop: true,
	pagination: {
		el: ".reviews-client__pagination",
		clickable: true,
	},

	breakpoints: {
		320: {
			slidesPerView: 1,
			spaceBetween: 10,
		},
		768: {
			slidesPerView: 2,
			spaceBetween: 20,
		},
		992: {
			slidesPerView: 3,
			spaceBetween: 20,
		},

	},

	on: {
		lazyImageReady: function () {
			ibg();
		},
	}
});