const manageCompanyModal = $('#manageCompany');
manageCompanyModal.on('show.bs.modal', event => {

    const triggerType = $(event.relatedTarget).data('bs-action');
    $('#manage-company input').val('');

    let companyData = {};
    if (triggerType === 'UPDATE') companyData = JSON.parse(event.relatedTarget.getAttribute('data-bs-customer').replace(/&quot;/g, '"').replace(/&apos;/g, "'"));

    $('#manageCompanyContent').html(`
        <div class="modal-header">
            <h1 class="modal-title fs-1" id="manageCompanyLabel">${triggerType === 'POST' ? 'Cadastrar Cliente Pessoa Jurídica' : 'Detalhes de Cliente Pessoa Jurídica'}</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <form id="manage-company">
            <div class="modal-body">

                <input type="hidden" id="manage-company-method" value="${triggerType}">
                <input type="hidden" id="manage-company-id" ${triggerType === 'UPDATE' ? `name="_id" value="${companyData?.id}"` : ''}>

                <div class="container-fluid">
                    <div class="row">
                        <h2 class="modal-title fs-3 mb-3">Dados da Empresa</h2>

                        <div class="col-12 col-lg-6">
                            <div class="form-floating mb-3">
                                <input type="text" class="${triggerType === 'POST' ? 'form-control' : 'form-control-plaintext'}" id="manage-company-name" name="companyName" placeholder="companyName" required ${triggerType === 'UPDATE' ? `value="${companyData?.name}" readonly` : ''}>
                                <label for="manage-company-name">Nome (*)</label>
                            </div>
                        </div>

                        <div class="col-6 col-lg-3">
                            <div class="form-floating mb-3">
                                <input type="text" class="${triggerType === 'POST' ? 'form-control' : 'form-control-plaintext'} cnpj" id="manage-company-cnpj" name="cnpj" placeholder="cnpj" required ${triggerType === 'UPDATE' ? `value="${companyData?.cnpj}" readonly` : ''}>
                                <label for="manage-company-cnpj">CNPJ (*)</label>
                            </div>
                        </div>

                        <div class="col-6 col-lg-3">
                            <div class="form-floating mb-3">
                                <input type="text" class="${triggerType === 'POST' ? 'form-control' : 'form-control-plaintext'} stateRegistration" id="manage-company-stateRegistration" name="stateRegistration" placeholder="stateRegistration" required ${triggerType === 'UPDATE' ? `value="${companyData?.stateRegistration}" readonly` : ''}>
                                <label for="manage-company-stateRegistration">Inscrição Estadual (*)</label>
                            </div>
                        </div>
                    </div>

                    <h3 class="modal-title fs-5 mb-3">Endereço</h3>

                    <div class="row">
                        <div class="col-12 col-sm-3 col-md-3">
                            <div class="form-floating mb-3">
                                <input type="text" class="${triggerType === 'POST' ? 'form-control' : 'form-control-plaintext'} cep" id="manage-company-address-cep" name="cep" placeholder="cep" required ${triggerType === 'UPDATE' ? `value="${companyData?.address?.cep}" readonly` : ''}>
                                <label for="manage-company-address-cep">CEP (*)</label>
                            </div>
                        </div>

                        <div class="col-12 col-sm-9 col-md-9">
                            <div class="form-floating mb-3">
                                <input type="text" class="${triggerType === 'POST' ? 'form-control' : 'form-control-plaintext'} street" id="manage-company-address-street" name="street" placeholder="street" required ${triggerType === 'UPDATE' ? `value="${companyData?.address?.street}" readonly` : ''}>
                                <label for="manage-company-address-street">Logradouro (*)</label>
                            </div>
                        </div>

                        <div class="col-12 col-sm-3 col-md-3">
                            <div class="form-floating mb-3">
                                <input type="number" class="${triggerType === 'POST' ? 'form-control' : 'form-control-plaintext'} address-number" id="manage-company-address-number" name="number" placeholder="number" required ${triggerType === 'UPDATE' ? `value="${companyData?.address?.number}" readonly` : ''}>
                                <label for="manage-company-address-number">Número (*)</label>
                            </div>
                        </div>

                        <div class="col-12 col-sm-9 col-md-9">
                            <div class="form-floating mb-3">
                                <input type="text" class="${triggerType === 'POST' ? 'form-control' : 'form-control-plaintext'} address-complement" id="manage-company-address-complement" name="complement" placeholder="addresComplement" ${triggerType === 'UPDATE' ? `value="${companyData?.address?.complement}" readonly` : ''}>
                                <label for="manage-company-address-complement">Complemento</label>
                            </div>
                        </div>

                        <div class="col-12 col-md-5 col-lg-5">
                            <div class="form-floating mb-3">
                                <input type="text" class="${triggerType === 'POST' ? 'form-control' : 'form-control-plaintext'} district" id="manage-company-address-district" name="district" placeholder="district" required ${triggerType === 'UPDATE' ? `value="${companyData?.address?.district}" readonly` : ''}>
                                <label for="manage-company-address-district">Bairro (*)</label>
                            </div>
                        </div>

                        <div class="col-12 col-sm-8 col-md-4 col-lg-5">
                            <div class="form-floating mb-3">
                                <input type="text" class="${triggerType === 'POST' ? 'form-control' : 'form-control-plaintext'} city" id="manage-company-address-city" name="city" placeholder="city" required ${triggerType === 'UPDATE' ? `value="${companyData?.address?.city}" readonly` : ''}>
                                <label for="manage-company-address-city">Cidade (*)</label>
                            </div>
                        </div>

                        <div class="col-12 col-sm-4 col-md-3 col-lg-2">
                            <div class="form-floating mb-3">
                                <select class="form-select state" id="manage-company-address-state" name="state" required ${triggerType === 'UPDATE' ? 'disabled' : ''}>
                            ${triggerType === 'POST' ? '<option selected disabled>Selecione</option>' : ''}
                            <option value="AC" ${triggerType === 'UPDATE' && companyData?.address?.state === 'AC' ? 'selected' : ''}>Acre</option>
                            <option value="AL" ${triggerType === 'UPDATE' && companyData?.address?.state === 'AL' ? 'selected' : ''}>Alagoas</option>
                            <option value="AP" ${triggerType === 'UPDATE' && companyData?.address?.state === 'AP' ? 'selected' : ''}>Amapá</option>
                            <option value="AM" ${triggerType === 'UPDATE' && companyData?.address?.state === 'AM' ? 'selected' : ''}>Amazonas</option>
                            <option value="BA" ${triggerType === 'UPDATE' && companyData?.address?.state === 'BA' ? 'selected' : ''}>Bahia</option>
                            <option value="CE" ${triggerType === 'UPDATE' && companyData?.address?.state === 'CE' ? 'selected' : ''}>Ceará</option>
                            <option value="DF" ${triggerType === 'UPDATE' && companyData?.address?.state === 'DF' ? 'selected' : ''}>Distrito Federal</option>
                            <option value="ES" ${triggerType === 'UPDATE' && companyData?.address?.state === 'ES' ? 'selected' : ''}>Espírito Santo</option>
                            <option value="GO" ${triggerType === 'UPDATE' && companyData?.address?.state === 'GO' ? 'selected' : ''}>Goiás</option>
                            <option value="MA" ${triggerType === 'UPDATE' && companyData?.address?.state === 'MA' ? 'selected' : ''}>Maranhão</option>
                            <option value="MT" ${triggerType === 'UPDATE' && companyData?.address?.state === 'MT' ? 'selected' : ''}>Mato Grosso</option>
                            <option value="MS" ${triggerType === 'UPDATE' && companyData?.address?.state === 'MS' ? 'selected' : ''}>Mato Grosso do Sul</option>
                            <option value="MG" ${triggerType === 'UPDATE' && companyData?.address?.state === 'MG' ? 'selected' : ''}>Minas Gerais</option>
                            <option value="PA" ${triggerType === 'UPDATE' && companyData?.address?.state === 'PA' ? 'selected' : ''}>Pará</option>
                            <option value="PB" ${triggerType === 'UPDATE' && companyData?.address?.state === 'PB' ? 'selected' : ''}>Paraíba</option>
                            <option value="PR" ${triggerType === 'UPDATE' && companyData?.address?.state === 'PR' ? 'selected' : ''}>Paraná</option>
                            <option value="PE" ${triggerType === 'UPDATE' && companyData?.address?.state === 'PE' ? 'selected' : ''}>Pernambuco</option>
                            <option value="PI" ${triggerType === 'UPDATE' && companyData?.address?.state === 'PI' ? 'selected' : ''}>Piauí</option>
                            <option value="RJ" ${triggerType === 'UPDATE' && companyData?.address?.state === 'RJ' ? 'selected' : ''}>Rio de Janeiro</option>
                            <option value="RN" ${triggerType === 'UPDATE' && companyData?.address?.state === 'RN' ? 'selected' : ''}>Rio Grande do Norte</option>
                            <option value="RS" ${triggerType === 'UPDATE' && companyData?.address?.state === 'RS' ? 'selected' : ''}>Rio Grande do Sul</option>
                            <option value="RO" ${triggerType === 'UPDATE' && companyData?.address?.state === 'RO' ? 'selected' : ''}>Rondônia</option>
                            <option value="RR" ${triggerType === 'UPDATE' && companyData?.address?.state === 'RR' ? 'selected' : ''}>Roraima</option>
                            <option value="SC" ${triggerType === 'UPDATE' && companyData?.address?.state === 'SC' ? 'selected' : ''}>Santa Catarina</option>
                            <option value="SP" ${triggerType === 'UPDATE' && companyData?.address?.state === 'SP' ? 'selected' : ''}>São Paulo</option>
                            <option value="SE" ${triggerType === 'UPDATE' && companyData?.address?.state === 'SE' ? 'selected' : ''}>Sergipe</option>
                            <option value="TO" ${triggerType === 'UPDATE' && companyData?.address?.state === 'TO' ? 'selected' : ''}>Tocantins</option>
                                </select>
                                <label for="manage-company-address-state">Estado (*)</label>
                            </div>
                        </div>
                    </div>

                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h3 class="modal-title fs-5">Representantes</h3>
                        <button id="createRepresentativeField" type="button" class="btn btn-secondary">
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                            </svg>
                        </button>
                    </div>
                    <div id="manage-company-representativesList">
                    ${triggerType === 'UPDATE' && companyData?.representatives.length > 0 ?
                        companyData?.representatives.map(representative => {
                            return generateRepresentativeField(representative?.id, representative?.name, representative?.email, representative?.phone, representative?.position, representative?.department).outerHTML;
                        }).join('')
                    : ''}
                    </div>

                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h3 class="modal-title fs-5">Parceiros</h3>
                        <button id="createPartnerField" type="button" class="btn btn-secondary">
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                            </svg>
                        </button>
                    </div>
                    <div id="manage-company-partnersList" class="row">
                    ${triggerType === 'UPDATE' && companyData?.partners.length > 0 ?
                        companyData?.partners.map(partner => {
                            return generatePartnerField(partner?.id, partner?.name).outerHTML;
                        }).join('')
                    : ''}
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="dismissModalAndCancelEdit">Fechar</button>
                <button type="${triggerType === 'POST' ? 'submit' : 'button'}" class="btn ${triggerType === 'POST' ? 'btn-success' : 'btn-primary'}" id="toggleModeAndSubmitCompany">${triggerType === 'POST' ? 'Cadastrar' : 'Editar'}</button>
            </div>
        </form>
    `);

    loadMasks();

    $("#manage-company .cep").focusout(function () {
        cepSearch($(this));
    });

    /* customersAndCompanies = await fetchCustomersAndCompanies();
    vehicles = await fetchVehicles();

    autocomplete(document.getElementById('manage-customerCompany'), customersAndCompanies);
    autocomplete(document.getElementById('manage-vehicle'), vehicles); */

    document.getElementById('createRepresentativeField').addEventListener('click', () => {
        const representativesList = document.getElementById('manage-company-representativesList');
        const newRepresentative = generateRepresentativeField(null, null, null, null, null, null);
        representativesList.appendChild(newRepresentative);
        $('.phone').mask('(00) 00000-0000');
    });

    document.getElementById('createPartnerField').addEventListener('click', () => {
        const partnersList = document.getElementById('manage-company-partnersList');
        const newPartner = generatePartnerField(null, null);
        partnersList.appendChild(newPartner);
    });

    const toggleSubmitButton = document.getElementById('toggleModeAndSubmitCompany');
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
        $('#manageCompanyLabel').text('Editar Cliente Pessoa Jurídica');
        $('#dismissModalAndCancelEdit').removeAttr('data-bs-dismiss');
        $('#dismissModalAndCancelEdit').text('Voltar para detalhes');

        $('#manage-company input').removeAttr('readonly');
        $('#manage-company-stateRegistration').attr('disabled', true);
        $('#manage-company-cnpj').attr('disabled', true);
        $('#manage-company input:not(.representative-input, .partner-input)').removeClass('form-control-plaintext').addClass('form-control');
        $('#toggleModeAndSubmitCompany').text('Salvar').removeClass('btn-primary').addClass('btn-success');
        $('#toggleModeAndSubmitCompany').attr('type', 'submit');

        editMode = true;
    }

    function exitEditMode() {
        $('#manageCompanyLabel').text('Detalhes de Cliente Pessoa Jurídica');
        $('#dismissModalAndCancelEdit').attr('data-bs-dismiss', 'modal');
        $('#dismissModalAndCancelEdit').text('Cancelar');

        $('#manage-company input').attr('readonly', true);
        $('#manage-company-stateRegistration').removeAttr('disabled');
        $('#manage-company-cnpj').removeAttr('disabled');
        $('#manage-company input:not(.representative-input, .partner-input)').removeClass('form-control').addClass('form-control-plaintext');
        $('#toggleModeAndSubmitCompany').text('Editar').removeClass('btn-success').addClass('btn-primary');
        $('#toggleModeAndSubmitCompany').attr('type', 'button');

        editMode = false;
    }
});



