// Autoria da Documentação e Comentários: Leticia Barbosa Santos (https://github.com/LetBarbosa)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

/**
 * Componente responsável pelo processo de autenticação do sistema.
 *
 * Funcionalidades:
 * - Login de usuários cadastrados
 * - Cadastro de novos usuários
 * - Armazenamento de metadados do perfil
 * - Redirecionamento automático de usuários autenticados
 * - Exibição de mensagens de erro e sucesso
 */
export function Login({ session }) {

  // Hook utilizado para navegação programática entre rotas
  const navigate = useNavigate();

  // Estado para controlar se a tela atual exibe Login (true) ou Cadastro (false)
  const [isLogin, setIsLogin] = useState(true);

  // Estado responsável por bloquear interações durante operações assíncronas
  const [loading, setLoading] = useState(false);

  // Estado utilizado para armazenar mensagens exibidas ao usuário
  const [message, setMessage] = useState('');

  // Estados que armazenam os valores digitados no formulário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('Estudante');

  /**
   * Monitoramento da sessão do usuário.
   * Caso exista uma sessão ativa, o usuário é redirecionado
   * automaticamente para a área principal do sistema.
   */
  useEffect(() => {
    if (session) {
      navigate('/analise');
    }
  }, [session, navigate]);

  /**
   * Função responsável por processar Login e Cadastro.
   * A operação executada depende do valor armazenado em isLogin.
   */
  const handleSubmit = async (e) => {

    // Impede o comportamento padrão do formulário (recarregar a página)
    e.preventDefault();

    // Ativa indicador de carregamento
    setLoading(true);

    // Limpa mensagens anteriores
    setMessage('');

    if (isLogin) {

      // PROCESSO DE LOGIN

      // Realiza autenticação utilizando email e senha
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setMessage('Erro ao entrar: ' + error.message);
      }

    } else {
      // PROCESSO DE CADASTRO

      const { error } = await supabase.auth.signUp({
        email,
        password,

        options: {

          // Metadados personalizados associados ao usuário
          // para identificação e controle de permissões
          data: {
            nome_completo: nome,
            categoria: categoria
          }
        }
      });

      if (error) {

        setMessage('Erro ao cadastrar: ' + error.message);

      } else {

        setMessage(
          'Cadastro realizado com sucesso! Você já pode fazer login.'
        );

        // Retorna automaticamente para a tela de Login
        setIsLogin(true);
      }
    }

    // Desativa indicador de carregamento
    setLoading(false);
  };

  /**
   * Interface construída com renderização condicional.
   * Os mesmos componentes são reutilizados para Login e Cadastro,
   * reduzindo duplicação de código e facilitando manutenção.
   */
  return (
    <div
      style={{
        padding: '40px',
        maxWidth: '400px',
        margin: '0 auto',
        minHeight: '60vh'
      }}
    >

      {/* Título exibido conforme o modo atual da tela */}
      <h2
        style={{
          textAlign: 'center',
          marginBottom: '20px',
          color: '#00784f'
        }}
      >
        {isLogin ? 'Acesso ao Sistema' : 'Cadastro na Arca Viva'}
      </h2>

      {/* Exibe mensagens apenas quando existe conteúdo em "message" */}
      {message && (
        <div
          style={{
            padding: '10px',
            background: '#e0f7fa',
            color: '#006064',
            marginBottom: '15px',
            borderRadius: '5px'
          }}
        >
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px'
        }}
      >

        {/* Campos exclusivos do processo de cadastro */}
        {!isLogin && (
          <>
            {/* Fragment utilizado para agrupar elementos sem criar uma div extra no DOM */}

            <div>
              <label>Nome Completo</label>

              <input
                type="text"
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  marginTop: '5px'
                }}

                // Campo controlado pelo React
                value={nome}

                // Atualiza o estado conforme o usuário digita
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <div>
              <label>Perfil de Usuário</label>

              <select
                value={categoria}

                // Atualiza a categoria selecionada
                onChange={(e) => setCategoria(e.target.value)}

                style={{
                  width: '100%',
                  padding: '8px',
                  marginTop: '5px'
                }}
              >
                <option value="Estudante">
                  Estudante / Observador
                </option>

                <option value="Pesquisador">
                  Pesquisador / Biólogo
                </option>
              </select>

              <small
                style={{
                  color: '#666',
                  fontSize: '12px'
                }}
              >
                *Apenas pesquisadores podem cadastrar novas espécies no sistema.
              </small>
            </div>
          </>
        )}

        {/* Campos compartilhados entre Login e Cadastro */}
        <div>
          <label>Email</label>

          <input
            type="email"
            required

            // Componente controlado pelo estado email
            value={email}

            // Atualiza o estado sempre que o valor mudar
            onChange={(e) => setEmail(e.target.value)}

            style={{
              width: '100%',
              padding: '8px',
              marginTop: '5px'
            }}
          />
        </div>

        <div>
          <label>
            Senha {isLogin ? '' : '(mín. 6 caracteres)'}
          </label>

          <input
            type="password"
            required

            value={password}

            onChange={(e) => setPassword(e.target.value)}

            style={{
              width: '100%',
              padding: '8px',
              marginTop: '5px'
            }}
          />
        </div>

        {/* Botão responsável por enviar o formulário */}
        <button
          type="submit"
          disabled={loading}

          style={{
            padding: '10px',
            background: '#00784f',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '5px'
          }}
        >
          {loading
            ? 'Processando...'
            : (isLogin ? 'Entrar' : 'Criar Conta')}
        </button>

      </form>

      {/* Alterna entre os modos Login e Cadastro */}
      <div
        style={{
          textAlign: 'center',
          marginTop: '15px'
        }}
      >
        <button
          type="button"

          // Inverte o estado atual para trocar de tela
          onClick={() => setIsLogin(!isLogin)}

          style={{
            background: 'none',
            border: 'none',
            color: '#00784f',
            textDecoration: 'underline',
            cursor: 'pointer'
          }}
        >
          {isLogin
            ? 'Não tem conta? Cadastre-se'
            : 'Já tem conta? Faça Login'}
        </button>
      </div>

    </div>
  );
}
