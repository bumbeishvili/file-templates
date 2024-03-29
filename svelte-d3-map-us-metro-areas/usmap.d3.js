import * as d3 from 'd3';
export class Chart {
    constructor() {
        // Defining state attributes
        const attrs = {
            id: "ID" + Math.floor(Math.random() * 1000000),
            svgWidth: 400,
            svgHeight: 200,
            marginTop: 5,
            marginBottom: 5,
            marginRight: 5,
            marginLeft: 5,
            container: "body",
            defaultTextFill: "#2C3E50",
            svgBackground: '#EBEBEB',
            center: [-290, 90],
            scale: 200,
            defaultFont: "Helvetica",
            geoJson: null,
            metro: null,
            data: null,
            chartWidth: null,
            chartHeight: null,
            firstRender: true,
            guiEnabled: false,
        };

        // Defining accessors
        this.getState = () => attrs;
        this.setState = (d) => Object.assign(attrs, d);

        // Automatically generate getter and setters for chart object based on the state properties;
        Object.keys(attrs).forEach((key) => {
            //@ts-ignore
            this[key] = function (_) {
                if (!arguments.length) {
                    return attrs[key];
                }
                attrs[key] = _;
                return this;
            };
        });

        // Custom enter exit update pattern initialization (prototype method)
        this.initializeEnterExitUpdatePattern();
    }
    render() {
        this.addChartGui()
        this.setDynamicContainer();
        this.calculateProperties();
        this.drawSvgAndWrappers();
        this.drawMap();
        return this;
    }

    calculateProperties() {
        const {
            marginLeft,
            marginTop,
            marginRight,
            marginBottom,
            svgWidth,
            svgHeight
        } = this.getState();

        //Calculated properties
        var calc = {
            id: null,
            chartTopMargin: null,
            chartLeftMargin: null,
            chartWidth: null,
            chartHeight: null
        };
        calc.id = "ID" + Math.floor(Math.random() * 1000000); // id for event handlings
        calc.chartLeftMargin = marginLeft;
        calc.chartTopMargin = marginTop;
        const chartWidth = svgWidth - marginRight - calc.chartLeftMargin;
        const chartHeight = svgHeight - marginBottom - calc.chartTopMargin;

        this.setState({ calc, chartWidth, chartHeight });
    }

    drawMap() {
        const { chart, metro, geoJson, calc, scale, center, data, chartWidth, chartHeight } = this.getState();

        const projection = d3.geoAlbersUsa()
            .fitSize([chartWidth, chartHeight], metro)

        const path = d3.geoPath()
            .projection(projection);

        console.log({ geoJson })

        chart
            ._add({
                tag: "path",
                selector: "map-path",
                data: metro.features
            })
            .attr('d', path)
            .attr('stroke', '#D7D7D8')
            .attr('stroke-width', 0.5)
            .attr('fill', d => {
                return 'white';
            }) //random color
    }

    drawSvgAndWrappers() {
        const {
            d3Container,
            svgWidth,
            svgHeight,
            defaultFont,
            calc,
            svgBackground,
            data,
            chartWidth,
            chartHeight
        } = this.getState();

        // Draw SVG
        const svg = d3Container
            ._add({
                tag: "svg",
                className: "svg-chart-container"
            })
            .attr("width", svgWidth)
            .attr("height", svgHeight)
            .style('background-color', svgBackground)
            .attr("font-family", defaultFont);

        //Add container g element
        var chart = svg
            ._add({
                tag: "g",
                className: "chart"
            })
            .attr(
                "transform",
                "translate(" + calc.chartLeftMargin + "," + calc.chartTopMargin + ")"
            );

        this.setState({ chart, svg });
    }

    initializeEnterExitUpdatePattern() {
        d3.selection.prototype._add = function (params) {
            var container = this;
            var className = params.className;
            var elementTag = params.tag;
            var data = params.data || [className];
            var exitTransition = params.exitTransition || null;
            var enterTransition = params.enterTransition || null;
            // Pattern in action
            var selection = container.selectAll("." + className).data(data, (d, i) => {
                if (typeof d === "object") {
                    if (d.id) {
                        return d.id;
                    }
                }
                return i;
            });
            if (exitTransition) {
                exitTransition(selection);
            } else {
                selection.exit().remove();
            }

            const enterSelection = selection.enter().append(elementTag);
            if (enterTransition) {
                enterTransition(enterSelection);
            }
            selection = enterSelection.merge(selection);
            selection.attr("class", className);
            return selection;
        };
    }

    setDynamicContainer() {
        const attrs = this.getState();

        //Drawing containers
        var d3Container = d3.select(attrs.container);
        var containerRect = d3Container.node().getBoundingClientRect();
        if (containerRect.width > 0) attrs.svgWidth = containerRect.width;

        d3.select(window).on("resize." + attrs.id, () => {
            var containerRect = d3Container.node().getBoundingClientRect();
            if (containerRect.width > 0) attrs.svgWidth = containerRect.width;
            this.render();
        });

        this.setState({ d3Container });
    }

    addChartGui() {
        const { guiEnabled, firstRender } = this.getState()
        console.log({ guiEnabled, firstRender })
        if (!guiEnabled || !firstRender) return;
        if (typeof lil == 'undefined') return;
        const gui = new lil.GUI()
        gui.close()
        const state = JSON.parse(JSON.stringify(this.getState()))
        const propChanged = () => {
            supportedKeys.forEach(k => {
                this.setState({ [k]: state[k] })
            })
            this.render();
        }
        const supportedKeys = Object.keys(state)
            .filter(k =>
                typeof state[k] == 'number' ||
                typeof state[k] == 'string' ||
                typeof state[k] == 'boolean'

            )
            .filter(d => !['guiEnabled', 'firstRender'].includes(d))
        console.log({ supportedKeys, state })
        supportedKeys.forEach(key => {
            gui.add(state, key).onChange(d => {
                propChanged()
            })
        })

    }
}