document.addEventListener('DOMContentLoaded', async function () {
    if (isVehiclePage) {
        const vehicles = await getVehicles();
        fillVehiclesTable(vehicles);

        const motorizationRange = new rSlider({
            target: '#motorization-range',
            values: ['1.0', '1.2', '1.3', '1.4', '1.6', '1.8', '2.0', '2.2', '2.4', '2.6', '2.8', '3.0'],
            range: true,
            set: ['1.0', '3.0']
        });

        const searchVehicleForm = document.getElementById('search-vehicle-form');
        searchVehicleForm.onsubmit = (event) => searchVehicle(event, motorizationRange);
    }
}, false);

const fillVehiclesTable = async (vehicles) => {
    const table = document.getElementById('vehicles-query-results');
    const tableBody = document.getElementById('vehicles-table-body');
    tableBody.innerHTML = '';

    if (!vehicles) {
        table.classList.add('d-none');
        return;
    }

    table.classList.remove('d-none');

    await vehicles.forEach(async vehicle => {
        let { fleet, plate, model, brand, year, motorization, createdAt } = vehicle;
        createdAt = new Date(createdAt).toLocaleDateString('pt-BR');
        const vehicleData = { fleet, plate, model, brand, year, motorization, createdAt };

        const tr = document.createElement('tr');
        tr.tabIndex = 0;
        tr.dataset.bsToggle = 'popover';
        tr.dataset.bsTrigger = 'focus';

        Object.entries(vehicleData).forEach(([key, value]) => {
            const td = document.createElement('td');
            td.textContent = value;
            td.id = `${key}-${vehicle.id}`;
            tr.appendChild(td);
        });

        const updateButton = createUpdateButton(vehicle);
        const deleteButton = createDeleteButton(vehicle);
        const rentButton = await createRentButton(vehicle);
        const rentHistoryButton = await createRentHistoryButton(vehicle);
        const buttons = document.createElement('td');
        buttons.appendChild(updateButton);
        buttons.appendChild(deleteButton);
        buttons.appendChild(rentButton);
        if (rentHistoryButton) buttons.appendChild(rentHistoryButton);

        createPopovers(tr, buttons);
        createTooltips(buttons);

        tableBody.appendChild(tr);
    });
}

const handleDeleteVehicle = async (vehicle) => {
    const vehicleData = JSON.parse(vehicle);

    const deleteDisclaimer = document.getElementById('vehicle-name');
    deleteDisclaimer.textContent = `${vehicleData.brand} ${vehicleData.model} - ${vehicleData.plate}`;

    const confirmButton = document.getElementById('confirm-delete-vehicle');
    confirmButton.onclick = async (e) => {
        e.preventDefault();
        const vehicleId = vehicleData.id;
        const isDeleted = await deleteVehicle(vehicleId);

        const modal = document.getElementById('delete-vehicle');
        const modalInstance = bootstrap.Modal.getInstance(modal) || new bootstrap.Modal(modal);
        modalInstance.hide();

        if (isDeleted) {
            showToast('Veículo deletado com sucesso', 'success');
            const vehicles = await getVehicles();
            fillVehiclesTable(vehicles);
        } else {
            showToast('Erro ao deletar veículo', 'danger');
        }
    };
}

function prepareQuery(event, motorizationRangeData) {
    const formData = new FormData(event.target);
    const searchParam = Object.fromEntries(formData);

    const queryParams = [];
    if (searchParam.search) queryParams.push(`search=${searchParam.search}`);
    if (searchParam.startDate) queryParams.push(`startDate=${new Date(searchParam.startDate).toISOString().split('T')[0]}`);
    if (searchParam.endDate) queryParams.push(`endDate=${new Date(searchParam.endDate).toISOString().split('T')[0]}`);
    if (motorizationRangeData.length) {
        const motorizationOptions = ['1.0', '1.2', '1.3', '1.4', '1.6', '1.8', '2.0', '2.2', '2.4', '2.6', '2.8', '3.0'];
        const [start, end] = motorizationRangeData.split(',').map(value => motorizationOptions.indexOf(value));
        const selectedMotorizationRange = motorizationOptions.slice(start, end + 1);
        selectedMotorizationRange.forEach(motorization => queryParams.push(`motorization=${motorization}`));
    }

    return queryParams.length ? '?' + queryParams.join('&') : '';
}

