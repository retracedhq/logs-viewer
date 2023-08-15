import React from "react";
import _ from "lodash";
const handlers: any[] = [];

function defferedHandlerCaller() {
  handlers.forEach((handle) => {
    if (typeof handle === "function") {
      handle();
    }
  });
}

type Config = {
  onResize: any;
  debounce: number;
};

export function Resizer(config: Config) {
  const { onResize, debounce } = config || {};
  const debounceTime = debounce || 500;

  return function decorateClass(DecoratedComponent) {
    return class Resize extends React.Component {
      private _registeredIndex: number;
      constructor(props) {
        super(props);
        this.state = this.getState();
        this.onWindowResize = _.debounce(this.onWindowResize.bind(this), debounceTime);
      }

      getState() {
        if (typeof onResize === "function") {
          const determinedWindow = typeof window === "object" ? window : {};
          const newState = onResize(determinedWindow);
          if (newState && typeof newState === "object") {
            return newState;
          }
        }
        return {};
      }

      onWindowResize() {
        this.setState(this.getState());
      }

      componentDidMount() {
        this._registeredIndex = handlers.length;
        handlers.push(this.onWindowResize);

        window.addEventListener("resize", () => {
          setTimeout(defferedHandlerCaller, 0);
        });
      }

      componentWillUnmount() {
        // just place null in place to not throw off index
        handlers.splice(this._registeredIndex, 1, null);
      }

      render() {
        return <DecoratedComponent {...this.props} {...this.state} />;
      }
    };
  };
}
