// deps-lint-skip-all
import { Keyframes } from '@ant-design/cssinjs';
import {
  DerivativeToken,
  useStyleRegister,
  useToken,
  resetComponent,
  UseComponentStyleResult,
  GenerateStyle,
} from '../../_util/theme';

interface CheckboxToken extends DerivativeToken {
  checkboxCls: string;
}

// ============================== Motion ==============================
const antCheckboxEffect = new Keyframes('antCheckboxEffect', {
  '0%': {
    transform: 'scale(1)',
    opacity: 0.5,
  },

  '100%': {
    transform: 'scale(1.6)',
    opacity: 0,
  },
});

// ============================== Styles ==============================
export const genCheckboxStyle: GenerateStyle<CheckboxToken> = (token, hashId) => {
  const { checkboxCls } = token;
  const wrapperCls = `${checkboxCls}-wrapper`;

  return [
    // ===================== Basic =====================
    {
      // Group
      [`${checkboxCls}-group`]: {
        ...resetComponent(token),

        display: 'inline-flex',
      },

      // Wrapper
      [wrapperCls]: {
        ...resetComponent(token),

        display: 'inline-flex',
        alignItems: 'baseline',
        lineHeight: 'unset',
        cursor: 'pointer',

        // Fix checkbox & radio in flex align #30260
        '&:after': {
          display: 'inline-block',
          width: 0,
          overflow: 'hidden',
          content: "'\\a0'",
        },

        // Checkbox near checkbox
        '& + &': {
          marginInlineStart: token.marginXS,
        },
      },

      // Wrapper > Checkbox
      [checkboxCls]: {
        ...resetComponent(token),

        top: '0.2em',
        position: 'relative',
        whiteSpace: 'nowrap',
        lineHeight: 1,
        cursor: 'pointer',

        // Wrapper > Checkbox > input
        [`${checkboxCls}-input`]: {
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          width: '100%',
          height: '100%',
          cursor: 'pointer',
          opacity: 0,
        },

        // Wrapper > Checkbox > inner
        [`${checkboxCls}-inner`]: {
          position: 'relative',
          top: 0,
          insetInlineStart: 0,
          display: 'block',
          width: token.fontSizeLG,
          height: token.fontSizeLG,
          direction: 'ltr',
          backgroundColor: token.componentBackground,
          border: `${token.borderWidth}px ${token.borderStyle} ${token.borderColor}`,
          borderRadius: token.borderRadius,
          borderCollapse: 'separate',
          transition: `all ${token.duration}`,

          '&:after': {
            position: 'absolute',
            top: '50%',
            insetInlineStart: '21.5%',
            display: 'table',
            width: (token.fontSizeLG / 14) * 5,
            height: (token.fontSizeLG / 14) * 8,
            border: `2px solid ${token.componentBackground}`,
            borderTop: 0,
            borderInlineStart: 0,
            transform: 'rotate(45deg) scale(0) translate(-50%,-50%)',
            opacity: 0,
            transition: `all ${token.durationFast} cubic-bezier(.71,-.46,.88,.6), opacity ${token.durationFast}`,
            content: '""',
          },
        },

        // Wrapper > Checkbox + Text
        '& + span': {
          paddingInlineStart: token.paddingXS,
          paddingInlineEnd: token.paddingXS,
        },
      },
    },

    // ================= Indeterminate =================
    {
      [checkboxCls]: {
        '&-indeterminate': {
          // Wrapper > Checkbox > inner
          [`${checkboxCls}-inner`]: {
            '&:after': {
              top: '50%',
              insetInlineStart: '50%',
              width: token.fontSizeLG / 2,
              height: token.fontSizeLG / 2,
              backgroundColor: token.primaryColor,
              border: 0,
              transform: 'translate(-50%, -50%) scale(1)',
              opacity: 1,
              content: '""',
            },
          },
        },
      },
    },

    // ===================== Hover =====================
    {
      // Wrapper
      [`${wrapperCls}:hover ${checkboxCls}:after`]: {
        visibility: 'visible',
      },

      // Wrapper & Wrapper > Checkbox
      [`
      ${wrapperCls}:hover:not(${wrapperCls}-disabled),
      ${checkboxCls}:hover:not(${checkboxCls}-disabled),
      ${checkboxCls}-input:focus +
    `]: {
        [`${checkboxCls}-inner`]: {
          borderColor: token.primaryColor,
        },
      },
    },

    // ==================== Checked ====================
    {
      // Wrapper > Checkbox
      [`${checkboxCls}-checked`]: {
        [`${checkboxCls}-inner`]: {
          backgroundColor: token.primaryColor,
          borderColor: token.primaryColor,

          '&:after': {
            opacity: 1,
            transform: 'rotate(45deg) scale(1) translate(-50%,-50%)',
            transition: `all ${token.duration} ${token.easeOutBack} 0.1s`,
          },
        },

        // Checked Effect
        '&:after': {
          position: 'absolute',
          top: 0,
          insetInlineStart: 0,
          width: '100%',
          height: '100%',
          border: `${token.borderWidth}px ${token.borderStyle} ${token.primaryColor}`,
          borderRadius: token.borderRadius,
          visibility: 'hidden',
          animation: `${antCheckboxEffect.getName(hashId)} ${token.duration} ease-in-out`,
          animationFillMode: 'backwards',
          content: '""',
        },
      },
    },

    // ==================== Disable ====================
    {
      // Wrapper
      [`${wrapperCls}-disabled`]: {
        cursor: 'not-allowed',
      },

      // Wrapper > Checkbox
      [`${checkboxCls}-disabled`]: {
        // Wrapper > Checkbox > input
        [`&, ${checkboxCls}-input`]: {
          cursor: 'not-allowed',
        },

        // Wrapper > Checkbox > inner
        [`${checkboxCls}-inner`]: {
          background: token.background,
          borderColor: token.borderColor,

          '&:after': {
            borderColor: token.borderColor,
          },
        },

        '&:after': {
          display: 'none',
        },

        '& + span': {
          color: token.textColorDisabled,
        },
      },
    },
  ];
};

// ============================== Export ==============================
export function getStyle(prefixCls: string, token: DerivativeToken, hashId: string) {
  const checkboxToken: CheckboxToken = {
    ...token,
    checkboxCls: `.${prefixCls}`,
  };

  return [genCheckboxStyle(checkboxToken, hashId), antCheckboxEffect];
}

export default function useStyle(prefixCls: string): UseComponentStyleResult {
  const [theme, token, hashId] = useToken();

  return [
    useStyleRegister({ theme, token, hashId, path: [prefixCls] }, () =>
      getStyle(prefixCls, token, hashId),
    ),
    hashId,
  ];
}