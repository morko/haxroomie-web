import React from "react";
import {
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  InputGroup,
  CustomInput,
  InputGroupAddon,
  Label,
  Input,
  Alert,
  FormText
} from 'reactstrap';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import AdvancedForm from './AdvancedForm';
import './index.css';
import Repositories from './Repositories';

function FormTextRow(props) {
  let name = props.name;
  let type = props.placeholder;
  let label = props.label;
  let placeholder = props.placeholder;
  let onChange = props.onChange;
  let value = props.value;
  let valid = typeof props.valid === "undefined" || props.valid;

  return (
    <div className="FormTextRow">
      <FormGroup row>
        <Label for={name} sm="3">
          {label}
        </Label>
        <Col sm="9">
          {valid ? (
            <Input
              value={value}
              type={type}
              name={name}
              onChange={onChange}
              placeholder={placeholder}
            />
          ) : (
            <Input
              invalid
              value={value}
              type={type}
              name={name}
              onChange={onChange}
              placeholder={placeholder}
            />
          )}
        </Col>
      </FormGroup>

      {props.children && (
        <FormGroup row className="Form-explanation">
          <Col sm="3" />
          <Col sm="9">
            <FormText>{props.children}</FormText>
          </Col>
        </FormGroup>
      )}
    </div>
  );
}

