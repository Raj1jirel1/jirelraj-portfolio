/**
 * RAJ | IT Support & Networking Portfolio Script
 * Pure Vanilla JavaScript (No Framework Dependencies)
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Canvas Network Topology Background Effect
    initNetworkCanvas();

    // 2. Mobile Menu Navigation
    initMobileNav();

    // 3. Interactive Terminal Simulation
    initTerminal();

    // 4. Scroll Reveal Animations & Navigation Highlight
    initScrollEffects();

    // 5. Contact Form Feedback Simulation
    initContactForm();
});

/* ==========================================================================
   1. CANVAS FAINT NETWORK TOPOLOGY BACKGROUND
   ========================================================================== */
function initNetworkCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let nodes = [];
    const nodeCount = Math.floor(window.innerWidth < 768 ? 25 : 55);

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', () => {
        resize();
        createNodes();
    });

    resize();

    class Node {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 2 + 1.5;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
            ctx.fill();
        }
    }

    function createNodes() {
        nodes = [];
        for (let i = 0; i < nodeCount; i++) {
            nodes.push(new Node());
        }
    }

    createNodes();

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw connections
        const maxDist = 140;
        for (let i = 0; i < nodes.length; i++) {
            nodes[i].update();
            nodes[i].draw();

            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < maxDist) {
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    const alpha = (1 - dist / maxDist) * 0.15;
                    ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
}

/* ==========================================================================
   2. MOBILE NAVIGATION MENU
   ========================================================================== */
function initMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if (icon) {
                if (navLinks.classList.contains('active')) {
                    icon.className = 'fa-solid fa-xmark';
                } else {
                    icon.className = 'fa-solid fa-bars';
                }
            }
        });

        // Close mobile menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = hamburger.querySelector('i');
                if (icon) icon.className = 'fa-solid fa-bars';
            });
        });
    }
}

/* ==========================================================================
   3. INTERACTIVE TERMINAL SIMULATION
   ========================================================================== */
function initTerminal() {
    const terminalInput = document.getElementById('terminal-input');
    const terminalBody = document.getElementById('terminal-body');

    if (!terminalInput || !terminalBody) return;

    const commands = {
        'whoami': 'Raj Jirel — BSc CSIT Student & Aspiring IT / Network Support Professional',
        'role': 'IT Support & Networking Enthusiast',
        'location': 'Kathmandu, Nepal',
        'status': '🟢 Currently learning & building practical hands-on labs',
        'skills': 'Networking (Cisco, VLAN, OSPF), Linux, Wireshark, Docker, Active Directory, Firewalls',
        'labs': 'Cisco Networking, Sophos Firewall, Linux Sysadmin, Wireshark Packet Analysis, Docker',
        'contact': 'Email: jirelraj875@gmail.com | LinkedIn: Raj Jirel | GitHub: github.com/Raj1jirel1',
        'help': 'Available commands: whoami, role, location, status, skills, labs, contact, clear'
    };

    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const inputVal = terminalInput.value.trim().toLowerCase();
            terminalInput.value = '';

            if (!inputVal) return;

            // Append entered line
            const line = document.createElement('div');
            line.className = 'terminal-line';
            line.innerHTML = `<span class="prompt">raj@sys-admin:~$</span> <span class="cmd">${escapeHTML(inputVal)}</span>`;
            terminalBody.insertBefore(line, terminalInput.closest('.terminal-input-row'));

            if (inputVal === 'clear') {
                // Clear all previous lines except initial greetings
                const lines = terminalBody.querySelectorAll('.terminal-line');
                lines.forEach(l => l.remove());
                return;
            }

            // Output response
            const resLine = document.createElement('div');
            resLine.className = 'terminal-line';

            if (commands[inputVal]) {
                resLine.innerHTML = `<span class="res res-highlight">${commands[inputVal]}</span>`;
            } else {
                resLine.innerHTML = `<span class="res" style="color: #ef4444;">Command not found: "${escapeHTML(inputVal)}". Type "help" for a list of commands.</span>`;
            }

            terminalBody.insertBefore(resLine, terminalInput.closest('.terminal-input-row'));
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    });
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

/* ==========================================================================
   4. SCROLL REVEAL & NAV HIGHLIGHT
   ========================================================================== */
function initScrollEffects() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

/* ==========================================================================
   5. CONTACT FORM FEEDBACK
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const statusMsg = document.getElementById('form-status');

    if (form && statusMsg) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            statusMsg.style.color = '#38bdf8';
            statusMsg.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending message...';

            setTimeout(() => {
                statusMsg.style.color = '#34d399';
                statusMsg.innerHTML = '<i class="fa-solid fa-circle-check"></i> Thank you! Your message has been sent successfully.';
                form.reset();
            }, 1200);
        });
    }
}
