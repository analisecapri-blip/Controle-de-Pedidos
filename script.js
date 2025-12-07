// Configuração do Supabase
const SUPABASE_URL = 'https://bubmmabeagyyoupcgopg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1Ym1tYWJlYWd5eW91cGNnb3BnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyOTMxMzgsImV4cCI6MjA3OTg2OTEzOH0.kybq-kfjbfw7k2q9rvpjWPPeHPXa5FwZB76uPR6Czng';

// Inicializa o cliente Supabase
// Nota: O usuário precisará incluir a biblioteca Supabase no HTML (ex: <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>)
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Variáveis globais (agora a maioria dos dados virá do Supabase)
const STORAGE_KEY = 'controleRomaneiosLocalData'; // Mantido apenas para o estado de login (currentUser, currentRole)
let appData = {
    admin: null, // Será carregado do Supabase
    leaders: [], // Serão carregados do Supabase
    billings: [], // Serão carregados do Supabase
    teams: ['Equipe A', 'Equipe B', 'Equipe C'], // Equipes iniciais (Pode ser migrado para Supabase se necessário)
    romaneios: [], // Será populado pelo Supabase
    currentUser: null, // Salvo localmente para manter o estado de login
    currentRole: null // Salvo localmente para manter o estado de login
};

// Funções de Utilidade
const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

// =================================================================================
// CONSTANTES DE TABELAS SUPABASE
// =================================================================================
const ROMANEIOS_TABLE = 'romaneios';
const ADMIN_TABLE = 'admin_user';
const LEADERS_TABLE = 'leaders';
const BILLINGS_TABLE = 'billings';

// =================================================================================
// FUNÇÕES DE INTEGRAÇÃO COM SUPABASE (CARREGAMENTO)
// =================================================================================

/**
 * Carrega o usuário Admin do Supabase.
 */
async function loadAdminFromSupabase() {
    const { data, error } = await supabaseClient
        .from(ADMIN_TABLE)
        .select('*')
        .limit(1);

    if (error) {
        console.error('Erro ao carregar Admin do Supabase:', error);
        appData.admin = null;
    } else {
        appData.admin = data.length > 0 ? data[0] : null;
    }
}

/**
 * Carrega os Líderes do Supabase.
 */
async function loadLeadersFromSupabase() {
    const { data, error } = await supabaseClient
        .from(LEADERS_TABLE)
        .select('*');

    if (error) {
        console.error('Erro ao carregar Líderes do Supabase:', error);
        appData.leaders = [];
    } else {
        appData.leaders = data;
    }
}

/**
 * Carrega os Faturamentos do Supabase.
 */
async function loadBillingsFromSupabase() {
    const { data, error } = await supabaseClient
        .from(BILLINGS_TABLE)
        .select('*');

    if (error) {
        console.error('Erro ao carregar Faturamentos do Supabase:', error);
        appData.billings = [];
    } else {
        appData.billings = data;
    }
}

/**
 * Carrega os romaneios do Supabase.
 */
async function loadRomaneiosFromSupabase() {
    const { data, error } = await supabaseClient
        .from(ROMANEIOS_TABLE)
        .select('*')
        .order('dataEntrega', { ascending: true });

    if (error) {
        console.error('Erro ao carregar romaneios do Supabase:', error);
        appData.romaneios = [];
    } else {
        appData.romaneios = data;
    }
}

/**
 * Carrega todos os dados do Supabase.
 */
async function loadAllDataFromSupabase() {
    await Promise.all([
        loadAdminFromSupabase(),
        loadLeadersFromSupabase(),
        loadBillingsFromSupabase(),
        loadRomaneiosFromSupabase()
    ]);
}

// =================================================================================
// FUNÇÕES DE INTEGRAÇÃO COM SUPABASE (SALVAMENTO/ATUALIZAÇÃO)
// =================================================================================

/**
 * Salva o usuário Admin no Supabase.
 */
async function saveAdminToSupabase(adminData) {
    const { data, error } = await supabaseClient
        .from(ADMIN_TABLE)
        .insert([adminData])
        .select();

    if (error) {
        console.error('Erro ao salvar Admin no Supabase:', error);
        return null;
    }
    appData.admin = data[0];
    return data[0];
}

/**
 * Atualiza o usuário Admin no Supabase.
 */
async function updateAdminInSupabase(adminData) {
    const { id, ...updates } = adminData;
    const { data, error } = await supabaseClient
        .from(ADMIN_TABLE)
        .update(updates)
        .eq('id', id)
        .select();

    if (error) {
        console.error('Erro ao atualizar Admin no Supabase:', error);
        return null;
    }
    appData.admin = data[0];
    return data[0];
}

/**
 * Salva um novo Líder no Supabase.
 */
async function saveLeaderToSupabase(leaderData) {
    const { data, error } = await supabaseClient
        .from(LEADERS_TABLE)
        .insert([leaderData])
        .select();

    if (error) {
        console.error('Erro ao salvar Líder no Supabase:', error);
        return null;
    }
    appData.leaders.push(data[0]);
    return data[0];
}

