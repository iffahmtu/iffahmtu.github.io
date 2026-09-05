// NavBar
const sections = [...document.querySelectorAll("section[id]")];
const navLinks = [...document.querySelectorAll(".nav-link")];

function setActive(id) {
    navLinks.forEach(link => {
        link.classList.toggle("active", link.getAttribute("href") === "#" + id);
    });
}

const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting);
    if (!visible.length) return;

    const section = visible.reduce((a, b) =>
        Math.abs(a.boundingClientRect.top) < Math.abs(b.boundingClientRect.top) ? a : b
    );

    setActive(section.target.id);
}, {
    rootMargin: "-30% 0px -60% 0px",
    threshold: 0
});

sections.forEach(section => observer.observe(section));

navLinks.forEach(link => {
    link.addEventListener("click", () => {
        setActive(link.getAttribute("href").substring(1));
    });
});

// Hero
const container = document.getElementById("three-container");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    100
);

camera.position.z = 8;

const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);


/* PARTICLES */
const particles = 800;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particles * 3);
for (let i = 0; i < particles; i++) {
    let i3 = i * 3;
    positions[i3] = (Math.random() - .5) * 12;
    positions[i3 + 1] = (Math.random() - .5) * 12;
    positions[i3 + 2] = (Math.random() - .5) * 12;
}

geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
);

const material = new THREE.PointsMaterial({
    size: .025,
    color: 0x00e5ff,
    transparent: true,
    opacity: .8
});


const particleMesh = new THREE.Points(
    geometry,
    material
);

scene.add(particleMesh);

/* CENTER OBJECT */

const shape = new THREE.IcosahedronGeometry(1.7, 2);
const shapeMaterial = new THREE.MeshBasicMaterial({
    color: 0x865dff,
    wireframe: true,
    transparent: true,
    opacity: .5
});


const crystal = new THREE.Mesh(
    shape,
    shapeMaterial
);

crystal.position.x = 2;

scene.add(crystal);

/* MOUSE */

let mouseX = 0;
let mouseY = 0;

window.addEventListener("mousemove", e => {
    mouseX = (e.clientX / window.innerWidth - .5);
    mouseY = (e.clientY / window.innerHeight - .5);
});

/* ANIMATION */
function animate() {
    requestAnimationFrame(animate);
    particleMesh.rotation.y += 0.0008;
    particleMesh.rotation.x += 0.0005;
    crystal.rotation.x += 0.003;
    crystal.rotation.y += 0.005;
    camera.position.x += (
        mouseX * 1 - camera.position.x
    ) * 0.02;
    camera.position.y += (
        -mouseY * 1 - camera.position.y
    ) * 0.02;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
}

animate();

/* RESIZE */
window.addEventListener("resize", () => {
    camera.aspect =
        container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(
        container.clientWidth,
        container.clientHeight
    );

});

const cursor = document.querySelector(".cursor");
const dot = document.querySelector(".cursor-dot");
const light = document.querySelector(".spotlight");

window.addEventListener("mousemove", e => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
    dot.style.left = e.clientX + "px";
    dot.style.top = e.clientY + "px";
    light.style.left = e.clientX + "px";
    light.style.top = e.clientY + "px";
});

document.querySelectorAll("a,.magnetic").forEach(el => {
    el.addEventListener("mouseenter", () => {
        cursor.style.width = "60px";
        cursor.style.height = "60px";
    });
    el.addEventListener("mouseleave", () => {
        cursor.style.width = "35px";
        cursor.style.height = "35px";
    });
});

