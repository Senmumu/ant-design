import * as React from 'react';
import { useContext } from 'react';
import classNames from 'classnames';
import { ConfigContext } from '../config-provider';
import useStyle from './style';

export interface GroupProps {
  className?: string;
  size?: 'large' | 'small' | 'default';
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onMouseEnter?: React.MouseEventHandler<HTMLSpanElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLSpanElement>;
  onFocus?: React.FocusEventHandler<HTMLSpanElement>;
  onBlur?: React.FocusEventHandler<HTMLSpanElement>;
  prefixCls?: string;
  compact?: boolean;
}

const Group: React.FC<GroupProps> = props => {
  const { getPrefixCls, direction, iconPrefixCls } = useContext(ConfigContext);
  const { prefixCls: customizePrefixCls, className = '' } = props;
  const prefixCls = getPrefixCls('input-group', customizePrefixCls);
  const inputPrefixCls = getPrefixCls('input');
  const [wrapSSR, hashId] = useStyle(inputPrefixCls, iconPrefixCls);
  const cls = classNames(
    prefixCls,
    {
      [`${prefixCls}-lg`]: props.size === 'large',
      [`${prefixCls}-sm`]: props.size === 'small',
      [`${prefixCls}-compact`]: props.compact,
      [`${prefixCls}-rtl`]: direction === 'rtl',
    },
    hashId,
    className,
  );

  return wrapSSR(
    <span
      className={cls}
      style={props.style}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
    >
      {props.children}
    </span>,
  );
};

export default Group;