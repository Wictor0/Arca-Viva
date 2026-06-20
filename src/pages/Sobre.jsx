// Autoria da Documentação e Comentários: Ana Clara (https://github.com/aclyra)
import React from 'react';

// Importação do banner de imagem correspondente à seção "Sobre Nós"
import bannerSobre from '../assets/sobre.jpg';

export const Sobre = () => {
  return (
    <main>
      {/* Banner estético de cabeçalho para ambientação da página institucional */}
      <img src={bannerSobre} alt="Banner Sobre Nós" className="banner-topo" />
      
      <section className="about-section">
        <h1>Sobre Nós</h1>
        <p>
          Somos uma organização não-governamental brasileira e sem fins lucrativos que trabalha para mudar a 
          atual trajetória de degradação ambiental e promover um futuro mais justo e saudável para todos, no qual 
          sociedade e natureza vivam em harmonia.
        </p>

        <h2>Nossa História</h2>
        <p>
          A Arca Viva nasceu em 2020, da união de um group de biólogos e ativistas ambientais preocupados com 
          o avanço do desmatamento e os impactos das mudanças climáticas.
        </p>
        
        <h2>Nossa Missão</h2>
        <p>
          Nossa missão é contribuir para que a sociedade brasileira conserve a natureza, harmonizando a atividade 
          humana com a conservação da biodiversidade e com o uso racional dos recursos naturais...
        </p>
        
        <h2>Nossa Visão</h2>
        <p>
          Sem a união, o respeito e a celebração da diversidade da natureza e das pessoas é impossível cumprir a nossa 
          missão. Baseamos-nos em um conjunto de valores em comum:
        </p> 

        {/* Lista não ordenada (ul) contendo os pilares éticos e valores defendidos pela ONG Arca Viva */}
        <ul className="lista-valores">
          <li>
            <strong>Coragem:</strong> 
            trabalhamos pela mudança onde ela é necessária e inspiramos as pessoas e instituições a enfrentar as 
            maiores ameaças à natureza.
          </li>
          <li>
            <strong>Integridade:</strong> 
            vivamos os princípios que acreditamos, agindo com integridade, responsabilidade e transparência.
          </li>
          <li>
            <strong>Respeito:</strong> 
            honramos as vozes e o conhecimento de pessoas e comunidades parceiras.
          </li>
          <li>
            <strong>Colaboração:</strong> 
            causamos impacto através do poder de ações coletivas e inovadoras.
          </li>
        </ul>
      </section>
    </main>
  );
};
