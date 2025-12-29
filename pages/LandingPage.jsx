import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBuilding, FaUserShield, FaClipboardList, FaBell, FaFileInvoiceDollar, FaGlassCheers, FaUsers, FaAddressCard, FaArrowRight, FaCheckCircle, FaCheck, FaStar, FaQuoteLeft } from 'react-icons/fa';
import logo from '../assets/logo_header.svg';
import '../styles/LandingPage.css';

function LandingPage() {
  const [billingCycle, setBillingCycle] = useState('monthly');

  return (
    <div className="landing-root">
      {/* Header público */}
      <header className="public-header">
        <div className="public-header-content">
          <Link to="/" className="brand">
            <img src={logo} alt="Cancella Flow" className="brand-logo-img" />
          </Link>
          <nav className="public-nav">
            <a className="nav-link" href="#features">Funcionalidades</a>
            <a className="nav-link" href="#pricing">Planos</a>
            <a className="nav-link" href="#testimonials">Depoimentos</a>
            <Link className="nav-link nav-login" to="/login">Entrar</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-content">
          <div className="hero-tag">🏢 A melhor solução para síndicos e administradoras</div>
          <h1>Transforme a gestão do seu condomínio</h1>
          <p>
            Plataforma completa e intuitiva para administrar múltiplos condomínios.
            Portaria, funcionários, encomendas, avisos, boletos, salão de festas e muito mais.
          </p>
          <div className="hero-ctas">
            <Link to="/login" className="cta-primary">
              Começar gratuitamente <FaArrowRight />
            </Link>
            <a className="cta-secondary" href="#pricing">Ver planos</a>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <strong>+150</strong> Condomínios
            </div>
            <div className="stat-item">
              <strong>+8k</strong> Moradores
            </div>
            <div className="stat-item">
              <strong>4.9/5</strong> Avaliação
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="social-proof">
        <div className="social-proof-content">
          <p className="social-proof-text">
            Confiado por <strong>síndicos e administradoras</strong> em todo o Brasil
          </p>
          <div className="trust-badges">
            <div className="trust-item">
              <FaCheckCircle className="trust-icon" />
              <span>Dados criptografados</span>
            </div>
            <div className="trust-item">
              <FaCheckCircle className="trust-icon" />
              <span>Suporte dedicado</span>
            </div>
            <div className="trust-item">
              <FaCheckCircle className="trust-icon" />
              <span>Atualizações constantes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section id="features" className="features">
        <div className="section-header">
          <h2>Tudo que você precisa, em um só lugar</h2>
          <p className="section-subtitle">
            O Cancella Flow centraliza as rotinas do seu condomínio com segurança e eficiência.
          </p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><FaBuilding /></div>
            <h3>Multi-Condomínios</h3>
            <p>Administre diversos condomínios com perfis e permissões sob medida para cada tipo de usuário.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><FaUserShield /></div>
            <h3>Portaria Inteligente</h3>
            <p>Controle de acessos com registro em tempo real, QR codes e notificações automáticas.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><FaUsers /></div>
            <h3>Gestão de Funcionários</h3>
            <p>Organize equipes, escalas, férias e controle de ponto de forma simples e eficiente.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><FaClipboardList /></div>
            <h3>Controle de Encomendas</h3>
            <p>Registro automático, notificações por SMS/email e histórico completo de entregas.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><FaBell /></div>
            <h3>Avisos e Comunicados</h3>
            <p>Envie avisos segmentados por blocos, unidades ou para todo o condomínio.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><FaFileInvoiceDollar /></div>
            <h3>Gestão de Boletos</h3>
            <p>Envio automático, controle de pagamentos e integração com principais bancos.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><FaGlassCheers /></div>
            <h3>Salão de Festas</h3>
            <p>Agendamento online, calendário compartilhado e regras de uso personalizáveis.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><FaAddressCard /></div>
            <h3>Visitantes & Moradores</h3>
            <p>Cadastro completo, controle de autorizações e histórico de visitas detalhado.</p>
          </div>
        </div>
      </section>

      {/* Planos de Assinatura */}
      <section id="pricing" className="pricing">
        <div className="section-header">
          <h2>Planos que se adaptam à sua necessidade</h2>
          <p className="section-subtitle">
            Escolha o plano ideal para o seu condomínio. Sem taxas ocultas, sem surpresas.
          </p>
        </div>

        <div className="billing-toggle">
          <button 
            className={billingCycle === 'monthly' ? 'active' : ''} 
            onClick={() => setBillingCycle('monthly')}
          >
            Mensal
          </button>
          <button 
            className={billingCycle === 'yearly' ? 'active' : ''} 
            onClick={() => setBillingCycle('yearly')}
          >
            Anual <span className="discount-badge">-20%</span>
          </button>
        </div>

        <div className="pricing-cards">
          {/* Plano Starter */}
          <div className="pricing-card">
            <div className="plan-header">
              <h3>Starter</h3>
              <p className="plan-description">Ideal para condomínios pequenos</p>
            </div>
            <div className="plan-price">
              <span className="currency">R$</span>
              <span className="amount">{billingCycle === 'monthly' ? '97' : '78'}</span>
              <span className="period">/mês</span>
            </div>
            {billingCycle === 'yearly' && <p className="billing-info">Cobrado anualmente (R$ 936/ano)</p>}
            <ul className="plan-features">
              <li><FaCheck /> Até 50 unidades</li>
              <li><FaCheck /> 2 usuários administrativos</li>
              <li><FaCheck /> Portaria básica</li>
              <li><FaCheck /> Gestão de encomendas</li>
              <li><FaCheck /> Avisos e comunicados</li>
              <li><FaCheck /> Suporte por email</li>
            </ul>
            <Link to="/login" className="plan-cta plan-cta-secondary">
              Começar gratuitamente
            </Link>
          </div>

          {/* Plano Professional - Destaque */}
          <div className="pricing-card featured">
            <div className="popular-badge">Mais Popular</div>
            <div className="plan-header">
              <h3>Professional</h3>
              <p className="plan-description">Para condomínios em crescimento</p>
            </div>
            <div className="plan-price">
              <span className="currency">R$</span>
              <span className="amount">{billingCycle === 'monthly' ? '197' : '158'}</span>
              <span className="period">/mês</span>
            </div>
            {billingCycle === 'yearly' && <p className="billing-info">Cobrado anualmente (R$ 1.896/ano)</p>}
            <ul className="plan-features">
              <li><FaCheck /> Até 150 unidades</li>
              <li><FaCheck /> Usuários ilimitados</li>
              <li><FaCheck /> Portaria completa com QR code</li>
              <li><FaCheck /> Gestão de funcionários</li>
              <li><FaCheck /> Controle de boletos</li>
              <li><FaCheck /> Salão de festas</li>
              <li><FaCheck /> Relatórios avançados</li>
              <li><FaCheck /> Suporte prioritário</li>
            </ul>
            <Link to="/login" className="plan-cta plan-cta-primary">
              Escolher Professional
            </Link>
          </div>

          {/* Plano Enterprise */}
          <div className="pricing-card">
            <div className="plan-header">
              <h3>Enterprise</h3>
              <p className="plan-description">Para administradoras e grandes condomínios</p>
            </div>
            <div className="plan-price">
              <span className="amount">Personalizado</span>
            </div>
            <ul className="plan-features">
              <li><FaCheck /> Unidades ilimitadas</li>
              <li><FaCheck /> Multi-condomínios</li>
              <li><FaCheck /> Todas as funcionalidades</li>
              <li><FaCheck /> API e integrações</li>
              <li><FaCheck /> White label</li>
              <li><FaCheck /> Suporte 24/7 com SLA</li>
            </ul>
            <a href="mailto:contato@cancellaflow.com.br" className="plan-cta plan-cta-secondary">
              Falar com vendas
            </a>
          </div>
        </div>

        <div className="pricing-guarantee">
          <FaCheckCircle className="guarantee-icon" />
          <p><strong>Garantia de 14 dias.</strong> Teste sem compromisso. Cancele quando quiser.</p>
        </div>
      </section>

      {/* Depoimentos */}
      <section id="testimonials" className="testimonials">
        <div className="section-header">
          <h2>O que nossos clientes dizem</h2>
          <p className="section-subtitle">
            Síndicos e administradoras que já transformaram a gestão dos seus condomínios.
          </p>
        </div>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-stars">
              <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
            </div>
            <FaQuoteLeft className="quote-icon" />
            <p className="testimonial-text">
              "Antes gastávamos horas organizando planilhas e enviando avisos. Com o Cancella Flow, 
              tudo ficou automatizado. Economizamos tempo e os moradores estão muito mais satisfeitos."
            </p>
            <div className="testimonial-author">
              <strong>Maria Silva</strong>
              <span>Síndica - Condomínio Jardim Paulista</span>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-stars">
              <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
            </div>
            <FaQuoteLeft className="quote-icon" />
            <p className="testimonial-text">
              "Como administradora, precisávamos de uma solução que pudesse gerenciar múltiplos condomínios. 
              O Cancella Flow superou nossas expectativas. Interface moderna e suporte excelente!"
            </p>
            <div className="testimonial-author">
              <strong>João Santos</strong>
              <span>Diretor - Santos Administradora</span>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-stars">
              <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
            </div>
            <FaQuoteLeft className="quote-icon" />
            <p className="testimonial-text">
              "A funcionalidade de portaria com QR code revolucionou nosso condomínio. 
              Mais segurança, menos papel e moradores muito mais satisfeitos com a modernização."
            </p>
            <div className="testimonial-author">
              <strong>Ana Costa</strong>
              <span>Síndica - Residencial Vista Mar</span>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action final */}
      <section className="cta-final">
        <div className="cta-final-content">
          <h2>Pronto para transformar a gestão do seu condomínio?</h2>
          <p>Junte-se a centenas de síndicos e administradoras que já simplificaram sua rotina.</p>
          <div className="cta-final-buttons">
            <Link to="/login" className="cta-primary cta-large">
              Começar gratuitamente <FaArrowRight />
            </Link>
            <a href="#pricing" className="cta-secondary cta-large">
              Ver planos e preços
            </a>
          </div>
          <p className="cta-note">✓ Sem cartão de crédito • ✓ 14 dias grátis • ✓ Cancele quando quiser</p>
        </div>
      </section>

      {/* Footer público */}
      <footer className="public-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              <img src={logo} alt="Cancella Flow" className="footer-logo-img" />
            </div>
            <p>A solução completa para gestão de condomínios.</p>
          </div>
          <div className="footer-column">
            <h4>Produto</h4>
            <a href="#features">Funcionalidades</a>
            <a href="#pricing">Planos</a>
            <a href="#testimonials">Depoimentos</a>
          </div>
          <div className="footer-column">
            <h4>Suporte</h4>
            <a href="mailto:contato@cancellaflow.com.br">Contato</a>
            <a href="#">Central de Ajuda</a>
            <a href="#">FAQ</a>
          </div>
          <div className="footer-column">
            <h4>Legal</h4>
            <a href="#">Termos de Uso</a>
            <a href="#">Política de Privacidade</a>
            <a href="#">LGPD</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Cancella Flow — Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
