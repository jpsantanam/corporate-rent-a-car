const ADMIN_ONLY_PAGES = ['admin-panel.html', 'users.html', 'logs.html']

const accessControl = () => {
    let user = getCookie('user');
    user = user ? JSON.parse(user) : null;

    const currentPage = window.location.pathname.split('/').pop();

    if (user) {
        if (user.role == "operator") {
            if (currentPage === 'index.html'|| currentPage === '') window.location.href = 'operator-panel.html';
            else if (ADMIN_ONLY_PAGES.includes(currentPage)) window.location.href = "operator-panel.html";
        }
        else if (user.role == "admin") {
            if (currentPage === 'index.html' || currentPage === ''|| currentPage === 'operator-panel.html') window.location.href = 'admin-panel.html';
        }
    } else {
        if (currentPage !== 'index.html') window.location.href = "index.html";
    }
}

accessControl();