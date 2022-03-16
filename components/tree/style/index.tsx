// import '../../style/index.less';
// import './index.less';

// deps-lint-skip-all
import { CSSObject, CSSInterpolation, Keyframes } from '@ant-design/cssinjs';
import {
  DerivativeToken,
  useStyleRegister,
  useToken,
  resetComponent,
  UseComponentStyleResult,
} from '../../_util/theme';
import { getStyle as getCheckboxStyle } from '../../checkbox/style';

// ============================ Keyframes =============================
const treeNodeFX = new Keyframes('ant-tree-node-fx-do-not-use', {
  '0%': {
    opacity: 0,
  },
  '100%': {
    opacity: 1,
  },
});

// ============================== Switch ==============================
const getSwitchStyle = (prefixCls: string, token: DerivativeToken): CSSObject => ({
  [`.${prefixCls}-switcher-icon`]: {
    display: 'inline-block',
    fontSize: 10, // FIXME: missing token
    verticalAlign: 'baseline',

    svg: {
      transition: `transform ${token.duration}`,
    },
  },
});

// =============================== Drop ===============================
const getDropIndicatorStyle = (prefixCls: string, token: DerivativeToken) => ({
  [`.${prefixCls}-drop-indicator`]: {
    position: 'absolute',
    // it should displayed over the following node
    zIndex: 1,
    height: 2,
    backgroundColor: token.primaryColor,
    borderRadius: 1,
    pointerEvents: 'none',

    '&:after': {
      position: 'absolute',
      top: -3,
      insetInlineStart: -6,
      width: 8,
      height: 8,
      backgroundColor: 'transparent',
      border: `2px solid ${token.primaryColor}`,
      borderRadius: '50%',
      content: '""',
    },
  },
});

// =============================== Base ===============================
type TreeToken = DerivativeToken & {
  treeCls: string;
  treeNodeCls: string;
  treeNodePadding: number;
  treeTitleHeight: number;
};