const searchVehicle = async (event, motorizationRange) => {
    event.preventDefault();
    const motorizationRangeData = motorizationRange.getValue();
    const searchParam = prepareQuery(event, motorizationRangeData);
    const vehicles = await getVehiclesByParam(searchParam);
    fillVehiclesTable(vehicles);
}


const fillUpdateVehicleModal = async (vehicle) => {
    const vehicleData = JSON.parse(vehicle);
    const { fleet, plate, model, brand, year, motorization } = vehicleData;

    const form = document.getElementById('formEditarVeiculo');
    const fleetInput = document.getElementById('editFrota');
    const plateInput = document.getElementById('editPlaca');
    const modelInput = document.getElementById('editModelo');
    const brandInput = document.getElementById('editMarca');
    const yearSelect = document.getElementById('editAno');
    const motorizationInput = document.getElementById('editMotorizacao');

    form.dataset.id = vehicleData.id;
    fleetInput.value = fleet;
    plateInput.value = plate;
    modelInput.value = model;
    brandInput.value = brand;
    yearSelect.value = year;
    motorizationInput.value = motorization;
}

const createDeleteButton = (vehicle) => {
    const deleteButton = document.createElement('button');
    deleteButton.id = 'delete-vehicle-button';
    deleteButton.classList.add('btn', 'btn-danger', 'mx-1');
    deleteButton.type = 'button';
    deleteButton.dataset.bsToggle = 'modal';
    deleteButton.dataset.bsTarget = '#delete-vehicle';
    deleteButton.dataset.bsVehicle = JSON.stringify(vehicle);
    deleteButton.dataset.bsTitle = 'Deletar Veículo';
    deleteButton.dataset.bsPlacement = 'top';
    deleteButton.onclick = () => {
        handleDeleteVehicle(JSON.stringify(vehicle));
    }

    const icon = document.createElement('i');
    icon.classList.add('fa-solid', 'fa-trash');
    deleteButton.appendChild(icon);

    return deleteButton;
}
const createUpdateButton = (vehicle) => {
    const updateButton = document.createElement('button');
    updateButton.id = 'update-vehicle-button';
    updateButton.classList.add('btn', 'btn-primary', 'mx-1');
    updateButton.type = 'button';
    updateButton.dataset.bsToggle = 'modal';
    updateButton.dataset.bsTitle = 'Detalhes do Veículo';
    updateButton.dataset.bsPlacement = 'top';
    updateButton.dataset.bsTarget = '#editVehicle';
    updateButton.dataset.bsVehicle = JSON.stringify(vehicle);
    updateButton.onclick = () => {
        modifyEditVehicleModal();
        fillUpdateVehicleModal(JSON.stringify(vehicle));
    }
    const icon = document.createElement('i');
    icon.classList.add('fa-solid', 'fa-car');
    updateButton.appendChild(icon);

    return updateButton;
}

const modifyEditVehicleModal = () => {
    const rentForm = document.getElementById('formEditarVeiculo');
    const modalTitle = document.getElementById('modalEditarVeiculoLabel');
    const submitButton = document.getElementById('submitEditVehicleButton');
    const dismissButton = document.getElementById('dismissEditVehicleButton');

    rentForm.reset(); // Limpa o formulário

    const state = { editMode: false };

    enterVehicleViewMode(modalTitle, submitButton, dismissButton, state);

    submitButton.addEventListener('click', (e) => {
        if (!state.editMode) {
            e.preventDefault();
            enterVehicleEditMode(modalTitle, submitButton, dismissButton, state);
        }
    });

    dismissButton.addEventListener('click', () => {
        if (state.editMode) enterVehicleViewMode(modalTitle, submitButton, dismissButton, state);
    });
}

