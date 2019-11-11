import React, { Component } from 'react';

class Vis extends Component {
    state = {}
    ctx;
    width = 300;
    height = 200;
    values = [];
    radius = 10;
    progress = 0;
 
    redraw() {

        // console.log('redraw called')
        // this.ctx.clearRect(0, 0,this.width,this.height);
        // console.log('<Vis>redraw', this.width, this.height)
        // this.ctx.clearRect(0,0,this.width, this.height)
        
        // this.ctx.rect(0, 0, this.width, this.height);
        // this.ctx.stroke();
        this.radius = Math.min(this.width, this.height) / 2;
        
        this.drawFace(this.ctx, this.radius)
        this.drawHand(this.ctx, this.progress  * 2 * Math.PI, this.radius * .8, 2);



    }

    drawHand(ctx, pos, length, width) {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.lineCap = "round";
        ctx.moveTo(0,0);
        ctx.rotate(pos);
        ctx.lineTo(0, -length);
        ctx.stroke();
        ctx.rotate(-pos);
    }

    drawFace(ctx, radius) {
        var grad;
        this.ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2*Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
        grad = ctx.createRadialGradient(0,0,radius*0.95, 0,0,radius*1.05);
        grad.addColorStop(0, '#333');
        grad.addColorStop(0.5, 'white');
        grad.addColorStop(1, '#333');
        ctx.strokeStyle = grad;
        ctx.lineWidth = radius*0.1;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, radius*0.1, 0, 2*Math.PI);
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
        this.ctx = this.refs.canvas.getContext("2d");
        // this.ctx.translate( 50, 20 )
        
        window.addEventListener("resize", () => this.updateDimensions());
        this.updateDimensions()
        
    }

    updateDimensions() {
        let { clientWidth, clientHeight } = this.refs.container;
        
        this.refs.canvas.width = clientWidth;
        // this.refs.canvas.height = clientHeight

        this.width = clientWidth;
        this.height = clientHeight;
        // this.height = clientHeight;
        this.ctx.translate( this.width / 2 , this.height / 2 )
 
        this.redraw();
    }

    setProgress(progress) {
        this.progress = progress;
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