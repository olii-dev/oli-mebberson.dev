(function () {
    var navbar = document.getElementById('navbar');
    var hero = document.getElementById('hero');
    var navToggle = document.querySelector('.nav-toggle');
    var navMobile = document.querySelector('.nav-mobile');
    var navLinks = document.querySelectorAll('.nav-link');
    var timelineItems = document.querySelectorAll('.timeline-content');
    var scrollProgress = document.getElementById('scroll-progress');
    var backToTop = document.getElementById('back-to-top');
    var typedTextEl = document.getElementById('typed-text');
    var loader = document.getElementById('loader');
    var toast = document.getElementById('toast');
    var emailCopy = document.getElementById('email-copy');
    var orb1 = document.querySelector('.orb-parallax-1');
    var orb2 = document.querySelector('.orb-parallax-2');
    var orb3 = document.querySelector('.orb-parallax-3');
    var canvas = document.getElementById('particles');
    var projects = document.querySelectorAll('.project');

    function onScroll() {
        var scrollY = window.scrollY || window.pageYOffset;
        var heroHeight = hero ? hero.offsetHeight : window.innerHeight;
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        var progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

        if (scrollProgress) {
            scrollProgress.style.width = progress + '%';
        }

        if (scrollY > heroHeight - 100) {
            navbar.classList.add('visible');
        } else {
            navbar.classList.remove('visible');
        }

        if (backToTop) {
            if (scrollY > heroHeight) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }

        updateActiveSection();
    }

    function updateActiveSection() {
        var sections = document.querySelectorAll('.section');
        var scrollY = window.scrollY + 200;

        sections.forEach(function (section) {
            var top = section.offsetTop;
            var height = section.offsetHeight;
            var id = section.getAttribute('id');

            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(function (link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    var scrollTicking = false;
    window.addEventListener('scroll', function () {
        if (!scrollTicking) {
            window.requestAnimationFrame(function () {
                onScroll();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    });

    navToggle.addEventListener('click', function () {
        navToggle.classList.toggle('active');
        navMobile.classList.toggle('open');
    });

    navMobile.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
            navToggle.classList.remove('active');
            navMobile.classList.remove('open');
        });
    });

    timelineItems.forEach(function (item) {
        item.addEventListener('click', function () {
            var wasExpanded = item.classList.contains('expanded');

            timelineItems.forEach(function (other) {
                other.classList.remove('expanded');
            });

            if (!wasExpanded) {
                item.classList.add('expanded');
            }
        });
    });

    if (backToTop) {
        backToTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    var revealElements = document.querySelectorAll('.reveal');
    var staggered = new Set();

    var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var el = entry.target;
                var parent = el.parentElement;

                if (parent && parent.hasAttribute('data-stagger') && !staggered.has(parent)) {
                    staggered.add(parent);
                    var delay = parseInt(parent.getAttribute('data-stagger'), 10) || 100;
                    var children = parent.querySelectorAll('.reveal');

                    children.forEach(function (child, i) {
                        child.style.transitionDelay = (i * delay) + 'ms';
                        child.classList.add('visible');
                    });

                    revealObserver.unobserve(el);
                    return;
                }

                el.classList.add('visible');
                revealObserver.unobserve(el);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(function (el) {
        revealObserver.observe(el);
    });

    document.addEventListener('mousemove', function (e) {
        if (!orb1) return;

        var x = (e.clientX / window.innerWidth - 0.5) * 2;
        var y = (e.clientY / window.innerHeight - 0.5) * 2;

        orb1.style.transform = 'translate(' + (x * 30) + 'px, ' + (y * 30) + 'px)';
        orb2.style.transform = 'translate(' + (x * -20) + 'px, ' + (y * -20) + 'px)';
        orb3.style.transform = 'translate(' + (x * 15) + 'px, ' + (y * 15) + 'px)';
    });

    projects.forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
            var rect = card.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            var centerX = rect.width / 2;
            var centerY = rect.height / 2;
            var rotateY = ((x - centerX) / centerX) * 8;
            var rotateX = ((centerY - y) / centerY) * 8;

            card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-6px)';
            card.style.setProperty('--glow-x', x + 'px');
            card.style.setProperty('--glow-y', y + 'px');
        });

        card.addEventListener('mouseleave', function () {
            card.style.transform = '';
            card.style.setProperty('--glow-x', '50%');
            card.style.setProperty('--glow-y', '50%');
        });
    });

    if (emailCopy) {
        emailCopy.addEventListener('click', function (e) {
            e.preventDefault();
            navigator.clipboard.writeText('oli@mebberson.com').then(function () {
                if (toast) {
                    toast.classList.add('visible');
                    setTimeout(function () {
                        toast.classList.remove('visible');
                    }, 2000);
                }
            });
        });
    }

    (function initTyping() {
        if (!typedTextEl) return;

        var titles = [
            'Full Stack Web Developer',
            'iOS App Developer',
            'Designer',
            'Swift Developer'
        ];

        var titleIndex = 0;
        var charIndex = 0;
        var isDeleting = false;
        var typeSpeed = 60;
        var deleteSpeed = 30;
        var pauseEnd = 2000;
        var pauseStart = 500;

        function tick() {
            var current = titles[titleIndex];

            if (!isDeleting) {
                typedTextEl.textContent = current.substring(0, charIndex + 1);
                charIndex++;

                if (charIndex === current.length) {
                    isDeleting = true;
                    setTimeout(tick, pauseEnd);
                    return;
                }

                setTimeout(tick, typeSpeed);
            } else {
                typedTextEl.textContent = current.substring(0, charIndex - 1);
                charIndex--;

                if (charIndex === 0) {
                    isDeleting = false;
                    titleIndex = (titleIndex + 1) % titles.length;
                    setTimeout(tick, pauseStart);
                    return;
                }

                setTimeout(tick, deleteSpeed);
            }
        }

        setTimeout(tick, 800);
    })();

    (function initParticles() {
        if (!canvas) return;
        var ctx = canvas.getContext('2d');
        var particles = [];
        var count = 40;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        resize();
        window.addEventListener('resize', resize);

        for (var i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 0.5,
                speedY: -(Math.random() * 0.3 + 0.1),
                speedX: (Math.random() - 0.5) * 0.2,
                opacity: Math.random() * 0.2 + 0.05,
                phase: Math.random() * Math.PI * 2
            });
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (var i = 0; i < particles.length; i++) {
                var p = particles[i];
                p.y += p.speedY;
                p.x += Math.sin(p.phase) * 0.2;
                p.phase += 0.01;

                if (p.y < -10) {
                    p.y = canvas.height + 10;
                    p.x = Math.random() * canvas.width;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(226, 232, 240, ' + p.opacity + ')';
                ctx.fill();
            }

            requestAnimationFrame(animate);
        }

        animate();
    })();

    if (loader) {
        window.addEventListener('load', function () {
            loader.classList.add('hidden');
            setTimeout(function () {
                loader.style.display = 'none';
            }, 500);
        });
    }

    (function initAskOli() {
        var root = document.getElementById('ask-oli');
        if (!root) return;

        document.body.classList.add('has-ask-oli');

        var fab = root.querySelector('.ask-oli-fab');
        var panel = root.querySelector('.ask-oli-panel');
        var closeBtn = root.querySelector('.ask-oli-close');
        var form = root.querySelector('.ask-oli-form');
        var input = root.querySelector('.ask-oli-input');
        var sendBtn = root.querySelector('.ask-oli-send');
        var messagesEl = root.querySelector('.ask-oli-messages');
        var endpoint = (root.getAttribute('data-api') || '').trim();
        var history = [];
        var busy = false;

        function openPanel() {
            root.classList.add('is-open');
            panel.hidden = false;
            fab.setAttribute('aria-expanded', 'true');
            if (!messagesEl.children.length) {
                renderEmpty();
            }
            setTimeout(function () {
                input.focus();
            }, 120);
        }

        function closePanel() {
            root.classList.remove('is-open');
            panel.hidden = true;
            fab.setAttribute('aria-expanded', 'false');
        }

        function renderEmpty() {
            messagesEl.innerHTML =
                '<div class="ask-oli-empty">' +
                '<strong>Hey — ask about Oli</strong>' +
                '<p>I\'m Oli\'s assistant. Ask about his projects, Lattice, Reko, Breezy, Orbit, or how to reach him. Off-topic questions get a polite redirect.</p>' +
                '</div>';
        }

        function clearEmpty() {
            var empty = messagesEl.querySelector('.ask-oli-empty');
            if (empty) empty.remove();
        }

        function appendMessage(role, text, thinking) {
            clearEmpty();
            var wrap = document.createElement('div');
            wrap.className = 'ask-oli-msg is-' + (role === 'user' ? 'user' : 'bot');
            var meta = document.createElement('div');
            meta.className = 'ask-oli-msg-meta';
            meta.textContent = role === 'user' ? 'You' : "Oli's assistant";
            var bubble = document.createElement('div');
            bubble.className = 'ask-oli-bubble' + (thinking ? ' is-thinking' : '');
            bubble.textContent = text;
            wrap.appendChild(meta);
            wrap.appendChild(bubble);
            messagesEl.appendChild(wrap);
            messagesEl.scrollTop = messagesEl.scrollHeight;
            return bubble;
        }

        async function askQuark(message) {
            if (!endpoint) {
                return "Oli's assistant isn't connected yet. Deploy the Cloudflare Worker in /workers/ask-oli and set data-api on #ask-oli to your Worker URL.";
            }

            var res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: message,
                    history: history.slice(-8)
                })
            });

            var data = await res.json().catch(function () {
                return {};
            });

            if (!res.ok) {
                throw new Error(data.error || data.message || 'Quark had trouble answering. Try again in a moment.');
            }

            return (data.reply || '').trim() || '…';
        }

        fab.addEventListener('click', openPanel);
        closeBtn.addEventListener('click', closePanel);

        document.querySelectorAll('a[href="#ask-oli"]').forEach(function (link) {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                openPanel();
            });
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && root.classList.contains('is-open')) {
                closePanel();
            }
        });

        form.addEventListener('submit', async function (e) {
            e.preventDefault();
            var text = (input.value || '').trim();
            if (!text || busy) return;

            busy = true;
            sendBtn.disabled = true;
            input.value = '';
            appendMessage('user', text);
            history.push({ role: 'user', content: text });

            var thinkingBubble = appendMessage('bot', 'Thinking…', true);

            try {
                var reply = await askQuark(text);
                thinkingBubble.classList.remove('is-thinking');
                thinkingBubble.textContent = reply;
                history.push({ role: 'assistant', content: reply });
            } catch (err) {
                thinkingBubble.classList.remove('is-thinking');
                thinkingBubble.textContent = err.message || 'Something went wrong.';
            } finally {
                busy = false;
                sendBtn.disabled = false;
                messagesEl.scrollTop = messagesEl.scrollHeight;
                input.focus();
            }
        });
    })();

    onScroll();
})();
