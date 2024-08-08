const database = firebase.database();

document.addEventListener('DOMContentLoaded', async () => {
    const produtosContainer = document.getElementById('produtos_container');

    try {
        // Recuperar produtos do Firebase
        const snapshot = await database.ref('produtos/').once('value');
        const produtos = snapshot.val();

        if (produtos) {
            // Iterar sobre os produtos e adicioná-los à página
            for (let id in produtos) {
                const produto = produtos[id];

                const produtoDiv = document.createElement('div');
                produtoDiv.className = 'produto';

                produtoDiv.innerHTML = `
                    <h3>${produto.nome}</h3>
                    <p>Preço: R$ ${produto.preco}</p>
                    <p>Quantidade: ${produto.quantidade}</p>
                `;

                produtosContainer.appendChild(produtoDiv);
            }
        } else {
            produtosContainer.textContent = 'Nenhum produto disponível no momento.';
        }
    } catch (erro) {
        produtosContainer.textContent = `Erro ao carregar produtos: ${erro.message}`;
    }
});