// MODAL DE CONFIRMAÇÃO DE DELEÇÃO DE EMPRESA
const deleteCompanyModal = $('#deleteCompany');
deleteCompanyModal.on('show.bs.modal', event => {
    const companyData = JSON.parse(event.relatedTarget.getAttribute('data-bs-customer').replace(/&quot;/g, '"').replace(/&apos;/g, "'"));
    $('#deleteCompanyContent').html(`
        <div class="modal-header">
            <h5 class="modal-title" id="deleteCompanyModalLabel">Deletar Empresa</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <form id="confirm-delete-company-form" class="d-flex flex-column gap-3" method="DELETE">
            <div class="modal-body">
                <input id="companyToDelete" type="hidden" name="companyToDelete" value="${companyData?.id}" />
                <p>Tem certeza que deseja deletar a empresa <strong>${companyData?.name}</strong>? Esta ação é irreversível.</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button id="confirm-delete-company" type="submit" class="btn btn-danger">Confirmar</button>
            </div>
        </form>
    `);
});
// FIM DO MODAL DE CONFIRMAÇÃO DE DELEÇÃO DE EMPRESA



// LÓGICA DE REPRESENTANTE
function generateRepresentativeField(id, name, email, phone, position, department) {
    const newRepresentative = document.createElement('div');
    id ? newRepresentative.setAttribute('id', `representative${id}`) : '';
    newRepresentative.classList.add('card', 'representative', 'mb-3', 'px-3');
    newRepresentative.innerHTML = `
        <div class="row">
            <div class="col-12 col-md-6 col-lg-4 p-2">
                <input type="text" class="form-control name representative-input" readonly placeholder="Nome (*)" ${name ? `value="${name}"` : ''} required>
            </div>

            <div class="col-12 col-md-6 col-lg-8 p-2">
                <input type="email" class="form-control email representative-input" readonly placeholder="Email (*)" ${email ? `value="${email}"` : ''} required>
            </div>

            <div class="col-12 col-md-4 col-lg-3 p-2">
                <input type="text" class="form-control phone representative-input" readonly placeholder="Telefone (*)" ${phone ? `value="${phone}"` : ''} required>
            </div>

            <div class="col-12 col-md-4 col-lg-4 p-2">
                <input type="text" class="form-control position representative-input" readonly placeholder="Cargo (*)" ${position ? `value="${position}"` : ''} required>
            </div>

            <div class="col-12 col-md-4 col-lg-5 p-2 d-flex">
                <input type="text" class="form-control department representative-input" readonly placeholder="Departamento (*)" ${department ? `value="${department}"` : ''} required>
                <button type="button" class="btn btn-outline-danger ms-2" onclick="deleteRepresentative(this.closest('.representative'), ${id ? id : null})">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"></path>
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"></path>
                    </svg>
                </button>
            </div>
        </div>
    `;
    return newRepresentative;
}

