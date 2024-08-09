import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, query, orderByChild, equalTo, get } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAg-RWgF-TV3coO9K7CJuL7BSeZMDW07is",
    authDomain: "farmacia-simples-b7609.firebaseapp.com",
    projectId: "farmacia-simples-b7609",
    storageBucket: "farmacia-simples-b7609.appspot.com",
    messagingSenderId: "763735650123",
    appId: "1:763735650123:web:1a9fa17ea236458aa142ce",
    measurementId: "G-QZJSEJCV18"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('btnBuscar').addEventListener('click', buscarRemedio);
});

async function buscarRemedio() {
    const nomeBusca = document.getElementById('nomeBusca').value.trim().toLowerCase();
    const resultado = document.getElementById('resultado');
    resultado.textContent = '';

    if (nomeBusca) {
        try {
            const remediosRef = ref(db, 'remedios');
            const q = query(remediosRef, orderByChild('nome'), equalTo(nomeBusca));
            const snapshot = await get(q);

            if (snapshot.exists()) {
                snapshot.forEach(childSnapshot => {
                    const remedio = childSnapshot.val();
                    resultado.textContent = `Nome: ${remedio.nome}, Medida: ${remedio.medida}, Quantidade: ${remedio.quantidade}`;
                });
            } else {
                resultado.textContent = 'Remédio não disponível no estoque.';
            }
        } catch (error) {
            console.error('Erro ao buscar remédio:', error);
            resultado.textContent = 'Erro ao buscar remédio.';
        }
    } else {
        resultado.textContent = 'Por favor, digite o nome do remédio.';
    }
}



