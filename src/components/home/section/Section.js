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
            remoteVideos: {},
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
        const cellWidth = Math.max(12/(Object.keys(this.state.remoteVideos).length + 1), 6);
        return (
            <section className="mdl-layout__tab-panel is-active" id={'scroll-tab-' + this.props.id}>
                <div className="page-content">
                    <MdlGrid>
                        <MdlCell cellWidth={6}>
                            <div className="broadcast">
                                <MdlGrid>
                                    <Video cellWidth={cellWidth}
                                           videoId="localVideo"/>
                                    {Object.entries(this.state.remoteVideos).map(video =>
                                        <Video cellWidth={cellWidth}
                                               videoId={video[0]}
                                               src={video[1]}
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