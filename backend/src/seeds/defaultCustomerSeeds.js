const customer = require('../models/customer');
const addresses = require('../models/address')
const rgs = require('../models/rg')
const driverLicenses = require('../models/driverLicense')

async function createDefaultCustomers() {
  const customerCount = await customer.count();
  if (customerCount === 0) {

    await customer.bulkCreate([
      {
        cpf: 22334455667,
        name: "Maria Clara Silva",
        fatherName: "Carlos Silva",
        motherName: "Ana Clara Silva",
        maritalStatus: "casado",
        birthday: "1985-03-12T00:00:00.000Z",
        email: "maria.clara@empresa.com",
        telephone: 31987654321,
        observation: "Indicação da empresa",
        address: {
          street: "Rua das Laranjeiras",
          number: 230,
          district: "Laranjeiras",
          cep: 50011220,
          city: "Recife",
          state: "PE",
          complement: "Próximo ao museu"
        },
        rg: {
          number: "2233445566",
          issuingBody: "SSP-PE",
          issuingDate: "2021-01-15T00:00:00.000Z",
          state: "PE"
        },
        driverLicense: {
          number: "0987654321",
          firstDate: "2003-08-20T00:00:00.000Z",
          issuingBody: "Detran",
          expirationDate: "2026-08-20T00:00:00.000Z",
          category: "B"
        }
      },
      {
        cpf: 33445566778,
        name: "José Antonio Souza",
        fatherName: "Luiz Souza",
        motherName: "Rosa Souza",
        maritalStatus: "solteiro",
        birthday: "1990-11-25T00:00:00.000Z",
        email: "jose.antonio@empresa.com",
        telephone: 31965498745,
        observation: "Atendimento preferencial",
        address: {
          street: "Avenida Paulista",
          number: 1500,
          district: "Bela Vista",
          cep: 13102000,
          city: "São Paulo",
          state: "SP",
          complement: "Próximo ao MASP"
        },
        rg: {
          number: "3344556677",
          issuingBody: "SSP-SP",
          issuingDate: "2019-07-10T00:00:00.000Z",
          state: "SP"
        },
        driverLicense: {
          number: "1122334455",
          firstDate: "2008-12-05T00:00:00.000Z",
          issuingBody: "Detran",
          expirationDate: "2024-12-05T00:00:00.000Z",
          category: "AB"
        }
      },
      {
        cpf: 44556677889,
        name: "Ana Beatriz Gomes",
        fatherName: "Fernando Gomes",
        motherName: "Paula Gomes",
        maritalStatus: "viúvo",
        birthday: "1975-05-30T00:00:00.000Z",
        email: "ana.beatriz@empresa.com",
        telephone: 31987651234,
        observation: "Cliente VIP",
        address: {
          street: "Rua XV de Novembro",
          number: 895,
          district: "Centro",
          cep: 80020000,
          city: "Curitiba",
          state: "PR",
          complement: "Ao lado da praça"
        },
        rg: {
          number: "4455667788",
          issuingBody: "SSP-PR",
          issuingDate: "2018-03-22T00:00:00.000Z",
          state: "PR"
        },
        driverLicense: {
          number: "2233445566",
          firstDate: "1995-09-14T00:00:00.000Z",
          issuingBody: "Detran",
          expirationDate: "2025-09-14T00:00:00.000Z",
          category: "C"
        }
      },
      {
        cpf: 55667788990,
        name: "Rafael Lima",
        fatherName: "Miguel Lima",
        motherName: "Patrícia Lima",
        maritalStatus: "casado",
        birthday: "1982-08-17T00:00:00.000Z",
        email: "rafael.lima@empresa.com",
        telephone: 31912345678,
        observation: "Recomendado pela empresa",
        address: {
          street: "Rua das Acácias",
          number: 125,
          district: "Boa Vista",
          cep: 69020970,
          city: "Manaus",
          state: "AM",
          complement: "Próximo à praça central"
        },
        rg: {
          number: "5566778899",
          issuingBody: "SSP-AM",
          issuingDate: "2020-06-05T00:00:00.000Z",
          state: "AM"
        },
        driverLicense: {
          number: "3344556677",
          firstDate: "2001-04-15T00:00:00.000Z",
          issuingBody: "Detran",
          expirationDate: "2027-04-15T00:00:00.000Z",
          category: "AD"
        }
      },
      {
        cpf: 66778899001,
        name: "Luciana Pereira",
        fatherName: "João Pereira",
        motherName: "Sonia Pereira",
        maritalStatus: "divorciado",
        birthday: "1992-01-05T00:00:00.000Z",
        email: "luciana.pereira@empresa.com",
        telephone: 31923456789,
        observation: "Solicitou contato por e-mail",
        address: {
          street: "Rua dos Andradas",
          number: 875,
          district: "Centro Histórico",
          cep: 90020120,
          city: "Porto Alegre",
          state: "RS",
          complement: "Próximo ao mercado público"
        },
        rg: {
          number: "6677889900",
          issuingBody: "SSP-RS",
          issuingDate: "2022-11-17T00:00:00.000Z",
          state: "RS"
        },
        driverLicense: {
          number: "4455667788",
          firstDate: "2012-02-25T00:00:00.000Z",
          issuingBody: "Detran",
          expirationDate: "2028-02-25T00:00:00.000Z",
          category: "B"
        }
      }
    ], {
      include: [addresses, rgs, driverLicenses]
    }
    )
    console.log('Customers default criados com sucesso');

  }
  else {
    console.log('Customers default já existem');
  }

}

module.exports = createDefaultCustomers;