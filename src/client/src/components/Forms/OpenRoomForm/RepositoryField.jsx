import React from 'react';
import {
  Button,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  FormText,
  Input,
  Col
} from 'reactstrap';
import './index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class RepositoryField extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      repoErrors: {},
      repositories: this.props.repositories
    }
    this.handleRepositoryChange = this.handleRepositoryChange.bind(this);
    this.handleAddRepository = this.handleAddRepository.bind(this);
    this.createRepositoryFields = this.createRepositoryFields.bind(this);

  }

  /**
   * Checks if the given string is a valid URL.
   * Source is from http://forums.devshed.com/javascript-development-115/regexp-match-url-pattern-493764.html
   * 
   * @param {string} str - url
   */
  validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return pattern.test(str);
  }

  handleRepositoryChange(newRepo, i) {
    if (!this.validURL(newRepo)) {
      this.setState(prevState =>
        ({
          repoErrors: { ...prevState.repoErrors, [i]: 'Not a valid URL.' }
        })
      );
    } else {
      this.setState(prevState =>
        ({
          repoErrors: { ...prevState.repoErrors, [i]: '' }
        })
      );
    }

    this.setState(prevState =>
      {
        const repos = prevState.repositories.map((repo, j) => {
          if (j !== i) return repo;
          return newRepo;
        });
        return { 
          repositories: repos
        };
      },
      () => this.props.handleRepositoryChange(this.state.repositories)
    );
  }

  handleAddRepository() {
    this.setState(prevState => {
      return { repositories:  [ ...prevState.repositories, '' ] };
    });
  }

  handleRemoveRepository(i) {
    this.setState(prevState => {
      const repos = prevState.repositories.filter((repo, j) => j !== i);
      const errors = { ...prevState.repoErrors, [i]: undefined }
      return {
        repositories: repos,
        repoErrors: errors
      };   
    }, () => this.props.handleRepositoryChange(this.state.repositories));
  }
    
  createRepositoryFields(repositories) {
    return repositories.map((repo, i) => {
      return (
        <FormGroup key={i}>
          <InputGroup>
            <Input
              type="text"
              name={"repository" + i}
              id={"repository" + i}
              invalid={this.state.repoErrors[i] ? true : false}
              value={repo}
              onChange={event => this.handleRepositoryChange(event.target.value, i)} />
            <InputGroupAddon addonType="append">
              <Button onClick={() => this.handleRemoveRepository(i)}><FontAwesomeIcon icon="minus-square" size="1x" /></Button>
            </InputGroupAddon>
          </InputGroup>
        </FormGroup>
      );
    });
  }

  render() {

    let repos = this.createRepositoryFields(this.state.repositories);

    return (
      <div>
        <p>
          <FontAwesomeIcon icon="list" size="2x" /> HHM plugin repositories
          <Button className="float-right" onClick={this.handleAddRepository}><FontAwesomeIcon icon="plus-square" size="1x" /></Button>
        </p>

        {repos}

        <FormGroup row>
          <Col sm="12">
            <FormText>
              Here you can give the URLs to Haxball Headless Manager repositories
              See <a href="https://github.com/saviola777/haxball-headless-manager"
              target="_blank" rel="noopener noreferrer">
              saviolas Haxball Headless Manager</a> for information
              about the repositories.
            </FormText>
          </Col>
        </FormGroup>
      </div>
    );
  }
}