import React, {Component} from 'react';
import PropTypes from 'prop-types';
import MdlCell from "../../mdl/MdlCell";
import UsersButtons from "./UsersButtons";
import UserRow from "./UserRow";

export default class UsersTable extends Component {
    constructor(props) {
        super(props);
        this.selectedUsers = new Set();

        this.state = {
            remoteUsers: this.props.remoteUsers
        };

        this.selectUser = this.selectUser.bind(this);
        this.kickSelectedUsers = this.kickSelectedUsers.bind(this);
        this.enableSelectedUsers = this.enableSelectedUsers.bind(this);
        this.disableSelectedUsers = this.disableSelectedUsers.bind(this);
        this.transferOwner = this.transferOwner.bind(this);
    }

    selectUser(user) {
        const users = this.selectedUsers;
        if (users.has(user))
            users.delete(user);
        else {
            users.add(user);
            /*
                //send direcct video
            console.log(this.state.channel);
            var  vid = this.props.activeVideo;
                console.log("DUPA DUPA " + user + vid);
                ;*/
        }
    }

    kickSelectedUsers() {
        // TODO
        // users available at this.selectedUsers
        // use this.props.channel to send messages
        console.log(this.selectedUsers);
        for (var user of this.selectedUsers) {
            this.props.channel.channels[user].send({'kick': 'lecisz'})
        }
        console.log(this.selectedUsers)

    }

    enableSelectedUsers() {
        console.log(this.selectedUsers);
        const msg = {
            "changeUserAllow": true,
            "perm": true

        };


        for (var user of this.selectedUsers) {
            this.props.channel.channels[user].send(msg)
        }
    }

    disableSelectedUsers() {
        console.log(this.selectedUsers);
        const msg = {
            "changeUserAllow": true,
            "perm": false

        };


        for (var user of this.selectedUsers) {
            this.props.channel.channels[user].send(msg)
        }
    }

    transferOwner() {

        for (var user of this.selectedUsers) {
            console.log(user);


            this.props.stopBeOwner(user);
            // send new owner name
            /*
            const msg = {
                            "changeOwner": true,
                            "name": user

                        };
            this.props.channel.send(msg) //nowy message i obsługa
            // send info to new owner
            */

            this.props.channel.channels[user].send({"newOwner": true}) //stan sie ownerem
            //new owner send own video and start be owner


            //this.props.channel.channels[user].send(msg)

            break;

        }


    }

    componentDidMount() {
        window.componentHandler.upgradeElement(this.label);
    }

    render() {
        return (
            <MdlCell cellWidth={12}>
                <UsersButtons title={'Kick'} handleClick={this.kickSelectedUsers}/>
                <UsersButtons title={'Enable'} handleClick={this.enableSelectedUsers}/>
                <UsersButtons title={'Disable'} handleClick={this.disableSelectedUsers}/>
		 <UsersButtons title={'Owner'} handleClick={this.transferOwner}/>
                <table className="mdl-data-table mdl-shadow--2dp">

                    <thead>
                    <tr>
                        <th>
                            <label className="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect mdl-data-table__select"
                                   htmlFor="table-header" ref={(label) => {
                                this.label = label;
                            }}>
                                <input type="checkbox" id="table-header" className="mdl-checkbox__input"/>
                            </label>
                        </th>
                        <th className="mdl-data-table__cell--non-numeric">Username</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.props.remoteUsers.map(username =>
                        <UserRow username={username} onChange={() => this.selectUser(username)}/>)
                    }
                    </tbody>
                </table>
            </MdlCell>
        )
    }
}

UsersTable.propTypes = {
    remoteUsers: PropTypes.arrayOf(PropTypes.string),
    channel: PropTypes.object.isRequired
};
