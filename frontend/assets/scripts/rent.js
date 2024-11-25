document.addEventListener("DOMContentLoaded", function () {
    $('.currency').maskMoney({
        prefix: "R$ ",
        decimal: ",",
        thousands: "."
    });
});

const isVehiclePage = window.location.pathname.includes('vehicles');

const renderClientsList = async () => {
    const clientInput = document.querySelector('#client-input');
    const customers = await fetchCustomers();
    const companies = await fetchCompanies();
    const clients = [...companies, ...customers];

    autocomplete(clientInput, clients);
}

const renderVehiclesList = async () => {
    const fleetInput = document.querySelector('#fleet-input');
    const vehicles = await getVehicles();

    vehicles.forEach(vehicle => {
        vehicle.name = `${vehicle.brand} ${vehicle.model} - ${vehicle.plate}`;
    });

    autocomplete(fleetInput, vehicles);
}

const modifyRentModal = (action) => {
    const modal = document.getElementById('rent-vehicle');
    const modalInstance = bootstrap.Modal.getInstance(modal) || new bootstrap.Modal(modal);
    const modalTitle = document.getElementById('rent-modal-title');
    const rentForm = document.querySelector('#rent-form');
    const submitButton = document.getElementById('submitRentButton');
    const dismissButton = document.getElementById('dismissRentButton');

    rentForm.reset(); // Limpa o formulário

    const state = { editMode: false };

    if (action === "post") {
        enterCreateMode(modalTitle, submitButton, dismissButton);
        rentForm.onsubmit = (e) => {
            e.preventDefault();
            postRent();
            modalInstance.hide();
        };
    }

    if (action === "update") {
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

        rentForm.onsubmit = (e) => {
            e.preventDefault();
            updateRent();
            modalInstance.hide();
        };
    }
}

function enterCreateMode(modalTitle, submitButton, dismissButton) {
    // Altera o título do modal, texto do botão de submit e de dismiss
    modalTitle.textContent = 'Realizar Aluguel';
    submitButton.textContent = 'Alugar';
    dismissButton.textContent = 'Cancelar';

    // Remove o atributo 'readonly' e troca a classe 'form-control-plaintext' por 'form-control' de todos os campos do formulário
    const inputs = document.querySelectorAll('#rent-form input, #rent-form textarea');
    inputs.forEach(input => {
        input.removeAttribute('readonly');
        input.classList.remove('form-control-plaintext');
        input.classList.add('form-control');
    });

    // Remove o atributo 'disabled' de todos os selects do formulário
    const selects = document.querySelectorAll('#rent-form select');
    selects.forEach(select => select.removeAttribute('disabled'));

    // Adiciona o atributo 'data-bs-dismiss' do botão de dismiss e troca a cor do botão de submit
    dismissButton.setAttribute('data-bs-dismiss', 'modal');
    submitButton.classList.remove('btn-primary');
    submitButton.classList.add('btn-success');
    submitButton.setAttribute('type', 'submit');
}

function enterEditMode(modalTitle, submitButton, dismissButton, state) {
    // Altera o título do modal, texto do botão de submit e de dismiss
    modalTitle.textContent = 'Editar Aluguel Atual';
    submitButton.textContent = 'Salvar';
    dismissButton.textContent = 'Voltar para detalhes';

    // Remove o atributo 'readonly' e troca a classe 'form-control-plaintext' por 'form-control' de todos os campos do formulário
    const inputs = document.querySelectorAll('#rent-form input, #rent-form textarea');
    inputs.forEach(input => {
        input.removeAttribute('readonly');
        input.classList.remove('form-control-plaintext');
        input.classList.add('form-control');
    });

    // Remove o atributo 'disabled' de todos os selects do formulário
    const selects = document.querySelectorAll('#rent-form select');
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
    modalTitle.textContent = 'Detalhes do Aluguel Atual';
    submitButton.textContent = 'Editar';
    dismissButton.textContent = 'Cancelar';

    // Adiciona o atributo 'readonly' e troca a classe 'form-control' por 'form-control-plaintext' de todos os campos do formulário
    const inputs = document.querySelectorAll('#rent-form input, #rent-form textarea');
    inputs.forEach(input => {
        input.setAttribute('readonly', 'true');
        input.classList.remove('form-control');
        input.classList.add('form-control-plaintext');
    });

    // Adiciona o atributo 'disabled' de todos os selects do formulário
    const selects = document.querySelectorAll('#rent-form select');
    selects.forEach(select => select.setAttribute('disabled', 'true'));

    // Adiciona o atributo 'data-bs-dismiss' do botão de dismiss e troca a cor do botão de submit
    dismissButton.setAttribute('data-bs-dismiss', 'modal');
    submitButton.classList.remove('btn-success');
    submitButton.classList.add('btn-primary');
    submitButton.setAttribute('type', 'button');

    state.editMode = false;
}