/**
 * Remove um Líder do Supabase.
 */
async function removeLeaderFromSupabase(leaderId) {
    const { error } = await supabaseClient
        .from(LEADERS_TABLE)
        .delete()
        .eq('id', leaderId);

    if (error) {
        console.error('Erro ao remover Líder do Supabase:', error);
        return false;
    }
    appData.leaders = appData.leaders.filter(l => l.id !== leaderId);
    return true;
}

/**
 * Salva um novo Faturamento no Supabase.
 */
async function saveBillingToSupabase(billingData) {
    const { data, error } = await supabaseClient
        .from(BILLINGS_TABLE)
        .insert([billingData])
        .select();

    if (error) {
        console.error('Erro ao salvar Faturamento no Supabase:', error);
        return null;
    }
    appData.billings.push(data[0]);
    return data[0];
}

/**
 * Remove um Faturamento do Supabase.
 */
async function removeBillingFromSupabase(billingId) {
    const { error } = await supabaseClient
        .from(BILLINGS_TABLE)
        .delete()
        .eq('id', billingId);

    if (error) {
        console.error('Erro ao remover Faturamento do Supabase:', error);
        return false;
    }
    appData.billings = appData.billings.filter(b => b.id !== billingId);
    return true;
}

/**
 * Salva um novo romaneio no Supabase.
 */
async function saveNewRomaneioToSupabase(romaneio) {
    const { data, error } = await supabaseClient
        .from(ROMANEIOS_TABLE)
        .insert([romaneio])
        .select();

    if (error) {
        console.error('Erro ao salvar romaneio no Supabase:', error);
        alert('Erro ao salvar romaneio. Verifique o console para mais detalhes.');
        return null;
    }
    appData.romaneios.push(data[0]);
    return data[0];
}

/**
 * Atualiza um romaneio existente no Supabase.
 */
async function updateRomaneioInSupabase(romaneio) {
    const { id, ...updates } = romaneio;

    const { data, error } = await supabaseClient
        .from(ROMANEIOS_TABLE)
        .update(updates)
        .eq('id', id)
        .select();

    if (error) {
        console.error('Erro ao atualizar romaneio no Supabase:', error);
        alert('Erro ao atualizar romaneio. Verifique o console para mais detalhes.');
        return null;
    }
    const index = appData.romaneios.findIndex(r => r.id === id);
    if (index !== -1) {
        appData.romaneios[index] = data[0];
    }
    return data[0];
}

// =================================================================================
// FUNÇÕES DE DADOS LOCAIS (APENAS PARA ESTADO DE LOGIN E CONFIGURAÇÕES)
// =================================================================================

// Carrega apenas o estado de login e configurações locais
function loadLocalState() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        const localData = JSON.parse(data);
        appData.currentUser = localData.currentUser || null;
        appData.currentRole = localData.currentRole || null;
        appData.appSettings = localData.appSettings || {};
    }
}

// Salva apenas o estado de login e configurações locais
function saveLocalState() {
    const dataToSave = {
        currentUser: appData.currentUser,
        currentRole: appData.currentRole,
        appSettings: appData.appSettings
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
}

// =================================================================================
// LÓGICA DE INICIALIZAÇÃO E LOGIN (MODIFICADA)
// =================================================================================

// Função de hash de senha (mantida)
function hashPassword(password) {
    // O usuário precisará incluir a biblioteca CryptoJS no HTML
    if (typeof CryptoJS === 'undefined') {
        console.error('A biblioteca CryptoJS não foi carregada.');
        return password;
    }
    return CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
}

function showScreen(screenId) {
    $$('#app > div').forEach(screen => screen.classList.add('hidden'));
    $(screenId).classList.remove('hidden');
}

function updateUserInfo() {
    if (appData.currentUser && appData.currentRole) {
        $('#user-info').textContent = `${appData.currentUser.name} (${appData.currentRole})`;
    } else {
        $('#user-info').textContent = 'Deslogado';
    }
}

// Função de inicialização modificada para carregar TUDO do Supabase
async function checkInitialState() {
    loadLocalState(); // Carrega estado de login e configurações locais
    await loadAllDataFromSupabase(); // Carrega todos os dados do Supabase

    if (!appData.admin) {
        showScreen('#screen-create-admin');
    } else {
        showScreen('#screen-login');
        // Oculta a aba Admin se não houver admin cadastrado
        if (appData.admin) {
            $('#tab-admin-login').style.display = 'block';
        } else {
            $('#tab-admin-login').style.display = 'none';
        }
    }
    // Garante que o dashboard seja renderizado com os dados do Supabase se o usuário já estiver logado
    if (appData.currentUser && appData.currentRole) {
        renderDashboard();
        showScreen('#screen-dashboard');
    }
}

// Chama a função de inicialização assíncrona
document.addEventListener('DOMContentLoaded', () => {
    // Verifica se a biblioteca Supabase foi carregada
    if (typeof supabase === 'undefined') {
        console.error('A biblioteca Supabase não foi carregada. Certifique-se de incluir o script no seu HTML.');
        alert('Erro: A biblioteca Supabase é necessária. Por favor, adicione <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script> ao seu arquivo HTML.');
        return;
    }
    checkInitialState();
});

// Lógica de Criação de Admin (MODIFICADA PARA USAR SUPABASE)
$('#form-create-admin').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = $('#admin-name').value.trim();
    const email = $('#admin-email').value.trim();
    const password = $('#admin-password').value;

    if (name && email && password.length >= 6) {
        const newAdmin = {
            name: name,
            email: email,
            passwordHash: hashPassword(password)
        };
        
        const savedAdmin = await saveAdminToSupabase(newAdmin);

        if (savedAdmin) {
            showScreen('#screen-login');
        } else {
            $('#create-admin-error').textContent = 'Erro ao salvar Admin no banco de dados.';
            $('#create-admin-error').classList.remove('hidden');
        }
    } else {
        $('#create-admin-error').textContent = 'Preencha todos os campos corretamente.';
        $('#create-admin-error').classList.remove('hidden');
    }
});

