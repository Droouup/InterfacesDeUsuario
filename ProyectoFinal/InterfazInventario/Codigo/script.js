/* script.js - Auth + roles + search + simulated register */
document.addEventListener('DOMContentLoaded', () => {

  // ------- Auth & role helpers (localStorage) -------
  function getRole(){ return localStorage.getItem('saman_role') || null; }
  function getUser(){ return localStorage.getItem('saman_user') || null; }
  function setAuth(user, role){
    localStorage.setItem('saman_user', user);
    localStorage.setItem('saman_role', role);
  }
  function clearAuth(){ localStorage.removeItem('saman_user'); localStorage.removeItem('saman_role'); }

  // ------- Protect pages: if not logged in, go to login.html -------
  const protectedPages = ['index.html','inventario.html','registro.html','reportes.html',''];
  (function protect(){
    const path = window.location.pathname.split('/').pop();
    if (protectedPages.includes(path)) {
      if (!getRole()) {
        // allow login.html
        if (path !== 'login.html') window.location.href = 'login.html';
      }
    }
  })();

  // ------- Update topbar UI (role display and logout) -------
  function updateTopbar(){
    const role = getRole() || '---';
    const roleDisplayNodes = document.querySelectorAll('#role-display, #role-display, #role-display, #role-display, #role-user, #role-display'); // safe
    const roleElem = document.getElementById('role-display') || document.getElementById('role-display');
    if (roleElem) roleElem.textContent = role.charAt(0).toUpperCase() + role.slice(1);
    const roleSwitchUser = document.getElementById('btn-role-user');
    const roleSwitchAdmin = document.getElementById('btn-role-admin');
    if (roleSwitchUser && roleSwitchAdmin) {
      roleSwitchUser.classList.toggle('active', role === 'user');
      roleSwitchAdmin.classList.toggle('active', role === 'admin');
    }
  }
  updateTopbar();

  // ------- Logout button -------
  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      clearAuth();
      window.location.href = 'login.html';
    });
  }

  // ------- Role switch (optional visual buttons) -------
  const btnRoleUser = document.getElementById('btn-role-user');
  const btnRoleAdmin = document.getElementById('btn-role-admin');
  if (btnRoleUser) btnRoleUser.addEventListener('click', () => { setAuth(getUser() || 'guest','user'); applyRoleUI('user'); });
  if (btnRoleAdmin) btnRoleAdmin.addEventListener('click', () => { setAuth(getUser() || 'guest','admin'); applyRoleUI('admin'); });

  function applyRoleUI(role){
    localStorage.setItem('saman_role', role);
    // show/hide elements
    document.querySelectorAll('[data-role-only="admin"]').forEach(el => el.style.display = (role === 'admin') ? '' : 'none');
    document.querySelectorAll('[data-role-only="user"]').forEach(el => el.style.display = (role === 'user') ? '' : 'none');
    updateTopbar();
  }

  // apply role on load
  (function applyCurrentRole(){
    const role = getRole() || null;
    if (role) applyRoleUI(role);
  })();

  // ------- Search inventory -------
  const searchInput = document.getElementById('search-inventory');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.trim().toLowerCase();
      const rows = document.querySelectorAll('#tabla-productos tbody tr');
      rows.forEach(row => {
        row.style.display = (!q || row.innerText.toLowerCase().includes(q)) ? '' : 'none';
      });
    });
  }

  // ------- Registration form (simulated) -------
  const formRegistro = document.getElementById('form-registro');
  if (formRegistro) {
    // protect: if user role !== admin redirect
    if (getRole() !== 'admin') {
      // redirect users away from register page
      window.location.href = 'inventario.html';
      return;
    }

    formRegistro.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(formRegistro);
      const obj = Object.fromEntries(fd.entries());
      // save to sessionStorage demo list
      const list = JSON.parse(sessionStorage.getItem('saman_products') || '[]');
      list.unshift(obj);
      sessionStorage.setItem('saman_products', JSON.stringify(list));
      // notify and redirect to inventario
      const al = document.createElement('div');
      al.className = 'alert alert-success position-fixed';
      al.style.right = '20px'; al.style.top = '20px'; al.style.zIndex = 2000;
      al.textContent = 'Producto guardado (simulado)';
      document.body.appendChild(al);
      setTimeout(()=> al.remove(), 1600);
      setTimeout(()=> window.location.href = 'inventario.html', 800);
    });
  }

  // ------- Fill inventory from sessionStorage demo data (if any) -------
  (function populateInventoryFromSession(){
    const table = document.getElementById('tabla-productos');
    if (!table) return;
    const list = JSON.parse(sessionStorage.getItem('saman_products') || '[]');
    const tbody = table.querySelector('tbody');
    if (!tbody) return;
    // prepend session items (they are objects with keys matching form names)
    list.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${item.codigo || ''}</td>
        <td>${item.descripcion || ''}</td>
        <td>${item.medida || ''}</td>
        <td>${item.stock || ''}</td>
        <td>${item.precio || ''}</td>
      `;
      tbody.prepend(tr);
    });
  })();

  // ------- Protect direct access to registro.html for users (again) -------
  if (window.location.pathname.endsWith('registro.html')) {
    if (getRole() !== 'admin') {
      window.location.href = 'inventario.html';
    }
  }

});

