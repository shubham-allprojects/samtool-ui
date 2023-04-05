mkcert -key-file sam-key.pem -cert-file sam-cert.pem "localhost"  
docker-compose -f docker-compose.dev.yml up

.nav-link:hover {
color: var(--secondary-color) !important;
}

.about-home-link:hover {
color: var(--primary-color-hover);
transition: 0.2s ease-in-out;
}

.footer-icon-div:hover,
.contact-icon-div:hover {
transition: 0.3s ease-in-out;
background-color: white;
}

.footer-icon-div:hover .footer-icon,
.contact-icon-div:hover .contact-icon {
color: var(--secondary-color);
}

.individual-label:hover,
.organization-label:hover {
cursor: pointer;
color: var(--secondary-color);
}

.register-links a:hover,
.address-label:hover {
border-color: var(--primary-color-hover);
}

.IndividualForm .btn-secondary:hover,
.OrganizationForm .btn-secondary:hover {
background-color: lightgray !important;
}

.profile-inner-card:hover {
color: var(--primary-color) !important;
background-color: white !important;
border-color: var(--primary-color) !important;
transition: 0.3s ease-in-out;
}

.profile-icon-wrapper:hover {
transition: 0.2s ease-in-out;
background-color: white;
border-color: var(--secondary-color);
}

.profile-icon-wrapper:hover i {
color: var(--secondary-color) !important;
transition: 0.2s ease-in-out;
}

.btn-home:hover {
background: white !important;
color: #3f3d56 !important;
border-color: #3f3d56 !important;
transition: 0.3s ease-in-out !important;
}

.admin-top-card:hover {
  transition: 0.3s ease-in-out;
  background: white !important;
  border-color: var(--secondary-color);
  transform: scale(1.04);
}

.admin-users-wrapper .dropdown-item:hover {
  color: white;
  background-color: var(--primary-color);
}

.users-btn:hover,
.users-btn.active {
  background-color: var(--primary-color-hover) !important;
  transition: 0.3s ease-in-out;
  color: white !important;
}

.users-admin .page-link:hover {
  color: var(--primary-color-hover);
}

.users-admin .active > .page-link:hover {
  color: white;
}

.admin-top-card:hover .hover-color-secondary {
  transition: 0.3s ease-in-out;
  color: var(--secondary-color) !important;
}