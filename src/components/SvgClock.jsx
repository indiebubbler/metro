import React, { Component } from 'react';
// import { accentColor } from './AccentTypes';
import { InitPreset } from './PresetsLib'
import Config from './Config';

class SvgClock extends Component {
    state = {
        track: this.props.track,
        timeSignature: this.props.timeSignature
    }
    colorEmpty = "#333";
    strokeColor = "#444";
    strokeWidth = "0.001em"

    setAccents(track) {
        this.setState({ track: track })
        // this.drawSvg()
    }

    getCoordinatesForPercent(percent, r = 1) {
        const x = r * Math.cos(2 * Math.PI * percent);
        const y = r * Math.sin(2 * Math.PI * percent);
        return [x, y];
    }

    drawSlices(radius, trackIdx) {
        // Drawing pie charts by David Gilbertson, taken from https://medium.com/hackernoon/a-simple-pie-chart-in-svg-dbdd653b6936
        // if (this.props.track[trackIdx] === undefined) {
        //     // debugger
        // }
        let pctStep = 1 / this.props.track[trackIdx].length;
        let slices = [];
        // let step = pctStep;
        this.props.track[trackIdx].forEach((volume, subIdx) => {
            slices.push({ percent: pctStep, color: volume > 0 ? Config.COLOR_PALETTE[trackIdx] : this.colorEmpty });

            // if (trackColumn > 0)

            // step += pctStep;
        })
        let cumulativePercent = 0;

        let paths = [];
        slices.forEach((slice, idx) => {
            // destructuring assignment sets the two variables at once
            const [startX, startY] = this.getCoordinatesForPercent(cumulativePercent, radius);

            // each slice starts where the last slice ended, so keep a cumulative percent
            cumulativePercent += slice.percent;

            const [endX, endY] = this.getCoordinatesForPercent(cumulativePercent, radius);

            // if the slice is more than 50%, take the large arc (the long way around)
            const largeArcFlag = slice.percent > .5 ? 1 : 0;

            // create an array and join it just for code readability
            const pathData = [
                `M ${startX} ${startY}`, // Move
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc
                `L 0 0`, // Line
            ].join(' ');

            // create a <path> and append it to the <svg> element
            paths.push(
                <path key={"pie_" + idx} d={pathData} fill={slice.color} stroke={this.strokeColor} strokeWidth={this.strokeWidth} />
            )
        });
        return paths
    }

    // OLD_drawSlices(radius, filter) {
    //     // Drawing pie charts by David Gilbertson, taken from https://medium.com/hackernoon/a-simple-pie-chart-in-svg-dbdd653b6936
    //     let pctStep = 1 / this.props.track.length;
    //     let slices = [];
    //     // let step = pctStep;
    //     this.props.track.forEach(trackColumn => {
    //         const idx = trackColumn.indexOf(filter);
    //         slices.push({ percent: pctStep, color: idx >= 0 ? accentColor[filter] : this.colorEmpty });
    //         // step += pctStep;
    //     })
    //     let cumulativePercent = 0;

    //     let paths = [];
    //     slices.forEach((slice, idx) => {
    //         // destructuring assignment sets the two variables at once
    //         const [startX, startY] = this.getCoordinatesForPercent(cumulativePercent, radius);

    //         // each slice starts where the last slice ended, so keep a cumulative percent
    //         cumulativePercent += slice.percent;

    //         const [endX, endY] = this.getCoordinatesForPercent(cumulativePercent, radius);

    //         // if the slice is more than 50%, take the large arc (the long way around)
    //         const largeArcFlag = slice.percent > .5 ? 1 : 0;

    //         // create an array and join it just for code readability
    //         const pathData = [
    //             `M ${startX} ${startY}`, // Move
    //             `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc
    //             `L 0 0`, // Line
    //         ].join(' ');

    //         // create a <path> and append it to the <svg> element
    //         paths.push(
    //             <path key={"pie_" + idx} d={pathData} fill={slice.color} stroke={this.strokeColor} strokeWidth={this.strokeWidth}  />
    //         )
    //     });
    //     return paths
    // }

    drawText() {
        let labels = [];
        const pctStep = 1 / this.props.timeSignature;
        let cumulativePercent = 0;

        for (let i = 0; i < this.props.timeSignature; i++) {

            let [x, y] = this.getCoordinatesForPercent(cumulativePercent, 0.9);
            // tweak position of labels
            x -= 0.06
            labels.push(
                <text x={x} y={y} key={"label_" + i} textAnchor="middle" transform={"rotate(90, " + x + ", " + y + ")"} className="svgText">{i + 1}</text>
            )
            cumulativePercent += pctStep
        }

        return <g>{labels}</g>;
    }

    setProgress(progress) {
        this.line.style.transform = 'rotate(' + progress * 360 + 'deg)'
    }
    render() {
        let radiusIncrement = 0.5 / Config.TRACKS_NUMBER;

        let circles = [];

        for (let i = 0; i < this.props.track.length; i++) {
            // main circles
            circles.push(this.drawSlices(0.8 - radiusIncrement * i, i));
        }
        // inner gray circle
        circles.push(
            <circle key="innerCircle" cx="0" cy="0" r={0.8 - radiusIncrement * Config.TRACKS_NUMBER} fill={this.colorEmpty} stroke={this.strokeColor} strokeWidth={this.strokeWidth} />
        )

        return (
            <div ref={el => (this.container = el)} className="visClockContainer">
                <svg viewBox="-1 -1 2 2" ref={el => (this.svg = el)}>
                    <g style={{ transform: 'rotate(-90deg)' }}>
                        {
                            circles
                        }
                        {this.drawText()}
                        <line ref={el => (this.line = el)} strokeLinecap="round" x1="0" y1="0" x2=".7" y2="0" stroke="rgba(255,255,255,0.5)" strokeWidth="0.1" style={{ transform: 'rotate(' + this.props.partProgress * 360 + 'deg)' }} />
                    </g>
                </svg>
            </div>
        );
    }
}

export default SvgClock;

SvgClock.defaultProps = {
    track: InitPreset.track,
    timeSignature: InitPreset.timeSignature
}