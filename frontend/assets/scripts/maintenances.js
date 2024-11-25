document.addEventListener('DOMContentLoaded', async function () {
    const API_URL = 'http://localhost:3000';
    const modalElement = document.getElementById('modalManutencao');
    window.modalInstance = new bootstrap.Modal(modalElement);

    const maintenances = await getMaintenances();
    fillMaintenancesTable(maintenances);
    renderFleetList();

    const searchMaintenanceForm = document.getElementById('search-maintenance-form');
    searchMaintenanceForm.addEventListener('submit', searchMaintenance);

    const newMaintenanceButton = document.getElementById('new-maintenance-button');
    newMaintenanceButton.addEventListener('click', () => {
        openMaintenanceModal('Cadastrar');
    });

    document.getElementById('formManutencao').addEventListener('submit', handleFormSubmit);

    implementAutocomplete();
}, false);

const renderFleetList = async () => {
    const fleetInput = document.querySelector('#fleet-input');
    const vehicles = await getVehicles();

    vehicles.forEach(vehicle => {
        vehicle.name = `${vehicle.brand} ${vehicle.model} - ${vehicle.plate}`;
    });
    autocomplete(fleetInput, vehicles, (selectedVehicle) => {
        fleetInput.setAttribute('data-id', selectedVehicle.id); // Set the vehicle ID
        console.log("Fleet selecionado:", selectedVehicle.fleet);
    });
}

const getVehicles = async () => {
    try {
        const response = await fetch(API_URL + '/vehicles');
        if (!response.ok) {
            showToast(response.error, 'danger');
            return null;
        }

        const json = await response.json();
        if (json.length === 0) {
            showToast('Nenhum veículo encontrado', 'warning');
            return null;
        }
        return json;
    } catch (error) {
        console.error(error.message);
    }
}

const getMaintenances = async () => {
    try {
        const response = await fetch(API_URL + '/maintenances');
        if (!response.ok) {
            showToast(response.error, 'danger');
            return null;
        }

        const json = await response.json();
        if (json.length === 0) {
            showToast('Nenhuma manutenção encontrada', 'warning');
            return null;
        }
        return json;
    } catch (error) {
        console.error(error.message);
    }
}

const getMaintenancesByParam = async (value) => {
    try {
        const response = await fetch(`${API_URL}/maintenances${value}`);
        if (!response.ok) {
            showToast(response.error, 'danger');
            return null;
        }

        const json = await response.json();
        if (json.length === 0) {
            showToast('Nenhuma manutenção encontrada', 'warning');
            return null;
        }
        return json;
    } catch (error) {
        console.error(error.message);
    }
}