function deleteRepresentative(representativeElement, id) {
    if (id) {
        deleteData(`${API_URL}/representatives/${id}`, 'Representante deletado com sucesso').then((response) => {
            if (!response.error) {
                console.log("Response: ", response);
                showToast('Representante deletado com sucesso', "success");
                representativeElement.remove();

                const companyId = document.getElementById('manage-company-id').value;
                const updatedUserRow = $(`#company-tr-${companyId}`);
                if (updatedUserRow.length) {
                    const companyData = JSON.parse(updatedUserRow.find('button[data-bs-target="#manageCompany"]').attr('data-bs-customer').replace(/&quot;/g, '"').replace(/&apos;/g, "'"));
                    companyData.representatives = companyData.representatives.filter(rep => rep.id !== id);

                    let representativesEmails = '';
                    let representativesPhones = '';
                    if (companyData.representatives && companyData.representatives.length > 0) {
                        representativesEmails = companyData.representatives.map(rep => rep.email).join('<br>');
                        representativesPhones = companyData.representatives.map(rep => formatField('telephone', rep.phone)).join('<br>');
                    }

                    updatedUserRow.find('td:nth-child(3)').html(representativesEmails);
                    updatedUserRow.find('td:nth-child(4)').html(representativesPhones);

                    const companyJson = JSON.stringify(companyData).replace(/'/g, "&apos;").replace(/"/g, "&quot;");
                    updatedUserRow.find('button[data-bs-target="#manageCompany"]').attr('data-bs-customer', companyJson);
                    updatedUserRow.find('button[data-bs-target="#deleteCompany"]').attr('data-bs-customer', companyJson);
                }
            } else showToast(response.error, "danger");
        });
    } else representativeElement.remove();
}
// FIM DA LÓGICA DE REPRESENTANTE



{/* <div class="col-12 col-md-4 col-lg-5 p-2 d-flex">
    <input type="text" class="form-control department" placeholder="Departamento (*)" ${department ? `value="${department}"` : ''} required>
    <button type="button" class="btn btn-outline-danger ms-2" onclick="deleteRepresentative(this.closest('.representative'), ${id ? id : null})">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"></path>
            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"></path>
        </svg>
    </button>
</div> */}

// LÓGICA DE SÓCIO
function generatePartnerField(id, name) {
    const newPartner = document.createElement('div');
    id ? newPartner.setAttribute('id', `partner${id}`) : '';
    newPartner.classList.add('partner', 'col-12', 'col-md-6', 'col-xl-4');
    newPartner.innerHTML = `
        <div class="input-group mb-3">
            <input type="text" class="form-control name partner-input" readonly placeholder="Nome" ${name ? `value="${name}"` : ''}>
            <button type="button" class="btn btn-outline-danger" onclick="deletePartner(this.closest('.partner'), ${id ? id : null})">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"></path>
                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"></path>
                </svg>
            </button>
        </div>
    `;
    return newPartner;
}

function deletePartner(partnerElement, id) {
    if (id) {
        deleteData(`${API_URL}/partners/${id}`, 'Sócio deletado com sucesso').then((response) => {
            if (!response.error) {
                console.log("Response: ", response);
                showToast('Sócio deletado com sucesso', "success");
                partnerElement.remove();

                const companyId = document.getElementById('manage-company-id').value;
                const updatedUserRow = $(`#company-tr-${companyId}`);
                if (updatedUserRow.length) {
                    const companyData = JSON.parse(updatedUserRow.find('button[data-bs-target="#manageCompany"]').attr('data-bs-customer').replace(/&quot;/g, '"').replace(/&apos;/g, "'"));
                    companyData.partners = companyData.partners.filter(partner => partner.id !== id);
                    const companyJson = JSON.stringify(companyData).replace(/'/g, "&apos;").replace(/"/g, "&quot;");
                    updatedUserRow.find('button[data-bs-target="#manageCompany"]').attr('data-bs-customer', companyJson);
                    updatedUserRow.find('button[data-bs-target="#deleteCompany"]').attr('data-bs-customer', companyJson);
                }
            } else showToast(response.error, "danger");
        });
    } else partnerElement.remove();
}
// FIM DA LÓGICA DE SÓCIO