export default class OpenRoomForm extends React.Component {
  // List of countries and codes from here: https://gist.github.com/maephisto/9228207
  isoCountries = {
    AF: "Afghanistan",
    AX: "Aland Islands",
    AL: "Albania",
    DZ: "Algeria",
    AS: "American Samoa",
    AD: "Andorra",
    AO: "Angola",
    AI: "Anguilla",
    AQ: "Antarctica",
    AG: "Antigua And Barbuda",
    AR: "Argentina",
    AM: "Armenia",
    AW: "Aruba",
    AU: "Australia",
    AT: "Austria",
    AZ: "Azerbaijan",
    BS: "Bahamas",
    BH: "Bahrain",
    BD: "Bangladesh",
    BB: "Barbados",
    BY: "Belarus",
    BE: "Belgium",
    BZ: "Belize",
    BJ: "Benin",
    BM: "Bermuda",
    BT: "Bhutan",
    BO: "Bolivia",
    BA: "Bosnia And Herzegovina",
    BW: "Botswana",
    BV: "Bouvet Island",
    BR: "Brazil",
    IO: "British Indian Ocean Territory",
    BN: "Brunei Darussalam",
    BG: "Bulgaria",
    BF: "Burkina Faso",
    BI: "Burundi",
    KH: "Cambodia",
    CM: "Cameroon",
    CA: "Canada",
    CV: "Cape Verde",
    KY: "Cayman Islands",
    CF: "Central African Republic",
    TD: "Chad",
    CL: "Chile",
    CN: "China",
    CX: "Christmas Island",
    CC: "Cocos (Keeling) Islands",
    CO: "Colombia",
    KM: "Comoros",
    CG: "Congo",
    CD: "Congo, Democratic Republic",
    CK: "Cook Islands",
    CR: "Costa Rica",
    CI: "Cote D'Ivoire",
    HR: "Croatia",
    CU: "Cuba",
    CY: "Cyprus",
    CZ: "Czech Republic",
    DK: "Denmark",
    DJ: "Djibouti",
    DM: "Dominica",
    DO: "Dominican Republic",
    EC: "Ecuador",
    EG: "Egypt",
    SV: "El Salvador",
    GQ: "Equatorial Guinea",
    ER: "Eritrea",
    EE: "Estonia",
    ET: "Ethiopia",
    EU: "Europe",
    FK: "Falkland Islands (Malvinas)",
    FO: "Faroe Islands",
    FJ: "Fiji",
    FI: "Finland",
    FR: "France",
    GF: "French Guiana",
    PF: "French Polynesia",
    TF: "French Southern Territories",
    GA: "Gabon",
    GM: "Gambia",
    GE: "Georgia",
    DE: "Germany",
    GH: "Ghana",
    GI: "Gibraltar",
    GR: "Greece",
    GL: "Greenland",
    GD: "Grenada",
    GP: "Guadeloupe",
    GU: "Guam",
    GT: "Guatemala",
    GG: "Guernsey",
    GN: "Guinea",
    GW: "Guinea-Bissau",
    GY: "Guyana",
    HT: "Haiti",
    HM: "Heard Island & Mcdonald Islands",
    VA: "Holy See (Vatican City State)",
    HN: "Honduras",
    HK: "Hong Kong",
    HU: "Hungary",
    IS: "Iceland",
    IN: "India",
    ID: "Indonesia",
    IR: "Iran, Islamic Republic Of",
    IQ: "Iraq",
    IE: "Ireland",
    IM: "Isle Of Man",
    IL: "Israel",
    IT: "Italy",
    JM: "Jamaica",
    JP: "Japan",
    JE: "Jersey",
    JO: "Jordan",
    KZ: "Kazakhstan",
    KE: "Kenya",
    KI: "Kiribati",
    KR: "Korea",
    KW: "Kuwait",
    KG: "Kyrgyzstan",
    LA: "Lao People's Democratic Republic",
    LV: "Latvia",
    LB: "Lebanon",
    LS: "Lesotho",
    LR: "Liberia",
    LY: "Libyan Arab Jamahiriya",
    LI: "Liechtenstein",
    LT: "Lithuania",
    LU: "Luxembourg",
    MO: "Macao",
    MK: "Macedonia",
    MG: "Madagascar",
    MW: "Malawi",
    MY: "Malaysia",
    MV: "Maldives",
    ML: "Mali",
    MT: "Malta",
    MH: "Marshall Islands",
    MQ: "Martinique",
    MR: "Mauritania",
    MU: "Mauritius",
    YT: "Mayotte",
    MX: "Mexico",
    FM: "Micronesia, Federated States Of",
    MD: "Moldova",
    MC: "Monaco",
    MN: "Mongolia",
    ME: "Montenegro",
    MS: "Montserrat",
    MA: "Morocco",
    MZ: "Mozambique",
    MM: "Myanmar",
    NA: "Namibia",
    NR: "Nauru",
    NP: "Nepal",
    NL: "Netherlands",
    AN: "Netherlands Antilles",
    NC: "New Caledonia",
    NZ: "New Zealand",
    NI: "Nicaragua",
    NE: "Niger",
    NG: "Nigeria",
    NU: "Niue",
    NF: "Norfolk Island",
    MP: "Northern Mariana Islands",
    NO: "Norway",
    OM: "Oman",
    PK: "Pakistan",
    PW: "Palau",
    PS: "Palestinian Territory, Occupied",
    PA: "Panama",
    PG: "Papua New Guinea",
    PY: "Paraguay",
    PE: "Peru",
    PH: "Philippines",
    PN: "Pitcairn",
    PL: "Poland",
    PT: "Portugal",
    PR: "Puerto Rico",
    QA: "Qatar",
    RE: "Reunion",
    RO: "Romania",
    RU: "Russian Federation",
    RW: "Rwanda",
    BL: "Saint Barthelemy",
    SH: "Saint Helena",
    KN: "Saint Kitts And Nevis",
    LC: "Saint Lucia",
    MF: "Saint Martin",
    PM: "Saint Pierre And Miquelon",
    VC: "Saint Vincent And Grenadines",
    WS: "Samoa",
    SM: "San Marino",
    ST: "Sao Tome And Principe",
    SA: "Saudi Arabia",
    SN: "Senegal",
    RS: "Serbia",
    SC: "Seychelles",
    SL: "Sierra Leone",
    SG: "Singapore",
    SK: "Slovakia",
    SI: "Slovenia",
    SB: "Solomon Islands",
    SO: "Somalia",
    ZA: "South Africa",
    GS: "South Georgia And Sandwich Isl.",
    ES: "Spain",
    LK: "Sri Lanka",
    SD: "Sudan",
    SR: "Suriname",
    SJ: "Svalbard And Jan Mayen",
    SZ: "Swaziland",
    SE: "Sweden",
    CH: "Switzerland",
    SY: "Syrian Arab Republic",
    TW: "Taiwan",
    TJ: "Tajikistan",
    TZ: "Tanzania",
    TH: "Thailand",
    TL: "Timor-Leste",
    TG: "Togo",
    TK: "Tokelau",
    TO: "Tonga",
    TT: "Trinidad And Tobago",
    TN: "Tunisia",
    TR: "Turkey",
    TM: "Turkmenistan",
    TC: "Turks And Caicos Islands",
    TV: "Tuvalu",
    UG: "Uganda",
    UA: "Ukraine",
    AE: "United Arab Emirates",
    GB: "United Kingdom",
    US: "United States",
    UM: "United States Outlying Islands",
    UY: "Uruguay",
    UZ: "Uzbekistan",
    VU: "Vanuatu",
    VE: "Venezuela",
    VN: "Viet Nam",
    VG: "Virgin Islands, British",
    VI: "Virgin Islands, U.S.",
    WF: "Wallis And Futuna",
    EH: "Western Sahara",
    YE: "Yemen",
    ZM: "Zambia",
    ZW: "Zimbabwe"
  };

