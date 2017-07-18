import * as React from "react";
import { connect } from "react-redux";
import * as autoBind from "react-autobind";
import * as PropTypes from 'prop-types';
import FixedTableHeader from "../views/FixedTableHeader";
import { fetchEitapiTokensList, 
         createEitapiToken, 
         deleteEitapiToken, 
         updateEitapiToken } from "../../redux/data/apiTokens/thunks";

class AccessTokensModal extends React.Component {
  
  constructor(props, context) {
    super(props);
    autoBind(this);
    this.state = {
      creatingToken: false,
      updatingToken: false,
      tokenToUpdate: {},
      newTokenName: "",
      tokenToDelete: {},
      deletingToken: false,
      nameEmptyError: true,
      showErrorClass: false,
    }
  }

  componentWillMount() {
    this.props.fetchEitapiTokensList();
  }

  componentDidUpdate() {
    const { creatingToken, updatingToken } = this.state;
    if (creatingToken || updatingToken) {
      setTimeout(() => {
        this.refs.tokenName.focus();
      }, 10);
    }
  }

  handleTokenCreation(name) {
    if(!this.state.nameEmptyError) {
      this.props.createEitapiToken(name);
      this.reset();
    } else {
      this.setState({ showErrorClass: true });
    }
  }

  handleUpdateToken(token) {
    if(!this.state.nameEmptyError) {
      this.props.updateEitapiToken(token, this.state.newTokenName);
      this.reset();
    } else {
      this.setState({ showErrorClass: true });
    }
  }
  
  handleDeleteToken(token) {
    this.setState({ 
        tokenToDelete: token,
        deletingToken: true,
    })
  }

  handleNameUpdate(e) {
    if(e.target.value !== "") {
      this.setState({ newTokenName: e.target.value, nameEmptyError: false });
    } else {
      this.setState({ nameEmptyError: true });
    }
  }

  reset() {
    this.setState({ 
      updatingToken: false, 
      creatingToken: false, 
      showErrorClass: false, 
      nameEmptyError: true,
      tokenToUpdate: {},
      newTokenName: "",
    })
  }

