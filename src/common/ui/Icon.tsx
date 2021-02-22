import styled, { css } from 'styled-components';
import React from 'react';
import classnames from 'classnames';
import Tooltip from 'antd/lib/tooltip';

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
    size?: number | string;
    className?: string;
    color?: string;
    hoverColor?: string;
    disabled?: boolean;
    tooltip?: string;
    type?: string;
}

const font_prefix = 'pvs2-icon--';
const Icon = (props: IconProps) => {
    const { size, className, color, disabled, tooltip, type, hoverColor, ...others } = props;
    const cls = type ? font_prefix + type : '';
    const usedSize = !size ? '1em' : typeof size === 'string' ? size : `${size}px`;
    if (tooltip) {
        return (
            <Tooltip title={tooltip}>
                <Span
                    className={classnames(className, cls)}
                    size={usedSize}
                    color={color}
                    disabled={disabled}
                    {...others}
                />
            </Tooltip>
        );
    }
    return (
        <Span className={classnames(className, cls)} size={usedSize} color={color} disabled={disabled} {...others} hoverColor={hoverColor}/>
    );
};

export default Icon;

const Span = styled('span')<{ size?: string, disabled?: boolean | undefined, hoverColor?: string | undefined }>`
    font-size: ${props => `${props.size}`};
    color: ${props => props.color || null};
    ${props =>
        props.disabled &&
        css`
            opacity: 0.4;
            pointer-events: none;
        `};
    ${props =>
        props.hoverColor &&
        css`
            &:hover {
                color: ${props.hoverColor};
            }
        `};
`;