  constructor(props) {
    super(props);

    this.state = this.props.roomConfig;
    this.state.reposError = "";

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleGeoChange = this.handleGeoChange.bind(this);
    this.handleFileInputChange = this.handleFileInputChange.bind(this);
    this.handleroomScriptClear = this.handleroomScriptClear.bind(this);
    this.handlePluginConfigChange = this.handlePluginConfigChange.bind(this);
    this.handleRepositoryChange = this.handleRepositoryChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.pluginConfigColors = {
      default: "#444444",
      error: "#FA1111",
      background: "#FCFDFD",
      background_warning: "#FEECEB",
      string: "#FA7921",
      number: "#70CE35",
      colon: "#49B8F7",
      keys: "#59A5D8",
      keys_whiteSpace: "835FB6",
      primitive: "#386FA4"
    };
  }

  componentDidMount() {
    this.setState(this.props.roomConfig);
    this.setState({ reposError: "" });
  }

  createMaxPlayersOptions(maxPlayers) {
    let options = [];
    for (let i = 0; i < maxPlayers; i++) {
      options.push(<option key={i + 1}>{i + 1}</option>);
    }
    return options;
  }

  createCountryCodeOptions() {
    let options = [];
    for (var code in this.isoCountries) {
      if (this.isoCountries.hasOwnProperty(code)) {
        let lowercase = code.toLowerCase();
        options.push(
          <option key={lowercase} value={lowercase} data-key={lowercase}>{this.isoCountries[code]}</option>
        );
      }
    }
    return options;
  }

  handleInputChange(event) {
    const target = event.target;

    const name = target.name;

    let value = target.type === "checkbox" ? target.checked : target.value;
    if (name === "token") value = this.trimToken(value);
    
    this.setState({ [name]: value }, () => this.props.saveConfig(this.state));
  }

  handleGeoChange(event) {
    const target = event.target;
    const name = target.name;
    console.log(target);
  
    let value = target.value;
    if (name === "code") value = target.options[target.options.selectedIndex].getAttribute('data-key');

    this.setState(
      prevState => ({
        ...prevState,
        geo: { ...prevState.geo, [name]: value }
      }),
      () => this.props.saveConfig(this.state)
    );
  }

  handleFileInputChange(event) {
    const name = event.target.name;
    let file = event.target.files[0];

    if (!file) return;

    let fileReader = new FileReader();
    fileReader.onloadend = e => {
      let fileData = {
        name: file.name,
        content: fileReader.result
      };

      this.setState(
        {
          [name]: fileData
        },
        () => this.props.saveConfig(this.state)
      );
    };
    fileReader.readAsText(file);
  }

  parseUrlToRepository(url) {
    let urlParts = url.split(`/`);
    let repository = url;

    if (urlParts <= 2) return repository;

    if (urlParts[2] === `github.com`) {
      repository = {
        type: `github`,
        repository: `${urlParts[3]}/${urlParts[4]}`
      };
      if (urlParts.length > 6) {
        repository.branch = urlParts[6];
      }
      if (urlParts.length > 7) {
        repository.path = urlParts[7];
      }
    } else {
      repository = { url: url };
    }
    return repository;
  }

  handleRepositoryChange(repositories) {
    this.setState(
      prevState => {
        const repos = repositories.map(repo => {
          return this.parseUrlToRepository(repo);
        });
        return {
          repositories: repos
        };
      },
      () => this.props.saveConfig(this.state)
    );
  }

  handlePluginConfigChange(event) {
    this.setState(
      prevState => ({
        pluginConfig: event.jsObject
      }),
      () => this.props.saveConfig(this.state)
    );
  }

  handleroomScriptClear(event) {
    this.setState({ roomScript: null });
    event.target.files = [];
  }