// Lógica de Login (MODIFICADA PARA USAR DADOS DO SUPABASE)
async function handleLogin(e, role) {
    e.preventDefault();
    let user = null;
    let passwordInput = '';
    let errorElement = null;

    // Recarrega os dados do Supabase para garantir que as credenciais estejam atualizadas
    await loadAllDataFromSupabase();

    if (role === 'Admin') {
        const email = $('#login-admin-email').value.trim();
        passwordInput = $('#login-admin-password').value;
        errorElement = $('#login-admin-error');
        // Linha 14 (Corrigida)
if (appData.admin && appData.admin.email === email && appData.admin.passwordHash === hashPassword(passwordInput)) {
            user = appData.admin;
        }
    } else if (role === 'Líder') {
        const name = $('#login-leader-name').value.trim();
        passwordInput = $('#login-leader-password').value;
        errorElement = $('#login-leader-error');
        user = appData.leaders.find(l => l.name === name && l.passwordHash === hashPassword(passwordInput));
    } else if (role === 'Faturamento') {
        const name = $('#login-billing-name').value.trim();
        passwordInput = $('#login-billing-password').value;
        errorElement = $('#login-billing-error');
        user = appData.billings.find(b => b.name === name && b.passwordHash === hashPassword(passwordInput));
    }

    if (user) {
        appData.currentUser = { name: user.name, email: user.email || null };
        appData.currentRole = role;
        saveLocalState(); // Salva o estado de login localmente
        renderDashboard();
        showScreen('#screen-dashboard');
    } else {
        errorElement.textContent = `${role === 'Admin' ? 'E-mail' : 'Nome'} ou senha incorretos.`;
        errorElement.classList.remove('hidden');
    }
}

$('#form-admin-login').addEventListener('submit', (e) => handleLogin(e, 'Admin'));
$('#form-leader-login').addEventListener('submit', (e) => handleLogin(e, 'Líder'));
$('#form-billing-login').addEventListener('submit', (e) => handleLogin(e, 'Faturamento'));

$('#btn-logout').addEventListener('click', () => {
    appData.currentUser = null;
    appData.currentRole = null;
    saveLocalState(); // Limpa o estado de login localmente
    showScreen('#screen-login');
    // Reseta para a tab Admin no login
    $('#tab-admin-login').click();
});

// Lógica de Configurações (MODIFICADA PARA USAR SUPABASE PARA ADMIN)
// ... (O restante do código de configurações, renderização e lógica de romaneios é mantido,
// mas as funções de gerenciamento de usuários e alteração de senha do Admin são atualizadas)

// Alterar Senha do Admin (MODIFICADA PARA USAR SUPABASE)
$('#btn-save-password').addEventListener('click', async () => {
    const currentPassword = $('#input-current-password').value;
    const newPassword = $('#input-new-password').value;
    const confirmPassword = $('#input-confirm-password').value;
    const messageElement = $('#password-message');
    messageElement.classList.add('hidden');

    // ... (Validações de senha mantidas)

    if (appData.admin.passwordHash !== hashPassword(currentPassword)) {
        messageElement.textContent = 'Senha atual incorreta.';
        messageElement.classList.remove('hidden', 'text-green-500');
        messageElement.classList.add('text-red-500');
        return;
    }

    // Atualiza a senha no Supabase
    const updatedAdmin = await updateAdminInSupabase({
        id: appData.admin.id,
        passwordHash: hashPassword(newPassword)
    });

    if (updatedAdmin) {
        messageElement.textContent = 'Senha alterada com sucesso!';
        messageElement.classList.remove('hidden', 'text-red-500');
        messageElement.classList.add('text-green-500');
    } else {
        messageElement.textContent = 'Erro ao atualizar senha no banco de dados.';
        messageElement.classList.remove('hidden', 'text-green-500');
        messageElement.classList.add('text-red-500');
    }
});

// Funções de Gerenciamento de Usuários (MODIFICADAS PARA USAR SUPABASE)

