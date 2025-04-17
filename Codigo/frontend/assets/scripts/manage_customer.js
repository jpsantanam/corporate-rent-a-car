const manageCustomerModal = $('#manageCustomer');
manageCustomerModal.on('show.bs.modal', event => {

    const triggerType = $(event.relatedTarget).data('bs-action');
    $('#manage-customer input').val('');

    let customerData = {};
    if (triggerType === 'UPDATE') customerData = JSON.parse(event.relatedTarget.getAttribute('data-bs-customer').replace(/&quot;/g, '"').replace(/&apos;/g, "'"));

    $('#manageCustomerContent').html(`
        <div class="modal-header">
            <h1 class="modal-title fs-1" id="manageCustomerLabel">${triggerType === 'POST' ? 'Cadastrar Cliente Pessoa Física' : 'Detalhes de Cliente Pessoa Física'}</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <form id="manage-customer">
            <div class="modal-body">

                <input type="hidden" id="manage-customer-method" value="${triggerType}">
                <input type="hidden" id="manage-customer-id" ${triggerType === 'UPDATE' ? `name="_id" value="${customerData?.id}"` : ''}>

                <div class="container-fluid">
                    <div class="row">
                        <h2 class="modal-title fs-3 mb-3">Dados Pessoais</h2>

                        <div class="col-12 col-md-6">
                            <div class="form-floating mb-3">
                                <input type="text" class="${triggerType === 'POST' ? 'form-control' : 'form-control-plaintext'}" id="manage-customer-name" name="name" placeholder="name" required ${triggerType === 'UPDATE' ? `value="${customerData?.name}" readonly` : ''}>
                                <label for="manage-customer-name">Nome Completo (*)</label>
                            </div>
                        </div>

                        <div class="col-12 col-md-6">
                            <div class="form-floating mb-3">
                                <input type="email" class="${triggerType === 'POST' ? 'form-control' : 'form-control-plaintext'}" id="manage-customer-email" name="email" placeholder="email" required ${triggerType === 'UPDATE' ? `value="${customerData?.email}" readonly` : ''}>
                                <label for="manage-customer-email">Email (*)</label>
                            </div>
                        </div>

                        <div class="col-6 col-md-3">
                            <div class="form-floating mb-3">
                                <input type="text" class="${triggerType === 'POST' ? 'form-control' : 'form-control-plaintext'} cpf" id="manage-customer-cpf" name="cpf" placeholder="cpf" required ${triggerType === 'UPDATE' ? `value="${customerData?.cpf}" readonly` : ''}>
                                <label for="manage-customer-cpf">CPF (*)</label>
                            </div>
                        </div>

                        <div class="col-6 col-md-3">
                            <div class="form-floating mb-3">
                                <input type="text" class="${triggerType === 'POST' ? 'form-control' : 'form-control-plaintext'} phone" id="manage-customer-telephone" name="telephone" placeholder="telephone" required ${triggerType === 'UPDATE' ? `value="${customerData?.telephone}" readonly` : ''}>
                                <label for="manage-customer-telephone">Telefone (*)</label>
                            </div>
                        </div>

                        <div class="col-6 col-md-3">
                            <div class="form-floating mb-3">
                                <select class="form-select" id="manage-customer-maritalStatus" name="maritalStatus" required ${triggerType === 'UPDATE' ? 'disabled' : ''}>
                                    ${triggerType === 'POST' ? '<option selected disabled>Selecione</option>' : ''}
                                    <option value="solteiro" ${triggerType === 'UPDATE' && customerData?.maritalStatus === 'solteiro' ? 'selected' : ''}>Solteiro(a)</option>
                                    <option value="casado" ${triggerType === 'UPDATE' && customerData?.maritalStatus === 'casado' ? 'selected' : ''}>Casado(a)</option>
                                    <option value="separado" ${triggerType === 'UPDATE' && customerData?.maritalStatus === 'separado' ? 'selected' : ''}>Separado(a)</option>
                                    <option value="divorciado" ${triggerType === 'UPDATE' && customerData?.maritalStatus === 'divorciado' ? 'selected' : ''}>Divorciado(a)</option>
                                    <option value="viuvo" ${triggerType === 'UPDATE' && customerData?.maritalStatus === 'viuvo' ? 'selected' : ''}>Viúvo(a)</option>
                                </select>
                                <label for="manage-customer-maritalStatus">Estado Civil (*)</label>
                            </div>
                        </div>

                        <div class="col-6 col-md-3">
                            <div class="form-floating mb-3">
                                <input type="date" class="${triggerType === 'POST' ? 'form-control' : 'form-control-plaintext'}" id="manage-customer-birthday" name="birthday" placeholder="birthday" required ${triggerType === 'UPDATE' ? `value="${formatField('date', customerData?.birthday)}" readonly` : ''}>
                                <label for="manage-customer-birthday">Data de Nascimento (*)</label>
                            </div>
                        </div>

                        <div class="col-12 col-md-6 col-xl-4">
                            <div class="form-floating mb-3">
                                <input type="text" class="${triggerType === 'POST' ? 'form-control' : 'form-control-plaintext'}" id="manage-customer-fatherName" name="fatherName" placeholder="fatherName" required ${triggerType === 'UPDATE' ? `value="${customerData?.fatherName}" readonly` : ''}>
                                <label for="manage-customer-fatherName">Nome do Pai</label>
                            </div>
                        </div>

                        <div class="col-12 col-md-6 col-xl-4">
                            <div class="form-floating mb-3">
                                <input type="text" class="${triggerType === 'POST' ? 'form-control' : 'form-control-plaintext'}" id="manage-customer-motherName" name="motherName" placeholder="motherName" required ${triggerType === 'UPDATE' ? `value="${customerData?.motherName}" readonly` : ''}>
                                <label for="manage-customer-motherName">Nome da Mãe (*)</label>
                            </div>
                        </div>

                        <div class="col-12 col-xl-4">
                            <div class="form-floating mb-3">
                                <input type="text" class="${triggerType === 'POST' ? 'form-control' : 'form-control-plaintext'}" id="manage-customer-observation" name="observation" placeholder="observation" ${triggerType === 'UPDATE' ? `value="${customerData?.observation}" readonly` : ''}>
                                <label for="manage-customer-observation">Observação</label>
                            </div>
                        </div>
                    </div>

                    <h3 class="modal-title fs-5 mb-3">Endereço</h3>

                    <div class="row">
                        <div class="col-12 col-sm-3 col-md-3">
                            <div class="form-floating mb-3">
                                <input type="text" class="${triggerType === 'POST' ? 'form-control' : 'form-control-plaintext'} cep" id="manage-customer-address-cep" name="cep" placeholder="cep" required ${triggerType === 'UPDATE' ? `value="${customerData?.address?.cep}" readonly` : ''}>
                                <label for="manage-customer-address-cep">CEP (*)</label>
                            </div>
                        </div>

                        <div class="col-12 col-sm-9 col-md-9">
                            <div class="form-floating mb-3">
                                <input type="text" class="${triggerType === 'POST' ? 'form-control' : 'form-control-plaintext'} street" id="manage-customer-address-street" name="street" placeholder="street" required ${triggerType === 'UPDATE' ? `value="${customerData?.address?.street}" readonly` : ''}>
                                <label for="manage-customer-address-street">Logradouro (*)</label>
                            </div>
                        </div>

                        <div class="col-12 col-sm-3 col-md-3">
                            <div class="form-floating mb-3">
                                <input type="number" class="${triggerType === 'POST' ? 'form-control' : 'form-control-plaintext'} address-number" id="manage-customer-address-number" name="addressNumber" placeholder="addressNumber" required ${triggerType === 'UPDATE' ? `value="${customerData?.address?.number}" readonly` : ''}>
                                <label for="manage-customer-address-number">Número (*)</label>
                            </div>
                        </div>

                        <div class="col-12 col-sm-9 col-md-9">
                            <div class="form-floating mb-3">
                                <input type="text" class="${triggerType === 'POST' ? 'form-control' : 'form-control-plaintext'} address-complement" id="manage-customer-address-complement" name="complement" placeholder="addresComplement" ${triggerType === 'UPDATE' ? `value="${customerData?.address?.complement}" readonly` : ''}>
                                <label for="manage-customer-address-complement">Complemento</label>
                            </div>
                        </div>

                        <div class="col-12 col-md-5 col-lg-5">
                            <div class="form-floating mb-3">
                                <input type="text" class="${triggerType === 'POST' ? 'form-control' : 'form-control-plaintext'} district" id="manage-customer-address-district" name="district" placeholder="district" required ${triggerType === 'UPDATE' ? `value="${customerData?.address?.district}" readonly` : ''}>
                                <label for="manage-customer-address-district">Bairro (*)</label>
                            </div>
                        </div>

                        <div class="col-12 col-sm-8 col-md-4 col-lg-5">
                            <div class="form-floating mb-3">
                                <input type="text" class="${triggerType === 'POST' ? 'form-control' : 'form-control-plaintext'} city" id="manage-customer-address-city" name="city" placeholder="city" required ${triggerType === 'UPDATE' ? `value="${customerData?.address?.city}" readonly` : ''}>
                                <label for="manage-customer-address-city">Cidade (*)</label>
                            </div>
                        </div>

                        <div class="col-12 col-sm-4 col-md-3 col-lg-2">
                            <div class="form-floating mb-3">
                                <select class="form-select state" id="manage-customer-address-state" name="addressState" required ${triggerType === 'UPDATE' ? 'disabled' : ''}>
                                    ${triggerType === 'POST' ? '<option selected disabled>Selecione</option>' : ''}
                                    <option value="AC" ${triggerType === 'UPDATE' && customerData?.address?.state === 'AC' ? 'selected' : ''}>Acre</option>
                                    <option value="AL" ${triggerType === 'UPDATE' && customerData?.address?.state === 'AL' ? 'selected' : ''}>Alagoas</option>
                                    <option value="AP" ${triggerType === 'UPDATE' && customerData?.address?.state === 'AP' ? 'selected' : ''}>Amapá</option>
                                    <option value="AM" ${triggerType === 'UPDATE' && customerData?.address?.state === 'AM' ? 'selected' : ''}>Amazonas</option>
                                    <option value="BA" ${triggerType === 'UPDATE' && customerData?.address?.state === 'BA' ? 'selected' : ''}>Bahia</option>
                                    <option value="CE" ${triggerType === 'UPDATE' && customerData?.address?.state === 'CE' ? 'selected' : ''}>Ceará</option>
                                    <option value="DF" ${triggerType === 'UPDATE' && customerData?.address?.state === 'DF' ? 'selected' : ''}>Distrito Federal</option>
                                    <option value="ES" ${triggerType === 'UPDATE' && customerData?.address?.state === 'ES' ? 'selected' : ''}>Espírito Santo</option>
                                    <option value="GO" ${triggerType === 'UPDATE' && customerData?.address?.state === 'GO' ? 'selected' : ''}>Goiás</option>
                                    <option value="MA" ${triggerType === 'UPDATE' && customerData?.address?.state === 'MA' ? 'selected' : ''}>Maranhão</option>
                                    <option value="MT" ${triggerType === 'UPDATE' && customerData?.address?.state === 'MT' ? 'selected' : ''}>Mato Grosso</option>
                                    <option value="MS" ${triggerType === 'UPDATE' && customerData?.address?.state === 'MS' ? 'selected' : ''}>Mato Grosso do Sul</option>
                                    <option value="MG" ${triggerType === 'UPDATE' && customerData?.address?.state === 'MG' ? 'selected' : ''}>Minas Gerais</option>
                                    <option value="PA" ${triggerType === 'UPDATE' && customerData?.address?.state === 'PA' ? 'selected' : ''}>Pará</option>
                                    <option value="PB" ${triggerType === 'UPDATE' && customerData?.address?.state === 'PB' ? 'selected' : ''}>Paraíba</option>
                                    <option value="PR" ${triggerType === 'UPDATE' && customerData?.address?.state === 'PR' ? 'selected' : ''}>Paraná</option>
                                    <option value="PE" ${triggerType === 'UPDATE' && customerData?.address?.state === 'PE' ? 'selected' : ''}>Pernambuco</option>
                                    <option value="PI" ${triggerType === 'UPDATE' && customerData?.address?.state === 'PI' ? 'selected' : ''}>Piauí</option>
                                    <option value="RJ" ${triggerType === 'UPDATE' && customerData?.address?.state === 'RJ' ? 'selected' : ''}>Rio de Janeiro</option>
                                    <option value="RN" ${triggerType === 'UPDATE' && customerData?.address?.state === 'RN' ? 'selected' : ''}>Rio Grande do Norte</option>
                                    <option value="RS" ${triggerType === 'UPDATE' && customerData?.address?.state === 'RS' ? 'selected' : ''}>Rio Grande do Sul</option>
                                    <option value="RO" ${triggerType === 'UPDATE' && customerData?.address?.state === 'RO' ? 'selected' : ''}>Rondônia</option>
                                    <option value="RR" ${triggerType === 'UPDATE' && customerData?.address?.state === 'RR' ? 'selected' : ''}>Roraima</option>
                                    <option value="SC" ${triggerType === 'UPDATE' && customerData?.address?.state === 'SC' ? 'selected' : ''}>Santa Catarina</option>
                                    <option value="SP" ${triggerType === 'UPDATE' && customerData?.address?.state === 'SP' ? 'selected' : ''}>São Paulo</option>
                                    <option value="SE" ${triggerType === 'UPDATE' && customerData?.address?.state === 'SE' ? 'selected' : ''}>Sergipe</option>
                                    <option value="TO" ${triggerType === 'UPDATE' && customerData?.address?.state === 'TO' ? 'selected' : ''}>Tocantins</option>
                                </select>
                                <label for="manage-customer-address-state">Estado (*)</label>
                            </div>
                        </div>
                    </div>

                    <h3 class="modal-title fs-5 mb-3">Carteira de Identidade Nacional</h3>

                    <div class="row">
                        <div class="col-12 col-sm-6 col-lg-3">
                            <div class="form-floating mb-3">
                                <input type="text" class="${triggerType === 'POST' ? 'form-control' : 'form-control-plaintext'}" id="manage-customer-rg-number" name="rgNumber" placeholder="rgNumber" required ${triggerType === 'UPDATE' ? `value="${customerData?.rg?.number}" readonly` : ''}>
                                <label for="manage-customer-rg-number">RG (*)</label>
                            </div>
                        </div>

                        <div class="col-12 col-sm-6 col-lg-3">
                            <div class="form-floating mb-3">
                                <input type="text" class="${triggerType === 'POST' ? 'form-control' : 'form-control-plaintext'}" id="manage-customer-rg-issuingBody" name="rgIssuingBody" placeholder="issuingBody" required ${triggerType === 'UPDATE' ? `value="${customerData?.rg?.issuingBody}" readonly` : ''}>
                                <label for="manage-customer-rg-issuingBody">Órgão de emissão do RG (*)</label>
                            </div>
                        </div>

                        <div class="col-12 col-sm-6 col-lg-3">
                            <div class="form-floating mb-3">
                                <input type="date" class="${triggerType === 'POST' ? 'form-control' : 'form-control-plaintext'}" id="manage-customer-rg-issuingDate" name="issuingDate" placeholder="issuingDate" required ${triggerType === 'UPDATE' ? `value="${formatField('date', customerData?.rg?.issuingDate)}" readonly` : ''}>
                                <label for="manage-customer-rg-issuingDate">Data de emissão do RG (*)</label>
                            </div>
                        </div>

                        <div class="col-12 col-sm-6 col-lg-3">
                            <div class="form-floating mb-3">
                                <select class="form-select state" id="manage-customer-rg-state" name="rgState" required ${triggerType === 'UPDATE' ? 'disabled' : ''}>
                                    ${triggerType === 'POST' ? '<option selected disabled>Selecione</option>' : ''}
                                    <option value="AC" ${triggerType === 'UPDATE' && customerData?.rg?.state === 'AC' ? 'selected' : ''}>Acre</option>
                                    <option value="AL" ${triggerType === 'UPDATE' && customerData?.rg?.state === 'AL' ? 'selected' : ''}>Alagoas</option>
                                    <option value="AP" ${triggerType === 'UPDATE' && customerData?.rg?.state === 'AP' ? 'selected' : ''}>Amapá</option>
                                    <option value="AM" ${triggerType === 'UPDATE' && customerData?.rg?.state === 'AM' ? 'selected' : ''}>Amazonas</option>
                                    <option value="BA" ${triggerType === 'UPDATE' && customerData?.rg?.state === 'BA' ? 'selected' : ''}>Bahia</option>
                                    <option value="CE" ${triggerType === 'UPDATE' && customerData?.rg?.state === 'CE' ? 'selected' : ''}>Ceará</option>
                                    <option value="DF" ${triggerType === 'UPDATE' && customerData?.rg?.state === 'DF' ? 'selected' : ''}>Distrito Federal</option>
                                    <option value="ES" ${triggerType === 'UPDATE' && customerData?.rg?.state === 'ES' ? 'selected' : ''}>Espírito Santo</option>
                                    <option value="GO" ${triggerType === 'UPDATE' && customerData?.rg?.state === 'GO' ? 'selected' : ''}>Goiás</option>
                                    <option value="MA" ${triggerType === 'UPDATE' && customerData?.rg?.state === 'MA' ? 'selected' : ''}>Maranhão</option>
                                    <option value="MT" ${triggerType === 'UPDATE' && customerData?.rg?.state === 'MT' ? 'selected' : ''}>Mato Grosso</option>
                                    <option value="MS" ${triggerType === 'UPDATE' && customerData?.rg?.state === 'MS' ? 'selected' : ''}>Mato Grosso do Sul</option>
                                    <option value="MG" ${triggerType === 'UPDATE' && customerData?.rg?.state === 'MG' ? 'selected' : ''}>Minas Gerais</option>
                                    <option value="PA" ${triggerType === 'UPDATE' && customerData?.rg?.state === 'PA' ? 'selected' : ''}>Pará</option>
                                    <option value="PB" ${triggerType === 'UPDATE' && customerData?.rg?.state === 'PB' ? 'selected' : ''}>Paraíba</option>
                                    <option value="PR" ${triggerType === 'UPDATE' && customerData?.rg?.state === 'PR' ? 'selected' : ''}>Paraná</option>
                                    <option value="PE" ${triggerType === 'UPDATE' && customerData?.rg?.state === 'PE' ? 'selected' : ''}>Pernambuco</option>
                                    <option value="PI" ${triggerType === 'UPDATE' && customerData?.rg?.state === 'PI' ? 'selected' : ''}>Piauí</option>
                                    <option value="RJ" ${triggerType === 'UPDATE' && customerData?.rg?.state === 'RJ' ? 'selected' : ''}>Rio de Janeiro</option>
                                    <option value="RN" ${triggerType === 'UPDATE' && customerData?.rg?.state === 'RN' ? 'selected' : ''}>Rio Grande do Norte</option>
                                    <option value="RS" ${triggerType === 'UPDATE' && customerData?.rg?.state === 'RS' ? 'selected' : ''}>Rio Grande do Sul</option>
                                    <option value="RO" ${triggerType === 'UPDATE' && customerData?.rg?.state === 'RO' ? 'selected' : ''}>Rondônia</option>
                                    <option value="RR" ${triggerType === 'UPDATE' && customerData?.rg?.state === 'RR' ? 'selected' : ''}>Roraima</option>
                                    <option value="SC" ${triggerType === 'UPDATE' && customerData?.rg?.state === 'SC' ? 'selected' : ''}>Santa Catarina</option>
                                    <option value="SP" ${triggerType === 'UPDATE' && customerData?.rg?.state === 'SP' ? 'selected' : ''}>São Paulo</option>
                                    <option value="SE" ${triggerType === 'UPDATE' && customerData?.rg?.state === 'SE' ? 'selected' : ''}>Sergipe</option>
                                    <option value="TO" ${triggerType === 'UPDATE' && customerData?.rg?.state === 'TO' ? 'selected' : ''}>Tocantins</option>
                                </select>
                                <label for="manage-customer-rg-state">Estado (*)</label>
                            </div>
                        </div>
                    </div>

                    <h3 class="modal-title fs-5 mb-3">Carteira Nacional de Habilitação</h3>

                    <div class="row">
                        <div class="col-12 col-sm-5 col-lg-4 col-xl-2">
                            <div class="form-floating mb-3">
                                <input type="text" class="${triggerType === 'POST' ? 'form-control' : 'form-control-plaintext'} cnh" id="manage-customer-driverLicense-number" name="driverLicenseNumber" placeholder="driverLicenseNumber" required ${triggerType === 'UPDATE' ? `value="${customerData?.driverLicense?.number}" readonly` : ''}>
                                <label for="manage-customer-driverLicense-number">CNH (*)</label>
                            </div>
                        </div>

                        <div class="col-12 col-sm-7 col-lg-8 col-xl-3">
                            <div class="form-floating mb-3">
                                <input type="text" class="${triggerType === 'POST' ? 'form-control' : 'form-control-plaintext'}" id="manage-customer-driverLicense-issuingBody" name="driverLicenseIssuingBody" placeholder="driverLicenseIssuingBody" required ${triggerType === 'UPDATE' ? `value="${customerData?.driverLicense?.issuingBody}" readonly` : ''}>
                                <label for="manage-customer-driverLicense-issuingBody">Órgão de emissão da CNH (*)</label>
                            </div>
                        </div>

                        <div class="col-12 col-sm-6 col-lg-4 col-xl-2">
                            <div class="form-floating mb-3">
                                <input type="date" class="${triggerType === 'POST' ? 'form-control' : 'form-control-plaintext'}" id="manage-customer-driverLicense-expirationDate" name="expirationDate" placeholder="driverLicenseExpirationDate" required ${triggerType === 'UPDATE' ? `value="${formatField('date', customerData?.driverLicense?.expirationDate)}" readonly` : ''}>
                                <label for="manage-customer-driverLicense-expirationDate">Data de validade da CNH (*)</label>
                            </div>
                        </div>

                        <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
                            <div class="form-floating mb-3">
                                <input type="date" class="${triggerType === 'POST' ? 'form-control' : 'form-control-plaintext'}" id="manage-customer-driverLicense-firstDate" name="firstDate" placeholder="driverLicenseFirstDate" required ${triggerType === 'UPDATE' ? `value="${formatField('date', customerData?.driverLicense?.firstDate)}" readonly` : ''}>
                                <label for="manage-customer-driverLicense-firstDate">Data da 1º habilitação da CNH (*)</label>
                            </div>
                        </div>

                        <div class="col-12 col-sm-12 col-lg-4 col-xl-2">
                            <div class="form-floating mb-3">
                                <select class="form-select" id="manage-customer-driverLicense-category" name="category" required ${triggerType === 'UPDATE' ? 'disabled' : ''}>
                                    ${triggerType === 'POST' ? '<option selected disabled>Selecione</option>' : ''}
                                    <option value="A" ${triggerType === 'UPDATE' && customerData?.driverLicense?.status === 'A' ? 'selected' : ''}>A</option>
                                    <option value="B" ${triggerType === 'UPDATE' && customerData?.driverLicense?.status === 'B' ? 'selected' : ''}>B</option>
                                    <option value="C" ${triggerType === 'UPDATE' && customerData?.driverLicense?.status === 'C' ? 'selected' : ''}>C</option>
                                    <option value="D" ${triggerType === 'UPDATE' && customerData?.driverLicense?.status === 'D' ? 'selected' : ''}>D</option>
                                    <option value="E" ${triggerType === 'UPDATE' && customerData?.driverLicense?.status === 'E' ? 'selected' : ''}>E</option>
                                </select>
                                <label for="manage-customer-driverLicense-category">Categoria (*)</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="dismissModalAndCancelEdit">Fechar</button>
                <button type="${triggerType === 'POST' ? 'submit' : 'button'}" class="btn ${triggerType === 'POST' ? 'btn-success' : 'btn-primary'}" id="toggleModeAndSubmitCustomer">${triggerType === 'POST' ? 'Cadastrar' : 'Editar'}</button>
            </div>
        </form>
    `);

    loadMasks();

    $("#manage-customer .cep").focusout(function () {
        cepSearch($(this));
    });

    //cepSearch($("#manage-customer-address-cep"));

    /* customersAndCompanies = await fetchCustomersAndCompanies();
    vehicles = await fetchVehicles();

    autocomplete(document.getElementById('manage-customerCompany'), customersAndCompanies);
    autocomplete(document.getElementById('manage-vehicle'), vehicles); */

    const toggleSubmitButton = document.getElementById('toggleModeAndSubmitCustomer');
    const dismissCancelButton = document.getElementById('dismissModalAndCancelEdit');
    let editMode = false;

    toggleSubmitButton.addEventListener('click', (e) => {
        if (!editMode && triggerType === 'UPDATE') {
            e.preventDefault();
            enterEditMode();
        }
    });

    dismissCancelButton.addEventListener('click', () => {
        if (editMode) exitEditMode();
    });

    function enterEditMode() {
        $('#manageCustomerLabel').text('Editar Cliente Pessoa Física');
        $('#dismissModalAndCancelEdit').removeAttr('data-bs-dismiss');
        $('#dismissModalAndCancelEdit').text('Voltar para detalhes');

        $('#manage-customer input').removeAttr('readonly');
        $('#manage-customer-email').attr('disabled', true);
        $('#manage-customer-cpf').attr('disabled', true);
        $('#manage-customer input').removeClass('form-control-plaintext').addClass('form-control');
        $('#toggleModeAndSubmitCustomer').text('Salvar').removeClass('btn-primary').addClass('btn-success');
        $('#toggleModeAndSubmitCustomer').attr('type', 'submit');

        editMode = true;
    }

    function exitEditMode() {
        $('#manageCustomerLabel').text('Detalhes de Cliente Pessoa Física');
        $('#dismissModalAndCancelEdit').attr('data-bs-dismiss', 'modal');
        $('#dismissModalAndCancelEdit').text('Cancelar');

        $('#manage-customer input').attr('readonly', true);
        $('#manage-customer-email').removeAttr('disabled');
        $('#manage-customer-cpf').removeAttr('disabled');
        $('#manage-customer input').removeClass('form-control').addClass('form-control-plaintext');
        $('#toggleModeAndSubmitCustomer').text('Editar').removeClass('btn-success').addClass('btn-primary');
        $('#toggleModeAndSubmitCustomer').attr('type', 'button');

        editMode = false;
    }
});

const deleteCustomerModal = $('#deleteCustomer');
deleteCustomerModal.on('show.bs.modal', event => {
    const customerData = JSON.parse(event.relatedTarget.getAttribute('data-bs-customer').replace(/&quot;/g, '"').replace(/&apos;/g, "'"));
    $('#deleteCustomerContent').html(`
        <div class="modal-header">
            <h5 class="modal-title" id="deleteCustomerModalLabel">Deletar Cliente</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <form id="confirm-delete-customer-form" class="d-flex flex-column gap-3" method="DELETE">
            <div class="modal-body">
                <input id="customerToDelete" type="hidden" name="customerToDelete" value="${customerData?.id}" />
                <p>Tem certeza que deseja deletar o cliente <strong>${customerData?.name}</strong>? Esta ação é irreversível.</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button id="confirm-delete-customer" type="submit" class="btn btn-danger">Confirmar</button>
            </div>
        </form>
    `);
});