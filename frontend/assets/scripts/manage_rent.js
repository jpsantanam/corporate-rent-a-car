async function fetchCustomersAndCompanies() {
    try {
        const customerResponse = await getData(`${API_URL}/customers`, 'Clientes buscados com sucesso!');
        if (customerResponse.error) {
            console.error("Error fetching customers:", customerResponse.error);
            return;
        }

        const formattedCustomers = customerResponse.map(customer => ({
            id: customer?.id,
            name: customer?.name,
            cpf: customer?.cpf,
        }));

        const companyResponse = await getData(`${API_URL}/companies`, 'Empresas buscadas com sucesso!');
        if (companyResponse.error) {
            console.error("Error fetching companies:", companyResponse.error);
            return;
        }

        const formattedCompanies = companyResponse.map(company => ({
            id: company?.id,
            name: company?.name,
            cnpj: company?.cnpj,
        }));

        return [...formattedCustomers, ...formattedCompanies].sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function fetchVehicles() {
    try {
        const vehicleResponse = await getData(`${API_URL}/vehicles`, 'Veículos buscados com sucesso!');
        if (vehicleResponse.error) {
            console.error("Error fetching vehicles:", vehicleResponse.error);
            return;
        }

        const formattedVehicles = vehicleResponse.map(vehicle => ({
            id: vehicle?.id,
            name: `${vehicle?.brand} ${vehicle?.model} ${vehicle?.motorization} ${vehicle?.year}`,
            plate: vehicle?.plate,
        }));

        return formattedVehicles.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

let customersAndCompanies = [];
let vehicles = [];

const manageRentModal = $('#manageRent');
manageRentModal.on('show.bs.modal', async event => {

    const triggerType = $(event.relatedTarget).data('bs-action');
    $('#manage-rent input').val('');

    let rentData = {};
    if (triggerType === 'UPDATE') rentData = JSON.parse(event.relatedTarget.getAttribute('data-bs-rent').replace(/&quot;/g, '"').replace(/&apos;/g, "'"));

    $('#manageRentContent').html(`
        <div class="modal-header">
            <h1 class="modal-title fs-1" id="manageRentLabel">${triggerType === 'POST' ? 'Cadastrar Novo Aluguel' : 'Detalhes de Aluguel'}</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <form id="manage-rent">
            <div class="modal-body">

                <input type="hidden" id="manage-method" value="${triggerType}">
                <input type="hidden" id="manage-id" ${triggerType === 'UPDATE' ? `name="_id" value="${rentData?.id}"` : ''}>

                <div class="container-fluid">
                    <div class="row">

                        <div class="col-12 col-sm-6 col-lg-5 mb-3">
                            <div class="form-floating">
                                <input type="text" class="${triggerType === 'POST' ? 'form-control' : 'form-control-plaintext'}" id="manage-vehicle" name="vehicleId" autocomplete="off" required ${triggerType === 'UPDATE' ? `value="${rentData?.vehicle?.brand} ${rentData?.vehicle?.model} ${rentData?.vehicle?.motorization} ${rentData?.vehicle?.year}" data-id="${rentData?.vehicle?.id}" readonly` : ''}>
                                <label for="manage-vehicle">Veículo (*)</label>
                            </div>
                        </div>

                        <div class="col-12 col-sm-6 col-lg-5 mb-3">
                            <div class="form-floating">
                                <input type="text" class="${triggerType === 'POST' ? 'form-control' : 'form-control-plaintext'}" id="manage-customerCompany" name="customerCompany" autocomplete="off" required ${triggerType === 'UPDATE' ? `value="${rentData?.customer ? rentData?.customer?.name : rentData?.company?.name}" data-id="${rentData?.customer ? rentData?.customer?.id : rentData?.company?.id}" readonly` : ''}>
                                <label for="manage-customerCompany">Cliente/Empresa (*)</label>
                            </div>
                        </div>

                        <div class="col-6 col-lg-2 mb-3">
                            <div class="form-floating">
                                <input type="text" class="${triggerType === 'POST' ? 'form-control' : 'form-control-plaintext'} currency" id="manage-value" name="value" required ${triggerType === 'UPDATE' ? `value="${formatField('currency', rentData?.value)}" readonly` : ''}>
                                <label for="manage-value">Valor (*)</label>
                            </div>
                        </div>

                        <div class="col-6 col-lg-3 mb-3">
                            <div class="form-floating">
                                <input type="text" class="${triggerType === 'POST' ? 'form-control' : 'form-control-plaintext'}" id="manage-coverage" name="coverage" required ${triggerType === 'UPDATE' ? `value="${rentData?.coverage}" readonly` : ''}>
                                <label for="manage-coverage">Cobertura (*)</label>
                            </div>
                        </div>

                        <div class="col-12 col-lg-3 mb-3">
                            <div class="form-floating">
                                <select class="form-select" id="manage-status" name="status" required ${triggerType === 'UPDATE' ? 'disabled' : ''}>
                                    ${triggerType === 'POST' ? '<option selected disabled>Selecione</option>' : ''}
                                    <option value="true" ${triggerType === 'UPDATE' && rentData?.status === true ? 'selected' : ''}>Ativo</option>
                                    <option value="false" ${triggerType === 'UPDATE' && rentData?.status === false ? 'selected' : ''}>Inativo</option>
                                </select>
                                <label for="manage-status">Status (*)</label>
                            </div>
                        </div>

                        <div class="col-12 col-sm-6 col-lg-3 mb-3">
                            <div class="form-floating">
                                <input type="date" class="${triggerType === 'POST' ? 'form-control' : 'form-control-plaintext'}" id="manage-startDate" name="startDate" required ${triggerType === 'UPDATE' ? `value="${formatField('date', rentData?.startDate)}" readonly` : ''}>
                                <label for="manage-startDate">Data de Início (*)</label>
                            </div>
                        </div>

                        <div class="col-12 col-sm-6 col-lg-3 mb-3">
                            <div class="form-floating">
                                <input type="date" class="${triggerType === 'POST' ? 'form-control' : 'form-control-plaintext'}" id="manage-endDate" name="endDate" required ${triggerType === 'UPDATE' ? `value="${formatField('date', rentData?.endDate)}" readonly` : ''}>
                                <label for="manage-endDate">Data de Término (*)</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="dismissModalAndCancelEdit">Fechar</button>
                <button type="${triggerType === 'POST' ? 'submit' : 'button'}" class="btn ${triggerType === 'POST' ? 'btn-success' : 'btn-primary'}" id="toggleModeAndSubmitRent">${triggerType === 'POST' ? 'Cadastrar' : 'Editar'}</button>
            </div>
        </form>
    `);

    loadMasks();
    $('.currency').maskMoney({
        prefix: "R$ ",
        decimal: ",",
        thousands: "."
    });

    customersAndCompanies = await fetchCustomersAndCompanies();
    vehicles = await fetchVehicles();

    autocomplete(document.getElementById('manage-customerCompany'), customersAndCompanies);
    autocomplete(document.getElementById('manage-vehicle'), vehicles);

    const toggleSubmitButton = document.getElementById('toggleModeAndSubmitRent');
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
        $('#manageRentLabel').text('Editar Aluguel');
        $('#dismissModalAndCancelEdit').removeAttr('data-bs-dismiss');
        $('#dismissModalAndCancelEdit').text('Voltar para detalhes');

        $('#manage-rent input').removeAttr('readonly');
        $('#manage-rent select').removeAttr('disabled');
        $('#manage-rent input').removeClass('form-control-plaintext').addClass('form-control');
        $('#toggleModeAndSubmitRent').text('Salvar').removeClass('btn-primary').addClass('btn-success');
        $('#toggleModeAndSubmitRent').attr('type', 'submit');

        editMode = true;
    }

    function exitEditMode() {
        $('#manageRentLabel').text('Detalhes de Aluguel');
        $('#dismissModalAndCancelEdit').attr('data-bs-dismiss', 'modal');
        $('#dismissModalAndCancelEdit').text('Cancelar');

        $('#manage-rent input').attr('readonly', true);
        $('#manage-rent select').attr('disabled', true);
        $('#manage-rent input').removeClass('form-control').addClass('form-control-plaintext');
        $('#toggleModeAndSubmitRent').text('Editar').removeClass('btn-success').addClass('btn-primary');
        $('#toggleModeAndSubmitRent').attr('type', 'button');

        editMode = false;
    }
});

const cancelDeleteRentModal = $('#cancelDeleteRent');
cancelDeleteRentModal.html(`
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="cancelDeleteRentLabel"></h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form id="cancelDeleteRentForm" class="d-flex flex-column gap-3">
                <div class="modal-body">
                    <input id="rentToDelete" type="hidden" name="rentToDelete" />
                    <input id="rentToCancel" type="hidden" name="rentToCancel" />
                    <p></p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button id="confirmAction" type="submit" class="btn btn-danger">Confirmar</button>
                </div>
            </form>
        </div>
    </div>
`);

cancelDeleteRentModal.on('show.bs.modal', event => {
    const actionType = $(event.relatedTarget).data('bs-action');
    const rentData = JSON.parse(event.relatedTarget.getAttribute('data-bs-rent').replace(/&quot;/g, '"').replace(/&apos;/g, "'"));
    const modalTitle = actionType === 'DELETE' ? 'Deletar Aluguel' : 'Cancelar Aluguel';
    const modalBodyText = actionType === 'DELETE' ? 'deletar' : 'cancelar';
    const formMethod = actionType === 'DELETE' ? 'DELETE' : 'PUT';
    const formId = actionType === 'DELETE' ? 'rentToDelete' : 'rentToCancel';

    document.getElementById(formId).value = rentData.id;
    $('#cancelDeleteRentLabel').text(modalTitle);
    $('#cancelDeleteRentForm').attr('method', formMethod);
    $('#cancelDeleteRentForm p').html(`Tem certeza que deseja ${modalBodyText} o aluguel entre o cliente <strong>${rentData?.customer == null ? `${rentData?.company?.name}` : `${rentData?.customer?.name}`}</strong> e o veículo <strong>${rentData?.vehicle?.brand} ${rentData?.vehicle?.model} ${rentData?.vehicle?.motorization} ${rentData?.vehicle?.year}</strong>? Esta ação é irreversível.`).css('margin-bottom', '0');
    $('#confirmAction').text('Confirmar').removeClass('btn-danger').addClass('btn-danger');
});