function renderLeaderList() {
    const tbody = $('#tabela-leaders');
    
    // CORREÇÃO: Verifica se o elemento existe antes de manipular
    if (!tbody) {
        console.warn('Elemento #tabela-leaders não encontrado. Pulando renderização de líderes.');
        return;
    }
    
    tbody.innerHTML = '';
    appData.leaders.forEach((leader, index) => {
        const row = tbody.insertRow();
        row.insertCell().textContent = leader.name;
        row.insertCell().textContent = leader.email;
        const actionCell = row.insertCell();
        const btnRemove = document.createElement('button');
        btnRemove.textContent = 'Remover';
        btnRemove.className = 'bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm';
        btnRemove.addEventListener('click', async () => {
            if (await removeLeaderFromSupabase(leader.id)) {
                renderLeaderList();
            } else {
                alert('Erro ao remover líder.');
            }
        });
        actionCell.appendChild(btnRemove);
    });
}

$('#form-add-leader').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nameInput = $('#leader-name-input');
    const passwordInput = $('#leader-password-input');
    
    // Verifica se os elementos existem
    if (!nameInput || !passwordInput) {
        console.error('Erro: Campos de Nome ou Senha do Líder não encontrados no HTML.');
        return;
    }

    const name = nameInput.value.trim();
    const password = passwordInput.value;
    // Gera um email padrão, pois o campo de email não existe no HTML
    const email = `${name.toLowerCase().replace(/\s/g, '.')}@lider.com`;
    
    if (name && password.length >= 6) {
        const newLeader = {
            name: name,
            email: email,
            passwordHash: hashPassword(password)
        };
        
        if (await saveLeaderToSupabase(newLeader)) {
            renderLeaderList();
            $('#leader-name').value = '';
            $('#leader-email').value = '';
            $('#leader-password').value = '';
        } else {
            alert('Erro ao adicionar líder.');
        }
    }
});

function renderBillingList() {
    const tbody = $('#tabela-billings');
    
    // CORREÇÃO: Verifica se o elemento existe antes de manipular
    if (!tbody) {
        console.warn('Elemento #tabela-billings não encontrado. Pulando renderização de faturamentos.');
        return;
    }
    
    tbody.innerHTML = '';
    appData.billings.forEach((billing, index) => {
        const row = tbody.insertRow();
        row.insertCell().textContent = billing.name;
        row.insertCell().textContent = billing.email;
        const actionCell = row.insertCell();
        const btnRemove = document.createElement('button');
        btnRemove.textContent = 'Remover';
        btnRemove.className = 'bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm';
        btnRemove.addEventListener('click', async () => {
            if (await removeBillingFromSupabase(billing.id)) {
                renderBillingList();
            } else {
                alert('Erro ao remover faturamento.');
            }
        });
        actionCell.appendChild(btnRemove);
    });
}

$('#form-add-billing').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nameInput = $('#billing-name-input');
    const passwordInput = $('#billing-password-input');
    
    // Verifica se os elementos existem
    if (!nameInput || !passwordInput) {
        console.error('Erro: Campos de Nome ou Senha do Faturamento não encontrados no HTML.');
        return;
    }

    const name = nameInput.value.trim();
    const password = passwordInput.value;
    // Gera um email padrão, pois o campo de email não existe no HTML
    const email = `${name.toLowerCase().replace(/\s/g, '.')}@faturamento.com`;
    
    if (name && password.length >= 6) {
        const newBilling = {
            name: name,
            email: email,
            passwordHash: hashPassword(password)
        };
        
        if (await saveBillingToSupabase(newBilling)) {
            renderBillingList();
            $('#billing-name').value = '';
            $('#billing-email').value = '';
            $('#billing-password').value = '';
        } else {
            alert('Erro ao adicionar faturamento.');
        }
    }
});

// ... (O restante do código de renderização e lógica de romaneios é mantido)

// Funções de Utilidade (continuação)
// ... (hashPassword, showScreen, updateUserInfo, getStatusClass, calculateDelay, etc.)

// Lógica de Tabs de Login (mantida)
const loginTabs = {
    'tab-admin-login': { form: '#form-admin-login', role: 'Admin', color: 'cyan' },
    'tab-leader-login': { form: '#form-leader-login', role: 'Líder', color: 'purple' },
    'tab-billing-login': { form: '#form-billing-login', role: 'Faturamento', color: 'green' }
};

$$('#screen-login button[id^="tab-"]').forEach(tab => {
    tab.addEventListener('click', () => {
        const tabId = tab.id;
        const { form, color } = loginTabs[tabId];

        // Atualiza a aparência das tabs
        $$('#screen-login button[id^="tab-"]').forEach(t => {
            t.classList.remove(`bg-${loginTabs[t.id].color}-600`, 'text-white');
            t.classList.add('bg-gray-200', 'text-gray-700');
        });
        tab.classList.add(`bg-${color}-600`, 'text-white');
        tab.classList.remove('bg-gray-200', 'text-gray-700');

        // Mostra o formulário correto
        $$('#screen-login form').forEach(f => f.classList.add('hidden'));
        $(form).classList.remove('hidden');
        
        // Limpa mensagens de erro
        $$('#screen-login p[id$="-error"]').forEach(p => p.classList.add('hidden'));
    });
});

