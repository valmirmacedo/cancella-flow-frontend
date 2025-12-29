import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaSignOutAlt, 
  FaKey, 
  FaUser, 
  FaUsers,
  FaCogs,
  FaBuilding,
  FaUserTie,
  FaUserFriends,
  FaHome,
  FaBox,
  FaIdCard,
  FaBell,
  FaCalendarAlt
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo_header.svg';
import './../../styles//Header.css';
import { /* avisoAPI */ } from '../../services/api';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Helper para verificar se o usuário pertence a um grupo
  const hasGroup = (groupName) => {
    return user?.groups && Array.isArray(user.groups) && 
           user.groups.some(group => group.name === groupName);
  };

  const isPortaria = hasGroup('Portaria');
  const isMorador = hasGroup('Moradores');
  const isSindico = hasGroup('Síndicos');
  const isAdmin = user?.is_staff || hasGroup('admin');

  // Debug: verificar grupos do usuário
  React.useEffect(() => {
    if (user) {
      console.log('=== DEBUG HEADER ===');
      console.log('User:', user);
      console.log('Groups:', user.groups);
      console.log('isPortaria:', isPortaria);
      console.log('isMorador:', isMorador);
      console.log('isSindico:', isSindico);
      console.log('isAdmin:', isAdmin);
    }
  }, [user, isPortaria, isMorador, isSindico, isAdmin]);

  // Observação: Avisos foram removidos do header — carregamento desativado

  const isFirstAccess = !!user?.first_access;

  return (
    <header className="app-header">
      <div className="app-header-content">
        <Link to="/welcome" className="app-logo">
          <img src={logo} alt="Logo" />
        </Link>

        <div className="hamburger" onClick={toggleMenu}>
          <span className={`bar ${menuOpen ? 'active' : ''}`}></span>
          <span className={`bar ${menuOpen ? 'active' : ''}`}></span>
          <span className={`bar ${menuOpen ? 'active' : ''}`}></span>
        </div>

        <nav className={`app-nav ${menuOpen ? 'active' : ''}`}>
          <ul className="app-menu">
            {isFirstAccess ? (
              <>
                <li className="app-menu-item dropdown">
                  <div className="dropdown-link user-name">
                    <FaUser />
                    <span>{`${user?.first_name || ''} ${user?.last_name || ''}`}</span>
                  </div>
                  <ul className="dropdown-menu">
                    <li>
                      <button onClick={handleLogout} className="app-logout">
                        <FaSignOutAlt />
                        <span>Sair</span>
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
            {/* Botão Home */}
            <li className="app-menu-item">
              <Link to="/welcome" className="nav-link">
                <FaHome />
                <span>Home</span>
              </Link>
            </li>

            {/* Avisos removidos do header */}
            {/* Seção de Gestão do Sistema */}
            {(isAdmin || isSindico) && (
              <li className="app-menu-item dropdown">
                <div className="dropdown-link">
                  <FaCogs />
                  <span>Gestão do Sistema</span>
                </div>
                <ul className="dropdown-menu">
                  {/* Administradores podem ver Condomínios e Síndicos */}
                  {isAdmin && (
                    <>
                      <li>
                        <Link to="/gestao-usuarios?tab=condominios">
                          <FaBuilding />
                          <span>Gestão de Condomínios</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/gestao-usuarios?tab=sindicos">
                          <FaUserTie />
                          <span>Gestão de Síndicos</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/gestao-usuarios?tab=grupos">
                          <FaUserFriends />
                          <span>Gestão de Grupos</span>
                        </Link>
                      </li>
                    </>
                  )}
                  {/* Síndicos podem ver Funcionários, Moradores e Unidades */}
                  {isSindico && (
                    <>
                      <li>
                        <Link to="/gestao-usuarios?tab=unidades">
                          <FaBuilding />
                          <span>Gestão de Unidades</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/gestao-usuarios?tab=espacos">
                          <FaBox />
                          <span>Gestão de Espaços</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/gestao-usuarios?tab=avisos">
                          <FaBell />
                          <span>Gestão de Avisos</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/gestao-usuarios?tab=eventos">
                          <FaCalendarAlt />
                          <span>Gestão de Eventos</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/gestao-usuarios?tab=portaria">
                          <FaUsers />
                          <span>Gestão de Portaria</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/gestao-usuarios?tab=moradores">
                          <FaHome />
                          <span>Gestão de Moradores</span>
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </li>
            )}

            {/* Minha Área - Apenas para Moradores */}
            {isMorador && !isPortaria && !isAdmin && !isSindico && (
              <li className="app-menu-item">
                <Link to="/minha-area" className="nav-link">
                  <FaHome />
                  <span>Minha Área</span>
                </Link>
              </li>
            )}

            {/* Portaria - Apenas para grupo Portaria (com subopções) */}
            {isPortaria && !isAdmin && (
              <li className="app-menu-item dropdown">
                <div className="dropdown-link">
                  <FaIdCard />
                  <span>Portaria</span>
                </div>
                <ul className="dropdown-menu">
                  <li>
                    <Link to="/portaria?tab=encomendas">
                      <FaBox />
                      <span>Gestão de Encomendas</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/portaria?tab=visitantes">
                      <FaUser />
                      <span>Gestão de Visitantes</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/portaria?tab=veiculos">
                      <FaIdCard />
                      <span>Veículos Cadastrados</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/portaria?tab=reservas">
                      <FaBox />
                      <span>Reservas do Dia</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/portaria?tab=eventos">
                      <FaCalendarAlt />
                      <span>Eventos</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/portaria?tab=avisos">
                      <FaBell />
                      <span>Avisos</span>
                    </Link>
                  </li>
                </ul>
              </li>
            )}
            
            <li className="app-menu-divider" />
            <li className="app-menu-item dropdown">
              <div className="dropdown-link user-name">
                <FaUser />
                <span>{`${user?.first_name || ''} ${user?.last_name || ''}`}</span>
              </div>
              <ul className="dropdown-menu">
                <li>
                  <Link to="/perfil/senha">
                    <FaKey />
                    <span>Alterar Senha</span>
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="app-logout">
                    <FaSignOutAlt />
                    <span>Sair</span>
                  </button>
                </li>
              </ul>
            </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
