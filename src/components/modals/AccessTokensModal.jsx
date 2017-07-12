import * as React from "react";
import * as autoBind from "react-autobind";
import * as PropTypes from 'prop-types';
import Modal from "react-modal";
import FixedTableHeader from "../views/FixedTableHeader";

export default class AccessTokensModal extends React.Component {

    constructor(props, context) {
        super(props);
        autoBind(this);
        this.state = {
            creatingToken: false,
            updatingToken: false,
            tokenToUpdate: {},
            newTokenName: "",
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
        const { creatingToken, updatingToken } = this.state;
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
                                    <p className="u-fontWeight--normal">Update the name of <span className="token">{this.state.tokenToUpdate.display_name}</span> by filling out the field below.</p>
                                </div>
                                :
                                <div className="u-paddingBottom--more">
                                    <h3 className="u-fontWeight--medium u-marginBottom--normal u-fontSize--large">Create a new token</h3>
                                    <p className="u-fontWeight--normal">Create a new API token for your team to access and stream your audit logs.</p>
                                </div>
                            }
                            <div className="flex flex1">
                                <input className="Input flex1" type="text" placeholder="Token Name" onChange={(e) => { this.setState({ newTokenName: e.target.value }) }} />
                                {updatingToken ?
                                    <button className="Button primary flex-auto u-marginLeft--normal" onClick={() => { this.handleUpdateToken(this.state.tokenToUpdate) }}>Update Token</button> :
                                    <button className="Button primary flex-auto u-marginLeft--normal" onClick={() => { this.handleTokenCreation(this.state.newTokenName) }}>Create Token</button>
                                }
                            </div>
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
                                                                <span className="icon clickable u-deleteTokenIcon u-marginLeft--normal" onClick={() => { this.props.deleteEitapiToken(token) }}></span>
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
                    <div className="modal-content">
                        <h3 className="u-fontWeight--medium">No tokens</h3>
                        <button className="Button primary" onClick={() => { return; }}>Create new token</button>
                    </div>
                }
            </div>
        );
    }
}