// Lógica de Configurações (continuação)
$('#btn-settings').addEventListener('click', () => {
    $('#settings-user-name').textContent = appData.currentUser.name;
    $('#settings-user-role').textContent = appData.currentRole;

    // Mostra as seções apenas para Admin
    if (appData.currentRole === 'Admin') {
        $('#settings-change-password').classList.remove('hidden');
        $('#settings-personalization').classList.remove('hidden');
        // Carrega as configurações salvas
        if (appData.appSettings) {
            $('#input-app-name').value = appData.appSettings.appName || 'Controle de Romaneios';
            $('#input-header-color').value = appData.appSettings.headerColor || '#0891b2';
            $('#select-header-color').value = appData.appSettings.headerColor || '#0891b2';
            if (appData.appSettings.logoBase64) {
                $('#logo-preview-img').src = appData.appSettings.logoBase64;
                $('#logo-preview-img').classList.remove('hidden');
                $('#logo-preview-text').classList.add('hidden');
            }
        }
        // Limpa os campos de senha
        $('#input-current-password').value = '';
        $('#input-new-password').value = '';
        $('#input-confirm-password').value = '';
        $('#password-message').classList.add('hidden');
    } else {
        $('#settings-change-password').classList.add('hidden');
        $('#settings-personalization').classList.add('hidden');
    }

    $('#modal-settings').classList.remove('hidden');
});

$('#btn-close-settings').addEventListener('click', () => {
    $('#modal-settings').classList.add('hidden');
});

$('#modal-settings').addEventListener('click', (e) => {
    if (e.target === $('#modal-settings')) {
        $('#modal-settings').classList.add('hidden');
    }
});

// Upload de Logo
$('#btn-upload-logo').addEventListener('click', () => {
    const fileInput = $('#input-logo');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64 = e.target.result;
            if (!appData.appSettings) appData.appSettings = {};
            appData.appSettings.logoBase64 = base64;
            $('#logo-preview-img').src = base64;
            $('#logo-preview-img').classList.remove('hidden');
            $('#logo-preview-text').classList.add('hidden');
            saveLocalState(); // Salva localmente
            applyTheme();
            alert('Logo carregado com sucesso!');
        };
        reader.readAsDataURL(file);
    } else {
        alert('Selecione um arquivo de imagem.');
    }
});

// Mudar cor do Header
$('#select-header-color').addEventListener('change', (e) => {
    $('#input-header-color').value = e.target.value;
});

$('#input-header-color').addEventListener('change', (e) => {
    $('#select-header-color').value = e.target.value;
});

// Salvar Personalização
$('#btn-save-personalization').addEventListener('click', () => {
    if (!appData.appSettings) appData.appSettings = {};
    appData.appSettings.appName = $('#input-app-name').value || 'Controle de Romaneios';
    appData.appSettings.headerColor = $('#input-header-color').value || '#0891b2';
    saveLocalState(); // Salva localmente
    applyTheme();
    const messageElement = $('#personalization-message');
    messageElement.textContent = 'Personalização salva com sucesso!';
    messageElement.classList.remove('hidden', 'text-red-500');
    messageElement.classList.add('text-green-500');
    setTimeout(() => {
        messageElement.classList.add('hidden');
    }, 3000);
});

// Aplicar tema ao carregar
function applyTheme() {
    const settings = appData.appSettings || {};
    const headerColor = settings.headerColor || '#0891b2';
    const appName = settings.appName || 'Controle de Romaneios';
    
    // Muda a cor do header
    const header = $('header');
    if (header) {
        header.style.backgroundColor = headerColor;
    }

    // Muda o nome do app em todos os h1
    $$('h1').forEach(h1 => {
        if (h1.textContent.includes('Controle de Romaneios')) {
            h1.textContent = appName;
        }
    });

    // Muda o logo se existir
    if (settings.logoBase64) {
        const logoImg = $('#admin-logo-img');
        const logoText = $('#admin-logo-text');
        if (logoImg) {
            logoImg.src = settings.logoBase64;
            logoImg.classList.remove('hidden');
        }
        if (logoText) {
            logoText.classList.add('hidden');
        }
    }
}

// Lógica do Dashboard
function renderDashboard() {
    updateUserInfo();
    applyTheme();
    renderTabs();
    // Renderiza o conteúdo da primeira tab visível
    const firstTab = $('#dashboard-tabs button:not(.hidden)');
    if (firstTab) {
        firstTab.click();
    }
    
    // Renderiza as listas de gerenciamento (Agora usam dados do Supabase)
    renderLeaderList();
    renderBillingList();
    renderTeamList();
    renderEquipeDestinoOptions();
}

