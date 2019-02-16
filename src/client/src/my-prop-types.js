import PropTypes from 'prop-types';

const MyPropTypes = {
  playerObject: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    team: PropTypes.number.isRequired,
    admin: PropTypes.bool.isRequired,
  }),
}

export default MyPropTypes;
