document.addEventListener("DOMContentLoaded", function () {
    const API_URL = 'https://corporate-rent-a-car.onrender.com/';
    const selectAno = document.getElementById('editAno');
    const anoAtual = new Date().getFullYear();
    const form = document.getElementById('formEditarVeiculo');

    const preencherDropdownAnos = () => {
        for (let ano = 1980; ano <= anoAtual; ano++) {
            const option = document.createElement('option');
            option.value = ano;
            option.textContent = ano;
            selectAno.appendChild(option);
        }
    };

    const fillUpdateVehicleModal = (vehicleData) => {
        const { fleet, plate, model, brand, year, motorization } = vehicleData;
        form.dataset.id = vehicleData.id;

        document.getElementById('editFrota').value = fleet;
        document.getElementById('editPlaca').value = plate;
        document.getElementById('editAno').value = year;
        document.getElementById('editModelo').value = model;
        document.getElementById('editMarca').value = brand;
        document.getElementById('editMotorizacao').value = motorization;
    };

    const obterDadosVeiculo = async (idVeiculo) => {
        try {
            const response = await fetch(`${API_URL}/vehicles/${idVeiculo}`);
            if (!response.ok) throw new Error('Erro ao carregar os dados do veículo');
            const veiculo = await response.json();
            fillUpdateVehicleModal(veiculo); 
        } catch (error) {
            console.error('Erro ao carregar os dados do veículo:', error);
            showToast('Erro ao carregar os dados do veículo:', "danger");
        }
    };

    // Evento para abrir o modal e carregar os dados do veículo
    document.querySelectorAll('button[data-bs-target="#editVehicle"]').forEach(button => {
        button.addEventListener('click', function () {
            const idVeiculo = this.getAttribute('data-id');
            obterDadosVeiculo(idVeiculo); 
        });
    });
    const atualizarVeiculo = async (Id, updatedVehicleData) => {
        try {
            const response = await fetch(`${API_URL}/vehicles/${Id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedVehicleData)
            });
            if (!response.ok) {
                const errorDetails = await response.json();
                throw new Error('Erro ao atualizar veículo: ' + (errorDetails.message || 'Erro desconhecido'));
            }
            return response.json();
        } catch (error) {
            throw error;
        }
    };
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const idVeiculo = this.dataset.id;
        const updatedVehicleData = {
            plate: document.getElementById('editPlaca').value.trim(),
            fleet: document.getElementById('editFrota').value.trim(),
            year: parseInt(document.getElementById('editAno').value, 10),
            model: document.getElementById('editModelo').value.trim(),
            brand: document.getElementById('editMarca').value.trim(),
            motorization: document.getElementById('editMotorizacao').value.trim(),
        };

        if (!updatedVehicleData.plate || updatedVehicleData.plate.length !== 7) {
            showToast('A placa deve ter pelo menos 3 caracteres!', "warning");
            return;
        }
        if (!updatedVehicleData.model || updatedVehicleData.model.length < 3) {
            showToast('O modelo deve ter pelo menos 3 caracteres!', "warning");
            return;
        }
        if (!updatedVehicleData.brand || updatedVehicleData.brand.length < 3) {
            showToast('A marca deve ter pelo menos 3 caracteres!', "warning");
            return;
        }

        try {
            const data = await atualizarVeiculo(idVeiculo, updatedVehicleData);
            console.log('Veículo atualizado com sucesso:', data);
            showToast('Veículo atualizado com sucesso:', "success");

            const vehicles = await getVehicles();
            fillVehiclesTable(vehicles);

            const modal = bootstrap.Modal.getInstance(document.getElementById('editVehicle'));
            modal.hide();
        } catch (error) {
            console.error('Erro ao atualizar o veículo:', error.message);
            showToast('Erro ao atualizar o veículo, verifique os dados e tente novamente.', "danger");
        }
    });

    preencherDropdownAnos();
});
