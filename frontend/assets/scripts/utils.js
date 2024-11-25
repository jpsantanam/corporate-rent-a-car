const API_URL = "https://corporate-rent-a-car.onrender.com/";

function togglePassword(event) {
    const passwordField = event.target.closest(".input-group").querySelector("input");
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        event.target.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486z"></path>
                <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"></path>
                <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708"></path>
            </svg>
        `;
    } else {
        passwordField.type = 'password';
        event.target.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
            </svg>
        `;
    }
}

function showToast(content, type) {
    const delay = 3500;
    let toastHtml = `
    <div class="toast align-items-center text-white bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
            <div class="toast-body h6 p-3 m-0">${content}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    </div>
    `;
    //const toastElement = htmlToElement(toastHtml);

    const template = document.createElement('template');
    toastHtml = toastHtml.trim();
    template.innerHTML = toastHtml;
    const toastElement = template.content.firstChild;

    const toastContainer = document.querySelector("#toast-container");
    toastContainer.appendChild(toastElement);
    const toast = new bootstrap.Toast(toastElement, { delay: delay, animation: true });
    toast.show();
    setTimeout(() => toastElement.remove(), delay + 1000);
}

function getCookie(nomeCookie) {
    const name = nomeCookie + "=";
    const decodedCookie = decodeURIComponent(document.cookie); // Decodifica os cookies
    const cookieArray = decodedCookie.split(';'); // Divide todos os cookies em um array
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        // Remove espaços em branco iniciais
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        // Se o cookie começar com o nome desejado, retorna o valor
        if (cookie.indexOf(name) === 0) return cookie.substring(name.length, cookie.length);
    }
    return "";
}

function logout() {
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "index.html";
}

function formatField(field, value) {
    if (field === 'cpf') return value.toString().replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    if (field === 'telephone' || field === 'phone') return value.toString().replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
    if (field === 'cep') return value.toString().replace(/(\d{2})(\d{3})(\d{3})/, '$1.$2-$3');
    if (field === 'date') return new Date(value).toISOString().split('T')[0]; // Formata a data para o padrão ISO (YYYY-MM-DD)
    if (field === 'brDate') return new Date(value).toLocaleDateString('pt-BR'); // Formata a data para o padrão brasileiro (DD/MM/YYYY)
    if (field === 'cnpj') return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    if (field === 'stateRegistration') return value.toString().replace(/(\d{2})(\d{6})(\d{1})/, '$1.$2-$3');
    if (field === 'carPlate') return value.toString().replace(/(\w{3})(\d{4})/, '$1-$2');
    if (field === 'currency') return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function loadMasks() {
    $('.cpf').mask('000.000.000-00');
    $('.cnh').mask('00000000000');
    $('.phone').mask('(00) 00000-0000');
    $('.cep').mask('00.000-000');
    $('.cnpj').mask('00.000.000/0000-00');
    $('.stateRegistration').mask('00.000000-0');
    $('.carPlate').mask('AAA-0000');
};

function cepSearch(cepElement) {
    const cepValue = cepElement.val().replace(/\D/g, '');
    const closestForm = cepElement.closest('form');
    if (cepValue.length == 8) {
        $.ajax({
            url: 'https://viacep.com.br/ws/' + cepValue + '/json',
            dataType: 'json',
            success: function (response) {
                console.log("ViaCEP response:", response);
                if (!response.erro) {
                    closestForm.find(".street").val(response.logradouro);
                    closestForm.find(".street").attr('disabled', true);
                    closestForm.find(".district").val(response.bairro);
                    closestForm.find(".district").attr('disabled', true);
                    closestForm.find(".city").val(response.localidade);
                    closestForm.find(".city").attr('disabled', true);
                    closestForm.find(".state").val(response.uf);
                    closestForm.find(".state").attr('disabled', true);
                    //closestForm.find(".address-complement").val(response.complemento);

                    closestForm.find(".address-number").focus();
                } else {
                    closestForm.find(".street").removeAttr('disabled');
                    closestForm.find(".district").removeAttr('disabled');
                    closestForm.find(".city").removeAttr('disabled');
                    closestForm.find(".state").removeAttr('disabled');
                }
            }
        });
    } else {
        closestForm.find(".street").removeAttr('disabled');
        closestForm.find(".district").removeAttr('disabled');
        closestForm.find(".city").removeAttr('disabled');
        closestForm.find(".state").removeAttr('disabled');
    }
}

function passwordValidation(password) {
    if (password.length < 8) showToast('A senha deve ter no mínimo 8 caracteres', "warning");
    if (!password.match(/[a-z]/)) showToast('A senha deve ter no mínimo uma letra minúscula', "warning");
    if (!password.match(/[A-Z]/)) showToast('A senha deve ter no mínimo uma letra maiúscula', "warning");
    if (!password.match(/[0-9]/)) showToast('A senha deve ter no mínimo um número', "warning");
    if (!password.match(/[^a-zA-Z0-9]/)) showToast('A senha deve ter no mínimo um caracter especial', "warning");

    return password.length >= 8 && password.match(/[a-z]/) && password.match(/[A-Z]/) && password.match(/[0-9]/) && password.match(/[^a-zA-Z0-9]/);
}

function passwordConfirmation(password, confirmPassword) {
    if (password !== confirmPassword) {
        showToast('As duas senhas devem ser iguais', "warning");
        return false;
    }
    return true;
}

function correctOldPassword(oldPassword) {
    let user = getCookie('user');
    user = user ? JSON.parse(user) : null;
    const requestBody = { email: user?.email, password: oldPassword };

    postData(`${API_URL}/users/login`, requestBody, 'Login realizado com sucesso').then((response) => {
        if (!user || response.error) {
            showToast('Senha atual incorreta', "warning");
            return false;
        }
        return true;
    });
}

function validateCpf(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11) {
        showToast('CPF inválido', "warning");
        return false;
    }
    return true;
}

