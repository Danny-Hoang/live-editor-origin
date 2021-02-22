import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import SimpleBar from 'simplebar-react';
import scrollIntoView from 'scroll-into-view-if-needed'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';

const SnippetList = (props) => {
    const { snippets, activeID, onItemClick, className } = props;
    const onClick = (e) => {
        onItemClick && onItemClick(e)
    }

    const listRef = useRef(null);
    useEffect(() => {
        if(activeID && snippets.length) {
            let node = document.querySelector('.snippet-item.active');
            console.log(node)
            if(node) {
                scrollIntoView(node);
            }
        }
    },[snippets, activeID])
    return (
        <ListWrap className={className}>
            {
                snippets.map(e => (
                    <div className={classNames("snippet-item", { active: e.id === activeID })} onClick={() => onClick(e)} key={e.id}>{e.title}</div>
                ))
            }
        </ListWrap>
    )
}

export default SnippetList;

const ListWrap = styled(SimpleBar)`
    display: flex;
    flex-direction: column;
    overflow: auto;
    .snippet-item {
        line-height: 24px;
        font-size: 14px;
        font-weight: 500;
        padding-left: 24px;
        color: var(--gray-8);
        cursor: pointer;
        font-family: Karla;
        &:hover {
            color: #2196F3;
        }
        &.active {
            color: #2196F3;
            pointer-events: none;
            cursor: default;
        }
    }
`