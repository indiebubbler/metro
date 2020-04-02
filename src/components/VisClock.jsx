import React, { Component } from 'react';
import { accentTypes, accentTypesArr } from './AccentTypes';

class Vis extends Component {
    state = {}
    values = [];
    progress = 0;

    latencyFallback = 0.05

    redraw() {
        this.radius = (this.width /2)  - 10;
        this.drawFace(this.ctx, this.radius)
        this.drawBeats(this.ctx, this.radius * .8)

        // HACK bit naughty way to make hand fall in mid of the beat circle
        this.drawHand(this.ctx, this.progress === 0 ? this.progress : (this.progress - this.latencyFallback) * 2 * Math.PI, this.radius * .8, 4);

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
        ctx.rotate(-2 * Math.PI);
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
        this.ctx = this.refs.canvas.getContext("2d");
        window.addEventListener("resize", () => this.updateDimensions());
        this.updateDimensions()
        this.redraw();
    }

    updateDimensions() {
        let { clientWidth, clientHeight, offsetWidth, offsetHeight } = this.container;

        this.width = offsetWidth / 2;
        this.refs.canvas.width = this.width
        this.refs.canvas.height = this.width;


        this.ctx.translate(this.width / 2, this.width / 2)

        this.redraw();
    }

    setProgress(progress, accents) {
        this.progress = progress;
        this.accents = accents;
        this.redraw();
    }

    render() {
        return (
            <div ref={el => (this.container = el)} className="visClockContainer">
                <canvas ref='canvas' />
            </div>

        );
    }
}

export default Vis;