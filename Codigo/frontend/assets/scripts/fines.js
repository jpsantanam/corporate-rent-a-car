document.addEventListener("DOMContentLoaded", function () {
    $('.currency').maskMoney({
        prefix: "R$ ",
        decimal: ",",
        thousands: "."
    });
});

document.addEventListener('DOMContentLoaded', async function () {
    const modalElement = document.getElementById('modalFine');
    window.modalInstance = new bootstrap.Modal(modalElement);
    // Carrega dados iniciais
    try {
        const fines = await getFines();
        fillFinesTable(fines);
        await renderRentsList();

        const searchFineForm = document.getElementById('search-fine-form');
        searchFineForm.addEventListener('submit', searchFine);

        const newFineButton = document.getElementById('new-fine-button');
        newFineButton.addEventListener('click', () => {
            openFineModal('Cadastrar');
        });

        document.getElementById('formFine').addEventListener('submit', handleFormSubmit);
    } catch (error) {
        console.error('Erro ao inicializar a aplicação:', error.message);
    }
});

const renderRentsList = async () => {
    const rentInput = document.querySelector('#rent-input');
    let rents = await fetchRents();

    rents = rents.map(rent => {
        const customerName = rent.customer?.name || rent.company?.name || 'Cliente não definido';
        const vehicle = rent.vehicle ? `${rent.vehicle.brand} ${rent.vehicle.model} ${rent.vehicle.motorization} ${rent.vehicle.year}` : 'Veículo não definido';
        rent.name = `${customerName} - ${vehicle}`;
        return rent;
    });

    autocomplete(rentInput, rents, (selectedRent) => {
        rentInput.setAttribute('data-id', selectedRent.id);
        rentInput.setAttribute('data-type', 'rent');
        console.log('Multa selecionado:', selectedRent.name);
    });
};

const fetchRents = async () => {
    try {
        const response = await fetch(`${API_URL}/rents`);
        if (!response.ok) {
            throw new Error('Erro ao obter aluguéis');
        }

        const rents = await response.json();
        return rents.length ? rents : [];
    } catch (error) {
        console.error('Erro ao obter aluguéis:', error.message);
        return [];
    }
};

// ** Funções Auxiliares de API **
const getFines = async () => {
    try {
        const response = await fetch(`${API_URL}/fines`);
        if (!response.ok) throw new Error('Erro ao obter multas.');

        const fines = await response.json();
        console.log('Dados de multas:', fines); // Adicionado para depuração
        return fines.length ? fines : [];
    } catch (error) {
        console.error('Erro ao obter multas:', error.message);
        return [];
    }
};

const getVehicleById = async (vehicleId) => {
    try {
        const response = await fetch(`${API_URL}/vehicles/${vehicleId}`);
        if (!response.ok) throw new Error('Erro ao obter veículo.');

        const vehicle = await response.json();
        console.log('Dados de veículo:', vehicle); // Adicionado para depuração
        return vehicle;
    } catch (error) {
        console.error('Erro ao obter veículos:', error.message);
        return null;
    }
};

const getCustomerById = async (customerType, customerId) => {
    try {
        const response = await fetch(`${API_URL}/${customerType}/${customerId}`);
        if (!response.ok) throw new Error('Erro ao obter cliente.');

        const customer = await response.json();
        console.log('Dados de cliente:', customer); // Adicionado para depuração
        return customer;
    } catch (error) {
        console.error('Erro ao obter clientes:', error.message);
        return null;
    }
};

// ** Preenche Tabela de Multas **
const fillFinesTable = async (fines) => {
    const table = document.getElementById('fines-table');
    const tableBody = document.getElementById('fines-table-body');
    tableBody.innerHTML = '';

    if (!fines || fines.length === 0) {
        table.classList.add('d-none');
        return;
    }

    console.log('Preenchendo tabela com multas:', fines);
    table.classList.remove('d-none');

    await fines.forEach((fine) => {
        let { dateFine, location, type, value, status } = fine;
        dateFine = formatField('brDate', dateFine);
        value = formatField('currency', value);
        status = status ? 'Ativa' : 'Inativa';
        const fineData = { dateFine, location, type, value, status };

        const row = document.createElement('tr');
        row.id = `fine-${fine.id}`;
        row.tabIndex = 0;
        row.dataset.bsToggle = 'popover';
        row.dataset.bsTrigger = 'focus';

        Object.entries(fineData).forEach(([key, value]) => {
            const td = document.createElement('td');
            td.textContent = value;
            td.id = `${key}-${fine.id}`;
            row.appendChild(td);
        });

        const updateButton = createUpdateButton(fine);
        const deleteButton = createDeleteButton(fine);
        const buttons = document.createElement('td');
        buttons.appendChild(updateButton);
        buttons.appendChild(deleteButton);

        createPopovers(row, buttons);
        createTooltips(buttons);

        tableBody.appendChild(row);
    });
};

