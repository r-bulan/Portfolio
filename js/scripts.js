/* Mobile nav toggle, theme toggle, smooth scrolling, and scroll reveal */

/* Helper: set theme on root and update button UI */
(function(){
	const themeToggle = document.getElementById('theme-toggle');
	const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
	const stored = localStorage.getItem('theme'); // 'dark' | 'light' | null
	const root = document.documentElement;

	function applyTheme(t){
		root.setAttribute('data-theme', t);
		if(themeToggle){
			themeToggle.textContent = t === 'dark' ? '☀️' : '🌙';
			themeToggle.setAttribute('aria-pressed', String(t === 'dark'));
		}
	}

	const initial = stored || (prefersDark ? 'dark' : 'light');
	applyTheme(initial);

	if(themeToggle){
		themeToggle.addEventListener('click', function(){
			const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
			const next = current === 'dark' ? 'light' : 'dark';
			applyTheme(next);
			localStorage.setItem('theme', next);
		});
	}
})();

/* Mobile nav toggle with class-based show/hide and accessible attributes */
(function(){
	const navToggle = document.getElementById('nav-toggle');
	const primaryNav = document.getElementById('primary-nav');
	if(navToggle && primaryNav){
		navToggle.addEventListener('click', function(){
			const expanded = this.getAttribute('aria-expanded') === 'true';
			this.setAttribute('aria-expanded', String(!expanded));
			primaryNav.classList.toggle('open');
		});

		primaryNav.addEventListener('click', (e)=>{
			if(e.target.tagName === 'A' && window.innerWidth < 900){
				primaryNav.classList.remove('open');
				navToggle.setAttribute('aria-expanded','false');
			}
		});
	}
})();

/* Set current year in footer */
(function(){
	const yearEl = document.getElementById('year');
	if(yearEl) yearEl.textContent = new Date().getFullYear();
})();

/* Smooth scrolling for in-page links (respect reduced motion) */
(function(){
	const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	document.querySelectorAll('a[href^="#"]').forEach(a => {
		a.addEventListener('click', function(e){
			const href = this.getAttribute('href');
			if(!href || href === '#') return;
			const targetId = href.slice(1);
			const target = document.getElementById(targetId);
			if(target){
				e.preventDefault();
				if(reduced){
					target.scrollIntoView(true);
				}else{
					target.scrollIntoView({behavior:'smooth', block:'start'});
				}
			}
		});
	});
})();

/* Scroll reveal using IntersectionObserver */
(function(){
	const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	if(prefersReduced) return; // don't run animations if user prefers reduced motion

	const els = document.querySelectorAll('.reveal');
	if(!els.length) return;

	const observer = new IntersectionObserver((entries, obs) => {
		entries.forEach(entry => {
			if(entry.isIntersecting){
				entry.target.classList.add('is-visible');
				obs.unobserve(entry.target);
			}
		});
	}, {
		threshold: 0.12
	});

	els.forEach(el => observer.observe(el));
})();

/* Active nav highlighting on scroll */
(function(){
	const sections = document.querySelectorAll('main section[id]');
	const navLinks = document.querySelectorAll('.primary-nav a');

	function onScroll(){
		let current = '';
		sections.forEach(section => {
			const sectionTop = section.offsetTop - 120;
			if(window.scrollY >= sectionTop){
				current = section.getAttribute('id');
			}
		});

		navLinks.forEach(link => {
			link.classList.remove('active');
			if(link.getAttribute('href') === '#' + current){
				link.classList.add('active');
			}
		});
	}

	window.addEventListener('scroll', onScroll);
})();