// Loading Animation
window.addEventListener("load", () => {
    gsap.to(".loader-text", {
        scale: window.innerWidth <= 768 ? 0.75 : 1.3,
        opacity: 0,
        duration: .8
    });
    gsap.to("#loader", {
        opacity: 0,
        duration: .8,
        delay: .6,
        onComplete: () => document.getElementById("loader").remove()
    });

    gsap.from(".logo", {
        y: -40,
        opacity: 0,
        duration: 1
    });
    gsap.from("nav li", {
        y: -40,
        opacity: 0,
        stagger: .1,
        duration: 1
    });
    gsap.from(".eyebrow", {
        x: -40,
        opacity: 0,
        duration: 1,
        delay: .3
    });
    gsap.from(".title", {
        y: 80,
        opacity: 0,
        duration: 1
    });
    gsap.from(".subtitle", {
        y: 40,
        opacity: 0,
        duration: 1,
        delay: .3
    });
    gsap.from(".button", {
        scale: .8,
        opacity: 0,
        duration: 1,
        delay: .5
    });
});

// Project Animation
gsap.registerPlugin(ScrollTrigger);

gsap.utils.toArray(".project-card").forEach(card => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: "top 80%"
        },
        y: 100,
        opacity: 0,
        duration: 1
    });

    card.addEventListener("mousemove", e => {
        let r = card.getBoundingClientRect();
        let x = e.clientX - r.left - r.width / 2;
        let y = e.clientY - r.top - r.height / 2;
        card.style.transform = `rotateY(${x/30}deg) rotateX(${-y/30}deg)`;
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "rotateY(0) rotateX(0)";
    });
});

// About Animation
gsap.from(".about-title", {
    scrollTrigger: {
        trigger: ".about",
        start: "top 80%"
    },
    y: 80,
    opacity: 0,
    duration: 1
});

gsap.from(".skill-card", {
    scrollTrigger: {
        trigger: ".skills",
        start: "top 80%"
    },
    stagger: .15,
    duration: 1,
    ease: "power3.out"
});

gsap.from(".timeline-item", {
    scrollTrigger: {
        trigger: ".timeline",
        start: "top 80%"
    },
    x: -80,
    opacity: 0,
    stagger: .2,
    duration: 1
});

gsap.from(".stat-number", {
    scrollTrigger: {
        trigger: ".stats",
        start: "top 80%"
    },
    textContent: 0,
    duration: 2,
    snap: {
        textContent: 1
    }
});

// Skills
const slider = document.querySelector(".skills-wrapper");

let isDown = false;
let startX;
let scrollLeft;

slider.addEventListener("mousedown", e => {
    isDown = true;
    slider.classList.add("dragging");
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
});

slider.addEventListener("mouseleave", () => {
    isDown = false;
    slider.classList.remove("dragging");
});

slider.addEventListener("mouseup", () => {
    isDown = false;
    slider.classList.remove("dragging");
});

slider.addEventListener("mousemove", e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    slider.scrollLeft = scrollLeft - (x - startX) * 1.5;
});


slider.addEventListener("touchstart", e => {
    isDown = true;
    startX = e.touches[0].pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
});

slider.addEventListener("touchend", () => {
    isDown = false;
});

slider.addEventListener("touchmove", e => {
    if (!isDown) return;
    const x = e.touches[0].pageX - slider.offsetLeft;
    slider.scrollLeft = scrollLeft - (x - startX) * 1.5;
});

