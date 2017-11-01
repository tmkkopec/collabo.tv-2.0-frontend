import React, {Component} from 'react';
import PropTypes from 'prop-types';
import MdlGrid from '../../mdl/MdlGrid';
import MdlCell from '../../mdl/MdlCell';
import VideoController from "../video/VideoController";

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
        return (
            <section className="mdl-layout__tab-panel is-active full-screen" id={'scroll-tab-' + this.props.id}>
                <div className="page-content full-screen">
                    <MdlGrid className={'full-screen'}>
                        <MdlCell cellWidth={8}>
                            <div id="video">
                                <iframe title="centerVideo"
                                        src={"https://www.youtube.com/embed/" + this.state.activeVideo}/>
                            </div>
                        </MdlCell>
                        <MdlCell cellWidth={4}>
                            <VideoController
                                localUsername={this.props.webrtc.name}
                                remoteVideos={this.state.remoteVideos}
                                toggleAudio={this.props.webrtc.toggleAudio}
                                toggleVideo={this.props.webrtc.toggleVideo}
                            />
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