function enterVehicleEditMode(modalTitle, submitButton, dismissButton, state) {
    // Altera o título do modal, texto do botão de submit e de dismiss
    modalTitle.textContent = 'Editar Veículo';
    submitButton.textContent = 'Salvar';
    dismissButton.textContent = 'Voltar para detalhes';

    // Remove o atributo 'readonly' e troca a classe 'form-control-plaintext' por 'form-control' de todos os campos do formulário
    const inputs = document.querySelectorAll('#formEditarVeiculo input, #formEditarVeiculo textarea');
    inputs.forEach(input => {
        input.removeAttribute('readonly');
        input.classList.remove('form-control-plaintext');
        input.classList.add('form-control');
    });

    // Remove o atributo 'disabled' de todos os selects do formulário
    const selects = document.querySelectorAll('#formEditarVeiculo select');
    selects.forEach(select => select.removeAttribute('disabled'));

    // Remove o atributo 'data-bs-dismiss' do botão de dismiss e troca a cor do botão de submit
    dismissButton.removeAttribute('data-bs-dismiss');
    submitButton.classList.remove('btn-primary');
    submitButton.classList.add('btn-success');
    submitButton.setAttribute('type', 'submit');

    state.editMode = true;
}

function enterVehicleViewMode(modalTitle, submitButton, dismissButton, state) {
    // Altera o título do modal, texto do botão de submit e de dismiss
    modalTitle.textContent = 'Detalhes do Veículo';
    submitButton.textContent = 'Editar';
    dismissButton.textContent = 'Cancelar';

    // Adiciona o atributo 'readonly' e troca a classe 'form-control' por 'form-control-plaintext' de todos os campos do formulário
    const inputs = document.querySelectorAll('#formEditarVeiculo input, #formEditarVeiculo textarea');
    inputs.forEach(input => {
        input.setAttribute('readonly', 'true');
        input.classList.remove('form-control');
        input.classList.add('form-control-plaintext');
    });

    // Adiciona o atributo 'disabled' de todos os selects do formulário
    const selects = document.querySelectorAll('#formEditarVeiculo select');
    selects.forEach(select => select.setAttribute('disabled', 'true'));

    // Adiciona o atributo 'data-bs-dismiss' do botão de dismiss e troca a cor do botão de submit
    dismissButton.setAttribute('data-bs-dismiss', 'modal');
    submitButton.classList.remove('btn-success');
    submitButton.classList.add('btn-primary');
    submitButton.setAttribute('type', 'button');

    state.editMode = false;
}

const getVehicles = async () => {
    try {
        const response = await fetch(API_URL + '/vehicles');
        if (!response.ok) {
            showToast('Nenhum veículo encontrado', 'danger');
            return null;
        }

        const json = await response.json();
        if (json.length === 0) {
            showToast('Nenhum veículo encontrado', 'danger');
            return null;
        }
        return json;
    } catch (error) {
        console.error(error.message);
    }
}

const getVehiclesByParam = async (value) => {
    try {
        const response = await fetch(`${API_URL}/vehicles${value}`);
        if (!response.ok) {
            showToast('Nenhum veículo encontrado', 'danger');
            return null;
        }

        const json = await response.json();
        if (json.length === 0) {
            showToast('Nenhum veículo encontrado', 'danger');
            return null;
        }
        return json;
    } catch (error) {
        console.error(error.message);
    }
}

const deleteVehicle = async (id) => {
    try {
        const response = await fetch(`${API_URL}/vehicles/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'userCookie': getCookie('user') || ''
            },
        });
        if (!response.ok) {
            showToast('Nenhum veículo encontrado', 'danger');
            return false;
        }

        return true;
    } catch (error) {
        console.error(error.message);
        return false;
    }
}
function viewFines(plate) {
    // Redirecionar para a página de gerenciamento de multas com o veículo selecionado
    window.location.href = `fines.html?vehicle=${encodeURIComponent(plate)}`;
}

function prepareFineModal(plate) {
    // Preencher o campo oculto com a placa do veículo
    document.getElementById('fine-vehicle-plate').value = plate;
}
