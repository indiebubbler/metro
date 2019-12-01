import React, { Component } from 'react';
import {accentColor, accentTypesArr } from './AccentTypes';
import {InitPreset} from './PresetsLib'

class CssClock extends Component {
    state = {
        timeMeasure: 4
    }
    values = [];
    progress = 0;

    latencyFallback = 0.05

    redraw() {


        this.radius = (this.width / 2) - 10;

        return;
        // console.log('this.radius',this.radius)
        // this.drawFace(this.ctx, this.radius)
        // this.drawBeats(this.ctx, this.radius * .8)

        // // HACK bit naughty way to make hand fall in mid of the beat circle
        // this.drawHand(this.ctx, this.progress === 0 ? this.progress : (this.progress - this.latencyFallback) * 2 * Math.PI, this.radius * .8, 4);

        // this.container.innerHTML = this.progress
    }

    getInnerRadius(accent, maxRadius) {
        const idx = accentTypesArr.indexOf(accent);
        if (idx < 0) {
            throw new Error("Accent invalid" + accent)
        }
        return 50 + 20 * idx;//(this.radius / this.accents.length)
    }

    drawBeats(ctx, radius) {
        if (!this.accents) {
            return
        }
        const angleStep = 2 * Math.PI / this.accents.length;

        for (let i = 0; i < this.accents.length; i++) {
            ctx.beginPath();
            //ctx.moveTo(0,20)
            ctx.arc(0, -this.getInnerRadius(this.accents[i], radius), 3, 0, 2 * Math.PI);

            ctx.fillStyle = 'red';
            ctx.fill();
            ctx.rotate(angleStep);

        }
        // console.log('angleStep after', angleStep)
        ctx.rotate(-2 * Math.PI);
        // ctx.rotate()

        // ctx.arc(0, 0, 2, 0, 2*Math.PI);
        // ctx.fillStyle = 'red';
        // ctx.fill();

    }

    drawHand(ctx, pos, length, width) {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.lineCap = "round";
        ctx.moveTo(0, 0);
        ctx.rotate(pos);
        ctx.lineTo(0, -length);
        ctx.stroke();
        ctx.rotate(-pos);
    }

    drawFace(ctx, radius) {
        var grad;
        this.ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.fill();
        // grad = ctx.createRadialGradient(0, 0, radius * 0.95, 0, 0, radius * 1.05);
        // grad.addColorStop(0, '#333');
        // grad.addColorStop(0.5, 'white');
        // grad.addColorStop(1, '#333');
        // ctx.strokeStyle = grad;
        // ctx.lineWidth = radius * 0.1;
        // ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.1, 0, 2 * Math.PI);
        ctx.fillStyle = '#333';
        ctx.fill();
    }

    // function drawNumbers(ctx, radius) {
    //     var ang;
    //     var num;
    //     ctx.font = radius*0.15 + "px arial";
    //     ctx.textBaseline="middle";
    //     ctx.textAlign="center";
    //     for(num = 1; num < 13; num++){
    //       ang = num * Math.PI / 6;
    //       ctx.rotate(ang);
    //       ctx.translate(0, -radius*0.85);
    //       ctx.rotate(-ang);
    //       ctx.fillText(num.toString(), 0, 0);
    //       ctx.rotate(ang);
    //       ctx.translate(0, radius*0.85);
    //       ctx.rotate(-ang);
    //     }
    //   }



    componentDidMount() {
        // console.log('vis mount')
        // this.ctx.translate( 50, 20 )
        // this.ctx = this.refs.canvas.getContext("2d");
        // //this.container.offsetWidth
        // console.log('container offsetWidth', this.container.offsetWidth);
        window.addEventListener("resize", () => this.updateDimensions());
        // this.updateDimensions();
        // this.redraw();
        // this.drawSvg()
    }

