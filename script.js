document.addEventListener("DOMContentLoaded", () => {
    // 1. Mobile Menu Toggle
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("open");
            const icon = menuToggle.querySelector("i");
            if (icon) {
                icon.classList.toggle("fa-bars");
                icon.classList.toggle("fa-xmark");
            }
        });

        // Close mobile menu when a link is clicked
        navLinks.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("open");
                const icon = menuToggle.querySelector("i");
                if (icon) {
                    icon.classList.add("fa-bars");
                    icon.classList.remove("fa-xmark");
                }
            });
        });
    }

    // 2. Active Navigation Link on Scroll
    const sections = document.querySelectorAll("section[id]");
    const navItems = document.querySelectorAll(".nav-links a");

    window.addEventListener("scroll", () => {
        let currentSection = "";

        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 130;
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute("id");
            }
        });

        navItems.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSection}`) {
                link.classList.add("active");
            }
        });

        // Show/Hide Back to Top Button
        if (window.scrollY > 400) {
            backToTopBtn.style.opacity = "1";
            backToTopBtn.style.pointerEvents = "auto";
        } else {
            backToTopBtn.style.opacity = "0";
            backToTopBtn.style.pointerEvents = "none";
        }
    });

    // 3. Smooth Scroll Reveal Animation (Cards & Boxes)
    const revealElements = document.querySelectorAll(
        ".skill-card, .service-box, .project-card, .testimonial-box, .contact-box"
    );

    revealElements.forEach((el) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(25px)";
        el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    });

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12 }
    );

    revealElements.forEach((el) => revealObserver.observe(el));

    // 4. Floating "Back to Top" Button
    const backToTopBtn = document.createElement("button");
    backToTopBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    backToTopBtn.setAttribute("aria-label", "Back to Top");
    Object.assign(backToTopBtn.style, {
        position: "fixed",
        bottom: "25px",
        right: "25px",
        width: "42px",
        height: "42px",
        borderRadius: "50%",
        backgroundColor: "#58181d",
        color: "#e9d7b9",
        border: "1px solid #e9d7b9",
        cursor: "pointer",
        fontSize: "16px",
        zIndex: "999",
        opacity: "0",
        pointerEvents: "none",
        transition: "all 0.3s ease",
        boxShadow: "0 4px 12px rgba(0,0,0,0.4)"
    });

    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    document.body.appendChild(backToTopBtn);

    // 5. Toast Notification for Email, Phone & Resume Actions
    function showToast(message) {
        const toast = document.createElement("div");
        toast.textContent = message;
        Object.assign(toast.style, {
            position: "fixed",
            bottom: "25px",
            left: "25px",
            backgroundColor: "#16281d",
            color: "#e9d7b9",
            padding: "12px 20px",
            borderRadius: "8px",
            border: "1px solid #e9d7b9",
            fontSize: "13.5px",
            fontWeight: "600",
            zIndex: "1001",
            boxShadow: "0 8px 20px rgba(0,0,0,0.5)",
            transition: "opacity 0.4s ease"
        });

        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = "0";
            setTimeout(() => toast.remove(), 400);
        }, 2800);
    }

    document.querySelectorAll('a[href^="mailto:"], a[href*="mail.google.com"]').forEach((el) => {
        el.addEventListener("click", () => showToast("Opening Gmail to message Sartaj..."));
    });

    document.querySelectorAll('a[href^="tel:"]').forEach((el) => {
        el.addEventListener("click", () => showToast("Calling +91 7309130230..."));
    });

    document.querySelectorAll('a[download]').forEach((el) => {
        el.addEventListener("click", () => showToast("Downloading Sartaj's Resume..."));
    });
});