// CASE STUDY data
const caseStudies = {
    heritrace: {
        type: "Web • AR • Gamification • Backend",
        title: "Heritrace",
        intro: "An interactive heritage experience combining custom web development, gamification, AR and backend functionality.",
        images: ["assets/gif/heritrace/heritrace1.webp", "assets/gif/heritrace/heritrace.gif", "assets/gif/heritrace/heritrace2.webp"],
        role: "Frontend + Backend Developer",
        tech: "HTML • CSS • JavaScript • PHP • MySQL • AR",
        overview: "A digital heritage platform designed around interactive exploration, missions and gamification. The experience combines a custom-built website with backend functionality, database-driven content and AR elements.",
        contribution: "Worked across frontend and backend development, implementing responsive interfaces, interactive missions, game mechanics, database functionality and AR-related experiences."
    },

    pohkong: {
        type: "AR • Unity • WebGL • Camera",
        title: "Poh Kong AR",
        intro: "An interactive AR product experience built around mobile camera interaction and media capture.",
        iframe: "https://www.tiktok.com/player/v1/7644057391314521352",
        role: "AR / Interactive Developer / Data Tracking",
        tech: "Unity • WebGL • AR • Camera • JavaScript",
        overview: "A mobile-first AR experience allowing users to interact with digital content through their device camera, with additional photo and video functionality.",
        contribution: "Worked on the Unity AR experience, WebGL integration and camera-based functionality, including photo capture, video recording and supporting web interactions."
    },

    interactive360: {
        type: "Immersive • 360° • Virtual Experiences",
        title: "Immersive 360° Experiences",
        intro: "A collection of interactive 360° experiences created across automotive, healthcare and experiential environments.",
        images: Array.from({
                length: 19
            },
            (_, i) => `assets/img/interactive360/${String(i).padStart(2, "0")}.webp`
        ),
        role: "Interactive Developer",
        tech: "3DVista • 360° • Interactive Media",
        overview: "A range of virtual experiences designed to let users explore physical environments and products digitally. Projects included Toyota virtual showrooms, a ClearCorrect medical clinic, a Takeda medical booth and a NUskin experience zone.",
        contribution: "Implemented interactive navigation, hotspots, media elements and user interactions across multiple 360° environments and project formats."
    },

    healthcare: {
        type: "Healthcare • Veeva • Interactive",
        title: "Healthcare Digital Experiences",
        intro: "A collection of interactive digital experiences developed for healthcare and pharmaceutical communication.",
        images: Array.from({
                length: 7
            },
            (_, i) => `assets/img/healthcare_digital/${String(i).padStart(2, "0")}.webp`
        ),
        role: "Interactive Developer",
        tech: "Veeva • HTML • CSS • JavaScript",
        overview: "Worked across Veeva CLMs, VAEs, interactive quizzes and calculators for healthcare and pharmaceutical projects. Experience includes projects involving Lexapro, Lundbeck, Novartis, AZ, Takeda, Brintellix, Ninlaro, Entyvio and Controloc.",
        contribution: "Implemented frontend layouts, navigation, animations, interactive components, quizzes and calculators while adapting digital experiences to Veeva environments and project requirements."
    },

    automotive: {
        type: "Interactive • Automotive • Product",
        title: "Automotive Digital Experiences",
        intro: "Interactive product experiences and digital leaflets developed across multiple automotive campaigns and vehicle models.",
        images: [{
                webp: "assets/img/automotive/00.webp",
                gif: "assets/gif/automotive/00.gif"
            },
            {
                webp: "assets/img/automotive/01.webp",
                gif: "assets/gif/automotive/01.gif"
            },
            {
                webp: "assets/img/automotive/02.webp",
                gif: "assets/gif/automotive/02.gif"
            },
            {
                webp: "assets/img/automotive/03.webp",
                gif: "assets/gif/automotive/03.gif"
            }
        ],
        role: "Interactive Developer",
        tech: "HTML • CSS • JavaScript • Interactive Media",
        overview: "A collection of interactive automotive experiences covering Lexus and Toyota product campaigns, including Lexus LBX, NX350 F Sport & Luxury, RX Sport and RZ, as well as Toyota CSUV GR-S and Hilux GR-S.",
        contribution: "Translated visual designs into responsive interactive experiences, implementing navigation, animations, product information, media and interactive content across multiple vehicle variants."
    },

    webar: {
        type: "WebAR • Campaigns • Image Tracking",
        title: "WebAR Campaign Experiences",
        intro: "Browser-based AR experiences developed for campaigns, events and physical environments.",
        image: "assets/gifs/webar.gif",
        role: "AR / Interactive Developer / Data Tracking",
        tech: "Zappar • WebAR • JavaScript • Image Tracking",
        overview: "A collection of WebAR experiences connecting physical environments with interactive digital content. Projects included UNDP Mural, Lundbeck World Mental Health Day, MSD WLCD 2022 across Malaysia and Singapore, and the BNM 60th Anniversary experience.",
        contribution: "Implemented AR interactions, image tracking, user flows and supporting web functionality for mobile devices and campaign environments."
    },

    arcamera: {
        type: "AR • Social • Camera • Interactive",
        title: "AR & Interactive Camera",
        intro: "Camera-based AR experiences developed for events, social platforms and interactive campaigns.",
        image: "assets/gifs/arcamera.gif",
        role: "AR / Interactive Developer",
        tech: "Unity • AR • Camera • Video • Face Tracking",
        overview: "A collection of camera-driven experiences spanning event activations and social AR platforms. Work includes Asia Creator Fest, Karnival Kesihatan, Snapchat, EffectHouse and MetaSpark projects.",
        contribution: "Worked on AR implementation, camera interaction, photo and video recording, face tracking and interactive gameplay across mobile and social AR experiences."
    },

    website: {
        type: "Web Development • Frontend • PHP • WordPress",
        title: "Websites & Digital Platforms",
        intro: "A collection of websites and digital platforms developed across custom frontend, PHP and WordPress environments.",
        image: "assets/gifs/website.gif",
        role: "Frontend / Web Developer",
        tech: "HTML • CSS • JavaScript • PHP • WordPress • Elementor",
        overview: "Website work spans corporate portfolios, creative websites, campaign platforms and WordPress-based solutions. Projects include ADMD, Hausman, Stardust Trinket, Denneen, USDairy, Whitewords and Truqap.",
        contribution: "Developed responsive interfaces from design through implementation, building interactive components, animations, content sections, WordPress/Elementor layouts and supporting PHP functionality."
    }
};

