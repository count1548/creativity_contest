import React from 'react';
import { withStyles, Theme } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

const HtmlTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid black',
  },
}))(Tooltip);

export default function CustomizedTooltips(props) {
    const {children, content} = props
    return (
        <HtmlTooltip
            title={<React.Fragment>{content}</React.Fragment>}
            placement="right">
            {children}
        </HtmlTooltip>
    );
}