export const genBaseStyle = (prefixCls: string, token: TreeToken, hashId: string): CSSObject => {
  const { treeCls, treeNodeCls, treeNodePadding, treeTitleHeight } = token;

  const treeCheckBoxMarginVertical = (treeTitleHeight - token.fontSizeLG) / 2;
  const treeCheckBoxMarginHorizontal = token.paddingXS;

  return {
    [treeCls]: {
      ...resetComponent(token),
      background: token.componentBackground,
      borderRadius: token.borderRadius,
      transition: `background-color ${token.duration}`,

      '&&-rtl': {
        // >>> Switcher
        [`${treeCls}-switcher`]: {
          '&_close': {
            [`${treeCls}-switcher-icon`]: {
              svg: {
                transform: 'rotate(90deg)',
              },
            },
          },
        },
      },

      '&-focused:not(:hover):not(&-active-focused)': {
        background: token.tmpPrimaryHoverColorWeak,
      },

      // =================== Virtual List ===================
      [`${treeCls}-list-holder-inner`]: {
        alignItems: 'flex-start',
      },

      [`&${treeCls}-block-node`]: {
        [`${treeCls}-list-holder-inner`]: {
          alignItems: 'stretch',

          // >>> Title
          [`${treeCls}-node-content-wrapper`]: {
            flex: 'auto',
          },

          // >>> Drag
          [`${treeNodeCls}.dragging`]: {
            position: 'relative',

            '&:after': {
              position: 'absolute',
              top: 0,
              insetInlineEnd: 0,
              bottom: treeNodePadding,
              insetInlineStart: 0,
              border: `1px solid ${token.primaryColor}`,
              opacity: 0,
              animation: `${treeNodeFX.getName(hashId)} ${token.duration}`,
              animationPlayState: 'running',
              animationFillMode: 'forwards',
              content: '""',
              pointerEvents: 'none',
            },
          },
        },
      },

      // ===================== TreeNode =====================
      [`${treeNodeCls}`]: {
        display: 'flex',
        alignItems: 'flex-start',
        padding: `0 0 ${treeNodePadding}px 0`,
        outline: 'none',

        '&-rtl': {
          direction: 'rtl',
        },

        // Disabled
        '&-disabled': {
          // >>> Title
          [`${treeCls}-node-content-wrapper`]: {
            color: token.textColorDisabled,
            cursor: 'not-allowed',
            '&:hover': {
              background: 'transparent',
            },
          },
        },

        [`&-active ${treeCls}-node-content-wrapper`]: {
          background: token.itemHoverBackground,
        },

        [`&:not(&-disabled).filter-node ${treeCls}-title`]: {
          color: 'inherit',
          fontWeight: 500,
        },
      },

      // >>> Indent
      [`${treeCls}-indent`]: {
        alignSelf: 'stretch',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        '&-unit': {
          display: 'inline-block',
          width: treeTitleHeight,
        },
      },

      // >>> Drag Handler
      [`${treeCls}-draggable-icon`]: {
        width: treeTitleHeight,
        lineHeight: `${treeTitleHeight}px`,
        textAlign: 'center',
        opacity: 0.2,
        transition: `opacity ${token.duration}`,

        [`${treeNodeCls}:hover &`]: {
          opacity: 0.45,
        },
      },

      // >>> Switcher
      [`${treeCls}-switcher`]: {
        ...getSwitchStyle(prefixCls, token),
        position: 'relative',
        flex: 'none',
        alignSelf: 'stretch',
        width: treeTitleHeight,
        margin: 0,
        lineHeight: `${treeTitleHeight}px`,
        textAlign: 'center',
        cursor: 'pointer',
        userSelect: 'none',

        '&-noop': {
          cursor: 'default',
        },

        '&_close': {
          [`${treeCls}-switcher-icon`]: {
            svg: {
              transform: 'rotate(-90deg)',
            },
          },
        },

        '&-loading-icon': {
          color: token.primaryColor,
        },

        '&-leaf-line': {
          position: 'relative',
          zIndex: 1,
          display: 'inline-block',
          width: '100%',
          height: '100%',

          // https://github.com/ant-design/ant-design/issues/31884
          '&:before': {
            position: 'absolute',
            top: 0,
            insetInlineEnd: treeTitleHeight / 2,
            bottom: -treeNodePadding,
            marginInlineStart: -1,
            borderInlineEnd: `1px solid ${token.borderColor}`,
            content: '""',
          },

          '&:after': {
            position: 'absolute',
            width: (treeTitleHeight / 2) * 0.8,
            height: treeTitleHeight / 2,
            borderBottom: `1px solid ${token.borderColor}`,
            content: '""',
          },
        },
      },

      // >>> Checkbox
      [`${treeCls}-checkbox`]: {
        top: 'initial',
        marginInlineEnd: treeCheckBoxMarginHorizontal,
        marginBlockStart: treeCheckBoxMarginVertical,
      },

      // >>> Title
      [`& ${treeCls}-node-content-wrapper`]: {
        display: 'flex',
        flexWrap: 'nowrap',
        position: 'relative',
        zIndex: 'auto',
        minHeight: treeTitleHeight,
        margin: 0,
        padding: `0 ${token.paddingXS / 2}px`,
        color: 'inherit',
        lineHeight: `${treeTitleHeight}px`,
        background: 'transparent',
        borderRadius: token.borderRadius,
        cursor: 'pointer',
        transition: `all ${token.duration}, border 0s, line-height 0s, box-shadow 0s`,

        '&:hover': {
          backgroundColor: token.itemHoverBackground,
        },

        [`&${treeCls}-node-selected`]: {
          backgroundColor: token.tmpPrimaryHoverColorWeak,
        },

        // Icon
        [`${treeCls}-iconEle`]: {
          display: 'inline-block',
          width: treeTitleHeight,
          height: treeTitleHeight,
          lineHeight: `${treeTitleHeight}px`,
          textAlign: 'center',
          verticalAlign: 'top',

          '&:empty': {
            display: 'none',
          },
        },
      },

      // https://github.com/ant-design/ant-design/issues/28217
      [`${treeCls}-unselectable ${treeCls}-node-content-wrapper:hover`]: {
        backgroundColor: 'transparent',
      },

      // ==================== Draggable =====================
      [`${treeCls}-node-content-wrapper`]: {
        lineHeight: `${treeTitleHeight}px`,
        userSelect: 'none',

        ...getDropIndicatorStyle(prefixCls, token),
      },

      [`${treeNodeCls}.drop-container`]: {
        '> [draggable]': {
          boxShadow: `0 0 0 2px ${token.primaryColor}`,
        },
      },

      // ==================== Show Line =====================
      '&-show-line': {
        // ================ Indent lines ================
        [`${treeCls}-indent`]: {
          '&-unit': {
            position: 'relative',
            height: '100%',

            '&:before': {
              position: 'absolute',
              top: 0,
              insetInlineEnd: treeTitleHeight / 2,
              bottom: -treeNodePadding,
              borderInlineEnd: `1px solid ${token.borderColor}`,
              content: '""',
            },

            '&-end': {
              '&:before': {
                display: 'none',
              },
            },
          },
        },

        // ============== Cover Background ==============
        [`${treeCls}-switcher`]: {
          background: token.componentBackground,

          '&-line-icon': {
            // https://github.com/ant-design/ant-design/issues/32813
            verticalAlign: '-0.15em',
          },
        },
      },

      [`${treeNodeCls}-leaf-last`]: {
        [`${treeCls}-switcher`]: {
          '&-leaf-line': {
            '&:before': {
              top: 'auto !important',
              bottom: 'auto !important',
              height: `${treeTitleHeight / 2}px !important`,
            },
          },
        },
      },
    },
  };
};

