// Autoria da Documentação e Comentários: Ana Clara (https://github.com/aclyra)
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { calcularRiscoExtincao } from '../utils/analiseLogic'; // Importa a lógica matemática do cálculo de risco
import { supabase } from '../lib/supabase'; // Importa o cliente de conexão com o banco de dados Supabase

import bannerAnalise from '../assets/analise.jpg';

export const Analise = ({ session }) => {
  const [racas, setRacas] = useState([]); // Lista principal de espécies vindas do banco
  const [carregando, setCarregando] = useState(true); // Controle visual de "Carregando dados..."
  const [salvando, setSalvando] = useState(false); // Desativa botões enquanto o banco salva dados
  const [erro, setErro] = useState(null); // Armazena mensagens de erro para o usuário
  const [filtro, setFiltro] = useState(''); // Armazena o texto digitado na barra de busca
  
  const [idEditando, setIdEditando] = useState(null); // Controla se o usuário está criando ou editando um registro

  // Estado do formulário estruturado para capturar os inputs textuais e critérios numéricos (c1 a c4)
  const [formData, setFormData] = useState({
    nome: '', especie: '', pais: '',
    c1: 0, c2: 0, c3: 0, c4: 0
  });

  // useEffect criado para disparar a busca de dados no banco assim que a página é aberta
  useEffect(() => {
    const buscarRacas = async () => {
      setCarregando(true);
       // Consulta ao banco Supabase unindo a tabela 'racas' com os nomes dos pesquisadores na tabela 'perfis'
      const { data, error } = await supabase
        .from('racas')
        .select('*, perfis(nome_completo)')
        .order('created_at', { ascending: false }); // Ordena os cadastros mais recentes primeiro

      if (error) {
        setErro('Erro ao carregar dados do banco.');
        console.error(error);
      } else {
        setRacas(data); // Alimenta o estado com as raças encontradas
      }
      setCarregando(false);
    };

    buscarRacas();
  }, []);

  // Prepara o formulário com os dados da raça escolhida e faz um scroll suave até a área de edição
  const iniciarEdicao = (raca) => {
    setFormData({
      nome: raca.nome,
      especie: raca.especie,
      pais: raca.pais_origem,
      c1: raca.c1,
      c2: raca.c2,
      c3: raca.c3,
      c4: raca.c4
    });
    setIdEditando(raca.id_raca);

    // Timer para garantir que o formulário apareça antes da página rolar de forma automatizada
    setTimeout(() => {
      const formElement = document.getElementById('formulario-cadastro');
      if (formElement) {
        const y = formElement.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 100);
  };

  // Limpa o formulário e tira o sistema do modo de edição
  const cancelarEdicao = () => {
    setFormData({ nome: '', especie: '', pais: '', c1: 0, c2: 0, c3: 0, c4: 0 });
    setIdEditando(null);
    setErro(null);
  };

  // Processa o envio dos dados do formulário para o Supabase (Insert ou Update)
  const lidarComEnvio = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setErro(null);
    
  // Executa a lógica de cálculo de pontuação baseada nas respostas sim/não dos 4 critérios
    const analise = calcularRiscoExtincao(formData.c1, formData.c2, formData.c3, formData.c4);

    // Montagem do objeto payload que será gravado nas colunas do banco de dados
    const payload = {
      nome: formData.nome,
      especie: formData.especie,
      pais_origem: formData.pais,
      c1: Number(formData.c1),
      c2: Number(formData.c2),
      c3: Number(formData.c3),
      c4: Number(formData.c4),
      pontuacao: analise.pontuacao,
      risco_extincao: analise.riscoDeExtincao,
      em_alerta: analise.emAlerta
    };

    if (idEditando) {
      // Caso esteja editando, executa uma query de UPDATE filtrando pelo ID da raça
      const { data, error } = await supabase
        .from('racas')
        .update(payload)
        .eq('id_raca', idEditando)
        .select('*, perfis(nome_completo)');

      if (error) {
        setErro('Erro ao atualizar. Tente novamente.');
        console.error(error);
      } else {
        // Atualiza a lista na interface substituindo apenas o item modificado
        setRacas(racas.map(r => r.id_raca === idEditando ? data[0] : r));
        cancelarEdicao();
      }
    } else {
      // Caso contrário, executa uma query de INSERT para incluir a nova espécie
      const { data, error } = await supabase
        .from('racas')
        .insert([payload])
        .select('*, perfis(nome_completo)');

      if (error) {
        setErro('Erro ao salvar. Tente novamente.');
        console.error(error);
      } else {
        // Adiciona o novo registro no topo da lista exibida na tela
        setRacas([data[0], ...racas]);
        cancelarEdicao();
      }
    }

    setSalvando(false);
  };

  // Remove um registro do banco de dados após a confirmação do pesquisador
  const lidarComDelete = async (id) => {
    const confirmar = window.confirm("Tem certeza que deseja deletar esta espécie?");
    if (!confirmar) return;

    const { error } = await supabase.from('racas').delete().eq('id_raca', id);
    if (error) {
      alert("Erro ao deletar: " + error.message);
    } else {
      // Remove o item excluído da visualização em tempo real (Filtro por ID)
      setRacas(racas.filter(r => r.id_raca !== id));
      if (idEditando === id) cancelarEdicao(); 
    }
  };

  // Realiza a filtragem em tempo real na lista conforme o usuário digita na busca (ignora maiúsculas/minúsculas)
  const racasFiltradas = racas.filter(r =>
    r.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <main>
      <img src={bannerAnalise} alt="Banner Análise" className="banner-topo" />

      <section className="analysis-section">
        <h1>Sistema de Análise de Raças</h1>
        <p>Esta página demonstra as funcionalidades do nosso sistema de análise de risco de extinção, baseado na lógica de pontuação e cadastro do nosso código-fonte.</p>

        <h2>1. Critérios de Análise de Risco</h2>
        <p>Para cada raça cadastrada, aplicamos 4 critérios baseados em perguntas (Sim/Não). Perguntas 1 e 2 adicionam 1 ponto; 3 e 4 adicionam 2 pontos.</p>
        <ul className="analysis-criteria">
          <li><strong>Critério 1 (1 pt):</strong> População em declínio acentuado?</li>
          <li><strong>Critério 2 (1 pt):</strong> Distribuição geográfica severamente fragmentada?</li>
          <li><strong>Critério 3 (2 pts):</strong> População total estimada em menos de 250 indivíduos maduros?</li>
          <li><strong>Critério 4 (2 pts):</strong> Probabilidade de extinção na natureza de pelo menos 50% em 10 anos?</li>
        </ul>
        <div className="resultado-info" style={{ marginBottom: '10px' }}>
          🔔 <span><strong>Resultado:</strong> Se a pontuação total for <strong>maior ou igual a 5</strong>, a espécie é marcada como "Em Risco de Extinção".</span>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#666', fontStyle: 'italic', marginBottom: '30px' }}>
          * Fonte dos critérios de cálculo de risco: Baseado na Metodologia da IUCN Red List (Critérios v3.1).
        </p>

        <h2 id="formulario-cadastro">
          {idEditando ? '2. Editando Raça' : '2. Cadastro de Nova Raça'}
        </h2>
        
        {!session ? (
          <div style={{ padding: '20px', background: '#f8f9fa', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center', marginBottom: '30px' }}>
            <p style={{ marginBottom: '10px' }}>Somente pesquisadores cadastrados podem adicionar ou alterar espécies no banco de dados.</p>
            <Link to="/login" style={{ display: 'inline-block', padding: '10px 20px', background: '#00784f', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
              Fazer Login ou Cadastrar
            </Link>
          </div>
        ) : (
          <>
            <p>Use o formulário abaixo para {idEditando ? 'atualizar' : 'cadastrar'} os dados necessários (Nome, Espécie, País de Origem, e Critérios de Risco).</p>

            {erro && <p className="msg-erro">{erro}</p>}

            <form className="analysis-form" onSubmit={lidarComEnvio}>
              <div className="form-group">
                <label>Nome da Raça</label>
                <input
                  type="text"
                  value={formData.nome}
                  required
                  placeholder="Ex: Lobo-guará"
                  onChange={e => setFormData({ ...formData, nome: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Espécie</label>
                <input
                  type="text"
                  value={formData.especie}
                  required
                  placeholder="Ex: Chrysocyon brachyurus"
                  onChange={e => setFormData({ ...formData, especie: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>País de Origem</label>
                <input
                  type="text"
                  value={formData.pais}
                  required
                  placeholder="Ex: Brasil"
                  onChange={e => setFormData({ ...formData, pais: e.target.value })}
                />
              </div>

              <div className="form-selects-row">
                <div className="form-group">
                  <label>População em declínio?</label>
                  <select value={formData.c1} onChange={e => setFormData({ ...formData, c1: e.target.value })}>
                    <option value="0">Não</option>
                    <option value="1">Sim</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Distribuição fragmentada?</label>
                  <select value={formData.c2} onChange={e => setFormData({ ...formData, c2: e.target.value })}>
                    <option value="0">Não</option>
                    <option value="1">Sim</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Menos de 250 maduros?</label>
                  <select value={formData.c3} onChange={e => setFormData({ ...formData, c3: e.target.value })}>
                    <option value="0">Não</option>
                    <option value="1">Sim</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Risco ≥ 50% em 10 anos?</label>
                  <select value={formData.c4} onChange={e => setFormData({ ...formData, c4: e.target.value })}>
                    <option value="0">Não</option>
                    <option value="1">Sim</option>
                  </select>
                </div>
              </div>

              <div style={{ gridColumn: '1 / -1', justifySelf: 'end', display: 'flex', gap: '10px' }}>
                {idEditando && (
                  <button 
                    type="button" 
                    onClick={cancelarEdicao} 
                    disabled={salvando} 
                    style={{
                      backgroundColor: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '0 24px',
                      height: '36px',
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '0.88rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Cancelar
                  </button>
                )}
                <button type="submit" disabled={salvando}>
                  {salvando ? 'Processando...' : (idEditando ? 'Atualizar Raça' : 'Analisar e Salvar')}
                </button>
              </div>
            </form>
          </>
        )}

        <section>
          <h2>3. Dashboard de Risco de Extinção</h2>
          <p>Distribuição de todas as espécies cadastradas por categoria de risco.</p>
          <div className="bubble-chart-area">
            <div className="bubble bubble-cr">
              <strong>{racas.filter(r => r.risco_extincao).length}</strong>
              <span>Em Risco</span>
            </div>
            <div className="bubble bubble-lc">
              <strong>{racas.filter(r => !r.risco_extincao && !r.em_alerta).length}</strong>
              <span>Seguros</span>
            </div>
            <div className="bubble bubble-nt">
              <strong>{racas.filter(r => r.em_alerta).length}</strong>
              <span>Em Alerta</span>
            </div>
          </div>
        </section>

        <section className="list-section">
          <h2>4. Lista Completa de Espécies</h2>
          <p>Todas as espécies cadastradas com Nome, Espécie, País, Categoria e Pontuação de Risco.</p>

          <div className="list-filter-row">
            <input
              type="text"
              placeholder="Digite o nome da raça..."
              value={filtro}
              onChange={e => setFiltro(e.target.value)}
            />
            {filtro && <button onClick={() => setFiltro('')}>Limpar</button>}
          </div>

          <div className="data-list">
            <div className="data-header" style={{ display: 'grid', gridTemplateColumns: session ? '2fr 1.5fr 1.5fr 1fr 1fr 1.5fr' : '2fr 1.5fr 1.5fr 1fr 1fr' }}>
              <strong>Nome</strong>
              <strong>Espécie</strong>
              <strong>Pesquisador</strong>
              <strong>Status</strong>
              <strong>Pontos</strong>
              {session && <strong>Ação</strong>}
            </div>

            {carregando ? (
              <p style={{ padding: '20px', color: '#555' }}>Carregando dados...</p>
            ) : racasFiltradas.length === 0 ? (
              <p style={{ padding: '20px', color: '#555' }}>
                {filtro ? 'Nenhuma raça encontrada.' : 'Nenhuma raça cadastrada ainda.'}
              </p>
            ) : (
              racasFiltradas.map(raca => (
                <div key={raca.id_raca} className="data-row" style={{ display: 'grid', gridTemplateColumns: session ? '2fr 1.5fr 1.5fr 1fr 1fr 1.5fr' : '2fr 1.5fr 1.5fr 1fr 1fr', alignItems: 'center' }}>
                  <span>{raca.nome}</span>
                  <span style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>{raca.especie}</span>
                  
                  <span style={{ fontSize: '0.85rem', color: '#666' }}>
                    {raca.perfis?.nome_completo || 'Desconhecido'}
                  </span>

                  <span style={{
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    color: raca.risco_extincao ? '#ef4782' : raca.em_alerta ? '#f59e0b' : '#00784f'
                  }}>
                    {raca.risco_extincao ? 'CRÍTICO' : raca.em_alerta ? 'ALERTA' : 'ESTÁVEL'}
                  </span>
                  <span style={{ fontSize: '0.9rem' }}>{raca.pontuacao} pts</span>
                  
                  {session && session.user.id === raca.criado_por ? (
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button 
                        onClick={() => iniciarEdicao(raca)}
                        style={{ background: '#00784f', color: 'white', border: 'none', padding: '5px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => lidarComDelete(raca.id_raca)}
                        style={{ background: '#ef4782', color: 'white', border: 'none', padding: '5px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                      >
                        Excluir
                      </button>
                    </div>
                  ) : (
                     session && <span></span> 
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </section>
    </main>
  );
};