const fillRentModal = async (data, currentRent) => {
    const fleetInput = document.getElementById('fleet-input');
    const clientInput = document.getElementById('client-input');

    if (isVehiclePage) {
        renderClientsList();
        const vehicleData = JSON.parse(data);
        const { id, plate, model, brand } = vehicleData;
        fleetInput.value = `${brand} ${model} - ${plate}`;
        fleetInput.dataset.id = id;
        fleetInput.disabled = true;
    } else {
        renderVehiclesList();
        clientInput.disabled = true;
        const clientData = JSON.parse(data);
        clientInput.value = clientData.name;
        clientInput.dataset.id = clientData.id;
        clientInput.dataset.type = clientData.cpf ? 'customer' : 'company';
        clientInput.disabled = true;
    }

    if (currentRent) {
        const startDateInput = document.getElementById('start-date-input');
        const endDateInput = document.getElementById('end-date-input');
        const coverageInput = document.getElementById('coverage-input');
        const valueInput = document.getElementById('value-input');
        const statusInput = document.getElementById('status-input');

        const isCompany = !!currentRent.companyId ? true : false;

        clientInput.value = isCompany ? currentRent.company.name : currentRent.customer.name;
        clientInput.dataset.id = isCompany ? currentRent.companyId : currentRent.customerId;
        fleetInput.value = `${currentRent.vehicle.brand} ${currentRent.vehicle.model} - ${currentRent.vehicle.plate}`;
        fleetInput.dataset.id = currentRent.vehicleId;
        startDateInput.value = new Date(currentRent.startDate).toISOString().substring(0, 10);
        endDateInput.value = new Date(currentRent.endDate).toISOString().substring(0, 10);
        coverageInput.value = currentRent.coverage;
        valueInput.value = formatField('currency', currentRent.value);
        statusInput.value = currentRent.status;
    }
}

const createRentButton = async (data) => {
    const rentButton = document.createElement('button');
    let rents, clientType;
    if (isVehiclePage) {
        rents = await getRentsByVehicle(data.id);
        rentButton.dataset.bsVehicle = JSON.stringify(data);
    } else {
        clientType = data.cpf ? 'customer' : 'company';
        rents = await getRentsByClient(data.id, clientType);
        rentButton.dataset.bsClient = JSON.stringify(data);
    }

    const activeRent = rents.find(rent => rent.status === true);

    rentButton.id = 'rent-vehicle-button';
    rentButton.type = 'button';
    rentButton.dataset.bsToggle = 'modal';
    rentButton.dataset.bsTarget = '#rent-vehicle';

    const icon = document.createElement('i');
    icon.classList.add('fa-solid', 'fa-key');
    rentButton.appendChild(icon);

    if (activeRent) {
        const rentModal = document.getElementById('rent-vehicle');
        rentButton.classList.add('btn', 'btn-secondary', 'mx-1');
        rentButton.dataset.bsTitle = 'Editar Aluguel';
        rentButton.onclick = () => {
            rentModal.dataset.rentId = activeRent.id;
            modifyRentModal("update");
            fillRentModal(JSON.stringify(data), activeRent);
        };
        return rentButton;
    };

    rentButton.onclick = () => {
        modifyRentModal("post");
        fillRentModal(JSON.stringify(data), null);
    }

    rentButton.classList.add('btn', 'btn-success', 'mx-1');
    rentButton.dataset.bsTitle = 'Realizar Aluguel';

    return rentButton;
}