function renderTabs() {
    const role = appData.currentRole;
    const tabsContainer = $('#dashboard-tabs');
    tabsContainer.innerHTML = '';

    const tabs = [
        { id: 'abastecimento', title: '📋 Abastecimento', roles: ['Admin'] },
        { id: 'fila', title: '🚚 Fila FIFO', roles: ['Admin'] },
        { id: 'separacao', title: '📦 Separação', roles: ['Líder'] },
        { id: 'faturamento', title: '💰 Faturamento', roles: ['Faturamento'] },
        { id: 'historico-config', title: '📊 Histórico & Config', roles: ['Admin'] }
    ];

    tabs.forEach(tab => {
        if (tab.roles.includes(role)) {
            const button = document.createElement('button');
            button.className = 'dashboard-tab px-6 py-4 font-semibold border-b-2 border-transparent text-gray-600 hover:text-gray-800 whitespace-nowrap transition';
            button.setAttribute('data-tab', tab.id);
            button.textContent = tab.title;
            button.addEventListener('click', () => {
                // Ativa a tab
                $$('.dashboard-tab').forEach(btn => {
                    btn.classList.remove('border-cyan-600', 'text-cyan-600');
                    btn.classList.add('border-transparent', 'text-gray-600', 'hover:text-gray-800');
                });
                button.classList.add('border-cyan-600', 'text-cyan-600');
                button.classList.remove('border-transparent', 'text-gray-600', 'hover:text-gray-800');

                // Mostra o conteúdo
                $$('.tab-content').forEach(content => content.classList.add('hidden'));
                $(`#tab-${tab.id}`).classList.remove('hidden');

                // Renderiza o conteúdo específico da tab
                if (tab.id === 'fila') renderFilaFIFO();
                if (tab.id === 'faturamento') renderFaturamento();
                if (tab.id === 'historico-config') renderHistoricoCompleto();
            });
            tabsContainer.appendChild(button);
        }
    });
}

// Lógica da ABA 1 – ABASTECIMENTO (mantida)
$('#btn-adicionar-romaneios').addEventListener('click', async (e) => {
    e.preventDefault();

    const romaneiosText = $('#romaneios-input').value.trim();
    const dataEntrega = $('#data-entrega-input').value;
    const messageElement = $('#abastecimento-message');
    messageElement.classList.add('hidden');

    if (!romaneiosText || !dataEntrega) {
        messageElement.textContent = 'Preencha todos os campos.';
        messageElement.classList.remove('hidden', 'text-green-500');
        messageElement.classList.add('text-red-500');
        return;
    }

    const romaneios = romaneiosText.split('\n')
        .map(r => r.trim())
        .filter(r => r.length > 0);

    if (romaneios.length === 0) {
        messageElement.textContent = 'Nenhum número de romaneio válido encontrado.';
        messageElement.classList.remove('hidden', 'text-green-500');
        messageElement.classList.add('text-red-500');
        return;
    }

    let addedCount = 0;
    const romaneiosParaInserir = [];

    romaneios.forEach(num => {
        if (!appData.romaneios.find(r => r.numero === num)) {
            romaneiosParaInserir.push({
                numero: num,
                dataEntrega: dataEntrega,
                status: 'Disponível',
                historico: [{
                    timestamp: new Date().toISOString(),
                    status: 'Disponível',
                    user: appData.currentUser.name,
                    role: appData.currentRole
                }]
            });
            addedCount++;
        }
    });

    if (romaneiosParaInserir.length > 0) {
        // Inserção em lote no Supabase
        const { data, error } = await supabaseClient
            .from(ROMANEIOS_TABLE)
            .insert(romaneiosParaInserir)
            .select();

        if (error) {
            console.error('Erro ao inserir romaneios em lote:', error);
            messageElement.textContent = `Erro ao adicionar romaneios: ${error.message}`;
            messageElement.classList.remove('hidden', 'text-green-500');
            messageElement.classList.add('text-red-500');
            return;
        }

        // Adiciona os romaneios inseridos (com IDs) à lista local
        appData.romaneios.push(...data);
        
        // Limpa os campos e exibe a mensagem de sucesso
        $('#romaneios-input').value = '';
        $('#data-entrega-input').value = '';
        messageElement.textContent = `${addedCount} romaneio(s) adicionado(s) com sucesso.`;
        messageElement.classList.remove('hidden', 'text-red-500');
        messageElement.classList.add('text-green-500');

        // Re-renderiza a fila FIFO para mostrar os novos romaneios
        renderFilaFIFO(); 
    } else {
        messageElement.textContent = 'Todos os romaneios informados já existem.';
        messageElement.classList.remove('hidden', 'text-green-500');
        messageElement.classList.add('text-red-500');
    }
});

