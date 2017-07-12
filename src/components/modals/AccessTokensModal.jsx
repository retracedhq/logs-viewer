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
        newTokenName: "",
        apiTokens: props.apiTokens,
        tokensLoading: props.tokensLoading,
    }
  }

  handleTokenCreation(name) {
    this.props.createEitapiToken(name);
    this.setState({ creatingToken: false });
  }

  render() {
    const { creatingToken, apiTokens, tokensLoading } = this.state;
    return (
      <div>
          <h1>Access Tokens</h1>
          { apiTokens.length ?
                creatingToken && !tokensLoading ?
                    <div className="modal-content">
                        <h3>Create a new token</h3>
                        <p>Create a new API token for your team to access and stream your audit logs.</p>
                        <div className="name-input">
                            <input type="text" placeholder="Token Name" onChange={(e) => { this.setState({ newTokenName: e.target.value }) }}  />
                            <button className="Button primary" onClick={() => { this.handleTokenCreation(this.state.newTokenName) }}>Create Token</button>
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
                                        <td>{token.id}</td>
                                        <td>{token.display_name}</td>
                                        <td>
                                            <span className="icon u-editIcon" onClick={() => { this.props.updateEitapiToken(token) }}>Edit</span>
                                            <span onClick={() => { this.props.deleteEitapiToken(token) }}>Delete</span>
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

