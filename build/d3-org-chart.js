(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.d3 = global.d3 || {})));
}(this, function (exports) { 'use strict';

    function initializeEnterExitUpdatePattern (selection) {
        selection.prototype.patternify = function (params) {
            var container = this;
            var selector = params.selector;
            var elementTag = params.tag;
            var data = params.data || [selector];

            // Pattern in action
            var selection = container.selectAll('.' + selector).data(data, (d, i) => {
                if (typeof d === 'object') {
                    if (d.id) {
                        return d.id;
                    }
                }
                return i;
            });
            selection.exit().remove();
            selection = selection.enter().append(elementTag).merge(selection);
            selection.attr('class', selector);
            return selection;
        };
    }

    function _init () {
        this.state = {
            id: `ID${Math.floor(Math.random() * 1000000)}`, // Id for event handlings
            svgWidth: 800,
            svgHeight: 600,
            marginTop: 0,
            marginBottom: 0,
            marginRight: 0,
            marginLeft: 0,
            container: 'body',
            defaultTextFill: '#2C3E50',
            nodeTextFill: 'white',
            defaultFont: 'Helvetica',
            backgroundColor: '#fafafa',
            data: null,
            depth: 180,
            duration: 600,
            strokeWidth: 3,
            dropShadowId: null,
            initialZoom: 1,
            onNodeClick: d => d,
        };
        const that = this;

        Object.keys(this.state).forEach((key) => {
            //@ts-ignore
            that[key] = function (_) {
                if (!arguments.length) {
                    return [key];
                } else {
                    that.state[key] = _
                }
                return that;
            };
        })

        initializeEnterExitUpdatePattern(d3.selection)

        return this;
    }

    exports.orgChart = _init;

    Object.defineProperty(exports, '__esModule', { value: true });

}));