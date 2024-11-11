const EventModal = ({ event }) => {
  const formattedEvent = JSON.stringify(event, null, 2);

  return (
    <div>
      <h1 className="u-fontWeight--normal">Audit Event Info</h1>
      <div className="modal-content">
        <div>
          <textarea
            style={{
              width: "100%",
              minHeight: "200px",
              height: "300px",
              resize: "none",
            }}
            readOnly
            value={formattedEvent}></textarea>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
