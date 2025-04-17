document.addEventListener('click', async (event) => {
    const button = event.target.closest('#download');
    
    if (button) {
        //console.log("Botão de download clicado!");

        const rentId = button.getAttribute('data-rent-id');
        //console.log("ID do aluguel encontrado:", rentId);

        if (!rentId) {
            showToast("ID do aluguel não encontrado.", "danger");
            return;
        }

        try {
            // recuperar o nome do funcionário que está criando o contrato
            const { name: funcionario/* , role: cargo */ } = getUserFromCookie();
            //console.log("Funcionário:", funcionario, "Cargo:", cargo);

            // recupera os dados do aluguel
            const rentResponse = await fetch(`https://corporate-rent-a-car-app.onrender.com/rents/${rentId}`);
            if (!rentResponse.ok) {
                throw new Error('Erro ao buscar os dados do aluguel.');
            }

            const rentData = await rentResponse.json();
            //console.log("Dados do aluguel recebidos:", rentData);

            // verificar se é pessoa física ou jurídica
            const isCpf = rentData.customer !== null;
            //console.log("Tipo de cliente:", isCpf ? "Pessoa Física" : "Pessoa Jurídica");


            // caso o cliente seja empresa, recupera os representantes
            let representatives = [];
            if (!isCpf) {
                const companyResponse = await fetch(`https://corporate-rent-a-car-app.onrender.com/companies/${rentData.company.id}`);
                if (!companyResponse.ok) {
                    throw new Error('Erro ao buscar os dados da empresa.');
                }

                const companyData = await companyResponse.json();
                //console.log("Dados da empresa recebidos:", companyData);

                representatives = companyData?.representatives
                    ?.map(representative =>  ({ name: representative?.name, position: representative?.position }))
                    ?.filter(representative => representative?.name !== null && representative?.position !== null);
            }
            //console.log("Representantes da empresa:", representatives);

            console.log("startDate: ", rentData.startDate);
            console.log("startDate formatada: ", formatField('brDate', rentData.startDate));
            console.log("endDate: ", rentData.endDate);
            console.log("endDate formatada: ", formatField('brDate', rentData.endDate));


            const payload = isCpf
                ? {
                    customerId: rentData.customer.id,
                    customerName: rentData.customer.name,
                    cpf: formatField('cpf', rentData.customer.cpf),
                    vehicleId: rentData.vehicle.id,
                    vehicleModel: rentData.vehicle.model,
                    vehiclePlate: rentData.vehicle.plate,
                    startDate: formatField('brDate', rentData.startDate),
                    endDate: formatField('brDate', rentData.endDate),
                    coverage: rentData.coverage,
                    contractValue: formatField('currency', rentData.value),
                    observation: rentData.observation || '',
                    funcionario,
                    //cargo,
                }
                : {
                    companyId: rentData.company.id,
                    companyName: rentData.company.name,
                    cnpj: formatField('cnpj', rentData.company.cnpj),
                    vehicleId: rentData.vehicle.id,
                    vehicleModel: rentData.vehicle.model,
                    vehiclePlate: rentData.vehicle.plate,
                    startDate: formatField('brDate', rentData.startDate),
                    endDate: formatField('brDate', rentData.endDate),
                    coverage: rentData.coverage,
                    contractValue: formatField('currency', rentData.value),
                    observation: rentData.observation || '',
                    funcionario,
                    //cargo,
                    representatives,
                };

            // envia os dados para gerar o contrato
            const response = await fetch('https://corporate-rent-a-car-app.onrender.com/contracts/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'userCookie': getCookie('user') || ''
                },
                body: JSON.stringify(payload),
            });
            //console.log("Resposta recebida do backend:", response);

            if (!response.ok) {
                throw new Error('Erro ao gerar o contrato.');
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `Contrato_Aluguel_${rentId}.docx`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);

            showToast("Contrato gerado com sucesso!", "success");
        } catch (error) {
            console.error("Erro ao gerar contrato:", error);
            showToast("Erro ao gerar contrato: " + error, "danger");
        }
    }
});


function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].split('=');
        if (cookie[0] === name) {
            return decodeURIComponent(cookie[1]);
        }
    }
    return null;
}

function getUserFromCookie() {
    const userCookie = getCookie('user'); 
    if (!userCookie) {
        console.error("Cookie 'user' não encontrado.");
        return { name: "Desconhecido", role: "Indefinido" };
    }

    try {
        const user = JSON.parse(userCookie);
        return { name: user.name || "Desconhecido", role: user.role || "Indefinido" };
    } catch (error) {
        console.error("Erro ao parsear o cookie 'user':", error);
        return { name: "Desconhecido", role: "Indefinido" };
    }
}