function validateCnpj(cnpj) {
    cnpj = cnpj.replace(/\D/g, '');
    if (cnpj.length !== 14) {
        showToast('CNPJ inválido', "warning");
        return false;
    }
    return true;
}

function validateDriverLicense(driverLicense) {
    if (driverLicense.length !== 11) {
        showToast('CNH inválida', "warning");
        return false;
    }
    return true;
}

function validateStateRegistration(stateRegistration) {
    stateRegistration = stateRegistration.replace(/\D/g, '');
    if (stateRegistration.length !== 9) {
        showToast('Inscrição estadual inválida', "warning");
        return false;
    }
    return true;
}

function validateTelephone(telephone) {
    telephone = telephone.replace(/\D/g, '');
    if (telephone.length !== 11) {
        showToast('Telefone inválido', "warning");
        return false;
    }
    return true;
}

function validateCep(cep) {
    cep = cep.replace(/\D/g, '');
    if (cep.length !== 8) {
        showToast('CEP inválido', "warning");
        return false;
    }
    return true;
}

function validateCarPlate(carPlate) {
    car = carPlate.replace(/\D/g, '');
    if (carPlate.length !== 7) {
        showToast('Placa de carro inválida', "warning");
        return false;
    }
    return true;
}

function validateRepresentatives(representatives) {
    if (representatives.length === 0) {
        showToast('Adicione ao menos um representante', "warning");
        return false;
    } else {
        for (const representative of representatives) {
            if (!validateTelephone(representative.querySelector('.phone').value)) return false;
        }
    }
    return true;
}

function validateCustomerOrCompany(customer) {
    if (!customersAndCompanies.some(item => item?.name === customer)) {
        showToast('Cliente/empresa inválido', "warning");
        return false;
    }
    return true;
}

function validateVehicle(vehicle) {
    if (!vehicles.some(item => item?.name === vehicle)) {
        showToast('Veículo inválido', "warning");
        return false;
    }
    return true;
}

async function getData(resource, successMessage) {
    try {
        const response = await fetch(`${resource}`, {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        });

        if (response.ok) {
            console.log(successMessage);
            return await response.json();
        } else throw new Error(await response.text());
    } catch (error) {
        console.error("Error getting data:", error);
        return { error: error.message };
    }
}

async function postData(resource, requestBody, successMessage) {
    try {
        const response = await fetch(`${resource}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify(requestBody),
        });

        if (response.ok) {
            console.log(successMessage);
            return await response.json();
        } else throw new Error(await response.text());
    } catch (error) {
        console.error("Error posting data:", error);
        return { error: error.message };
    }
}

async function putData(resource, requestBody, successMessage) {
    try {
        const response = await fetch(`${resource}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify(requestBody),
        });

        if (response.ok) {
            console.log(successMessage);
            return await response.json();
        } else throw new Error(await response.text());
    } catch (error) {
        console.error("Error putting data:", error);
        return { error: error.message };
    }
}

async function deleteData(resource, successMessage) {
    try {
        const response = await fetch(`${resource}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        });

        if (response.ok) {
            console.log(successMessage);
            return await response.json();
        } else throw new Error(await response.text());
    } catch (error) {
        console.error("Error deleting data:", error);
        return { error: error.message };
    }
}

const createPopovers = (row, buttons) => {
    const popoverOptions = {
        html: true,
        content: buttons,
        trigger: 'focus'
    }

    row.dataset.bsTitle = "Ações";
    const popover = new bootstrap.Popover(row, popoverOptions);
    row.onclick = () => {
        popover.show();
    };
    row.onmouseover = () => {
        row.style.cursor = 'pointer';
    }
};

const createTooltips = (buttons) => {
    for (const button of buttons.children) {
        const tooltipOptions = {
            placement: 'top',
            trigger: 'hover'
        }
        const tooltip = new bootstrap.Tooltip(button, tooltipOptions);
        button.addEventListener('click', () => {
            tooltip.hide();
        });
    };
};