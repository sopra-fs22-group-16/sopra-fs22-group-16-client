import SockJsClient from 'react-stomp';
import {getDomain} from 'helpers/getDomain';

const Socket = props => {

    // when receiving a message, Socket component will refresh the view 
    // which uses it.
    const onMessageReceive = () => {
        window.location = window.location.href;
    }

    return (
        <SockJsClient
            url={getDomain() + "/hannibal-websocket"}
            topics={props.topics}
            onMessage={() => onMessageReceive()}
        />
    );
}

export default Socket;
