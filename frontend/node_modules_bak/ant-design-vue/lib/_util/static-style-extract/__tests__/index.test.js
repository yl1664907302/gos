"use strict";

var _vue = require("vue");
var _index = require("../index");
var _components = require("../../../components");
var _index2 = require("../../../index");
// import { StyleProvider } from '../../cssinjs';

const testGreenColor = '#008000';
describe('Static-Style-Extract', () => {
  it('should extract static styles', () => {
    const cssText = (0, _index.extractStyle)();
    expect(cssText).not.toContain(testGreenColor);
    expect(cssText).toMatchSnapshot();
  });
  it('should extract static styles with customTheme', () => {
    const cssText = (0, _index.extractStyle)(node => {
      return (0, _vue.createVNode)(_components.ConfigProvider, {
        "theme": {
          token: {
            colorPrimary: testGreenColor
          }
        }
      }, {
        default: () => [node]
      });
    });
    expect(cssText).toContain(testGreenColor);
    expect(cssText).toMatchSnapshot();
  });
  it('should extract static styles with customTheme and customStyle', () => {
    const cssText = (0, _index.extractStyle)(node => {
      return (0, _vue.createVNode)(_components.ConfigProvider, {
        "theme": {
          algorithm: _index2.theme.darkAlgorithm,
          token: {
            colorPrimary: testGreenColor
          }
        }
      }, {
        default: () => [node]
      });
    });
    expect(cssText).toContain('#037003');
    expect(cssText).toMatchSnapshot();
  });
  // it('with custom hashPriority', () => {
  //   const cssText = extractStyle(
  //     (node) => (
  //       <StyleProvider hashPriority='high'>
  //         <ConfigProvider
  //           theme={{
  //             token: {
  //               colorPrimary: testGreenColor,
  //             },
  //           }}
  //         >
  //           {node}
  //         </ConfigProvider>
  //       </StyleProvider>
  //     ),
  //   );
  //   expect(cssText).toContain(testGreenColor);
  //   expect(cssText).not.toContain(':where');
  //   expect(cssText).toMatchSnapshot();
  //
  //   const cssText2 = extractStyle((node) => (
  //     <ConfigProvider
  //       theme={{
  //         token: {
  //           colorPrimary: testGreenColor,
  //         },
  //       }}
  //     >
  //       {node}
  //     </ConfigProvider>
  //   ));
  //   expect(cssText2).toContain(':where');
  // });
});