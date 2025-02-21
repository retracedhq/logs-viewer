import { useState } from "react";
import ReactMarkdown from "react-markdown";
import Tooltip from "../shared/Tooltip";

type propTypes = {
  event: any;
  fields: any;
  renderers: any;
  openModal: any;
};

const EventRow: React.FC<propTypes> = ({ event, fields, renderers, openModal }) => {
  const [eventInfoToken, setEventInfoToken] = useState(false);

  const getFieldValue = (object, selector) => {
    if (!selector || typeof selector !== "string") {
      return "";
    }
    if (selector.indexOf(".") !== -1) {
      const parts = selector.split(".");
      let data = object;
      for (let i = 0; i < parts.length; i++) {
        data = data[parts[i]];
        if (!data) {
          return undefined;
        }
      }
      return data;
    } else {
      return object[selector];
    }
  };

  const getCellValue = (item) => {
    try {
      if (item.getValue) {
        if (typeof item.getValue === "function") {
          const value = item.getValue(event);
          if (typeof value === "string") {
            return value;
          } else {
            return "";
          }
        }
        return "";
      } else {
        return getFieldValue(event, item.field);
      }
    } catch (ex) {
      console.error(ex);
      return "";
    }
  };

  return (
    <div className="TableRow-wrapper flex-auto">
      <div className="TableRow flex">
        <div className="TableRow-content flex flex1">
          <div className="flex flex1">
            {fields.map((item, idx) => {
              if (item.type === "markdown") {
                return (
                  <div
                    key={idx}
                    className={`flex flex1 content-section EventItem u-fontWeight--medium u-lineHeight--more`}
                    data-testid="markdown">
                    <ReactMarkdown components={renderers} children={getCellValue(item)} />
                  </div>
                );
              } else if (item.type === "showEvent") {
                return (
                  <div
                    key={idx}
                    style={item.style}
                    className="flex flex1 content-section actions-section justifyContent--flexEnd"
                    data-testid={`event-cell-moreinfo-${idx}`}>
                    <div className="flex-column flex-auto icon-wrapper flex-verticalCenter">
                      <span
                        className="icon clickable u-codeIcon"
                        onClick={openModal}
                        onMouseEnter={() => setEventInfoToken(true)}
                        onMouseLeave={() => setEventInfoToken(false)}>
                        <Tooltip
                          visible={eventInfoToken}
                          text="More Info"
                          minWidth="80"
                          position="bottom-left"
                        />
                      </span>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div
                    data-testid={`event-cell-${idx}`}
                    key={idx}
                    style={item.style}
                    className="flex flex1 content-section alignItems--center">
                    <p className="u-fontWeight--medium u-color--tundora u-lineHeight--more">
                      {getCellValue(item)}
                    </p>
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventRow;
