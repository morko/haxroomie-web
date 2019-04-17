import React from 'react';
import './index.css';
import GitHubLinkImg from './GitHub-Mark-Light-64px.png';
import { Media } from 'reactstrap';

export default function Footer() {
  return (
    <footer className="Footer page-footer">
      <div className="Footer-container">
        <div className="Footer-col Footer-copyright">
          <p><a href="https://www.github.com/morko/haxroomie-web/blob/master/LICENSE">&copy; 2019 Oskari Pöntinen</a></p>
        </div>
        <div className="Footer-col Footer-kudos">
          <p className="Footer-kudos-header">Thanks to</p>
          <p>
            <a href="https://github.com/saviola777">saviola777</a> for 
            <a href="https://github.com/saviola777/haxball-headless-manager"> HHM</a>
          </p>
          <p><a href="https://github.com/astein87">Alex</a> for the logo</p>
        </div>
        <div className="Footer-col Footer-github">
          <Media>
              <Media right href="https://www.github.com/morko/haxroomie-web">
              <Media object src={GitHubLinkImg} alt="Project in GitHub" />
            </Media>
          </Media>
        </div>
      </div>
    </footer>
  );
}