// ============================ Directory =============================
export const genDirectoryStyle = (token: TreeToken): CSSObject => {
  const { treeCls, treeNodeCls, treeNodePadding } = token;

  return {
    [`${treeCls}${treeCls}-directory`]: {
      // ================== TreeNode ==================
      [treeNodeCls]: {
        position: 'relative',

        // Hover color
        '&:before': {
          position: 'absolute',
          top: 0,
          insetInlineEnd: 0,
          bottom: treeNodePadding,
          insetInlineStart: 0,
          transition: `background-color ${token.duration}`,
          content: '""',
          pointerEvents: 'none',
        },

        '&:hover': {
          '&:before': {
            background: token.itemHoverBackground,
          },
        },

        // Elements
        '> *': {
          zIndex: 1,
        },

        // >>> Switcher
        [`${treeCls}-switcher`]: {
          transition: `color ${token.duration}`,
        },

        // >>> Title
        [`${treeCls}-node-content-wrapper`]: {
          borderRadius: 0,
          userSelect: 'none',

          '&:hover': {
            background: 'transparent',
          },

          [`&.${treeCls}-node-selected`]: {
            color: token.textColorInverse,
            background: 'transparent',
          },
        },

        // ============= Selected =============
        '&-selected': {
          [`
            &:hover::before,
            &::before
          `]: {
            background: token.primaryColor,
          },

          // >>> Switcher
          [`${treeCls}-switcher`]: {
            color: token.textColorInverse,
          },

          // >>> Title
          [`${treeCls}-node-content-wrapper`]: {
            color: token.textColorInverse,
            background: 'transparent',
          },
        },
      },
    },
  };
};

// ============================== Merged ==============================
export const genTreeStyle = (
  prefixCls: string,
  token: DerivativeToken,
  hashId: string,
): CSSInterpolation => {
  const treeCls = `.${prefixCls}`;
  const treeNodeCls = `${treeCls}-treenode`;

  const treeNodePadding = token.paddingXS / 2;
  const treeTitleHeight = token.controlHeightSM;

  const treeToken = {
    ...token,
    treeCls,
    treeNodeCls,
    treeNodePadding,
    treeTitleHeight,
  };

  return [
    // Basic
    genBaseStyle(prefixCls, treeToken, hashId),
    // Directory
    genDirectoryStyle(treeToken),
  ];
};

// ============================== Export ==============================
export default function useStyle(prefixCls: string): UseComponentStyleResult {
  const [theme, token, hashId] = useToken();

  return [
    useStyleRegister({ theme, token, hashId, path: [prefixCls] }, () => [
      getCheckboxStyle(`${prefixCls}-checkbox`, token, hashId),
      genTreeStyle(prefixCls, token, hashId),
      treeNodeFX,
    ]),
    hashId,
  ];
}