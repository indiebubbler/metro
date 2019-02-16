(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{155:function(e,t,a){"use strict";a.r(t);var n=a(1),r=a.n(n),s=a(8),l=a.n(s),i=(a(90),a(15)),c=a(19),o=a(16),u=a(13),p=a(17),m=(a(93),a(20)),h=a.n(m),f=function(e){function t(e){Object(i.a)(this,t);var a={C3:e.samples[0],"C#3":e.samples[1],D3:e.samples[2]};return Object(o.a)(this,Object(u.a)(t).call(this,a,{baseUrl:e.baseUrl||"./audio/"+e.key+"/"}))}return Object(p.a)(t,e),t}(m.Sampler),d={ACCENT_1:0,ACCENT_2:1,ACCENT_3:2},g=function(e){function t(e){var a;if(Object(i.a)(this,t),(a=Object(o.a)(this,Object(u.a)(t).call(this,e))).instrumentTypes={TABLA:"tabla",ELECTRO:"electro",SYNTH:"synth"},a.beatsPerStep=3,a.accentNotes=["C3","C#3","D3"],a.state={instrument:a.instrumentTypes.TABLA,isPlaying:!1},a.accents=[d.ACCENT_1],a.samples={},a.instruments={},a.part=null,a.setBpm=function(e){h.a.Transport.bpm.value=e},a.setBeatsPerStep=function(e){a.beatsPerStep=e,console.log("<SoundMachine>setBeatsPerStep",e),a.restart()},a.restart=function(){console.log("<SoundMachine>restart()");var e=a.instruments[a.state.instrument];a.part&&(console.log("clearing this.part"),a.part.stop(),a.part.removeAll(),a.part.dispose(),a.part=void 0);for(var t=[],n=0;n<a.beatsPerStep;n++)t.push(["0:"+n,a.accentNotes[d.ACCENT_2]]);console.log("new score ",t),a.part=new h.a.Part(function(t,a){e.triggerAttackRelease(a,"4n",t)},t),a.setAccents(a.accents),console.log("setting timeSignature",a.beatsPerStep),h.a.Transport.timeSignature=[a.beatsPerStep,4],a.part.loopEnd="1m",a.part.loop=!0,console.log("transpor was playing so play part"),a.part.start(0)},a.getBpm=function(){return h.a.Transport.bpm.value},!e.beatsPerStep)throw new Error("props.beatsPerStep is missing");return a.beatsPerStep=e.beatsPerStep,a}return Object(p.a)(t,e),Object(c.a)(t,[{key:"componentDidMount",value:function(){var e=this;(new h.a.Synth).toMaster().triggerAttackRelease("A2"),h.a.Buffer.on("load",function(){return e.restart()});var t=new f({key:"tabla",samples:["dha-slide.wav","dhin-slide.wav","tin.wav"]}).toMaster();this.instruments[this.instrumentTypes.TABLA]=t;var a=new f({key:"machine",samples:["Kick.wav","HiHat.wav","Snare.wav"]}).toMaster();this.instruments[this.instrumentTypes.ELECTRO]=a,h.a.context.latencyHint="playback"}},{key:"setInstrument",value:function(e){console.log("<SoundMachine>new instrument",e),this.setState({instrument:e},this.restart)}},{key:"setAccents",value:function(e){this.accents=e;for(var t=0;t<this.part.length;t++){var a=this.accentNotes[d.ACCENT_2];void 0!==e[t]&&e[t]==d.ACCENT_1?a=this.accentNotes[d.ACCENT_1]:void 0!==e[t]&&e[t]==d.ACCENT_3&&(a=this.accentNotes[d.ACCENT_3]),this.part.at("0:"+t,a)}}},{key:"render",value:function(){return r.a.createElement("div",null,"Sound is ",!0===this.state.isPlaying?"playing":"stopped")}},{key:"stop",value:function(){console.log("<SoundMachine>stop()"),this.setState({isPlaying:!1}),h.a.Transport.stop()}},{key:"start",value:function(){console.log("<SoundMachine>start()"),this.setState({isPlaying:!0}),h.a.Transport.start("+0.1"),this.restart()}}]),t}(n.Component),b=a(156),v=function(e){function t(){var e,a;Object(i.a)(this,t);for(var n=arguments.length,s=new Array(n),l=0;l<n;l++)s[l]=arguments[l];return(a=Object(o.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(s)))).state={currentStep:0,bars:[]},a.timer={ref:null,startTime:null},a.stepsCounter=0,a.planChanged=function(){console.log("<Planner>planChanged"),a.props.onChange&&a.props.onChange()},a.barRender=function(e){var t=a.state.currentStep===e.step?"current-step":"";return r.a.createElement("div",{className:t,key:"key_"+e.bpm},a.formatTime(e.segmentDuration.toFixed(0))," at ",e.bpm.toFixed(0))},a}return Object(p.a)(t,e),Object(c.a)(t,[{key:"setPlan",value:function(e){var t=this;console.log("<Planner>setPlan",e);for(var a=[],n=0;n<e.length;n++){var r={time:e[n].time,timeEnd:e[n].end,segmentDuration:e[n].end-e[n].time,startTimeFormatted:this.formatTime(e[n].start),endTimeFormatted:this.formatTime(e[n].end),bpm:e[n].bpm,step:this.stepsCounter++};a.push(r)}this.stepsCounter=0,this.setState(function(e){return{currentStep:0,bars:a}},function(){return t.planChanged()})}},{key:"stop",value:function(){this.timer&&this.disposeTimer(this.timer.ref),this.resetStep()}},{key:"disposeTimer",value:function(e){if(this.timer.ref!==e)throw new Error("Wront timer.ref to dispose");console.log("<Planner>clearing interval, ",this.timer.ref),clearInterval(this.timer.ref),this.timer.ref=void 0,this.timer.startTime=null,this.timer=void 0}},{key:"onInterval",value:function(){var e=this.state.currentStep;if(e+1>=this.state.bars.length)return console.log("no more steps, please stop()"),this.disposeTimer(this.timer.ref),void this.props.onAdvance(null);console.log("<Planner>onInterval",this.state.currentStep+1),this.setState({currentStep:e+1}),this.props.onAdvance(this.state.bars[this.state.currentStep])}},{key:"start",value:function(){console.log("<Planner>start()"),this.timer&&(clearInterval(this.timer.ref),this.timer.ref=void 0,this.timer.startTime=null,this.resetStep());var e=1e3*(this.state.bars[this.state.currentStep].timeEnd-this.state.bars[this.state.currentStep].time),t=this.onInterval.bind(this);console.log("setting interval",e),this.timer={ref:setInterval(t,e),startTime:new Date}}},{key:"clear",value:function(){this.stepsCounter=0,this.setState({bars:[],currentStep:0}),this.planChanged()}},{key:"resetStep",value:function(){this.setState({currentStep:0}),this.props.onAdvance(this.state.bars[0])}},{key:"getCurrentBar",value:function(){if(this.state.getCurrentStep>=this.state.bars.length)throw new Error("we are fcked");return this.state.bars[this.state.currentStep]}},{key:"render",value:function(){var e=this;return 0===this.state.bars.length?r.a.createElement("div",null,"No plan"):r.a.createElement(b.a,{className:"Planner"},r.a.createElement("div",null,this.state.bars.map(function(t){return e.barRender(t)})))}},{key:"padTime",value:function(e){return e<10?"0"+e:e}},{key:"formatTime",value:function(e){var t=new Date(0,0,0,0,0,0,0);t.setSeconds(e);var a=t.getMinutes(),n=(t.getSeconds(),"");return 0!=a&&(n+=t.getMinutes(),n+=":"),n+=this.padTime(t.getSeconds())+"s"}}]),t}(n.Component),E=(a(97),a(99),a(159)),C=a(160),y=a(154),S=a(164),k=a(161),P=a(163),T=a(162),A=a(47),O=a(46),w=a(157),N=function(e){function t(){return Object(i.a)(this,t),Object(o.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(p.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){return r.a.createElement("div",null,Object(A.a)(Object(u.a)(t.prototype),"render",this).call(this),r.a.createElement("div",null,r.a.createElement(w.a,{onClick:this.onBadgeClick,className:"d-i"},this.state.value)))}},{key:"onBadgeClick",value:function(){}}]),t}(O.b),B=function(e){function t(){return Object(i.a)(this,t),Object(o.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(p.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){return r.a.createElement("div",null,Object(A.a)(Object(u.a)(t.prototype),"render",this).call(this),r.a.createElement(w.a,{onClick:this.onBadgeClick,className:"d-i"},this.state.bounds[0]," - ",this.state.bounds[1]))}}]),t}(O.a),j=a(84),x=a(158),D=function(e){function t(e){var a;return Object(i.a)(this,t),(a=Object(o.a)(this,Object(u.a)(t).call(this,e))).state={bars:[]},a.accents=[d.ACCENT_1,d.ACCENT_2,d.ACCENT_3],a.renderCells=function(e){return e.map(function(e){return r.a.createElement(y.a,{size:"sm",color:a.getBtnColor(e.type),key:"barkey_"+e.idx,onClick:function(){return a.handleCellClick(e.idx)}},e.idx+1)})},a.state.bars=a.prepareBars(e.defaultValue),a.state.bars[0].type=d.ACCENT_1,a}return Object(p.a)(t,e),Object(c.a)(t,[{key:"prepareBars",value:function(e){for(var t=this.getValue(),a=[],n=0;n<e;n++)a.push({idx:n,type:void 0!==t[n]?t[n]:d.ACCENT_2});return a}},{key:"setBarsAmount",value:function(e){var t=this.prepareBars(e);this.setState({bars:Object(j.a)(t)},this.props.onAfterChange)}},{key:"handleCellClick",value:function(e){var t=this.state.bars[e].type,a=this.accents[(t+1)%3];this.state.bars[e].type=a,this.forceUpdate()}},{key:"getValue",value:function(){for(var e=[],t=0;t<this.state.bars.length;t++)e.push(this.state.bars[t].type);return e}},{key:"getBtnColor",value:function(e){var t;switch(e){case d.ACCENT_2:t="secondary";break;case d.ACCENT_3:t="warning";break;default:t="primary"}return t}},{key:"render",value:function(){var e=this.props.onAfterChange;return r.a.createElement(x.a,{onClick:e},this.renderCells(this.state.bars))}}]),t}(n.Component),M="tabla",R="electro",_=function(e){function t(){var e,a;Object(i.a)(this,t);for(var n=arguments.length,r=new Array(n),s=0;s<n;s++)r[s]=arguments[s];return(a=Object(o.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(r)))).timer={timerRef:null,startTime:null},a.cycleLockType={SEGMENT:"segment",STEP:"step"},a.state={bpmRange:[200,400],exerciseDuration:60,totalSteps:10,beatsPerStep:4,currentBpm:60,instrument:"tabla",constantMode:a.cycleLockType.STEP,instrumentDropdownOpen:!1,cycleDropdownOpen:!1},a.totalStepsChanged=function(){var e=a.getUiState();e.totalSteps!==a.state.totalSteps&&a.refs.planner.setPlan(a.makePlan(e))},a.onBeatsPerStepChange=function(){var e=a.getUiState();if(e.beatsPerStep!==a.refs.sm.beatsPerStep)return a.refs.barManager.setBarsAmount(e.beatsPerStep),void a.refs.sm.setBeatsPerStep(e.beatsPerStep)},a.exerciseDurationChanged=function(){var e=a.makePlan(a.getUiState());a.refs.planner.setPlan(e)},a.onPlanAdvanced=function(e){e?(console.log("<App>plan advanced, setting new bpm",e.bpm),a.setBpm(e.bpm)):(a.refs.planner.stop(),a.refs.sm.stop())},a.setBpm=function(e){a.setState({currentBpm:e}),a.refs.sm.setBpm(e)},a.onPlanChanged=function(){console.log("<App>onPlanChanged");var e=a.refs.planner.getCurrentBar();console.log("<App>currentBar",e),console.log("<App>isPlaying?",a.refs.sm.state.isPlaying),e&&a.setBpm(e.bpm),a.refs.sm.state.isPlaying&&a.refs.planner.start()},a.handleStartStop=function(){console.log("<App>handleStartStop, isPlaying=",a.refs.sm.state.isPlaying),!0===a.refs.sm.state.isPlaying?(a.refs.planner.stop(),a.refs.sm.stop()):(a.refs.planner.start(),a.refs.sm.start())},a}return Object(p.a)(t,e),Object(c.a)(t,[{key:"componentDidMount",value:function(){this.refs.planner.setPlan(this.makePlan(this.getUiState()))}},{key:"onInstrumentSelect",value:function(e){this.refs.sm.setInstrument(e),this.setState({instrument:e})}},{key:"onCycleSelect",value:function(e){this.setState({constantMode:e})}},{key:"renderCyclePane",value:function(){var e=this;return r.a.createElement(b.a,{className:"pane"},r.a.createElement(E.a,{className:"pane-title"},"CYCLE"),r.a.createElement(E.a,null,r.a.createElement(C.a,{xs:"3"},"Constant"),r.a.createElement(C.a,null,r.a.createElement(S.a,{isOpen:this.state.cycleDropdownOpen,toggle:function(){return e.onCycleLockChange()}},r.a.createElement(k.a,{caret:!0},this.state.constantMode),r.a.createElement(P.a,null,r.a.createElement(T.a,{onClick:function(){e.onCycleSelect(e.cycleLockType.SEGMENT)}},"Time"),r.a.createElement(T.a,{onClick:function(){e.onCycleSelect(e.cycleLockType.STEP)}},"Step"))))),r.a.createElement(E.a,null,r.a.createElement(C.a,{xs:3},"Total time (min)"),r.a.createElement(C.a,null,r.a.createElement(N,{ref:"exerciseDuration",min:1,max:30,defaultValue:this.state.exerciseDuration/60,onAfterChange:function(){return e.exerciseDurationChanged()}}))),r.a.createElement(E.a,null,r.a.createElement(C.a,{xs:3},"Beats per step"),r.a.createElement(C.a,null,r.a.createElement(N,{ref:"beatsPerStep",min:2,max:16,defaultValue:this.state.beatsPerStep,onAfterChange:function(){return e.onBeatsPerStepChange()}}))),r.a.createElement(E.a,null,r.a.createElement(C.a,{xs:3},"Number of steps"),r.a.createElement(C.a,null,r.a.createElement(N,{ref:"totalSteps",min:1,max:60,defaultValue:this.state.totalSteps,onAfterChange:function(){return e.totalStepsChanged()}}))),r.a.createElement(E.a,null,r.a.createElement(C.a,{xs:3},"Accents"),r.a.createElement(C.a,null,r.a.createElement(D,{onAfterChange:function(){return e.onAccentsChange()},ref:"barManager",defaultValue:this.state.beatsPerStep}))))}},{key:"renderTempoPane",value:function(){var e=this;return r.a.createElement(b.a,{className:"pane"},r.a.createElement(E.a,{className:"pane-title"},"TEMPO"),r.a.createElement(E.a,null,r.a.createElement(C.a,{xs:"3"},"BPM"),r.a.createElement(C.a,null,r.a.createElement(B,{ref:"bpmRange",min:30,max:600,defaultValue:[this.state.bpmRange[0],this.state.bpmRange[1]],pushable:!0,onAfterChange:function(){return e.onBpmRangeChange()}}))))}},{key:"renderPlaybackPane",value:function(){var e=this;return r.a.createElement(b.a,{className:"pane"},r.a.createElement(E.a,{className:"pane-title"},"PLAYBACK"),r.a.createElement(E.a,null,r.a.createElement(C.a,{xs:"3"},"Instrument"),r.a.createElement(C.a,null,r.a.createElement(S.a,{isOpen:this.state.instrumentDropdownOpen,toggle:function(){return e.onInstrumentChange()}},r.a.createElement(k.a,{caret:!0},this.state.instrument),r.a.createElement(P.a,null,r.a.createElement(T.a,{onClick:function(){e.onInstrumentSelect(M)}},"Tabla"),r.a.createElement(T.a,{onClick:function(){e.onInstrumentSelect(R)}},"Electro"))))),r.a.createElement(E.a,null,r.a.createElement(C.a,{xs:"3"},"Playback"),r.a.createElement(C.a,null,"One Time/LoopBack/Repeat")))}},{key:"renderLeftPane",value:function(){return r.a.createElement(b.a,{className:"side-panel"},r.a.createElement(E.a,null,r.a.createElement(C.a,null,this.renderTempoPane())),r.a.createElement(E.a,null,r.a.createElement(C.a,null,this.renderPlaybackPane())),r.a.createElement(E.a,null,r.a.createElement(C.a,null,this.renderCyclePane())))}},{key:"renderExamplesPane",value:function(){return r.a.createElement(b.a,{className:"pane"},r.a.createElement(E.a,{className:"pane-title"},"EXAMPLES"),r.a.createElement(E.a,null,"Not implemented"))}},{key:"renderPlanPane",value:function(){var e=this;return r.a.createElement(b.a,{className:"pane"},r.a.createElement(E.a,{className:"pane-title"},"Plan"),r.a.createElement(E.a,null,r.a.createElement(v,{constantMode:this.state.constantMode,onChange:function(){return e.onPlanChanged()},onAdvance:function(t){return e.onPlanAdvanced(t)},ref:"planner"})))}},{key:"renderRightPane",value:function(){return r.a.createElement(b.a,{className:"side-panel"},r.a.createElement(E.a,null,r.a.createElement(C.a,null,r.a.createElement(b.a,{className:"pane"},r.a.createElement(E.a,{className:"pane-title"},"BPM"),r.a.createElement(E.a,null,r.a.createElement(C.a,null," ",this.state.currentBpm.toFixed(0)))))),r.a.createElement(E.a,null,r.a.createElement(C.a,null,this.renderPlanPane())))}},{key:"render",value:function(){var e=this;return r.a.createElement("div",{className:"App"},r.a.createElement(g,{ref:"sm",beatsPerStep:this.state.beatsPerStep}),r.a.createElement(b.a,null,r.a.createElement(E.a,null,r.a.createElement(C.a,null,this.renderLeftPane()),r.a.createElement(C.a,{sm:"4"},this.renderRightPane())),r.a.createElement(E.a,null,r.a.createElement(C.a,{ld:8},r.a.createElement(y.a,{onClick:function(){return e.handleStartStop()}},"Start / Stop")))))}},{key:"onBpmRangeChange",value:function(){var e=this.getUiState();e.bpmRange[0]===this.state.bpmRange[0]&&e.bpmRange[1]===this.state.bpmRange[1]||(console.log("bpm range changed"),console.log(e,this.state),this.setState({bpmRange:e.bpmRange}),this.refs.planner.setPlan(this.makePlan(e)))}},{key:"onInstrumentChange",value:function(){this.setState(function(e){return{instrumentDropdownOpen:!e.instrumentDropdownOpen}})}},{key:"onCycleLockChange",value:function(){this.setState(function(e){return{cycleDropdownOpen:!e.cycleDropdownOpen}})}},{key:"getUiState",value:function(){return{bpmRange:this.refs.bpmRange.getValue(),exerciseDuration:this.refs.exerciseDuration.getValue(),totalSteps:this.refs.totalSteps.getValue(),beatsPerStep:this.refs.beatsPerStep.getValue()}}},{key:"onAccentsChange",value:function(){var e=this.refs.barManager.getValue();this.refs.sm.setAccents(e)}},{key:"makePlan",value:function(e){var t=e.bpmRange[0],a=(e.bpmRange[1]-t)/e.totalSteps,n=60*e.exerciseDuration/(e.totalSteps+1);console.log("<App>makePlan, excerciseDuration:",e.exerciseDuration);for(var r=[],s=0;s<=e.totalSteps;s++)r.push({time:s*n,start:s*n,end:s*n+n,bpm:t+s*a});return r}}]),t}(n.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));l.a.render(r.a.createElement(_,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},85:function(e,t,a){e.exports=a(155)},90:function(e,t,a){},93:function(e,t,a){}},[[85,2,1]]]);
//# sourceMappingURL=main.796f39db.chunk.js.map