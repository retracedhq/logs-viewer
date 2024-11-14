import React, { useEffect, useState } from "react";
import _ from "lodash";

const handlers: Array<() => void> = [];

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

  return function decorateClass(DecoratedComponent: React.ComponentType<any>) {
    const Resize: React.FC<any> = (props) => {
      const [state, setState] = useState(() => getInitialState());

      function getInitialState() {
        if (typeof onResize === "function") {
          const determinedWindow = typeof window === "object" ? window : {};
          const newState = onResize(determinedWindow);
          if (newState && typeof newState === "object") {
            return newState;
          }
        }
        return {};
      }

      const onWindowResize = _.debounce(() => {
        setState(getInitialState());
      }, debounceTime);

      useEffect(() => {
        const registeredIndex = handlers.length;
        handlers.push(onWindowResize);

        const resizeListener = () => {
          setTimeout(defferedHandlerCaller, 0);
        };

        window.addEventListener("resize", resizeListener);

        return () => {
          // Clean up the handler
          handlers.splice(registeredIndex, 1, null);
          window.removeEventListener("resize", resizeListener);
        };
      }, [onWindowResize]);

      return <DecoratedComponent {...props} {...state} />;
    };

    return Resize;
  };
}
