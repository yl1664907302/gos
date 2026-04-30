import useCacheToken from './hooks/useCacheToken';
import useStyleRegister, { extractStyle } from './hooks/useStyleRegister';
import Keyframes from './Keyframes';
import { legacyNotSelectorLinter, logicalPropertiesLinter, parentSelectorLinter } from './linters';
import { createCache, useStyleInject, useStyleProvider, StyleProvider } from './StyleContext';
import { createTheme, Theme } from './theme';
import legacyLogicalPropertiesTransformer from './transformers/legacyLogicalProperties';
import px2remTransformer from './transformers/px2rem';
import { supportLogicProps, supportWhere } from './util';
const cssinjs = {
  Theme,
  createTheme,
  useStyleRegister,
  useCacheToken,
  createCache,
  useStyleInject,
  useStyleProvider,
  Keyframes,
  extractStyle,
  // Transformer
  legacyLogicalPropertiesTransformer,
  px2remTransformer,
  // Linters
  logicalPropertiesLinter,
  legacyNotSelectorLinter,
  parentSelectorLinter,
  // cssinjs
  StyleProvider
};
export { Theme, createTheme, useStyleRegister, useCacheToken, createCache, useStyleInject, useStyleProvider, Keyframes, extractStyle,
// Transformer
legacyLogicalPropertiesTransformer, px2remTransformer,
// Linters
logicalPropertiesLinter, legacyNotSelectorLinter, parentSelectorLinter,
// cssinjs
StyleProvider };
export const _experimental = {
  supportModernCSS: () => supportWhere() && supportLogicProps()
};
export default cssinjs;