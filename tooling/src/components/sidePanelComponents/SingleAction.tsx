import React from 'react';
import ActionToken from './ActionToken';

interface SingleAction {
    disabled: boolean;
    actionIndex: number;
    onDoubleClick: (index: number) => void;
    unicode: string;
    icon?: string;
    duration: number;
    //Todo : add the rest types
    [key: string]: any;
}

const SingleAction = ({
    disabled,
    unicode,
    icon,
    duration,
    onDoubleClick,
    actionIndex,
}: SingleAction) => {
    //1.1 rem per frame
    const handleDoubleClick = () => {
        console.log('double click');
        onDoubleClick(actionIndex);
    };
    const width = duration * 2.0;
    const durationDimension = 14;
    const nudge = 3;
    return (
        <div onDoubleClick={handleDoubleClick}>
            <span
                style={{
                    fontSize: '8px',
                    position: 'relative',
                    top: -1 * durationDimension + nudge,
                    right: (-1 * durationDimension) / 2 + nudge,
                    zIndex: 100,
                    border: '1px solid #555',
                    width: `${durationDimension}px`,
                    height: `${durationDimension}px`,
                    borderRadius: `${durationDimension / 2}px`,
                    textAlign: 'center',
                    verticalAlign: 'middle',
                    background: '#555',
                    color: '#FFF',
                }}
            >
                {duration}
            </span>

            <ActionToken
                disabled={disabled}
                onClick={() => {}}
                selected={false}
                width={width}
            >
                <img
                    src={icon}
                    width="30px"
                    style={{ margin: '0 auto' }}
                    unselectable="on"
                />

                {/* <span style={{}}>{unicode}</span> */}
                {/* <p
                    style={{
                        marginTop: '0.1rem',
                        marginBottom: '0',
                    }}
                >
                    {
                        action.display.name
                    }
                </p> */}
            </ActionToken>
        </div>
    );
};

export default SingleAction;
