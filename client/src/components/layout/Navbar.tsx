import { Navbar as BootstrapNavbar, Nav, Container } from 'react-bootstrap';
import { NavLink, useLocation } from 'react-router-dom';
import { Code2 } from 'lucide-react';

const NavbarComponent = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Conditionally set the class and theme variant
  const navbarClass = isHomePage ? 'navbar-homepage' : 'navbar-otherpages';
  const navbarVariant = isHomePage ? 'dark' : 'light';

  return (
    <BootstrapNavbar 
      variant={navbarVariant} 
      expand="lg" 
      className={`navbar ${navbarClass}`}
      fixed="top"
    >
      <Container>
        <NavLink to="/" className="navbar-brand d-flex align-items-center">
          <Code2 className="me-2" />
          <span className="fw-bold">CosmuQuantaa</span>
        </NavLink>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <NavLink to="/upload" className="nav-link">Upload</NavLink>
            <NavLink to="/analysis-results" className="nav-link">Analysis</NavLink>
            <NavLink to="/editor" className="nav-link">Editor</NavLink>
            <NavLink to="/download" className="nav-link">Download</NavLink>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default NavbarComponent;