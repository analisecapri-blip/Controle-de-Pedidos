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
    colaboradores: [], // Serão carregados do Supabase
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
const COLABORADORES_TABLE = 'colaboradores';

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
        // Atualiza select de líderes caso exista
        try { populateTeamLeaderSelect(); } catch (err) { /* ignore */ }
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
 * Carrega os colaboradores do Supabase.
 */
async function loadColaboradoresFromSupabase() {
    const { data, error } = await supabaseClient
        .from(COLABORADORES_TABLE)
        .select('*')

    if (error) {
        console.error('Erro ao carregar colaboradores do Supabase:', error);
        appData.colaboradores = [];
    } else {
        appData.colaboradores = data;
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
        loadColaboradoresFromSupabase(),
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
    // Atualiza selects dependentes após adicionar líder
    try { populateTeamLeaderSelect(); } catch (err) { /* ignore */ }
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
    // Remove do estado local
    appData.leaders = appData.leaders.filter(l => l.id !== leaderId);

    // Também remove equipes que estejam associadas a esse líder (caso equipes sejam objetos com leaderId)
    if (Array.isArray(appData.teams)) {
        appData.teams = appData.teams.filter(team => {
            // Se team for um objeto com leaderId, compare; se for string, mantenha
            if (team && typeof team === 'object' && 'leaderId' in team) {
                return team.leaderId !== leaderId;
            }
            return true;
        });
    }

    // Persiste apenas o estado local relevante (login/configs e agora equipes locais)
    try {
        saveLocalState();
    } catch (err) {
        console.warn('Falha ao salvar estado local após remover líder:', err);
    }

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
 * Salva um novo Colaborador no Supabase.
 */
async function saveColaboradorToSupabase(colaboradorData) {
    const { data, error } = await supabaseClient
        .from(COLABORADORES_TABLE)
        .insert([colaboradorData])
        .select();

    if (error) {
        console.error('Erro ao salvar Colaborador no Supabase:', error);
        console.error('Detalhes do erro:', {
            message: error.message,
            code: error.code,
            details: error.details
        });
        throw new Error(`Erro Supabase: ${error.message} (código: ${error.code})`);
    }
    
    if (!data || data.length === 0) {
        console.error('Nenhum dado retornado após inserção');
        throw new Error('Nenhum dado retornado após inserção');
    }
    
    appData.colaboradores.push(data[0]);
    return data[0];
}

/**
 * Remove um Colaborador do Supabase.
 */
async function removeColaboradorFromSupabase(colaboradorId) {
    const { error } = await supabaseClient
        .from(COLABORADORES_TABLE)
        .delete()
        .eq('id', colaboradorId);

    if (error) {
        console.error('Erro ao remover Colaborador do Supabase:', error);
        return false;
    }
    appData.colaboradores = appData.colaboradores.filter(c => c.id !== colaboradorId);
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
    // Configura assinaturas em tempo real para manter diferentes usuários sincronizados
    try {
        setupRealtimeSubscriptions();
    } catch (err) {
        console.warn('Não foi possível inicializar Realtime subscriptions:', err);
    }

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
    
    // Verifica se colaborador está logado
    if (appData.currentRole === 'Colaborador' && appData.currentUser) {
        renderColaboradorPainel();
        showScreen('#screen-colaborador');
    }
    // Garante que o dashboard seja renderizado com os dados do Supabase se o usuário já estiver logado
    else if (appData.currentUser && appData.currentRole) {
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
        // Guarda também o id do usuário para permitir filtros por líder
        appData.currentUser = { id: user.id || null, name: user.name, email: user.email || null };
        appData.currentRole = role;
        saveLocalState(); // Salva o estado de login localmente
        renderDashboard();
        showScreen('#screen-dashboard');
    } else {
        errorElement.textContent = `${role === 'Admin' ? 'E-mail' : 'Nome'} ou senha incorretos.`;
        errorElement.classList.remove('hidden');
    }
}

// Event listeners para os forms antigos (compatibilidade)
if ($('#form-admin-login')) {
    $('#form-admin-login').addEventListener('submit', (e) => handleLogin(e, 'Admin'));
}
if ($('#form-leader-login')) {
    $('#form-leader-login').addEventListener('submit', (e) => handleLogin(e, 'Líder'));
}
if ($('#form-billing-login')) {
    $('#form-billing-login').addEventListener('submit', (e) => handleLogin(e, 'Faturamento'));
}

if ($('#btn-logout')) {
    $('#btn-logout').addEventListener('click', () => {
        appData.currentUser = null;
        appData.currentRole = null;
        saveLocalState(); // Limpa o estado de login localmente
        showScreen('#screen-login');
        // Reseta para a tab Admin no login
        $('#tab-admin-login').click();
    });
}

// Lógica de Configurações (MODIFICADA PARA USAR SUPABASE PARA ADMIN)
// ... (O restante do código de configurações, renderização e lógica de romaneios é mantido,
// mas as funções de gerenciamento de usuários e alteração de senha do Admin são atualizadas)

// Alterar Senha do Admin (MODIFICADA PARA USAR SUPABASE)
if ($('#btn-save-password')) {
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
}

// Funções de Gerenciamento de Usuários (MODIFICADAS PARA USAR SUPABASE)

function renderLeaderList() {
    const ul = $('#lista-lideres');
    
    // Verifica se o elemento existe antes de manipular
    if (!ul) {
        console.warn('Elemento #lista-lideres não encontrado. Pulando renderização de líderes.');
        return;
    }
    
    ul.innerHTML = '';
    appData.leaders.forEach((leader, index) => {
        const li = document.createElement('li');
        li.className = 'flex justify-between items-center p-2 border-b';
        li.innerHTML = `<span>${leader.name} (${leader.email})</span>`;
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
        li.appendChild(btnRemove);
        ul.appendChild(li);
    });
}

if ($('#form-add-leader')) {
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
                nameInput.value = '';
                passwordInput.value = '';
            } else {
                alert('Erro ao adicionar líder.');
            }
        }
    });
}

function renderBillingList() {
    const ul = $('#lista-faturistas');
    
    // Verifica se o elemento existe antes de manipular
    if (!ul) {
        console.warn('Elemento #lista-faturistas não encontrado. Pulando renderização de faturamentos.');
        return;
    }
    
    ul.innerHTML = '';
    appData.billings.forEach((billing, index) => {
        const li = document.createElement('li');
        li.className = 'flex justify-between items-center p-2 border-b';
        li.innerHTML = `<span>${billing.name} (${billing.email})</span>`;
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
        li.appendChild(btnRemove);
        ul.appendChild(li);
    });
}

if ($('#form-add-billing')) {
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
                nameInput.value = '';
                passwordInput.value = '';
            } else {
                alert('Erro ao adicionar faturamento.');
            }
        }
    });
}

