//PEGAR TIPO DO USUÁRIO E NOME ATRAVÉS DE COOKIES
function getCookie(nomeCookie) {
    const name = nomeCookie + "=";
    const decodedCookie = decodeURIComponent(document.cookie); // Decodifica os cookies
    const cookieArray = decodedCookie.split(';'); // Divide todos os cookies em um array
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        // Remove espaços em branco iniciais
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1); 
        }
        // Se o cookie começar com o nome desejado, retorna o valor
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return "";
}

//MONTA O HEADER
function criaHeader(tipoUsuario){
    const header = document.getElementById('header');
    let headerHtml = `
        <nav class="navbar navbar-expand-lg">
            <div class="container-fluid">
                <div class="logo">
                    <a href="operator-panel.html"><img class="expand-on-hover" src="assets/images/Corporate Rent a Car - Logo.png" alt="Corporate Rent a Car"></a>
                </div>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <a class="nav-link" aria-current="page" href="./customers.html">Clientes</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="./vehicles.html">Veículos</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="./rents.html">Aluguéis</a>
                        </li>
                        <!--<li class="nav-item">
                            <a class="nav-link" href="./contracts.html">Contratos</a>
                        </li>-->
                        <li class="nav-item">
                            <a class="nav-link" href="./fines.html">Multas</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="./maintenances.html">Manutenções</a>
                        </li>

                        ${tipoUsuario === "admin" ? `
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">ADM</a>
                            <ul class="dropdown-menu">
                                <!--<li><a class="dropdown-item" href="#">Atividades</a></li>
                                <li><a class="dropdown-item" href="#">Sistema</a></li>-->
                                <li><a class="dropdown-item" href="./users.html">Usuários</a></li>
                            </ul>
                        </li>
                        ` : ''}
                    </ul>
                </div>
                <div class="user-info">
                    <i class="fa-regular fa-user"></i>
                    <div class="dropdown">
                        <button class="btn btn-usuario dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Usuário Logado</button>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#userModal">Perfil</a></li>
                            <li><a class="dropdown-item" href="#" onclick='logout()'>Sair</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    `;

    header.innerHTML = headerHtml;
}

//PREENCHE NOME USUÁRIO LOGADO
document.addEventListener('DOMContentLoaded', function () {
    // Adiciona o modal de edição de usuário ao DOM
    const modalHTML = `
        <div class="modal fade" id="userModal" tabindex="-1" aria-labelledby="manageUserLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="manageUserLabel">Editar Usuário</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="manageUserForm">
                            <div class="mb-3">
                                <label for="manage-name" class="form-label">Nome</label>
                                <input type="text" class="form-control" id="manage-name" name="name">
                            </div>
                            <div class="mb-3">
                                <label for="manage-email" class="form-label">Email</label>
                                <input type="email" class="form-control" id="manage-email" name="email" disabled>
                            </div>
                            <div class="mb-3">
                                <label for="manage-role" class="form-label">Função</label>
                                <select id="manage-role" class="form-select" disabled>
                                    <option value="admin">Administrador(a)</option>
                                    <option value="operator">Operador(a)</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="manage-new-password" class="form-label">Nova Senha</label>
                                <input type="password" class="form-control" id="manage-new-password" name="new-password">
                            </div>
                            <div class="mb-3">
                                <label for="manage-confirm-password" class="form-label">Confirmar Nova Senha</label>
                                <input type="password" class="form-control" id="manage-confirm-password" name="confirm-password">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" id="saveUserButton">Salvar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Evento para abrir o modal de edição de usuário com os dados corretos
    const manageUserModal = $('#userModal');
    manageUserModal.on('show.bs.modal', event => {
        const user = JSON.parse(getCookie('user'));

        $('#manage-name').val(user.name);
        $('#manage-email').val(user.email);
        $('#manage-role').val(user.role); // Limpa o campo de senha antiga
        $('#manage-new-password').val(''); // Limpa o campo de nova senha
        $('#manage-confirm-password').val(''); // Limpa o campo de confirmação de senha
    });

    // Evento para salvar os detalhes do usuário
    document.getElementById('saveUserButton').addEventListener('click', saveUserDetails);

    function saveUserDetails() {
        const userData = {
            name: document.getElementById('manage-name').value,
            email: document.getElementById('manage-email').value,
            role: document.getElementById('manage-role').value,
            newPassword: document.getElementById('manage-new-password').value,
            confirmPassword: document.getElementById('manage-confirm-password').value
        };

        // Aqui você pode adicionar a lógica para salvar os detalhes do usuário no servidor
        console.log('User data saved:', userData);

        // Atualiza o cookie com o novo nome do usuário
        updateCookie('user', JSON.stringify(userData));

        // Atualiza o nome do usuário na navbar
        preencheNomeUsuario(userData.name);

        // Fechar o modal após salvar
        $('#userModal').modal('hide');
    }

    // Evento para alternar a visibilidade da senha antiga
    document.getElementById('toggleOldPassword').addEventListener('click', function () {
        const oldPasswordInput = document.getElementById('manage-old-password');
        const type = oldPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        oldPasswordInput.setAttribute('type', type);
        this.textContent = type === 'password' ? 'Mostrar' : 'Ocultar';
    });
});

// Função para obter o valor do cookie
function getCookie(nomeCookie) {
    const name = nomeCookie + "=";
    const decodedCookie = decodeURIComponent(document.cookie); // Decodifica os cookies
    const cookieArray = decodedCookie.split(';'); // Divide todos os cookies em um array
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return "";
}

// Função para atualizar o valor do cookie
function updateCookie(nomeCookie, valor) {
    document.cookie = `${nomeCookie}=${valor}; path=/;`;
}

// Função para preencher o nome do usuário na navbar
function preencheNomeUsuario(nomeUsuario) {
    const userButton = document.querySelector('.btn-usuario');
    if (userButton) {
        userButton.textContent = nomeUsuario;
    }
}

// Evento para carregar o modal ao clicar no botão de gerenciamento de usuário
document.addEventListener('DOMContentLoaded', () => {
    let user = JSON.parse(getCookie('user'));
    criaHeader(user.role);
    preencheNomeUsuario(user.name);
});