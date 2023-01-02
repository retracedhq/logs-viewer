import React from "react";
import autoBind from "react-autobind";
import PropTypes from "prop-types";


export default class Loader extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    color: PropTypes.string,
    displayBlock: PropTypes.bool,
    size: PropTypes.string,
  };

  static defaultProps = {
    color: "#337AB7",
    displayBlock: false,
    size: "40",
  };

  constructor() {
    super();
    autoBind(this);
  }

  render() {
    const {
      className,
      color,
      displayBlock,
      size,
    } = this.props;

    const displayClassName = displayBlock ? "u-display--block" : "u-display--inlineBlock";

    return (
      <div className={`Loader ${className || ""} ${displayClassName}`}>
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={`${size}px`} height={`${size}px`} viewBox="0 0 40 40" enableBackground="new 0 0 40 40">
          <path opacity="0.2" fill={`${color}`} d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946 s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634 c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"/>
          <path fill={`${color}`} d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0 C22.32,8.481,24.301,9.057,26.013,10.047z" dangerouslySetInnerHTML={{ __html: '<animateTransform attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="0.5s" repeatCount="indefinite" />'}}>  
          </path>
        </svg>
      </div>
    );
  }
}
