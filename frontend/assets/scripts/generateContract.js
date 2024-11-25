export async function generateContract(contractData) {
    try {
        const response = await fetch('http://localhost:3000/contracts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contractData)
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `contrato_${contractData.nomeCliente.replace(/\s+/g, '_')}.docx`;
            document.body.appendChild(link);
            link.click();
            link.remove();
        } else {
            console.error('Erro ao gerar contrato:', response.statusText);
        }
    } catch (error) {
        console.error('Erro ao gerar contrato:', error);
    }
}