const createDeleteButton = (fine) => {
    const deleteButton = document.createElement('button');
    deleteButton.id = 'delete-fine-button';
    deleteButton.classList.add('btn', 'btn-danger', 'mx-1');
    deleteButton.type = 'button';
    deleteButton.dataset.bsToggle = 'modal';
    deleteButton.dataset.bsTarget = '#delete-fine';
    deleteButton.dataset.bsTitle = 'Deletar Multa';
    deleteButton.dataset.bsPlacement = 'top';
    deleteButton.dataset.bsFine = JSON.stringify(fine);
    deleteButton.onclick = () => {
        handleDeleteFine(JSON.stringify(fine));
    };

    const icon = document.createElement('i');
    icon.classList.add('fa-solid', 'fa-trash');
    deleteButton.appendChild(icon);

    return deleteButton;
}

const handleDeleteFine = async (fine) => {
    const fineData = JSON.parse(fine);

    const confirmButton = document.getElementById('confirm-delete-fine');
    confirmButton.addEventListener('click', async (e) => {
        e.preventDefault();
        const fineId = fineData.id;
        const isDeleted = await deleteFine(fineId);

        const modal = document.getElementById('delete-fine');
        const modalInstance = bootstrap.Modal.getInstance(modal) || new bootstrap.Modal(modal);
        modalInstance.hide();

        if (isDeleted) {
            showToast('Multa deletada com sucesso', 'success');
            const fines = await getFines();
            fillFinesTable(fines);
        } else {
            showToast('Erro ao deletar multa', 'danger');
        }
    });
}

const createUpdateButton = (fine) => {
    const updateButton = document.createElement('button');
    updateButton.id = 'update-fine-button';
    updateButton.classList.add('btn', 'btn-primary', 'mx-1');
    updateButton.type = 'button';
    updateButton.dataset.bsToggle = 'modal';
    updateButton.dataset.bsTarget = '#modalFine';
    updateButton.dataset.bsTitle = 'Detalhes da Multa';
    updateButton.dataset.bsPlacement = 'top';
    updateButton.dataset.bsFine = JSON.stringify(fine);
    updateButton.onclick = () => {
        fillFineModal(JSON.stringify(fine));
        openFineModal("Editar", fine);
    };

    const icon = document.createElement('i');
    icon.classList.add('fa-solid', 'fa-pen');
    updateButton.appendChild(icon);

    return updateButton;
}

const fillFineModal = async (fine) => {
    // Converte a string JSON para um objeto (se necessário)
    const fineData = typeof fine === 'string' ? JSON.parse(fine) : fine;

    // Preenche os campos do modal com os dados da multa
    const rentInput = document.getElementById('rent-input');
    const codeInput = document.getElementById('code');
    const locationInput = document.getElementById('location');
    const observationInput = document.getElementById('observation');
    const dateInput = document.getElementById('dateFine');
    const typeInput = document.getElementById('type');
    const valueInput = document.getElementById('value');
    const statusInput = document.getElementById('fineStatus');

    console.log("RENT: ", fineData.rent);

    if (fineData.rent) {
        const vehicle = await getVehicleById(fineData.rent.vehicleId);
        const customer = await getCustomerById(fineData.rent.customerId ? 'customers' : 'companies', fineData.rent.customerId ? fineData.rent.customerId : fineData.rent.companyId);

        const customerName = customer ? customer?.name : 'Cliente não definido';
        const vehicleName = vehicle ? `${vehicle?.brand} ${vehicle?.model} ${vehicle?.motorization} ${vehicle?.year}` : 'Veículo não definido';
        rentInput.value = `${customerName} - ${vehicleName}`;
        rentInput.setAttribute('data-id', fineData.rent.id); // Define o ID do aluguel
    } else {
        rentInput.value = '';
        rentInput.removeAttribute('data-id');
    }

    console.log("dateFine: ", fineData.dateFine);

    codeInput.value = fineData.code;
    locationInput.value = fineData.location;
    observationInput.value = fineData.observation;
    dateInput.value = fineData.dateFine;
    typeInput.value = fineData.type;
    valueInput.value = formatField('currency', fineData.value);
    statusInput.value = fineData.status;
};

