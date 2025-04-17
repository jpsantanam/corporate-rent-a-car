const company = require('../models/company');
const partner = require('../models/partner');
const representatives = require('../models/representative');
const addresses = require('../models/address');

async function createDefaultCompanies() {
    const companyCount = await company.count();
    if (companyCount === 0) {

        await company.bulkCreate([
            {
                "cnpj": "11223344000155",
                "name": "Tech Solutions S.A.",
                "stateRegistration": 112233445,
                "address": {
                    "street": "Rua Dom José Gaspar",
                    "number": 500,
                    "district": "Coração Eucarístico",
                    "cep": 30535901,
                    "city": "Belo Horizonte",
                    "state": "MG",
                    "complement": "Próximo ao shopping"
                },
                "representatives": {
                    "name": "Lucas Mendes",
                    "email": "lucas.mendes@techsolutions.com",
                    "position": "Gerente de Projetos",
                    "department": "Tecnologia",
                    "phone": 31985462123
                },
                "partners": [
                    {
                        "name": "João Pedro"
                    },
                    {
                        "name": "Matheus"
                    }
                ]
            },
            {
                "cnpj": "22334455000166",
                "name": "InovaTech Ltda.",
                "stateRegistration": 223344556,
                "address": {
                    "street": "Avenida Paulista",
                    "number": 1000,
                    "district": "Bela Vista",
                    "cep": 12345678,
                    "city": "São Paulo",
                    "state": "SP",
                    "complement": "Sala 101"
                },
                "representatives": {
                    "name": "Ana Silva",
                    "email": "ana.silva@inovatech.com",
                    "position": "Diretora de Tecnologia",
                    "department": "Tecnologia",
                    "phone": 11987654321
                },
                "partners": [
                    {
                        "name": "Carlos Souza"
                    },
                    {
                        "name": "Fernanda Lima"
                    }
                ]
            },
            {
                "cnpj": "33445566000177",
                "name": "Mega Data Corp.",
                "stateRegistration": 334455667,
                "address": {
                    "street": "Rua XV de Novembro",
                    "number": 300,
                    "district": "Centro",
                    "cep": 87654321,
                    "city": "Curitiba",
                    "state": "PR",
                    "complement": "Prédio Central"
                },
                "representatives": {
                    "name": "Roberto Costa",
                    "email": "roberto.costa@megadata.com",
                    "position": "Analista de Sistemas",
                    "department": "TI",
                    "phone": 41998765432
                },
                "partners": [
                    {
                        "name": "Juliana Almeida"
                    },
                    {
                        "name": "Renato Braga"
                    }
                ]
            },
            {
                "cnpj": "44556677000188",
                "name": "Global Solutions Ltda.",
                "stateRegistration": 445566778,
                "address": {
                    "street": "Rua das Flores",
                    "number": 120,
                    "district": "Vila Mariana",
                    "cep": 65432109,
                    "city": "Rio de Janeiro",
                    "state": "RJ",
                    "complement": "Próximo à estação de metrô"
                },
                "representatives": {
                    "name": "Mariana Gomes",
                    "email": "mariana.gomes@globalsolutions.com",
                    "position": "Coordenadora de Projetos",
                    "department": "Operações",
                    "phone": 21999887766
                },
                "partners": [
                    {
                        "name": "Paulo Henrique"
                    },
                    {
                        "name": "Cláudia Martins"
                    }
                ]
            }
        ]
            , {
                include: [addresses, representatives, partner],
            })
        console.log('Companies default criados com sucesso');
    } else {
        console.log('Companies default já existem');
    }
}

module.exports = createDefaultCompanies;