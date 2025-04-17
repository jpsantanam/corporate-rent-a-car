const manageUserModal = $('#manageUser');
manageUserModal.on('show.bs.modal', event => {

    const triggerType = $(event.relatedTarget).data('bs-action');
    $('#manage-user input').val('');

    let userData = {};
    if (triggerType === 'UPDATE') userData = JSON.parse(event.relatedTarget.getAttribute('data-bs-user').replace(/&quot;/g, '"').replace(/&apos;/g, "'"));

    $('#manageUserContent').html(`
        <div class="modal-header">
            <h1 class="modal-title fs-1" id="manageUserLabel">${triggerType === 'POST' ? 'Cadastrar Novo Usuário' : 'Detalhes de Usuário'}</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <form id="manage-user">
            <div class="modal-body">

                <input type="hidden" id="manage-method" value="${triggerType}">
                <input type="hidden" id="manage-id" ${triggerType === 'UPDATE' ? `name="_id" value="${userData?.id}"` : ''}>

                <div class="container-fluid">
                    <div class="row">

                        <div class="col-12 col-md-6 mb-3">
                            <div class="form-floating">
                                <input type="text" class="${triggerType === 'POST' ? 'form-control' : 'form-control-plaintext'}" id="manage-name" name="name" placeholder="name" ${triggerType === 'POST' ? 'required' : `value="${userData?.name}" readonly`}>
                                <label for="manage-name">Nome${triggerType === 'POST' ? ' (*)' : ''}</label>
                            </div>
                        </div>

                        <div class="col-12 col-md-6 mb-3">
                            <div class="form-floating">
                                <input type="email" class="${triggerType === 'POST' ? 'form-control' : 'form-control-plaintext'}" id="manage-email" name="email" placeholder="email" ${triggerType === 'POST' ? 'required' : `value="${userData?.email}" data-bs-email="${userData?.email}" readonly`}>
                                <label for="manage-email">Email${triggerType === 'POST' ? ' (*)' : ''}</label>
                            </div>
                        </div>

                        <div class="col-12 col-lg-4 mb-3" ${triggerType === 'UPDATE' ? 'hidden' : ''}>
                            <div class="form-floating">
                                <select class="form-select" id="manage-role" name="role" aria-label="Funcao" ${triggerType === 'POST' ? 'required' : 'disabled'}>
                                    ${triggerType === 'POST' ? '<option selected disabled>Selecione</option>' : ''}
                                    <option value="admin" ${triggerType === 'UPDATE' && userData?.role === "admin" ? 'selected' : ''}>Administrador(a)</option>
                                    <option value="operator" ${triggerType === 'UPDATE' && userData?.role === "operator" ? 'selected' : ''}>Operador(a)</option>
                                </select>
                                <label for="manage-role">Função (*)</label>
                            </div>
                        </div>

                        <div class="col-12 col-md-6 col-lg-4 mb-3" ${triggerType === 'UPDATE' ? 'hidden' : ''}>
                            <div class="input-group">
                                <div class="form-floating">
                                    <input type="password" class="${triggerType === 'POST' ? 'form-control' : 'form-control-plaintext'}" id="manage-password" name="password" placeholder="password" autocomplete="password" ${triggerType === 'POST' ? 'required' : ''}>
                                    <label for="manage-password">${triggerType === 'POST' ? 'Senha (*)' : 'Nova Senha'}</label>
                                </div>
                                <button onclick="togglePassword(event)" type="button" class="btn btn-outline-secondary">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="curuserColor" viewBox="0 0 16 16">
                                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div class="col-12 col-md-6 col-lg-4 mb-3" ${triggerType === 'UPDATE' ? 'hidden' : ''}>
                            <div class="input-group">
                                <div class="form-floating">
                                    <input type="password" class="${triggerType === 'POST' ? 'form-control' : 'form-control-plaintext'}" id="manage-password-confirmation" name="confirmPassword" placeholder="confirmPassword" autocomplete="confirm-password" ${triggerType === 'POST' ? 'required' : ''}>
                                    <label for="manage-password-confirmation">${triggerType === 'POST' ? 'Confirmar Senha (*)' : 'Confirmar Nova Senha'}</label>
                                </div>
                                <button onclick="togglePassword(event)" type="button" class="btn btn-outline-secondary">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="curuserColor" viewBox="0 0 16 16">
                                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="dismissModalAndCancelEdit">Fechar</button>
                <button type="${triggerType === 'POST' ? 'submit' : 'button'}" class="btn ${triggerType === 'POST' ? 'btn-success' : 'btn-primary'}" id="toggleModeAndSubmitUser">${triggerType === 'POST' ? 'Cadastrar' : 'Editar'}</button>
            </div>
        </form>
    `);

    const toggleSubmitButton = document.getElementById('toggleModeAndSubmitUser');
    const dismissCancelButton = document.getElementById('dismissModalAndCancelEdit');
    let editMode = false;

    toggleSubmitButton.addEventListener('click', (e) => {
        if (!editMode && triggerType === 'UPDATE') {
            e.preventDefault();
            enterEditMode();
        }
    });

    dismissCancelButton.addEventListener('click', () => {
        if (editMode) exitEditMode();
    });

    function enterEditMode() {
        $('#manageUserLabel').text('Editar Usuário');
        $('#dismissModalAndCancelEdit').removeAttr('data-bs-dismiss');
        $('#dismissModalAndCancelEdit').text('Voltar para detalhes');

        $('#manage-user input').removeAttr('readonly');
        $('#manage-email').attr('disabled', true);
        $('.col-12').has('#manage-role, #manage-password, #manage-password-confirmation').removeAttr('hidden');
        $('#manage-user input').removeClass('form-control-plaintext').addClass('form-control');
        $('#toggleModeAndSubmitUser').text('Salvar').removeClass('btn-primary').addClass('btn-success');
        $('#toggleModeAndSubmitUser').attr('type', 'submit');

        editMode = true;
    }

    function exitEditMode() {
        $('#manageUserLabel').text('Detalhes de Usuário');
        $('#dismissModalAndCancelEdit').attr('data-bs-dismiss', 'modal');
        $('#dismissModalAndCancelEdit').text('Cancelar');

        $('#manage-user input').attr('readonly', true);
        $('#manage-email').removeAttr('disabled');
        $('.col-12').has('#manage-role, #manage-password, #manage-password-confirmation').attr('hidden', true);
        $('#manage-user input').removeClass('form-control').addClass('form-control-plaintext');
        $('#toggleModeAndSubmitUser').text('Editar').removeClass('btn-success').addClass('btn-primary');
        $('#toggleModeAndSubmitUser').attr('type', 'button');

        editMode = false;
    }
});

const deleteUserModal = $('#deleteUser');
deleteUserModal.on('show.bs.modal', event => {
    const userData = JSON.parse(event.relatedTarget.getAttribute('data-bs-user').replace(/&quot;/g, '"').replace(/&apos;/g, "'"));
    $('#deleteUserContent').html(`
        <div class="modal-header">
            <h5 class="modal-title" id="deleteUserModalLabel">Deletar Usuário</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <form id="confirm-delete-user-form" class="d-flex flex-column gap-3" method="DELETE">
            <div class="modal-body">
                <input id="userToDelete" type="hidden" name="userToDelete" value="${userData?.id}" />
                <p>Tem certeza que deseja deletar o usuário <strong>${userData?.name}</strong>? Esta ação é irreversível.</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button id="confirm-delete-user" type="submit" class="btn btn-danger">Confirmar</button>
            </div>
        </form>
    `);
});