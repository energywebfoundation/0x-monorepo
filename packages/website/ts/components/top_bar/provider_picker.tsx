import * as _ from 'lodash';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Blockchain } from 'ts/blockchain';
import { DropDown } from 'ts/components/ui/drop_down';
import { Identicon } from 'ts/components/ui/identicon';
import { Dispatcher } from 'ts/redux/dispatcher';
import { ProviderType } from 'ts/types';
import { constants } from 'ts/utils/constants';
import { utils } from 'ts/utils/utils';

const IDENTICON_DIAMETER = 32;
const SELECTED_BG_COLOR = '#F7F7F7';

interface ProviderPickerProps {
    networkId: number;
    injectedProviderName: string;
    providerType: ProviderType;
    onToggleLedgerDialog: () => void;
    dispatcher: Dispatcher;
    blockchain: Blockchain;
}

interface ProviderPickerState {}

export class ProviderPicker extends React.Component<ProviderPickerProps, ProviderPickerState> {
    public render() {
        const isLedgerSelected = this.props.providerType === ProviderType.Ledger;
        const menuStyle = {
            padding: 10,
            paddingTop: 15,
            paddingBottom: 15,
        };
        const injectedLabel = (
            <div className="flex">
                <div>{this.props.injectedProviderName}</div>
                {this._renderNetwork()}
            </div>
        );
        // Show dropdown with two options
        return (
            <div style={{ width: 225, overflow: 'hidden' }}>
                <RadioButtonGroup
                    name="provider"
                    defaultSelected={this.props.providerType}
                    onChange={this._onProviderRadioChanged.bind(this)}
                >
                    <RadioButton
                        style={{ ...menuStyle, backgroundColor: !isLedgerSelected && SELECTED_BG_COLOR }}
                        value={ProviderType.Injected}
                        label={injectedLabel}
                    />
                    <RadioButton
                        style={{ ...menuStyle, backgroundColor: isLedgerSelected && SELECTED_BG_COLOR }}
                        value={ProviderType.Ledger}
                        label="Ledger Nano S"
                    />
                </RadioButtonGroup>
            </div>
        );
    }
    private _renderNetwork() {
        const networkName = constants.NETWORK_NAME_BY_ID[this.props.networkId];
        return (
            <div className="flex">
                <div className="pr1 relative" style={{ width: 14, paddingLeft: 14 }}>
                    <img
                        src={`/images/network_icons/${networkName.toLowerCase()}.png`}
                        className="absolute"
                        style={{ top: 4, width: 14 }}
                    />
                </div>
                <div style={{ color: '#BBBBBB' }}>{networkName}</div>
            </div>
        );
    }
    private _onProviderRadioChanged(e: any, value: string) {
        if (value === ProviderType.Ledger) {
            this.props.onToggleLedgerDialog();
        } else {
            // Fire and forget
            this.props.blockchain.updateProviderToInjectedAsync();
        }
    }
}
