import * as React from "react";
import * as autoBind from "react-autobind";
import * as PropTypes from 'prop-types';
import Modal from "react-modal";

export default class AccessTokensModal extends React.Component {
  
  constructor(props, context) {
    super(props);
    autoBind(this);
    this.state = {
        creatingToken: false,
        updatingToken: false,
        tokenToUpdate: {},
        newTokenName: "",
        apiTokens: props.apiTokens,
        tokensLoading: props.tokensLoading,
    }
  }

  handleTokenCreation(name) {
    this.props.createEitapiToken(name);
    this.setState({ creatingToken: false });
  }

  handleUpdateToken(token) {
    this.props.updateEitapiToken(token, this.state.newTokenName);  
    this.setState({ updatingToken: false, tokenToUpdate: {} });
  }

  render() {
    const { creatingToken, apiTokens, tokensLoading, updatingToken } = this.state;
    return (
      <div>
          <h1>Access Tokens</h1>
          { apiTokens.length ?
                (creatingToken || updatingToken) && !tokensLoading ?
                    <div className="modal-content">
                        { updatingToken ?
                            <div>
                                <h3>Update your token</h3>
                                <p>Update the name of <span className="token">{this.state.tokenToUpdate.display_name}</span> by filling out the field below.</p>
                            </div>
                            :
                            <div>
                                <h3>Create a new token</h3>
                                <p>Create a new API token for your team to access and stream your audit logs.</p>
                            </div>
                        }
                        <div className="name-input">
                            <input type="text" placeholder="Token Name" onChange={(e) => { this.setState({ newTokenName: e.target.value }) }}  />
                            { updatingToken ?
                                <button className="Button primary" onClick={() => { this.handleUpdateToken(this.state.tokenToUpdate) }}>Update Token</button> :
                                <button className="Button primary" onClick={() => { this.handleTokenCreation(this.state.newTokenName) }}>Create Token</button>                                
                            }
                        </div>
                    </div> 
                :
                    <div>
                        <table className="tokens-table">
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th colSpan="2">Name</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                apiTokens.map((token, i) => (
                                    <tr key={`${token.id}-${i}`}>
                                        <td className="token-id">{token.id}</td>
                                        <td className="token-name">{token.display_name}</td>
                                        <td>
                                            <span className="icon u-editTokenIcon" onClick={() => { this.setState({ updatingToken: true, tokenToUpdate: token }); }}></span>
                                            <span className="icon u-deleteTokenIcon" onClick={() => { this.props.deleteEitapiToken(token) }}></span>
                                        </td>
                                    </tr>
                                ))
                            }
                            </tbody>          
                         </table>
                        <div className="buttons">
                            <button className="Button secondary" onClick={() => { this.props.closeModal(); }}>Done</button>
                            <button className="Button primary" onClick={() => { this.setState({ creatingToken: true }) }}>Create Token</button>
                        </div>
                    </div>
            :
            <div className="modal-content">
              <h3>No tokens</h3>
              <button className="Button primary" onClick={() => { return; }}>Create new token</button>
            </div>
          }
      </div>
    );
  }
}

