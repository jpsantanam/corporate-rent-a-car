document.addEventListener('DOMContentLoaded', function () {
    searchUsers("");

    document.body.addEventListener('submit', function (event) {
        event.preventDefault();
        if (event.target.id === 'manage-user') postPutUsers(event); // essa linha é o motivo pra `name="_id"` no form
        else if (event.target.id === 'search-user') {
            const searchParam = prepareQuery(event);
            console.log("Search param2: ", searchParam);

            if (searchParam.includes('role=admin') || searchParam.includes('role=operator')) searchUsers(searchParam);
            else {
                document.getElementById('users-query-results').setAttribute('hidden', true);
                showToast('Selecione ao menos um tipo de usuário', "warning");
            }
        }
        else if (event.target.id === 'confirm-delete-user-form') deleteUser();
    });

    function prepareQuery(event) {
        const formData = new FormData(event.target);
        const searchParam = Object.fromEntries(formData);
        console.log("Search param1: ", searchParam);

        const queryParams = [];
        if (searchParam.search) queryParams.push(`search=${searchParam.search}`);
        if (searchParam.includeAdmin) queryParams.push('role=admin');
        if (searchParam.includeOperator) queryParams.push('role=operator');
        if (searchParam.startDate) queryParams.push(`startDate=${new Date(searchParam.startDate).toISOString().split('T')[0]}`);
        if (searchParam.endDate) queryParams.push(`endDate=${new Date(searchParam.endDate).toISOString().split('T')[0]}`);

        return queryParams.length ? '?' + queryParams.join('&') : '';
    }

    function postPutUsers(event) {
        const formData = new FormData(event.target);
        const requestBody = Object.fromEntries(formData);

        const modal = document.getElementById('manageUser');
        const modalInstance = bootstrap.Modal.getInstance(modal) || new bootstrap.Modal(modal);

        if (document.getElementById("manage-method").value == 'POST') postUser(requestBody, modalInstance);
        else if (document.getElementById("manage-method").value == 'UPDATE') putUser(requestBody, modalInstance);
    }

    function postUser(requestBody, modalInstance) {
        if (passwordValidation(requestBody.password) && passwordConfirmation(requestBody.password, requestBody.confirmPassword)) {
            delete requestBody.confirmPassword;

            postData(`${API_URL}/users`, requestBody, 'Usuário cadastrado com sucesso').then((response) => {
                if (!response.error) {
                    console.log("Usuário cadastrado: ", response);
                    showToast('Usuário cadastrado com sucesso', "success");
                    modalInstance.hide();
                    searchUsers("");
                } else showToast(response.error, "danger");
            });
        }
    }

    function putUser(requestBody, modalInstance) {
        Object.keys(requestBody).forEach(key => {
            if (requestBody[key] === '') delete requestBody[key];
        });

        if (Object.keys(requestBody).length <= 1) modalInstance.hide();
        else {
            if (requestBody.password) {
                if (passwordValidation(requestBody.password) && passwordConfirmation(requestBody.password, requestBody.confirmPassword)) delete requestBody.confirmPassword;
                else return;
            }

            putData(`${API_URL}/users/${requestBody._id}`, requestBody, 'Usuário atualizado com sucesso').then((response) => {
                if (!response.error) {
                    console.log("Usuário atualizado: ", response);
                    showToast('Usuário atualizado com sucesso', "success");
                    modalInstance.hide();

                    searchUsers("");
                } else showToast(response.error, "danger");
            });
        }
    }

    function searchUsers(searchParam) {
        getData(`${API_URL}/users${searchParam}`, 'Busca realizada com sucesso!').then((response) => {
            if (!response.error) {
                console.log("Usuários encontrados: ", response);
                if (response.length == 0) {
                    document.getElementById('users-query-results').setAttribute('hidden', true);
                    showToast('Nenhum usuário encontrado', "warning");
                } else {
                    document.getElementById('users-query-results').removeAttribute('hidden');
                    const usersTable = document.getElementById('users-table-body');
                    usersTable.innerHTML = '';
                    response.forEach(user => {
                        const userJson = JSON.stringify(user).replace(/'/g, "&apos;").replace(/"/g, "&quot;");
                        const row = document.createElement('tr');
                        if (user.role !== 'operator') row.classList.add('table-active');
                        row.setAttribute('id', `user-tr-${user?.id}`);
                        row.tabIndex = 0;
                        row.dataset.bsToggle = 'popover';
                        row.dataset.bsTrigger = 'focus';

                        row.innerHTML = `
                            <th scope="row">${user?.name}</th>
                            <td>${user?.email}</td>
                            ${user?.role === 'operator' ? `
                            <td> Operador </td>
                            ` : `
                            <td> Administrador </td>`}
                            <td>${formatField('brDate', user?.createdAt)}</td>
                        `;

                        if (user?.role === 'operator') {
                            const buttons = document.createElement('td');
                            buttons.innerHTML = `<button class="btn btn-primary my-1" type="button" data-bs-toggle="modal" data-bs-title="Detalhes do Operador" data-bs-target="#manageUser" data-bs-action="UPDATE" data-bs-user="${userJson}"><i class="fa-solid fa-user"></i></button>
                            <button class="btn btn-danger my-1" type="button" data-bs-toggle="modal" data-bs-title="Deletar Operador" data-bs-target="#deleteUser" data-bs-user="${userJson}"><i class="fa-solid fa-trash"></i></button>`;

                            createPopovers(row, buttons);
                            createTooltips(buttons);
                        }
                        usersTable.appendChild(row);
                    });
                }
            } else showToast(response.error, "danger");
        });
    }

    function deleteUser() {
        const userId = document.getElementById('userToDelete').value;
        deleteData(`${API_URL}/users/${userId}`, 'Usuário deletado com sucesso').then((response) => {
            if (!response.error) {
                console.log("Response: ", response);
                showToast('Usuário deletado com sucesso', "success");

                const modal = document.getElementById('deleteUser');
                const modalInstance = bootstrap.Modal.getInstance(modal) || new bootstrap.Modal(modal);
                modalInstance.hide();

                searchUsers("");
            } else showToast(response.error, "danger");
        });
    }
});

