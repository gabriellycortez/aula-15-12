// Sistema de Auto-save com LocalStorage

// Elementos do DOM
const textInput = document.getElementById('textInput');
const charCount = document.getElementById('charCount');
const saveStatus = document.getElementById('saveStatus');
const saveIcon = document.getElementById('saveIcon');
const clearBtn = document.getElementById('clearBtn');

// Chaves para o localStorage
const DRAFT_KEY = 'rascunho';
const COUNT_KEY = 'contador';

// Tempo para mostrar o status de salvamento (em ms)
const SAVE_NOTIFICATION_TIME = 1500;

// Tempo para debounce (evitar salvamentos excessivos)
let saveTimeout;
const DEBOUNCE_TIME = 500;

// Inicialização: recuperar dados salvos ao carregar a página
function loadSavedData() {
    const savedText = localStorage.getItem(DRAFT_KEY);
    const savedCount = localStorage.getItem(COUNT_KEY);
    
    if (savedText) {
        textInput.value = savedText;
        updateCharCount();
        showSaveStatus('Texto recuperado com sucesso!', true);
    } else {
        updateCharCount();
    }
}

// Atualizar contador de caracteres
function updateCharCount() {
    const count = textInput.value.length;
    charCount.textContent = count;
    
    // Salvar contador no localStorage
    localStorage.setItem(COUNT_KEY, count.toString());
}

// Mostrar status de salvamento
function showSaveStatus(message, isSaved = false) {
    saveStatus.textContent = message;
    
    if (isSaved) {
        saveIcon.classList.add('saved');
        
        // Remover a classe após o tempo definido
        setTimeout(() => {
            saveIcon.classList.remove('saved');
            saveStatus.textContent = 'Pronto para salvar';
        }, SAVE_NOTIFICATION_TIME);
    } else {
        saveIcon.classList.remove('saved');
    }
}

// Salvar texto no localStorage
function saveToLocalStorage() {
    const text = textInput.value;
    localStorage.setItem(DRAFT_KEY, text);
    
    updateCharCount();
    showSaveStatus('Texto salvo automaticamente!', true);
}

// Limpar rascunho
function clearDraft() {
    if (confirm('Tem certeza que deseja limpar o rascunho? Esta ação não pode ser desfeita.')) {
        // Remover do localStorage
        localStorage.removeItem(DRAFT_KEY);
        localStorage.removeItem(COUNT_KEY);
        
        // Limpar o campo de texto
        textInput.value = '';
        
        // Atualizar o contador
        updateCharCount();
        
        // Mostrar mensagem
        showSaveStatus('Rascunho removido com sucesso!', false);
        
        // Dar foco ao campo de texto
        textInput.focus();
    }
}

// Configurar eventos
function setupEventListeners() {
    // Evento input para salvar automaticamente com debounce
    textInput.addEventListener('input', () => {
        // Atualizar contador imediatamente
        updateCharCount();
        
        // Mostrar status de salvamento em andamento
        showSaveStatus('Salvando...', false);
        
        // Limpar timeout anterior (debounce)
        clearTimeout(saveTimeout);
        
        // Configurar novo timeout para salvar
        saveTimeout = setTimeout(() => {
            saveToLocalStorage();
        }, DEBOUNCE_TIME);
    });
    
    // Evento para o botão limpar
    clearBtn.addEventListener('click', clearDraft);
    
    // Evento para teclas de atalho
    document.addEventListener('keydown', (e) => {
        // Ctrl + L para limpar (com foco no textarea)
        if ((e.ctrlKey || e.metaKey) && e.key === 'l' && document.activeElement === textInput) {
            e.preventDefault();
            clearDraft();
        }
        
        // Ctrl + S para forçar salvamento (com foco no textarea)
        if ((e.ctrlKey || e.metaKey) && e.key === 's' && document.activeElement === textInput) {
            e.preventDefault();
            saveToLocalStorage();
        }
    });
}

// Inicializar a aplicação
function init() {
    loadSavedData();
    setupEventListeners();
    
    // Focar no campo de texto ao carregar
    textInput.focus();
}

// Iniciar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', init);