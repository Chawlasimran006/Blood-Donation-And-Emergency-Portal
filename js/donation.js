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

    function showModal(){
        if(!modal) return;
        modal.setAttribute('aria-hidden','false');
    }

    function closeModal(){
        if(!modal) return;
        modal.setAttribute('aria-hidden','true');
    }

    if(driveBtn){
        driveBtn.addEventListener('click', function(){
            showModal();
        });
    }

    // close buttons / overlay
    document.querySelectorAll('[data-close]').forEach(btn=>{
        btn.addEventListener('click', closeModal);
    });

    // form submit
    const hostForm = document.getElementById('host-drive-form');

    function showToast(msg='Saved'){ 
        if(!toast) return;
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(()=>toast.classList.remove('show'),3000);
    }

    function createDriveCard(data){
        const card = document.createElement('div');
        card.className = 'drive-card';
        card.innerHTML = `
            <div class="pin"><i class="fa-solid fa-location-dot"></i></div>
            <div style="display:flex;justify-content:space-between;align-items:center">
                <div style="display:flex;gap:10px;align-items:center">
                    <span class="tag">Blood Drive</span>
                    <h3 style="margin:0">${escapeHtml(data.orgName || 'Unnamed Drive')}</h3>
                </div>
                <div style="color:#777"><i class="fa-regular fa-location-dot"></i></div>
            </div>
            <p style="color:#666;margin:8px 0;font-size:14px">${escapeHtml(data.address || '')}</p>
            <div class="drive-meta">${escapeHtml(data.city || '')} • ${escapeHtml(data.date || '')} ${data.time ? ' • ' + escapeHtml(data.time) : ''}</div>
            <div class="drive-row"><i class="fa-regular fa-user"></i> Expected: ${escapeHtml(data.expected || 'N/A')}</div>
            <hr style="margin:10px 0;border-top:1px solid #f0f0f0">
            <div style="font-size:13px;color:#555"><i class="fa-solid fa-envelope"></i> ${escapeHtml(data.email || '')}</div>
            <div style="font-size:13px;color:#555;margin-top:6px"><i class="fa-solid fa-phone"></i> ${escapeHtml(data.phone || '')}</div>
        `;
        return card;
    }

    function escapeHtml(str){
        return String(str).replace(/[&<>"]+/g, function(s){
            return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[s];
        });
    }

    function loadDrives(){
        let drives = [];
        try{ drives = JSON.parse(localStorage.getItem('drives')||'[]'); }catch(e){ drives = []; }
        drives.forEach(d=>{
            drivesList && drivesList.appendChild(createDriveCard(d));
        });
    }

    function saveDrive(drive){
        let drives = [];
        try{ drives = JSON.parse(localStorage.getItem('drives')||'[]'); }catch(e){ drives = []; }
        drives.unshift(drive);
        localStorage.setItem('drives', JSON.stringify(drives));
    }

    if(hostForm){
        hostForm.addEventListener('submit', function(e){
            e.preventDefault();
            const fd = new FormData(hostForm);
            const data = Object.fromEntries(fd.entries());
            // append card
            const card = createDriveCard(data);
            drivesList && drivesList.insertBefore(card, drivesList.firstChild);
            // persist
            saveDrive(data);
            // toast and close
            showToast('Drive submitted');
            closeModal();
            hostForm.reset();
        });
    }

    // initial load
    loadDrives();
});
