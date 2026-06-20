// Autoria da Documentação e Comentários: Ana Clara (https://github.com/aclyra)
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { supabase } from './lib/supabase';

// Importação do arquivo de estilização CSS global do aplicativo
import './App.css';

// Importação dos componentes fixos da interface: Barra de Navegação (Navbar) e Rodapé (Footer)
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Importação das páginas que compõem o ecossistema do site Arca-Viva
import { Home } from "./pages/Home";
import { Sobre } from './pages/Sobre';
import { Analise } from './pages/Analise';
import { Contato } from './pages/Contato';
import { Faq } from './pages/Faq';
import { Login } from './pages/Login';

function App() {
  const [session, setSession] = useState(null);

     // Efeito colateral para gerenciar o login e logout assim que o app é carregado
  useEffect(() => {
    // Busca a sessão atual no Supabase logo na primeira inicialização do app
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Escuta em tempo real qualquer mudança no estado de login (se o usuário entrar ou sair)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Limpeza do listener (inscrição) quando o componente é desmontado para evitar problemas de memória
    return () => subscription.unsubscribe();
  }, []);

  return (
 // Inicialização do roteador para gerenciar os caminhos e links das páginas do projeto
    <Router>
      <Navbar session={session} />
      
      <div className="content-wrapper">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/analise" element={<Analise session={session} />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/login" element={<Login session={session} />} />
          
          <Route path="*" element={<Home />} />
        </Routes>
      </div>

      <Footer />
    </Router>
  );
}

// Exportação do componente App como padrão para ser renderizado na inicialização do sistema
export default App;