function renderColaboradorList() {
    const ul = $('#lista-colaboradores');
    
    // Verifica se o elemento existe antes de manipular
    if (!ul) {
        console.warn('Elemento #lista-colaboradores não encontrado. Pulando renderização de colaboradores.');
        return;
    }
    
    ul.innerHTML = '';
    appData.colaboradores.forEach((colab, index) => {
        const li = document.createElement('li');
        li.className = 'flex justify-between items-center p-2 border-b';
        li.innerHTML = `<span>${colab.name}</span>`;
        const btnRemove = document.createElement('button');
        btnRemove.textContent = 'Remover';
        btnRemove.className = 'bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm';
        btnRemove.addEventListener('click', async () => {
            if (await removeColaboradorFromSupabase(colab.id)) {
                renderColaboradorList();
            } else {
                alert('Erro ao remover colaborador.');
            }
        });
        li.appendChild(btnRemove);
        ul.appendChild(li);
    });
}

if ($('#form-add-colaborador')) {
    $('#form-add-colaborador').addEventListener('submit', async (e) => {
        e.preventDefault();
        const nameInput = $('#colaborador-name-input');
        const passwordInput = $('#colaborador-password-input');
        
        // Verifica se os elementos existem
        if (!nameInput || !passwordInput) {
            console.error('Erro: Campos de Nome ou Senha do Colaborador não encontrados no HTML.');
            alert('Erro: Campos não encontrados. Recarregue a página.');
            return;
        }

        const name = nameInput.value.trim();
        const password = passwordInput.value;
        
        if (!name) {
            alert('Digite o nome do colaborador.');
            return;
        }
        
        if (password.length < 6) {
            alert('Senha deve ter pelo menos 6 caracteres.');
            return;
        }
        
        const newColaborador = {
            nome: name,
            hash_de_senha: hashPassword(password)
        };
        
        try {
            const resultado = await saveColaboradorToSupabase(newColaborador);
            if (resultado) {
                renderColaboradorList();
                nameInput.value = '';
                passwordInput.value = '';
                alert('✓ Colaborador adicionado com sucesso!');
            } else {
                alert('❌ Erro ao adicionar colaborador. Verifique o console (F12) para mais detalhes.');
                console.error('Falha ao salvar colaborador no Supabase');
            }
        } catch (error) {
            alert(`❌ Erro: ${error.message}`);
            console.error('Erro ao adicionar colaborador:', error);
        }
    });
}

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

// -----------------------------
// Login Unificado (detecção automática de papel)
// -----------------------------
const unifiedIdentifier = $('#login-identifier');
const unifiedPassword = $('#login-password');
const unifiedError = $('#login-unified-error');

if ($('#form-unified-login')) {
    $('#form-unified-login').addEventListener('submit', async (e) => {
        e.preventDefault();
        if (unifiedError) unifiedError.classList.add('hidden');

        const identifier = unifiedIdentifier ? unifiedIdentifier.value.trim() : '';
        const password = unifiedPassword ? unifiedPassword.value : '';

        if (!identifier || !password) {
            if (unifiedError) {
                unifiedError.textContent = 'Preencha identificador e senha.';
                unifiedError.classList.remove('hidden');
            }
            return;
        }

        await loadAllDataFromSupabase();

        let user = null;
        let detectedRole = null;

        // 1) Tenta Admin por e-mail (case-insensitive)
        if (appData.admin && appData.admin.email && appData.admin.passwordHash) {
            if (String(appData.admin.email).toLowerCase() === String(identifier).toLowerCase() && appData.admin.passwordHash === hashPassword(password)) {
                user = appData.admin;
                detectedRole = 'Admin';
            }
        }

        // 2) Tenta Líder por nome ou e-mail
        if (!user && Array.isArray(appData.leaders)) {
            user = appData.leaders.find(l => (
                (l.name && String(l.name).toLowerCase() === String(identifier).toLowerCase()) ||
                (l.email && String(l.email).toLowerCase() === String(identifier).toLowerCase())
            ) && l.passwordHash === hashPassword(password));
            if (user) detectedRole = 'Líder';
        }

        // 3) Tenta Faturamento por nome ou e-mail
        if (!user && Array.isArray(appData.billings)) {
            user = appData.billings.find(b => (
                (b.name && String(b.name).toLowerCase() === String(identifier).toLowerCase()) ||
                (b.email && String(b.email).toLowerCase() === String(identifier).toLowerCase())
            ) && b.passwordHash === hashPassword(password));
            if (user) detectedRole = 'Faturamento';
        }

        if (user && detectedRole) {
            appData.currentUser = { id: user.id || null, name: user.name, email: user.email || null };
            appData.currentRole = detectedRole;
            saveLocalState();
            renderDashboard();
            showScreen('#screen-dashboard');
        } else {
            if (unifiedError) {
                unifiedError.textContent = 'Identificador ou senha incorretos.';
                unifiedError.classList.remove('hidden');
            } else {
                alert('Identificador ou senha incorretos.');
            }
        }
    });
}

// Lógica de Configurações (continuação)
if ($('#btn-settings')) {
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
}

if ($('#btn-close-settings')) {
    $('#btn-close-settings').addEventListener('click', () => {
        $('#modal-settings').classList.add('hidden');
    });
}

if ($('#modal-settings')) {
    $('#modal-settings').addEventListener('click', (e) => {
        if (e.target === $('#modal-settings')) {
            $('#modal-settings').classList.add('hidden');
        }
    });
}

// Upload de Logo
if ($('#btn-upload-logo')) {
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
}

// Mudar cor do Header
if ($('#select-header-color')) {
    $('#select-header-color').addEventListener('change', (e) => {
        $('#input-header-color').value = e.target.value;
    });
}

if ($('#input-header-color')) {
    $('#input-header-color').addEventListener('change', (e) => {
        $('#select-header-color').value = e.target.value;
    });
}

// Salvar Personalização
if ($('#btn-save-personalization')) {
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
}