  /**
   * Removes the quotes surrounding the token string if user includes them in
   * the token.
   * @param {string} token
   */
  trimToken(token) {
    return token.trim().replace(/^"(.+(?="$))"$/, "$1");
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.openRoom(this.state);
  }

  render() {
    return (
      <Form className="OpenRoomForm" onSubmit={this.handleSubmit}>
        {this.props.errorMessage && (
          <Row>
            <Col xs="12">
              <Alert color="danger">{this.props.errorMessage}</Alert>
            </Col>
          </Row>
        )}

        <FormTextRow
          type="text"
          label="Room name"
          name="roomName"
          value={this.state.roomName}
          onChange={this.handleInputChange}
        />

        <FormTextRow
          type="text"
          label="Player name"
          name="playerName"
          value={this.state.playerName}
          onChange={this.handleInputChange}
        />

        <FormGroup row>
          <Label for="maxPlayers" sm="3">
            Max players
          </Label>
          <Col sm="3">
            <Input
              defaultValue="10"
              type="select"
              name="maxPlayers"
              className="maxPlayers"
              value={this.state.maxPlayers}
              onChange={this.handleInputChange}
            >
              {this.createMaxPlayersOptions(20)}
            </Input>
          </Col>
        </FormGroup>

        <FormGroup row>
          <Label for="maxPlayers" sm="3">
            Location
          </Label>
          <Col sm="3">
            <Input
              type="select"
              name="code"
              className="countryCode"
              value={this.state.geo.code}
              onChange={this.handleGeoChange}
            >
              {this.createCountryCodeOptions()}
            </Input>
          </Col>
          <Col sm="3">
            <Input
              type="latitude"
              label="Latitude"
              name="lat"
              placeholder="Latitude"
              value={this.state.geo.lat}
              onChange={this.handleGeoChange}
            />
          </Col>
          <Col sm="3">
            <Input
              type="longitude"
              label="Longitude"
              name="lon"
              placeholder="Longitude"
              value={this.state.geo.lon}
              onChange={this.handleGeoChange}
            />
          </Col>
        </FormGroup>

        <FormGroup row className="Form-explanation">
          <Col sm="3" />
          <Col sm="9">
            <FormText>Set the country, latitude and longitude, independently. <a href="https://www.latlong.net/">latlong.net</a></FormText>
          </Col>
        </FormGroup>

        <FormTextRow
          type="password"
          label="Password"
          name="password"
          value={this.state.password}
          onChange={this.handleInputChange}
        />

        <FormTextRow
          type="password"
          label="Host password"
          name="hostPassword"
          value={this.state.hostPassword}
          onChange={this.handleInputChange}
        >
          Authenticate to host role with <code>!auth admin [password]</code>
        </FormTextRow>

        <FormTextRow
          type="password"
          label="Admin password"
          name="adminPassword"
          value={this.state.adminPassword}
          onChange={this.handleInputChange}
        >
          Authenticate to admin role with <code>!auth admin [password]</code>
        </FormTextRow>

        <FormTextRow
          type="text"
          label="Token"
          name="token"
          valid={this.state.token}
          value={this.state.token}
          onChange={this.handleInputChange}
        >
          Obtain a token{" "}
          <a
            href="https://www.haxball.com/headlesstoken"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>{" "}
          and insert it above.
        </FormTextRow>

        <Repositories
          handleRepositoryChange={this.handleRepositoryChange}
          repositories={this.state.repositories}>
        </Repositories>


        <FormGroup>
          <Label for="pluginConfigJSON">
            <FontAwesomeIcon icon="plug" size="2x" /> Plugin config
          </Label>
          <FormText>
            Define which plugins to load from the available repositories and
            what options to give them. See{" "}
            <a
              href="https://github.com/morko/hhm-sala-plugins#hhm-sala-plugins"
              target="_blank"
              rel="noopener noreferrer"
            >
              my plugin repository
            </a>{" "}
            for examples of configurations for plugins.
          </FormText>
          <div className="PluginConfigField">
            <JSONInput
              id="pluginConfigJSON"
              colors={this.pluginConfigColors}
              placeholder={this.state.pluginConfig}
              locale={locale}
              height="400px"
              width="100%"
              onChange={this.handlePluginConfigChange}
            />
          </div>
        </FormGroup>

        <FormGroup>
          <Label for="roomScript">
            <FontAwesomeIcon icon="plug" size="2x" /> Room script
          </Label>
          <InputGroup>
            <CustomInput
              type="file"
              name="roomScript"
              id="roomScript"
              label={this.state.roomScript && this.state.roomScript.name}
              onChange={this.handleFileInputChange}
            />
            <InputGroupAddon addonType="append">
              <Button onClick={this.handleroomScriptClear}>Clear</Button>
            </InputGroupAddon>
          </InputGroup>
        </FormGroup>

        <FormGroup row>
          <Col sm="12">
            <FormText>
              Use this if you want to run a regular HaxBall room script.
              <b>Disables plugins.</b>
            </FormText>
          </Col>
        </FormGroup>

        <FormGroup check>
          <Label check>
            <Input
              type="checkbox"
              name="public"
              value="true"
              onChange={this.handleInputChange}
            />{" "}
            Public room
          </Label>
        </FormGroup>

        <Button className="OpenRoomForm-submit" color="success">
          Open Room
        </Button>

        <AdvancedForm
          handleFileInputChange={this.handleFileInputChange}
          roomScript={this.state.roomScript}
          hhmConfig={this.state.hhmConfig}
        />
      </Form>
    );
  }
}

OpenRoomForm.propTypes = {
  openRoom: PropTypes.func,
  errorMessage: PropTypes.string
};
