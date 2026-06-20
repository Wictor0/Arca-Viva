// Autoria da Documentação e Comentários: Ana Clara (https://github.com/aclyra)
import React, { useState, useEffect } from 'react';
// Importação do hook do react-router-dom para fazer redirecionamentos de página via código
import { useNavigate } from 'react-router-dom';
// Importação da instância cliente do Supabase configurada para autenticação e banco de dados
import { supabase } from '../lib/supabase';

export function Login({ session }) {
  const navigate = useNavigate();
  // Estado para controlar se a tela atual exibe o formulário de Login (true) ou de Cadastro (false)
  const [isLogin, setIsLogin] = useState(true);
  // Estado de controle para desativar botões e evitar múltiplos cliques durante requisições assíncronas
  const [loading, setLoading] = useState(false);
  // Estado para armazenar mensagens de erro ou de sucesso destinadas ao usuário
  const [message, setMessage] = useState('');

  // Estados locais criados para capturar os dados informados nos campos do formulário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('Estudante'); // Define 'Estudante' como valor padrão inicial

  // Monitoramento de Sessão: Se o usuário já estiver autenticado, o useEffect o redireciona direto à página de Análise
  useEffect(() => {
    if (session) {
      navigate('/analise');
    }
  }, [session, navigate]);

  // Função centralizada para lidar tanto com o login quanto com o registro de novas contas
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita o comportamento padrão do navegador de recarregar a página
    setLoading(true);
    setMessage('');

    if (isLogin) {
      // PROCESSO DE LOGIN: Autentica o usuário com email e senha usando a API do Supabase Auth
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage('Erro ao entrar: ' + error.message);
    } else {
      // PROCESSO DE CADASTRO: Cria uma nova conta enviando metadados customizados adicionais (options.data)
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            nome_completo: nome,
            categoria: categoria // Informação fundamental para validar se o usuário é Pesquisador ou Estudante
          }
        }
      });

      if (error) {
        setMessage('Erro ao cadastrar: ' + error.message);
      } else {
        setMessage('Cadastro realizado com sucesso! Você já pode fazer login.');
        setIsLogin(true); // Alterna o formulário de volta para o modo Login após o cadastro bem-sucedido
      }
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: '0 auto', minHeight: '60vh' }}>
      {/* Título dinâmico que se adapta ao estado de exibição atual da tela */}
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#00784f' }}>
        {isLogin ? 'Acesso ao Sistema' : 'Cadastro na Arca Viva'}
      </h2>
      
      {/* Renderização condicional do bloco de mensagens (só aparece se houver algum texto no estado 'message') */}
      {message && (
        <div style={{ padding: '10px', background: '#e0f7fa', color: '#006064', marginBottom: '15px', borderRadius: '5px' }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* Renderização condicional dos campos extras: Nome e Categoria só aparecem se 'isLogin' for falso (Modo Cadastro) */}
        {!isLogin && (
          <>
            <div>
              <label>Nome Completo</label>
              <input 
                type="text" 
                required
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
            <div>
              <label>Perfil de Usuário</label>
              <select 
                value={categoria} 
                onChange={(e) => setCategoria(e.target.value)}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              >
                <option value="Estudante">Estudante / Observador</option>
                <option value="Pesquisador">Pesquisador / Biólogo</option>
              </select>
              <small style={{ color: '#666', fontSize: '12px' }}>
                *Apenas pesquisadores podem cadastrar novas espécies no sistema.
              </small>
            </div>
          </>
        )}

        {/* Campos comuns que são compartilhados e exibidos em ambos os modos (Login e Cadastro) */}
        <div>
          <label>Email</label>
          <input 
            type="email" 
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Senha {isLogin ? '' : '(mín. 6 caracteres)'}</label>
          <input 
            type="password" 
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        {/* Botão de envio que altera o rótulo de texto dinamicamente e é desativado durante requisições */}
        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: '10px', background: '#00784f', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px' }}
        >
          {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Criar Conta')}
        </button>
      </form>
      
      {/* Botão inferior alternador responsável por chavear o estado booleano 'isLogin' */}
      <div style={{ textAlign: 'center', marginTop: '15px' }}>
        <button 
          onClick={() => setIsLogin(!isLogin)}
          style={{ background: 'none', border: 'none', color: '#00784f', textDecoration: 'underline', cursor: 'pointer' }}
          type="button"
        >
          {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça Login'}
        </button>
      </div>
    </div>
  );
}