const deleteMaintenance = async (id) => {
    try {
        const response = await fetch(`${API_URL}/maintenances/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            showToast(response.error, 'danger');
            return false;
        }

        return true;
    } catch (error) {
        console.error(error.message);
        return false;
    }
}

const fillMaintenancesTable = async (maintenances) => {
    const table = document.getElementById('maintenances-query-results');
    const tableBody = document.getElementById('maintenances-table-body');
    tableBody.innerHTML = '';

    if (!maintenances) {
        table.classList.add('d-none');
        return;
    }

    table.classList.remove('d-none');

    maintenances.forEach(maintenance => {
        let { reviewDate, mechanics, vehicle, type, situation } = maintenance;
        reviewDate = new Date(reviewDate).toLocaleDateString();
        const fleet = vehicle?.fleet || 'N/A'; // Verificação para evitar erro
        const maintenanceData = { reviewDate, mechanics, fleet, type, situation };

        const tr = document.createElement('tr');
        tr.id = `maintenance-${maintenance.id}`;
        tr.tabIndex = 0;
        tr.dataset.bsToggle = 'popover';
        tr.dataset.bsTrigger = 'focus';

        Object.entries(maintenanceData).forEach(([key, value]) => {
            const td = document.createElement('td');
            td.textContent = value;
            td.id = `${key}-${maintenance.id}`;
            tr.appendChild(td);
        });

        const updateButton = createUpdateButton(maintenance);
        const deleteButton = createDeleteButton(maintenance);
        const buttons = document.createElement('td');
        buttons.appendChild(updateButton);
        buttons.appendChild(deleteButton);

        createPopovers(tr, buttons);
        createTooltips(buttons);

        tableBody.appendChild(tr);
    });
}

const handleDeleteMaintenance = async (maintenance) => {
    const maintenanceData = JSON.parse(maintenance);

    const deleteDisclaimer = document.getElementById('maintenance-name');
    deleteDisclaimer.textContent = `${maintenanceData.vehicle.brand} ${maintenanceData.vehicle.model} - ${maintenanceData.vehicle.plate}`;

    const confirmButton = document.getElementById('confirm-delete-maintenance');
    confirmButton.addEventListener('click', async (e) => {
        e.preventDefault();
        const maintenanceId = maintenanceData.id;
        const isDeleted = await deleteMaintenance(maintenanceId);

        const modal = document.getElementById('delete-maintenance');
        const modalInstance = bootstrap.Modal.getInstance(modal) || new bootstrap.Modal(modal);
        modalInstance.hide();

        if (isDeleted) {
            showToast('Manutenção deletada com sucesso', 'success');
            const maintenances = await getMaintenances();
            fillMaintenancesTable(maintenances);
        } else {
            showToast('Erro ao deletar manutenção', 'danger');
        }
    });
}

function prepareQuery(event) {
    const formData = new FormData(event.target);
    const searchParam = Object.fromEntries(formData);

    const queryParams = [];
    if (searchParam.search) queryParams.push(`search=${searchParam.search}`);
    if (searchParam.startDate) queryParams.push(`startDate=${new Date(searchParam.startDate).toISOString().split('T')[0]}`);
    if (searchParam.endDate) queryParams.push(`endDate=${new Date(searchParam.endDate).toISOString().split('T')[0]}`);

    return queryParams.length ? '?' + queryParams.join('&') : '';
}

const searchMaintenance = async (event) => {
    event.preventDefault();
    const searchParam = prepareQuery(event);
    const maintenances = await getMaintenancesByParam(searchParam);
    fillMaintenancesTable(maintenances);
}

const fillUpdateMaintenanceModal = (maintenance) => {
    const maintenanceData = JSON.parse(maintenance);

    const modalTitle = document.getElementById('modalManutencaoLabel');
    modalTitle.textContent = 'Editar manutenção';

    const submitButton = document.getElementById('submitButton');
    submitButton.textContent = 'Salvar alterações';

    const fleetInput = document.getElementById('fleet-input');
    const companyInput = document.getElementById('mecanico');
    const dateInput = document.getElementById('data');
    const nextDateInput = document.getElementById('proximaRevisao');
    const kmInput = document.getElementById('km');
    const statusInput = document.getElementById('situacao');
    const observationInput = document.getElementById('observacao');
    const typeInput = document.getElementById('tipo');

    if (maintenanceData.vehicle) {
        fleetInput.value = `${maintenanceData.vehicle.brand} ${maintenanceData.vehicle.model} - ${maintenanceData.vehicle.plate}`;
        fleetInput.setAttribute('data-id', maintenanceData.vehicle.id); // Define o ID do veículo
    } else {
        fleetInput.value = '';
        fleetInput.removeAttribute('data-id');
    }
    companyInput.value = maintenanceData.mechanics;
    dateInput.value = new Date(maintenanceData.reviewDate).toISOString().substring(0, 10);
    nextDateInput.value = new Date(maintenanceData.nextReviewDate).toISOString().substring(0, 10);
    kmInput.value = maintenanceData.kilometers;
    statusInput.value = maintenanceData.situation;
    observationInput.value = maintenanceData.observation;
    typeInput.value = maintenanceData.type.toLowerCase();
}

const createDeleteButton = (maintenance) => {
    const deleteButton = document.createElement('button');
    deleteButton.id = 'delete-maintenance-button';
    deleteButton.classList.add('btn', 'btn-danger', 'mx-1');
    deleteButton.type = 'button';
    deleteButton.dataset.bsToggle = 'modal';
    deleteButton.dataset.bsTarget = '#delete-maintenance';
    deleteButton.dataset.bsTitle = 'Deletar Manutenção';
    deleteButton.dataset.bsPlacement = 'top';
    deleteButton.dataset.bsMaintenance = JSON.stringify(maintenance);
    deleteButton.onclick = () => {
        handleDeleteMaintenance(JSON.stringify(maintenance));
    };

    const icon = document.createElement('i');
    icon.classList.add('fa-solid', 'fa-trash');
    deleteButton.appendChild(icon);

    return deleteButton;
}

const createUpdateButton = (maintenance) => {
    const updateButton = document.createElement('button');
    updateButton.id = 'update-maintenance-button';
    updateButton.classList.add('btn', 'btn-primary', 'mx-1');
    updateButton.type = 'button';
    updateButton.dataset.bsToggle = 'modal';
    updateButton.dataset.bsTarget = '#modalManutencao';
    updateButton.dataset.bsTitle = 'Detalhes da Manutenção';
    updateButton.dataset.bsPlacement = 'top';
    updateButton.dataset.bsMaintenance = JSON.stringify(maintenance);
    updateButton.onclick = () => {
        fillUpdateMaintenanceModal(JSON.stringify(maintenance));
        openMaintenanceModal("Editar", maintenance);
    };

    const icon = document.createElement('i');
    icon.classList.add('fa-solid', 'fa-wrench');
    updateButton.appendChild(icon);

    return updateButton;
}

function openMaintenanceModal(mode, data = {}) {
    const modalTitle = document.getElementById('modalManutencaoLabel');
    const submitButton = document.getElementById('submitButton');
    const dismissButton = document.getElementById('dismissButton');

    clearMaintenanceForm(); // Limpa o formulário

    const state = { editMode: false };

    if (mode === 'Cadastrar') {
        enterCreateMode(modalTitle, submitButton, dismissButton);

    } else if (mode === 'Editar') {
        fillMaintenanceForm(data); // Preenche o formulário com os dados da manutenção
        submitButton.setAttribute('data-maintenance-id', data.id); // Armazena o ID da manutenção

        enterViewMode(modalTitle, submitButton, dismissButton, state);

        submitButton.addEventListener('click', (e) => {
            if (!state.editMode) {
                e.preventDefault();
                enterEditMode(modalTitle, submitButton, dismissButton, state);
            }
        });

        dismissButton.addEventListener('click', () => {
            if (state.editMode) enterViewMode(modalTitle, submitButton, dismissButton, state);
        });
    }

    window.modalInstance.show();
}

function enterCreateMode(modalTitle, submitButton, dismissButton) {
    // Altera o título do modal, texto do botão de submit e de dismiss
    modalTitle.textContent = 'Cadastrar Manutenção';
    submitButton.textContent = 'Cadastrar';
    dismissButton.textContent = 'Cancelar';

    // Remove o atributo 'readonly' e troca a classe 'form-control-plaintext' por 'form-control' de todos os campos do formulário
    const inputs = document.querySelectorAll('#formManutencao input, #formManutencao textarea');
    inputs.forEach(input => {
        input.removeAttribute('readonly');
        input.classList.remove('form-control-plaintext');
        input.classList.add('form-control');
    });

    // Remove o atributo 'disabled' de todos os selects do formulário
    const selects = document.querySelectorAll('#formManutencao select');
    selects.forEach(select => select.removeAttribute('disabled'));

    // Adiciona o atributo 'data-bs-dismiss' do botão de dismiss e troca a cor do botão de submit
    dismissButton.setAttribute('data-bs-dismiss', 'modal');
    submitButton.classList.remove('btn-primary');
    submitButton.classList.add('btn-success');
    submitButton.setAttribute('type', 'submit');
}

function enterEditMode(modalTitle, submitButton, dismissButton, state) {
    // Altera o título do modal, texto do botão de submit e de dismiss
    modalTitle.textContent = 'Editar Manutenção';
    submitButton.textContent = 'Salvar';
    dismissButton.textContent = 'Voltar para detalhes';

    // Remove o atributo 'readonly' e troca a classe 'form-control-plaintext' por 'form-control' de todos os campos do formulário
    const inputs = document.querySelectorAll('#formManutencao input, #formManutencao textarea');
    inputs.forEach(input => {
        input.removeAttribute('readonly');
        input.classList.remove('form-control-plaintext');
        input.classList.add('form-control');
    });

    // Remove o atributo 'disabled' de todos os selects do formulário
    const selects = document.querySelectorAll('#formManutencao select');
    selects.forEach(select => select.removeAttribute('disabled'));

    // Remove o atributo 'data-bs-dismiss' do botão de dismiss e troca a cor do botão de submit
    dismissButton.removeAttribute('data-bs-dismiss');
    submitButton.classList.remove('btn-primary');
    submitButton.classList.add('btn-success');
    submitButton.setAttribute('type', 'submit');

    state.editMode = true;
}

function enterViewMode(modalTitle, submitButton, dismissButton, state) {
    // Altera o título do modal, texto do botão de submit e de dismiss
    modalTitle.textContent = 'Detalhes da Manutenção';
    submitButton.textContent = 'Editar';
    dismissButton.textContent = 'Cancelar';

    // Adiciona o atributo 'readonly' e troca a classe 'form-control' por 'form-control-plaintext' de todos os campos do formulário
    const inputs = document.querySelectorAll('#formManutencao input, #formManutencao textarea');
    inputs.forEach(input => {
        input.setAttribute('readonly', 'true');
        input.classList.remove('form-control');
        input.classList.add('form-control-plaintext');
    });

    // Adiciona o atributo 'disabled' de todos os selects do formulário
    const selects = document.querySelectorAll('#formManutencao select');
    selects.forEach(select => select.setAttribute('disabled', 'true'));

    // Adiciona o atributo 'data-bs-dismiss' do botão de dismiss e troca a cor do botão de submit
    dismissButton.setAttribute('data-bs-dismiss', 'modal');
    submitButton.classList.remove('btn-success');
    submitButton.classList.add('btn-primary');
    submitButton.setAttribute('type', 'button');

    state.editMode = false;
}

function clearMaintenanceForm() {
    document.getElementById('formManutencao').reset(); // Limpa todos os campos do formulário
}

function fillMaintenanceForm(data) {
    const fleetInput = document.getElementById('fleet-input');
    const companyInput = document.getElementById('mecanico');
    const dateInput = document.getElementById('data');
    const nextDateInput = document.getElementById('proximaRevisao');
    const kmInput = document.getElementById('km');
    const statusInput = document.getElementById('situacao');
    const observationInput = document.getElementById('observacao');
    const typeInput = document.getElementById('tipo');

    if (data.vehicle) {
        fleetInput.value = `${data.vehicle.brand} ${data.vehicle.model} - ${data.vehicle.plate}`;
        fleetInput.setAttribute('data-id', data.vehicle.id); // Define o ID do veículo
    } else {
        fleetInput.value = '';
        fleetInput.removeAttribute('data-id');
    }
    companyInput.value = data.mechanics;
    dateInput.value = new Date(data.reviewDate).toISOString().substring(0, 10);
    nextDateInput.value = new Date(data.nextReviewDate).toISOString().substring(0, 10);
    kmInput.value = data.kilometers;
    statusInput.value = data.situation;
    observationInput.value = data.observation;
    typeInput.value = data.type.toString().toLowerCase();
}

async function handleFormSubmit(event) {
    event.preventDefault();

    const maintenanceData = {
        mechanics: document.getElementById('mecanico').value.trim(),
        reviewDate: document.getElementById('data').value,
        nextReviewDate: document.getElementById('proximaRevisao').value,
        kilometers: parseInt(document.getElementById('km').value, 10),
        observation: document.getElementById('observacao').value.trim(),
        type: document.getElementById('tipo').value,
        situation: document.getElementById('situacao').value,
        vehicleId: parseInt(document.getElementById('fleet-input').getAttribute('data-id'), 10),
    };

    console.log('Dados da manutenção:', maintenanceData);

    const mode = document.getElementById('submitButton').textContent === 'Cadastrar' ? 'create' : 'update';

    if (mode === 'create') {
        createMaintenance(maintenanceData);
    } else {
        const maintenanceId = document.getElementById('submitButton').getAttribute('data-maintenance-id');
        updateMaintenance(maintenanceId, maintenanceData);
    }
}

function createMaintenance(data) {
    fetch('http://localhost:3000/maintenances', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errData => {
                    console.error('Erro ao criar a manutenção:', errData);
                    showToast(response.error, 'danger');
                    throw new Error('Erro ao criar a manutenção');
                });
            }
            return response.json();
        })
        .then(async data => {
            console.log('Manutenção criada com sucesso:', data);
            showToast('Manutenção criada com sucesso', 'success');
            window.modalInstance.hide();
            const maintenances = await getMaintenances();
            fillMaintenancesTable(maintenances);
        })
        .catch((error) => {
            console.error('Erro ao criar a manutenção:', error);
        });
}

function updateMaintenance(id, data) {
    fetch(`http://localhost:3000/maintenances/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errData => {
                    console.error('Erro ao atualizar a manutenção:', errData);
                    showToast(response.error, 'danger');
                    throw new Error('Erro ao atualizar a manutenção');
                });
            }
            return response.json();
        })
        .then(async data => {
            console.log('Manutenção atualizada com sucesso:', data);
            showToast('Manutenção atualizada com sucesso', 'success');
            window.modalInstance.hide();
            const maintenances = await getMaintenances();
            fillMaintenancesTable(maintenances);
        })
        .catch((error) => {
            console.error('Erro ao atualizar a manutenção:', error);
        });
}

const implementAutocomplete = async () => {
    const vehicles = await getVehicles();

    vehicles.forEach(vehicle => {
        vehicle.name = `${vehicle.brand} ${vehicle.model} - ${vehicle.plate}`;
    });

    autocomplete(document.getElementById('fleet-input'), vehicles, (selectedVehicle) => {
        document.getElementById('fleet-input').setAttribute('data-id', selectedVehicle.id); // Set the vehicle ID
    });
}