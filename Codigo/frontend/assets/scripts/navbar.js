//MONTA O HEADER
function createHeader(tipoUsuario) {
    const currentPath = window.location.pathname; // Obtém o caminho da URL
    const isPanel = currentPath.includes('admin-panel') || currentPath.includes('operator-panel');

    const includeNav = !isPanel; // Se for painel, não inclui a navegação

    const headerHTML = `
        <nav class="navbar">
            <div class="container">
                <div class="logo">
                    <a href="operator-panel.html">
                        <img class="expand-on-hover" src="assets/images/Corporate Rent a Car - Logo.png" alt="Corporate Rent a Car">
                    </a>
                </div>
                <!-- Botão para Menu Hamburguer -->
                ${includeNav ? `
                <button id="hamburger-btn" class="hamburger-btn" aria-label="Toggle navigation">
                    <i class="fa-solid fa-bars"></i>
                </button>
                <!-- Menu -->
                <div id="menu" class="menu hidden">
                    <ul class="menu-list">
                        <li class="nav-item">
                            <a class="menu-link" aria-current="page" href="./customers.html">Clientes</a>
                        </li>
                        <li class="nav-item">
                            <a class="menu-link" href="./vehicles.html">Veículos</a>
                        </li>
                        <li class="nav-item">
                            <a class="menu-link" href="./rents.html">Aluguéis</a>
                        </li>
                        <li class="nav-item">
                            <a class="menu-link" href="./fines.html">Multas</a>
                        </li>
                        <li class="nav-item">
                            <a class="menu-link" href="./maintenances.html">Manutenções</a>
                        </li>
                        ${tipoUsuario === "admin" ? `
                        <li class="nav-item">
                            <a class="menu-link" href="./users.html">Usuários</a>
                        </li>
                        <li class="nav-item">
                            <a class="menu-link" href="./logs.html">Logs</a>
                        </li>` : ''}
                    </ul>
                </div>` : ''}
                <div class="user-info">
                    <i class="fa-regular fa-user"></i>
                    <div class="dropdown">
                        <button class="btn btn-usuario dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Usuário Logado</button>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <button class="dropdown-item" type="button" data-bs-toggle="modal" data-bs-target="#userModal">Perfil</button>
                            <li><a class="dropdown-item" href="#" onclick='logout()'>Sair</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    `;

    document.getElementById('header').innerHTML = headerHTML;
}

//PREENCHE NOME USUÁRIO LOGADO
document.addEventListener('DOMContentLoaded', function () {
    let user = JSON.parse(getCookie('user'));
    createHeader(user.role);
    preencheNomeUsuario(user.name);

    // Seleciona o botão de hambúrguer e o menu
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const menu = document.getElementById('menu');

    // Alterna o menu ao clicar no botão hamburguer
    hamburgerBtn.addEventListener('click', (event) => {
        event.stopPropagation(); // Evita que o clique no botão feche imediatamente o menu
        menu.classList.toggle('hidden');
    });

    // Fecha o menu ao clicar fora dele
    document.addEventListener('click', (event) => {
        // Verifica se o clique não foi no menu nem no botão
        if (!menu.classList.contains('hidden') && !menu.contains(event.target) && event.target !== hamburgerBtn) {
            menu.classList.add('hidden'); // Fecha o menu
        }
    });

    // Fecha o menu ao clicar em um link
    const menuLinks = document.querySelectorAll('.menu-link');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.add('hidden');
        });
    });
});