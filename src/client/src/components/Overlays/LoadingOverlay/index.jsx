/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import './index.css';

export default function LoadingOverlay({text}) {
  return (
    <div className="LoadingOverlay">
      <span className="LoadingOverlay-disc"></span>
      <div className="LoadingOverlay-text">{text}</div>
    </div>
  );
}

LoadingOverlay.propTypes = {
  // text to show on the loading overlay
  text: PropTypes.string.isRequired,
}
