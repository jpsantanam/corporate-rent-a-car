document.addEventListener('DOMContentLoaded', function () {
    searchCustomers("", ['customer', 'company']);

    document.body.addEventListener('submit', function (event) {
        event.preventDefault();
        if (event.target.id === 'manage-customer') postPutCustomers(event); // essa linha é o motivo pra `name="_id"` no form
        else if (event.target.id === 'confirm-delete-customer-form') deleteCustomer();

        else if (event.target.id === 'manage-company') postPutCompanies(event); // essa linha é o motivo pra `name="_id"` no form
        else if (event.target.id === 'confirm-delete-company-form') deleteCompany();

        else if (event.target.id === 'search-customer') {
            const formData = new FormData(event.target);
            const searchParam = Object.fromEntries(formData);
            console.log("Search param: ", searchParam);

            const query = prepareQuery(searchParam);
            console.log("Query: ", query);

            const customerTypes = [];
            if (searchParam.includeCustomer) customerTypes.push('customer');
            if (searchParam.includeCompany) customerTypes.push('company');

            searchCustomers(query, customerTypes);
        }
    });

    function prepareQuery(searchParam) {
        const queryParams = [];

        if (searchParam.search) queryParams.push(`search=${searchParam.search}`);
        if (searchParam.startDate) queryParams.push(`startDate=${new Date(searchParam.startDate).toISOString().split('T')[0]}`);
        if (searchParam.endDate) queryParams.push(`endDate=${new Date(searchParam.endDate).toISOString().split('T')[0]}`);

        return queryParams.length ? '?' + queryParams.join('&') : '';
    }

    // CUSTOMER MANAGEMENT
    function postPutCustomers(event) {
        $("#manage-customer-address-cep").closest('form').find("input, select").removeAttr('disabled');

        const formData = new FormData(event.target);
        let requestBody = Object.fromEntries(formData);

        const modal = document.getElementById('manageCustomer');
        const modalInstance = bootstrap.Modal.getInstance(modal) || new bootstrap.Modal(modal);

        if (validateCpf(requestBody.cpf) && validateTelephone(requestBody.telephone) && validateDriverLicense(requestBody.driverLicenseNumber) && validateCep(requestBody.cep)) {
            requestBody = {
                cpf: parseInt(requestBody?.cpf.replace(/\D/g, '')),
                name: requestBody?.name,
                fatherName: requestBody?.fatherName,
                motherName: requestBody?.motherName,
                maritalStatus: requestBody?.maritalStatus,
                birthday: new Date(requestBody?.birthday),
                email: requestBody?.email,
                telephone: parseInt(requestBody?.telephone.replace(/\D/g, '')),
                rg: {
                    number: requestBody?.rgNumber,
                    issuingBody: requestBody?.rgIssuingBody,
                    issuingDate: new Date(requestBody?.issuingDate),
                    state: requestBody?.rgState
                },
                driverLicense: {
                    number: requestBody?.driverLicenseNumber,
                    issuingBody: requestBody?.driverLicenseIssuingBody,
                    expirationDate: new Date(requestBody?.expirationDate),
                    firstDate: new Date(requestBody?.firstDate),
                    category: requestBody?.category
                },
                address: {
                    cep: parseInt(requestBody?.cep.replace(/\D/g, '')),
                    number: parseInt(requestBody?.addressNumber.replace(/\D/g, '')),
                    complement: requestBody?.complement,
                    district: requestBody?.district,
                    street: requestBody?.street,
                    city: requestBody?.city,
                    state: requestBody?.addressState
                }
            }

            console.log("Request body: ", requestBody);

            if ($("#manage-customer-method").val() == 'POST') postCustomer(requestBody, modalInstance);
            else if ($("#manage-customer-method").val() == 'UPDATE') putCustomer(requestBody, modalInstance, Object.fromEntries(formData)._id);
        }
    }

    function postCustomer(requestBody, modalInstance) {
        postData(`${API_URL}/customers`, requestBody, 'Cliente cadastrado com sucesso').then((response) => {
            if (!response.error) {
                console.log("Cliente cadastrado: ", response);
                showToast('Cliente cadastrado com sucesso', "success");
                modalInstance.hide();
                searchCustomers("", ['customer', 'company']);
            } else showToast(response.error, "danger");
        });
    }

    function putCustomer(requestBody, modalInstance, customerId) {
        putData(`${API_URL}/customers/${customerId}`, requestBody, 'Cliente atualizado com sucesso').then((response) => {
            if (!response.error) {
                console.log("Cliente atualizado: ", response);
                showToast('Cliente atualizado com sucesso', "success");
                modalInstance.hide();
                searchCustomers("", ['customer', 'company']);
            } else showToast(response.error, "danger");
        });
    }

    function deleteCustomer() {
        const customerId = document.getElementById('customerToDelete').value;
        deleteData(`${API_URL}/customers/${customerId}`, 'Cliente deletado com sucesso').then((response) => {
            if (!response.error) {
                console.log("Response: ", response);
                showToast('Cliente deletado com sucesso', "success");

                const modal = document.getElementById('deleteCustomer');
                const modalInstance = bootstrap.Modal.getInstance(modal) || new bootstrap.Modal(modal);
                modalInstance.hide();

                searchCustomers("", ['customer', 'company']);
            } else showToast(response.error, "danger");
        });
    }
    // END CUSTOMER MANAGEMENT



    // COMPANY MANAGEMENT
    function postPutCompanies(event) {
        $("#manage-company-address-cep").closest('form').find("input, select").removeAttr('disabled');

        const formData = new FormData(event.target);
        let requestBody = Object.fromEntries(formData);

        //console.log("Request body: ", requestBody);

        const modal = document.getElementById('manageCompany');
        const modalInstance = bootstrap.Modal.getInstance(modal) || new bootstrap.Modal(modal);

        if (validateCnpj(requestBody.cnpj) && validateStateRegistration(requestBody.stateRegistration) && validateCep(requestBody.cep) && validateRepresentatives(document.querySelectorAll('.representative'))) {

            const representatives = [];
            document.querySelectorAll('.representative').forEach(representativeElement => {
                const representative = {
                    name: representativeElement.querySelector('.name').value.trim(),
                    email: representativeElement.querySelector('.email').value.trim(),
                    phone: parseInt(representativeElement.querySelector('.phone').value.trim().replace(/\D/g, '')),
                    position: representativeElement.querySelector('.position').value.trim(),
                    department: representativeElement.querySelector('.department').value.trim()
                };
                if (representativeElement.id) representative.id = parseInt(representativeElement.id.replace('representative', ''));
                representatives.push(representative);
            });

            const partners = [];
            document.querySelectorAll('.partner').forEach(partnerElement => {
                const partnerInput = partnerElement.querySelector('.name');
                if (partnerInput.value.trim() !== '') {
                    const partner = {
                        name: partnerInput.value.trim()
                    };
                    if (partnerElement.id) partner.id = parseInt(partnerElement.id.replace('partner', ''));
                    partners.push(partner);
                }
            });

            requestBody = {
                cnpj: requestBody?.cnpj.replace(/\D/g, ''),
                name: requestBody?.companyName,
                stateRegistration: requestBody?.stateRegistration.replace(/\D/g, ''),
                address: {
                    cep: parseInt(requestBody?.cep.replace(/\D/g, '')),
                    number: parseInt(requestBody?.number.replace(/\D/g, '')),
                    complement: requestBody?.complement,
                    district: requestBody?.district,
                    street: requestBody?.street,
                    city: requestBody?.city,
                    state: requestBody?.state
                },
                representatives: representatives,
                partners: partners
            }

            //console.log("Request body: ", requestBody);

            if ($("#manage-company-method").val() == 'POST') postCompany(requestBody, modalInstance);
            else if ($("#manage-company-method").val() == 'UPDATE') putCompany(requestBody, modalInstance, Object.fromEntries(formData)._id, representatives, partners);
        }
    }

    function postCompany(requestBody, modalInstance) {
        postData(`${API_URL}/companies`, requestBody, 'Empresa cadastrada com sucesso').then((response) => {
            if (!response.error) {
                console.log("Empresa cadastrada: ", response);
                showToast('Empresa cadastrada com sucesso', "success");
                modalInstance.hide();
                searchCustomers("", ['customer', 'company']);
            } else showToast(response.error, "danger");
        });
    }

    function putCompany(requestBody, modalInstance, companyId, representatives, partners) {
        upsertPartners(partners, companyId);
        upsertRepresentatives(representatives, companyId);
        putData(`${API_URL}/companies/${companyId}`, requestBody, 'Empresa atualizada com sucesso').then((response) => {
            if (!response.error) {
                console.log("Empresa atualizada: ", response);
                showToast('Empresa atualizada com sucesso', "success");
                modalInstance.hide();
                searchCustomers("", ['customer', 'company']);
            } else showToast(response.error, "danger");
        });
    }

    function deleteCompany() {
        const companyId = document.getElementById('companyToDelete').value;
        deleteData(`${API_URL}/companies/${companyId}`, 'Empresa deletada com sucesso').then((response) => {
            if (!response.error) {
                console.log("Response: ", response);
                showToast('Empresa deletada com sucesso', "success");

                const modal = document.getElementById('deleteCompany');
                const modalInstance = bootstrap.Modal.getInstance(modal) || new bootstrap.Modal(modal);
                modalInstance.hide();

                searchCustomers("", ['customer', 'company']);
            } else showToast(response.error, "danger");
        });
    }

    const upsertPartners = (partners, companyId) => {
        const partnersToPost = [];
        const partnersToPut = [];

        partners.forEach(partner => {
            if (!partner.id) partnersToPost.push(partner);
            else partnersToPut.push(partner);
        });

        if (partnersToPost.length > 0) {
            partnersToPost.forEach(partner => {
                postData(`${API_URL}/companies/${companyId}/partners`, partner, 'Sócio cadastrado com sucesso').then((response) => {
                    if (!response.error) {
                        console.log("Sócio cadastrado: ", response);
                    } else showToast(response.error, "danger");
                });
            });
        }
        if (partnersToPut.length > 0) {
            partnersToPut.forEach(partner => {
                putData(`${API_URL}/partners/${partner.id}`, partner, 'Sócio atualizado com sucesso').then((response) => {
                    if (!response.error) {
                        console.log("Sócio atualizado: ", response);
                    } else showToast(response.error, "danger");
                });
            });
        }
    }

    const upsertRepresentatives = (representatives, companyId) => {
        const representativesToPost = [];
        const representativesToPut = [];

        representatives.forEach(representative => {
            if (!representative.id) {
                representativesToPost.push(representative);
            } else {
                representativesToPut.push(representative);
            }
        });

        if (representativesToPost.length > 0) {
            representativesToPost.forEach(representative => {
                postData(`${API_URL}/companies/${companyId}/representatives`, representative, 'Representante cadastrado com sucesso').then((response) => {
                    if (!response.error) {
                        console.log("Representante cadastrado: ", response);
                    } else showToast(response.error, "danger");
                });
            });
        }
        if (representativesToPut.length > 0) {
            representativesToPut.forEach(representative => {
                putData(`${API_URL}/representatives/${representative.id}`, representative, 'Representante atualizado com sucesso').then((response) => {
                    if (!response.error) {
                        console.log("Representante atualizado: ", response);
                    } else showToast(response.error, "danger");
                });
            });
        }
    }
    // END COMPANY MANAGEMENT



    async function fetchCustomersAndCompanies(searchParam, customerTypes) {
        let customerResponse = [];
        let companyResponse = [];

        try {
            if (customerTypes.includes('customer')) {
                customerResponse = await getData(`${API_URL}/customers${searchParam}`, 'Clientes buscados com sucesso!');
                if (!customerResponse.error) console.log("Clientes encontrados: ", customerResponse);
                else showToast(customerResponse.error, "danger");
            }

            if (customerTypes.includes('company')) {
                companyResponse = await getData(`${API_URL}/companies${searchParam}`, 'Empresas buscadas com sucesso!');
                if (!companyResponse.error) console.log("Empresas encontradas: ", companyResponse);
                else showToast(companyResponse.error, "danger");
            }

            return [...customerResponse, ...companyResponse].sort((a, b) => a.name.localeCompare(b.name));
        } catch (error) {
            showToast(error.message, "danger");
        }
    }

    // CUSTOMER/COMPANY SEARCH
    async function searchCustomers(searchParam, customerTypes) {
        if (!customerTypes || customerTypes.length == 0) {
            document.getElementById('customers-query-results').setAttribute('hidden', true);
            showToast('Selecione ao menos um tipo de cliente', "warning");
            return;
        }

        const combinedResults = await fetchCustomersAndCompanies(searchParam, customerTypes);

        if (combinedResults.length == 0) {
            document.getElementById('customers-query-results').setAttribute('hidden', true);
            showToast('Nenhum cliente encontrado', "warning");
        } else {
            document.getElementById('customers-query-results').removeAttribute('hidden');
            const customersTable = document.getElementById('customers-table-body');
            customersTable.innerHTML = '';
            combinedResults.forEach(async customer => {
                const customerJson = JSON.stringify(customer).replace(/'/g, "&apos;").replace(/"/g, "&quot;");
                const row = document.createElement('tr');
                row.tabIndex = 0;
                row.dataset.bsToggle = 'popover';
                row.dataset.bsTrigger = 'focus';

                if (customer.cnpj) row.classList.add('table-active');
                customer.cpf ? row.setAttribute('id', `customer-tr-${customer.id}`) : row.setAttribute('id', `company-tr-${customer.id}`);
                const customerType = customer.cpf ? 'Customer' : 'Company';

                let representativesEmails = '';
                let representativesPhones = '';
                if (customer.representatives) {
                    if (customer.representatives instanceof Array && customer.representatives.length > 0) {
                        representativesEmails = customer.representatives.map(rep => rep.email).join('<br>');
                        representativesPhones = customer.representatives.map(rep => formatField('telephone', rep.phone)).join('<br>');
                    } else if (customer.representatives instanceof Object && Object.keys(customer.representatives).length) {
                        representativesEmails = customer.representatives.email;
                        representativesPhones = formatField('telephone', customer.representatives.phone);
                    }
                }

                row.innerHTML = `
                    <th scope="row">${customer.name}</th>
                    ${customer.cpf ? `
                        <td>${formatField('cpf', customer.cpf)}</td>
                        <td>${customer.email}</td>
                        <td>${formatField('telephone', customer.telephone)}</td>
                        ` : `
                        <td>${formatField('cnpj', customer.cnpj)}</td>
                        <td>${representativesEmails}</td>
                        <td>${representativesPhones}</td>
                    `}
                    <td>${formatField('brDate', customer.createdAt)}</td>
                `;

                const buttons = document.createElement('td');
                buttons.innerHTML = `<button class="btn btn-primary my-1" type="button" data-bs-toggle="modal" data-bs-title="Detalhes do Cliente" data-bs-target="#manage${customerType}" data-bs-action="UPDATE" data-bs-customer="${customerJson}"><i class="fa-solid fa-user"></i></button>
                        <button class="btn btn-danger my-1" type="button" data-bs-toggle="modal" data-bs-title="Deletar Cliente" data-bs-target="#delete${customerType}" data-bs-customer="${customerJson}"><i class="fa-solid fa-trash"></i></button>`

                const rentButton = await createRentButton(customer);
                buttons.appendChild(rentButton);

                const rentHistoryButton = await createRentHistoryButton(customer);
                if (rentHistoryButton) buttons.appendChild(rentHistoryButton);

                createPopovers(row, buttons);
                createTooltips(buttons);

                customersTable.appendChild(row);
            });
        }
    }
    // END CUSTOMER/COMPANY SEARCH
});