function openFineModal(mode, data = {}) {
    const modalTitle = document.getElementById('modalFineLabel');
    const submitButton = document.getElementById('submitFineButton');
    const dismissButton = document.getElementById('dismissFineButton');

    clearFineForm(); // Limpa o formulário

    const state = { editMode: false };

    if (mode === 'Cadastrar') {
        enterCreateMode(modalTitle, submitButton, dismissButton);

    } else if (mode === 'Editar') {
        fillFineModal(data); // Preenche o formulário com os dados da multa
        submitButton.setAttribute('data-fine-id', data.id); // Armazena o ID da multa

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
    modalTitle.textContent = 'Cadastrar Multa';
    submitButton.textContent = 'Cadastrar';
    dismissButton.textContent = 'Cancelar';

    // Remove o atributo 'readonly' e troca a classe 'form-control-plaintext' por 'form-control' de todos os campos do formulário
    const inputs = document.querySelectorAll('#formFine input, #formFine textarea');
    inputs.forEach(input => {
        input.removeAttribute('readonly');
        input.classList.remove('form-control-plaintext');
        input.classList.add('form-control');
    });

    // Remove o atributo 'disabled' de todos os selects do formulário
    const selects = document.querySelectorAll('#formFine select');
    selects.forEach(select => select.removeAttribute('disabled'));

    // Adiciona o atributo 'data-bs-dismiss' do botão de dismiss e troca a cor do botão de submit
    dismissButton.setAttribute('data-bs-dismiss', 'modal');
    submitButton.classList.remove('btn-primary');
    submitButton.classList.add('btn-success');
    submitButton.setAttribute('type', 'submit');
}

function enterEditMode(modalTitle, submitButton, dismissButton, state) {
    // Altera o título do modal, texto do botão de submit e de dismiss
    modalTitle.textContent = 'Editar Multa';
    submitButton.textContent = 'Salvar';
    dismissButton.textContent = 'Voltar para detalhes';

    // Remove o atributo 'readonly' e troca a classe 'form-control-plaintext' por 'form-control' de todos os campos do formulário
    const inputs = document.querySelectorAll('#formFine input, #formFine textarea');
    inputs.forEach(input => {
        input.removeAttribute('readonly');
        input.classList.remove('form-control-plaintext');
        input.classList.add('form-control');
    });

    // Remove o atributo 'disabled' de todos os selects do formulário
    const selects = document.querySelectorAll('#formFine select');
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
    modalTitle.textContent = 'Detalhes da Multa';
    submitButton.textContent = 'Editar';
    dismissButton.textContent = 'Cancelar';

    // Adiciona o atributo 'readonly' e troca a classe 'form-control' por 'form-control-plaintext' de todos os campos do formulário
    const inputs = document.querySelectorAll('#formFine input, #formFine textarea');
    inputs.forEach(input => {
        input.setAttribute('readonly', 'true');
        input.classList.remove('form-control');
        input.classList.add('form-control-plaintext');
    });

    // Adiciona o atributo 'disabled' de todos os selects do formulário
    const selects = document.querySelectorAll('#formFine select');
    selects.forEach(select => select.setAttribute('disabled', 'true'));

    // Adiciona o atributo 'data-bs-dismiss' do botão de dismiss e troca a cor do botão de submit
    dismissButton.setAttribute('data-bs-dismiss', 'modal');
    submitButton.classList.remove('btn-success');
    submitButton.classList.add('btn-primary');
    submitButton.setAttribute('type', 'button');

    state.editMode = false;
}

function clearFineForm() {
    document.getElementById('formFine').reset(); // Limpa todos os campos do formulário
}

const createFine = async (fineData) => {
    const response = await fetch(`${API_URL}/fines`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'userCookie': getCookie('user') || ''
        },
        body: JSON.stringify(fineData),
    })

    .then(response => {
        if (!response.ok) {
            return response.json().then(errData => {
                console.error('Erro ao criar multa:', errData);
                showToast(response.error, 'danger');
                throw new Error('Erro ao criar multa');
            });
        }
        return response.json();
    })
    .then(async data => {
        console.log('Multa criada com sucesso:', data);
        showToast('Multa criada com sucesso', 'success');
        window.modalInstance.hide();
        const fines = await getFines();
        fillFinesTable(fines);
    })
    .catch((error) => {
        console.error('Erro ao criar multa:', error);
    });
}
const updateFine = async (id, fineData) => {
    const response = await fetch(`${API_URL}/fines/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'userCookie': getCookie('user') || ''
        },
        body: JSON.stringify(fineData),
    })

    .then(response => {
        if (!response.ok) {
            return response.json().then(errData => {
                console.error('Erro ao atualizar multa:', errData);
                showToast(response.error, 'danger');
                throw new Error('Erro ao atualizar multa');
            });
        }
        return response.json();
    })
    .then(async data => {
        console.log('Multa atualizada com sucesso:', data);
        showToast('Multa atualizada com sucesso', 'success');
        window.modalInstance.hide();
        const fines = await getFines();
        fillFinesTable(fines);
    })
    .catch((error) => {
        console.error('Erro ao atualizar multa:', error);
    });
}

async function handleFormSubmit(event) {
    event.preventDefault();

    const fineData = {
        code: document.getElementById('code').value.trim(),
        dateFine: document.getElementById('dateFine').value,
        type: document.getElementById('type').value,
        value: parseFloat(document.getElementById('value').value.replace('R$', '').replace(/\./g, '').replace(',', '.')),
        location: document.getElementById('location').value.trim(),
        observation: document.getElementById('observation').value,
        rentId: parseInt(document.getElementById('rent-input').getAttribute('data-id'), 10),
        status: document.getElementById('fineStatus').value,
    };

    console.log('Dados da multa:', fineData);

    const mode = document.getElementById('submitFineButton').textContent === 'Cadastrar' ? 'create' : 'update';

    if (mode === 'create') {
        createFine(fineData);
    } else {
        const fineId = document.getElementById('submitFineButton').getAttribute('data-fine-id');
        updateFine(fineId, fineData);
    }
}

// ** Busca Multas e Atualiza a Tabela **
const searchFine = async (event) => {
    event.preventDefault();
    const searchParam = prepareQuery(event);
    const fines = await getFinesByParam(searchParam);
    fillFinesTable(fines);
};

// ** Prepara Parâmetros de Busca **
function prepareQuery(event) {
    const formData = new FormData(event.target);
    const searchParam = Object.fromEntries(formData);

    const queryParams = [];
    if (searchParam.search) queryParams.push(`search=${searchParam.search}`);
    if (searchParam.includeLeve) queryParams.push('type=Leve');
    if (searchParam.includeMedia) queryParams.push('type=Media');
    if (searchParam.includeGrave) queryParams.push('type=Grave');
    if (searchParam.includeGravissima) queryParams.push('type=Gravissima');
    if (searchParam.startDate) queryParams.push(`startDate=${new Date(searchParam.startDate).toISOString().split('T')[0]}`);
    if (searchParam.endDate) queryParams.push(`endDate=${new Date(searchParam.endDate).toISOString().split('T')[0]}`);

    return queryParams.length ? '?' + queryParams.join('&') : '';
}

const getFinesByParam = async (value) => {
    try {
        const response = await fetch(`${API_URL}/fines${value}`);
        if (!response.ok) {
            showToast(response.error, 'danger');
            return null;
        }

        const json = await response.json();
        if (json.length === 0) {
            showToast('Nenhuma multa encontrada', 'warning');
            return null;
        }
        return json;
    } catch (error) {
        console.error('Erro ao buscar multas:', error.message);
        showToast('Erro inesperado ao buscar multas.', 'danger');
        return [];
    }
}

const deleteFine = async (id) => {
    try {
        const response = await fetch(`${API_URL}/fines/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'userCookie': getCookie('user') || ''
            },
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
