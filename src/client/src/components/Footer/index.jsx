import React from 'react';
import './index.css';
import GitHubLinkImg from './GitHub-Mark-Light-64px.png';
import { Media, Row, Col } from 'reactstrap';

export default function Footer() {
  return (
    <div className="Footer">
      <Row>
        <Col className="Footer-copyright" cs="6">
          <a href="https://www.github.com/morko/haxroomie-web/blob/master/LICENSE">&copy; 2019 Oskari Pöntinen</a>
        </Col>
        <Col xs="6">
          <Media>
            <Media 
            className="Footer-github" 
            body 
            href="https://www.github.com/morko/haxroomie-web">
              GitHub
            </Media>
            <Media right href="https://www.github.com/morko/haxroomie-web">
              <Media object src={GitHubLinkImg} alt="Project in GitHub" />
            </Media>
          </Media>
        </Col>
      </Row>


    </div>
  );
}