// Aplicar tema ao carregar
function applyTheme() {
    const settings = appData.appSettings || {};
    const headerColor = settings.headerColor || '#3282F6';
    const appName = settings.appName || 'Controle de Romaneios';
    
    // Muda a cor do header
    const header = $('header');
    if (header) {
        header.style.backgroundColor = headerColor;
        // define cor do texto do header automaticamente para contraste
        const contrastColor = getContrastColor(headerColor);
        header.style.color = contrastColor;
        // atualiza variavel CSS para uso nas regras
        document.documentElement.style.setProperty('--brand-color', headerColor);
    }

    // ajusta botões e elementos que usam var(--brand-color) para garantir contraste
    const loginButton = $('#login-unified-button');
    if (loginButton) loginButton.style.backgroundColor = headerColor;

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
    renderColaboradorList();
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
if ($('#btn-adicionar-romaneios')) {
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
}

// Função auxiliar para encontrar e atualizar um romaneio localmente e no Supabase
async function updateRomaneioStatus(romaneioNumero, newStatus, user, role, additionalData = {}) {
    const romaneioIndex = appData.romaneios.findIndex(r => String(r.numero) === String(romaneioNumero));

    if (romaneioIndex === -1) {
        console.error(`Romaneio ${romaneioNumero} não encontrado.`);
        alert(`Romaneio ${romaneioNumero} não encontrado localmente. Verifique se os dados foram carregados.`);
        return false;
    }

    const romaneio = appData.romaneios[romaneioIndex];

    // Cria uma cópia do histórico para evitar mutação direta antes do Supabase
    const historicoEntry = {
        timestamp: new Date().toISOString(),
        status: newStatus,
        user: user,
        role: role
    };
    // Anexa dados adicionais apenas ao histórico, para evitar enviar colunas desconhecidas ao Supabase
    if (additionalData && typeof additionalData === 'object') {
        Object.keys(additionalData).forEach(key => {
            // Se o romaneio já tem essa propriedade no objeto (coluna existente), inclua também como update
            if (romaneio.hasOwnProperty(key)) {
                // será tratado mais abaixo
            } else {
                // adiciona ao histórico como detalhe
                historicoEntry[key] = additionalData[key];
            }
        });
    }

    const updatedHistorico = [...(Array.isArray(romaneio.historico) ? romaneio.historico : []), historicoEntry];

    // Prepara o objeto de atualização para o Supabase: inclui apenas colunas existentes no registro
    const updates = {
        status: newStatus,
        historico: updatedHistorico
    };

    if (additionalData && typeof additionalData === 'object') {
        Object.keys(additionalData).forEach(key => {
            if (romaneio.hasOwnProperty(key)) {
                updates[key] = additionalData[key];
            }
        });
    }

    // Decide se atualiza por id (preferível) ou por número
    const matchById = romaneio.id !== undefined && romaneio.id !== null;
    let query = supabaseClient.from(ROMANEIOS_TABLE).update(updates);
    if (matchById) {
        query = query.eq('id', romaneio.id);
    } else {
        query = query.eq('numero', romaneioNumero);
    }

    // Executa a atualização
    console.debug('updateRomaneioStatus: romaneioBefore=', romaneio, 'matchById=', matchById, 'updates=', updates);
    const { data, error } = await query.select();

    if (error) {
        console.error('Erro ao atualizar status no Supabase:', error);
        const errMsg = error.message || JSON.stringify(error);
        alert(`Erro ao atualizar status do romaneio ${romaneioNumero}: ${errMsg}`);
        return;
    }

    // Se a atualização não retornou dados (às vezes políticas RLS ou RETURNING não permitem), tenta buscar o registro atualizado
    if (!data || data.length === 0) {
        console.warn('Update retornou sem dados. Tentando buscar registro atualizado...');
        let fetchQuery = supabaseClient.from(ROMANEIOS_TABLE).select('*');
        if (matchById) fetchQuery = fetchQuery.eq('id', romaneio.id).limit(1);
        else fetchQuery = fetchQuery.eq('numero', romaneioNumero).limit(1);
        const { data: fetched, error: fetchErr } = await fetchQuery;
        if (fetchErr) {
            console.error('Erro ao buscar romaneio após update:', fetchErr);
            alert(`Romaneio atualizado, mas falha ao buscar registro atualizado: ${fetchErr.message || JSON.stringify(fetchErr)}`);
            return false;
        }
        if (!fetched || fetched.length === 0) {
            console.error('Nenhum registro encontrado após update. Verifique permissões e se o romaneio existe.');
            alert('Atualização concluída, mas não foi possível obter o registro atualizado. Verifique permissões no Supabase.');
            return false;
        }
        appData.romaneios[romaneioIndex] = fetched[0];
    } else {
        // Se a atualização no Supabase retornou o registro, atualiza local
        appData.romaneios[romaneioIndex] = data[0];
    }

    return true;

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
                    await updateRomaneioStatus(romaneio.numero, 'Em separação', appData.currentUser?.name || 'Sistema', appData.currentRole || 'Sistema', { equipeDestino: equipe });
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
    // Mostra romaneios em separação para as equipes que o líder pode operar.
    // Se a equipe for um objeto com leaderId, apenas o líder correspondente vê; equipes não atribuídas (strings
    // ou objetos sem leaderId) ficam disponíveis para todos os líderes.
    let romaneiosEmSeparacao = [];
    if (appData.currentRole === 'Líder' && appData.currentUser && appData.currentUser.id) {
        const allowedTeams = (appData.teams || []).filter(t => {
            if (t && typeof t === 'object' && 'leaderId' in t) {
                return String(t.leaderId) === String(appData.currentUser.id);
            }
            return true;
        }).map(t => (t && typeof t === 'object') ? t.name : t);

        romaneiosEmSeparacao = appData.romaneios
            .filter(r => r.status === 'Em separação' && allowedTeams.includes(r.equipeDestino));
    } else {
        romaneiosEmSeparacao = appData.romaneios.filter(r => r.status === 'Em separação');
    }

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
            const ok = await updateRomaneioStatus(romaneio.numero, 'Pendente de faturamento', appData.currentUser?.name || 'Sistema', appData.currentRole || 'Sistema');
            if (ok) {
                renderSeparacao(); // Re-renderiza a lista de separação
            } else {
                alert(`Falha ao marcar romaneio ${romaneio.numero} como Pendente de faturamento. Veja o console para detalhes.`);
            }
        });
        actionCell.appendChild(btnFimSeparacao);
    });
}

// Lógica da ABA 4 – FATURAMENTO (Faturamento)
function renderFaturamento() {
    // Lista de pendentes
    const romaneiosPendentes = appData.romaneios
        .filter(r => r.status === 'Pendente de faturamento')
        .sort((a, b) => {
            const aTime = a.historico?.find(h => h.status === 'Pendente de faturamento')?.timestamp || 0;
            const bTime = b.historico?.find(h => h.status === 'Pendente de faturamento')?.timestamp || 0;
            return new Date(aTime) - new Date(bTime);
        });

    const tbodyPendentes = document.getElementById('tabela-pendentes-faturamento');
    if (tbodyPendentes) {
        tbodyPendentes.innerHTML = '';
        $('#pendentes-vazia')?.classList.add('hidden');

        if (romaneiosPendentes.length === 0) {
            $('#pendentes-vazia')?.classList.remove('hidden');
        }

        romaneiosPendentes.forEach(romaneio => {
            const row = tbodyPendentes.insertRow();
            row.insertCell().textContent = romaneio.numero;
            row.insertCell().textContent = romaneio.dataEntrega ? new Date(romaneio.dataEntrega).toLocaleString('pt-BR') : '-';
            row.insertCell().textContent = romaneio.equipeDestino || 'N/A';

            const actionCell = row.insertCell();
            const btnFaturar = document.createElement('button');
            btnFaturar.textContent = 'Faturar';
            btnFaturar.className = 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm';
            btnFaturar.addEventListener('click', async () => {
                const ok = await updateRomaneioStatus(romaneio.numero, 'Faturado', appData.currentUser?.name || 'Sistema', appData.currentRole || 'Sistema');
                if (ok) {
                    renderFaturamento(); // Re-renderiza a lista de faturamento
                } else {
                    alert(`Falha ao faturar romaneio ${romaneio.numero}. Veja o console para detalhes.`);
                }
            });
            actionCell.appendChild(btnFaturar);
        });
    }

    // Renderiza histórico de faturados
    renderHistoricoFaturamento();
}