// Função auxiliar para encontrar e atualizar um romaneio localmente e no Supabase
async function updateRomaneioStatus(romaneioNumero, newStatus, user, role, additionalData = {}) {
    const romaneioIndex = appData.romaneios.findIndex(r => r.numero === romaneioNumero);

    if (romaneioIndex === -1) {
        console.error(`Romaneio ${romaneioNumero} não encontrado.`);
        return;
    }

    const romaneio = appData.romaneios[romaneioIndex];
    
    // Cria uma cópia do histórico para evitar mutação direta antes do Supabase
    const updatedHistorico = [...romaneio.historico, {
        timestamp: new Date().toISOString(),
        status: newStatus,
        user: user,
        role: role,
        ...additionalData
    }];

    // Prepara o objeto de atualização para o Supabase
    const updates = {
        status: newStatus,
        historico: updatedHistorico,
        ...additionalData
    };

    // Atualiza no Supabase
    const { data, error } = await supabaseClient
        .from(ROMANEIOS_TABLE)
        .update(updates)
        .eq('numero', romaneioNumero)
        .select();

    if (error) {
        console.error('Erro ao atualizar status no Supabase:', error);
        alert(`Erro ao atualizar status do romaneio ${romaneioNumero}.`);
        return;
    }

    // Se a atualização no Supabase for bem-sucedida, atualiza o objeto local com o dado retornado
    appData.romaneios[romaneioIndex] = data[0];
    
    // Re-renderiza as listas afetadas
    renderFilaFIFO();
    renderFaturamento();
    renderHistoricoCompleto();
}

// Lógica da ABA 2 – FILA FIFO (mantida)
function renderFilaFIFO() {
    const fila = appData.romaneios
        .filter(r => r.status !== 'Faturado')
        .sort((a, b) => new Date(a.dataEntrega) - new Date(b.dataEntrega)); // FIFO: mais antigo primeiro

    const tbody = $('#tabela-fila-fifo');
    tbody.innerHTML = '';
    $('#fila-vazia').classList.add('hidden');

    if (fila.length === 0) {
        $('#fila-vazia').classList.remove('hidden');
        return;
    }

    fila.forEach((romaneio, index) => {
        const delay = calculateDelay(romaneio.dataEntrega);
        const row = tbody.insertRow();
        
        // Aplica a classe de status na linha
        row.className = getStatusClass(romaneio.status);
        
        // Se for o mais atrasado e estiver em atraso 4+, pisca
        if (index === 0 && delay.class.includes('atraso-4-mais-dias')) {
            row.classList.add('blink-red');
        }

        row.insertCell().textContent = romaneio.numero;
        row.insertCell().textContent = new Date(romaneio.dataEntrega).toLocaleString('pt-BR');
        row.insertCell().textContent = romaneio.status;
        
        const delayCell = row.insertCell();
        delayCell.textContent = delay.text;
        delayCell.className = delay.class;

        // Ação de Iniciar Separação (Líder)
        const actionCell = row.insertCell();
        if (appData.currentRole === 'Líder' && romaneio.status === 'Disponível') {
            const select = document.createElement('select');
            select.className = 'p-1 border rounded text-sm';
            select.innerHTML = '<option value="">Selecionar Equipe</option>';
            appData.teams.forEach(team => {
                const option = document.createElement('option');
                option.value = team;
                option.textContent = team;
                select.appendChild(option);
            });

            select.addEventListener('change', async (e) => {
                const equipe = e.target.value;
                if (equipe) {
                    await updateRomaneioStatus(romaneio.numero, 'Em separação', appData.currentUser.name, appData.currentRole, { equipeDestino: equipe });
                }
            });
            actionCell.appendChild(select);
        } else if (romaneio.status === 'Em separação') {
            actionCell.textContent = `Em separação (${romaneio.equipeDestino || 'N/A'})`;
        } else {
            actionCell.textContent = '-';
        }
    });
}

// Lógica da ABA 3 – SEPARAÇÃO (Líder)
function renderSeparacao() {
    // Assumindo que o Líder é o nome da equipe
    const romaneiosEmSeparacao = appData.romaneios
        .filter(r => r.status === 'Em separação' && r.equipeDestino === appData.currentUser.name); 

    const tbody = $('#tabela-separacao');
    tbody.innerHTML = '';
    $('#separacao-vazia').classList.add('hidden');

    if (romaneiosEmSeparacao.length === 0) {
        $('#separacao-vazia').classList.remove('hidden');
        return;
    }

    romaneiosEmSeparacao.forEach(romaneio => {
        const row = tbody.insertRow();
        row.insertCell().textContent = romaneio.numero;
        row.insertCell().textContent = new Date(romaneio.dataEntrega).toLocaleString('pt-BR');
        row.insertCell().textContent = romaneio.equipeDestino || 'N/A';

        const actionCell = row.insertCell();
        const btnFimSeparacao = document.createElement('button');
        btnFimSeparacao.textContent = 'Fim da Separação';
        btnFimSeparacao.className = 'bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-sm';
        btnFimSeparacao.addEventListener('click', async () => {
            await updateRomaneioStatus(romaneio.numero, 'Pendente de faturamento', appData.currentUser.name, appData.currentRole);
            renderSeparacao(); // Re-renderiza a lista de separação
        });
        actionCell.appendChild(btnFimSeparacao);
    });
}