const createRentHistoryButton = async (data) => {
    const rentHistoryButton = document.createElement('a');
    rentHistoryButton.id = 'rent-history-button';
    rentHistoryButton.classList.add('btn', 'btn-info', 'mx-1');
    rentHistoryButton.type = 'button';

    if (isVehiclePage) {
        const vehicleRents = await getRentsByVehicle(data.id);
        if (vehicleRents.length === 0) return null;
        rentHistoryButton.href = `rents.html?vehicles/${data.id}/rents`;
    } else {
        const clientType = data.cpf ? 'customer' : 'company';
        const clientRents = await getRentsByClient(data.id, clientType);
        if (clientRents.length === 0) return null;
        const clientParam = clientType === 'customer' ? 'customers' : 'companies';
        rentHistoryButton.href = `rents.html?${clientParam}/${data.id}/rents`;
    }

    const icon = document.createElement('i');
    icon.classList.add('fa-solid', 'fa-history');
    icon.style.color = 'white';
    rentHistoryButton.appendChild(icon);

    rentHistoryButton.dataset.bsTitle = 'Histórico de Aluguéis';

    return rentHistoryButton;
}

const fetchCustomers = async () => {
    const response = await fetch('http://localhost:3000/customers');
    const data = await response.json();
    return data;
};

const fetchCompanies = async () => {
    const response = await fetch('http://localhost:3000/companies');
    const data = await response.json();
    return data;
}

const getFormData = () => {
    const vehicleId = document.querySelector('#fleet-input').dataset.id;
    const startDate = document.querySelector('#start-date-input').value;
    const endDate = document.querySelector('#end-date-input').value;
    const coverage = document.querySelector('#coverage-input').value;
    const value = document.querySelector('#value-input').value;
    const observations = document.querySelector('#observations-input').value;
    const status = document.querySelector('#status-input').value;

    return {
        vehicleId,
        startDate,
        endDate,
        coverage,
        value,
        observations,
        status
    }
}

const postRent = async () => {
    const rent = getFormData();
    const clientType = document.querySelector('#client-input').dataset.type;
    const clientId = document.querySelector('#client-input').dataset.id;

    if (clientType === 'customer') {
        rent.customerId = clientId;
    } else {
        rent.companyId = clientId;
    }

    const response = await fetch('http://localhost:3000/rents', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(rent)
    });

    if (response.ok) {
        showToast('Aluguel cadastrado com sucesso', "success");
        const vehicles = await getVehicles();
        if (isVehiclePage) {
            fillVehiclesTable(vehicles)
        }
        else {
            document.getElementById("confirm-search").click();
        }
    } else {
        showToast('Erro ao cadastrar aluguel', "error");
    }

    const data = await response.json();
    return data;
}

const updateRent = async () => {
    const rent = getFormData();
    const rentId = document.querySelector('#rent-vehicle').dataset.rentId;
    const clientType = document.querySelector('#client-input').dataset.type;
    const clientId = document.querySelector('#client-input').dataset.id;

    if (clientType === 'customer') {
        rent.customerId = clientId;
    } else {
        rent.companyId = clientId;
    }

    const response = await fetch(`http://localhost:3000/rents/${rentId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(rent)
    });

    if (response.ok) {
        showToast('Aluguel cadastrado com sucesso', "success");
        const vehicles = await getVehicles();
        if (isVehiclePage) {
            fillVehiclesTable(vehicles)
        }
        else {
            document.getElementById("confirm-search").click();
        }
    } else {
        showToast('Erro ao cadastrar aluguel', "error");
    }

    const data = await response.json();
    return data;
}

const getRentsByVehicle = async (id) => {
    try {
        const response = await fetch(`${API_URL}/vehicles/${id}/rents`);
        if (response.ok) {
            const json = await response.json();
            return json;
        } else {
            return [];
        }
    } catch (error) {
        console.error(error.message);
        return false;
    }
}

const getRentsByClient = async (id, clientType) => {
    let response;
    try {
        if (clientType === 'customer') {
            response = await fetch(`${API_URL}/customers/${id}/rents`);
        } else {
            response = await fetch(`${API_URL}/companies/${id}/rents`);
        }
        if (response.ok) {
            const json = await response.json();
            return json;
        } else {
            return [];
        }
    } catch (error) {
        console.error(error.message);
        return false;
    }
}