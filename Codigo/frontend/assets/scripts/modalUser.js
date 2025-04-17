document.addEventListener('DOMContentLoaded', function () {
    if (!document.getElementById('userModal')) {
        document.body.insertAdjacentHTML('beforeend', createUserModalHTML());
    }

    // Configura os eventos do modal
    configureModalEvents();
});

// Geração do HTML do modal
function createUserModalHTML() {
    return `
        <div class="modal fade" id="userModal" tabindex="-1" aria-labelledby="manageUserLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title" id="manageUserLabel">Editar Usuário</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="manageUserForm">
                            <div class="form-floating mb-3">
                                <input type="text" class="form-control" id="manage-name" name="name" placeholder="Nome">
                                <label for="manage-name">Nome</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input type="email" class="form-control" id="manage-email" name="email" placeholder="Email" disabled>
                                <label for="manage-email">Email</label>
                            </div>
                            <div class="form-floating mb-3">
                                <select id="manage-role" class="form-select" disabled>
                                    <option value="admin">Administrador(a)</option>
                                    <option value="operator">Operador(a)</option>
                                </select>
                                <label for="manage-role">Função</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input type="password" class="form-control" id="manage-current-password" name="current-password" placeholder="Senha Atual">
                                <label for="manage-current-password">Senha Atual</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input type="password" class="form-control" id="manage-new-password" name="new-password" placeholder="Nova Senha">
                                <label for="manage-new-password">Nova Senha</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input type="password" class="form-control" id="manage-confirm-password" name="confirm-password" placeholder="Confirmar Nova Senha">
                                <label for="manage-confirm-password">Confirmar Nova Senha</label>
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
}

// Configuração dos eventos do modal
function configureModalEvents() {
    const userModal = document.getElementById('userModal');

    userModal.addEventListener('show.bs.modal', () => {
        console.log('Modal está sendo aberto...');
        const user = JSON.parse(getCookie('user'));
        console.log('Usuário carregado:', user);

        if (user) {
            console.log('Preenchendo campos do modal...');
            document.getElementById('manage-name').value = user.name || '';
            document.getElementById('manage-email').value = user.email || '';
            document.getElementById('manage-role').value = user.role || '';
        } else {
            console.error('Nenhum dado de usuário encontrado no cookie.');
        }
    });

    document.getElementById('saveUserButton').addEventListener('click', saveUserDetails);
}

// Função para validar os campos do formulário
function validateForm() {
    const name = document.getElementById('manage-name').value.trim();
    const currentPassword = document.getElementById('manage-current-password').value.trim();
    const newPassword = document.getElementById('manage-new-password').value.trim();
    const confirmPassword = document.getElementById('manage-confirm-password').value.trim();

    // Nome deve ser obrigatório
    if (!name) {
        showToast('O campo nome é obrigatório!', "warning");
        return false;
    }

    // Senha atual deve sempre ser preenchida
    if (!currentPassword) {
        showToast('A senha atual é obrigatória!', "warning");
        return false;
    }

    // Se nova senha for preenchida, validar os campos de senha
    if (newPassword || confirmPassword) {
        if (!passwordValidation(newPassword)) {
            return false;
        }
        if (newPassword !== confirmPassword) {
            showToast('As senhas devem coincidir', "warning");
            return false;
        }
    }

    return true;
}

// Função para salvar os detalhes do usuário
async function saveUserDetails() {
    if (!validateForm()) return;

    const user = JSON.parse(getCookie('user'));
    const currentName = user.name; // Nome atual no cookie
    const editedName = document.getElementById('manage-name').value.trim();
    const currentPassword = document.getElementById('manage-current-password').value.trim();
    const newPassword = document.getElementById('manage-new-password').value.trim();

    const updates = {};
    let isNameChanged = false;

    // Verifica se o nome foi alterado
    if (currentName !== editedName) {
        updates.name = editedName;
        isNameChanged = true;
    }

    // Adiciona a nova senha se ela foi preenchida
    if (newPassword) {
        updates.password = newPassword;
    }

    try {
        // Valida a senha atual
        await validateCurrentPassword(user.email, currentPassword);

        // Atualiza os dados no backend se necessário
        if (Object.keys(updates).length > 0) {
            await updateUser(user.id, updates);
        }

        // Atualiza o cookie e a interface se o nome foi alterado
        if (isNameChanged) {
            const updatedUser = { ...user, name: editedName };
            updateCookie(updatedUser);
            preencheNomeUsuario(editedName);
        }

        // Exibe a mensagem apropriada
        if (isNameChanged && newPassword) {
            showToast('Nome e senha atualizados com sucesso!', "success");
            logoutAndRedirect();
            return;
        } else if (isNameChanged) {
            showToast('Nome atualizado com sucesso!', "success");
        } else if (newPassword) {
            showToast('Senha atualizada com sucesso! Faça login novamente.', "success");
            logoutAndRedirect(); // Logout apenas se a senha foi alterada
            return;
        }

        document.getElementById('manage-current-password').value = '';
        document.getElementById('manage-new-password').value = '';
        document.getElementById('manage-confirm-password').value = '';


        // Fecha o modal
        const userModal = document.getElementById('userModal');
        const modalInstance = bootstrap.Modal.getInstance(userModal);
        if (modalInstance) {
            modalInstance.hide();
        }
    } catch (error) {
        console.error('Erro ao salvar os detalhes do usuário:', error);
        alert(error.message);
    }
}

function updateCookie(updatedUser) {
    document.cookie = `user=${JSON.stringify(updatedUser)}; path=/;`;
}

function logoutAndRedirect() {
    document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/login.html'; // Redireciona para a página de login
}


// Função para validar a senha atual
async function validateCurrentPassword(email, password) {
    try {
        const response = await fetch('https://corporate-rent-a-car-app.onrender.com/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Usuário não encontrado!');
            } else if (response.status === 401) {
                throw new Error('Senha atual incorreta!');
            } else {
                throw new Error('Erro ao validar senha atual.');
            }
        }
    } catch (error) {
        console.error('Erro na validação da senha atual:', error);
        throw new Error('Erro de conexão. Tente novamente mais tarde.');
    }
}

// Função para atualizar o usuário
async function updateUser(id, data) {
    try {
        const response = await fetch(`https://corporate-rent-a-car-app.onrender.com/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'userCookie': getCookie('user') || ''
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Usuário não encontrado.');
            } else {
                throw new Error('Erro ao atualizar os dados do usuário.');
            }
        }
    } catch (error) {
        console.error('Erro na atualização do usuário:', error);
        throw new Error('Erro de conexão. Tente novamente mais tarde.');
    }
}