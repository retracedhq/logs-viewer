import React from "react";
import { connect } from "react-redux";
import autoBind from "react-autobind";
import FixedTableHeader from "../views/FixedTableHeader";
import Loader from "../views/Loader";
import {
  fetchEitapiTokensList,
  createEitapiToken,
  deleteEitapiToken,
  updateEitapiToken,
} from "../../redux/data/apiTokens/thunks";

const AccessTokensModal = (props) => {
  const tokenName = useRef(null);
  const { apiTokens, tokensLoading } = props;

  const [creatingToken, setCreatingToken] = useState(false);
  const [updatingToken, setUpdatingToken] = useState(false);
  const [tokenToUpdate, setTokenToUpdate] = useState({});
  const [newTokenName, setNewTokenName] = useState("");
  const [tokenToDelete, setTokenToDelete] = useState({});
  const [deletingToken, setDeletingToken] = useState(false);
  const [nameEmptyError, setNameEmptyError] = useState(true);
  const [showErrorClass, setShowErrorClass] = useState(false);

  useEffect(() => {
    fetchEitapiTokensList();
  }, [fetchEitapiTokensList]);

  useEffect(() => {
    if (creatingToken || updatingToken) {
      setTimeout(() => {
        tokenName.current.focus();
      }, 10);
    }
  }, [creatingToken, updatingToken]);

  const handleTokenCreation = (name) => {
    if (!nameEmptyError) {
      createEitapiToken(name);
      reset();
    } else {
      setShowErrorClass(true);
    }
  };

  const handleUpdateToken = (token) => {
    if (!nameEmptyError) {
      updateEitapiToken(token, newTokenName);
      reset();
    } else {
      setShowErrorClass(true);
    }
  };

  const handleDeleteToken = (token) => {
    setTokenToDelete(token);
    setDeletingToken(true);
  };

  const handleNameUpdate = (e) => {
    const value = e.target.value;
    if (value !== "") {
      setNewTokenName(value);
      setNameEmptyError(false);
    } else {
      setNameEmptyError(true);
    }
  };

  const reset = () => {
    setUpdatingToken(false);
    setCreatingToken(false);
    setShowErrorClass(false);
    setNameEmptyError(true);
    setTokenToUpdate({});
    setNewTokenName("");
  };

  const tableHeaderItems = [
    { label: "Token", style: { maxWidth: "300px" }, className: "flex1" },
    { label: "Name", style: { maxWidth: "160px" }, className: "flex1" },
    { label: "", style: { maxWidth: "40px" }, className: "flex1" },
  ];

  return (
    <div>
      <h1 className="u-fontWeight--normal">API Tokens</h1>
      {apiTokens.length ? (
        (creatingToken || updatingToken) && !tokensLoading ? (
          <div className="modal-content">
            {updatingToken ? (
              <div className="u-paddingBottom--more">
                <h3 className="u-fontWeight--medium u-marginBottom--normal u-fontSize--large">
                  Update your token
                </h3>
                <p className="u-fontWeight--normal">
                  Update <span className="u-fontWeight--bold">{tokenToUpdate.display_name}</span> by filling
                  out the field below.
                </p>
              </div>
            ) : (
              <div className="u-paddingBottom--more">
                <h3 className="u-fontWeight--medium u-marginBottom--normal u-fontSize--large">
                  Create a new token
                </h3>
                <p className="u-fontWeight--normal">
                  Create a new{" "}
                  <a
                    href={props.apiTokenHelpURL}
                    className="u-color--curiousBlue u-fontWeight--bold"
                    target="_blank">
                    API token
                  </a>{" "}
                  for your team to access and stream your audit logs.
                </p>
              </div>
            )}
            <div className="flex flexWrap--wrap justifyContent--flexEnd">
              <input
                className={`Input u-marginBottom--more ${showErrorClass ? "has-error" : ""}`}
                ref={tokenName}
                type="text"
                placeholder="Token Name"
                onChange={(e) => {
                  handleNameUpdate(e);
                }}
              />
              <button
                className="Button secondary flex-auto u-marginLeft--normal"
                onClick={() => {
                  reset();
                }}>
                Back
              </button>
              {updatingToken ? (
                <button
                  className="Button primary flex-auto u-marginLeft--normal"
                  onClick={() => {
                    handleUpdateToken(tokenToUpdate);
                  }}>
                  Update Token
                </button>
              ) : (
                <button
                  className="Button primary flex-auto u-marginLeft--normal"
                  onClick={() => {
                    handleTokenCreation(newTokenName);
                  }}>
                  Create Token
                </button>
              )}
            </div>
          </div>
        ) : deletingToken ? (
          <div className="flex justifyContent--flexStart u-padding--normal">
            <p className="u-fontWeight--normal u-padding--normal">Are you sure want to delete this token?</p>
            <button
              className="Button secondary"
              onClick={() => {
                setTokenToDelete({});
                setDeletingToken(false);
              }}>
              No
            </button>
            <button
              className="Button primary u-marginLeft--normal"
              onClick={() => {
                props.deleteEitapiToken(tokenToDelete);
                setDeletingToken(false);
              }}>
              Yes
            </button>
          </div>
        ) : (
          <div className="flex-column flex1 u-overflow--hidden">
            <div className="flex flex-auto">
              <FixedTableHeader items={tableHeaderItems} />
            </div>
            <div className="flex-column flex-1-auto u-overflow--auto">
              {apiTokens.map((token, i) => (
                <div className="TableRow-wrapper flex-auto" key={`${token.id}-${i}`}>
                  <div className="TableRow flex">
                    <div className="TableRow-content flex flex1">
                      <div className="flex flex1">
                        <div
                          style={{ minWidth: "300px" }}
                          className="flex-column flex1 content-section flex-verticalCenter ellipsis-overflow">
                          <p className="u-fontWeight--medium u-color--tundora u-lineHeight--more">
                            {token.id}
                          </p>
                        </div>
                        <div
                          style={{ minWidth: "160px" }}
                          className="flex-column flex1 content-section flex-verticalCenter">
                          <p className="u-fontWeight--medium u-color--tundora u-lineHeight--more">
                            {token.display_name}
                          </p>
                        </div>
                        <div
                          style={{ minWidth: "40px" }}
                          className="flex flex-auto content-section justifyContent--flexEnd">
                          <div className="flex-column flex-verticalCenter">
                            <span
                              className="icon clickable u-editTokenIcon"
                              onClick={() => {
                                setUpdatingToken(true);
                                setTokenToUpdate(token);
                              }}></span>
                          </div>
                          <div className="flex-column flex-verticalCenter">
                            <span
                              className="icon clickable u-deleteTokenIcon u-marginLeft--normal"
                              onClick={() => {
                                handleDeleteToken(token);
                              }}></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-auto buttons justifyContent--flexEnd">
              <a
                className="u-padding--normal u-fontSize--normal u-color--curiousBlue"
                href={props.apiTokenHelpURL}
                target="_blank">
                How to use Audit Log API Tokens
              </a>
              <button
                className="Button primary u-marginLeft--normal"
                onClick={() => {
                  setCreatingToken(true);
                }}>
                Create Token
              </button>
            </div>
          </div>
        )
      ) : creatingToken ? (
        <div className="modal-content">
          <div className="u-paddingBottom--more">
            <h3 className="u-fontWeight--medium u-marginBottom--normal u-fontSize--large">
              Update your token
            </h3>
            <p className="u-fontWeight--normal">
              Update <span className="u-fontWeight--bold">{tokenToUpdate.display_name}</span> by filling out
              the field below.
            </p>
          </div>
          <div className="flex flexWrap--wrap justifyContent--flexEnd">
            <input
              className={`Input u-marginBottom--more ${showErrorClass ? "has-error" : ""}`}
              ref={tokenName}
              type="text"
              placeholder="Token Name"
              onChange={(e) => {
                handleNameUpdate(e);
              }}
            />
            <button
              className="Button secondary flex-auto u-marginLeft--normal"
              onClick={() => {
                reset();
              }}>
              Back
            </button>
            <button
              className="Button primary flex-auto u-marginLeft--normal"
              onClick={() => {
                handleTokenCreation(newTokenName);
              }}>
              Create Token
            </button>
          </div>
        </div>
      ) : tokensLoading ? (
        <div className="flex-column flex1 justifyContent--center alignItems--center u-padding--more">
          <Loader size="70" color={props.theme === "dark" ? "#ffffff" : "#337AB7"} />
        </div>
      ) : (
        <div className="modal-content flex flexWrap--wrap justifyContent--center">
          <div className="u-tokenIllustration u-padding--normal"></div>
          <p className="u-fontWeight--medium u-paddingBottom--small u-width--full u-textAlign--center">
            You have not created any API tokens
          </p>
          <button
            className="Button primary u-margin--small"
            onClick={() => {
              setCreatingToken(true);
            }}>
            Create new token
          </button>
          <a
            className="u-padding--small u-textAlign--center u-display--block u-width--full  u-fontSize--normal u-color--curiousBlue"
            href={props.apiTokenHelpURL}
            target="_blank">
            How to use Audit Log API Tokens
          </a>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  apiTokens: state.data.apiTokenData.apiTokens,
  tokensLoading: state.ui.loadingData.apiTokensLoading,
});

const mapDispatchToProps = (dispatch) => ({
  fetchEitapiTokensList: () => dispatch(fetchEitapiTokensList()),
  createEitapiToken: (name) => dispatch(createEitapiToken(name)),
  deleteEitapiToken: (token) => dispatch(deleteEitapiToken(token)),
  updateEitapiToken: (token, newName) => dispatch(updateEitapiToken(token, newName)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AccessTokensModal);
