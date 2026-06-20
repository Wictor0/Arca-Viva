// Autoria da Documentação e Comentários: Ana Clara (https://github.com/aclyra)
import React from 'react';
// Importação do componente Link do react-router-dom para navegação interna sem recarregar a página
import { Link } from 'react-router-dom';

// Importação do banner de arte principal que ilustra a abertura do site
import bannerArte from '../assets/inicio.jpg'; 

export const Home = () => {
  return (
    <main>
      {/* Banner de destaque no topo da página inicial */}
      <img 
        src={bannerArte} 
        alt="Arca Viva - Especialista em Animais" 
        className="banner-topo" 
      />

      <section className="about-section" style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', letterSpacing: '2px' }}>
          Protegendo o Futuro da Biodiversidade
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
          A Arca Viva une tecnologia e paixão pela natureza para monitorar espécies 
          em risco. De Pernambuco para os biomas mais remotos, nossa missão é 
          garantir que a vida prevaleça.
        </p>

        {/* Bloco de Chamada para Ação (CTA - Call To Action) direcionando o usuário para a ferramenta principal */}
        <div className="home-cta">
          <h2 style={{ color: '#23346C', marginBottom: '15px' }}>
            Ciência a favor da Vida
          </h2>
          <p>
            Nosso sistema utiliza os critérios técnicos que você ajudou a definir 
            para calcular o risco de extinção em tempo real.
          </p>
          
          {/* Botão de navegação estilizado inline com pseudo-efeitos controlados por funções JavaScript */}
          <Link 
            to="/analise" 
            style={{
              display: 'inline-block',
              marginTop: '30px',
              padding: '18px 50px',
              backgroundColor: '#192651',
              color: '#fafaef',
              borderRadius: '50px',
              fontWeight: '600',
              fontSize: '1.1rem',
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              boxShadow: '0 10px 20px rgba(25, 38, 81, 0.3)',
              transition: 'all 0.3s ease',
              opacity: 1
            }}
            // Efeito Hover: Executa quando o mouse passa por cima do botão (eleva o elemento e aumenta a sombra)
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 15px 25px rgba(25, 38, 81, 0.4)';
            }}
            // Efeito Reset: Executa quando o mouse sai de cima do botão (retorna ao estado visual original)
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 10px 20px rgba(25, 38, 81, 0.3)';
            }}
          >
            Acessar Sistema de Análise
          </Link>
        </div>
      </section>
    </main>
  );
};
