import _extends from "@babel/runtime/helpers/esm/extends";
import genControlHeight from '../shared/genControlHeight';
import defaultAlgorithm from '../default';
import genCompactSizeMapToken from './genCompactSizeMapToken';
import genFontMapToken from '../shared/genFontMapToken';
const derivative = (token, mapToken) => {
  const mergedMapToken = mapToken !== null && mapToken !== void 0 ? mapToken : defaultAlgorithm(token);
  const fontSize = mergedMapToken.fontSizeSM; // Smaller size font-size as base
  const controlHeight = mergedMapToken.controlHeight - 4;
  return _extends(_extends(_extends(_extends(_extends({}, mergedMapToken), genCompactSizeMapToken(mapToken !== null && mapToken !== void 0 ? mapToken : token)), genFontMapToken(fontSize)), {
    // controlHeight
    controlHeight
  }), genControlHeight(_extends(_extends({}, mergedMapToken), {
    controlHeight
  })));
};
export default derivative;