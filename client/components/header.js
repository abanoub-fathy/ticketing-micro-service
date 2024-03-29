import Link from "next/link";

const Header = ({ currentUser }) => {
  const links = [
    !currentUser && {
      label: "Sign In",
      href: "/auth/signin",
    },
    !currentUser && {
      label: "Sign Up",
      href: "/auth/signup",
    },
    currentUser && {
      label: "Sign Out",
      href: "/auth/signout",
    },
  ]
    .filter((linkConfig) => linkConfig)
    .map((linkConfig) => (
      <li key={linkConfig.href} className="nav-item">
        <Link href={linkConfig.href} className="nav-link">
          {linkConfig.label}
        </Link>
      </li>
    ));

  return (
    <nav className="navbar navbar-dark bg-dark mb-4">
      <div className="container">
        <Link className="navbar-brand" href="/">
          GitTix
        </Link>

        <div className="d-flex justify-content-end">
          <ul className="d-flex nav align-items-center">{links}</ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
