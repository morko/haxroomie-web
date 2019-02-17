import React from 'react';
import './index.css';
import GitHubLinkImg from './GitHub-Mark-Light-64px.png';
import { Media, Row, Col, Container } from 'reactstrap';

export default function Footer() {
  return (
    <footer className="Footer page-footer">
      <Container>
        <Row>
          <Col className="Footer-copyright" xs="7">
            <p><a href="https://www.github.com/morko/haxroomie-web/blob/master/LICENSE">&copy; 2019 Oskari Pöntinen</a></p>
          </Col>
          <Col xs="5">
            <Media>
              <Media 
              className="Footer-github" 
              body 
              href="https://www.github.com/morko/haxroomie-web"
              style={{color: "white"}}>
                GitHub
              </Media>
              <Media right href="https://www.github.com/morko/haxroomie-web">
                <Media object src={GitHubLinkImg} alt="Project in GitHub" />
              </Media>
            </Media>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}