  render() {
    const { creatingToken, updatingToken, deletingToken } = this.state;
    const { apiTokens, tokensLoading } = this.props;
    const tableHeaderItems = [
      {
        label: "Id",
        style: { maxWidth: "300px" },
      },
      {
        label: "Name",
        style: { maxWidth: "160px" },
      },
      {
        label: "",
        style: { maxWidth: "40px" },
      }
    ]
    return (
      <div>
        <h1 className="u-fontWeight--normal">Access Tokens</h1>
        {apiTokens.length ?
          (creatingToken || updatingToken) && !tokensLoading ?
            <div className="modal-content">
              {updatingToken ?
                <div className="u-paddingBottom--more">
                  <h3 className="u-fontWeight--medium u-marginBottom--normal u-fontSize--large">Update your token</h3>
                  <p className="u-fontWeight--normal">Update <span className="u-fontWeight--bold">{this.state.tokenToUpdate.display_name}</span> by filling out the field below.</p>
                </div>
                :
                <div className="u-paddingBottom--more">
                  <h3 className="u-fontWeight--medium u-marginBottom--normal u-fontSize--large">Create a new token</h3>
                  <p className="u-fontWeight--normal">Create a new API token for your team to access and stream your audit logs.</p>
                </div>
              }
              <div className="flex flexWrap--wrap justifyContent--flexEnd">
                <input className={`Input u-marginBottom--more ${this.state.showErrorClass ? "has-error" : ""}`} ref="tokenName" type="text" placeholder="Token Name" onChange={(e) => { this.handleNameUpdate(e); }} />
                <button className="Button secondary flex-auto u-marginLeft--normal" onClick={() => { this.reset(); }}>Back</button>             
                {updatingToken ?
                  <button className="Button primary flex-auto u-marginLeft--normal" onClick={() => { this.handleUpdateToken(this.state.tokenToUpdate) }}>Update Token</button> :
                  <button className="Button primary flex-auto u-marginLeft--normal" onClick={() => { this.handleTokenCreation(this.state.newTokenName) }}>Create Token</button>
                }
              </div>
            </div>
            :
              deletingToken ?
                <div className="flex justifyContent--flexStart u-padding--normal">
                    <p className="u-fontWeight--normal u-padding--normal">Are you sure want to delete this token?</p>
                    <button className="Button secondary" onClick={() => { this.setState({ tokenToDelete: {}, deletingToken: false }) }}>No</button>
                    <button className="Button primary u-marginLeft--normal" onClick={() => { this.props.deleteEitapiToken(this.state.tokenToDelete); this.setState({ deletingToken: false }); }}>Yes</button>
                </div>
              :
                <div className="flex-column flex1 u-overflow--hidden">
                    <div className="flex flex-auto">
                        <FixedTableHeader
                        items={tableHeaderItems}
                        />
                    </div>
                    <div className="flex-column flex-1-auto u-overflow--auto">
                        {
                        apiTokens.map((token, i) => (
                            <div className="TableRow-wrapper flex-auto" key={`${token.id}-${i}`}>
                            <div className="TableRow flex">
                                <div className="TableRow-content flex flex1">
                                <div className="flex flex1">
                                    <div style={{ maxWidth: "300px" }} className="flex-column flex1 content-section flex-verticalCenter ellipsis-overflow">
                                    <p className="u-fontWeight--medium u-color--tundora u-lineHeight--more">
                                        {token.id}
                                    </p>
                                    </div>
                                    <div style={{ maxWidth: "160px" }} className="flex-column flex1 content-section flex-verticalCenter">
                                    <p className="u-fontWeight--medium u-color--tundora u-lineHeight--more">
                                        {token.display_name}
                                    </p>
                                    </div>
                                    <div style={{ maxWidth: "40px" }} className="flex flex-auto content-section justifyContent--flexEnd">
                                    <div className="flex-column flex-verticalCenter">
                                        <span className="icon clickable u-editTokenIcon" onClick={() => { this.setState({ updatingToken: true, tokenToUpdate: token }); }}></span>
                                    </div>
                                    <div className="flex-column flex-verticalCenter">
                                        <span className="icon clickable u-deleteTokenIcon u-marginLeft--normal" onClick={() => { this.handleDeleteToken(token) }}></span>
                                    </div>
                                    </div>
                                </div>
                                </div>
                            </div>
                            </div>
                        ))
                        }
                    </div>
                <div className="flex flex-auto buttons justifyContent--flexEnd">
                    <button className="Button secondary" onClick={() => { this.props.closeModal(); }}>Done</button>
                    <button className="Button primary u-marginLeft--normal" onClick={() => { this.setState({ creatingToken: true }) }}>Create Token</button>
                </div>
                </div>
          :
            creatingToken ?
                <div className="modal-content">
                    <div className="u-paddingBottom--more">
                        <h3 className="u-fontWeight--medium u-marginBottom--normal u-fontSize--large">Update your token</h3>
                        <p className="u-fontWeight--normal">Update <span className="u-fontWeight--bold">{this.state.tokenToUpdate.display_name}</span> by filling out the field below.</p>
                    </div>
                    <div className="flex flexWrap--wrap justifyContent--flexEnd">
                        <input className={`Input u-marginBottom--more ${this.state.showErrorClass ? "has-error" : ""}`} ref="tokenName" type="text" placeholder="Token Name" onChange={(e) => { this.handleNameUpdate(e); }} />
                        <button className="Button secondary flex-auto u-marginLeft--normal" onClick={() => { this.reset(); }}>Back</button>
                        <button className="Button primary flex-auto u-marginLeft--normal" onClick={() => { this.handleTokenCreation(this.state.newTokenName) }}>Create Token</button>
                    </div>
                </div>
            :
                <div className="modal-content flex flexWrap--wrap justifyContent--center">
                    <div className="u-tokenIllustration u-padding--normal"></div>
                    <p className="u-fontWeight--medium u-paddingBottom--small u-width--full u-textAlign--center">You have not created any access tokens</p>
                    <button className="Button primary u-margin--small" onClick={() => { this.setState({ creatingToken: true }) }}>Create new token</button>
                </div>
        }
      </div>
    );
  }
}

export default connect(
  state => ({
    apiTokens: state.data.apiTokenData.apiTokens,
    tokensLoading: state.ui.loadingData.tokensLoading,
  }),
  dispatch => ({
    fetchEitapiTokensList() {
      return dispatch(fetchEitapiTokensList());
    },
    createEitapiToken(name) {
      return dispatch(createEitapiToken(name));
    },
    deleteEitapiToken(token) {
      return dispatch(deleteEitapiToken(token));
    },
    updateEitapiToken(token, newName) {
      return dispatch(updateEitapiToken(token, newName));
    },
  }),
)(AccessTokensModal);

