import React, { Component } from 'react';

class Vis extends Component {
    state = {}
    ctx;
    width = 300;
    height = 200;
    values = [];

    drawFFT(values) {
        this.values = values;
        this.redraw();
    }

    redraw() {
        this.ctx = this.refs.canvas.getContext("2d");
        
        // this.ctx.clearRect(0, 0,this.width,this.height);
        this.ctx.clearRect(0,0,this.width, this.height)
        this.ctx.rect(0, 0, this.width, this.height);
        // this.ctx.stroke();
        
        var max = -Infinity;
        var min = Infinity;

        if (this.values.length > 0) {
            
            const barWidth = this.width / (this.values.length+2);

            // this.values store decibels for each freq in range [-140,0]
            this.ctx.lineWidth = barWidth;
            this.ctx.lineCap = "round";
            for (let i = 0, len = this.values.length; i < len ; i++) {
                // debugger
                var x = (barWidth + 5)* i + barWidth / 2 ;
                
                var h = ((this.values[i] + 140) / 140) * this.height;


                max = Math.max(max, this.values[i])
                min = Math.min(min, this.values[i])
                // this.ctx.fillStyle = "rgba(255, 85, 85, "+ (1 - i/(len+10)) + ")";
                // this.ctx.fillRect(x, this.height, barWidth, -h);
                this.ctx.strokeStyle = "rgba(255, 85, 85, "+ (1 - i/(len+10)) + ")";
                this.ctx.beginPath();
                this.ctx.moveTo(x, this.height );
                this.ctx.lineTo(x, this.height - h);
                // this.ctx.lineTo(70, 100);
                
                this.ctx.stroke();
                
            }
        }

    }

    componentDidMount() {
        window.addEventListener("resize", () => this.updateDimensions());
        this.updateDimensions()
        this.redraw();
    }

    updateDimensions() {
        let { clientWidth } = this.refs.container;
        
        this.refs.canvas.width = clientWidth;
        // this.refs.canvas.height = clientHeight

        this.width = clientWidth;
        // this.height = clientHeight;
 
        this.redraw();
    }

    render() {
        return (
                <div ref="container">
                    <canvas ref='canvas' height="200"/>
                </div>
            
        );
    }
}

export default Vis;