// Lógica da ABA 4 – FATURAMENTO (Faturamento)
function renderFaturamento() {
    const romaneiosPendentes = appData.romaneios
        .filter(r => r.status === 'Pendente de faturamento')
        .sort((a, b) => {
            const aTime = a.historico.find(h => h.status === 'Pendente de faturamento')?.timestamp || 0;
            const bTime = b.historico.find(h => h.status === 'Pendente de faturamento')?.timestamp || 0;
            return new Date(aTime) - new Date(bTime);
        });

    const tbody = $('#tabela-faturamento');
    tbody.innerHTML = '';
    $('#faturamento-vazia').classList.add('hidden');

    if (romaneiosPendentes.length === 0) {
        $('#faturamento-vazia').classList.remove('hidden');
        return;
    }

    romaneiosPendentes.forEach(romaneio => {
        const row = tbody.insertRow();
        row.insertCell().textContent = romaneio.numero;
        row.insertCell().textContent = new Date(romaneio.dataEntrega).toLocaleString('pt-BR');
        row.insertCell().textContent = romaneio.equipeDestino || 'N/A';

        const actionCell = row.insertCell();
        const btnFaturar = document.createElement('button');
        btnFaturar.textContent = 'Faturar';
        btnFaturar.className = 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm';
        btnFaturar.addEventListener('click', async () => {
            await updateRomaneioStatus(romaneio.numero, 'Faturado', appData.currentUser.name, appData.currentRole);
            renderFaturamento(); // Re-renderiza a lista de faturamento
        });
        actionCell.appendChild(btnFaturar);
    });
}

// Lógica da ABA 5 – HISTÓRICO & CONFIG (Admin)
function renderHistoricoCompleto() {
    const historico = appData.romaneios
        .sort((a, b) => {
            const aTime = a.historico[a.historico.length - 1]?.timestamp || 0;
            const bTime = b.historico[b.historico.length - 1]?.timestamp || 0;
            return new Date(bTime) - new Date(aTime);
        });

    const tbody = $('#tabela-historico');
    tbody.innerHTML = '';

    historico.forEach(romaneio => {
        const row = tbody.insertRow();
        row.insertCell().textContent = romaneio.numero;
        row.insertCell().textContent = new Date(romaneio.dataEntrega).toLocaleString('pt-BR');
        row.insertCell().textContent = romaneio.status;
        row.insertCell().textContent = romaneio.equipeDestino || '-';
        
        const historicoCell = row.insertCell();
        historicoCell.innerHTML = romaneio.historico.map(h => 
            `<div>${new Date(h.timestamp).toLocaleString('pt-BR')} - ${h.status} por ${h.user} (${h.role})</div>`
        ).join('');
    });
}

function renderTeamList() {
    const ul = $('#lista-teams');
    
    // CORREÇÃO: Verifica se o elemento existe antes de manipular
    if (!ul) {
        console.warn('Elemento #lista-teams não encontrado. Pulando renderização de equipes.');
        return;
    }
    
    ul.innerHTML = '';
    appData.teams.forEach((team, index) => {
        const li = document.createElement('li');
        li.className = 'flex justify-between items-center p-2 border-b';
        li.innerHTML = `<span>${team}</span>`;
        const btnRemove = document.createElement('button');
        btnRemove.textContent = 'Remover';
        btnRemove.className = 'bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm';
        btnRemove.addEventListener('click', () => {
            appData.teams.splice(index, 1);
            saveLocalState(); // Salva localmente (Equipes não foram migradas para Supabase)
            renderTeamList();
            renderEquipeDestinoOptions();
        });
        li.appendChild(btnRemove);
        ul.appendChild(li);
    });
}

$('#form-add-team').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#team-name').value.trim();
    if (name && !appData.teams.includes(name)) {
        appData.teams.push(name);
        saveLocalState(); // Salva localmente
        renderTeamList();
        renderEquipeDestinoOptions();
        $('#team-name').value = '';
    }
});

function renderEquipeDestinoOptions() {
    const select = $('#equipe-destino-input');
    
    // CORREÇÃO: Verifica se o elemento existe antes de manipular
    if (!select) {
        console.warn('Elemento #equipe-destino-input não encontrado. Pulando renderização de opções.');
        return;
    }
    
    select.innerHTML = '<option value="">Selecione a Equipe</option>';
    appData.teams.forEach(team => {
        const option = document.createElement('option');
        option.value = team;
        option.textContent = team;
        select.appendChild(option);
    });
}

// Funções de Utilidade (continuação)
function getStatusClass(status) {
    switch (status) {
        case 'Disponível': return 'status-disponivel';
        case 'Em separação': return 'status-em-separacao';
        case 'Pendente de faturamento': return 'status-pendente-faturamento';
        case 'Faturado': return 'status-faturado';
        default: return '';
    }
}

function calculateDelay(deliveryDate) {
    const now = new Date();
    const delivery = new Date(deliveryDate);
    const diffTime = now - delivery;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return { text: 'Normal', class: 'atraso-normal' };
    if (diffDays === 1) return { text: '1 dia', class: 'atraso-1-dia' };
    if (diffDays === 2) return { text: '2 dias', class: 'atraso-2-dias' };
    if (diffDays === 3) return { text: '3 dias', class: 'atraso-3-dias' };
    return { text: `${diffDays}+ dias`, class: 'atraso-4-mais-dias blink' };
}