// Case Study Overlay function
const caseOverlay = document.querySelector("#caseStudy");
const caseButtons = document.querySelectorAll(".case-study-btn");

caseButtons.forEach(btn => {
    btn.addEventListener("click", e => {
        e.preventDefault();

        const data = caseStudies[btn.dataset.case];
        if (!data) return;

        document.querySelector("#caseType").textContent = data.type;
        document.querySelector("#caseTitle").textContent = data.title;
        document.querySelector("#caseIntro").textContent = data.intro;

        // Images
        const caseMedia = document.querySelector("#caseMedia");
        caseMedia.innerHTML = "";

        if (data.iframe) {

            const iframe = document.createElement("iframe");
            iframe.src = data.iframe;
            iframe.title = data.title;
            iframe.setAttribute("frameborder", "0");
            iframe.loading = "lazy";
            caseMedia.appendChild(iframe);

        } else if (
            btn.dataset.case === "interactive360" ||
            btn.dataset.case === "healthcare" ||
            btn.dataset.case === "automotive" ||
            btn.dataset.case === "heritrace"
        ) {

            const slider = document.createElement("div");
            slider.className = "case-slider";

            const track = document.createElement("div");
            track.className = "case-slider-track";

            data.images.forEach((image, index) => {

                const slide = document.createElement("div");
                slide.className = "case-slide";

                // Automotive: WebP + GIF in the same slide
                if (btn.dataset.case === "automotive") {

                    const webp = document.createElement("img");
                    webp.src = image.webp;
                    webp.alt = `${data.title} ${String(index + 1).padStart(2, "0")}`;
                    webp.className = "case-image-webp";

                    const gif = document.createElement("img");
                    gif.src = image.gif;
                    gif.alt = `${data.title} animation ${String(index + 1).padStart(2, "0")}`;
                    gif.className = "case-image-gif";

                    slide.appendChild(webp);
                    slide.appendChild(gif);

                } else {

                    const img = document.createElement("img");
                    img.src = image;
                    img.alt = `${data.title} ${String(index + 1).padStart(2, "0")}`;

                    if (btn.dataset.case === "heritrace") {

                        slider.style.pointerEvents = "none";
                        slide.style.flex = "0 0 33%";

                        img.style.width = "100%";
                        img.style.height = "80%";

                    } else if (btn.dataset.case === "interactive360") {

                        img.style.width = "90%";

                    } else if (btn.dataset.case === "healthcare") {

                        // Healthcare styling if needed

                    }

                    slide.appendChild(img);
                }

                track.appendChild(slide);
            });

            // Indicator
            const counter = document.createElement("div");
            counter.className = "case-slider-counter";

            counter.innerHTML = `
                <span class="case-slider-current">01</span>
                / ${String(data.images.length).padStart(2, "0")}
            `;

            if (btn.dataset.case === "heritrace") {
                counter.style.display = "none";
            }

            slider.appendChild(track);
            slider.appendChild(counter);
            caseMedia.appendChild(slider);

            // Swipe / Drag
            let currentSlide = 0;
            let startX = 0;
            let currentX = 0;
            let isDragging = false;
            const threshold = 50;

            const currentNumber = counter.querySelector(
                ".case-slider-current"
            );

            function updateSlider() {
                track.style.transform =
                    `translateX(-${currentSlide * 100}%)`;

                currentNumber.textContent =
                    String(currentSlide + 1).padStart(2, "0");
            }

            // Touch
            slider.addEventListener("touchstart", e => {
                startX = e.touches[0].clientX;
                currentX = startX;
                isDragging = true;
                track.style.transition = "none";
            }, {
                passive: true
            });

            slider.addEventListener("touchmove", e => {
                if (!isDragging) return;
                currentX = e.touches[0].clientX;
            }, {
                passive: true
            });

            slider.addEventListener("touchend", () => {

                if (!isDragging) return;

                const difference = startX - currentX;

                if (Math.abs(difference) > threshold) {

                    if (
                        difference > 0 &&
                        currentSlide < data.images.length - 1
                    ) {
                        currentSlide++;

                    } else if (
                        difference < 0 &&
                        currentSlide > 0
                    ) {
                        currentSlide--;
                    }
                }

                track.style.transition = "transform 0.4s ease";

                updateSlider();

                isDragging = false;
            });

            // Desktop mouse drag
            slider.addEventListener("mousedown", e => {

                startX = e.clientX;
                currentX = startX;
                isDragging = true;

                track.style.transition = "none";

                slider.classList.add("dragging");
            });

            window.addEventListener("mousemove", e => {

                if (!isDragging) return;

                currentX = e.clientX;
            });

            window.addEventListener("mouseup", () => {

                if (!isDragging) return;

                const difference = startX - currentX;

                if (Math.abs(difference) > threshold) {

                    if (
                        difference > 0 &&
                        currentSlide < data.images.length - 1
                    ) {
                        currentSlide++;

                    } else if (
                        difference < 0 &&
                        currentSlide > 0
                    ) {
                        currentSlide--;
                    }
                }

                track.style.transition = "transform 0.4s ease";

                updateSlider();

                isDragging = false;

                slider.classList.remove("dragging");
            });

            updateSlider();

        } else {

            // Normal projects
            const img = document.createElement("img");

            img.src = data.image;
            img.alt = data.title;

            caseMedia.appendChild(img);
        }

        document.querySelector("#caseRole").textContent = data.role;
        document.querySelector("#caseTech").textContent = data.tech;
        document.querySelector("#caseOverview").textContent = data.overview;
        document.querySelector("#caseContribution").textContent = data.contribution;

        caseOverlay.classList.add("open");
        document.body.classList.add("case-open");

        caseOverlay.scrollTop = 0;
    });
});

function closeCaseStudy() {
    caseOverlay.classList.remove("open");
    document.body.classList.remove("case-open");
}

document.querySelector(".case-close").addEventListener("click", closeCaseStudy);

document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeCaseStudy();
});

// caseOverlay.addEventListener("click", e => {
//     if (e.target === caseOverlay) closeCaseStudy();
// });

caseButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        gsap.fromTo(".case-study-inner", {
            y: 50,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            duration: .7,
            ease: "power3.out"
        });
    });
});