// Autoria da Documentação e Comentários: Ana Clara (https://github.com/aclyra)
import React from 'react';

// Importação da imagem de cobertura utilizada no topo da página de FAQ
import bannerFaq from '../assets/faq.jpg';

export const Faq = () => {
  // Array de objetos estruturado para armazenar o banco de dados local das perguntas e respostas do site
  const faqData = [
    {
      id: 1,
      pergunta: "O que é uma afiliação?",
      resposta: "É uma contribuição financeira mensal contínua e regular de um valor pré-determinado feita por pessoas físicas, por tempo indeterminado."
    },
    {
      id: 2,
      pergunta: "Como faço para me afiliar?",
      resposta: "Você pode se afiliar através do nosso site, pelo telefone 0800 000-3060 ou enviando um e-mail para relacionamento@arcavivaong.org.br"
    },
    {
      id: 3,
      pergunta: "Qual o valor mínimo para contribuição?",
      resposta: "Ao colaborar mensalmente com qualquer valor a partir de R$ 30,00, você apoia de maneira recorrente os nossos projetos e faz parte do movimento de pessoas que protegem o planeta."
    },
    {
      id: 4,
      pergunta: "Quais são os benefícios que tenho como afiliado?",
      resposta: "Ao se afiliar, você recebe um kit simbólico com uma carta de agradecimento e carteirinha, além de newsletters mensais, informes especiais e convites para eventos."
    },
    {
      id: 5,
      pergunta: "O que significa um animal estar “em extinção”?",
      resposta: "Significa que a espécie corre risco de desaparecer da natureza, seja por perda de habitat, caça ilegal ou mudanças climáticas."
    },
    {
      id: 6,
      pergunta: "Quais são os principais fatores que levam à extinção de espécies?",
      resposta: "Desmatamento, poluição, tráfico de animais, mudanças climáticas e introdução de espécies invasoras."
    },
    {
      id: 7,
      pergunta: "Como a ONG escolhe quais espécies proteger?",
      resposta: "Priorizamos espécies com alto risco de extinção, importância ecológica e potencial de recuperação com ações humanas."
    },
    {
      id: 8,
      pergunta: "Quais são os animais mais ameaçados atualmente?",
      resposta: "No Brasil, destacam-se a ararinha-azul, o tamanduá-bandeira, o lobo-guará e o tatu-canastra."
    },
    {
      id: 9,
      pergunta: "Quais projetos estão em andamento?",
      resposta: "Temos projetos de reflorestamento, monitoramento de populações, educação ambiental e combate ao tráfico de animais."
    },
    {
      id: 10,
      pergunta: "A ONG realiza resgates ou reabilitação de animais?",
      resposta: "Sim, em parceria com centros de triagem e reabilitação, ajudamos na recuperação e soltura de animais silvestres."
    },
    {
      id: 11,
      pergunta: "Quais espécies de animais em extinção a ONG protege?",
      resposta: "Atuamos na proteção de espécies como o mico-leão-dourado, a ararinha-azul, a onça-pintada e o peixe-boi-marinho."
    },
    {
      id: 12,
      pergunta: "Como são feitas as pesquisas e monitoramentos?",
      resposta: "Utilizamos tecnologias como GPS, drones e câmeras de trilha, além de trabalho de campo com biólogos e voluntários."
    },
    {
      id: 13,
      pergunta: "A ONG trabalha com comunidades locais?",
      resposta: "Sim, promovemos capacitação, geração de renda sustentável e educação ambiental junto às comunidades."
    }
  ];

  return (
    <main>
      {/* Banner visual superior da página */}
      <img src={bannerFaq} alt="Banner FAQ" className="banner-topo" />
      
      <section className="faq-section">
        <h1>Perguntas Frequentes (FAQ)</h1>
        
        <div className="faq-cards-container">
          {/* Loop utilizando o método .map() do JavaScript para percorrer a lista de perguntas e criar os blocos visuais de forma automatizada */}
          {faqData.map((item) => (
            /* É obrigatório o uso do atributo 'key' com o id único para ajudar o React a renderizar os elementos eficientemente */
            <div key={item.id} className="faq-card">
              <h2>{item.pergunta}</h2>
              <p>{item.resposta}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};