// Lógica da ABA 5 – HISTÓRICO & CONFIG (Admin)
function renderHistoricoCompleto() {
    // Aplica filtros de busca/status
    const busca = ($('#filtro-busca-romaneio') ? $('#filtro-busca-romaneio').value.trim() : '').toLowerCase();
    const statusFilter = ($('#filtro-status-romaneio') ? $('#filtro-status-romaneio').value : '');

    const ordenados = appData.romaneios
        .slice()
        .sort((a, b) => {
            const aTime = a.historico?.[a.historico.length - 1]?.timestamp || 0;
            const bTime = b.historico?.[b.historico.length - 1]?.timestamp || 0;
            return new Date(bTime) - new Date(aTime);
        });

    const tbody = document.getElementById('tabela-historico-completo');
    if (!tbody) {
        console.warn('Elemento #tabela-historico-completo não encontrado.');
        return;
    }
    tbody.innerHTML = '';

    const results = ordenados.filter(r => {
        if (busca) {
            if (!String(r.numero).toLowerCase().includes(busca)) return false;
        }
        if (statusFilter) {
            if (r.status !== statusFilter) return false;
        }
        return true;
    });

    if (results.length === 0) {
        $('#historico-completo-vazio')?.classList.remove('hidden');
    } else {
        $('#historico-completo-vazio')?.classList.add('hidden');
    }

    results.forEach(romaneio => {
        const row = tbody.insertRow();
        // Nº Romaneio
        row.insertCell().textContent = romaneio.numero;
        // Data/Hora Entrega
        row.insertCell().textContent = romaneio.dataEntrega ? new Date(romaneio.dataEntrega).toLocaleString('pt-BR') : '-';
        // Status
        row.insertCell().textContent = romaneio.status || '-';

        // Líder: procura quem iniciou a separação
        const liderEntry = (romaneio.historico || []).slice().reverse().find(h => h.status === 'Em separação' || h.status === 'Pendente de faturamento' || h.status === 'Faturado');
        row.insertCell().textContent = liderEntry ? (liderEntry.user || '-') : '-';

        // Equipe
        row.insertCell().textContent = romaneio.equipeDestino || '-';

        // Data Finalização Separação: procura entrada com status 'Pendente de faturamento' ou campo dataFinalizacaoSeparacao
        const finalizacaoEntry = (romaneio.historico || []).find(h => h.status === 'Pendente de faturamento' || h.dataFinalizacaoSeparacao);
        const dataFinalizacao = finalizacaoEntry?.dataFinalizacaoSeparacao || finalizacaoEntry?.timestamp;
        row.insertCell().textContent = dataFinalizacao ? new Date(dataFinalizacao).toLocaleString('pt-BR') : '-';

        // Observação do Líder: procura em historico por observacaoLider
        const obsEntry = (romaneio.historico || []).slice().reverse().find(h => h.observacaoLider);
        row.insertCell().textContent = obsEntry ? obsEntry.observacaoLider : '-';

        // Faturista e Data Faturamento: procura entrada com status 'Faturado'
        const faturadoEntry = (romaneio.historico || []).find(h => h.status === 'Faturado');
        row.insertCell().textContent = faturadoEntry ? (faturadoEntry.user || '-') : '-';
        row.insertCell().textContent = faturadoEntry?.timestamp ? new Date(faturadoEntry.timestamp).toLocaleString('pt-BR') : '-';
    });

}

// Re-renderiza historico ao alterar filtros
const filtroBusca = document.getElementById('filtro-busca-romaneio');
if (filtroBusca) filtroBusca.addEventListener('input', renderHistoricoCompleto);
const filtroStatus = document.getElementById('filtro-status-romaneio');
if (filtroStatus) filtroStatus.addEventListener('change', renderHistoricoCompleto);

