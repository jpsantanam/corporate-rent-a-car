document.addEventListener('DOMContentLoaded', function () {
    const searchParam = "/" + window.location.search.substring(1);
    searchRents(searchParam == "/" ? "/rents" : searchParam);

    document.body.addEventListener('submit', function (event) {
        event.preventDefault();
        if (event.target.id === 'manage-rent') postPutRents(event); // essa linha é o motivo pra `name="_id"` no form
        else if (event.target.id === 'search-rent') {
            const searchParam = prepareQuery(event);
            console.log("Search param2: ", searchParam);

            if (searchParam.includes('status=true') || searchParam.includes('status=false')) searchRents(`/rents${searchParam}`);
            else {
                document.getElementById('rents-query-results').setAttribute('hidden', true);
                showToast('Selecione ao menos um status de aluguel', "warning");
            }
        }
        else if (event.target.id === 'cancelDeleteRentForm') cancelDeleteRents(event);
    });

    function prepareQuery(event) {
        const formData = new FormData(event.target);
        const searchParam = Object.fromEntries(formData);
        console.log("Search param1: ", searchParam);

        const queryParams = [];
        if (searchParam.search) queryParams.push(`search=${searchParam.search}`);
        if (searchParam.includeActive) queryParams.push('status=true');
        if (searchParam.includeInactive) queryParams.push('status=false');
        if (searchParam.startDate) queryParams.push(`startDate=${new Date(searchParam.startDate).toISOString().split('T')[0]}`);
        if (searchParam.endDate) queryParams.push(`endDate=${new Date(searchParam.endDate).toISOString().split('T')[0]}`);

        return queryParams.length ? '?' + queryParams.join('&') : '';
    }

    function postPutRents(event) {
        const formData = new FormData(event.target);
        const requestBody = Object.fromEntries(formData);

        console.log("requestBody antes: ", requestBody);

        if (validateCustomerOrCompany(requestBody?.customerCompany) && validateVehicle(requestBody?.vehicleId)) {
            const entityId = event.target.customerCompany.getAttribute('data-id');
            const entityName = requestBody?.customerCompany;
            const entity = customersAndCompanies.find(item => item?.name === entityName);
            const entityKey = entity?.cpf ? 'customerId' : 'companyId';
            requestBody[entityKey] = parseInt(entityId);
            delete requestBody.customerCompany;

            requestBody.vehicleId = parseInt(event.target['vehicleId'].getAttribute('data-id'));
            requestBody.value = parseFloat(requestBody.value.replace('R$', '').replace(/\./g, '').replace(',', '.'));
            requestBody.startDate = new Date(requestBody?.startDate);
            requestBody.endDate = new Date(requestBody?.endDate);

            console.log("requestBody depois: ", requestBody);

            const modal = document.getElementById('manageRent');
            const modalInstance = bootstrap.Modal.getInstance(modal) || new bootstrap.Modal(modal);

            if (document.getElementById("manage-method").value == 'POST') postRent(requestBody, modalInstance);
            else if (document.getElementById("manage-method").value == 'UPDATE') putRent(requestBody, modalInstance);
        }
    }

    function postRent(requestBody, modalInstance) {
        postData(`${API_URL}/rents`, requestBody, 'Aluguel cadastrado com sucesso').then((response) => {
            if (!response.error) {
                console.log("Aluguel cadastrado: ", response);
                showToast('Aluguel cadastrado com sucesso', "success");
                modalInstance.hide();
                searchRents("/rents");
            } else showToast(response.error, "danger");
        });
    }

    function putRent(requestBody, modalInstance) {
        putData(`${API_URL}/rents/${requestBody._id}`, requestBody, 'Aluguel atualizado com sucesso').then((response) => {
            delete requestBody._id;

            if (!response.error) {
                console.log("Aluguel atualizado: ", response);
                showToast('Aluguel atualizado com sucesso', "success");
                modalInstance.hide();
                searchRents("/rents");
            } else showToast(response.error, "danger");
        });
    }

    function searchRents(searchParam) {
        getData(`${API_URL}${searchParam}`, 'Busca realizada com sucesso!').then((response) => {
            if (!response.error) {
                console.log("Aluguéis encontrados: ", response);
                if (response.length == 0) {
                    document.getElementById('rents-query-results').setAttribute('hidden', true);
                    showToast('Nenhum aluguel encontrado', "warning");
                } else {
                    document.getElementById('rents-query-results').removeAttribute('hidden');
                    const rentsTable = document.getElementById('rents-table-body');
                    rentsTable.innerHTML = '';
                    response.forEach(rent => {
                        const rentJson = JSON.stringify(rent).replace(/'/g, "&apos;").replace(/"/g, "&quot;");
                        const row = document.createElement('tr');
                        if (rent?.status === false) row.classList.add('table-active');
                        row.setAttribute('id', `rent-tr-${rent?.id}`);
                        row.tabIndex = 0;
                        row.dataset.bsToggle = 'popover';
                        row.dataset.bsTrigger = 'focus';

                        row.innerHTML = `
                            <th scope="row">${formatField('currency', rent?.value)}</th>
                            ${rent?.customer == null ? `<td>${rent?.company?.name}<br><small><em>${formatField('cpf', rent?.company?.cnpj)}</em></small></td>`
                                : `<td>${rent?.customer?.name}<br><small><em>${formatField('cpf', rent?.customer?.cpf)}</em></small></td>`}
                            <td>${rent?.vehicle?.brand} ${rent?.vehicle?.model} ${rent?.vehicle?.motorization} ${rent?.vehicle?.year}<br><small><em>${formatField('carPlate', rent?.vehicle?.plate)}</em></small></td>
                            <td>${rent?.status ? 'Ativo' : 'Inativo'}</td>
                            <td>${rent?.coverage}</td>
                            <td>${formatField('brDate', rent?.startDate)}</td>
                            <td>${formatField('brDate', rent?.endDate)}</td>
                        `;
                        const buttons = document.createElement('td');
                        buttons.innerHTML = `<button class="btn btn-primary my-1" type="button" data-bs-toggle="modal" data-bs-title="Detalhes do Aluguel" data-bs-target="#manageRent" data-bs-action="UPDATE" data-bs-rent="${rentJson}"><i class="fa-solid fa-key"></i></button>
                                ${rent?.status === true ? `<button class="btn btn-warning my-1" type="button" data-bs-toggle="modal" data-bs-title="Cancelar Aluguel" data-bs-target="#cancelDeleteRent" data-bs-action="CANCEL" data-bs-rent="${rentJson}"><i class="fa-solid fa-cancel text-white"></i></button>` : ''}
                                <button class="btn btn-danger my-1" type="button" data-bs-toggle="modal" data-bs-title="Deletar Aluguel" data-bs-target="#cancelDeleteRent" data-bs-action="DELETE" data-bs-rent="${rentJson}"><i class="fa-solid fa-trash"></i></button>
                                ${rent?.status === true ? `<button class="btn btn-success my-1" id="download" type="button" data-bs-title="Baixar Contrato" data-rent-id="${rent?.id}" data-bs-rent="${rentJson}"><i class="fa-solid fa-download"></i></button>` : ''}`

                        createPopovers(row, buttons);
                        createTooltips(buttons);

                        rentsTable.appendChild(row);
                    });
                }
            } else showToast(response.error, "danger");
        });
    }
    
    const getFinesForRent = async(data) => {
        const fineId = parseInt(data.id);
        const rentFines = await getFinesByRents(fineId);
        if (rentFines.length === 0) return null;
        return rentFines;
    }
    const getFinesByRents = async (id) => {
        try {
            const response = await fetch(`${API_URL}/rents/${id}/fines`);
            if (response.ok) {
                const json = await response.json();
                return json;
            } else {
                return [];
            }
        } catch (error) {
            console.error(error.message);
            return [];
        }
    }
    async function getFinesButtons(rent) {
        const fines = await getFinesForRent(rent);
        const array = [];
    
        if (!fines || fines.length === 0) {
            // Adiciona o botão de cadastro se não houver multas
            array.push('Cadastrar');
        } else {
            // Verifica se existe uma multa ativa
            const activeFine = fines.find(fine => fine.status === 'active');
    
            if (activeFine) {
                // Adiciona o botão de visualização/edição se houver uma multa ativa
                array.push('Vizualizar');
            } else {
                // Adiciona o botão de cadastro se todas as multas estiverem inativas
                array.push('Cadastrar');
            }
    
            // Adiciona o botão de histórico se houver qualquer multa
            array.push('Historico');
        }
    
        console.log(array);
        return array;
        
    }
    function cancelDeleteRents(event) {
        const formMethod = event.target.getAttribute('method');
        const rentId = formMethod === 'DELETE' ? document.getElementById('rentToDelete').value : document.getElementById('rentToCancel').value;

        if (formMethod === 'DELETE') deleteRent(rentId);
        else if (formMethod === 'PUT') cancelRent(rentId);
    }

    function deleteRent(rentId) {
        deleteData(`${API_URL}/rents/${rentId}`, 'Aluguel deletado com sucesso').then((response) => {
            if (!response.error) {
                console.log("Aluguel deletado: ", response);
                showToast('Aluguel deletado com sucesso', "success");

                const modal = document.getElementById('cancelDeleteRent');
                const modalInstance = bootstrap.Modal.getInstance(modal) || new bootstrap.Modal(modal);
                modalInstance.hide();

                searchRents("/rents");
            } else showToast(response.error, "danger");
        });
    }

    function cancelRent(rentId) {
        const requestBody = { status: false };
        putData(`${API_URL}/rents/${rentId}`, requestBody, 'Aluguel cancelado com sucesso').then((response) => {
            if (!response.error) {
                console.log("Aluguel cancelado: ", response);
                showToast('Aluguel cancelado com sucesso', "success");

                const modal = document.getElementById('cancelDeleteRent');
                const modalInstance = bootstrap.Modal.getInstance(modal) || new bootstrap.Modal(modal);
                modalInstance.hide();
                searchRents("/rents");
            } else showToast(response.error, "danger");
        });
    }
});