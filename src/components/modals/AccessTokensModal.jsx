import * as React from "react";
import * as autoBind from "react-autobind";
import * as PropTypes from 'prop-types';
import Modal from "react-modal";

export default class AccessTokensModal extends React.Component {
  
  constructor() {
    super();
    autoBind(this);
    this.state = {
        creatingToken: false,
    }
  }

  render() {
    const { apiTokens } = this.props;
    return (
      <div>
          <h1>Access Tokens</h1>
          { apiTokens.length ?
            <table className="tokens-table">
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                </tr>
                {
                    apiTokens.map((token, i) => (
                        <tr>
                            <td>{token.id}</td>
                            <td>{token.display_name}</td>
                        </tr>
                    ))
                }
                </table>
            :
            <div className="modal-content">
              <h3>Create a new token</h3>
              <p>Create a new API token for your team to access and stream your audit logs.</p>
              <div className="name-input">
                <input type="text" placeholder="Token Name" onChange={(e) => { return; }}  />
                <button className="Button primary" onClick={() => { return; }}>Create Token</button>
              </div>
            </div>
          }
      </div>
    );
  }
}