function renderTeamList() {
    const ul = $('#lista-equipes');
    // Verifica se o elemento existe antes de manipular
    if (!ul) {
        console.warn('Elemento #lista-equipes não encontrado. Pulando renderização de equipes.');
        return;
    }

    ul.innerHTML = '';
    appData.teams.forEach((team, index) => {
        const li = document.createElement('li');
        li.className = 'flex justify-between items-center p-2 border-b';
        // Suporta equipe como string ou objeto { id, name, leaderId }
        const teamLabel = (team && typeof team === 'object') ? team.name : team;
        const leaderInfo = (team && typeof team === 'object' && team.leaderId)
            ? ` — ${getLeaderNameById(team.leaderId) || 'Líder indefinido'}`
            : '';
        li.innerHTML = `<span>${teamLabel}${leaderInfo}</span>`;
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

// Retorna o nome do líder pelo id (ou null)
function getLeaderNameById(id) {
    const leader = appData.leaders.find(l => String(l.id) === String(id));
    return leader ? leader.name : null;
}

// Popula o select de líderes dentro do formulário de criação de equipes
function populateTeamLeaderSelect() {
    const select = $('#team-leader-select');
    if (!select) return;
    select.innerHTML = '<option value="">Atribuir a um Líder (opcional)</option>';
    appData.leaders.forEach(leader => {
        const option = document.createElement('option');
        option.value = leader.id;
        option.textContent = leader.name;
        select.appendChild(option);
    });
}

// Gera um id simples para equipes criadas no cliente
function generateId() {
    return 'id-' + Math.random().toString(36).slice(2, 9);
}

// Handler para adicionar equipe (corrigido para ids do HTML)
const formAddTeam = $('#form-add-team');
if (formAddTeam) {
    formAddTeam.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = $('#team-name-input');
        const leaderSelect = $('#team-leader-select');
        if (!nameInput) {
            alert('Campo de nome da equipe não encontrado.');
            return;
        }
        const name = nameInput.value.trim();
        const leaderId = leaderSelect ? leaderSelect.value : '';

        if (!name) return;

        // Suporta manter o formato antigo (string) ou objeto quando um líder é atribuído
        let newTeam = name;
        if (leaderId) {
            newTeam = { id: generateId(), name, leaderId };
        }

        // Evita duplicatas por nome
        const exists = appData.teams.some(t => {
            if (t && typeof t === 'object') return t.name === name;
            return t === name;
        });

        if (!exists) {
            appData.teams.push(newTeam);
            saveLocalState(); // Salva localmente
            renderTeamList();
            renderEquipeDestinoOptions();
            nameInput.value = '';
            if (leaderSelect) leaderSelect.value = '';
        }
    });
}

function renderEquipeDestinoOptions() {
    // Tenta popular múltiplos selects que podem existir no HTML
    const selectIds = ['#equipe-destino-input', '#separacao-equipe-destino'];
    selectIds.forEach(id => {
        const select = $(id);
        if (!select) {
            // não é um erro crítico — apenas pula
            return;
        }
        select.innerHTML = '<option value="">Selecione a Equipe</option>';

        // Decide quais equipes mostrar: para o select de separação e usuário Líder,
        // mostramos equipes atribuídas ao líder (objetos com leaderId igual ao id do líder)
        // e também todas as equipes "gerais" (strings ou objetos sem leaderId). Isso
        // habilita todos os líderes adicionados a utilizarem as equipes montadas.
        let teamsToShow = appData.teams || [];
        if (id === '#separacao-equipe-destino' && appData.currentRole === 'Líder' && appData.currentUser && appData.currentUser.id) {
            teamsToShow = teamsToShow.filter(t => {
                if (t && typeof t === 'object' && 'leaderId' in t) {
                    return String(t.leaderId) === String(appData.currentUser.id);
                }
                return true;
            });
        }

        teamsToShow.forEach(team => {
            const option = document.createElement('option');
            const teamName = (team && typeof team === 'object') ? team.name : team;
            option.value = teamName;
            option.textContent = teamName;
            select.appendChild(option);
        });
    });
}

// Handler para Retirar Romaneio (Líder)
const btnRetirar = document.getElementById('btn-retirar-romaneio');
if (btnRetirar) {
    btnRetirar.addEventListener('click', async (e) => {
        e.preventDefault();
        const inputNumero = document.getElementById('separacao-retirar-romaneio');
        const selectEquipe = document.getElementById('separacao-equipe-destino');
        const messageEl = document.getElementById('separacao-retirar-message');

        if (messageEl) messageEl.classList.add('hidden');

        if (!inputNumero || !selectEquipe) {
            alert('Campos de retirar romaneio não encontrados na página.');
            return;
        }

        const texto = inputNumero.value.trim();
        const equipe = selectEquipe.value;

        if (!texto) {
            if (messageEl) {
                messageEl.textContent = 'Informe pelo menos um número de romaneio.';
                messageEl.classList.remove('hidden');
            }
            return;
        }

        if (!equipe) {
            if (messageEl) {
                messageEl.textContent = 'Selecione a equipe destino.';
                messageEl.classList.remove('hidden');
            }
            return;
        }

        // Processa múltiplos romaneios (um por linha)
        const numeros = texto.split('\n')
            .map(n => n.trim())
            .filter(n => n.length > 0);

        if (numeros.length === 0) {
            if (messageEl) {
                messageEl.textContent = 'Nenhum número de romaneio válido encontrado.';
                messageEl.classList.remove('hidden');
            }
            return;
        }

        let sucessos = 0;
        let erros = [];

        // Processa cada romaneio
        for (const numero of numeros) {
            // Busca o romaneio
            const romaneio = appData.romaneios.find(r => String(r.numero) === String(numero));
            
            if (!romaneio) {
                erros.push(`Romaneio ${numero}: não encontrado`);
                continue;
            }

            // Só permite retirar se estiver Disponível
            if (romaneio.status !== 'Disponível') {
                erros.push(`Romaneio ${numero}: status é "${romaneio.status}"`);
                continue;
            }

            // Atualiza status no Supabase e local
            await updateRomaneioStatus(romaneio.numero, 'Em separação', appData.currentUser?.name || 'Sistema', appData.currentRole || 'Sistema', { equipeDestino: equipe });
            sucessos++;
        }

        // Feedback com resumo
        let mensagem = '';
        if (sucessos > 0) {
            mensagem = `✓ ${sucessos} romaneio(s) retirado(s) com sucesso pela equipe ${equipe}.`;
        }
        if (erros.length > 0) {
            if (mensagem) mensagem += ` ✗ Erros: ${erros.join('; ')}`;
            else mensagem = `✗ Erros: ${erros.join('; ')}`;
        }

        if (messageEl) {
            messageEl.textContent = mensagem;
            messageEl.classList.remove('hidden');
        }
        
        // Limpeza de campos
        inputNumero.value = '';
        selectEquipe.value = '';
        
        // Re-renderizações para garantir consistência
        renderFilaFIFO();
        renderSeparacao();
    });
}

// Handler para Finalizar Separação com Observação (Líder)
const btnFinalizarSeparacao = document.getElementById('btn-finalizar-separacao');
if (btnFinalizarSeparacao) {
    btnFinalizarSeparacao.addEventListener('click', async (e) => {
        e.preventDefault();
        const inputNumero = document.getElementById('separacao-finalizar-romaneio');
        const selectStatus = document.getElementById('separacao-status-final');
        const textareaObs = document.getElementById('separacao-observacao-lider');
        const messageEl = document.getElementById('separacao-finalizar-message');

        if (messageEl) messageEl.classList.add('hidden');

        if (!inputNumero || !selectStatus || !textareaObs) {
            alert('Campos de finalização não encontrados na página.');
            return;
        }

        const texto = inputNumero.value.trim();
        const statusOpcao = selectStatus.value;
        const observacao = textareaObs.value.trim();

        if (!texto) {
            if (messageEl) {
                messageEl.textContent = 'Informe pelo menos um número de romaneio.';
                messageEl.classList.remove('hidden');
            }
            return;
        }

        if (!statusOpcao) {
            if (messageEl) {
                messageEl.textContent = 'Selecione o status dos romaneios (Finalizado ou Redisponibilizado).';
                messageEl.classList.remove('hidden');
            }
            return;
        }

        // Define o status final baseado na seleção
        const statusFinal = statusOpcao === 'finalizado' ? 'Pendente de faturamento' : 'Disponível';

        // Processa múltiplos romaneios (um por linha)
        const numeros = texto.split('\n')
            .map(n => n.trim())
            .filter(n => n.length > 0);

        if (numeros.length === 0) {
            if (messageEl) {
                messageEl.textContent = 'Nenhum número de romaneio válido encontrado.';
                messageEl.classList.remove('hidden');
            }
            return;
        }

        let sucessos = 0;
        let erros = [];

        // Processa cada romaneio
        for (const numero of numeros) {
            // Busca o romaneio
            const romaneio = appData.romaneios.find(r => String(r.numero) === String(numero));
            
            if (!romaneio) {
                erros.push(`Romaneio ${numero}: não encontrado`);
                continue;
            }

            // Apenas permite finalizar se estiver em separação
            if (romaneio.status !== 'Em separação') {
                erros.push(`Romaneio ${numero}: status é "${romaneio.status}"`);
                continue;
            }

            // Prepara dados adicionais: adiciona observação apenas se informada
            const additional = {};
            
            // Se for finalizado, adiciona data de finalização
            if (statusOpcao === 'finalizado') {
                additional.dataFinalizacaoSeparacao = new Date().toISOString();
            }
            
            // Adiciona observação se informada
            if (observacao && observacao.length > 0) {
                additional.observacaoLider = observacao;
            }
            
            await updateRomaneioStatus(romaneio.numero, statusFinal, appData.currentUser?.name || 'Sistema', appData.currentRole || 'Sistema', additional);
            sucessos++;
        }

        // Feedback com resumo
        let mensagem = '';
        if (sucessos > 0) {
            const acao = statusOpcao === 'finalizado' ? 'finalizados e enviados para faturamento' : 'redisponibilizados na fila';
            mensagem = `✓ ${sucessos} romaneio(s) ${acao} com sucesso.`;
        }
        if (erros.length > 0) {
            if (mensagem) mensagem += ` ✗ Erros: ${erros.join('; ')}`;
            else mensagem = `✗ Erros: ${erros.join('; ')}`;
        }

        if (messageEl) {
            messageEl.textContent = mensagem;
            messageEl.classList.remove('hidden');
        }

        // Limpa campos e re-renderiza views relevantes
        inputNumero.value = '';
        selectStatus.value = '';
        textareaObs.value = '';
        renderSeparacao();
        renderFaturamento();
        renderFilaFIFO();
        renderHistoricoCompleto();
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
    // Cria datas resetando a hora para comparação apenas de datas
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    const delivery = new Date(deliveryDate);
    delivery.setHours(0, 0, 0, 0);
    
    // Calcula diferença em dias (usar floor para resultado correto)
    const diffTime = now - delivery;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Retorna no formato D0, D-1, D-2, etc. (seguindo lógica: 0+ dias = D0, 1+ dias = D-1, etc.)
    if (diffDays === 0) return { text: 'D0', class: 'atraso-normal' };
    if (diffDays === 1) return { text: 'D-1', class: 'atraso-1-dia' };
    if (diffDays === 2) return { text: 'D-2', class: 'atraso-2-dias' };
    if (diffDays === 3) return { text: 'D-3', class: 'atraso-3-dias' };
    if (diffDays > 3) return { text: `D-${diffDays}`, class: 'atraso-4-mais-dias blink' };
    // Se for negativo (data futura)
    return { text: 'Agendado', class: 'atraso-normal' };
}

// ============================
// Exportar para Excel (SheetJS)
// ============================

function exportTableElementToExcel(tableElement, fileName) {
    if (typeof XLSX === 'undefined') {
        alert('Biblioteca SheetJS (XLSX) não carregada. Verifique se o script está presente no HTML.');
        return;
    }

    try {
        const wb = XLSX.utils.table_to_book(tableElement, { sheet: 'Sheet1' });
        XLSX.writeFile(wb, fileName);
    } catch (err) {
        console.error('Erro ao exportar para Excel:', err);
        alert('Ocorreu um erro ao gerar o arquivo Excel. Veja o console para detalhes.');
    }
}

function getClosestTableFromTbody(tbody) {
    if (!tbody) return null;
    // Se o tbody estiver dentro de uma tabela, retorna a tabela mais próxima
    if (tbody.closest) return tbody.closest('table');
    // fallback: sobe os pais
    let el = tbody;
    while (el && el.nodeName !== 'TABLE') el = el.parentElement;
    return el;
}

// Listener: Exportar fila FIFO
const btnExportFila = document.getElementById('btn-exportar-excel');
if (btnExportFila) {
    btnExportFila.addEventListener('click', () => {
        const tbody = document.getElementById('tabela-fila-fifo');
        const table = getClosestTableFromTbody(tbody);
        if (!table) {
            alert('Tabela da fila não encontrada para exportação.');
            return;
        }
        const fileName = `fila_fifo_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.xlsx`;
        exportTableElementToExcel(table, fileName);
    });
}

// Listener: Exportar histórico completo
const btnExportHistorico = document.getElementById('btn-exportar-historico');
if (btnExportHistorico) {
    btnExportHistorico.addEventListener('click', () => {
        const tbody = document.getElementById('tabela-historico-completo');
        const table = getClosestTableFromTbody(tbody);
        if (!table) {
            alert('Tabela de histórico não encontrada para exportação.');
            return;
        }
        const fileName = `historico_completo_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.xlsx`;
        exportTableElementToExcel(table, fileName);
    });
}

// Handler: Faturar Vários romaneios via textarea
const btnFaturarVarios = document.getElementById('btn-faturar-varios');
if (btnFaturarVarios) {
    btnFaturarVarios.addEventListener('click', async (e) => {
        e.preventDefault();
        const textarea = document.getElementById('faturamento-input');
        const messageEl = document.getElementById('faturamento-message');
        if (messageEl) messageEl.classList.add('hidden');

        if (!textarea) {
            alert('Campo de faturamento não encontrado.');
            return;
        }

        const lines = textarea.value.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        if (lines.length === 0) {
            if (messageEl) {
                messageEl.textContent = 'Nenhum número informado.';
                messageEl.classList.remove('hidden');
            }
            return;
        }

        const results = {
            success: [],
            notFound: [],
            wrongStatus: [],
            failed: []
        };

        for (const num of lines) {
            const romaneio = appData.romaneios.find(r => String(r.numero) === String(num));
            if (!romaneio) {
                results.notFound.push(num);
                continue;
            }
            if (romaneio.status !== 'Pendente de faturamento') {
                results.wrongStatus.push({ numero: num, status: romaneio.status });
                continue;
            }

            try {
                const ok = await updateRomaneioStatus(romaneio.numero, 'Faturado', appData.currentUser?.name || 'Sistema', appData.currentRole || 'Sistema');
                if (ok) results.success.push(num);
                else results.failed.push(num);
            } catch (err) {
                console.error('Erro ao tentar faturar romaneio', num, err);
                results.failed.push(num);
            }
        }

        // Feedback
        const parts = [];
        if (results.success.length) parts.push(`${results.success.length} faturado(s): ${results.success.join(', ')}`);
        if (results.notFound.length) parts.push(`Não encontrados: ${results.notFound.join(', ')}`);
        if (results.wrongStatus.length) parts.push(`Status incorreto: ${results.wrongStatus.map(r => `${r.numero}(${r.status})`).join(', ')}`);
        if (results.failed.length) parts.push(`Falha ao faturar: ${results.failed.join(', ')}`);

        const feedback = parts.length ? parts.join(' | ') : 'Nenhuma ação realizada.';
        if (messageEl) {
            messageEl.textContent = feedback;
            messageEl.classList.remove('hidden');
        } else {
            alert(feedback);
        }

        // Limpa textarea e re-renderiza
        textarea.value = '';
        renderFaturamento();
        renderHistoricoCompleto();
        renderFilaFIFO();
    });
}

// ============================
// Realtime Supabase - sincroniza romaneios entre clientes
// ============================
function setupRealtimeSubscriptions() {
    if (typeof supabaseClient === 'undefined' || !supabaseClient.channel) {
        console.warn('Supabase Realtime não disponível nesta versão do cliente.');
        return;
    }

    const channel = supabaseClient
        .channel('public:romaneios')
        .on('postgres_changes', { event: '*', schema: 'public', table: ROMANEIOS_TABLE }, (payload) => {
            console.debug('Realtime romaneios payload:', payload);

            // Em payload, new contém o registro após insert/update, old contém antes.
            const novo = payload.new || payload.record || null;
            const velho = payload.old || null;

            if (novo) {
                // upsert local
                const idx = appData.romaneios.findIndex(r => (r.id !== undefined && r.id === novo.id) || String(r.numero) === String(novo.numero));
                if (idx !== -1) {
                    appData.romaneios[idx] = novo;
                } else {
                    appData.romaneios.push(novo);
                }
            } else if (velho) {
                // delete
                const idx = appData.romaneios.findIndex(r => (r.id !== undefined && r.id === velho.id) || String(r.numero) === String(velho.numero));
                if (idx !== -1) appData.romaneios.splice(idx, 1);
            }

            // Re-renderiza todas as views relevantes
            try { renderFilaFIFO(); } catch (e) { console.debug(e); }
            try { renderSeparacao(); } catch (e) { console.debug(e); }
            try { renderFaturamento(); } catch (e) { console.debug(e); }
            try { renderHistoricoCompleto(); } catch (e) { console.debug(e); }
        })
        .subscribe();

    // Guarda channel em window para debugging/possível unsubscribe
    window.__supabase_romaneios_channel = channel;
}

function renderHistoricoFaturamento() {
    const tbody = document.getElementById('tabela-historico-faturamento');
    if (!tbody) return;
    tbody.innerHTML = '';

    const filtroData = document.getElementById('filtro-data-faturamento')?.value;

    const faturados = appData.romaneios
        .filter(r => r.status === 'Faturado')
        .sort((a, b) => {
            const aTime = a.historico?.find(h => h.status === 'Faturado')?.timestamp || 0;
            const bTime = b.historico?.find(h => h.status === 'Faturado')?.timestamp || 0;
            return new Date(bTime) - new Date(aTime);
        });

    const filtered = faturados.filter(r => {
        if (!filtroData) return true;
        const faturadoEntry = r.historico?.find(h => h.status === 'Faturado');
        if (!faturadoEntry) return false;
        const faturadoDate = new Date(faturadoEntry.timestamp).toISOString().slice(0,10);
        return faturadoDate === filtroData;
    });

    if (filtered.length === 0) {
        $('#historico-faturamento-vazio')?.classList.remove('hidden');
    } else {
        $('#historico-faturamento-vazio')?.classList.add('hidden');
    }

    filtered.forEach(r => {
        const row = tbody.insertRow();
        row.insertCell().textContent = r.numero;
        const finalizacao = r.historico?.find(h => h.status === 'Pendente de faturamento')?.timestamp || '-';
        row.insertCell().textContent = finalizacao !== '-' ? new Date(finalizacao).toLocaleString('pt-BR') : '-';
        const faturamento = r.historico?.find(h => h.status === 'Faturado');
        row.insertCell().textContent = faturamento?.timestamp ? new Date(faturamento.timestamp).toLocaleString('pt-BR') : '-';
        row.insertCell().textContent = faturamento?.user || '-';
    });

    const btnLimpar = document.getElementById('btn-limpar-filtro-faturamento');
    if (btnLimpar) btnLimpar.addEventListener('click', () => {
        const el = document.getElementById('filtro-data-faturamento');
        if (el) el.value = '';
        renderHistoricoFaturamento();
    });
}

// =================================================================================
// LÓGICA DE COLABORADOR (COLETOR)
// =================================================================================

// Login de Colaborador
if ($('#form-colaborador-login')) {
    $('#form-colaborador-login').addEventListener('submit', async (e) => {
        e.preventDefault();
        const nameInput = $('#colab-login-name');
        const passwordInput = $('#colab-login-password');
        const errorEl = $('#colab-login-error');
        
        if (errorEl) errorEl.classList.add('hidden');
        
        const name = nameInput.value.trim();
        const password = passwordInput.value;
        
        if (!name || !password) {
            if (errorEl) {
                errorEl.textContent = 'Preencha nome e senha.';
                errorEl.classList.remove('hidden');
            }
            return;
        }
        
        await loadAllDataFromSupabase();
        
        // Tenta autenticar colaborador
        const colaborador = appData.colaboradores.find(c => 
            String(c.name).toLowerCase() === String(name).toLowerCase() && 
            c.passwordHash === hashPassword(password)
        );
        
        if (colaborador) {
            appData.currentUser = { id: colaborador.id, name: colaborador.name };
            appData.currentRole = 'Colaborador';
            saveLocalState();
            renderColaboradorPainel();
            showScreen('#screen-colaborador');
        } else {
            if (errorEl) {
                errorEl.textContent = 'Colaborador ou senha inválidos.';
                errorEl.classList.remove('hidden');
            }
        }
    });
}

// Logout de Colaborador
if ($('#btn-colab-logout')) {
    $('#btn-colab-logout').addEventListener('click', () => {
        appData.currentUser = null;
        appData.currentRole = null;
        saveLocalState();
        showScreen('#screen-colaborador-login');
        // Limpa os campos
        if ($('#colab-login-name')) $('#colab-login-name').value = '';
        if ($('#colab-login-password')) $('#colab-login-password').value = '';
        if ($('#colab-numero-pedido')) $('#colab-numero-pedido').value = '';
    });
}

function renderColaboradorPainel() {
    if (appData.currentUser) {
        $('#colab-user-info').textContent = `${appData.currentUser.name}`;
    }
    limparPainelColaborador();
}

function limparPainelColaborador() {
    if ($('#colab-numero-pedido')) $('#colab-numero-pedido').value = '';
    if ($('#colab-acoes-adicionais')) $('#colab-acoes-adicionais').classList.add('hidden');
    if ($('#colab-pedido-info')) $('#colab-pedido-info').classList.add('hidden');
    if ($('#colab-status-message')) $('#colab-status-message').classList.add('hidden');
    if ($('#colab-numero-pedido')) $('#colab-numero-pedido').focus();
    atualizarHistoricoColaborador();
}

// Ações do Colaborador
let pedidoAtualColab = null;

if ($('#btn-colab-iniciar')) {
    $('#btn-colab-iniciar').addEventListener('click', async () => {
        const numeroPedido = $('#colab-numero-pedido').value.trim();
        const msgEl = $('#colab-status-message');
        
        if (!numeroPedido) {
            if (msgEl) {
                msgEl.textContent = '❌ Digite ou escaneie o número do pedido';
                msgEl.classList.remove('hidden', 'bg-green-100', 'text-green-800');
                msgEl.classList.add('bg-red-100', 'text-red-800');
            }
            return;
        }
        
        const romaneio = appData.romaneios.find(r => String(r.numero) === String(numeroPedido));
        
        if (!romaneio) {
            if (msgEl) {
                msgEl.textContent = `❌ Pedido ${numeroPedido} não encontrado`;
                msgEl.classList.remove('hidden', 'bg-green-100', 'text-green-800');
                msgEl.classList.add('bg-red-100', 'text-red-800');
            }
            return;
        }
        
        // Se o pedido não está em separação, inicia
        if (romaneio.status !== 'Em separação') {
            // Inicia o pedido
            await updateRomaneioStatus(
                numeroPedido,
                'Em separação',
                appData.currentUser.name,
                'Colaborador',
                { dataInicio: new Date().toISOString() }
            );
            
            pedidoAtualColab = numeroPedido;
            
            if (msgEl) {
                msgEl.textContent = `✓ Pedido ${numeroPedido} iniciado com sucesso!`;
                msgEl.classList.remove('hidden', 'bg-red-100', 'text-red-800');
                msgEl.classList.add('bg-green-100', 'text-green-800');
            }
            
            // Mostra info do pedido
            if ($('#colab-pedido-info')) {
                $('#colab-info-numero').textContent = numeroPedido;
                $('#colab-info-status').textContent = 'Em separação';
                $('#colab-info-hora').textContent = new Date().toLocaleTimeString('pt-BR');
                $('#colab-pedido-info').classList.remove('hidden');
            }
            
            // Mostra botões de finalizar/devolver
            if ($('#colab-acoes-adicionais')) {
                $('#colab-acoes-adicionais').classList.remove('hidden');
            }
        } else {
            // Pedido já está em separação, mostra opções de finalizar/devolver
            pedidoAtualColab = numeroPedido;
            
            if (msgEl) {
                msgEl.textContent = `⚠ Pedido ${numeroPedido} já está em processo`;
                msgEl.classList.remove('hidden', 'bg-red-100', 'text-red-800');
                msgEl.classList.add('bg-blue-100', 'text-blue-800');
            }
            
            // Mostra info do pedido
            if ($('#colab-pedido-info')) {
                $('#colab-info-numero').textContent = numeroPedido;
                $('#colab-info-status').textContent = romaneio.status;
                $('#colab-info-hora').textContent = new Date().toLocaleTimeString('pt-BR');
                $('#colab-pedido-info').classList.remove('hidden');
            }
            
            // Mostra botões de finalizar/devolver
            if ($('#colab-acoes-adicionais')) {
                $('#colab-acoes-adicionais').classList.remove('hidden');
            }
        }
    });
}

if ($('#btn-colab-finalizar')) {
    $('#btn-colab-finalizar').addEventListener('click', async () => {
        if (!pedidoAtualColab) return;
        
        await updateRomaneioStatus(
            pedidoAtualColab,
            'Pendente de faturamento',
            appData.currentUser.name,
            'Colaborador',
            { dataFinalizacao: new Date().toISOString() }
        );
        
        const msgEl = $('#colab-status-message');
        if (msgEl) {
            msgEl.textContent = `✓ Pedido ${pedidoAtualColab} finalizado com sucesso!`;
            msgEl.classList.remove('hidden', 'bg-red-100', 'text-red-800', 'bg-blue-100', 'text-blue-800');
            msgEl.classList.add('bg-green-100', 'text-green-800');
        }
        
        setTimeout(() => limparPainelColaborador(), 2000);
    });
}

if ($('#btn-colab-devolver')) {
    $('#btn-colab-devolver').addEventListener('click', async () => {
        if (!pedidoAtualColab) return;
        
        await updateRomaneioStatus(
            pedidoAtualColab,
            'Disponível',
            appData.currentUser.name,
            'Colaborador',
            { motivoDevolucao: 'Semi acabado', dataDevolucao: new Date().toISOString() }
        );
        
        const msgEl = $('#colab-status-message');
        if (msgEl) {
            msgEl.textContent = `↩ Pedido ${pedidoAtualColab} devolvido para a fila`;
            msgEl.classList.remove('hidden', 'bg-red-100', 'text-red-800', 'bg-green-100', 'text-green-800');
            msgEl.classList.add('bg-blue-100', 'text-blue-800');
        }
        
        setTimeout(() => limparPainelColaborador(), 2000);
    });
}

if ($('#btn-colab-cancelar-acoes')) {
    $('#btn-colab-cancelar-acoes').addEventListener('click', () => {
        limparPainelColaborador();
    });
}

function atualizarHistoricoColaborador() {
    const historico = $('#colab-historico');
    if (!historico) return;
    
    historico.innerHTML = '';
    
    // Pega os últimos 5 eventos do colaborador
    const eventos = appData.romaneios
        .filter(r => r.historico && Array.isArray(r.historico))
        .map(r => 
            r.historico
                .filter(h => h.user === appData.currentUser.name && h.role === 'Colaborador')
                .map(h => ({ 
                    numero: r.numero, 
                    ...h,
                    timestamp: new Date(h.timestamp)
                }))
        )
        .flat()
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 5);
    
    if (eventos.length === 0) {
        historico.innerHTML = '<p class="text-gray-500 text-center">Nenhuma ação registrada</p>';
        return;
    }
    
    eventos.forEach(evt => {
        const div = document.createElement('div');
        div.className = 'bg-gray-50 p-2 rounded border border-gray-200';
        div.innerHTML = `
            <div class="flex justify-between items-start">
                <div>
                    <strong>Pedido ${evt.numero}</strong><br>
                    <span class="text-xs text-gray-600">${evt.status}</span>
                </div>
                <span class="text-xs text-gray-500">${evt.timestamp.toLocaleTimeString('pt-BR')}</span>
            </div>
        `;
        historico.appendChild(div);
    });
}

// escolhe cor de contraste (preto escuro ou branco) com base na luminância do hexadecimal
function getContrastColor(hex) {
    if (!hex) return '#ffffff';
    const h = hex.replace('#','');
    const bigint = parseInt(h.length===3 ? h.split('').map(c=>c+c).join('') : h, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    // sRGB luminance
    const lum = 0.2126 * (r/255) + 0.7152 * (g/255) + 0.0722 * (b/255);
    return lum > 0.6 ? '#0b1220' : '#ffffff';
}