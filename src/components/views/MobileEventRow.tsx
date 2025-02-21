import ReactMarkdown from "react-markdown";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type propTypes = {
  event: any;
  fields?: any;
  renderers: any;
  openModal: any;
  index?: number;
};

const MobileEventRow: React.FC<propTypes> = ({ event, index, openModal, renderers }) => {
  const location = event.country || event.source_ip;
  const date = dayjs(event.canonical_time).fromNow();

  return (
    <div
      className={`TableRow-wrapper flex-auto u-cursor--pointer ${index === 0 ? "u-borderTop--gray" : ""}`}
      onClick={openModal}>
      <div className="TableRow flex mobile-row">
        <div className="TableRow-content flex flex1">
          <div className="flex-column flex1 u-overflow--hidden">
            <div className="flex flex-auto">
              <div className="u-color--dustyGray u-fontSize--normal u-lineHeight--normal EventItem u-fontWeight--medium u-lineHeight--more u-display--inlineBlock">
                <ReactMarkdown components={renderers} children={event.display.markdown} />
              </div>
            </div>
            <div className="flex flex1 u-marginTop--normal">
              <div className="flex flex1 u-paddingRight--small ellipsis-overflow">
                <p className="u-fontWeight--normal u-color--dustyGray u-fontSize--normal u-lineHeight--normal">
                  Date: <span className="u-fontWeight--medium u-color--tundora">{date}</span>
                </p>
              </div>
              <div className="flex flex-auto u-paddingLeft--small justifyContent--flexEnd">
                {location ? (
                  <p className="u-fontWeight--normal u-color--dustyGray u-fontSize--normal u-lineHeight--normal">
                    Location: <span className="u-fontWeight--medium u-color--tundora">{location}</span>
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileEventRow;
