import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Video from './Video';
import MdlGrid from '../../mdl/MdlGrid';
import MdlCell from '../../mdl/MdlCell';

const uniqueId = require('lodash/uniqueId');

class Section extends Component {
    constructor(props) {
        super(props);

        this.state = {
            socketID: undefined,
            remoteVideoIDs: [],
            prevRemoteVideoIDs: [],
            activeVideo: 'Qmn2bhY07NQ'
        };
        Section.instance = this;
        this.changeVideo = this.changeVideo.bind(this)
    }

    changeVideo(video) {
        this.setState({activeVideo: video})
    }

    componentDidMount() {
        this.props.webrtc.section = this;
        this.props.webrtc.register();
    }

    render() {
        return (
            <section className="mdl-layout__tab-panel is-active" id={'scroll-tab-' + this.props.id}>
                <div className="page-content">
                    <MdlGrid>
                        <MdlCell cellWidth={6}>
                            <div className="broadcast">
                                <MdlGrid>
                                    <Video cellWidth={12 / (this.state.remoteVideoIDs.length + 1)}
                                           videoId="localVideo"/>
                                    {this.state.remoteVideoIDs.map((videoId) =>
                                        <Video cellWidth={12 / (this.state.remoteVideoIDs.length + 1)}
                                               videoId={videoId}
                                               isRemoteVideo={true}
                                               key={uniqueId()}/>)}
                                </MdlGrid>
                            </div>
                        </MdlCell>
                        <MdlCell cellWidth={6}>
                            <div id="video">
                                <iframe title="centerVideo"
                                        src={"https://www.youtube.com/embed/" + this.state.activeVideo}/>
                            </div>
                        </MdlCell>
                    </MdlGrid>
                </div>
            </section>
        )
    }
}

Section.propTypes = {
    id: PropTypes.string.isRequired,
    webrtc: PropTypes.object.isRequired
};

export default Section;