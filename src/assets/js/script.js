const html = document.querySelector('html');

const observer = new IntersectionObserver((entries) => {
    if (entries.length === 0) return;

    const nav = document.querySelector('nav');
    if (entries[0].isIntersecting) nav.classList.add('hide');
    else nav.classList.remove('hide');
}, { threshold: 0.2 });
observer.observe(document.getElementById("intro"));

let createAnimation = function () {
    bodymovin.loadAnimation({
        container: document.querySelector('.anim-logo'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        rendererSettings: {
            viewBoxOnly: true,
            preserveAspectRatio: 'none'
        },
        path: 'assets/json/piggums.json'
    });
}

class Toggle {

    /**
     * @param {HTMLElement} element
     */
    constructor(element) {
        element.addEventListener('click', function() {
            html.classList.toggle('active');
        });
    }

    /**
     * @returns {Toggle[]}
     */
    static bind() {
        return Array.from(document.getElementsByClassName("toggle")).map((element) => {
            return new Toggle(element);
        })
    }
}

Toggle.bind();

class Slider {
    /**
     * @param {HTMLElement} slider
     */
    constructor(slider) {
        this.moveToIndex = this.moveToIndex.bind(this);
        this.moveToPrevious = this.moveToPrevious.bind(this);
        this.moveToNext = this.moveToNext.bind(this);
        const containers = slider.getElementsByClassName('slider-container');
        if (containers.length === 0) return;

        this.container = containers[0];
        this.links = this.container.querySelectorAll('li');
        if (this.links.length === 0) return;

        this.moveToIndex(1);

        let previousButton = slider.getElementsByClassName('prev')[0];
        if (!!previousButton) {
            previousButton.addEventListener('click', this.moveToPrevious);
        }
        let nextButton = slider.getElementsByClassName('next')[0];
        if (!!nextButton) {
            nextButton.addEventListener('click', this.moveToNext);
        }
    }

    moveToPrevious() {
        const currentIndex = parseInt(this.container.dataset.index);
        this.moveToIndex(currentIndex - 1 < 0 ? this.links.length - 1 : currentIndex - 1);
    }

    moveToNext() {
        const currentIndex = parseInt(this.container.dataset.index);
        this.moveToIndex(currentIndex + 1 > this.links.length - 1 ? 0 : currentIndex + 1);
    }

    /**
     * @param {number} index
     */
    moveToIndex(index) {
        for (let i = 0; i < this.links.length; i++) {
            if (i === index) {
                this.links[i].classList.add('active');
            } else {
                this.links[i].classList.remove('active');
            }
        }

        this.container.dataset.index = `${Math.min(index, this.links.length)}`;
        const imgWidth = this.links[0].offsetWidth;
        const cssStyle = window.getComputedStyle(this.links[0], null);
        const marginLeft = parseInt(cssStyle.getPropertyValue('margin-left'));
        const marginRight = parseInt(cssStyle.getPropertyValue('margin-right'));
        const right = this.container.offsetWidth / 2 - (index + 0.5) * (imgWidth + marginLeft + marginRight);
        this.container.children[0].style.setProperty('transform', `translateX(${right}px)`);
    }

    /**
     * @returns {Slider[]}
     */
    static bind() {
        return Array.from(document.getElementsByClassName('slider')).map((element) => {
            return new Slider(element);
        })
    }
}

Slider.bind();

class Parallax {
    /**
     * @param {HTMLElement} element
     */
    constructor(element) {
        this.offsetTop = this.offsetTop.bind(this);
        this.onScroll = this.onScroll.bind(this);
        this.onIntersection = this.onIntersection.bind(this);
        this.element = element;
        this.ratio = parseFloat(element.dataset.parallax);
        this.elementY = this.offsetTop(this.element) + this.element.offsetHeight / 2;
        const cssStyle = window.getComputedStyle(element, null);
        this.transform = cssStyle.getPropertyValue('transform');
        this.transform = this.transform === 'none' ? '' : this.transform;

        const observer = new IntersectionObserver(this.onIntersection);
        observer.observe(element);
        this.onScroll();
    }

    /**
     * Calcul la position de l'élément par rapport au haut de la page
     * @param {HTMLElement} element
     * @param {number} acc
     * @return number
     */
    offsetTop(element, acc = 0) {
        if (element.offsetParent)
            return this.offsetTop(element.offsetParent, acc + element.offsetTop);

        return acc + element.offsetTop;
    }

    /**
     *
     * @param {IntersectionObserverEntry[]} entries
     */
    onIntersection(entries) {
        for(const entry of entries) {
            if (entry.isIntersecting) {
                this.elementY = this.offsetTop(this.element) + this.element.offsetHeight / 2;
                document.addEventListener('scroll', this.onScroll);
            } else {
                document.removeEventListener('scroll', this.onScroll);
            }
        }
    }

    onScroll() {
        window.requestAnimationFrame(() => {
            const screenY = window.scrollY + window.innerHeight / 2;
            const diffY = this.elementY - screenY - 1;
            let translateY = diffY * this.ratio;
            if (window.scrollY === 0 || Math.abs(translateY) < 0.5) translateY = 0;
            if (translateY < 0) return;

            this.element.style.setProperty('transform', `translateY(${translateY}px) ${this.transform}`);
        })
    }

    /**
     * @returns {Parallax[]}
     */
    static bind() {
        return Array.from(document.querySelectorAll('[data-parallax]')).map((element) => {
            return new Parallax(element);
        })
    }
}

Parallax.bind();

/**
 * @property {string} url
 * @property {string[]} urls
 */
class Lightbox {

    static dialog;
    static loader;
    static close;
    static next;
    static previous;
    static img;

    /**
     * @param {HTMLAnchorElement} element
     * @param {HTMLElement} container
     * @param {string[]} urls
     */
    constructor(element, container, urls) {
        this.url = element.getAttribute('href');
        this.urls = urls;
        this.loadImage = this.loadImage.bind(this);
        this.onKeyup = this.onKeyup.bind(this);
        this.close = this.close.bind(this);
        this.next = this.next.bind(this);
        this.previous = this.previous.bind(this);
        this.move = this.move.bind(this);
        element.addEventListener('click', e => {
            e.preventDefault();
            document.addEventListener('keyup', this.onKeyup);
            Lightbox.close.addEventListener('click', this.close);
            Lightbox.next.addEventListener('click', this.next);
            Lightbox.previous.addEventListener('click', this.previous);
            Lightbox.dialog.classList.remove('fadeOut');
            Lightbox.dialog.classList.add('open');
            html.classList.add('lightboxed');

            this.loadImage()
        });
    }

    loadImage() {
        Lightbox.loader.classList.remove('hide');
        Lightbox.img.classList.add('hide');
        Lightbox.img.src = this.url;
    }

    /**
     * @param {MouseEvent | KeyboardEvent} e
     */
    close(e) {
        e.preventDefault();
        document.removeEventListener('keyup', this.onKeyup);
        Lightbox.close.removeEventListener('click', this.close);
        Lightbox.next.removeEventListener('click', this.next);
        Lightbox.previous.removeEventListener('click', this.previous);

        Lightbox.dialog.classList.add('fadeOut');
        window.setTimeout(() => {
            Lightbox.dialog.classList.remove('open');
            html.classList.remove('lightboxed');
        }, 500);
    }

    /**
     * @param {KeyboardEvent} e
     */
    onKeyup(e) {
        if (e.key === 'Escape') {
            this.close(e);
        } else if (e.key === 'ArrowLeft') {
            this.previous(e);
        } else if (e.key === 'ArrowRight') {
            this.next(e);
        }
    }

    /**
     * @param {MouseEvent | KeyboardEvent} e
     */
    next(e) {
        e.preventDefault();
        const index = this.urls.findIndex(url => url === this.url) + 1;
        this.move(e, index > this.urls.length - 1 ? 0 : index);
    }

    /**
     * @param {MouseEvent | KeyboardEvent} e
     */
    previous(e) {
        e.preventDefault();
        const index = this.urls.findIndex(url => url === this.url) - 1;
        this.move(e, index < 0 ? this.urls.length - 1 : index);
    }

    /**
     * @param {MouseEvent | KeyboardEvent} e
     * @param {number} index
     */
    move(e, index) {
        e.preventDefault();
        this.url = this.urls[index];
        this.loadImage();
    }

    /**
     * @returns {Lightbox[]}
     */
    static bind() {
        if (!Lightbox.dialog) Lightbox.dialog = document.querySelector('.dialog');
        if (!Lightbox.loader) Lightbox.loader = Lightbox.dialog.querySelector('.loader');
        if (!Lightbox.close) Lightbox.close = Lightbox.dialog.querySelector('.close');
        if (!Lightbox.next) Lightbox.next = Lightbox.dialog.querySelector('.next');
        if (!Lightbox.previous) Lightbox.previous = Lightbox.dialog.querySelector('.prev');
        if (!Lightbox.img) Lightbox.img = new Image();

        const container = Lightbox.dialog.querySelector('div');
        Lightbox.img.classList.add('hide');
        Lightbox.img.onload = function() {
            Lightbox.loader.classList.add('hide');
            Lightbox.img.classList.remove('hide');
        };
        container.appendChild(Lightbox.img);

        return Array.from(document.getElementsByClassName('slider-container')).map((container) => {
            const links = Array.from(container.querySelectorAll('a[href$=".jpg"]'));
            const urls = links.map(link => link.getAttribute('href'));
            links.map((element) => {
                return new Lightbox(element, container, urls);
            })
        })
    }
}

Lightbox.bind();