const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const Customer = require('../models/customer');
const Vehicle = require('../models/vehicle');

// Gera o contrato preenchido
exports.createContract = async (req, res) => {
    try {
        const { customerId, vehicleId, startDate, endDate, coverage, contractValue, observation } = req.body;
        // dados do cliente e do veículo
        const customer = await Customer.findByPk(customerId);
        const vehicle = await Vehicle.findByPk(vehicleId);

        if (!customer || !vehicle) {
            return res.status(404).json({ error: "Cliente ou veículo não encontrado" });
        }

        // Carregar o modelo de contrato .docx
        //const templatePath = path.join(__dirname, '../templates/contrato_template.docx');
        const templatePath = path.join(__dirname, '../templates/template-teste.docx');
        const content = fs.readFileSync(templatePath, 'binary');
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip);

        // coloca no documento as informações
        doc.setData({
            nomeCliente: customer.name,
            cpfCliente: customer.cpf,
            placaVeiculo: vehicle.plate,
            modeloVeiculo: vehicle.model,
            dataInicio: startDate,
            dataFim: endDate,
            valorContrato: contractValue,
            cobertura: coverage,
            observacao: observation
        });

        doc.render();

        const buf = doc.getZip().generate({ type: 'nodebuffer' });

        const fileName = `contrato_${customer.name.replace(/[^a-zA-Z0-9]/g, '_')}.docx`;

        // arquivo disponivel pra download
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'Content-Disposition': `attachment; filename="${fileName}"`,
        });
        res.send(buf);

    } catch (error) {
        console.error("Erro ao gerar contrato:", error);
        res.status(500).json({ error: "Erro ao gerar o contrato" });
    }
}