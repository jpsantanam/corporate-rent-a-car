const path = require('path');
const fs = require('fs');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const logs = require('../controllers/logController');

//Criar um log de ação
async function createLog(req, res, action) {
    const customerType = req?.body?.customerName ? "customer" : "company";
    const customerName = customerType === "customer" ? req?.body?.customerName : req?.body?.companyName;
    const vehicleName = `${req?.body?.vehicleModel} ${req?.body?.vehiclePlate}`;

    const targetCustomer = `${customerType === "customer" ? 'o(a) cliente' : 'a empresa'} ${customerName}`;
    const targetVehicle = `do veículo ${vehicleName}`;
    const targetCustomerVehicle = targetCustomer && targetVehicle ? `para ${targetCustomer} referente ao aluguel ${targetVehicle}, ` : '';
    const targetRent = `com data de início ${new Date(req?.body?.startDate).toLocaleDateString('pt-BR')} e data de fim ${new Date(req?.body?.endDate).toLocaleDateString('pt-BR')}`;

    req.body = {
        action: action,
        entity: "um contrato",
        target: `${targetCustomerVehicle}${targetRent}`
    }

    logs.create(req, res, next = () => {});
}

exports.createContract = async (req, res) => {
    try {
        const {
            customerId,
            companyId,
            vehicleId,
            startDate,
            endDate,
            coverage,
            contractValue,
            observation,
            customerName,
            companyName,
            cnpj,
            cpf,
            vehicleModel,
            vehiclePlate,
            funcionario,
            //cargo,
            representatives,
        } = req.body;

        console.log("Dados recebidos no backend para gerar contrato:", req.body);

        if (!vehicleId || !startDate || !endDate || !contractValue) {
            console.error("Erro: Dados obrigatórios ausentes.");
            return res.status(400).json({ error: "Dados obrigatórios ausentes." });
        }

        // gera o idContrato -> idCliente-idVeiculo/ano (4-7/24 -> cliente 4, veículo 7, ano 2024)
        const year = new Date().getFullYear().toString().slice(-2);
        const idContrato = `${customerId || companyId}-${vehicleId}/${year}`;

        let saudacaoClientes = "";
        if (companyId) {
            if (representatives.length) {
                const saudacao = representatives.length === 1 ? 'Ao Prezado(a)' : 'Aos Prezados(as)';
                const clientes = representatives.map((rep, index) => {
                    const separator = index === representatives.length - 1 ? '' : (index === representatives.length - 2 ? ' e ' : ', ');
                    return `${rep.name} (${rep.position})${separator}`;
                }).join('');
                saudacaoClientes = `${saudacao} ${clientes}`;

            } else saudacaoClientes = `Prezado(a) ${companyName}`;
        }

        const templatePath = customerId
            ? path.join(__dirname, '../templates/contrato_template_cpf.docx') // Pessoa Física
            : path.join(__dirname, '../templates/contrato_template_cnpj.docx'); // Pessoa Jurídica

        if (!fs.existsSync(templatePath)) {
            console.error("Erro: Template não encontrado no caminho:", templatePath);
            return res.status(500).json({ error: "Template do contrato não encontrado." });
        }

        const content = fs.readFileSync(templatePath, 'binary');
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip);

        // preenche o documento docx
        const templateData = customerId
            ? {
                idContrato,
                nomeCliente: customerName,
                cpfCliente: cpf || "Não informado",
                veiculoFormatado: `Modelo: ${vehicleModel}, Placa: ${vehiclePlate}`,
                valorFormatado: contractValue,
                data: new Date().toLocaleDateString('pt-BR'),
                dataInicial: startDate,
                dataFinal: endDate,
                funcionario,
                //cargo,
            }
            : {
                idContrato,
                saudacaoClientes,
                nomeCliente: companyName,
                empresaCliente: companyName,
                cnpjCliente: cnpj,
                veiculoFormatado: `Modelo: ${vehicleModel}, Placa: ${vehiclePlate}`,
                valorFormatado: contractValue,
                data: new Date().toLocaleDateString('pt-BR'),
                dataInicial: startDate,
                dataFinal: endDate,
                funcionario,
                //cargo,
            };

        doc.setData(templateData);

        try {
            doc.render();
        } catch (error) {
            console.error("Erro ao renderizar o template:", error);
            return res.status(500).json({ error: "Erro ao preencher o template do contrato." });
        }

        const buf = doc.getZip().generate({ type: 'nodebuffer' });
        const fileName = `contrato_${customerId ? customerName : companyName}_${Date.now()}.docx`;

        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'Content-Disposition': `attachment; filename="${fileName}"`,
        });
        res.send(buf);

        createLog(req, res, "gerou");

    } catch (error) {
        console.error("Erro ao gerar contrato:", error.message);
        res.status(500).json({ error: "Erro ao gerar o contrato." });
    }
};