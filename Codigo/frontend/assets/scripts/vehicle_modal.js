document.addEventListener("DOMContentLoaded", function () {
    const API_URL = 'https://corporate-rent-a-car-app.onrender.com';

    // Função para gerar os anos no dropdown de seleção de ano
    const gerarAnosDropdown = () => {
        const selectAno = document.getElementById('ano');
        const anoAtual = new Date().getFullYear();

        for (let ano = 1980; ano <= anoAtual; ano++) {
            const option = document.createElement('option');
            option.value = ano;
            option.textContent = ano;
            selectAno.appendChild(option);
        }
    };

    const enviarDadosVeiculo = async (vehicleData) => {
        try {
            const response = await fetch(`${API_URL}/vehicles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'userCookie': getCookie('user') || ''
                },
                body: JSON.stringify(vehicleData)
            });

            if (!response.ok) {
                // Captura a resposta do servidor para mostrar mais detalhes do erro
                const errorDetails = await response.json();
                console.error('Detalhes do erro:', errorDetails);
                throw new Error('Erro ao cadastrar veículo: ' + (errorDetails.message || 'Erro desconhecido'));
            }

            return response.json();
        } catch (error) {
            throw error;
        }
    };

    // Função para tratar o envio do formulário
    const handleFormSubmit = (e) => {
        e.preventDefault();

        // Coleta os dados do formulário
        const vehicleData = {
            plate: document.getElementById('placa').value.trim(),
            fleet: document.getElementById('frota').value.trim(),
            year: parseInt(document.getElementById('ano').value, 10),
            model: document.getElementById('modelo').value.trim(),
            brand: document.getElementById('marca').value.trim(),
            motorization: document.getElementById('motorizacao').value.trim(),
        };

        // Validação básica dos dados no frontend
        if (!vehicleData.plate || vehicleData.plate.length !== 7) {
            showToast('A placa deve ter 7 caracteres!:', "warning");
            return;
        }
        if (!vehicleData.model || vehicleData.model.length < 3) {
            showToast('O modelo deve ter pelo menos 3 caracteres!:', "warning");
            return;
        }
        if (!vehicleData.brand || vehicleData.brand.length < 3) {
            showToast('A marca deve ter pelo menos 3 caracteres!:', "warning");
            return;
        }

        // const submitButton = document.querySelector('#submitButton');
        // submitButton.disabled = true;  // Desativa o botão de envio durante o fetch
        // submitButton.textContent = 'Cadastrando...'; // Mensagem de carregamento

        // Envia os dados via fetch e trata o retorno
        enviarDadosVeiculo(vehicleData)
            .then(async data => {
                console.log('Veículo cadastrado com sucesso:', data);
                showToast('Veículo cadastrado com sucessoo', "success");

                // Fecha o modal após sucesso
                // const modal = bootstrap.Modal.getInstance(document.getElementById('modalNovoVeiculo'));
                const modal = bootstrap.Modal.getInstance(document.getElementById('manageVehicle'));
                modal.hide();

                const vehicles = await getVehicles();
                fillVehiclesTable(vehicles);

                // Limpa o formulário
                document.getElementById('formNovoVeiculo').reset();
            })
            .catch(error => {
                console.error('Erro ao cadastrar veículo:', error.message);
                showToast('Erro ao cadastrar veículo:', "danger");
            })
            .finally(() => {
                // submitButton.disabled = false;  // Reabilita o botão de envio após a resposta
                // submitButton.textContent = 'Cadastrar'; // Restaura o texto do botão
            });
    };

    // Inicializa o script
    const inicializar = () => {
        gerarAnosDropdown();  // Gera os anos no dropdown

        // Adiciona listener de envio ao formulário
        const form = document.getElementById('formNovoVeiculo');
        form.addEventListener('submit', handleFormSubmit);
    };

    inicializar();
});
