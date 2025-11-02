import { Link, useLocation } from 'react-router-dom';
import { Navbar as BSNavbar, Nav, Container } from 'react-bootstrap';

const Navbar = () => {
  const location = useLocation();

  const navbarStyle = {
    background: 'white',
    borderBottom: '1px solid #e2e8f0',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    padding: '1rem 0'
  };

  const brandStyle = {
    color: '#2563eb',
    fontWeight: '700',
    fontSize: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const navLinkStyle = {
    color: '#64748b',
    fontWeight: '500',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    marginLeft: '0.5rem'
  };

  const navLinkActiveStyle = {
    ...navLinkStyle,
    color: '#2563eb',
    background: 'rgba(37, 99, 235, 0.1)'
  };

  return (
    <BSNavbar expand="lg" className="mb-4" style={navbarStyle}>
      <Container fluid className="px-4">
        <BSNavbar.Brand as={Link} to="/" style={brandStyle}>
          <i className="bi bi-wallet2"></i>
          <span>Digital Payment</span>
        </BSNavbar.Brand>
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" style={{ borderColor: '#e2e8f0' }} />
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link 
              as={Link} 
              to="/" 
              style={location.pathname === '/' ? navLinkActiveStyle : navLinkStyle}
            >
              <i className="bi bi-house-door me-2"></i>
              Dashboard
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/users" 
              style={location.pathname === '/users' ? navLinkActiveStyle : navLinkStyle}
            >
              <i className="bi bi-people me-2"></i>
              Users
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/transactions" 
              style={location.pathname === '/transactions' ? navLinkActiveStyle : navLinkStyle}
            >
              <i className="bi bi-clock-history me-2"></i>
              Transactions
            </Nav.Link>
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;

