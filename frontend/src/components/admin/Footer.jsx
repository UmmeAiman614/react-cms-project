import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-pale-yellow text-deep-green py-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-4">
        <p className="text-sm mb-4 md:mb-0">
          &copy; {new Date().getFullYear()} News CMS Project
        </p>

        <nav>
          <ul className="flex flex-col md:flex-row gap-4 md:gap-6 text-sm font-semibold">
            <li>
              <a className="hover:text-muted-green transition-colors" href="/admin/dashboard">Dashboard</a>
            </li>
            <li>
              <a className="hover:text-muted-green transition-colors" href="/admin/articles">Articles</a>
            </li>
            <li>
              <a className="hover:text-muted-green transition-colors" href="/admin/categories">Categories</a>
            </li>
            <li>
              <a className="hover:text-muted-green transition-colors" href="/admin/users">Users</a>
            </li>
          </ul>
        </nav>

        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-muted-green transition-colors">Facebook</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-muted-green transition-colors">Twitter</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-muted-green transition-colors">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
