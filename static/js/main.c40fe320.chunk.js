(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{162:function(e,t,a){"use strict";a.r(t);var r=a(1),n=a.n(r),s=a(8),i=a.n(s),c=(a(92),a(16)),l=a(17),u=a(19),o=a(12),m=a(18),p=(a(94),a(29)),h=a(10),f=a.n(h),g=function(e){function t(){var e,a;Object(c.a)(this,t);for(var r=arguments.length,n=new Array(r),s=0;s<r;s++)n[s]=arguments[s];return(a=Object(u.a)(this,(e=Object(o.a)(t)).call.apply(e,[this].concat(n)))).instrumentTypes={TABLA:"tabla",ELECTRO:"electro",SYNTH:"synth"},a.state={instrument:a.instrumentTypes.TABLA,measuresPerBar:3},a.samples={},a.instruments={},a.accents=[0],a.setBpm=function(e){f.a.Transport.bpm.value=e},a.setMeasuresPerBar=function(e){a.setState({measuresPerBar:e}),a.setTransport()},a.setTransport=function(){var e=f.a.Transport.state;console.log("transportState",e),f.a.Transport.stop(),f.a.Transport.cancel();var t=a.instruments[a.state.instrument].accentFunc.bind(Object(p.a)(Object(p.a)(a))),r=a.instruments[a.state.instrument].tickFunc.bind(Object(p.a)(Object(p.a)(a)));if(console.log("scheduling new pattern with ",a.state.measuresPerBar,"ticks per bar"),a.state.instrument===a.instrumentTypes.SYNTH)throw new Error("not implemented");for(var n=0;n<a.state.measuresPerBar;n++)a.accents.indexOf(n)>=0?f.a.Transport.schedule(t,f.a.Time("0:"+n)):f.a.Transport.schedule(r,f.a.Time("0:"+n));f.a.Transport.timeSignature=[a.state.measuresPerBar,4],f.a.Transport.loop=!0,f.a.Transport.loopEnd="1m","started"===e&&f.a.Transport.start()},a.getBpm=function(){return f.a.Transport.bpm.value},a}return Object(m.a)(t,e),Object(l.a)(t,[{key:"componentDidMount",value:function(){(new f.a.Synth).toMaster().triggerAttackRelease("A2"),f.a.Buffer.on("load",this.setTransport),this.tablaSampler=new f.a.Sampler({C3:"Tha.wav",C4:"Tin.wav"},{baseUrl:"./audio/",release:1}).toMaster(),this.instruments[this.instrumentTypes.TABLA]=this.tablaSampler,this.instruments[this.instrumentTypes.TABLA].accentFunc=function(){this.tablaSampler.triggerAttack("C3")},this.instruments[this.instrumentTypes.TABLA].tickFunc=function(){this.tablaSampler.triggerAttack("C4")},this.electricSampler=new f.a.Sampler({C3:"electronicKick.mp3",C4:"electronicHat.wav"},{baseUrl:"./audio/",release:.1}).toMaster(),this.instruments[this.instrumentTypes.ELECTRO]=this.electricSampler,this.instruments[this.instrumentTypes.ELECTRO].accentFunc=function(){this.electricSampler.triggerAttack("C4")},this.instruments[this.instrumentTypes.ELECTRO].tickFunc=function(){this.electricSampler.triggerAttack("C3")},f.a.context.latencyHint="fastest",console.log("Sound machine mounted")}},{key:"setAccents",value:function(e){this.accents=e,this.setTransport()}},{key:"render",value:function(){return n.a.createElement("div",null,"Sound is ",this.state.isPlaying)}},{key:"toggle",value:function(){f.a.Transport.toggle()}}]),t}(r.Component),b=a(37),d=a(168),v=function(e){function t(){var e,a;Object(c.a)(this,t);for(var r=arguments.length,s=new Array(r),i=0;i<r;i++)s[i]=arguments[i];return(a=Object(u.a)(this,(e=Object(o.a)(t)).call.apply(e,[this].concat(s)))).state={currentStep:0,bars:[]},a.stepsCounter=0,a.barRender=function(e){var t="badge badge-pill badge-"+(a.state.currentStep===e.step?"primary":"secondary");return n.a.createElement("div",{className:t,key:"key_"+e.bpm},e.formattedTime," -- ",e.bpm.toFixed(2))},a}return Object(m.a)(t,e),Object(l.a)(t,[{key:"addBar",value:function(e,t){var a={time:e,formattedTime:this.formatTime(e),bpm:t,step:this.stepsCounter++};this.setState(function(e){return{bars:[].concat(Object(b.a)(e.bars),[a])}})}},{key:"clear",value:function(){this.stepsCounter=0,this.setState({bars:[],currentStep:0})}},{key:"advanceStep",value:function(){var e=this.state.currentStep;return e+1>=this.state.bars.length?null:(this.setState({currentStep:e+1}),this.state.currentStep)}},{key:"getCurrentBar",value:function(){if(this.state.getCurrentStep>=this.state.bars.length)throw new Error("we are fcked");return this.state.bars[this.state.currentStep]}},{key:"padTime",value:function(e){return e<10?"0"+e:e}},{key:"formatTime",value:function(e){var t=new Date(0,0,0,0,0,0,0);return t.setSeconds(e),this.padTime(t.getMinutes())+":"+this.padTime(t.getSeconds())}},{key:"render",value:function(){var e=this;return 0===this.state.bars.length?n.a.createElement(d.a,{variant:"warning"},"No plan"):n.a.createElement(d.a,{variant:"success"},n.a.createElement("p",{style:{fontFamily:"courier",fontSize:"0.5rem"}},n.a.createElement("code",null,this.state.bars.map(function(t){return e.barRender(t)}))))}}]),t}(r.Component),B=(a(105),a(107),a(169)),E=a(165),y=a(166),T=a(167),k=a(163),S=a(46),C=a(45),O=function(e){function t(){return Object(c.a)(this,t),Object(u.a)(this,Object(o.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){return n.a.createElement("div",null,Object(S.a)(Object(o.a)(t.prototype),"render",this).call(this),n.a.createElement("div",null,n.a.createElement(k.a,{ref:"valueBadge",onClick:this.onBadgeClick,className:"d-i"},this.state.value)))}},{key:"onBadgeClick",value:function(){}}]),t}(C.b),j=function(e){function t(){return Object(c.a)(this,t),Object(u.a)(this,Object(o.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){return n.a.createElement("div",null,Object(S.a)(Object(o.a)(t.prototype),"render",this).call(this),n.a.createElement(k.a,{onClick:this.onBadgeClick,className:"d-i"},this.state.bounds[0]," - ",this.state.bounds[1]))}}]),t}(C.a),A=a(164),w=function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(u.a)(this,Object(o.a)(t).call(this,e))).state={bars:[],accentBars:[]},a.renderCells=function(e){return e.map(function(e){return n.a.createElement(B.a,{color:"primary",onClick:function(){return a.handleCellClick(e)},active:a.state.accentBars.includes(e)},"X")})},a.state.bars=a.prepareBars(e.defaultValue),a}return Object(m.a)(t,e),Object(l.a)(t,[{key:"prepareBars",value:function(e){for(var t=[],a=0;a<e;a++)t.push(a);return t}},{key:"setBarsAmount",value:function(e){var t=this.prepareBars(e);this.setState({bars:Object(b.a)(t)})}},{key:"handleCellClick",value:function(e){var t=this.state.accentBars.indexOf(e);t<0?this.state.accentBars.push(e):this.state.accentBars.splice(t,1),this.setState({accentBars:Object(b.a)(this.state.accentBars)})}},{key:"getAccentBars",value:function(){return this.state.accentBars}},{key:"render",value:function(){var e=this.props.onAfterChange;return n.a.createElement(A.a,{onClick:e},this.renderCells(this.state.bars))}}]),t}(r.Component),x=function(e){function t(){var e,a;Object(c.a)(this,t);for(var r=arguments.length,n=new Array(r),s=0;s<r;s++)n[s]=arguments[s];return(a=Object(u.a)(this,(e=Object(o.a)(t)).call.apply(e,[this].concat(n)))).lockType={SEGMENT:"segment",STEP:"step"},a.uiElements={segmentDuration:"segment_duration",exerciseDuration:"exercise_duration",totalBars:"total_bars"},a.state={bpmRange:[100,300],exerciseDuration:120,segmentDuration:5,totalBars:24,measuresPerBar:3,currentBpm:100,lockTo:a.lockType.SEGMENT},a.timers=[],a.handleStartStop=function(){a.refs.sm.toggle()},a.setNewSpeed=function(){var e=a.refs.planner;if(e.advanceStep()){var t=e.getCurrentBar().bpm;a.setState({currentBpm:t}),a.refs.sm.setBpm(t)}else clearTimeout(a.timers.pop())},a}return Object(m.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){var e=this;return n.a.createElement("div",{className:"App"},n.a.createElement(g,{ref:"sm"}),n.a.createElement(B.a,{onClick:function(){return e.handleStartStop()}}," Start / Stop "),n.a.createElement(E.a,null,n.a.createElement(y.a,null,n.a.createElement(T.a,null,n.a.createElement(E.a,null,n.a.createElement(y.a,{className:"p-2"},n.a.createElement(T.a,{xs:5,className:"badge badge-primary "},"BPM Range"),n.a.createElement(T.a,null,n.a.createElement(j,{ref:"bpmRange",min:30,max:400,defaultValue:[this.state.bpmRange[0],this.state.bpmRange[1]],pushable:!0,onAfterChange:function(){return e.settingsChanged()}}))),n.a.createElement(y.a,{className:"p-2"},n.a.createElement(T.a,{xs:5,className:"badge badge-primary"},"Segment Duration (s)"),n.a.createElement(T.a,null,n.a.createElement(O,{ref:"segmentDuration",min:1,max:120,defaultValue:this.state.segmentDuration,onAfterChange:function(){return e.settingsChanged(e.uiElements.segmentDuration)}}))),n.a.createElement(y.a,{className:"p-2"},n.a.createElement(T.a,{xs:5,className:"badge badge-primary"},"Total time (min)"),n.a.createElement(T.a,null,n.a.createElement(O,{ref:"exerciseDuration",min:1,max:30,defaultValue:this.state.exerciseDuration/60,onAfterChange:function(){return e.settingsChanged(e.uiElements.exerciseDuration)}}))),n.a.createElement(y.a,{className:"p-2"},n.a.createElement(T.a,{xs:5,className:"badge badge-primary"},"Bars"),n.a.createElement(T.a,null,n.a.createElement(O,{ref:"totalBars",min:1,max:50,defaultValue:this.state.totalBars,onAfterChange:function(){return e.settingsChanged(e.uiElements.totalBars)}}))),n.a.createElement(y.a,{className:"p-2"},n.a.createElement(T.a,{xs:5,className:"badge badge-primary"},"Measures per Bar"),n.a.createElement(T.a,null,n.a.createElement(O,{ref:"measuresPerBar",min:2,max:16,defaultValue:this.state.measuresPerBar,onAfterChange:function(){return e.settingsChanged()}}))),n.a.createElement(y.a,{className:"p-2"},n.a.createElement(T.a,{xs:5,className:"badge badge-primary"},"Bar Manager"),n.a.createElement(T.a,null,n.a.createElement(w,{onAfterChange:function(){return e.settingsChanged("barManager")},ref:"barManager",defaultValue:this.state.measuresPerBar}))))),n.a.createElement(T.a,{xs:3},n.a.createElement(k.a,{color:"info"},"Current BPM: ",n.a.createElement("span",{ref:"currentBpmBadge"},this.state.currentBpm.toFixed(0))),n.a.createElement(v,{lockTo:this.state.lockTo,ref:"planner"})))))}},{key:"getUiState",value:function(){return{currentBpm:this.refs.sm.getBpm(),bpmRange:this.refs.bpmRange.getValue(),segmentDuration:this.refs.segmentDuration.getValue(),exerciseDuration:this.refs.exerciseDuration.getValue(),totalBars:this.refs.totalBars.getValue(),measuresPerBar:this.refs.measuresPerBar.getValue()}}},{key:"settingsChanged",value:function(e){var t=this.getUiState(),a=t.segmentDuration,r=60*t.exerciseDuration,n=t.totalBars,s=t.measuresPerBar;e===this.uiElements.segmentDuration&&(n=Math.floor(60*t.exerciseDuration/t.segmentDuration),this.refs.totalBars.setState({value:n})),e!==this.uiElements.totalBars&&e!==this.uiElements.exerciseDuration||(a=Math.floor(60*t.exerciseDuration/t.totalBars),this.refs.segmentDuration.setState({value:a}));var i=t.bpmRange[0],c=(t.bpmRange[1]-i)/n,l=this.refs.planner;l.clear();for(var u=0;u<=n;u++)l.addBar(u*a,i+u*c);for(;this.timers.length>0;)clearInterval(this.timers.pop());var o=this.setNewSpeed.bind(this);this.timers.push(setInterval(o,1e3*this.state.segmentDuration)),this.setState({currentBpm:t.bpmRange[0],bpmRange:t.bpmRange,exerciseDuration:r,segmentDuration:a,totalBars:n,measuresPerBar:s}),this.refs.sm.setMeasuresPerBar(s),this.refs.sm.setBpm(t.bpmRange[0]),this.refs.barManager.setBarsAmount(s);var m=this.refs.barManager.getAccentBars();this.refs.sm.setAccents(m)}}]),t}(r.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(n.a.createElement(x,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},87:function(e,t,a){e.exports=a(162)},92:function(e,t,a){},94:function(e,t,a){}},[[87,2,1]]]);
//# sourceMappingURL=main.c40fe320.chunk.js.map