    updateDimensions() {
        let { clientWidth, clientHeight, offsetWidth, offsetHeight } = this.container;
        // const min = Math.min(clientHeight, clientWidth)
        // console.log('cW', offsetWidth, offsetHeight)

        this.width = offsetWidth / 2;
        this.radius = offsetWidth / 2;

        //this.drawSvg()

        // this.height = offsetHeight;

        // const min = Math.max(clientWidth, clientHeight)
        // this.refs.canvas.width = this.width
        // this.refs.canvas.height = this.width;


        // this.height = clientHeight;
        // this.height = clientHeight;
        // this.ctx.translate(this.width / 2, this.width / 2)

        // this.redraw();
    }

    setProgress(progress) {

        //'translate('+this.width/2+'px,'+this.width/2+'px)
        // this.hand.style.transform = 'rotate(' + progress * 360 + 'deg)'
        this.line.style.transform = 'rotate(' + progress * 360 + 'deg)'
        // this.accents = accents;
        // this.redraw();
    }

    setAccents(accents) {
        this.setState({ accents: accents })
        this.drawSvg()
    }


    drawSvg() {

        // idea of drawing pies by David Gilbertson, taken from https://medium.com/hackernoon/a-simple-pie-chart-in-svg-dbdd653b6936
        
        let pctStep = 1 / this.props.accents.length;
// console.log('props accents', this.props.accents.length)
        let slices= [];
        let step = pctStep;
        this.props.accents.forEach(accent => {

            slices.push({percent: pctStep , color: accentColor[accent] });
            // step += pctStep;
        })
        console.log(slices)
        // const slices = [
        //     { percent: 0.1, color: 'Coral' },
        //     { percent: 0.65, color: 'CornflowerBlue' },
        //     { percent: 0.2, color: '#00ab6b' },
        // ];
        let cumulativePercent = 0;

        function getCoordinatesForPercent(percent) {
            const x = Math.cos(2 * Math.PI * percent);
            const y = Math.sin(2 * Math.PI * percent);
            return [x, y];
        }

        let paths = [];

        slices.forEach(slice => {
            // destructuring assignment sets the two variables at once
            const [startX, startY] = getCoordinatesForPercent(cumulativePercent);

            // each slice starts where the last slice ended, so keep a cumulative percent
            cumulativePercent += slice.percent;

            const [endX, endY] = getCoordinatesForPercent(cumulativePercent);

            // if the slice is more than 50%, take the large arc (the long way around)
            const largeArcFlag = slice.percent > .5 ? 1 : 0;

            // create an array and join it just for code readability
            const pathData = [
                `M ${startX} ${startY}`, // Move
                `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc
                `L 0 0`, // Line
            ].join(' ');

            // create a <path> and append it to the <svg> element
            
            paths.push(
                <path stroke="#f55" stroke-width="1%" d={pathData} fill={slice.color} />
            )
        });

        return paths

    }



    render() {

        console.log('vis render')
 
        return (
            <div ref={el => (this.container = el)} className="visClockContainer">
                
                <svg  viewBox="-1 -1 2 2" style={{transform: 'rotate(-90deg)'}} ref={el => (this.svg = el)}>
                    
                    {this.drawSvg()}
                    <line ref={el=> (this.line = el)}  stroke-linecap="round"  x1 = "0" y1 = "0" x2 = ".8" y2 = "0" stroke = "rgba(0,0,0,0.5)" stroke-width = "0.1"/>
                    {/* <line ref={el=> (this.line = el)} x1="0" y1="0" x2="-10" y2="0" style={{stroke:'rgb(255,0,0)',strokeWidth:'1px'}} /> */}
                </svg>
                {/* <div className="hand-container">
                    <div ref={el => (this.hand = el)} className="hand"></div>
                </div> */}

{/*                 
                <article className="clock">
                    <div class="measure-container">
                        {accentLines.map((item) => item)}
                    </div>
                    <div className="hand-container">
                        <div ref={el => (this.hand = el)} className="hand"></div>
                    </div>

                </article> */}
                {/* <div style={circleStyle}>

                </div>
                <div ref={el => (this.hand = el)} style={handStyle} />
                    {accentLines.map((item) => item)} */}
            </div>

        );
    }
}

export default CssClock;

CssClock.defaultPros = {
    accents: InitPreset.accents
}