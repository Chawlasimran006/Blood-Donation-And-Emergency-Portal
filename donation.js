// Navbar toggle: use a safe, class-based toggle and guard against missing elements
const btn = document.querySelector('#toggle-bnt');
const menu = document.querySelector('.menu');
const MOBILE_BREAKPOINT = 900; // px - adjust if needed to match your CSS

if (btn && menu) {
    // ensure menu initial state for small screens
    btn.setAttribute('aria-expanded', 'false');

    btn.addEventListener('click', () => {
        const isOpen = menu.classList.toggle('menu-open');
        // set inline style for older layouts that rely on left
        menu.style.left = isOpen ? '0' : '-100%';
        btn.setAttribute('aria-expanded', String(isOpen));
    });

    // When resizing to desktop, clear mobile inline state so CSS takes over
    window.addEventListener('resize', () => {
        if (window.innerWidth > MOBILE_BREAKPOINT) {
            menu.classList.remove('menu-open');
            menu.style.left = '';
            btn.setAttribute('aria-expanded', 'false');
        }
    });
        // close mobile menu when a navigation link is clicked (avoids stale inline styles preventing navigation)
            document.querySelectorAll('.menu a').forEach(a => {
                    a.addEventListener('click', (ev) => {
                        // close mobile menu first (so it doesn't block navigation)
                        if (window.innerWidth <= MOBILE_BREAKPOINT) {
                            ev.preventDefault();
                            const href = a.getAttribute('href');
                            menu.classList.remove('menu-open');
                            menu.style.left = '-100%';
                            btn.setAttribute('aria-expanded', 'false');
                            setTimeout(() => {
                                if (href && href !== '#') window.location.href = href;
                            }, 120);
                            return;
                        }

                        // On desktop: if the link points to the current page, force a reload so content re-renders
                        try {
                            const url = new URL(a.href, window.location.origin);
                            const samePath = (url.pathname === window.location.pathname && url.search === window.location.search);
                            if (samePath) {
                                ev.preventDefault();
                                // small timeout to allow any UI updates
                                setTimeout(() => window.location.reload(), 50);
                            }
                        } catch (e) {
                            // fallback: do nothing and allow default navigation
                        }
                    });
            });
}



// Add this code block into your donation.js file

document.addEventListener("DOMContentLoaded", function () {
    // ... (your existing donateForm submit logic) ...

    const findCenterDiv = document.getElementById("center");
    
    // Check if the element exists before adding the listener
    if (findCenterDiv) {
        findCenterDiv.style.cursor = 'pointer'; // Optional: change cursor to show it's clickable

        findCenterDiv.addEventListener("click", function () {
            // Redirect the user to the new page
            window.location.href = "find-center.html";
        });
    }
    // --- Host a Drive modal logic ---
    const driveBtn = document.getElementById('drive');
    const modal = document.getElementById('drive-modal');
    const toast = document.getElementById('toast');
    const drivesList = document.getElementById('drives-list');

    // ... auth removed: original header links / sign.html and login.html are used instead

    // --- Simple client-side auth ---
    const AUTH_DELAY_MS = 2500; // show login after 2.5s if not logged in
    const authModal = document.getElementById('auth-modal');
    const authForm = document.getElementById('auth-form');
    const authTitle = document.getElementById('auth-title');
    const authModeNote = document.getElementById('auth-mode-note');
    const switchToSignup = document.getElementById('switch-to-signup');
    const authSubmit = document.getElementById('auth-submit');

    function getUsers(){
        try{return JSON.parse(localStorage.getItem('users')||'[]');}catch(e){return []}
    }
    function saveUsers(u){ localStorage.setItem('users', JSON.stringify(u)); }
    function setCurrentUser(email){ localStorage.setItem('currentUser', email); }
    function getCurrentUser(){ return localStorage.getItem('currentUser'); }
    function clearCurrentUser(){ localStorage.removeItem('currentUser'); }

    function showAuthModal(mode='login'){
        if(!authModal) return;
        authModal.setAttribute('aria-hidden','false');
        authTitle.textContent = mode === 'login' ? 'Login' : 'Sign Up';
        authModeNote.innerHTML = mode === 'login' ? `Don't have an account? <a href="#" id="switch-to-signup">Sign up</a>` : `Already have account? <a href="#" id="switch-to-signup">Login</a>`;
        authSubmit.textContent = mode === 'login' ? 'Login' : 'Sign Up';
        // rebind switch link
        const sw = document.getElementById('switch-to-signup');
        if(sw){ sw.addEventListener('click', (e)=>{ e.preventDefault(); showAuthModal(mode==='login' ? 'signup' : 'login'); }); }
    }

    function closeAuthModal(){ if(!authModal) return; authModal.setAttribute('aria-hidden','true'); }

    // Add logout button to header when logged in
    function injectAuthUI(){
        const authArea = document.querySelector('.auth');
        if(!authArea) return;
        const current = getCurrentUser();
        authArea.innerHTML = '';
        if(current){
            const el = document.createElement('div');
            el.style.display = 'flex';
            el.style.gap = '8px';
            el.innerHTML = `<span style="align-self:center;color:#333">${escapeHtml(current)}</span><button id="logout-btn" class="btn btn-outline">Logout</button>`;
            authArea.appendChild(el);
            const logoutBtn = document.getElementById('logout-btn');
            if(logoutBtn) logoutBtn.addEventListener('click', ()=>{ clearCurrentUser(); injectAuthUI(); showAuthModal('login'); });
        } else {
            // show login and signup buttons
            const loginBtn = document.createElement('button'); loginBtn.className='login'; loginBtn.innerHTML='<a href="#">Login</a>';
            const signupBtn = document.createElement('button'); signupBtn.className='signup'; signupBtn.innerHTML='<a href="sign.html">Sign Up</a>';
            authArea.appendChild(loginBtn);
            authArea.appendChild(signupBtn);
            // attach handlers
            loginBtn.addEventListener('click',(e)=>{ e.preventDefault(); showAuthModal('login'); });
            // Sign up should open the separate sign.html page
            signupBtn.addEventListener('click',(e)=>{ /* let default anchor behavior navigate */ });
        }
    }

    // auth form submit
    if(authForm){
        authForm.addEventListener('submit',(e)=>{
            e.preventDefault();
            const fd = new FormData(authForm);
            const email = (fd.get('email')||'').toString().trim().toLowerCase();
            const password = (fd.get('password')||'').toString();
            if(!email || !password){ showToast('Provide email and password'); return; }

            const mode = authSubmit.textContent.toLowerCase().includes('sign') ? 'signup' : 'login';
            const users = getUsers();
            if(mode === 'signup'){
                if(users.find(u=>u.email===email)){ showToast('Account already exists'); return; }
                users.push({ email, password });
                saveUsers(users);
                setCurrentUser(email);
                injectAuthUI();
                closeAuthModal();
                showToast('Signed up');
            } else {
                const user = users.find(u=>u.email===email && u.password===password);
                if(user){ setCurrentUser(email); injectAuthUI(); closeAuthModal(); showToast('Logged in'); }
                else showToast('Invalid credentials');
            }
            authForm.reset();
        });
    }

    // show auth modal if no user after delay
    setTimeout(()=>{
        if(!getCurrentUser()) showAuthModal('login');
    }, AUTH_DELAY_MS);

    // inject initial auth UI
    injectAuthUI();
});
